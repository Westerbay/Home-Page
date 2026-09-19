import { fileURLToPath } from "node:url"
const base = (process.env.SITE_BASE_PATH || "/").replace(/\/$/, "")
/** @type {import("@inlang/paraglide-js").CompilerOptions} */
export const paraglideConfig = {
  project: fileURLToPath(new URL("./project.inlang", import.meta.url)),
  outdir: fileURLToPath(new URL("./src/generated", import.meta.url)),
  strategy: ["url", "baseLocale"],
  outputStructure: "message-modules",
  emitTsDeclarations: true,
  urlPatterns: [
    {
      pattern: `${base}/:path(.*)?`,
      localized: [
        ["en", `${base}/en/:path(.*)?`],
        ["fr", `${base}/:path(.*)?`],
      ],
    },
  ],
}
