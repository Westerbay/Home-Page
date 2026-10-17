import * as m from "@workspace/i18n/messages"
import { Link } from "@tanstack/react-router"
import type { MouseEvent } from "react"
import { useGuide } from "./guide-provider"
import { GUIDE_VIEW_TRANSITION } from "./motion"

export function GuideLink() {
  const { prepareGuidePage } = useGuide()
  function openGuide(event: MouseEvent<HTMLAnchorElement>) {
    const modified =
      event.metaKey || event.ctrlKey || event.shiftKey || event.altKey
    if (event.defaultPrevented || event.button !== 0 || modified) return
    prepareGuidePage()
  }
  return (
    <Link
      to="/guide/"
      onClick={openGuide}
      viewTransition={GUIDE_VIEW_TRANSITION}
      activeProps={{ className: "active", "aria-current": "page" }}
    >
      {m.guide_title()}
    </Link>
  )
}
