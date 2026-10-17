import { z } from "zod"
import type { ChatClientPersistence } from "@tanstack/ai-react"
import {
  messageSchema,
  receiptSchema,
  sleepingSchema,
  SNAPSHOT_BYTES,
} from "./protocol.ts"
import type {
  GuideAnswer,
  GuideErrorCode,
  Receipt,
  Sleeping,
} from "./protocol.ts"

const snapshotSchema = z.object({
  version: z.literal(1),
  messages: z.array(messageSchema),
  receipts: z.record(z.string(), receiptSchema.optional()),
  draft: z.string().max(1500),
  submittedDraft: z.string().max(1500).nullable().default(null),
  sleeping: sleepingSchema.nullable(),
  pending: z.boolean(),
  interrupted: z.boolean().default(false),
})
type Snapshot = z.infer<typeof snapshotSchema>
export interface GuideReturnLocation {
  pathname: string
  search: Record<string, unknown>
  hash: string
}
export type CompanionState =
  | "idle"
  | "thinking"
  | "speaking"
  | "yawning"
  | "asleep"
  | "disappearing"
  | "hidden"
// The presentation lasts 0.9s yawning, 1.6s asleep, then 0.3s fading out.
const YAWN_MS = 900
const SLEEP_MS = 1600
const DISAPPEAR_MS = 300
// Local dialogue presentation, capped at 3.6s even for a long answer.
const REVEAL_TICK_MS = 40
const REVEAL_MAX_TICKS = 90
interface GuideReveal {
  messageId: string
  visibleCharacters: number
}
export interface GuideState extends Snapshot {
  ready: boolean
  memoryOnly: boolean
  error: GuideErrorCode | null
  open: boolean
  returnTo: GuideReturnLocation
  companion: CompanionState
  reveal: GuideReveal | null
}

export function readSnapshot(raw: string) {
  if (new TextEncoder().encode(raw).byteLength > SNAPSHOT_BYTES)
    throw new Error("snapshot-size")
  const parsed = snapshotSchema.parse(JSON.parse(raw))
  const ids = new Set(parsed.messages.map((message) => message.id))
  if (ids.size !== parsed.messages.length) throw new Error("snapshot-ids")
  for (const id of Object.keys(parsed.receipts)) {
    if (
      !parsed.messages.some(
        (message) => message.id === id && message.role === "assistant"
      )
    )
      throw new Error("snapshot-receipt")
  }
  return parsed
}

export function createGuideSession(
  base: string,
  getStorage: () => Storage,
  reducedMotion: () => boolean = () => false
) {
  const key = `portfolio-guide:v1:${base}`
  const listeners = new Set<() => void>()
  const initial: GuideState = {
    version: 1,
    messages: [],
    receipts: {},
    draft: "",
    submittedDraft: null,
    sleeping: null,
    pending: false,
    interrupted: false,
    ready: false,
    memoryOnly: false,
    error: null,
    open: false,
    returnTo: { pathname: "/", search: {}, hash: "" },
    companion: "idle",
    reveal: null,
  }
  let state = initial
  let storage: Storage | null = null
  let generation = 0
  let animationTimers: Array<ReturnType<typeof setTimeout>> = []
  let revealTimer: ReturnType<typeof setTimeout> | null = null
  let resolveReady: () => void = () => {}
  const ready = new Promise<void>((resolve) => {
    resolveReady = resolve
  })

  function publish() {
    for (const listener of listeners) listener()
  }
  function save() {
    if (!state.ready || !storage || state.memoryOnly) return
    const entries: Array<[string, Receipt]> = []
    for (const message of state.messages) {
      const receipt = Object.hasOwn(state.receipts, message.id)
        ? state.receipts[message.id]
        : undefined
      if (receipt) entries.push([message.id, receipt])
    }
    const receipts = Object.fromEntries(entries)
    const snapshot: Snapshot = {
      version: 1,
      messages: state.messages,
      receipts,
      draft: state.draft,
      submittedDraft: state.submittedDraft,
      sleeping: state.sleeping,
      pending: state.pending,
      interrupted: state.interrupted || state.error === "interrupted",
    }
    try {
      const raw = JSON.stringify(snapshot)
      if (new TextEncoder().encode(raw).byteLength > SNAPSHOT_BYTES)
        throw new Error("snapshot-size")
      storage.setItem(key, raw)
    } catch {
      state = { ...state, memoryOnly: true }
    }
  }
  function update(patch: Partial<GuideState>) {
    state = { ...state, ...patch }
    save()
    publish()
  }
  function cancelReveal() {
    if (revealTimer !== null) clearTimeout(revealTimer)
    revealTimer = null
    state = { ...state, reveal: null }
  }
  function finishReveal() {
    cancelReveal()
    if (state.companion === "speaking") state = { ...state, companion: "idle" }
    publish()
  }
  function revealAnswer(messageId: string, text: string) {
    cancelReveal()
    if (reducedMotion()) return
    const segmenter = new Intl.Segmenter(undefined, { granularity: "grapheme" })
    const ends = Array.from(
      segmenter.segment(text),
      ({ index, segment }) => index + segment.length
    )
    const step = Math.max(2, Math.ceil(ends.length / REVEAL_MAX_TICKS))
    let index = 0
    state = {
      ...state,
      reveal: { messageId, visibleCharacters: 0 },
      companion: "speaking",
    }
    function advance() {
      index += step
      if (index >= ends.length || reducedMotion()) {
        finishReveal()
        return
      }
      // Animation frames are ephemeral and never write sessionStorage.
      state = {
        ...state,
        reveal: { messageId, visibleCharacters: ends[index - 1] },
      }
      publish()
      revealTimer = setTimeout(advance, REVEAL_TICK_MS)
    }
    revealTimer = setTimeout(advance, REVEAL_TICK_MS)
  }
  function cancelAnimation() {
    for (const timer of animationTimers) clearTimeout(timer)
    animationTimers = []
  }
  function animateSleep() {
    cancelAnimation()
    update({ companion: "yawning" })
    animationTimers = [
      setTimeout(() => update({ companion: "asleep" }), YAWN_MS),
      setTimeout(
        () => update({ companion: "disappearing" }),
        YAWN_MS + SLEEP_MS
      ),
      setTimeout(
        () => update({ companion: "hidden" }),
        YAWN_MS + SLEEP_MS + DISAPPEAR_MS
      ),
    ]
  }
  function hydrate() {
    if (state.ready) return
    try {
      storage = getStorage()
      const raw = storage.getItem(key)
      if (raw) {
        const snapshot = readSnapshot(raw)
        state = {
          ...state,
          ...snapshot,
          draft: snapshot.submittedDraft ?? snapshot.draft,
          submittedDraft: null,
          pending: false,
          companion: snapshot.sleeping ? "hidden" : "idle",
          error:
            snapshot.pending || snapshot.interrupted ? "interrupted" : null,
        }
      }
    } catch {
      state = { ...state, memoryOnly: true }
    }
    state = { ...state, ready: true }
    resolveReady()
    publish()
  }
  const persistence: ChatClientPersistence = {
    async getItem() {
      await ready
      return { messages: state.messages }
    },
    setItem(_id, value) {
      const messages = z.array(messageSchema).parse(value.messages)
      update({ messages })
    },
    removeItem() {
      // The SDK also removes an empty transcript on mount. Draft and sleeping
      // belong to the session, and must survive that operation.
      if (state.ready) update({ messages: [], receipts: {} })
    },
  }
  return {
    persistence,
    subscribe(listener: () => void) {
      listeners.add(listener)
      hydrate()
      return () => {
        listeners.delete(listener)
      }
    },
    getSnapshot: () => state,
    getServerSnapshot: () => initial,
    setDraft(draft: string) {
      // Any edit takes ownership of the composer, including clearing it again.
      update({ draft, submittedDraft: null })
    },
    setOpen(open: boolean) {
      update({ open })
    },
    setReturnTo(returnTo: GuideReturnLocation) {
      update({ returnTo })
    },
    begin(submittedDraft?: string) {
      if (!state.ready || state.pending) return null
      if (state.sleeping && Date.now() < Date.parse(state.sleeping.retry_at))
        return null
      generation += 1
      cancelAnimation()
      cancelReveal()
      update({
        draft: submittedDraft === undefined ? state.draft : "",
        submittedDraft: submittedDraft ?? null,
        pending: true,
        interrupted: false,
        error: null,
        companion: "thinking",
      })
      return generation
    },
    current: () => generation,
    isCurrent: (id: number) => id === generation,
    receive(id: number, messageId: string, answer: GuideAnswer) {
      if (id !== generation) return
      const receipt = { status: answer.status, citations: answer.citations }
      cancelAnimation()
      revealAnswer(messageId, answer.answer)
      update({
        receipts: { ...state.receipts, [messageId]: receipt },
        submittedDraft: null,
        sleeping: null,
        companion: state.reveal ? "speaking" : "idle",
      })
    },
    sleep(id: number, sleeping: Sleeping) {
      if (id !== generation) return
      cancelReveal()
      update({ sleeping })
      animateSleep()
    },
    fail(id: number, error: GuideErrorCode) {
      if (id === generation) update({ error })
    },
    finish(id: number, succeeded: boolean) {
      if (id !== generation) return
      const draft = succeeded
        ? state.draft
        : (state.submittedDraft ?? state.draft)
      const error =
        !succeeded && !state.error && !state.sleeping
          ? "interrupted"
          : state.error
      let companion = state.companion
      if (companion === "thinking")
        companion = state.sleeping ? "hidden" : "idle"
      update({
        pending: false,
        draft,
        submittedDraft: null,
        error,
        interrupted: !succeeded && !state.sleeping,
        companion,
      })
    },
    stop() {
      generation += 1
      cancelAnimation()
      cancelReveal()
      update({
        draft: state.submittedDraft ?? state.draft,
        submittedDraft: null,
        pending: false,
        interrupted: true,
        error: "interrupted",
        companion: state.sleeping ? "hidden" : "idle",
      })
    },
    clear() {
      generation += 1
      cancelReveal()
      let companion = state.companion
      if (companion === "thinking" || companion === "speaking")
        companion = state.sleeping ? "hidden" : "idle"
      update({
        messages: [],
        receipts: {},
        draft: "",
        submittedDraft: null,
        pending: false,
        interrupted: false,
        error: null,
        companion,
      })
    },
    finishReveal,
  }
}
export type GuideSession = ReturnType<typeof createGuideSession>
