import { test, expect } from "@playwright/test"
import fr from "../../../packages/i18n/messages/fr.json" with { type: "json" }
import en from "../../../packages/i18n/messages/en.json" with { type: "json" }

test.use({ viewport: { width: 1440, height: 1000 } })

test("mobile navigation and language links remain usable without JavaScript", async ({
  browser,
  baseURL,
}) => {
  if (!baseURL) throw new Error("The portfolio base URL must be configured")
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 320, height: 568 },
    isMobile: true,
    hasTouch: true,
  })
  const page = await context.newPage()
  for (const [locale, messages, otherLocale] of [
    ["", fr, "en/"],
    ["en/", en, ""],
  ] as const) {
    await page.goto(new URL(locale, baseURL).href)
    const navigation = page.getByRole("navigation", {
      name: messages.navigation,
    })
    await expect(page.locator(".nav-toggle")).toBeHidden()
    await expect(navigation).toBeVisible()
    await navigation
      .getByRole("link", { name: messages.projects, exact: true })
      .tap()
    await expect(page).toHaveURL(new URL(`${locale}projects/`, baseURL).href)
    // A cross-document snapshot briefly intercepts input. With JavaScript off,
    // Playwright's in-page tap retry timer cannot advance after that interception.
    await expect(page.locator(":root:active-view-transition")).toHaveCount(0)
    await page.getByRole("link", { name: messages.language }).tap()
    await expect(page).toHaveURL(
      new URL(`${otherLocale}projects/`, baseURL).href
    )
  }
  await context.close()
})

for (const [locale, messages] of [
  ["", fr],
  ["en/", en],
] as const) {
  test(`project navigation expands only on project details and preserves locale and active page: ${locale || "fr"}`, async ({
    page,
    baseURL,
  }) => {
    if (!baseURL) throw new Error("The portfolio base URL must be configured")
    await page.goto(`${locale}projects/`)
    const navigation = page.getByRole("navigation", {
      name: messages.navigation,
    })
    const projectLinks = navigation.locator(".project-nav-branch > li > a")
    await expect(projectLinks).toHaveCount(0)
    const catalogueHrefs = await page
      .locator(".project-card")
      .evaluateAll((links) => links.map((link) => link.getAttribute("href")))
    const currentPage = navigation.locator('[aria-current="page"]')
    await expect(currentPage).toHaveCount(1)
    await expect(currentPage).toHaveText(messages.projects)

    await page.locator(".project-card.project-eyefox").click()
    const projectURL = new URL(`${locale}projects/eyefox/`, baseURL)
    await expect(page).toHaveURL(projectURL.href)
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "Eyefox Puzzle"
    )
    await expect(currentPage).toHaveCount(1)
    await expect(currentPage).toHaveText("Eyefox Puzzle")
    await expect(projectLinks).toHaveCount(6)
    expect(
      await projectLinks.evaluateAll((links) =>
        links.map((link) => link.getAttribute("href"))
      )
    ).toEqual(catalogueHrefs)
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
        await expect(projectLinks).toHaveCount(0)
        await expect(currentPage).toHaveCount(1)
        await expect(currentPage).toHaveText(label)
        await expect(navigation.locator('a[href*="#"]')).toHaveCount(0)
      }
    }
  })

  test.describe(`touch navigation: ${locale || "fr"}`, () => {
    test.use({
      viewport: { width: 320, height: 568 },
      isMobile: true,
      hasTouch: true,
    })

    test("menu supports project and language navigation, Escape, and desktop resizing", async ({
      page,
      baseURL,
    }) => {
      if (!baseURL) throw new Error("The portfolio base URL must be configured")
      await page.goto(locale || "./")
      const toggle = page.locator(".nav-toggle")
      const menu = page.locator("#primary-navigation")
      const navigation = page.getByRole("navigation", {
        name: messages.navigation,
      })
      await expect(toggle).toBeVisible()
      await expect(toggle).toHaveAccessibleName(messages.menu_open)
      await expect(toggle).toHaveAttribute("aria-expanded", "false")
      await expect(menu).toBeHidden()
      await toggle.tap()
      await expect(toggle).toHaveAccessibleName(messages.menu_close)
      await expect(toggle).toHaveAttribute("aria-expanded", "true")
      await expect(navigation).toBeVisible()
      await expect(navigation.locator(".project-nav-branch")).toBeHidden()
      for (const link of await navigation.getByRole("link").all()) {
        await expect(link).toBeInViewport({ ratio: 1 })
      }
      await expect(
        page.getByRole("link", { name: messages.language })
      ).toBeInViewport({ ratio: 1 })
      await expect(page.locator(".theme-button")).toBeInViewport({ ratio: 1 })
      await navigation
        .getByRole("link", { name: messages.projects, exact: true })
        .tap()
      await expect(page).toHaveURL(new URL(`${locale}projects/`, baseURL).href)
      await expect(menu).toBeHidden()
      await page.locator('.project-card[href*="eyefox"]').tap()
      await expect(page).toHaveURL(
        new URL(`${locale}projects/eyefox/`, baseURL).href
      )
      await expect(page.getByRole("heading", { level: 1 })).toHaveText(
        "Eyefox Puzzle"
      )
      await expect(menu).toBeHidden()

      await toggle.tap()
      const projects = navigation.getByRole("link", {
        name: messages.projects,
        exact: true,
      })
      const home = navigation.getByRole("link", {
        name: messages.home,
        exact: true,
      })
      await expect(projects).toBeInViewport({ ratio: 1 })
      // The mobile parent must distinguish the active project branch even though
      // individual project links are only shown in the desktop summary.
      expect(
        await projects.evaluate((link) => getComputedStyle(link).color)
      ).not.toBe(await home.evaluate((link) => getComputedStyle(link).color))
      await expect(navigation.locator(".project-nav-branch")).toBeHidden()
      await expect(
        navigation.getByRole("link", { name: "Eyefox Puzzle", exact: true })
      ).toHaveCount(0)
      await page.getByRole("link", { name: messages.language }).tap()
      const otherLocale = locale ? "" : "en/"
      const otherMessages = locale ? fr : en
      await expect(page).toHaveURL(
        new URL(`${otherLocale}projects/eyefox/`, baseURL).href
      )
      await expect(toggle).toBeVisible()
      await expect(toggle).toHaveAccessibleName(otherMessages.menu_open)
      await expect(menu).toBeHidden()
      await toggle.tap()
      await page.locator(".theme-button").focus()
      await page.keyboard.press("Escape")
      await expect(menu).toBeHidden()
      await expect(toggle).toBeFocused()
      await expect(toggle).toHaveAttribute("aria-expanded", "false")

      await page.setViewportSize({ width: 1440, height: 1000 })
      await expect(toggle).toBeHidden()
      const desktopNavigation = page.getByRole("navigation", {
        name: otherMessages.navigation,
      })
      await expect(desktopNavigation).toBeVisible()
      const projectLinks = desktopNavigation.locator(
        ".project-nav-branch > li > a"
      )
      await expect(projectLinks).toHaveCount(6)
      for (const link of await projectLinks.all())
        await expect(link).toBeVisible()
      await expect(
        desktopNavigation.locator('[aria-current="page"]')
      ).toHaveText("Eyefox Puzzle")

      await page.setViewportSize({ width: 320, height: 568 })
      await expect(toggle).toBeVisible()
      await expect(toggle).toHaveAttribute("aria-expanded", "false")
      await expect(menu).toBeHidden()
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth
        )
      ).toBe(true)
    })
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
