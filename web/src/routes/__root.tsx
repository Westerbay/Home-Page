import * as m from "@workspace/i18n/messages"

import type { ReactNode } from "react"
import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRoute,
} from "@tanstack/react-router"
import { ThemeProvider } from "next-themes"
import { getLocale } from "@workspace/i18n/runtime"
import { Toaster } from "@workspace/ui/components/sonner"
import { Header } from "../components/header"
import { Footer } from "../components/footer"
import { NotFound } from "../components/not-found"
import { assetUrl } from "../lib/assets"
import uiCss from "@workspace/ui/globals.css?url"
import siteCss from "../styles.css?url"
import guideCss from "../features/guide/guide.css?url"
import { GuideProvider } from "../features/guide/guide-provider"
import { GuideDock } from "../features/guide/guide-dock"
import { GUIDE_ENABLED } from "../features/guide/config"

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { name: "theme-color", content: "#fffefc" },
    ],
    links: [
      { rel: "stylesheet", href: uiCss },
      { rel: "stylesheet", href: siteCss },
      { rel: "stylesheet", href: guideCss },
      {
        rel: "icon",
        type: "image/webp",
        href: assetUrl("assets/avatar-128.webp"),
      },
    ],
  }),
  component: Layout,
  shellComponent: Document,
  notFoundComponent: NotFound,
  errorComponent: () => (
    <div className="inner-page">
      <h1>{m.page_error()}</h1>
      <a href={import.meta.env.BASE_URL}>{m.return_home()}</a>
    </div>
  ),
})
function Layout() {
  return (
    <GuideProvider>
      <div className="site-frame">
        <a
          className="skip-link"
          href="#main-content"
          onClick={(event) => {
            event.preventDefault()
            document.getElementById("main-content")?.focus()
          }}
        >
          {m.skip()}
        </a>
        <div className="site-container">
          <Header />
          <main id="main-content" tabIndex={-1}>
            <Outlet />
            <GuideDock />
          </main>
          <Footer />
        </div>
      </div>
    </GuideProvider>
  )
}
function Document({ children }: { children: ReactNode }) {
  return (
    <html lang={getLocale()} suppressHydrationWarning>
      <head>
        {/* Keep cross-document opt-in stable while routed styles hydrate. */}
        <style>{`
          @view-transition { navigation: auto; }
          @media (prefers-reduced-motion: reduce) {
            @view-transition { navigation: none; }
          }
        `}</style>
        <HeadContent />
      </head>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          storageKey="portfolio-theme"
        >
          {children}
          <Toaster position={GUIDE_ENABLED ? "top-center" : "bottom-right"} />
        </ThemeProvider>
        <Scripts />
      </body>
    </html>
  )
}
