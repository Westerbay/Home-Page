import { chromium } from "@playwright/test"
import { mkdir, readFile, stat } from "node:fs/promises"
import { createRequire } from "node:module"
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
const uiRequire = createRequire(join(root, "packages/ui/package.json"))
const dataUrl = async (path, mime) =>
  `data:${mime};base64,${(await readFile(path)).toString("base64")}`
const jersey = await dataUrl(
  uiRequire.resolve(
    "@fontsource/jersey-10/files/jersey-10-latin-400-normal.woff2"
  ),
  "font/woff2"
)
const spaceMono = await dataUrl(
  uiRequire.resolve(
    "@fontsource/space-mono/files/space-mono-latin-400-normal.woff2"
  ),
  "font/woff2"
)

const previews = [
  {
    slug: "default",
    category: "Projets & explorations",
    title: "Mathis<br>Dubuisson",
    description: "Product & Software Engineer",
    detail: "Jeux · rendu 3D · IA",
    image: "plants-render.png",
    transparent: true,
    large: true,
    en: {
      category: "Projects & explorations",
      description: "Product & Software Engineer",
      detail: "Games · 3D rendering · AI",
    },
  },
  {
    slug: "booster-break",
    category: "Jeu web",
    title: "Booster<br>Break",
    description: "Cartes à collectionner,<br>échanges et duels",
    detail: "TypeScript · React · WebGL",
    image: "booster-break/packs.webp",
    en: {
      category: "Web game",
      description: "Collectible cards,<br>trading and duels",
    },
  },
  {
    slug: "spellwar",
    category: "Moteur 3D",
    title: "SpellWar",
    description: "Un jeu en C++ et OpenGL,<br>avec un moteur maison",
    detail: "Physique · collisions · rendu PBR",
    image: "spellwar/engine-world.webp",
    en: {
      category: "3D engine",
      description: "A C++ and OpenGL game,<br>powered by a custom engine",
      detail: "Physics · collisions · PBR rendering",
    },
  },
  {
    slug: "plants",
    category: "Génération 3D",
    title: "The Algorithmic<br>Beauty of Plants",
    description: "Des règles, des branches,<br>un explorateur WebGL",
    detail: "L-systems · WebGL",
    image: "plants-render.png",
    transparent: true,
    compact: true,
    en: {
      category: "3D generation",
      description: "Rules, branches,<br>and a WebGL explorer",
    },
  },
  {
    slug: "eyefox",
    category: "Jeu Android",
    title: "Eyefox<br>Puzzle",
    description:
      "Deux grilles à rendre identiques,<br>des cases qui s’inversent ensemble",
    detail: "Java · Android",
    image: "eyefox/android-game.webp",
    en: {
      category: "Android game",
      description: "Match two grids by flipping<br>a cell and its neighbours",
    },
  },
  {
    slug: "pinnacle",
    category: "IA & sciences",
    title: "PINNacle",
    description:
      "Voir les régions d’activation<br>des réseaux informés par la physique",
    detail: "PyTorch · C++ · OpenGL",
    image: "pinnacle/cover.webp",
    en: {
      category: "AI & science",
      description:
        "Visualising activation regions<br>in physics-informed neural networks",
    },
  },
  {
    slug: "stylegan-cheap-dit",
    category: "Génération d’images",
    title: "StyleGAN &<br>Cheap DiT",
    description:
      "Deux modèles expérimentaux,<br>leurs résultats d’entraînement",
    detail: "PyTorch · GAN · diffusion",
    image: "stylegan-cheap-dit/cover.webp",
    en: {
      category: "Image generation",
      description: "Two experimental models,<br>their training results",
      detail: "PyTorch · GAN · diffusion",
    },
  },
]

function document(preview, image, locale) {
  const frameClass = preview.transparent ? "frame transparent" : "frame"
  let titleClass = ""
  if (preview.compact) titleClass = "compact"
  if (preview.large) titleClass = "large"
  return `<!doctype html>
<html lang="${locale}"><head><meta charset="utf-8"><style>
@font-face { font-family: 'Jersey 10'; src: url('${jersey}'); font-weight: 400; }
@font-face { font-family: 'Space Mono'; src: url('${spaceMono}'); font-weight: 400; }
* { box-sizing: border-box; }
html, body { margin: 0; width: 1200px; height: 630px; overflow: hidden; }
body { background: #fffefc; color: #242420; font-family: 'Space Mono', monospace; }
.page { width: 1200px; height: 630px; padding: 42px 48px 32px; }
header { display: flex; align-items: center; justify-content: space-between;
  height: 40px; font-size: 22px; letter-spacing: -.6px; }
.identity { display: flex; align-items: center; gap: 13px; }
.square { width: 12px; height: 12px; background: #e99245; }
.portfolio { font-size: 15px; color: #716f68; letter-spacing: 1.8px; text-transform: uppercase; }
.rule { height: 1px; background: #dcd9d1; margin-top: 17px; }
main { display: grid; grid-template-columns: 460px 1fr; gap: 26px; height: 430px; align-items: center; }
.category { margin: 0 0 22px; font-size: 13px; color: #6d6b63; text-transform: uppercase; letter-spacing: 2px; }
h1 { font: 400 64px/1.04 'Jersey 10', sans-serif; margin: 0; }
h1.compact { font-size: 45px; line-height: 1.13; }
h1.large { font-size: 76px; }
.description { margin: 25px 0 0; color: #5f5d56; font-size: 21px; line-height: 1.55; letter-spacing: -.5px; }
.frame { width: 618px; height: 356px; display: flex; justify-content: center; align-items: center;
  border: 1px solid #dcd9d1; background: #202020; }
.frame img { display: block; width: 100%; height: 100%; object-fit: contain; }
.frame.transparent { background: #f6f4ee; height: 390px; }
.frame.transparent img { padding: 18px; }
footer { display: flex; justify-content: space-between; align-items: center; border-top: 1px solid #dcd9d1;
  height: 65px; padding-top: 4px; font-size: 15px; color: #6d6b63; }
.footer-detail { display: flex; align-items: center; gap: 12px; }
.dash { width: 27px; height: 3px; background: #e99245; }
.arrow { color: #242420; font-size: 26px; line-height: 1; }
</style></head><body><div class="page">
<header><div class="identity"><i class="square"></i><span>Mathis Dubuisson</span></div><span class="portfolio">Portfolio</span></header>
<div class="rule"></div><main><div class="copy"><p class="category">${preview.category}</p>
<h1 class="${titleClass}">${preview.title}</h1><p class="description">${preview.description}</p></div>
<div class="${frameClass}"><img src="${image}" alt=""></div></main>
<footer><span class="footer-detail"><i class="dash"></i>${preview.detail}</span><span class="arrow">↗</span></footer>
</div></body></html>`
}

const browser = await chromium.launch()
try {
  const page = await browser.newPage({
    viewport: { width: 1200, height: 630 },
    deviceScaleFactor: 1,
  })
  for (const locale of ["fr", "en"]) {
    const directory = locale === "fr" ? output : join(output, locale)
    await mkdir(directory, { recursive: true })
    for (const source of previews) {
      const preview = locale === "en" ? { ...source, ...source.en } : source
      const mime = preview.image.endsWith(".png") ? "image/png" : "image/webp"
      const image = await dataUrl(join(assets, preview.image), mime)
      await page.setContent(document(preview, image, locale), {
        waitUntil: "load",
      })
      const layoutErrors = await page.evaluate(async () => {
        await document.fonts.ready
        await Promise.all([...document.images].map((image) => image.decode()))
        const errors = []
        for (const family of ["Jersey 10", "Space Mono"]) {
          const loaded = [...document.fonts].some(
            (font) =>
              font.family.replaceAll('"', "").replaceAll("'", "") === family &&
              font.status === "loaded"
          )
          if (!loaded) errors.push(`${family} did not load`)
        }
        const regions = [
          ".identity",
          ".portfolio",
          ".copy",
          ".frame",
          ".footer-detail",
          ".arrow",
        ].map((selector) => ({
          selector,
          rect: document.querySelector(selector).getBoundingClientRect(),
        }))
        for (const { selector, rect } of regions) {
          if (
            rect.left < 48 ||
            rect.right > 1152 ||
            rect.top < 42 ||
            rect.bottom > 598
          ) {
            errors.push(`${selector} escapes the page padding`)
          }
        }
        for (let first = 0; first < regions.length; first++) {
          for (let second = first + 1; second < regions.length; second++) {
            const a = regions[first]
            const b = regions[second]
            const width =
              Math.min(a.rect.right, b.rect.right) -
              Math.max(a.rect.left, b.rect.left)
            const height =
              Math.min(a.rect.bottom, b.rect.bottom) -
              Math.max(a.rect.top, b.rect.top)
            if (width > 1 && height > 1)
              errors.push(`${a.selector} overlaps ${b.selector}`)
          }
        }
        for (const element of document.querySelectorAll(
          ".copy > *, .identity, .portfolio, .footer-detail"
        )) {
          if (element.scrollWidth > element.clientWidth)
            errors.push(`${element.className || element.tagName} overflows`)
        }
        return errors
      })
      if (layoutErrors.length)
        throw new Error(`${locale}/${preview.slug}: ${layoutErrors.join("; ")}`)
      const path = join(directory, `${preview.slug}.jpg`)
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
        throw new Error(`${locale}/${preview.slug}: unexpected JPEG dimensions`)
      console.log(
        `${locale}/${preview.slug}.jpg: ${(await stat(path)).size} bytes`
      )
    }
  }
} finally {
  await browser.close()
}
