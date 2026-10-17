import { expect, test } from "@playwright/test"
import { readFileSync } from "node:fs"

const builtHome = readFileSync(
  new URL("../../dist/client/index.html", import.meta.url),
  "utf8"
)
test.skip(
  !builtHome.includes("guide-launcher"),
  "Requires an enabled assistant"
)

test.beforeEach(async ({ page }) => {
  await page.route("**/v1/chat", (route) => route.abort())
})

for (const width of [390, 1440]) {
  test(`assistant keeps its sprite and captures the conversation across sizes (${width}px)`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 })
    await page.addInitScript(() => {
      const start = document.startViewTransition.bind(document)
      document.startViewTransition = (...args) => {
        document.documentElement.dataset.assistantTransition = "pending"
        document.documentElement.dataset.assistantFinished = "pending"
        const previous = document.querySelector(
          ".guide-panel, .guide-page-surface"
        )
        document.documentElement.dataset.assistantPrevious =
          previous?.className ?? "missing"
        const transition = start(...args)
        void transition.ready.then(
          () => {
            document.documentElement.dataset.assistantTransition = "ready"
          },
          () => {
            document.documentElement.dataset.assistantTransition = "failed"
          }
        )
        void transition.finished.then(() => {
          document.documentElement.dataset.assistantFinished = "finished"
        })
        return transition
      }
    })
    await page.goto("about/")
    const launcher = page.getByRole("button", {
      name: "Ouvrir l’assistant",
      exact: true,
    })
    await expect(launcher).toBeEnabled()
    const sprite = await page.locator(".guide-companion").elementHandle()
    if (!sprite) throw new Error("The assistant sprite is missing")
    const before = await sprite.boundingBox()
    if (!before) throw new Error("The assistant sprite has no visible bounds")
    await page.locator(".guide-launcher-bubble").click()
    await expect(page.getByRole("textbox")).toBeFocused()
    await expect(page.locator(".guide-companion")).toHaveCount(1)
    expect(await sprite.boundingBox()).toEqual(before)
    expect(await sprite.evaluate((node) => node.isConnected)).toBe(true)

    await page.getByRole("textbox").fill("Brouillon conservé")
    await page.getByRole("button", { name: "Agrandir", exact: true }).click()
    await expect(page).toHaveURL(/\/guide\/$/)
    await expect(page.locator("html")).toHaveAttribute(
      "data-assistant-previous",
      "guide-panel"
    )
    await expect(page.locator("html")).toHaveAttribute(
      "data-assistant-transition",
      "ready"
    )
    await expect(page.locator("html")).toHaveAttribute(
      "data-assistant-finished",
      "finished"
    )
    await expect(page.getByRole("textbox")).toBeFocused()
    await expect(page.getByRole("textbox")).toHaveValue("Brouillon conservé")
    expect(await sprite.evaluate((node) => node.isConnected)).toBe(true)
    const expanded = await sprite.boundingBox()
    const main = await page.locator("main").boundingBox()
    const footer = await page.locator(".site-footer").boundingBox()
    if (!expanded || !main || !footer)
      throw new Error(
        "The expanded assistant or its page landmarks are missing"
      )
    expect(expanded.width).toBeGreaterThan(before.width)
    expect(expanded.height).toBeGreaterThan(before.height)
    expect(expanded.x).toBeGreaterThanOrEqual(main.x)
    expect(expanded.y).toBeGreaterThanOrEqual(main.y)
    expect(expanded.x + expanded.width).toBeLessThanOrEqual(main.x + main.width)
    expect(expanded.y + expanded.height).toBeLessThanOrEqual(
      main.y + main.height
    )
    expect(expanded.y + expanded.height).toBeLessThanOrEqual(footer.y)
    await expect(page.locator(".guide-companion")).toHaveCount(1)

    await page.getByRole("button", { name: "Réduire", exact: true }).click()
    await expect(page).toHaveURL(/\/about\/$/)
    await expect(page.locator("html")).toHaveAttribute(
      "data-assistant-previous",
      "guide-page-surface"
    )
    await expect(page.locator("html")).toHaveAttribute(
      "data-assistant-transition",
      "ready"
    )
    await expect(page.locator("html")).toHaveAttribute(
      "data-assistant-finished",
      "finished"
    )
    await expect(page.getByRole("dialog")).toBeVisible()
    await expect(page.getByRole("textbox")).toBeFocused()
    expect(await sprite.evaluate((node) => node.isConnected)).toBe(true)
    expect(await sprite.boundingBox()).toEqual(before)
    await page.keyboard.press("Escape")
    await expect(launcher).toBeFocused()
    expect(await sprite.evaluate((node) => node.isConnected)).toBe(true)
    expect(await sprite.boundingBox()).toEqual(before)
  })
}
