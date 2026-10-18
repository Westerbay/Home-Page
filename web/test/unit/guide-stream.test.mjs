import { test } from "node:test"
import assert from "node:assert/strict"
import { setTimeout as delay } from "node:timers/promises"
import { ChatClient } from "@tanstack/ai-react"
import { createGuideTransport } from "../../src/features/guide/transport.ts"
import { readStream } from "../../src/features/guide/response.ts"
import {
  createGuideSession,
  retainedMessages,
} from "../../src/features/guide/session.ts"
import {
  createPayload,
  RESPONSE_BYTES,
  STREAM_RESPONSE_BYTES,
  textOf,
} from "../../src/features/guide/protocol.ts"

const welcome = "Je suis l’assistant du portfolio de Mathis."
const answer = {
  status: "answered",
  answer: "Un moteur 3D, écrit en C++ 🙂.",
  citations: [
    { chunk_id: "one", path: "spellwar.md", line_start: 1, line_end: 4 },
  ],
}
const sleeping = {
  status: "sleeping",
  service: "workers_ai",
  reason: "quota_exhausted",
  retry_at: "2099-01-01T00:00:00.000Z",
}
const encoder = new TextEncoder()
function event(type, body) {
  return `event: ${type}\r\ndata: ${JSON.stringify(body)}\r\n\r\n`
}
function message(id, role, content) {
  return { id, role, parts: [{ type: "text", content }] }
}
async function collect(stream) {
  const result = []
  for await (const item of stream) result.push(item)
  return result
}
function controlledResponse() {
  let controller
  const response = new Response(
    new ReadableStream({
      start(value) {
        controller = value
      },
    }),
    { headers: { "content-type": "text/event-stream; charset=utf-8" } }
  )
  return {
    response,
    write: (text) => controller.enqueue(encoder.encode(text)),
    bytes: (bytes) => controller.enqueue(bytes),
    close: () => controller.close(),
  }
}
async function until(predicate) {
  for (let attempt = 0; attempt < 100; attempt++) {
    if (predicate()) return
    await delay(1)
  }
  assert.fail("Expected streamed state was never reached")
}
function setup(reducedMotion = () => false) {
  const stored = new Map()
  const storage = {
    getItem: (key) => stored.get(key) ?? null,
    setItem: (key, value) => stored.set(key, value),
    removeItem: (key) => stored.delete(key),
  }
  const session = createGuideSession("/", () => storage, reducedMotion)
  session.subscribe(() => {})
  const source = controlledResponse()
  const connection = createGuideTransport(
    "https://example.com/v1/chat",
    session,
    () => welcome,
    async () => source.response
  )
  return { session, storage, source, connection }
}

test("real TanStack client displays deltas before completion and persists only the validated final answer", async () => {
  const { session, source, connection, storage } = setup()
  const client = new ChatClient({
    threadId: "guide",
    connection,
    persistence: session.persistence,
  })
  await until(() => !client.isHydrating)
  session.setDraft("Comment fonctionne SpellWar ?")
  const operation = session.begin(session.getSnapshot().draft)
  const pending = client.sendMessage("Comment fonctionne SpellWar ?")
  assert.equal(session.getSnapshot().companion, "thinking")
  assert.equal(session.getSnapshot().draft, "")
  source.write(event("delta", { delta: "  Un moteur " }))
  await until(() =>
    client.getMessages().some((item) => textOf(item) === "Un moteur")
  )
  let state = session.getSnapshot()
  const previewId = state.streamingMessageId
  assert.equal(state.companion, "speaking")
  assert.deepEqual(state.receipts, {})
  assert.equal(
    retainedMessages(client.getMessages(), state.receipts, previewId).length,
    2
  )
  assert.equal(
    state.messages.filter((item) => item.role === "assistant").length,
    0
  )
  assert.equal(
    JSON.parse(storage.getItem("portfolio-guide:v1:/")).messages.length,
    1
  )
  session.setOpen(true)
  session.setReturnTo({ pathname: "/guide/", search: {}, hash: "" })
  assert.equal(session.getSnapshot().streamingMessageId, previewId)
  source.write(event("delta", { delta: "3D, écrit en C++ 🙂.  " }))
  await until(() =>
    client.getMessages().some((item) => textOf(item) === answer.answer)
  )
  source.write(event("result", answer))
  await delay(2)
  assert.deepEqual(session.getSnapshot().receipts, {})
  source.close()
  await pending
  session.finish(operation, true)
  state = session.getSnapshot()
  assert.equal(state.companion, "idle")
  assert.equal(state.reveal, null)
  assert.equal(state.streamingMessageId, null)
  assert.deepEqual(state.receipts[previewId], {
    status: answer.status,
    citations: answer.citations,
  })
  const restored = createGuideSession("/", () => storage)
  restored.subscribe(() => {})
  assert.equal(textOf(restored.getSnapshot().messages.at(-1)), answer.answer)
  assert.equal(restored.getSnapshot().companion, "idle")
  client.dispose()
})

test("SSE parsing handles one-byte UTF-8 boundaries, CRLF, multiline data and comments", async () => {
  const source = controlledResponse()
  const result = collect(
    readStream(source.response, new AbortController().signal)
  )
  const body =
    ': keepalive\r\n\r\nevent: delta\r\ndata: {\r\ndata: "delta": "é🙂"}\r\n\r\n' +
    event("result", { ...answer, answer: "é🙂" })
  for (const byte of encoder.encode(body)) source.bytes(new Uint8Array([byte]))
  source.close()
  assert.deepEqual(await result, [
    { type: "delta", delta: "é🙂" },
    { type: "result", answer: { ...answer, answer: "é🙂" } },
  ])
})

test("failure, mismatch, dropped stream and sleeping remove previews from UI, storage and subsequent history", async () => {
  for (const outcome of ["error", "mismatch", "eof", "sleeping"]) {
    const { session, source, connection, storage } = setup()
    const client = new ChatClient({
      threadId: "guide",
      connection,
      persistence: session.persistence,
    })
    await until(() => !client.isHydrating)
    session.setDraft("Question conservée")
    const operation = session.begin("Question conservée")
    const pending = client.sendMessage("Question conservée")
    source.write(event("delta", { delta: "Réponse incomplète" }))
    await until(() =>
      client
        .getMessages()
        .some((item) => item.role === "assistant" && textOf(item))
    )
    if (outcome === "error")
      source.write(event("error", { code: "unavailable" }))
    if (outcome === "mismatch") source.write(event("result", answer))
    if (outcome === "sleeping") source.write(event("sleeping", sleeping))
    source.close()
    await pending
    session.finish(operation, false)
    const state = session.getSnapshot()
    assert.equal(state.streamingMessageId, null)
    assert.deepEqual(state.receipts, {})
    assert.equal(state.draft, "Question conservée")
    assert.equal(
      retainedMessages(client.getMessages(), state.receipts).length,
      1
    )
    const snapshot = JSON.parse(storage.getItem("portfolio-guide:v1:/"))
    assert.equal(
      snapshot.messages.filter((item) => item.role === "assistant").length,
      0
    )
    assert.deepEqual(
      createPayload(
        [...client.getMessages(), message("next", "user", "Et ensuite ?")],
        state.receipts,
        welcome
      ).history,
      [{ role: "assistant", content: welcome }]
    )
    assert.equal(Boolean(state.sleeping), outcome === "sleeping")
    client.dispose()
    session.stop()
  }
})

test("stop and clear abort the real client stream without late preview reinsertion", async () => {
  for (const action of ["stop", "clear"]) {
    const { session, source, connection, storage } = setup()
    const client = new ChatClient({
      threadId: "guide",
      connection,
      persistence: session.persistence,
    })
    await until(() => !client.isHydrating)
    session.setDraft("Question interrompue")
    const operation = session.begin("Question interrompue")
    const pending = client.sendMessage("Question interrompue")
    source.write(event("delta", { delta: "Début de réponse" }))
    await until(() =>
      client
        .getMessages()
        .some((item) => item.role === "assistant" && textOf(item))
    )
    session[action]()
    client[action]()
    await pending
    session.finish(operation, false)
    const state = session.getSnapshot()
    assert.equal(state.streamingMessageId, null)
    assert.equal(state.companion, "idle")
    assert.deepEqual(state.receipts, {})
    assert.equal(
      retainedMessages(client.getMessages(), state.receipts).filter(
        (item) => item.role === "assistant"
      ).length,
      0
    )
    assert.equal(state.draft, action === "clear" ? "" : "Question interrompue")
    const saved = storage.getItem("portfolio-guide:v1:/")
    if (saved)
      assert.equal(
        JSON.parse(saved).messages.some((item) => item.role === "assistant"),
        false
      )
    client.dispose()
  }
})

test("invalid framing, invalid UTF-8, missing results, duplicate terminals and byte limits fail cleanly", async () => {
  const cases = [
    "event: delta\ndata: not-json\n\n",
    event("delta", { delta: "unfinished" }),
    event("result", answer) + event("result", answer),
    event("other", {}),
    event("delta", { delta: "x".repeat(RESPONSE_BYTES) }),
    ":" + "x".repeat(STREAM_RESPONSE_BYTES),
    new Uint8Array([0xff]),
  ]
  for (const body of cases) {
    const response = new Response(body, {
      headers: { "content-type": "text/event-stream" },
    })
    await assert.rejects(
      collect(readStream(response, new AbortController().signal)),
      { code: "response" }
    )
  }
})

test("a stalled response body times out and clears its preview without retrying", async (context) => {
  context.mock.timers.enable({ apis: ["setTimeout"] })
  const fresh = setup()
  fresh.session.begin("Question")
  const pending = collect(
    fresh.connection.connect([message("question", "user", "Question")])
  )
  const rejected = assert.rejects(pending, { code: "timeout" })
  fresh.source.write(event("delta", { delta: "Un début" }))
  for (
    let attempt = 0;
    attempt < 20 && !fresh.session.getSnapshot().streamingMessageId;
    attempt++
  )
    await Promise.resolve()
  assert.ok(fresh.session.getSnapshot().streamingMessageId)
  context.mock.timers.tick(30_000)
  await rejected
  fresh.session.finish(fresh.session.current(), false)
  assert.equal(fresh.session.getSnapshot().streamingMessageId, null)
  assert.equal(fresh.session.getSnapshot().companion, "idle")
})

test("reduced motion still receives incremental text without a replay after completion", async () => {
  const { session, source, connection } = setup(() => true)
  const operation = session.begin()
  const iterator = connection.connect([message("question", "user", "Question")])
  source.write(event("delta", { delta: answer.answer.slice(0, 10) }))
  await iterator.next()
  await iterator.next()
  assert.equal(
    (await iterator.next()).value.delta,
    answer.answer.slice(0, 10).trim()
  )
  assert.equal(session.getSnapshot().reveal, null)
  source.write(event("delta", { delta: answer.answer.slice(10) }))
  source.write(event("result", answer))
  source.close()
  await collect(iterator)
  session.finish(operation, true)
  assert.equal(session.getSnapshot().reveal, null)
  assert.equal(session.getSnapshot().companion, "idle")
})
