import { spawn } from "node:child_process"
import { mkdir, readFile, writeFile } from "node:fs/promises"
import { resolve } from "node:path"
import { fileURLToPath } from "node:url"
import { createServer } from "node:net"
import { chromium } from "@playwright/test"

const base = process.env.SITE_BASE_PATH || "/"
const port = process.env.AUDIT_PORT || "4176"
const origin = `http://127.0.0.1:${port}`
const desktop = process.argv.includes("--desktop")
const requestedPaths = process.argv
  .slice(2)
  .filter((arg) => arg !== "--desktop")
const paths = requestedPaths.length
  ? requestedPaths
  : [
      "/",
      "/projects/",
      "/projects/spellwar/",
      "/projects/pinnacle/",
      "/about/",
      "/en/",
    ]
const label = base === "/" ? "root" : "subpath"
const output = resolve(".cache/audits", label, "lighthouse")
await mkdir(output, { recursive: true })

const server = spawn(process.execPath, ["scripts/serve.mjs"], {
  env: { ...process.env, PORT: port, PREVIEW_COMPRESSION: "true" },
  stdio: ["ignore", "pipe", "inherit"],
})
await new Promise((ready, reject) => {
  server.once("error", reject)
  server.once("exit", (code) => reject(new Error(`Preview exited: ${code}`)))
  server.stdout.once("data", ready)
})
const summaries = []
let browser
try {
  // Launch the installed Playwright Chromium ourselves. Chrome Launcher's WSL
  // discovery otherwise assumes Windows Chrome and Windows profile directories.
  const probe = createServer()
  await new Promise((ready, reject) => {
    probe.once("error", reject)
    probe.listen(0, "127.0.0.1", ready)
  })
  const address = probe.address()
  if (!address || typeof address === "string") throw new Error("No debug port")
  const debugPort = address.port
  await new Promise((done) => probe.close(done))
  browser = await chromium.launch({
    args: [
      `--remote-debugging-port=${debugPort}`,
      "--use-angle=swiftshader",
      "--enable-unsafe-swiftshader",
    ],
  })
  for (const path of paths) {
    if (!path.startsWith("/") || path.startsWith("//")) {
      throw new Error(`Expected a local page path: ${path}`)
    }
    const url = origin + base + path.slice(1)
    const name =
      (path.replace(/^\/+|\/+$/g, "").replaceAll("/", "-") || "home") +
      (desktop ? "-desktop" : "-mobile")
    const prefix = resolve(output, name)
    const args = [
      fileURLToPath(import.meta.resolve("lighthouse/cli/index.js")),
      url,
      "--quiet",
      "--only-categories=performance,accessibility,best-practices,seo",
      "--output=json",
      "--output=html",
      `--output-path=${prefix}`,
      `--port=${debugPort}`,
    ]
    if (desktop) args.push("--preset=desktop")
    const exitCode = await new Promise((done, reject) => {
      const child = spawn(process.execPath, args, {
        env: process.env,
        stdio: "inherit",
      })
      child.once("error", reject)
      child.once("exit", done)
    })
    if (exitCode !== 0)
      throw new Error(`Lighthouse failed for ${url}: ${exitCode}`)
    const report = JSON.parse(await readFile(prefix + ".report.json", "utf8"))
    if (report.runtimeError) throw new Error(report.runtimeError.message)
    const scores = Object.fromEntries(
      Object.entries(report.categories).map(([id, category]) => {
        if (typeof category.score !== "number") {
          throw new Error(`Lighthouse did not score ${id} for ${url}`)
        }
        return [id, Math.round(category.score * 100)]
      })
    )
    const summary = {
      path,
      mode: desktop ? "desktop" : "mobile",
      lighthouseVersion: report.lighthouseVersion,
      scores,
      metrics: {
        lcpMs: report.audits["largest-contentful-paint"].numericValue,
        cls: report.audits["cumulative-layout-shift"].numericValue,
        tbtMs: report.audits["total-blocking-time"].numericValue,
      },
      report: prefix + ".report.html",
    }
    summaries.push(summary)
    console.log(JSON.stringify(summary))
  }
  await writeFile(
    resolve(output, desktop ? "summary-desktop.json" : "summary-mobile.json"),
    JSON.stringify(summaries, null, 2)
  )
} finally {
  await browser?.close()
  server.kill()
}
