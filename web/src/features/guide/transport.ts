import { EventType } from "@tanstack/ai/client"
import type { StreamChunk } from "@tanstack/ai/client"
import type { ConnectConnectionAdapter } from "@tanstack/ai-react"
import {
  answerSchema,
  createPayload,
  GuideError,
  REQUEST_TIMEOUT_MS,
  sleepingSchema,
} from "./protocol.ts"
import type { GuideSession } from "./session.ts"
import { readResponse, readStream } from "./response.ts"

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
          headers: {
            "Content-Type": "application/json",
            Accept: "text/event-stream",
          },
          body: JSON.stringify(payload),
          credentials: "omit",
          redirect: "error",
          signal: controller.signal,
        })
        const messageId = crypto.randomUUID()
        const threadId = context?.threadId ?? "portfolio-guide"
        const runId = context?.runId ?? crypto.randomUUID()
        const streamed =
          response.ok &&
          response.headers.get("content-type")?.split(";", 1)[0].trim() ===
            "text/event-stream"
        if (streamed) {
          let raw = ""
          let displayed = ""
          let started = false
          for await (const event of readStream(response, controller.signal)) {
            if (controller.signal.aborted || !session.isCurrent(operation))
              return
            if (event.type === "sleeping") {
              session.sleep(operation, event.sleeping)
              return
            }
            if (event.type === "delta") raw += event.delta
            else {
              if (raw && raw.trim() !== event.answer.answer)
                throw new GuideError("response")
              raw = event.answer.answer
            }
            // Match the validated answer's trim without losing whitespace
            // between tokens, or publishing a final replacement/flicker.
            const text = raw.trim()
            const delta = text.slice(displayed.length)
            if (delta) {
              if (!started) {
                session.stream(operation, messageId)
                started = true
                yield { type: EventType.RUN_STARTED, threadId, runId }
                yield {
                  type: EventType.TEXT_MESSAGE_START,
                  messageId,
                  role: "assistant",
                }
              }
              yield {
                type: EventType.TEXT_MESSAGE_CONTENT,
                messageId,
                delta,
              }
              displayed = text
            }
            if (event.type === "result")
              session.receive(operation, messageId, event.answer, true)
          }
        } else {
          const body: unknown = await readResponse(response, controller.signal)
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
