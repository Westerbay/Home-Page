import { expect, test } from "@playwright/test"
import { readFileSync } from "node:fs"

const builtHome = readFileSync(
  new URL("../../dist/client/index.html", import.meta.url),
  "utf8"
)
const enabled = /class="[^"]*\bguide-launcher\b/.test(builtHome)

test("a disabled or invalidly configured guide exposes no interactive entry or request", async ({
  page,
}) => {
  test.skip(enabled, "Requires a disabled guide build")
  let calls = 0
  await page.route("**/v1/chat", (route) => {
    calls++
    return route.abort()
  })
  await page.goto("about/")
  await expect(
    page.getByRole("button", { name: "Ouvrir l’assistant" })
  ).toHaveCount(0)
  await expect(
    page.getByRole("navigation").getByRole("link", { name: "Assistant" })
  ).toHaveCount(0)
  for (const [route, explanation] of [
    [
      "guide/",
      "L’assistant n’est pas disponible pour le moment. Vous pouvez parcourir les projets et la page À propos.",
    ],
    [
      "en/guide/",
      "The assistant is unavailable right now. You can browse the projects and About page.",
    ],
  ]) {
    await page.goto(route)
    await expect(page.getByText(explanation, { exact: true })).toBeVisible()
    await expect(page.getByRole("textbox")).toHaveCount(0)
    await expect(page.locator(".guide-companion")).toHaveCount(0)
  }
  expect(calls).toBe(0)
})
