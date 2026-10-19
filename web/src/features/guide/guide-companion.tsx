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

const LARGE_COMPANION_QUERY = "(min-width: 1101px) and (min-height: 651px)"

function subscribeLargeCompanion(notify: () => void) {
  const media = window.matchMedia(LARGE_COMPANION_QUERY)
  media.addEventListener("change", notify)
  return () => media.removeEventListener("change", notify)
}
function largeCompanionSnapshot() {
  return window.matchMedia(LARGE_COMPANION_QUERY).matches
}
function serverLargeCompanionSnapshot() {
  return false
}

function companionImage(character: string, animation: string, native: boolean) {
  const base = `assets/companion/${character}-${animation}`
  const normal = assetUrl(`${base}${native ? "" : "-1x"}.webp`)
  const retina = native ? normal : assetUrl(`${base}-2x.webp`)
  const dense = native ? normal : assetUrl(`${base}-3x.webp`)
  const imageSrcSet = native
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
  const largeCompanion = useSyncExternalStore(
    subscribeLargeCompanion,
    largeCompanionSnapshot,
    serverLargeCompanionSnapshot
  )
  const fromEyefox = /\/projects\/eyefox\/?$/.test(state.returnTo.pathname)
  const character = onEyefox || (onGuide && fromEyefox) ? "fox" : "adventurer"
  const nativeArtwork = onGuide || largeCompanion
  const atlas = companionImage(character, "atlas", nativeArtwork)
  const talk = companionImage(character, "talk", nativeArtwork)
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
