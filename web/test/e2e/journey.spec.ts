import { test, expect } from "@playwright/test"

for (const locale of [
  { route: "about/", title: "Mon parcours", prefix: "" },
  { route: "en/about/", title: "My journey", prefix: "en/" },
]) {
  test(`journey links preserve locale and deployment prefix: ${locale.prefix || "fr"}`, async ({
    page,
    baseURL,
  }) => {
    await page.goto(locale.route)
    const journey = page.getByRole("region", { name: locale.title })
    await expect(journey.getByRole("heading", { level: 3 }).first()).toHaveText(
      "Product & Software Engineer"
    )
    await expect(journey.getByText(/^Galadrim ·/)).toBeVisible()
    const links = journey.locator(".journey-projects a:not(.journey-source)")
    await expect(links).toHaveCount(5)
    for (const link of await links.all()) {
      const href = await link.getAttribute("href")
      expect(href).toMatch(
        new RegExp(`^${new URL(baseURL!).pathname}${locale.prefix}projects/`)
      )
    }
    await expect(
      journey.locator('a[href="https://github.com/Westerbay/SpellWar"]')
    ).toHaveAttribute("rel", "noreferrer")
    await journey.getByRole("link", { name: "SpellWar", exact: true }).click()
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("SpellWar")
    await expect(page).toHaveURL(
      new URL(`${locale.prefix}projects/spellwar/`, baseURL!).href
    )
    await page.reload()
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("SpellWar")
  })
}
