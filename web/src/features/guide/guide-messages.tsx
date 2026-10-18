import * as m from "@workspace/i18n/messages"
import { lazy, Suspense } from "react"
import { useGuide } from "./guide-provider"

const GuideMessageItems = lazy(async () => {
  const module = await import("./guide-message-items")
  return { default: module.GuideMessageItems }
})

export function GuideMessages() {
  const { state } = useGuide()
  return (
    <div
      className="guide-messages"
      role="log"
      aria-label={m.guide_conversation()}
      aria-live="polite"
      aria-relevant="additions"
      aria-busy={Boolean(state.streamingMessageId) || undefined}
    >
      <Suspense fallback={null}>
        <GuideMessageItems />
      </Suspense>
    </div>
  )
}
