import { createRouter } from "@tanstack/react-router"
import { deLocalizeUrl, localizeUrl } from "@workspace/i18n/runtime"
import { routeTree } from "./routeTree.gen"
import { rewriteWithBase } from "./lib/i18n/url-rewrite"

export function getRouter() {
  const base = import.meta.env.BASE_URL
  return createRouter({
    routeTree,
    basepath: base,
    trailingSlash: "always",
    scrollRestoration: true,
    defaultPreload: "intent",
    rewrite: {
      input: ({ url }) => rewriteWithBase(url, base, deLocalizeUrl),
      output: ({ url }) => rewriteWithBase(url, base, localizeUrl),
    },
  })
}
declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof getRouter>
  }
}
