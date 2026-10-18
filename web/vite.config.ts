import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import { tanstackStart } from "@tanstack/react-start/plugin/vite"
import tailwindcss from "@tailwindcss/vite"
import { paraglideVitePlugin } from "@inlang/paraglide-js"
import { paraglideConfig } from "../packages/i18n/paraglide.config.mjs"
import { guideEndpoint } from "./src/features/guide/protocol.ts"
import {
  localizedPagePath,
  publicPagePaths,
  siteLocales,
} from "./src/lib/site.ts"
const base = process.env.SITE_BASE_PATH || "/"
const endpoint = guideEndpoint(
  process.env.VITE_GUIDE_ENABLED,
  process.env.VITE_GUIDE_URL
)
const guideOrigin = endpoint ? new URL(endpoint).origin : ""
export default defineConfig(({ command }) => ({
  base,
  envDir: false,
  define: {
    "import.meta.env.VITE_GUIDE_ENABLED": JSON.stringify(
      endpoint ? "true" : "false"
    ),
    "import.meta.env.VITE_GUIDE_URL": JSON.stringify(guideOrigin),
  },
  resolve: { tsconfigPaths: true },
  plugins: [
    ...(command === "serve" ? [paraglideVitePlugin(paraglideConfig)] : []),
    tailwindcss(),
    tanstackStart({
      router: { basepath: base },
      prerender: {
        enabled: true,
        autoSubfolderIndex: true,
        autoStaticPathsDiscovery: false,
        crawlLinks: false,
        failOnError: true,
      },
      pages: publicPagePaths
        .flatMap((path) =>
          siteLocales.map((locale) => localizedPagePath(path, locale))
        )
        .map((path) => ({ path, prerender: { enabled: true } })),
    }),
    react(),
  ],
}))
