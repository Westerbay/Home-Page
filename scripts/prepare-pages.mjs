import { cp, mkdir, writeFile } from "node:fs/promises"
import { resolve } from "node:path"
const output = resolve("apps/web/dist/client")
const base = process.env.SITE_BASE_PATH || "/"
await mkdir(output, { recursive: true })
// Historical project pages still consume these paths.
for (const folder of ["img", "logo", "dev", "style", "script"]) {
  await cp(resolve(folder), resolve(output, folder), { recursive: true })
}
for (const [from, to] of [
  ["About.html", "about"],
  ["Project.html", "projects"],
  ["Prototype.html", "projects"],
]) {
  await writeFile(
    resolve(output, from),
    `<!doctype html><html lang="fr"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta http-equiv="refresh" content="0;url=${base + to}"><title>Mathis Dubuisson</title><a href="${base + to}">Continuer vers le portfolio</a></html>`
  )
}
await writeFile(resolve(output, ".nojekyll"), "")
await writeFile(
  resolve(output, "404.html"),
  `<!doctype html><html lang="fr"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>Page introuvable · Mathis Dubuisson</title><style>:root{color-scheme:light dark}body{font:18px system-ui;max-width:650px;margin:15vh auto;padding:24px}a{color:inherit}h1{font:44px Georgia}</style><h1>Page introuvable</h1><p>Cette page n’existe pas ou a changé d’adresse.</p><p><a href="${base}">Retour à l’accueil</a> · <a href="${base}en/">Home in English</a></p></html>`
)
console.log("Static Pages output ready; historical assets preserved.")
