import { test, expect } from "@playwright/test"
import fr from "../../../../packages/i18n/messages/fr.json" with { type: "json" }
import en from "../../../../packages/i18n/messages/en.json" with { type: "json" }

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

test("Eyefox is playable only on its detail page and follows locale and theme", async ({
  page,
}) => {
  const errors: string[] = []
  page.on("pageerror", (error) => errors.push(error.message))
  await page.goto("projects/")
  const card = page.locator('.project-card[href*="eyefox"]')
  await expect(card.locator("img")).toBeVisible()
  await expect(page.locator(".portfolio-eyefox")).toHaveCount(0)
  await card.click()
  const game = page.getByRole("region", { name: "Eyefox Puzzle", exact: true })
  await expect(game).toBeVisible()
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

  await page
    .getByRole("button", { name: fr.theme_to_dark, exact: true })
    .click()
  await expect(game).toHaveAttribute("data-theme", "dark")
  await page
    .getByRole("button", { name: "Switch to English", exact: true })
    .click()
  await expect(page).toHaveURL(/\/en\/projects\/eyefox\/?$/)
  await expect(game).toHaveAttribute("data-locale", "en")
  await expect(game).toHaveAttribute("data-theme", "dark")
  await expect(
    game.getByRole("grid", { name: "Your grid", exact: true })
  ).toBeVisible()
  await expect(
    game.getByRole("button", { name: "Retry", exact: true })
  ).toBeVisible()
  await page.reload()
  await expect(game).toHaveAttribute("data-locale", "en")
  await expect(game).toHaveAttribute("data-theme", "dark")
  await page.getByRole("link", { name: en.back_projects, exact: true }).click()
  await expect(page.locator(".portfolio-eyefox")).toHaveCount(0)
  await expect(page.locator('.project-card[href*="eyefox"] img')).toBeVisible()
  expect(errors).toEqual([])
})

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

test("the Eyefox detail stays within the viewport", async ({ page }) => {
  await page.goto("projects/eyefox/")
  const game = page.getByRole("region", { name: "Eyefox Puzzle", exact: true })
  await expect(game).toBeVisible()
  for (const width of [320, 390, 768, 1440, 3840]) {
    await page.setViewportSize({ width, height: 1000 })
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth
      )
    ).toBe(true)
    const box = await game.boundingBox()
    expect(box).not.toBeNull()
    expect(box!.x).toBeGreaterThanOrEqual(0)
    expect(box!.x + box!.width).toBeLessThanOrEqual(width)
  }
})
