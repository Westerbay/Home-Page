import { test, expect } from "@playwright/test"
import fr from "../../../packages/i18n/messages/fr.json" with { type: "json" }
import en from "../../../packages/i18n/messages/en.json" with { type: "json" }

for (const [locale, messages] of [
  ["", fr],
  ["en/", en],
] as const) {
  test(`generative gallery is complete without JavaScript in ${locale || "fr"}`, async ({
    browser,
    baseURL,
  }) => {
    const context = await browser.newContext({ javaScriptEnabled: false })
    const page = await context.newPage()
    await page.goto(baseURL + locale + "projects/stylegan-cheap-dit/")
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "StyleGAN & Cheap DiT"
    )
    await expect(
      page.getByRole("heading", { name: messages.dit_gallery_title })
    ).toBeVisible()
    await expect(page.locator(".diffusion-grid figure")).toHaveCount(16)
    await expect(page.locator(".denoising-grid figure")).toHaveCount(6)
    for (const image of await page.locator(".generative-gallery img").all()) {
      await image.scrollIntoViewIfNeeded()
      await expect
        .poll(() =>
          image.evaluate(
            (element: HTMLImageElement) =>
              element.complete && element.naturalWidth > 0
          )
        )
        .toBe(true)
    }
    for (const width of [320, 768, 1440]) {
      await page.setViewportSize({ width, height: 900 })
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth
        )
      ).toBe(true)
    }
    await context.close()
  })

  test(`science catalogue and language switch reach the gallery in ${locale || "fr"}`, async ({
    page,
    baseURL,
  }) => {
    await page.goto(baseURL + locale + "projects/")
    await page
      .getByRole("button", { name: messages.engineering, exact: true })
      .click()
    await expect(page.locator(".project-card")).toHaveCount(2)
    await page
      .locator(".project-card")
      .filter({ hasText: "StyleGAN & Cheap DiT" })
      .click()
    await expect(page).toHaveURL(/projects\/stylegan-cheap-dit\/?$/)
    await page.getByRole("button", { name: messages.language }).click()
    await expect(page.locator("html")).toHaveAttribute(
      "lang",
      locale ? "fr" : "en"
    )
    await page.reload()
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "StyleGAN & Cheap DiT"
    )
    const sample = page.locator(".diffusion-grid a").first()
    await sample.scrollIntoViewIfNeeded()
    await sample.focus()
    await page.keyboard.press("Enter")
    await expect(page).toHaveURL(/assets\/stylegan-cheap-dit\/dit-.*\.webp$/)
  })
}
