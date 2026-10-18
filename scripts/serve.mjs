import { createServer } from "node:http"
import { readFile, stat } from "node:fs/promises"
import { resolve, extname, sep } from "node:path"
import { gzip } from "node:zlib"
import { promisify } from "node:util"
const compress = promisify(gzip)
const root = resolve("web/dist/client")
const base = (process.env.SITE_BASE_PATH || "/").replace(/\/$/, "")
const types = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".xml": "application/xml; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".png": "image/png",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".woff2": "font/woff2",
  ".jpg": "image/jpeg",
  ".mp4": "video/mp4",
}
const server = createServer(async (req, res) => {
  try {
    const url = new URL(req.url, "http://localhost")
    const pathname = decodeURIComponent(url.pathname)
    if (base && pathname !== base && !pathname.startsWith(base + "/"))
      throw Error("Not found")
    const local = pathname.slice(base.length) || "/"
    let file = resolve(root, "." + local)
    if (file !== root && !file.startsWith(root + sep)) throw Error("Not found")
    if ((await stat(file)).isDirectory()) file = resolve(file, "index.html")
    let body = await readFile(file)
    const contentType = types[extname(file)] || "application/octet-stream"
    const headers = {
      "Content-Type": contentType,
      "Cache-Control": "no-cache",
    }
    if (
      process.env.PREVIEW_COMPRESSION === "true" &&
      /^(text\/|application\/(javascript|json|xml)|image\/svg)/.test(
        contentType
      )
    ) {
      headers.Vary = "Accept-Encoding"
      const acceptsGzip = (req.headers["accept-encoding"] || "")
        .split(",")
        .some((encoding) =>
          /^gzip(?:\s*;\s*q=(?:1(?:\.0*)?|0\.\d*[1-9]\d*))?$/i.test(
            encoding.trim()
          )
        )
      if (acceptsGzip) {
        body = await compress(body)
        headers["Content-Encoding"] = "gzip"
      }
    }
    res.writeHead(200, headers)
    res.end(body)
  } catch {
    res.writeHead(404, { "Content-Type": "text/html; charset=utf-8" })
    res.end(await readFile(resolve(root, "404.html")).catch(() => "Not found"))
  }
})
server.listen(Number(process.env.PORT || 4174), "127.0.0.1", () =>
  console.log(
    "Portfolio: http://127.0.0.1:" + (process.env.PORT || 4174) + base + "/"
  )
)
