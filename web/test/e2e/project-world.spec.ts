import { expect, test } from "@playwright/test"
import type { Page } from "@playwright/test"
import { readFileSync } from "node:fs"
import fr from "../../../packages/i18n/messages/fr.json" with { type: "json" }
import en from "../../../packages/i18n/messages/en.json" with { type: "json" }

const builtHome = readFileSync(
  new URL("../../dist/client/index.html", import.meta.url),
  "utf8"
)
const guideEnabled = /class="[^"]*\bguide-launcher\b/.test(builtHome)

test.use({ viewport: { width: 1440, height: 900 } })

function sceneryImages(page: Page) {
  return page
    .locator(".site-frame")
    .evaluate((element) =>
      ["::before", "::after"].map(
        (layer) =>
          getComputedStyle(element, layer).backgroundImage.match(
            /url\("?([^"\)]+)"?\)/
          )?.[1] ?? null
      )
    )
}

async function expectTheme(page: Page, theme: "light" | "dark") {
  await expect(page.locator("html")).toHaveClass(new RegExp(`\\b${theme}\\b`))
  expect(
    await page.evaluate(() => localStorage.getItem("portfolio-theme"))
  ).toBe(theme)
}

async function expectScenery(
  page: Page,
  baseURL: string,
  scene: "spellwar" | "forest",
  theme: "light" | "dark"
) {
  await expect
    .poll(() => sceneryImages(page))
    .toEqual(
      ["day", "dusk"].map(
        (time) => new URL(`assets/world/${scene}-${time}.webp`, baseURL).href
      )
    )
  await expect
    .poll(() =>
      page
        .locator(".site-frame")
        .evaluate((element) =>
          Number.parseFloat(getComputedStyle(element, "::after").opacity)
        )
    )
    .toBe(theme === "dark" ? 1 : 0)
  await expectTheme(page, theme)
}

for (const [locale, messages] of [
  ["", fr],
  ["en/", en],
] as const) {
  test(`project scenery follows routing and preserves theme: ${locale || "fr"}`, async ({
    page,
    baseURL,
  }) => {
    if (!baseURL) throw new Error("The portfolio base URL must be configured")
    await page.route("**/v1/chat", (route) => route.abort())
    await page.goto(`${locale}projects/`)
    const navigation = page.getByRole("navigation", {
      name: messages.navigation,
    })
    await expect.poll(() => sceneryImages(page)).toEqual([null, null])
    await page
      .getByRole("button", { name: messages.theme_to_dark, exact: true })
      .click()
    await navigation
      .getByRole("link", { name: "SpellWar", exact: true })
      .click()
    const spellwarURL = new URL(`${locale}projects/spellwar/`, baseURL).href
    await expect(page).toHaveURL(spellwarURL)
    await expectScenery(page, baseURL, "spellwar", "dark")
    for (const image of await sceneryImages(page)) {
      if (!image) throw new Error("The project scenery is missing")
      const response = await page.request.get(image)
      expect(response.ok()).toBe(true)
      expect(response.headers()["content-type"]).toMatch(/^image\//)
    }

    await page
      .getByRole("button", { name: messages.theme_to_light, exact: true })
      .click()
    await expectScenery(page, baseURL, "spellwar", "light")
    await navigation
      .getByRole("link", { name: "Eyefox Puzzle", exact: true })
      .click()
    await expect(page).toHaveURL(
      new URL(`${locale}projects/eyefox/`, baseURL).href
    )
    await expectScenery(page, baseURL, "forest", "light")
    await page
      .getByRole("button", { name: messages.theme_to_dark, exact: true })
      .click()
    await navigation
      .getByRole("link", { name: "SpellWar", exact: true })
      .click()
    await expect(page).toHaveURL(spellwarURL)
    await expectScenery(page, baseURL, "spellwar", "dark")

    if (guideEnabled) {
      await navigation
        .getByRole("link", { name: messages.guide_title, exact: true })
        .click()
      await expect(page).toHaveURL(new URL(`${locale}guide/`, baseURL).href)
      await expect.poll(() => sceneryImages(page)).toEqual([null, null])
      await expect(page.locator(".guide-companion")).toHaveAttribute(
        "data-character",
        "adventurer"
      )
      await expectTheme(page, "dark")
      await page
        .getByRole("button", { name: messages.guide_minimize, exact: true })
        .click()
      await expect(page).toHaveURL(spellwarURL)
      await expectScenery(page, baseURL, "spellwar", "dark")
      await page
        .getByRole("button", { name: messages.guide_close, exact: true })
        .click()
    }

    await navigation
      .getByRole("link", { name: messages.projects, exact: true })
      .click()
    await expect(page).toHaveURL(new URL(`${locale}projects/`, baseURL).href)
    await expect.poll(() => sceneryImages(page)).toEqual([null, null])
    await expectTheme(page, "dark")
  })
}
