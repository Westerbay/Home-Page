import { test, expect } from "@playwright/test"
import type { Page } from "@playwright/test"
import fr from "../../../packages/i18n/messages/fr.json" with { type: "json" }
import en from "../../../packages/i18n/messages/en.json" with { type: "json" }

async function revealGame(page: Page) {
  // The puzzle is lazy-loaded when its container approaches the viewport.
  // Navigation and reload can restore a scroll position above that container.
  await page.locator(".portfolio-eyefox").scrollIntoViewIfNeeded()
  const game = page.getByRole("region", { name: "Eyefox Puzzle", exact: true })
  await expect(game).toBeVisible()
  return game
}

test("Eyefox keeps its localized preview without JavaScript", async ({
  browser,
  baseURL,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false })
  const page = await context.newPage()
  for (const [route, messages] of [
    ["projects/eyefox/", fr],
    ["en/projects/eyefox/", en],
  ] as const) {
    await page.goto(new URL(route, baseURL!).href)
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "Eyefox Puzzle"
    )
    const preview = page.locator(".eyefox-placeholder img")
    await expect(preview).toBeVisible()
    await expect(preview).toHaveAttribute(
      "alt",
      messages.project_visual + " · Eyefox Puzzle"
    )
    expect(
      await preview.evaluate((image: HTMLImageElement) => image.naturalWidth)
    ).toBeGreaterThan(0)
    await expect(page.locator(".eyefox")).toHaveCount(0)
    await expect(
      page.getByText(messages.eyefox_loading, { exact: true })
    ).toHaveCount(0)
  }
  await context.close()
})

test("Eyefox transitions its scenery and interface without resetting the game", async ({
  page,
}) => {
  const errors: string[] = []
  page.on("pageerror", (error) => errors.push(error.message))
  await page.goto("projects/eyefox/")
  const game = await revealGame(page)
  await expect(game).toHaveAttribute("data-locale", "fr")
  await expect(game).toHaveAttribute("data-theme", "light")
  await expect(
    game.getByRole("grid", { name: "Votre grille", exact: true })
  ).toBeVisible()
  await game.getByLabel("Difficulté", { exact: true }).selectOption("9")
  await expect(game.getByRole("status")).toContainText("Coups restants")
  await expect(
    game.getByRole("button", { name: "Recommencer", exact: true })
  ).toBeVisible()
  const cells = game
    .getByRole("grid", { name: "Votre grille", exact: true })
    .getByRole("button")
  await cells.first().click()
  const playedGrid = await cells.evaluateAll((buttons) =>
    buttons.map((button) => button.getAttribute("aria-pressed"))
  )
  const progress = await game.getByRole("status").innerText()
  const surfaces = page.locator(".site-header, .portfolio-eyefox .eyefox")
  function readPalette() {
    return surfaces.evaluateAll((elements) =>
      elements.map((element) => {
        const style = getComputedStyle(element)
        return { background: style.backgroundColor, text: style.color }
      })
    )
  }
  const dayPalette = await readPalette()
  const frame = page.locator(".site-frame")
  function readDuskOpacity() {
    return frame.evaluate((element) =>
      Number.parseFloat(getComputedStyle(element, "::after").opacity)
    )
  }
  await expect.poll(readDuskOpacity).toBe(0)
  await page
    .getByRole("button", { name: fr.theme_to_dark, exact: true })
    .click()
  await expect(game).toHaveAttribute("data-theme", "dark")
  await expect
    .poll(
      async () => {
        const opacity = await readDuskOpacity()
        return opacity > 0 && opacity < 1
      },
      { intervals: [16, 32, 50] }
    )
    .toBe(true)
  await expect.poll(readDuskOpacity).toBe(1)
  await expect
    .poll(async () => {
      const palette = await readPalette()
      return palette.every(
        (surface, index) => surface.background !== dayPalette[index]?.background
      )
    })
    .toBe(true)
  const nightPalette = await readPalette()

  // Reversing a transition repeatedly must settle on the last requested scene.
  for (const label of [
    fr.theme_to_light,
    fr.theme_to_dark,
    fr.theme_to_light,
    fr.theme_to_dark,
  ]) {
    await page.getByRole("button", { name: label, exact: true }).click()
  }
  await expect.poll(readDuskOpacity).toBe(1)
  await expect(page.locator("html")).toHaveClass(/dark/)
  await expect.poll(readPalette).toEqual(nightPalette)

  await page.emulateMedia({ reducedMotion: "reduce" })
  await page
    .getByRole("button", { name: fr.theme_to_light, exact: true })
    .click()
  await expect.poll(readDuskOpacity).toBe(0)
  await expect(game).toHaveAttribute("data-theme", "light")
  await expect.poll(readPalette).toEqual(dayPalette)
  expect(
    await frame.evaluate(
      (element) => getComputedStyle(element, "::after").transitionDuration
    )
  ).toBe("0s")
  await page
    .getByRole("button", { name: fr.theme_to_dark, exact: true })
    .click()
  await expect.poll(readDuskOpacity).toBe(1)
  await expect(game).toHaveAttribute("data-theme", "dark")
  await expect.poll(readPalette).toEqual(nightPalette)
  await expect(game.getByLabel("Difficulté", { exact: true })).toHaveValue("9")
  await expect(game.getByRole("status")).toHaveText(progress, {
    useInnerText: true,
  })
  expect(
    await cells.evaluateAll((buttons) =>
      buttons.map((button) => button.getAttribute("aria-pressed"))
    )
  ).toEqual(playedGrid)
  expect(errors).toEqual([])
})

test("Eyefox preserves its locale and theme after language navigation, reload and exit", async ({
  page,
}) => {
  const errors: string[] = []
  page.on("pageerror", (error) => errors.push(error.message))
  await page.goto("projects/")
  const card = page.locator('.project-card[href*="eyefox"]')
  await expect(card.locator("img")).toBeVisible()
  await expect(page.locator(".portfolio-eyefox")).toHaveCount(0)
  await page
    .getByRole("button", { name: fr.theme_to_dark, exact: true })
    .click()
  await card.click()
  const game = await revealGame(page)
  await expect(game).toHaveAttribute("data-locale", "fr")
  await expect(game).toHaveAttribute("data-theme", "dark")
  await page
    .getByRole("link", { name: "FR / EN · Switch to English", exact: true })
    .click()
  await expect(page).toHaveURL(/\/en\/projects\/eyefox\/?$/)
  await revealGame(page)
  await expect(game).toHaveAttribute("data-locale", "en")
  await expect(game).toHaveAttribute("data-theme", "dark")
  await expect(
    game.getByRole("grid", { name: "Your grid", exact: true })
  ).toBeVisible()
  await expect(
    game.getByRole("button", { name: "Retry", exact: true })
  ).toBeVisible()
  await page.reload()
  await revealGame(page)
  await expect(game).toHaveAttribute("data-locale", "en")
  await expect(game).toHaveAttribute("data-theme", "dark")
  await expect(
    page.getByRole("button", { name: en.theme_to_light, exact: true })
  ).toBeVisible()
  await page.getByRole("link", { name: en.back_projects, exact: true }).click()
  await expect(page.locator(".portfolio-eyefox")).toHaveCount(0)
  await expect(page.locator('.project-card[href*="eyefox"] img')).toBeVisible()
  await expect(
    page.getByRole("button", { name: en.theme_to_light, exact: true })
  ).toBeVisible()
  expect(errors).toEqual([])
})

for (const initialTheme of ["light", "dark"] as const) {
  test(`Eyefox scenery and game palette follow the ${initialTheme} system theme`, async ({
    page,
  }) => {
    const oppositeTheme = initialTheme === "light" ? "dark" : "light"
    const html = page.locator("html")
    const frame = page.locator(".site-frame")
    function readDuskOpacity() {
      return frame.evaluate((element) =>
        Number.parseFloat(getComputedStyle(element, "::after").opacity)
      )
    }
    const game = page.getByRole("region", {
      name: "Eyefox Puzzle",
      exact: true,
    })
    await page.emulateMedia({ colorScheme: initialTheme })
    await page.goto("projects/eyefox/")
    await revealGame(page)
    await expect(html).toHaveClass(new RegExp(`\\b${initialTheme}\\b`))
    await expect(game).toHaveAttribute("data-theme", initialTheme)
    await expect.poll(readDuskOpacity).toBe(initialTheme === "dark" ? 1 : 0)
    const preference = await page.evaluate(() =>
      localStorage.getItem("portfolio-theme")
    )

    await page.emulateMedia({ colorScheme: oppositeTheme })
    await expect(html).toHaveClass(new RegExp(`\\b${oppositeTheme}\\b`))
    await expect(game).toHaveAttribute("data-theme", oppositeTheme)
    await expect.poll(readDuskOpacity).toBe(oppositeTheme === "dark" ? 1 : 0)

    await page
      .getByRole("link", { name: fr.back_projects, exact: true })
      .click()
    await expect(html).toHaveClass(new RegExp(`\\b${oppositeTheme}\\b`))
    await expect(
      page.getByRole("button", {
        name: oppositeTheme === "dark" ? fr.theme_to_light : fr.theme_to_dark,
        exact: true,
      })
    ).toBeVisible()
    expect(
      await page.evaluate(() => localStorage.getItem("portfolio-theme"))
    ).toBe(preference)
  })

  test(`Eyefox preserves a saved ${initialTheme} preference after reload and exit`, async ({
    page,
  }) => {
    const oppositeTheme = initialTheme === "light" ? "dark" : "light"
    const html = page.locator("html")
    const navigation = page.getByRole("navigation", { name: fr.navigation })
    const game = page.getByRole("region", {
      name: "Eyefox Puzzle",
      exact: true,
    })
    await page.emulateMedia({ colorScheme: oppositeTheme })
    await page.goto("projects/")
    await page
      .getByRole("button", {
        name: initialTheme === "dark" ? fr.theme_to_dark : fr.theme_to_light,
        exact: true,
      })
      .click()
    await expect(html).toHaveClass(new RegExp(`\\b${initialTheme}\\b`))
    expect(
      await page.evaluate(() => localStorage.getItem("portfolio-theme"))
    ).toBe(initialTheme)

    await navigation
      .getByRole("link", { name: "Eyefox Puzzle", exact: true })
      .click()
    await revealGame(page)
    await expect(game).toHaveAttribute("data-theme", initialTheme)
    await page.emulateMedia({ colorScheme: initialTheme })
    await page.emulateMedia({ colorScheme: oppositeTheme })
    await expect(html).toHaveClass(new RegExp(`\\b${initialTheme}\\b`))
    await page.reload()
    await revealGame(page)
    await expect(game).toHaveAttribute("data-theme", initialTheme)
    await expect(html).toHaveClass(new RegExp(`\\b${initialTheme}\\b`))
    await expect
      .poll(() =>
        page
          .locator(".site-frame")
          .evaluate((element) =>
            Number.parseFloat(getComputedStyle(element, "::after").opacity)
          )
      )
      .toBe(initialTheme === "dark" ? 1 : 0)

    await navigation
      .getByRole("link", { name: fr.projects, exact: true })
      .click()
    await expect(page.locator(".portfolio-eyefox")).toHaveCount(0)
    await expect(html).toHaveClass(new RegExp(`\\b${initialTheme}\\b`))
    await expect(
      page.getByRole("button", {
        name: initialTheme === "dark" ? fr.theme_to_light : fr.theme_to_dark,
        exact: true,
      })
    ).toBeVisible()
    expect(
      await page.evaluate(() => localStorage.getItem("portfolio-theme"))
    ).toBe(initialTheme)
  })
}

test("Eyefox loads when visibility observation is unavailable", async ({
  page,
}) => {
  await page.addInitScript(() => {
    Object.defineProperty(window, "IntersectionObserver", { value: undefined })
  })
  await page.goto("projects/eyefox/")
  await expect(
    page.getByRole("region", { name: "Eyefox Puzzle", exact: true })
  ).toBeVisible()
  await expect(page.locator(".eyefox-placeholder")).toHaveCount(0)
})

test("Eyefox day and dusk scenery assets are available", async ({ page }) => {
  await page.goto("projects/eyefox/")
  const frame = page.locator(".site-frame")
  const backgrounds = await frame.evaluate((element) =>
    ["::before", "::after"].map(
      (layer) =>
        getComputedStyle(element, layer).backgroundImage.match(
          /url\("?([^"\)]+)"?\)/
        )?.[1]
    )
  )
  for (const background of backgrounds) {
    if (!background) throw new Error("A scenery layer has no background image")
    const backgroundResponse = await page.request.get(background)
    expect(backgroundResponse.ok()).toBe(true)
    expect(backgroundResponse.headers()["content-type"]).toMatch(/^image\//)
  }
  expect(backgrounds[0]).not.toBe(backgrounds[1])
})

for (const width of [320, 390, 768, 1100, 1101, 1440, 3840]) {
  const capture = width === 390 || width === 1440 || width === 3840
  const themes: Array<"light" | "dark"> = capture
    ? ["light", "dark"]
    : ["light"]
  for (const theme of themes) {
    test(`Eyefox stays within the viewport at ${width}px in ${theme} mode`, async ({
      page,
    }, info) => {
      await page.setViewportSize({ width, height: 1000 })
      await page.emulateMedia({ colorScheme: theme })
      await page.goto("projects/eyefox/")
      const game = await revealGame(page)
      await expect(game).toHaveAttribute("data-theme", theme)
      await expect
        .poll(() =>
          page
            .locator(".site-frame")
            .evaluate((element) =>
              Number.parseFloat(getComputedStyle(element, "::after").opacity)
            )
        )
        .toBe(theme === "dark" ? 1 : 0)
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth
        )
      ).toBe(true)
      const box = await game.boundingBox()
      expect(box).not.toBeNull()
      expect(box!.x).toBeGreaterThanOrEqual(0)
      expect(box!.x + box!.width).toBeLessThanOrEqual(width)
      if (capture) {
        await page.screenshot({
          path: info.outputPath(
            theme === "dark"
              ? `eyefox-dark-${width}.png`
              : `eyefox-${width}.png`
          ),
          animations: "disabled",
        })
      }
    })
  }
}
