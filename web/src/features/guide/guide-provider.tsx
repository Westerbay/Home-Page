import {
  createContext,
  useContext,
  useState,
  useSyncExternalStore,
} from "react"
import type { ReactNode } from "react"
import { useChat } from "@tanstack/ai-react"
import type { UIMessage } from "@tanstack/ai-react"
import { useRouter } from "@tanstack/react-router"
import * as m from "@workspace/i18n/messages"
import { GUIDE_ENDPOINT } from "./config"
import { createGuideSession } from "./session"
import type { GuideSession, GuideState } from "./session"
import { createGuideTransport } from "./transport"
import { QUESTION_LIMIT } from "./protocol"

interface GuideContextValue {
  session: GuideSession
  state: GuideState
  messages: UIMessage[]
  ready: boolean
  send: (question?: string) => Promise<void>
  stop: () => void
  clear: () => void
  prepareGuidePage: () => void
}
const GuideContext = createContext<GuideContextValue | null>(null)

export function GuideProvider({ children }: { children: ReactNode }) {
  if (!GUIDE_ENDPOINT) return children
  return <ActiveGuide endpoint={GUIDE_ENDPOINT}>{children}</ActiveGuide>
}

function ActiveGuide({
  endpoint,
  children,
}: {
  endpoint: string
  children: ReactNode
}) {
  const router = useRouter()
  const [session] = useState(() =>
    createGuideSession(
      import.meta.env.BASE_URL,
      () => window.sessionStorage,
      () => window.matchMedia("(prefers-reduced-motion: reduce)").matches
    )
  )
  const state = useSyncExternalStore(
    session.subscribe,
    session.getSnapshot,
    session.getServerSnapshot
  )
  const [connection] = useState(() =>
    createGuideTransport(endpoint, session, m.guide_welcome)
  )
  const chat = useChat({
    threadId: "portfolio-guide",
    connection,
    persistence: session.persistence,
    queue: "drop",
  })
  const ready = state.ready && !chat.isHydrating

  async function send(question?: string) {
    const draft = session.getSnapshot().draft
    const message = question ?? draft
    if (!ready || !message.trim() || message.length > QUESTION_LIMIT) return
    const operation = session.begin(question === undefined ? draft : undefined)
    if (operation === null) return
    const receiptCount = Object.keys(session.getSnapshot().receipts).length
    try {
      await chat.sendMessage(message)
    } catch {
      if (!session.getSnapshot().error) session.fail(operation, "network")
    } finally {
      const succeeded =
        Object.keys(session.getSnapshot().receipts).length > receiptCount
      session.finish(operation, succeeded)
    }
  }
  function stop() {
    session.stop()
    chat.stop()
  }
  function clear() {
    session.clear()
    chat.clear()
  }
  function prepareGuidePage() {
    const onGuide = router.state.matches.some(
      (match) => match.routeId === "/guide"
    )
    const notFound = router.state.matches.some(
      (match) => match.status === "notFound" || match._notFound
    )
    if (!onGuide && !notFound) {
      const { pathname, search, hash } = router.state.location
      session.setReturnTo({ pathname, search, hash })
    }
  }
  const value: GuideContextValue = {
    session,
    state,
    messages: chat.messages,
    ready,
    send,
    stop,
    clear,
    prepareGuidePage,
  }
  return <GuideContext.Provider value={value}>{children}</GuideContext.Provider>
}

export function useGuide() {
  const value = useContext(GuideContext)
  if (!value) throw new Error("Guide must be enabled")
  return value
}
