import { EventType } from "@tanstack/ai/client"
import type { StreamChunk } from "@tanstack/ai/client"
import type { ConnectConnectionAdapter } from "@tanstack/ai-react"
import {
  answerSchema,
  createPayload,
  GuideError,
  REQUEST_TIMEOUT_MS,
  RESPONSE_BYTES,
  sleepingSchema,
} from "./protocol.ts"
import type { GuideSession } from "./session.ts"

export async function readResponse(response: Response) {
  const length = Number(response.headers.get("content-length"))
  if (length > RESPONSE_BYTES || !response.body) {
    await response.body?.cancel()
    throw new GuideError("response")
  }
  const reader = response.body.getReader()
  const chunks: Uint8Array[] = []
  let bytes = 0
  try {
    for (;;) {
      const { done, value } = await reader.read()
      if (done) break
      bytes += value.byteLength
      if (bytes > RESPONSE_BYTES) throw new GuideError("response")
      chunks.push(value)
    }
    const buffer = new Uint8Array(bytes)
    let offset = 0
    for (const chunk of chunks) {
      buffer.set(chunk, offset)
      offset += chunk.byteLength
    }
    return JSON.parse(
      new TextDecoder("utf-8", { fatal: true }).decode(buffer)
    ) as unknown
  } catch (error) {
    await reader.cancel()
    if (error instanceof GuideError) throw error
    throw new GuideError("response")
  } finally {
    reader.releaseLock()
  }
}

export function createGuideTransport(
  endpoint: string,
  session: GuideSession,
  getWelcome: () => string,
  fetcher: typeof fetch = fetch
): ConnectConnectionAdapter {
  return {
    async *connect(
      messages,
      _data,
      abortSignal,
      context
    ): AsyncGenerator<StreamChunk> {
      const operation = session.current()
      const controller = new AbortController()
      function abort() {
        controller.abort()
      }
      const timeout = setTimeout(
        () => controller.abort("timeout"),
        REQUEST_TIMEOUT_MS
      )
      abortSignal?.addEventListener("abort", abort, { once: true })
      if (abortSignal?.aborted) abort()
      try {
        const payload = createPayload(
          messages,
          session.getSnapshot().receipts,
          getWelcome()
        )
        const response = await fetcher(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
          credentials: "omit",
          redirect: "error",
          signal: controller.signal,
        })
        const body: unknown = await readResponse(response)
        if (controller.signal.aborted || !session.isCurrent(operation)) return
        if (response.status === 503) {
          const sleeping = sleepingSchema.safeParse(body)
          if (sleeping.success) {
            session.sleep(operation, sleeping.data)
            return
          }
          throw new GuideError("unavailable")
        }
        if (!response.ok) throw new GuideError("unavailable")
        const answer = answerSchema.safeParse(body)
        if (!answer.success) throw new GuideError("response")
        const messageId = crypto.randomUUID()
        const threadId = context?.threadId ?? "portfolio-guide"
        const runId = context?.runId ?? crypto.randomUUID()
        session.receive(operation, messageId, answer.data)
        yield { type: EventType.RUN_STARTED, threadId, runId }
        yield {
          type: EventType.TEXT_MESSAGE_START,
          messageId,
          role: "assistant",
        }
        yield {
          type: EventType.TEXT_MESSAGE_CONTENT,
          messageId,
          delta: answer.data.answer,
        }
        yield { type: EventType.TEXT_MESSAGE_END, messageId }
        yield {
          type: EventType.RUN_FINISHED,
          threadId,
          runId,
          finishReason: "stop",
        }
      } catch (error) {
        const timedOut = controller.signal.reason === "timeout"
        if (
          !session.isCurrent(operation) ||
          (controller.signal.aborted && !timedOut)
        )
          return
        let failure = new GuideError("network")
        if (timedOut) failure = new GuideError("timeout")
        else if (error instanceof GuideError) failure = error
        session.fail(operation, failure.code)
        throw failure
      } finally {
        clearTimeout(timeout)
        abortSignal?.removeEventListener("abort", abort)
      }
    },
  }
}
