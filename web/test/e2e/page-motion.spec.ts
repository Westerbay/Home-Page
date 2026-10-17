import { expect, test } from "@playwright/test"
import type { Page } from "@playwright/test"

test.beforeEach(async ({ page }) => {
  await page.route("**/v1/chat", (route) => route.abort())
})

async function observeTransitions(page: Page) {
  await page.addInitScript(() => {
    const start = document.startViewTransition.bind(document)
    let count = 0
    document.startViewTransition = (...args) => {
      const sequence = String(++count)
      const root = document.documentElement
      root.dataset.pageTransitionReady = "pending"
      root.dataset.pageTransitionFinished = "pending"
      const transition = start(...args)
      void transition.ready.then(
        () => {
          root.dataset.pageTransitionReady = sequence
          const animations = document.getAnimations().filter((animation) => {
            const effect = animation.effect
            return (
              effect instanceof KeyframeEffect &&
              effect.pseudoElement?.includes("view-transition")
            )
          })
          root.dataset.pageTransitionAnimations = String(animations.length)
        },
        () => {
          root.dataset.pageTransitionReady = "failed"
        }
      )
      void transition.finished.then(
        () => {
          root.dataset.pageTransitionFinished = sequence
        },
        () => {
          root.dataset.pageTransitionFinished = "failed"
        }
      )
      return transition
    }
  })
}

async function expectTransition(page: Page, sequence: number) {
  await expect(page.locator("html")).toHaveAttribute(
    "data-page-transition-ready",
    String(sequence)
  )
  await expect(page.locator("html")).toHaveAttribute(
    "data-page-transition-finished",
    String(sequence)
  )
}

for (const locale of ["fr", "en"]) {
  test(`header, project and history navigation complete real page transitions (${locale})`, async ({
    page,
  }) => {
    await observeTransitions(page)
    const prefix = locale === "en" ? "en/" : ""
    const projects = locale === "en" ? "Projects" : "Projets"
    await page.goto(`${prefix}about/`)
    await expect(page.locator(".theme-button")).toBeEnabled()
    await page
      .getByRole("navigation")
      .getByRole("link", { name: projects, exact: true })
      .click()
    await expect(page).toHaveURL(new RegExp(`/${prefix}projects/$`))
    await expectTransition(page, 1)
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(projects)

    await page.locator(".project-spellwar").click()
    await expect(page).toHaveURL(new RegExp(`/${prefix}projects/spellwar/$`))
    await expectTransition(page, 2)
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("SpellWar")

    await page.goBack()
    await expect(page).toHaveURL(new RegExp(`/${prefix}projects/$`))
    await expectTransition(page, 3)
    await page.goForward()
    await expect(page).toHaveURL(new RegExp(`/${prefix}projects/spellwar/$`))
    await expectTransition(page, 4)
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("SpellWar")
  })
}

test("reduced motion completes navigation without transition animations", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" })
  await observeTransitions(page)
  await page.goto("about/")
  await expect(page.locator(".theme-button")).toBeEnabled()
  await page
    .getByRole("navigation")
    .getByRole("link", { name: "Projets", exact: true })
    .click()
  await expect(page).toHaveURL(/\/projects\/$/)
  await expectTransition(page, 1)
  await expect(page.locator("html")).toHaveAttribute(
    "data-page-transition-animations",
    "0"
  )
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Projets")
})

test("navigation and history remain usable without the View Transition API", async ({
  page,
}) => {
  await page.addInitScript(() => {
    Object.defineProperty(document, "startViewTransition", {
      value: undefined,
      configurable: true,
    })
  })
  const errors: string[] = []
  page.on("pageerror", (error) => errors.push(error.message))
  await page.goto("about/")
  await expect(page.locator(".theme-button")).toBeEnabled()
  const aboutUrl = page.url()
  await page
    .getByRole("navigation")
    .getByRole("link", { name: "Projets", exact: true })
    .click()
  await expect(page).toHaveURL(/\/projects\/$/)
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Projets")
  await page.goBack()
  await expect(page).toHaveURL(aboutUrl)
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible()
  expect(errors).toEqual([])
})
