import * as m from "@workspace/i18n/messages"
import { useRouter } from "@tanstack/react-router"
import { Minimize2 } from "lucide-react"
import { GUIDE_ENABLED } from "./config"
import { useGuide } from "./guide-provider"
import { GuideChat } from "./guide-chat"
import { GUIDE_VIEW_TRANSITION } from "./motion"

export function GuidePage() {
  return (
    <section
      className="inner-page guide-page"
      aria-labelledby="guide-page-title"
    >
      <header className="guide-page-heading">
        <div>
          <p className="eyebrow">{m.guide_eyebrow()}</p>
          <h1 id="guide-page-title">{m.guide_title()}</h1>
          <p>{m.guide_description()}</p>
        </div>
        {GUIDE_ENABLED && <MinimizeGuide />}
      </header>
      <div className="guide-page-surface">
        <noscript>
          <p>{m.guide_needs_js()}</p>
        </noscript>
        {GUIDE_ENABLED ? (
          <GuideChat />
        ) : (
          <p className="guide-unavailable">{m.guide_disabled()}</p>
        )}
      </div>
    </section>
  )
}

function MinimizeGuide() {
  const { state, session } = useGuide()
  const router = useRouter()
  function minimize() {
    session.setOpen(true)
    void router.navigate({
      to: state.returnTo.pathname,
      search: state.returnTo.search,
      hash: state.returnTo.hash,
      viewTransition: GUIDE_VIEW_TRANSITION,
    })
  }
  return (
    <button
      className="text-action"
      type="button"
      onClick={minimize}
      aria-label={m.guide_minimize()}
    >
      <Minimize2 size={16} aria-hidden="true" />
      <span className="guide-minimize-label">{m.guide_minimize()}</span>
    </button>
  )
}
