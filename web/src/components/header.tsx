import * as m from "@workspace/i18n/messages"
import { Link, useLocation, useMatch } from "@tanstack/react-router"
import { useEffect, useRef, useState, useSyncExternalStore } from "react"
import type { KeyboardEvent, MouseEvent } from "react"
import { getLocale, localizeHref } from "@workspace/i18n/runtime"
import { useTheme } from "next-themes"
import { Menu, Moon, Sun, X } from "lucide-react"
import profile from "@workspace/config/profile" with { type: "json" }
import { assetUrl } from "../lib/assets"
import { GUIDE_ENABLED } from "../features/guide/config"
import { GuideLink } from "../features/guide/guide-link"
import { ProjectNavigation } from "../features/projects/components/project-navigation"

function subscribeToUrl(onChange: () => void) {
  window.addEventListener("popstate", onChange)
  window.addEventListener("hashchange", onChange)
  return () => {
    window.removeEventListener("popstate", onChange)
    window.removeEventListener("hashchange", onChange)
  }
}

function currentUrl() {
  return window.location.href
}

function subscribeToLayout(onChange: () => void) {
  const desktop = window.matchMedia("(min-width: 1101px)")
  desktop.addEventListener("change", onChange)
  return () => desktop.removeEventListener("change", onChange)
}

function currentLayout() {
  return window.matchMedia("(min-width: 1101px)").matches ? "desktop" : "mobile"
}

function serverLayout() {
  return "server"
}

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
  const routeHref = useLocation({ select: (location) => location.href })
  const layout = useSyncExternalStore(
    subscribeToLayout,
    currentLayout,
    serverLayout
  )
  const [menu, setMenu] = useState({ route: routeHref, layout, open: false })
  const menuButton = useRef<HTMLButtonElement>(null)
  // A disclosure belongs to its current route and layout, including history
  // navigation. Reset it before rendering a different page or breakpoint.
  if (menu.route !== routeHref || menu.layout !== layout) {
    setMenu({ route: routeHref, layout, open: false })
  }
  const menuReady = layout !== "server"
  const menuOpen =
    menu.route === routeHref && menu.layout === layout && menu.open
  function closeMenu() {
    setMenu({ route: routeHref, layout, open: false })
  }
  function toggleMenu() {
    setMenu({ route: routeHref, layout, open: !menuOpen })
  }
  function handleHeaderKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (event.key === "Escape" && menuOpen) {
      closeMenu()
      menuButton.current?.focus()
    }
  }
  function handleNavigationClick(event: MouseEvent<HTMLDivElement>) {
    if (event.target instanceof Element && event.target.closest("a")) {
      closeMenu()
    }
  }
  // Static HTML cannot include the visitor's query or fragment. Read them after
  // hydration while keeping the prerendered link valid without JavaScript.
  const href = useSyncExternalStore(
    subscribeToUrl,
    currentUrl,
    () => import.meta.env.BASE_URL.replace(/\/$/, "") + routeHref
  )
  const otherLocale = locale === "fr" ? "en" : "fr"
  const languageHref = localizeHref(href, { locale: otherLocale })
  const projectMatch = useMatch({ from: "/projects/$slug", shouldThrow: false })
  const projectsMatch = useMatch({ from: "/projects/", shouldThrow: false })
  return (
    <header
      className="site-header"
      data-menu-ready={menuReady}
      data-menu-open={menuOpen}
      onKeyDown={handleHeaderKeyDown}
    >
      <Link
        className="identity"
        to="/"
        aria-label={`${profile.name} · ${m.role()} · ${m.home()}`}
      >
        <img
          src={assetUrl(profile.avatarThumbnail)}
          alt=""
          width="38"
          height="38"
        />
        <span>
          Mathis Dubuisson<span className="identity-sub">{m.role()}</span>
        </span>
      </Link>
      <button
        ref={menuButton}
        className="nav-toggle"
        type="button"
        aria-expanded={menuOpen}
        aria-controls="primary-navigation"
        aria-label={menuOpen ? m.menu_close() : m.menu_open()}
        onClick={toggleMenu}
      >
        {menuOpen ? (
          <X size={20} aria-hidden="true" />
        ) : (
          <Menu size={20} aria-hidden="true" />
        )}
        <span>{m.menu_label()}</span>
      </button>
      <div
        id="primary-navigation"
        className="header-navigation"
        onClick={handleNavigationClick}
      >
        <nav className="main-nav" aria-label={m.navigation()}>
          <Link
            to="/"
            activeOptions={{ exact: true }}
            activeProps={{ className: "active", "aria-current": "page" }}
          >
            {m.home()}
          </Link>
          <ProjectNavigation
            inProjects={Boolean(projectMatch || projectsMatch)}
            showProjects={Boolean(projectMatch)}
          />
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
          {GUIDE_ENABLED && <GuideLink />}
        </nav>
        <div className="header-tools">
          <a
            className="utility-button language-button"
            href={languageHref}
            hrefLang={otherLocale}
            lang={otherLocale}
            aria-label={`FR / EN · ${m.language()}`}
            title={m.language()}
          >
            <span
              className={
                locale === "fr" ? "language-current" : "language-other"
              }
              aria-hidden="true"
            >
              FR
            </span>
            <span className="language-divider" aria-hidden="true">
              /
            </span>
            <span
              className={
                locale === "en" ? "language-current" : "language-other"
              }
              aria-hidden="true"
            >
              EN
            </span>
          </a>
          <ThemeControl />
        </div>
      </div>
    </header>
  )
}
