import * as m from "@workspace/i18n/messages"
import { getLocale } from "@workspace/i18n/runtime"
import { useCallback, useRef, useSyncExternalStore } from "react"
import type {
  ChangeEvent,
  FormEvent,
  KeyboardEvent,
  MouseEvent,
  UIEvent,
} from "react"
import { Button } from "@workspace/ui/components/button"
import { ArrowUp, ArrowUpRight, Square, RotateCcw } from "lucide-react"
import { useGuide } from "./guide-provider"
import { GuideMessages } from "./guide-messages"
import { QUESTION_LIMIT, textOf } from "./protocol"
import type { GuideErrorCode } from "./protocol"
import { GUIDE_PROJECT } from "./project"

const SCROLLBAR_IDLE_MS = 800

function errorText(code: GuideErrorCode) {
  switch (code) {
    case "question":
      return m.guide_error_question()
    case "payload":
      return m.guide_error_question()
    case "timeout":
      return m.guide_error_timeout()
    case "response":
      return m.guide_error_response()
    case "unavailable":
      return m.guide_error_unavailable()
    case "interrupted":
      return m.guide_error_interrupted()
    default:
      return m.guide_error_network()
  }
}
function focusComposer(node: HTMLTextAreaElement | null) {
  node?.focus({ preventScroll: true })
}

// One local timeout unlocks manual retry; it never contacts the service.
function useRetryReady(retryAt: string | undefined) {
  function snapshot() {
    return !retryAt || Date.now() >= Date.parse(retryAt)
  }
  function serverSnapshot() {
    return !retryAt
  }
  function subscribe(notify: () => void) {
    if (!retryAt) return () => {}
    const delay = Math.max(0, Date.parse(retryAt) - Date.now())
    const timer = setTimeout(notify, Math.min(delay + 20, 2_147_483_647))
    return () => clearTimeout(timer)
  }
  return useSyncExternalStore(subscribe, snapshot, serverSnapshot)
}

export function GuideChat() {
  const { session, state, messages, ready, send, stop, clear } = useGuide()
  const retryReady = useRetryReady(state.sleeping?.retry_at)
  const canStart = ready && !state.pending && retryReady
  const canSend = canStart && Boolean(state.draft.trim())
  const followLatest = useRef(true)
  const scrollbarTimer = useRef<number | undefined>(undefined)
  const bindTranscript = useCallback((node: HTMLDivElement | null) => {
    if (!node) return
    return () => window.clearTimeout(scrollbarTimer.current)
  }, [])
  const messageVersion = messages
    .map((message) => `${message.id}:${textOf(message).length}`)
    .join("|")
  const transcriptVersion = `${messageVersion}:${state.reveal?.visibleCharacters ?? "complete"}`
  const scrollToLatest = useCallback((node: HTMLDivElement | null) => {
    if (node?.parentElement && followLatest.current)
      node.parentElement.scrollTop = node.parentElement.scrollHeight
  }, [])
  function trackScroll(event: UIEvent<HTMLDivElement>) {
    const node = event.currentTarget
    followLatest.current =
      node.scrollHeight - node.scrollTop - node.clientHeight < 48
    node.dataset.scrolling = "true"
    window.clearTimeout(scrollbarTimer.current)
    scrollbarTimer.current = window.setTimeout(() => {
      delete node.dataset.scrolling
    }, SCROLLBAR_IDLE_MS)
  }
  const suggestions = [
    m.guide_suggest_projects(),
    m.guide_suggest_work(),
    m.guide_suggest_games(),
  ]
  const suggestionButtons = suggestions.map((suggestion) => {
    function choose() {
      if (!canStart) return
      followLatest.current = true
      void send(suggestion)
      document.getElementById("guide-question")?.focus({ preventScroll: true })
    }
    return (
      <button
        key={suggestion}
        type="button"
        onClick={choose}
        disabled={!canStart}
      >
        {suggestion}
      </button>
    )
  })
  const error = state.error ? errorText(state.error) : null
  const sleepingTime = state.sleeping
    ? new Intl.DateTimeFormat(getLocale(), {
        hour: "2-digit",
        minute: "2-digit",
      }).format(new Date(state.sleeping.retry_at))
    : ""
  function changeDraft(event: ChangeEvent<HTMLTextAreaElement>) {
    session.setDraft(event.target.value)
  }
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    followLatest.current = true
    void send()
  }
  function stopResponse(event: MouseEvent<HTMLButtonElement>) {
    // Keep the same focused control, but prevent its newly rendered submit
    // type from sending again during this click's native default action.
    event.preventDefault()
    stop()
  }
  function keyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (
      event.key === "Enter" &&
      !event.shiftKey &&
      !event.nativeEvent.isComposing
    ) {
      event.preventDefault()
      if (canSend) {
        followLatest.current = true
        void send()
      }
    }
  }
  return (
    <div className="guide-chat">
      <div
        className="guide-transcript"
        ref={bindTranscript}
        onScroll={trackScroll}
      >
        <div className="guide-welcome">
          <span className="eyebrow">{m.guide_welcome_label()}</span>
          <p>{m.guide_welcome()}</p>
        </div>
        {messages.length === 0 && (
          <div className="guide-suggestions">{suggestionButtons}</div>
        )}
        <GuideMessages />
        {state.pending && (
          <p className="guide-notice" role="status">
            {m.guide_pending()}
          </p>
        )}
        <div ref={scrollToLatest} key={transcriptVersion} />
      </div>
      <div className="guide-compose-area">
        {state.memoryOnly && (
          <p className="guide-notice">{m.guide_memory_only()}</p>
        )}
        {state.sleeping && (
          <p className="guide-notice guide-sleep-notice" role="status">
            {retryReady
              ? m.guide_retry_ready()
              : m.guide_sleeping({ time: sleepingTime })}
          </p>
        )}
        {error && (
          <p className="guide-notice guide-error" role="alert">
            {error}
          </p>
        )}
        <form onSubmit={submit} className="guide-composer">
          <label htmlFor="guide-question" className="guide-sr-only">
            {m.guide_question()}
          </label>
          <textarea
            id="guide-question"
            ref={focusComposer}
            value={state.draft}
            onChange={changeDraft}
            onKeyDown={keyDown}
            maxLength={QUESTION_LIMIT}
            rows={2}
            placeholder={m.guide_placeholder()}
            disabled={!ready}
            aria-describedby="guide-input-hint"
          />
          <div className="guide-composer-controls">
            <span id="guide-input-hint">
              {state.draft.length} / {QUESTION_LIMIT}
            </span>
            {state.pending ? (
              <Button variant="outline" onClick={stopResponse}>
                <Square size={14} aria-hidden="true" />
                {m.guide_stop()}
              </Button>
            ) : (
              <Button type="submit" disabled={!canSend}>
                <ArrowUp size={17} aria-hidden="true" />
                {m.guide_send()}
              </Button>
            )}
          </div>
        </form>
        <div className="guide-bottom-line">
          <div className="guide-attribution">
            <p>{m.guide_disclaimer()}</p>
            <a
              href={GUIDE_PROJECT.repositoryUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${m.guide_repository_label()} · ${GUIDE_PROJECT.title}`}
            >
              {GUIDE_PROJECT.title}
              <ArrowUpRight size={12} aria-hidden="true" />
            </a>
          </div>
          <button
            type="button"
            className="text-action"
            onClick={clear}
            disabled={!ready}
          >
            <RotateCcw size={13} aria-hidden="true" />
            {m.guide_clear()}
          </button>
        </div>
      </div>
    </div>
  )
}
