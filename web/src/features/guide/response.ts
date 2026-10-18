import { createParser } from "eventsource-parser"
import type { EventSourceMessage } from "eventsource-parser"
import {
  answerSchema,
  GuideError,
  RESPONSE_BYTES,
  sleepingSchema,
  STREAM_RESPONSE_BYTES,
  streamDeltaSchema,
  streamErrorSchema,
} from "./protocol.ts"
import type { GuideAnswer, Sleeping } from "./protocol.ts"

type GuideEvent =
  | { type: "delta"; delta: string }
  | { type: "result"; answer: GuideAnswer }
  | { type: "sleeping"; sleeping: Sleeping }

async function* readBytes(
  response: Response,
  limit: number,
  signal?: AbortSignal
) {
  if (
    Number(response.headers.get("content-length")) > limit ||
    !response.body
  ) {
    await response.body?.cancel()
    throw new GuideError("response")
  }
  const reader = response.body.getReader()
  let bytes = 0
  let ended = false
  let rejectAbort: (reason: unknown) => void = () => {}
  const aborted = new Promise<never>((_resolve, reject) => {
    rejectAbort = reject
  })
  function abort() {
    rejectAbort(signal?.reason)
  }
  signal?.addEventListener("abort", abort, { once: true })
  try {
    for (;;) {
      signal?.throwIfAborted()
      const { done, value } = await Promise.race([reader.read(), aborted])
      if (done) {
        ended = true
        break
      }
      bytes += value.byteLength
      if (bytes > limit) throw new GuideError("response")
      yield value
    }
  } finally {
    signal?.removeEventListener("abort", abort)
    try {
      if (!ended) await reader.cancel()
    } finally {
      reader.releaseLock()
    }
  }
}

export async function readResponse(response: Response, signal?: AbortSignal) {
  const decoder = new TextDecoder("utf-8", { fatal: true })
  let text = ""
  try {
    for await (const chunk of readBytes(response, RESPONSE_BYTES, signal)) {
      text += decoder.decode(chunk, { stream: true })
    }
    text += decoder.decode()
    const body: unknown = JSON.parse(text)
    return body
  } catch (error) {
    if (error instanceof GuideError || signal?.aborted) throw error
    throw new GuideError("response")
  }
}

function parseEvent(event: EventSourceMessage): GuideEvent {
  const body: unknown = JSON.parse(event.data)
  switch (event.event) {
    case "delta":
      return { type: "delta", ...streamDeltaSchema.parse(body) }
    case "result":
      return { type: "result", answer: answerSchema.parse(body) }
    case "sleeping":
      return { type: "sleeping", sleeping: sleepingSchema.parse(body) }
    case "error":
      throw new GuideError(streamErrorSchema.parse(body).code)
    default:
      throw new GuideError("response")
  }
}

export async function* readStream(
  response: Response,
  signal: AbortSignal
): AsyncGenerator<GuideEvent> {
  const queue: GuideEvent[] = []
  const state: { terminal: GuideEvent | null } = { terminal: null }
  const decoder = new TextDecoder("utf-8", { fatal: true })
  const parser = createParser({
    maxBufferSize: RESPONSE_BYTES,
    onEvent(event) {
      if (state.terminal) throw new GuideError("response")
      const parsed = parseEvent(event)
      if (parsed.type === "delta") queue.push(parsed)
      else state.terminal = parsed
    },
    onError() {
      throw new GuideError("response")
    },
  })
  try {
    for await (const chunk of readBytes(
      response,
      STREAM_RESPONSE_BYTES,
      signal
    )) {
      parser.feed(decoder.decode(chunk, { stream: true }))
      while (queue.length > 0) {
        const event = queue.shift()
        if (event) yield event
      }
    }
    parser.feed(decoder.decode())
    parser.reset({ consume: true })
    if (!state.terminal) throw new GuideError("response")
    // Only a completely closed stream can acknowledge a finished answer.
    yield state.terminal
  } catch (error) {
    if (error instanceof GuideError || signal.aborted) throw error
    throw new GuideError("response")
  }
}
