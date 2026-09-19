import { createServer } from "node:http"
import { readFile, stat } from "node:fs/promises"
import { resolve, extname, sep } from "node:path"
const root = resolve("apps/web/dist/client")
const base = (process.env.SITE_BASE_PATH || "/").replace(/\/$/, "")
const types = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".woff2": "font/woff2",
  ".jpg": "image/jpeg",
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
    const body = await readFile(file)
    res.writeHead(200, {
      "Content-Type": types[extname(file)] || "application/octet-stream",
      "Cache-Control": "no-cache",
    })
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
