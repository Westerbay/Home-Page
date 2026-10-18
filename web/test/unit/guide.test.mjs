import { test } from "node:test"
import assert from "node:assert/strict"
import {
  answerSchema,
  createPayload,
  guideEndpoint,
  GuideError,
  QUESTION_LIMIT,
  RESPONSE_BYTES,
  SNAPSHOT_BYTES,
} from "../../src/features/guide/protocol.ts"
import {
  createGuideSession,
  readSnapshot,
} from "../../src/features/guide/session.ts"
import { createGuideTransport } from "../../src/features/guide/transport.ts"
import { readResponse } from "../../src/features/guide/response.ts"
import { safeMarkdownUrl } from "../../src/features/guide/sources.ts"

const message = (id, role, text) => ({
  id,
  role,
  parts: [{ type: "text", content: text }],
})
const citation = {
  chunk_id: "spellwar-1",
  path: "spellwar.md",
  line_start: 1,
  line_end: 4,
}
const receipt = { status: "answered", citations: [citation] }
const answer = { ...receipt, answer: "Un moteur 3D en C++." }
const welcome = "Je suis l’assistant du portfolio de Mathis."
const sleeping = {
  status: "sleeping",
  service: "workers_ai",
  reason: "quota_exhausted",
  retry_at: "2099-01-01T00:00:00.000Z",
}
function memoryStorage() {
  const values = new Map()
  return {
    values,
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
    removeItem: (key) => values.delete(key),
  }
}
function sessionWith(storage = memoryStorage(), reducedMotion = () => true) {
  const session = createGuideSession("/", () => storage, reducedMotion)
  session.subscribe(() => {})
  return session
}
async function collect(iterable) {
  const events = []
  for await (const event of iterable) events.push(event)
  return events
}

test("a first question carries the visible welcome without rewriting the question", () => {
  const question = "Quel est son parcours ?"
  assert.deepEqual(
    createPayload([message("1", "user", question)], {}, welcome),
    {
      message: question,
      history: [{ role: "assistant", content: welcome }],
    }
  )
})

test("welcome context respects the history and encoded request budgets", () => {
  const messages = [message("1", "user", "Quel est son parcours ?")]
  const exact = "x".repeat(2000)
  assert.equal(createPayload(messages, {}, exact).history[0].content, exact)
  for (const invalid of [" ", "x".repeat(2001)])
    assert.throws(() => createPayload(messages, {}, invalid), {
      code: "payload",
    })
  assert.throws(
    () =>
      createPayload(
        [message("1", "user", "\u0000".repeat(1500))],
        {},
        "\u0000".repeat(2000)
      ),
    { code: "payload" }
  )
})

test("guide retains its welcome, two recent questions and only the latest completed answer", () => {
  const messages = [
    message("discard-1", "user", "Much older question"),
    message("discard-2", "assistant", "Much older answer"),
    message("1", "user", "old"),
    message("2", "assistant", "a".repeat(1500)),
    message("3", "user", "recent"),
    message("4", "assistant", "b".repeat(900)),
    message("5", "user", "question"),
  ]
  const completed = {
    "discard-2": receipt,
    2: { status: "answered", citations: [] },
    4: { status: "answered", citations: [] },
  }
  assert.deepEqual(createPayload(messages, completed, welcome), {
    message: "question",
    history: [
      { role: "assistant", content: welcome },
      { role: "user", content: "old" },
      { role: "user", content: "recent" },
      { role: "assistant", content: "b".repeat(900) },
    ],
  })
})

test("the welcome shares the history budget and the latest complete pair takes priority", () => {
  const question = "Quels jeux a-t-il créés ?"
  const currentQuestion = "Il a fait quoi à son dernier poste ?"
  const latestAnswer = "a".repeat(2000 - welcome.length - question.length)
  const messages = [
    message("1", "user", "Quel est son parcours ?"),
    message("2", "assistant", "Il est ingénieur."),
    message("3", "user", question),
    message("4", "assistant", latestAnswer),
    message("5", "user", currentQuestion),
  ]
  assert.deepEqual(
    createPayload(messages, { 2: receipt, 4: receipt }, welcome),
    {
      message: currentQuestion,
      history: [
        { role: "assistant", content: welcome },
        { role: "user", content: question },
        { role: "assistant", content: latestAnswer },
      ],
    }
  )
  messages[3] = message("4", "assistant", latestAnswer + "x")
  assert.deepEqual(
    createPayload(messages, { 2: receipt, 4: receipt }, welcome),
    {
      message: currentQuestion,
      history: [{ role: "assistant", content: welcome }],
    }
  )
})

test("history excludes failures and never truncates an over-budget last pair", () => {
  const messages = [
    message("1", "user", "good"),
    message("2", "assistant", "old"),
    message("3", "user", "failed"),
    message("4", "user", "big"),
    message("5", "assistant", "x".repeat(2000)),
    message("6", "user", "next"),
  ]
  assert.deepEqual(
    createPayload(messages, { 2: receipt, 5: receipt }, welcome).history,
    [{ role: "assistant", content: welcome }]
  )
  const withoutLarge = [
    message("1", "user", "good"),
    message("2", "assistant", "old"),
    message("3", "user", "failed"),
    message("4", "user", "next"),
  ]
  assert.deepEqual(
    createPayload(withoutLarge, { 2: receipt }, welcome).history,
    [
      { role: "assistant", content: welcome },
      { role: "user", content: "good" },
      { role: "assistant", content: "old" },
    ]
  )
})

test("question uses JavaScript characters, preserves input and checks encoded JSON independently", () => {
  const exact = "🙂".repeat(QUESTION_LIMIT / 2)
  assert.equal(
    createPayload([message("1", "user", exact)], {}, welcome).message,
    exact
  )
  assert.throws(
    () => createPayload([message("1", "user", exact + "x")], {}, welcome),
    GuideError
  )
  assert.throws(
    () => createPayload([message("1", "user", "  ")], {}, welcome),
    GuideError
  )
  const large = [
    message("1", "user", "\u0000".repeat(900)),
    message("2", "assistant", "\u0000".repeat(900)),
    message("3", "user", "\u0000".repeat(1500)),
  ]
  assert.throws(() => createPayload(large, { 2: receipt }, welcome), {
    code: "payload",
  })
})

test("public origin configuration rejects credentials, paths and non-HTTPS remote URLs", () => {
  assert.equal(
    guideEndpoint("true", "https://guide.example"),
    "https://guide.example/v1/chat"
  )
  assert.equal(
    guideEndpoint("true", "http://127.0.0.1:8788"),
    "http://127.0.0.1:8788/v1/chat"
  )
  for (const url of [
    "https://user:fake-marker@example.com",
    "https://example.com?token=fake",
    "https://example.com/path",
    "http://example.com",
    "javascript:alert(1)",
  ])
    assert.equal(guideEndpoint("true", url), null)
  assert.equal(guideEndpoint(undefined, "https://guide.example"), null)
})

test("response links stay safe and receipts retain protocol validation", () => {
  for (const url of [
    "javascript:alert(1)",
    "data:text/html,test",
    "//evil.example",
    "https://user:pass@example.com",
    "/admin",
  ])
    assert.equal(safeMarkdownUrl(url), "")
  assert.equal(
    safeMarkdownUrl("https://example.com/docs"),
    "https://example.com/docs"
  )
  assert.equal(
    answerSchema.safeParse({ ...answer, citations: [] }).success,
    false
  )
  assert.equal(
    answerSchema.safeParse({
      status: "out_of_scope",
      answer: "Outside the portfolio",
      citations: [],
    }).success,
    true
  )
})

test("transport makes one credential-free JSON request and emits the full answer once", async () => {
  const session = sessionWith()
  session.begin()
  let calls = 0
  const transport = createGuideTransport(
    "https://guide.example/v1/chat",
    session,
    () => welcome,
    async (url, options) => {
      calls++
      assert.equal(url, "https://guide.example/v1/chat")
      assert.equal(options.credentials, "omit")
      assert.equal(options.redirect, "error")
      assert.deepEqual(options.headers, {
        "Content-Type": "application/json",
        Accept: "text/event-stream",
      })
      assert.deepEqual(JSON.parse(options.body), {
        message: "Question",
        history: [{ role: "assistant", content: welcome }],
      })
      return Response.json(answer)
    }
  )
  const events = await collect(
    transport.connect([message("user-1", "user", "Question")])
  )
  assert.equal(calls, 1)
  assert.equal(
    events.filter((event) => event.type === "TEXT_MESSAGE_CONTENT").length,
    1
  )
  const content = events.find((event) => event.type === "TEXT_MESSAGE_CONTENT")
  assert.equal(content.delta, answer.answer)
  assert.deepEqual(session.getSnapshot().receipts[content.messageId], receipt)
})

test("transport reads the current welcome on each new conversation", async () => {
  const session = sessionWith()
  let currentWelcome = welcome
  const requests = []
  function getWelcome() {
    return currentWelcome
  }
  const transport = createGuideTransport(
    "https://guide.example/v1/chat",
    session,
    getWelcome,
    async (_url, options) => {
      requests.push(JSON.parse(options.body))
      return Response.json(answer)
    }
  )
  session.begin()
  await collect(
    transport.connect([message("1", "user", "Quel est son parcours ?")])
  )
  session.clear()
  currentWelcome = "I’m the assistant for Mathis’s portfolio."
  session.begin()
  await collect(
    transport.connect([message("2", "user", "What is his background?")])
  )
  assert.deepEqual(requests, [
    {
      message: "Quel est son parcours ?",
      history: [{ role: "assistant", content: welcome }],
    },
    {
      message: "What is his background?",
      history: [{ role: "assistant", content: currentWelcome }],
    },
  ])
})

test("only a validated HTTP 503 sleeping pauses the guide", async () => {
  for (const [status, body, sleeps] of [
    [503, sleeping, true],
    [200, sleeping, false],
    [503, { ...sleeping, retry_at: "tomorrow" }, false],
    [503, { detail: "unavailable" }, false],
  ]) {
    const session = sessionWith()
    session.begin()
    const transport = createGuideTransport(
      "https://guide.example/v1/chat",
      session,
      () => welcome,
      async () => Response.json(body, { status })
    )
    if (sleeps)
      assert.deepEqual(
        await collect(transport.connect([message("1", "user", "Question")])),
        []
      )
    else
      await assert.rejects(
        collect(transport.connect([message("1", "user", "Question")])),
        GuideError
      )
    assert.equal(Boolean(session.getSnapshot().sleeping), sleeps)
  }
})

test("invalid, oversized and invalid UTF-8 responses are rejected without displaying their content", async () => {
  for (const response of [
    new Response("not JSON"),
    new Response("x".repeat(RESPONSE_BYTES + 1)),
    new Response(new Uint8Array([0xff, 0xfe])),
  ])
    await assert.rejects(readResponse(response), { code: "response" })
})

test("stop and new conversation discard late answers and metadata", async () => {
  for (const action of ["stop", "clear"]) {
    const session = sessionWith()
    session.begin()
    let resolve
    const pending = new Promise((done) => {
      resolve = done
    })
    const transport = createGuideTransport(
      "https://guide.example/v1/chat",
      session,
      () => welcome,
      () => pending
    )
    const result = collect(
      transport.connect([message("1", "user", "Question")])
    )
    session[action]()
    resolve(Response.json(answer))
    assert.deepEqual(await result, [])
    assert.deepEqual(session.getSnapshot().receipts, {})
  }
})

test("a timeout aborts once and never retries", async (context) => {
  context.mock.timers.enable({ apis: ["setTimeout"] })
  const session = sessionWith()
  session.begin()
  let calls = 0
  const transport = createGuideTransport(
    "https://guide.example/v1/chat",
    session,
    () => welcome,
    (_url, options) => {
      calls++
      return new Promise((_resolve, reject) =>
        options.signal.addEventListener("abort", () =>
          reject(new Error("aborted"))
        )
      )
    }
  )
  const result = collect(transport.connect([message("1", "user", "Question")]))
  const rejection = assert.rejects(result, { code: "timeout" })
  context.mock.timers.tick(30_000)
  await rejection
  assert.equal(calls, 1)
  assert.equal(session.getSnapshot().error, "timeout")
})

test("session restores after hydration, preserves sleep through clear and never resumes a request", async () => {
  const storage = memoryStorage()
  const session = sessionWith(storage)
  session.setDraft("Question conservée")
  const operation = session.begin("Question conservée")
  assert.equal(session.getSnapshot().draft, "")
  session.persistence.setItem("ignored", {
    messages: [message("1", "user", "Question conservée")],
  })
  const reloaded = sessionWith(storage)
  assert.equal(reloaded.getSnapshot().error, "interrupted")
  assert.equal(reloaded.getSnapshot().draft, "Question conservée")
  assert.equal(reloaded.getSnapshot().pending, false)
  assert.deepEqual(await reloaded.persistence.getItem("ignored"), {
    messages: [message("1", "user", "Question conservée")],
  })
  session.sleep(operation, sleeping)
  session.clear()
  session.persistence.removeItem("ignored")
  const sleepingReload = sessionWith(storage)
  assert.deepEqual(sleepingReload.getSnapshot().sleeping, sleeping)
  assert.equal(sleepingReload.begin(), null)
  assert.deepEqual(sleepingReload.getSnapshot().messages, [])
})

test("accepted manual sends clear the composer immediately and preserve typing through success", () => {
  const session = sessionWith()
  session.setDraft("Question envoyée")
  const operation = session.begin("Question envoyée")
  assert.equal(session.getSnapshot().draft, "")
  assert.equal(session.getSnapshot().pending, true)
  session.setDraft("Question suivante")
  assert.equal(session.begin("Question suivante"), null)
  assert.equal(session.getSnapshot().draft, "Question suivante")
  session.receive(operation, "reply", answer)
  session.finish(operation, true)
  assert.equal(session.getSnapshot().draft, "Question suivante")
})

test("failed, sleeping, stopped and interrupted sends restore only an untouched composer", () => {
  const original = "  Question exacte\navec une suite  "
  for (const outcome of ["unavailable", "timeout", "sleep", "stop", "reload"]) {
    for (const edits of [[], ["Nouvelle question"], ["Brouillon", ""]]) {
      const storage = memoryStorage()
      const session = sessionWith(storage)
      session.setDraft(original)
      const operation = session.begin(original)
      assert.equal(session.getSnapshot().draft, "")
      for (const draft of edits) session.setDraft(draft)
      let result = session
      if (outcome === "reload") result = sessionWith(storage)
      else if (outcome === "stop") session.stop()
      else {
        if (outcome === "sleep") session.sleep(operation, sleeping)
        else session.fail(operation, outcome)
        session.finish(operation, false)
      }
      assert.equal(result.getSnapshot().draft, edits.at(-1) ?? original)
      session.clear()
    }
  }
})

test("new conversation discards recovery and late completion cannot replace the new draft", () => {
  const session = sessionWith()
  session.setDraft("Ancienne question")
  const first = session.begin("Ancienne question")
  session.clear()
  session.setDraft("Nouvelle question")
  const second = session.begin("Nouvelle question")
  session.fail(first, "network")
  session.finish(first, false)
  assert.equal(session.getSnapshot().draft, "")
  assert.equal(session.getSnapshot().pending, true)
  session.stop()
  session.finish(second, false)
  assert.equal(session.getSnapshot().draft, "Nouvelle question")
  session.clear()
  session.finish(second, false)
  assert.equal(session.getSnapshot().draft, "")
})

test("denied, corrupt and oversized storage falls back to memory without overwriting invalid data", () => {
  const denied = createGuideSession("/", () => {
    throw new Error("denied")
  })
  denied.subscribe(() => {})
  assert.equal(denied.getSnapshot().memoryOnly, true)
  for (const raw of ["invalid JSON", "x".repeat(SNAPSHOT_BYTES + 1)]) {
    const storage = memoryStorage()
    storage.setItem("portfolio-guide:v1:/", raw)
    const session = sessionWith(storage)
    session.setDraft("Still works")
    assert.equal(session.getSnapshot().memoryOnly, true)
    assert.equal(session.getSnapshot().draft, "Still works")
    assert.equal(storage.getItem("portfolio-guide:v1:/"), raw)
    assert.throws(() => readSnapshot(raw))
  }
})

test("sleep presentation progresses once, survives clear, and restores hidden without replay", (context) => {
  context.mock.timers.enable({ apis: ["setTimeout", "Date"], now: Date.now() })
  const storage = memoryStorage()
  const session = sessionWith(storage)
  const operation = session.begin()
  session.sleep(operation, sleeping)
  session.finish(operation, false)
  assert.equal(session.getSnapshot().companion, "yawning")
  context.mock.timers.tick(900)
  assert.equal(session.getSnapshot().companion, "asleep")
  session.clear()
  assert.equal(session.getSnapshot().companion, "asleep")
  const restored = sessionWith(storage)
  assert.equal(restored.getSnapshot().companion, "hidden")
  context.mock.timers.tick(1600)
  assert.equal(session.getSnapshot().companion, "disappearing")
  context.mock.timers.tick(300)
  assert.equal(session.getSnapshot().companion, "hidden")
  context.mock.timers.setTime(Date.parse(sleeping.retry_at))
  const retry = session.begin()
  assert.equal(session.getSnapshot().companion, "thinking")
  session.receive(retry, "answer", answer)
  session.finish(retry, true)
  assert.equal(session.getSnapshot().companion, "idle")
  assert.equal(session.getSnapshot().sleeping, null)
})

test("late sleeping is ignored after cancellation and generic failures leave the companion awake", () => {
  const session = sessionWith()
  const first = session.begin()
  session.stop()
  session.sleep(first, sleeping)
  assert.equal(session.getSnapshot().companion, "idle")
  assert.equal(session.getSnapshot().sleeping, null)
  const second = session.begin()
  session.fail(second, "unavailable")
  session.finish(second, false)
  assert.equal(session.getSnapshot().companion, "idle")
  assert.equal(session.getSnapshot().sleeping, null)
})

test("dialogue reveal is transient, keeps graphemes intact and never rewrites storage each frame", (context) => {
  context.mock.timers.enable({ apis: ["setTimeout"] })
  const storage = memoryStorage()
  let writes = 0
  const setItem = storage.setItem
  storage.setItem = (...args) => {
    writes++
    setItem(...args)
  }
  const session = sessionWith(storage, () => false)
  const response = { ...answer, answer: "🙂e\u0301 Un moteur et son rendu." }
  const operation = session.begin()
  session.receive(operation, "reply", response)
  session.persistence.setItem("ignored", {
    messages: [message("reply", "assistant", response.answer)],
  })
  session.finish(operation, true)
  const savedWrites = writes
  assert.equal(session.getSnapshot().companion, "speaking")
  context.mock.timers.tick(40)
  assert.equal(session.getSnapshot().reveal.visibleCharacters, 4)
  assert.equal(writes, savedWrites)
  const restored = sessionWith(storage, () => false)
  assert.equal(restored.getSnapshot().reveal, null)
  assert.equal(restored.getSnapshot().companion, "idle")
  assert.equal(
    restored.getSnapshot().messages[0].parts[0].content,
    response.answer
  )
  session.finishReveal()
  assert.equal(session.getSnapshot().companion, "idle")
  assert.equal(session.getSnapshot().reveal, null)
  context.mock.timers.runAll()
  assert.equal(writes, savedWrites)
  assert.equal(session.getSnapshot().reveal, null)
})

test("new sends, stop and clear cancel speech without stale frames changing the next state", (context) => {
  context.mock.timers.enable({ apis: ["setTimeout"] })
  for (const action of ["begin", "stop", "clear"]) {
    const session = sessionWith(memoryStorage(), () => false)
    const operation = session.begin()
    session.receive(operation, "reply", answer)
    session.finish(operation, true)
    session[action]()
    context.mock.timers.runAll()
    assert.equal(session.getSnapshot().reveal, null)
    assert.equal(
      session.getSnapshot().companion,
      action === "begin" ? "thinking" : "idle"
    )
  }
})

test("reduced motion displays the full answer immediately, including a change during speech", (context) => {
  context.mock.timers.enable({ apis: ["setTimeout"] })
  let reduced = true
  const session = sessionWith(memoryStorage(), () => reduced)
  const first = session.begin()
  session.receive(first, "one", answer)
  session.finish(first, true)
  assert.equal(session.getSnapshot().companion, "idle")
  assert.equal(session.getSnapshot().reveal, null)
  reduced = false
  const second = session.begin()
  session.receive(second, "two", answer)
  session.finish(second, true)
  assert.equal(session.getSnapshot().companion, "speaking")
  reduced = true
  context.mock.timers.tick(40)
  assert.equal(session.getSnapshot().companion, "idle")
  assert.equal(session.getSnapshot().reveal, null)
})
