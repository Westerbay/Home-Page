import { useRouterState } from "@tanstack/react-router"
import { useSyncExternalStore } from "react"
import { preload } from "react-dom"
import { assetUrl } from "../../lib/assets"
import { useGuide } from "./guide-provider"

function subscribeMotion(notify: () => void) {
  const media = window.matchMedia("(prefers-reduced-motion: reduce)")
  media.addEventListener("change", notify)
  return () => media.removeEventListener("change", notify)
}
function reducedMotionSnapshot() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches
}
function serverMotionSnapshot() {
  return true
}

export function GuideCompanion() {
  const { state } = useGuide()
  const { onEyefox, onGuide } = useRouterState({
    select: (router) => ({
      onEyefox: router.matches.some(
        (match) =>
          match.routeId === "/projects/$slug" && match.params.slug === "eyefox"
      ),
      onGuide: router.matches.some((match) => match.routeId === "/guide"),
    }),
  })
  const reducedMotion = useSyncExternalStore(
    subscribeMotion,
    reducedMotionSnapshot,
    serverMotionSnapshot
  )
  const fromEyefox = /\/projects\/eyefox\/?$/.test(state.returnTo.pathname)
  const character = onEyefox || (onGuide && fromEyefox) ? "fox" : "adventurer"
  const atlasUrl = assetUrl(`assets/companion/${character}-atlas.png`)
  const talkUrl = assetUrl(`assets/companion/${character}-talk.png`)
  preload(atlasUrl, { as: "image" })
  preload(talkUrl, { as: "image" })
  let pose = state.companion
  if (reducedMotion && state.sleeping && pose !== "thinking") pose = "hidden"
  if (reducedMotion && pose === "speaking") pose = "idle"
  const imageUrl = pose === "speaking" ? talkUrl : atlasUrl
  const style = {
    backgroundImage: `url("${imageUrl}")`,
    aspectRatio: "1 / 1",
  }
  return (
    <span
      className="guide-companion"
      data-character={character}
      data-state={pose}
      aria-hidden="true"
    >
      <span className="guide-companion-sprite" style={style} />
    </span>
  )
}
