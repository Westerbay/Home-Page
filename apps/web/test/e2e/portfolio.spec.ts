import { test, expect } from "@playwright/test"
import fr from "../../../../packages/i18n/messages/fr.json" with { type: "json" }
import en from "../../../../packages/i18n/messages/en.json" with { type: "json" }

test("static HTML contains localized content without JavaScript", async ({
  browser,
  baseURL,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false })
  const page = await context.newPage()
  await page.goto(baseURL!)
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Mathis")
  await expect(page.locator(".hero-intro")).toHaveText(fr.intro)
  await page.goto(baseURL + "en/")
  await expect(page.locator("html")).toHaveAttribute("lang", "en")
  await expect(page.locator(".hero-intro")).toHaveText(en.intro)
  await expect(page.locator("a[href*='mathis-gala']")).toHaveCount(0)
  await context.close()
})

test("navigation, language switch and direct reload preserve the project", async ({
  page,
}) => {
  const errors: string[] = []
  page.on("pageerror", (error) => errors.push(error.message))
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text())
  })
  await page.goto("./")
  await expect(page.locator(".language-current")).toHaveText("FR")
  await page.locator(".project-card").first().click()
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("SpellWar")
  await page.getByRole("button", { name: "Switch to English" }).click()
  await expect(page.locator(".language-current")).toHaveText("EN")
  await expect(page).toHaveURL(/\/en\/projects\/spellwar\/?$/)
  await expect(page.locator("html")).toHaveAttribute("lang", "en")
  await expect(
    page.getByRole("link", { name: "Back to projects" })
  ).toBeVisible()
  await page.reload()
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("SpellWar")
  await page.getByRole("link", { name: "Back to projects" }).click()
  await expect(page.locator(".project-card")).toHaveCount(3)
  expect(errors).toEqual([])
})

test("filters, clipboard feedback and primary GitHub", async ({
  page,
  context,
}) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"])
  await page.goto("projects")
  await page.getByRole("button", { name: "Jeux", exact: true }).click()
  await expect(page.locator(".project-card")).toHaveCount(2)
  await page.getByRole("button", { name: "Génératif", exact: true }).click()
  await expect(page.locator(".project-card")).toHaveCount(1)
  await page.getByRole("link", { name: "Contact", exact: true }).first().click()
  await expect(page.locator(".contact-links a")).toHaveCount(2)
  await expect(page.locator("a[href*='mathis-gala']")).toHaveCount(0)
  await page.getByRole("button", { name: "Copier le lien du profil" }).click()
  await expect(
    page.getByText("Lien du profil copié.", { exact: true })
  ).toBeVisible()
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(
    "https://github.com/Westerbay"
  )
  await page.evaluate(() => {
    Object.defineProperty(navigator.clipboard, "writeText", {
      value: () => Promise.reject(new Error("denied")),
      configurable: true,
    })
  })
  await page.getByRole("button", { name: "Copier le lien du profil" }).click()
  await expect(
    page.getByText("La copie a échoué.", { exact: false })
  ).toBeVisible()
})

for (const locale of [
  {
    name: "French",
    route: "./",
    labels: {
      light: "Passer au thème clair",
      dark: "Passer au thème sombre",
    },
  },
  {
    name: "English",
    route: "en/",
    labels: {
      light: "Switch to light theme",
      dark: "Switch to dark theme",
    },
  },
]) {
  for (const initialTheme of ["light", "dark"] as const) {
    test(`${locale.name} theme follows ${initialTheme} OS until a persistent manual choice`, async ({
      page,
    }) => {
      const oppositeTheme = initialTheme === "light" ? "dark" : "light"
      const html = page.locator("html")
      const themeButton = page.locator(".theme-button")
      const expectTheme = async (theme: "light" | "dark") => {
        await expect(html).toHaveClass(new RegExp(`\\b${theme}\\b`))
        await expect(themeButton).toHaveAccessibleName(
          locale.labels[theme === "dark" ? "light" : "dark"]
        )
      }

      await page.emulateMedia({ colorScheme: initialTheme })
      await page.goto(locale.route)
      await expectTheme(initialTheme)

      // Without a manual choice, later OS changes still control the theme.
      await page.emulateMedia({ colorScheme: oppositeTheme })
      await expectTheme(oppositeTheme)

      await page
        .getByRole("button", { name: locale.labels[initialTheme], exact: true })
        .click()
      await expectTheme(initialTheme)
      await page.reload()
      await expectTheme(initialTheme)

      // Exercise a fresh OS change that disagrees with the saved preference.
      await page.emulateMedia({ colorScheme: initialTheme })
      await expectTheme(initialTheme)
      await page.emulateMedia({ colorScheme: oppositeTheme })
      await expectTheme(initialTheme)

      await page
        .getByRole("button", {
          name: locale.labels[oppositeTheme],
          exact: true,
        })
        .click()
      await expectTheme(oppositeTheme)
      await page.reload()
      await expectTheme(oppositeTheme)
      await page.emulateMedia({ colorScheme: initialTheme })
      await expectTheme(oppositeTheme)
    })
  }
}

test("skip link moves keyboard focus to the main content", async ({ page }) => {
  await page.goto("./")
  await page.keyboard.press("Tab")
  await expect(page.locator(".skip-link")).toBeFocused()
  await page.keyboard.press("Enter")
  await expect(page.locator("main")).toBeFocused()
})

for (const width of [320, 390, 768, 1440, 1920, 3840]) {
  test("responsive pages at " + width, async ({ page }, info) => {
    await page.setViewportSize({
      width,
      height: Math.max(950, Math.round(width * 0.56)),
    })
    for (const route of [
      "./",
      "projects",
      "projects/plants",
      "about",
      "contact",
      "en/",
    ]) {
      await page.goto(route)
      await expect(page.locator("main h1")).toBeVisible()
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth
        )
      ).toBe(true)
      expect(
        await page
          .locator("img")
          .evaluateAll((images) =>
            images.every((image) => image.complete && image.naturalWidth > 0)
          )
      ).toBe(true)
    }
    await page.goto("./")
    await page.screenshot({
      path: info.outputPath("home-" + width + ".png"),
      fullPage: true,
    })
    if (width === 1440 || width === 3840) {
      await page.emulateMedia({ colorScheme: "dark" })
      await expect(page.locator("html")).toHaveClass(/dark/)
      await page.screenshot({
        path: info.outputPath("home-dark.png"),
        fullPage: true,
      })
    }
  })
}

test("unknown routes return a real static 404", async ({ request }) => {
  const response = await request.get("projects/missing-project")
  expect(response.status()).toBe(404)
  expect(await response.text()).toContain("Page introuvable")
})

test("large screens keep generous content width and readable type", async ({
  page,
}) => {
  await page.goto("./")
  let previousWidth = 0
  for (const width of [1440, 1920, 2560, 3840]) {
    await page.setViewportSize({ width, height: Math.round(width * 0.56) })
    const layout = await page.evaluate(() => {
      const container = document.querySelector(".site-container")!
      const description = document.querySelector(".hero-description")!
      const heading = document.querySelector(".hero-copy h1")!
      const figure = document.querySelector(".atlas-art")!
      return {
        width: container.clientWidth,
        descriptionSize: Number.parseFloat(
          getComputedStyle(description).fontSize
        ),
        headingSize: Number.parseFloat(getComputedStyle(heading).fontSize),
        figureHeight: figure.clientHeight,
      }
    })
    expect(layout.width).toBeGreaterThanOrEqual(previousWidth)
    expect(layout.width).toBeGreaterThan(width * 0.65)
    expect(layout.width).toBeLessThanOrEqual(2600)
    expect(layout.descriptionSize).toBeGreaterThanOrEqual(15)
    expect(layout.figureHeight).toBeLessThanOrEqual(820)
    if (width >= 2560) expect(layout.headingSize).toBeGreaterThanOrEqual(170)
    previousWidth = layout.width
  }
})

test("the plant changes with keyboard input without hydration errors", async ({
  page,
}) => {
  const errors: string[] = []
  page.on("pageerror", (error) => errors.push(error.message))
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text())
  })
  await page.goto("./")
  const initialShape = await page.locator(".botanical").innerHTML()
  const button = page.getByRole("button", { name: fr.plant_play })
  await button.focus()
  await page.keyboard.press("Enter")
  await expect(page.locator(".atlas-art [role=status]")).toContainText(
    fr.plant_changed
  )
  expect(await page.locator(".botanical").innerHTML()).not.toBe(initialShape)
  await expect(button).toBeFocused()
  await page.reload()
  expect(await page.locator(".botanical").innerHTML()).toBe(initialShape)
  await page.getByRole("button", { name: "Switch to English" }).click()
  await expect(page.getByRole("button", { name: en.plant_play })).toBeVisible()
  expect(errors).toEqual([])
})

test("legacy page URLs redirect to the current portfolio", async ({
  page,
  baseURL,
}) => {
  for (const [oldPath, currentPath] of [
    ["About.html", "about/"],
    ["Project.html", "projects/"],
    ["Prototype.html", "projects/"],
  ]) {
    await page.goto(oldPath)
    await expect(page).toHaveURL(new URL(currentPath, baseURL!).href)
    await expect(page.locator("main h1")).toBeVisible()
    await expect(page.locator("html")).toHaveAttribute("lang", "fr")
  }
})
