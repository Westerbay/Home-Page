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

function companionImage(
  character: string,
  animation: string,
  expanded: boolean
) {
  const base = `assets/companion/${character}-${animation}`
  const normal = assetUrl(`${base}${expanded ? "" : "-1x"}.webp`)
  const retina = expanded ? normal : assetUrl(`${base}-2x.webp`)
  const dense = expanded ? normal : assetUrl(`${base}-3x.webp`)
  const imageSrcSet = expanded
    ? undefined
    : `${normal} 1x, ${retina} 2x, ${dense} 3x`
  preload(normal, {
    as: "image",
    imageSrcSet,
    fetchPriority: "low",
  })
  return {
    normal: `url("${normal}")`,
    retina: `url("${retina}")`,
    dense: `url("${dense}")`,
  }
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
  const atlas = companionImage(character, "atlas", onGuide)
  const talk = companionImage(character, "talk", onGuide)
  let pose = state.companion
  if (reducedMotion && state.sleeping && pose !== "thinking") pose = "hidden"
  if (reducedMotion && pose === "speaking") pose = "idle"
  const image = pose === "speaking" ? talk : atlas
  const style = {
    "--companion-normal": image.normal,
    "--companion-retina": image.retina,
    "--companion-dense": image.dense,
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
