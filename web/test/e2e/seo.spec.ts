import { test, expect } from "@playwright/test"
import { publicPagePaths } from "../../src/lib/site"

const origin = "https://portfolio.mathis-db.com"

function previewUrl(baseURL: string | undefined) {
  if (!baseURL) throw new Error("The SEO tests require a preview baseURL")
  return new URL(baseURL)
}

for (const locale of ["fr", "en"]) {
  test(`prerendered ${locale} pages expose complete, consistent SEO metadata`, async ({
    page,
    request,
    baseURL,
  }) => {
    const preview = previewUrl(baseURL)
    const base = preview.pathname
    const prefix = locale === "en" ? "en/" : ""
    const checkedImages = new Set<string>()
    for (const path of publicPagePaths) {
      const route = prefix + path.slice(1)
      const response = await request.get(new URL(route, preview).href)
      expect(response.status(), route).toBe(200)
      const html = await response.text()
      expect(html, `No invalid NUL in ${route}`).not.toContain("\u0000")
      // Parse the served HTML without hydration or resource requests.
      const head = await page.evaluate((html) => {
        const document = new DOMParser().parseFromString(html, "text/html")
        return {
          lang: document.documentElement.lang,
          title: document.title,
          meta: Object.fromEntries(
            Array.from(
              document.querySelectorAll("meta[name], meta[property]"),
              (tag) => [
                tag.getAttribute("name") ?? tag.getAttribute("property"),
                tag.getAttribute("content"),
              ]
            )
          ),
          canonicals: Array.from(
            document.querySelectorAll('link[rel="canonical"]'),
            (link) => link.getAttribute("href")
          ),
          alternatives: Array.from(
            document.querySelectorAll('link[rel="alternate"][hreflang]'),
            (link) => [link.getAttribute("hreflang"), link.getAttribute("href")]
          ),
        }
      }, html)
      const canonical = origin + base + route
      expect(head.lang, route).toBe(locale)
      expect(head.title).toContain("Mathis Dubuisson")
      expect(head.meta.description?.length).toBeGreaterThan(25)
      expect(head.canonicals, route).toEqual([canonical])
      expect(head.alternatives, route).toEqual([
        ["fr", origin + base + path.slice(1)],
        ["en", origin + base + "en/" + path.slice(1)],
        ["x-default", origin + base + path.slice(1)],
      ])
      expect(head.meta["og:url"]).toBe(canonical)
      expect(head.meta["og:title"]).toBe(head.title)
      expect(head.meta["og:description"]).toBe(head.meta.description)
      expect(head.meta["og:type"]).toBe("website")
      expect(head.meta["og:site_name"]).toBe("Mathis Dubuisson")
      expect(head.meta["og:locale"]).toBe(locale === "fr" ? "fr_FR" : "en_GB")
      expect(head.meta["og:locale:alternate"]).toBe(
        locale === "fr" ? "en_GB" : "fr_FR"
      )
      const project = path.match(/^\/projects\/([^/]+)\/$/)
      const imagePath = `assets/social/${prefix}${project?.[1] ?? "default"}.jpg`
      expect(head.meta["og:image"]).toBe(origin + base + imagePath)
      expect(head.meta["og:image:type"]).toBe("image/jpeg")
      expect(head.meta["og:image:width"]).toBe("1200")
      expect(head.meta["og:image:height"]).toBe("630")
      expect(head.meta["og:image:alt"]?.length).toBeGreaterThan(20)
      expect(head.meta["twitter:card"]).toBe("summary_large_image")
      expect(head.meta["twitter:title"]).toBe(head.title)
      expect(head.meta["twitter:description"]).toBe(head.meta.description)
      expect(head.meta["twitter:image"]).toBe(head.meta["og:image"])
      expect(head.meta["twitter:image:alt"]).toBe(head.meta["og:image:alt"])
      if (!checkedImages.has(imagePath)) {
        // Check the future public image locally, never against production.
        const image = await request.get(new URL(imagePath, preview).href)
        expect(image.status(), imagePath).toBe(200)
        expect(image.headers()["content-type"]).toContain("image/jpeg")
        checkedImages.add(imagePath)
      }
    }
  })
}

test("sitemap and robots match the localized static pages", async ({
  page,
  request,
  baseURL,
}) => {
  const preview = previewUrl(baseURL)
  const base = preview.pathname
  const response = await request.get(new URL("sitemap.xml", preview).href)
  expect(response.status()).toBe(200)
  const sitemap = await page.evaluate(
    (xml) => {
      const document = new DOMParser().parseFromString(xml, "application/xml")
      return {
        error: Boolean(document.querySelector("parsererror")),
        pages: Array.from(document.getElementsByTagName("url"), (entry) => ({
          url: entry.getElementsByTagName("loc")[0]?.textContent,
          alternatives: Array.from(
            entry.getElementsByTagNameNS(
              "http://www.w3.org/1999/xhtml",
              "link"
            ),
            (link) => [link.getAttribute("hreflang"), link.getAttribute("href")]
          ),
        })),
      }
    },
    await response.text()
  )
  expect(sitemap.error).toBe(false)
  const expected = publicPagePaths.flatMap((path) => [
    origin + base + path.slice(1),
    origin + base + "en/" + path.slice(1),
  ])
  expect(sitemap.pages.map((entry) => entry.url)).toEqual(expected)
  for (const entry of sitemap.pages) {
    expect(entry.alternatives).toHaveLength(3)
    expect(entry.alternatives.map(([locale]) => locale)).toEqual([
      "fr",
      "en",
      "x-default",
    ])
    for (const [, href] of entry.alternatives) expect(expected).toContain(href)
  }
  const robots = await request.get(new URL("robots.txt", preview).href)
  expect(robots.status()).toBe(200)
  expect(await robots.text()).toBe(
    `User-agent: *\nAllow: /\n\nSitemap: ${origin}${base}sitemap.xml\n`
  )
})

test("language links preserve the project without JavaScript", async ({
  browser,
  baseURL,
}) => {
  const preview = previewUrl(baseURL)
  const context = await browser.newContext({
    javaScriptEnabled: false,
    reducedMotion: "reduce",
  })
  const page = await context.newPage()
  await page.goto(new URL("projects/pinnacle/", preview).href)
  const language = page.locator("a.language-button")
  await expect(language).toHaveAttribute("hreflang", "en")
  await expect(language).toHaveAttribute(
    "href",
    preview.pathname + "en/projects/pinnacle/"
  )
  await language.click()
  await expect(page).toHaveURL(new URL("en/projects/pinnacle/", preview).href)
  await expect(page.locator("html")).toHaveAttribute("lang", "en")
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("PINNacle")
  await expect(language).toHaveAttribute(
    "href",
    preview.pathname + "projects/pinnacle/"
  )
  await language.click()
  await expect(page).toHaveURL(new URL("projects/pinnacle/", preview).href)
  await expect(page.locator("html")).toHaveAttribute("lang", "fr")
  await context.close()
})

test("hydrated language links retain fragments and canonical URLs ignore them", async ({
  page,
  baseURL,
}) => {
  const preview = previewUrl(baseURL)
  await page.goto("projects/pinnacle/?from=language#project-overview")
  const language = page.locator("a.language-button")
  await expect(language).toHaveAttribute(
    "href",
    /en\/projects\/pinnacle\/\?from=language#project-overview$/
  )
  await language.click()
  await expect(page).toHaveURL(
    new URL("en/projects/pinnacle/?from=language#project-overview", preview)
      .href
  )
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    origin + preview.pathname + "en/projects/pinnacle/"
  )
  await page
    .getByRole("link", { name: "Projects", exact: true })
    .first()
    .click()
  await expect(page.locator('link[rel="canonical"]')).toHaveCount(1)
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    origin + preview.pathname + "en/projects/"
  )
  for (const selector of [
    'meta[name="description"]',
    'meta[property="og:url"]',
    'meta[property="og:image"]',
    'meta[name="twitter:card"]',
  ]) {
    await expect(page.locator(selector)).toHaveCount(1)
  }
  await page.reload()
  await expect(page.locator("html")).toHaveAttribute("lang", "en")
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    origin + preview.pathname + "en/projects/"
  )
})
