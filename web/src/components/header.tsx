import * as m from "@workspace/i18n/messages"
import { Link } from "@tanstack/react-router"
import { useEffect, useState } from "react"
import { getLocale, setLocale } from "@workspace/i18n/runtime"
import { useTheme } from "next-themes"
import { Moon, Sun } from "lucide-react"
import profile from "@workspace/config/profile" with { type: "json" }
import { assetUrl } from "../lib/assets"

function ThemeControl() {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  const ready = mounted && Boolean(resolvedTheme)
  const isDark = resolvedTheme === "dark"
  const label = ready
    ? isDark
      ? m.theme_to_light()
      : m.theme_to_dark()
    : m.theme_next()
  const Icon = isDark ? Sun : Moon

  return (
    <button
      className="utility-button theme-button"
      type="button"
      aria-label={label}
      title={label}
      disabled={!ready}
      onClick={() => setTheme(isDark ? "light" : "dark")}
    >
      {ready && <Icon size={17} aria-hidden="true" />}
    </button>
  )
}
export function Header() {
  const locale = getLocale()
  const changeLocale = () => setLocale(locale === "fr" ? "en" : "fr")
  return (
    <header className="site-header">
      <Link
        className="identity"
        to="/"
        aria-label={`${profile.name} · ${m.home()}`}
      >
        <img src={assetUrl(profile.avatar)} alt="" width="38" height="38" />
        <span>
          Mathis Dubuisson<span className="identity-sub">{m.role()}</span>
        </span>
      </Link>
      <nav className="main-nav" aria-label={m.navigation()}>
        <Link
          to="/"
          activeOptions={{ exact: true }}
          activeProps={{ className: "active", "aria-current": "page" }}
        >
          {m.home()}
        </Link>
        <Link
          to="/projects/"
          activeProps={{ className: "active", "aria-current": "page" }}
        >
          {m.projects()}
        </Link>
        <Link
          to="/about/"
          activeProps={{ className: "active", "aria-current": "page" }}
        >
          {m.about()}
        </Link>
        <Link
          to="/contact/"
          activeProps={{ className: "active", "aria-current": "page" }}
        >
          {m.contact()}
        </Link>
      </nav>
      <div className="header-tools">
        <button
          className="utility-button language-button"
          type="button"
          lang={locale === "fr" ? "en" : "fr"}
          aria-label={m.language()}
          title={m.language()}
          onClick={changeLocale}
        >
          <span
            className={locale === "fr" ? "language-current" : "language-other"}
            aria-hidden="true"
          >
            FR
          </span>
          <span className="language-divider" aria-hidden="true">
            /
          </span>
          <span
            className={locale === "en" ? "language-current" : "language-other"}
            aria-hidden="true"
          >
            EN
          </span>
        </button>
        <ThemeControl />
      </div>
    </header>
  )
}
