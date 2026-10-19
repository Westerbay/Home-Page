import { test, expect } from "@playwright/test"
import fr from "../../../packages/i18n/messages/fr.json" with { type: "json" }
import en from "../../../packages/i18n/messages/en.json" with { type: "json" }

test.use({ viewport: { width: 1440, height: 1000 } })

for (const [locale, messages] of [
  ["", fr],
  ["en/", en],
] as const) {
  test(`project navigation stays expanded across pages and preserves locale and active page: ${locale || "fr"}`, async ({
    page,
    baseURL,
  }) => {
    if (!baseURL) throw new Error("The portfolio base URL must be configured")
    await page.goto(`${locale}projects/`)
    const navigation = page.getByRole("navigation", {
      name: messages.navigation,
    })
    const projectLinks = navigation.locator(".project-nav-branch > li > a")
    await expect(projectLinks).toHaveCount(6)
    const catalogueHrefs = await page
      .locator(".project-card")
      .evaluateAll((links) => links.map((link) => link.getAttribute("href")))
    expect(
      await projectLinks.evaluateAll((links) =>
        links.map((link) => link.getAttribute("href"))
      )
    ).toEqual(catalogueHrefs)
    const currentPage = navigation.locator('[aria-current="page"]')
    await expect(currentPage).toHaveCount(1)
    await expect(currentPage).toHaveText(messages.projects)

    await navigation
      .getByRole("link", { name: "Eyefox Puzzle", exact: true })
      .click()
    const projectURL = new URL(`${locale}projects/eyefox/`, baseURL)
    await expect(page).toHaveURL(projectURL.href)
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "Eyefox Puzzle"
    )
    await expect(currentPage).toHaveCount(1)
    await expect(currentPage).toHaveText("Eyefox Puzzle")
    await expect(projectLinks).toHaveCount(6)
    await expect(navigation.locator('a[href*="#"]')).toHaveCount(0)

    await navigation
      .getByRole("link", { name: "Booster Break", exact: true })
      .click()
    await expect(page).toHaveURL(
      new URL(`${locale}projects/booster-break/`, baseURL).href
    )
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "Booster Break"
    )
    await expect(currentPage).toHaveCount(1)
    await expect(currentPage).toHaveText("Booster Break")
    await expect(navigation.locator('a[href*="#"]')).toHaveCount(0)

    for (const width of [1440, 3840]) {
      await page.setViewportSize({ width, height: 1000 })
      for (const [route, label] of [
        ["", messages.home],
        ["about/", messages.about],
        ["contact/", messages.contact],
      ]) {
        await navigation.getByRole("link", { name: label, exact: true }).click()
        await expect(page).toHaveURL(new URL(`${locale}${route}`, baseURL).href)
        await expect(projectLinks).toHaveCount(6)
        for (const projectLink of await projectLinks.all()) {
          await expect(projectLink).toBeVisible()
        }
        expect(
          await projectLinks.evaluateAll((links) =>
            links.map((link) => link.getAttribute("href"))
          )
        ).toEqual(catalogueHrefs)
        await expect(currentPage).toHaveCount(1)
        await expect(currentPage).toHaveText(label)
        await expect(navigation.locator('a[href*="#"]')).toHaveCount(0)
      }
    }
  })

  test(`mobile navigation keeps project pages out of the compact menu: ${locale || "fr"}`, async ({
    page,
    baseURL,
  }) => {
    if (!baseURL) throw new Error("The portfolio base URL must be configured")
    await page.setViewportSize({ width: 390, height: 900 })
    await page.goto(locale || "./")
    const navigation = page.getByRole("navigation", {
      name: messages.navigation,
    })
    const currentPage = navigation.locator('[aria-current="page"]')
    await expect(navigation.locator(".project-nav-branch")).toBeHidden()
    await expect(currentPage).toHaveCount(1)
    await expect(currentPage).toHaveText(messages.home)
    await navigation
      .getByRole("link", { name: messages.projects, exact: true })
      .click()
    await expect(page).toHaveURL(new URL(`${locale}projects/`, baseURL).href)
    await page.locator('.project-card[href*="eyefox"]').click()
    await expect(page).toHaveURL(
      new URL(`${locale}projects/eyefox/`, baseURL).href
    )
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "Eyefox Puzzle"
    )
    await expect(navigation.locator(".project-nav-branch")).toBeHidden()
    await expect(
      navigation.getByRole("link", { name: "Eyefox Puzzle", exact: true })
    ).toHaveCount(0)
    await expect(currentPage).toHaveCount(1)
    await expect(currentPage).toHaveText("Eyefox Puzzle")
    await navigation
      .getByRole("link", { name: messages.about, exact: true })
      .click()
    await expect(currentPage).toHaveCount(1)
    await expect(currentPage).toHaveText(messages.about)
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth
      )
    ).toBe(true)
  })

  test(`expanded project navigation remains keyboard-accessible in short windows: ${locale || "fr"}`, async ({
    page,
  }) => {
    for (const height of [500, 300]) {
      await page.setViewportSize({ width: 1440, height })
      await page.goto(`${locale}projects/stylegan-cheap-dit/`)
      const navigation = page.getByRole("navigation", {
        name: messages.navigation,
      })
      const theme = page.locator(".theme-button")
      await expect(theme).toBeEnabled()
      const expectedHrefs = await navigation
        .getByRole("link")
        .evaluateAll((links) => links.map((link) => link.getAttribute("href")))
      const reachedHrefs: (string | null)[] = []
      for (let index = 0; index < 35; index += 1) {
        await page.keyboard.press("Tab")
        const focusedLink = navigation.locator("a:focus")
        if (await focusedLink.count()) {
          // Allow subpixel rounding at the scroll container's edge.
          await expect(focusedLink).toBeInViewport({ ratio: 0.95 })
          reachedHrefs.push(await focusedLink.getAttribute("href"))
        }
        if (await theme.evaluate((button) => button === document.activeElement))
          break
      }
      expect(reachedHrefs).toEqual(expectedHrefs)
      await expect(theme).toBeFocused()
      await expect(theme).toBeInViewport({ ratio: 1 })
      await page.keyboard.press("Enter")
      await expect(page.locator("html")).toHaveClass(/dark/)
      await page.keyboard.press("Enter")
      await expect(page.locator("html")).not.toHaveClass(/dark/)
    }
  })
}
