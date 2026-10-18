import { spawnSync } from "node:child_process"
import { mkdir, readdir, writeFile } from "node:fs/promises"
import { resolve } from "node:path"
import vnuJar from "vnu-jar"
import vnuPackage from "vnu-jar/package.json" with { type: "json" }

const directory = resolve("web/dist/client")
const files = (await readdir(directory, { recursive: true }))
  .filter((file) => file.endsWith(".html"))
  .map((file) => resolve(directory, file))
if (!files.length)
  throw new Error("No generated HTML found. Run pnpm build first.")

const java = process.env.JAVA || "java"
const result = spawnSync(
  java,
  ["-jar", String(vnuJar), "--format", "json", "--stdout", ...files],
  { encoding: "utf8", maxBuffer: 16 * 1024 * 1024 }
)
if (result.error) throw result.error
if (!result.stdout.trim()) {
  throw new Error(result.stderr || `Nu exited with status ${result.status}`)
}
const report = JSON.parse(result.stdout)
if (!Array.isArray(report.messages)) throw new Error("Invalid Nu report")

// Nu's CSS parser does not yet recognize this CSSWG-defined rule. Retain its
// diagnostics in the report; exempt only this exact message from the HTML gate.
// https://www.w3.org/TR/css-view-transitions-2/#view-transition-rule
const unsupportedViewTransition = "CSS: Unrecognized at-rule “@view-transition”"
const errors = report.messages.filter(
  (message) =>
    (message.type === "error" || message.type === "non-document-error") &&
    message.message !== unsupportedViewTransition
)
const cssLimitations = report.messages.filter(
  (message) => message.message === unsupportedViewTransition
)
const warnings = report.messages.filter(
  (message) => message.subType === "warning"
)
const base = process.env.SITE_BASE_PATH || "/"
const label = base === "/" ? "root" : "subpath"
const output = resolve(".cache/audits", label)
await mkdir(output, { recursive: true })
await writeFile(
  resolve(output, "w3c.json"),
  JSON.stringify(
    {
      checkedAt: new Date().toISOString(),
      checkerVersion: vnuPackage.version,
      base,
      files: files.length,
      htmlErrors: errors.length,
      knownCssParserLimitations: cssLimitations.length,
      warnings: warnings.length,
      ...report,
    },
    null,
    2
  )
)
console.log(
  `Nu: ${files.length} HTML files, ${errors.length} errors, ${warnings.length} warnings, ${cssLimitations.length} known @view-transition parser diagnostics. Report: ${output}/w3c.json`
)
for (const message of errors) {
  console.error(`${message.url}:${message.lastLine}: ${message.message}`)
}
if (errors.length || result.signal || ![0, 1].includes(result.status)) {
  process.exitCode = 1
}
