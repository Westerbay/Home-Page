import { mkdir, writeFile } from "node:fs/promises"
import { resolve } from "node:path"
import {
  defaultSiteLocale,
  pageUrl,
  publicPagePaths,
  SITE_ORIGIN,
  siteLocales,
} from "../web/src/lib/site.ts"
const output = resolve("web/dist/client")
const base = process.env.SITE_BASE_PATH || "/"
await mkdir(output, { recursive: true })
for (const [from, to] of [
  ["About.html", "about/"],
  ["Project.html", "projects/"],
  ["Prototype.html", "projects/"],
]) {
  await writeFile(
    resolve(output, from),
    `<!doctype html><html lang="fr"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta http-equiv="refresh" content="0; url=${base + to}"><title>Mathis Dubuisson</title><a href="${base + to}">Continuer vers le portfolio</a></html>`
  )
}
await writeFile(resolve(output, ".nojekyll"), "")
const sitemapEntries = publicPagePaths.flatMap((path) => {
  const alternatives = [...siteLocales, "x-default"]
    .map((locale) => {
      const targetLocale = locale === "x-default" ? defaultSiteLocale : locale
      return `    <xhtml:link rel="alternate" hreflang="${locale}" href="${pageUrl(path, targetLocale, base)}"/>`
    })
    .join("\n")
  return siteLocales.map(
    (locale) =>
      `  <url>\n    <loc>${pageUrl(path, locale, base)}</loc>\n${alternatives}\n  </url>`
  )
})
await writeFile(
  resolve(output, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${sitemapEntries.join("\n")}\n</urlset>\n`
)
await writeFile(
  resolve(output, "robots.txt"),
  `User-agent: *\nAllow: /\n\nSitemap: ${new URL(base + "sitemap.xml", SITE_ORIGIN).href}\n`
)
await writeFile(
  resolve(output, "404.html"),
  `<!doctype html><html lang="fr"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>Page introuvable · Mathis Dubuisson</title><style>:root{color-scheme:light dark}body{font:18px system-ui;max-width:650px;margin:15vh auto;padding:24px}a{color:inherit}h1{font:44px Georgia}</style><h1>Page introuvable</h1><p>Cette page n’existe pas ou a changé d’adresse.</p><p><a href="${base}">Retour à l’accueil</a> · <a href="${base}en/">Home in English</a></p></html>`
)
console.log("Static Pages output ready with legacy URL redirects.")
