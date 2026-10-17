import * as m from "@workspace/i18n/messages"
import { useRouter, useRouterState } from "@tanstack/react-router"
import { useSyncExternalStore } from "react"
import { Maximize2, X } from "lucide-react"
import {
  DialogRoot,
  DialogTrigger,
  DialogPortal,
  DialogOverlay,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@workspace/ui/components/dialog"
import { GUIDE_ENABLED } from "./config"
import { useGuide } from "./guide-provider"
import { GuideChat } from "./guide-chat"
import { GuideCompanion } from "./guide-companion"
import { GUIDE_VIEW_TRANSITION } from "./motion"

function subscribeMobile(notify: () => void) {
  const media = window.matchMedia("(max-width: 600px)")
  media.addEventListener("change", notify)
  return () => media.removeEventListener("change", notify)
}
function mobileSnapshot() {
  return window.matchMedia("(max-width: 600px)").matches
}
function desktopSnapshot() {
  return false
}

export function GuideDock() {
  if (!GUIDE_ENABLED) return null
  return <ActiveDock />
}

function ActiveDock() {
  const onGuide = useRouterState({
    select: (state) =>
      state.matches.some((match) => match.routeId === "/guide"),
  })
  const { state, session, prepareGuidePage } = useGuide()
  const open = state.open && !onGuide
  const router = useRouter()
  const mobile = useSyncExternalStore(
    subscribeMobile,
    mobileSnapshot,
    desktopSnapshot
  )
  function enlarge() {
    prepareGuidePage()
    void router.navigate({
      to: "/guide/",
      viewTransition: GUIDE_VIEW_TRANSITION,
    })
  }
  function openChange(nextOpen: boolean) {
    session.setOpen(nextOpen)
  }
  function closeAutoFocus(event: Event) {
    // The destination page's composer owns focus when expanding.
    if (onGuide) {
      event.preventDefault()
      document.getElementById("guide-question")?.focus({ preventScroll: true })
    }
  }
  return (
    <div className="guide-dock" data-expanded={onGuide}>
      <GuideCompanion />
      <DialogRoot open={open} onOpenChange={openChange} modal={mobile}>
        <DialogTrigger asChild>
          <button
            className="guide-launcher"
            data-open={open}
            hidden={onGuide}
            type="button"
            disabled={!state.ready}
            aria-label={m.guide_open()}
          >
            <span className="guide-launcher-bubble">
              <span className="guide-launcher-dots" aria-hidden="true">
                ···
              </span>
              <span className="guide-launcher-status" role="status">
                {state.sleeping && !state.pending && !open
                  ? m.guide_companion_resting()
                  : ""}
              </span>
            </span>
          </button>
        </DialogTrigger>
        <DialogPortal>
          {mobile && <DialogOverlay className="guide-overlay" />}
          <DialogContent
            className="guide-panel"
            onCloseAutoFocus={closeAutoFocus}
          >
            <header className="guide-panel-header">
              <div>
                <DialogTitle>{m.guide_title()}</DialogTitle>
                <DialogDescription>{m.guide_description()}</DialogDescription>
              </div>
              <button
                type="button"
                onClick={enlarge}
                className="guide-icon-button"
                aria-label={m.guide_expand()}
              >
                <Maximize2 size={17} aria-hidden="true" />
              </button>
              <DialogClose asChild>
                <button
                  type="button"
                  className="guide-icon-button"
                  aria-label={m.guide_close()}
                >
                  <X size={19} aria-hidden="true" />
                </button>
              </DialogClose>
            </header>
            <GuideChat />
          </DialogContent>
        </DialogPortal>
      </DialogRoot>
    </div>
  )
}
