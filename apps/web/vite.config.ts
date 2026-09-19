import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import { tanstackStart } from "@tanstack/react-start/plugin/vite"
import tailwindcss from "@tailwindcss/vite"
import { paraglideVitePlugin } from "@inlang/paraglide-js"
import { paraglideConfig } from "../../packages/i18n/paraglide.config.mjs"
const base = process.env.SITE_BASE_PATH || "/"
const paths = [
  "/",
  "/projects",
  "/projects/spellwar",
  "/projects/plants",
  "/projects/eyefox",
  "/about",
  "/contact",
]
export default defineConfig(({ command }) => ({
  base,
  envDir: false,
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
      pages: paths
        .flatMap((path) => [path, path === "/" ? "/en" : "/en" + path])
        .map((path) => ({ path, prerender: { enabled: true } })),
    }),
    react(),
  ],
}))
