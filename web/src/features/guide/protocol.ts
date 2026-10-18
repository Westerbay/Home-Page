import { z } from "zod"

export const QUESTION_LIMIT = 1500
export const REQUEST_BYTES = 16_384
export const RESPONSE_BYTES = 65_536
// SSE includes event framing and repeats the answer in its final receipt.
export const STREAM_RESPONSE_BYTES = 262_144
export const REQUEST_TIMEOUT_MS = 30_000
export const SNAPSHOT_BYTES = 262_144
const HISTORY_CHARACTER_LIMIT = 2000

export const messageSchema = z.object({
  id: z.string().min(1).max(200),
  role: z.enum(["user", "assistant"]),
  parts: z
    .array(z.object({ type: z.literal("text"), content: z.string() }))
    .max(1),
})
export type GuideMessage = z.infer<typeof messageSchema>
export const citationSchema = z
  .object({
    chunk_id: z.string().min(1).max(500),
    path: z.string().min(1).max(500),
    line_start: z.number().int().positive(),
    line_end: z.number().int().positive(),
  })
  .refine((value) => value.line_end >= value.line_start)
export type Citation = z.infer<typeof citationSchema>
export const receiptSchema = z
  .object({
    status: z.enum(["answered", "insufficient_context", "out_of_scope"]),
    citations: z.array(citationSchema),
  })
  .refine((value) =>
    value.status === "answered"
      ? value.citations.length > 0
      : value.citations.length === 0
  )
export const answerSchema = receiptSchema.safeExtend({
  answer: z.string().trim().min(1),
})
export type GuideAnswer = z.infer<typeof answerSchema>
export type Receipt = z.infer<typeof receiptSchema>
export const sleepingSchema = z.object({
  status: z.literal("sleeping"),
  service: z.enum(["workers_ai", "d1", "vectorize"]),
  reason: z.enum(["quota_exhausted", "service_unavailable"]),
  retry_at: z.iso.datetime(),
  reset_at: z.iso.datetime().optional(),
})
export type Sleeping = z.infer<typeof sleepingSchema>
export const streamDeltaSchema = z.object({ delta: z.string().min(1) })
export const streamErrorSchema = z.object({
  code: z.enum(["response", "unavailable"]),
})
export type GuideErrorCode =
  | "question"
  | "payload"
  | "network"
  | "timeout"
  | "response"
  | "unavailable"
  | "interrupted"

export class GuideError extends Error {
  code: GuideErrorCode
  constructor(code: GuideErrorCode) {
    super(code)
    this.name = "GuideError"
    this.code = code
  }
}

export function textOf(message: {
  parts: Array<{ type: string; content?: unknown }>
}) {
  return message.parts
    .filter((part) => part.type === "text" && typeof part.content === "string")
    .map((part) => part.content)
    .join("")
}

export function createPayload(
  messages: unknown,
  receipts: Record<string, Receipt | undefined>,
  welcome: string
) {
  const parsed = z.array(messageSchema).parse(messages)
  const current = parsed.at(-1)
  if (!current || current.role !== "user") throw new GuideError("question")
  const message = textOf(current)
  if (!message.trim() || message.length > QUESTION_LIMIT)
    throw new GuideError("question")
  const pairs: Array<Array<{ role: "user" | "assistant"; content: string }>> =
    []
  for (let i = 0; i < parsed.length - 2; i++) {
    const user = parsed[i]
    const assistant = parsed[i + 1]
    if (
      user.role === "user" &&
      assistant.role === "assistant" &&
      Object.hasOwn(receipts, assistant.id) &&
      receipts[assistant.id]
    ) {
      pairs.push([
        { role: "user", content: textOf(user) },
        { role: "assistant", content: textOf(assistant) },
      ])
    }
  }
  if (!welcome.trim() || welcome.length > HISTORY_CHARACTER_LIMIT)
    throw new GuideError("payload")
  const history: Array<{ role: "user" | "assistant"; content: string }> = [
    { role: "assistant", content: welcome },
  ]
  const latestPair = pairs.at(-1)
  if (latestPair) {
    const size = latestPair.reduce(
      (total, item) => total + item.content.length,
      welcome.length
    )
    if (size <= HISTORY_CHARACTER_LIMIT) {
      history.push(...latestPair)
      const previousQuestion = pairs.at(-2)?.[0]
      if (
        previousQuestion &&
        size + previousQuestion.content.length <= HISTORY_CHARACTER_LIMIT
      )
        history.splice(1, 0, previousQuestion)
    }
  }
  const payload = { message, history }
  if (
    new TextEncoder().encode(JSON.stringify(payload)).byteLength > REQUEST_BYTES
  )
    throw new GuideError("payload")
  return payload
}

export function guideEndpoint(
  enabled: string | undefined,
  origin: string | undefined
) {
  if (enabled !== "true" || !origin) return null
  try {
    const url = new URL(origin)
    const local =
      url.protocol === "http:" &&
      ["localhost", "127.0.0.1", "[::1]"].includes(url.hostname)
    if (
      (!local && url.protocol !== "https:") ||
      url.username ||
      url.password ||
      url.search ||
      url.hash ||
      url.pathname !== "/"
    )
      return null
    return new URL("/v1/chat", url).href
  } catch {
    return null
  }
}
