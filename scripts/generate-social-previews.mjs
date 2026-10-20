import { chromium } from "@playwright/test"
import { copyFile, mkdir, readFile, stat } from "node:fs/promises"
import { dirname, join, resolve } from "node:path"
import { fileURLToPath } from "node:url"
import { parseArgs } from "node:util"

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..")
const assets = join(root, "web/public/assets")
const { values } = parseArgs({
  options: { "output-dir": { type: "string" } },
})
const output = values["output-dir"]
  ? resolve(root, values["output-dir"])
  : join(assets, "social")
const dataUrl = async (path, mime) =>
  `data:${mime};base64,${(await readFile(path)).toString("base64")}`

const previews = [
  { slug: "booster-break", images: ["booster-break/foil.webp"] },
  {
    slug: "spellwar",
    images: ["spellwar/gravity-transition-poster.webp"],
    kind: "contained",
  },
  { slug: "plants", images: ["plants-render.png"], kind: "plants" },
  { slug: "eyefox", images: ["eyefox/android-game.webp"], kind: "contained" },
  {
    slug: "pinnacle",
    images: ["pinnacle/regions-relu.webp"],
    kind: "contained",
  },
  {
    slug: "stylegan-cheap-dit",
    images: [
      "stylegan-cheap-dit/dit-epoch-200-01.webp",
      "stylegan-cheap-dit/dit-epoch-200-03.webp",
      "stylegan-cheap-dit/dit-epoch-230-01.webp",
      "stylegan-cheap-dit/dit-epoch-230-07.webp",
    ],
    kind: "samples",
  },
]

function document(kind, images) {
  return `<!doctype html><html><head><meta charset="utf-8"><style>
* { box-sizing: border-box; }
html, body { margin: 0; width: 1200px; height: 630px; overflow: hidden; }
body { background: #202020; }
main { width: 1200px; height: 630px; position: relative; overflow: hidden; }
img { display: block; width: 100%; height: 100%; object-fit: cover; }
.contained img { object-fit: contain; }
.plants { background: #f6f4ee; }
.plants img { position: absolute; width: 1240px; height: 930px; left: -20px; top: -150px; object-fit: contain; }
.samples { display: grid; grid-template-columns: repeat(4, 1fr); gap: 3px; }
</style></head><body><main class="${kind ?? ""}">${images.join("")}</main></body></html>`
}

const browser = await chromium.launch({ channel: "chromium" })
try {
  const page = await browser.newPage({
    viewport: { width: 1200, height: 630 },
    deviceScaleFactor: 1,
  })
  await mkdir(join(output, "en"), { recursive: true })
  for (const preview of previews) {
    const images = await Promise.all(
      preview.images.map(async (image) => {
        const mime = image.endsWith(".png") ? "image/png" : "image/webp"
        return `<img src="${await dataUrl(join(assets, image), mime)}" alt="">`
      })
    )
    await page.setContent(document(preview.kind, images), { waitUntil: "load" })
    await page.evaluate(async () => {
      await Promise.all([...document.images].map((image) => image.decode()))
    })
    const path = join(output, `${preview.slug}.jpg`)
    await page.screenshot({ path, type: "jpeg", quality: 90 })
    const dimensions = await page.evaluate(
      async (source) => {
        const image = new Image()
        image.src = source
        await image.decode()
        return [image.naturalWidth, image.naturalHeight]
      },
      await dataUrl(path, "image/jpeg")
    )
    if (dimensions[0] !== 1200 || dimensions[1] !== 630)
      throw new Error(`${preview.slug}: unexpected JPEG dimensions`)
    // Keep existing localized URLs; image-only compositions are shared by both locales.
    await copyFile(path, join(output, "en", `${preview.slug}.jpg`))
    console.log(`${preview.slug}.jpg (FR/EN): ${(await stat(path)).size} bytes`)
  }
} finally {
  await browser.close()
}
