import { useEffect, useRef, useState } from "react"
import type { ComponentType } from "react"
import type { LSystemProps } from "@westerbay/lsystem-react"
import { useTheme } from "next-themes"
import { getLocale } from "@workspace/i18n/runtime"
import * as m from "@workspace/i18n/messages"
import { assetUrl } from "../../../lib/assets"

export function LSystemScene({ controls }: { controls: "compact" | "full" }) {
  const container = useRef<HTMLDivElement>(null)
  const [Component, setComponent] =
    useState<ComponentType<LSystemProps> | null>(null)
  const [failed, setFailed] = useState(false)
  const { resolvedTheme } = useTheme()
  const locale = getLocale()

  useEffect(() => {
    let active = true
    const load = () => {
      void Promise.all([
        import("@westerbay/lsystem-react"),
        import("@westerbay/lsystem-react/styles.css"),
      ])
        .then(([module]) => {
          if (active) setComponent(() => module.LSystem)
        })
        .catch(() => {
          if (active) setFailed(true)
        })
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
    <div ref={container} className="portfolio-lsystem" data-variant={controls}>
      {Component ? (
        <Component
          initialPreset="tree"
          locale={locale}
          theme={resolvedTheme === "dark" ? "dark" : "light"}
          controls={controls}
        />
      ) : (
        <div className="lsystem-placeholder">
          <img src={assetUrl("assets/plants.png")} alt={m.plants_summary()} />
          <p>{failed ? m.scene_unavailable() : m.scene_loading()}</p>
        </div>
      )}
    </div>
  )
}
