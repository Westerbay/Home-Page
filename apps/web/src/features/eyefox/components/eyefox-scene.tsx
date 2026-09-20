import { useEffect, useRef, useState } from "react"
import type { ComponentType } from "react"
import type { EyefoxPuzzleProps } from "@westerbay/eyefox-react"
import { useTheme } from "next-themes"
import { getLocale } from "@workspace/i18n/runtime"
import * as m from "@workspace/i18n/messages"
import { assetUrl } from "../../../lib/assets"
import "./eyefox-scene.css"

export function EyefoxScene() {
  const container = useRef<HTMLDivElement>(null)
  const [Component, setComponent] =
    useState<ComponentType<EyefoxPuzzleProps> | null>(null)
  const [status, setStatus] = useState<"idle" | "loading" | "failed">("idle")
  const { resolvedTheme } = useTheme()
  const locale = getLocale()

  useEffect(() => {
    let active = true
    const load = () => {
      setStatus("loading")
      void Promise.all([
        import("@westerbay/eyefox-react"),
        import("@westerbay/eyefox-react/styles.css"),
      ])
        .then(([module]) => {
          if (active) setComponent(() => module.EyefoxPuzzle)
        })
        .catch(() => {
          if (active) setStatus("failed")
        })
    }
    if (typeof IntersectionObserver === "undefined") {
      load()
      return () => {
        active = false
      }
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return
        observer.disconnect()
        load()
      },
      { rootMargin: "160px" }
    )
    if (container.current) observer.observe(container.current)
    return () => {
      active = false
      observer.disconnect()
    }
  }, [])

  return (
    <div
      ref={container}
      className="portfolio-eyefox"
      data-state={Component ? "ready" : status}
    >
      {Component ? (
        <Component
          locale={locale}
          theme={resolvedTheme === "dark" ? "dark" : "light"}
        />
      ) : (
        <div className="eyefox-placeholder">
          <img
            src={assetUrl("assets/eyefox.png")}
            alt={m.project_visual() + " · Eyefox Puzzle"}
          />
          <p role="status">
            {status === "failed"
              ? m.eyefox_unavailable()
              : status === "loading"
                ? m.eyefox_loading()
                : m.project_visual() + " · Eyefox Puzzle"}
          </p>
        </div>
      )}
    </div>
  )
}
