import { expect, test } from "@playwright/test"
import { readFileSync } from "node:fs"

const builtHome = readFileSync(
  new URL("../../dist/client/index.html", import.meta.url),
  "utf8"
)
test.skip(
  !/class="[^\"]*\bguide-launcher\b/.test(builtHome),
  "Requires an explicitly enabled guide build"
)

interface StreamFixture {
  calls: number
  cancelled: boolean
  push: (type: string, body: unknown) => void
  close: () => void
}
declare global {
  interface Window {
    guideStreamFixture?: StreamFixture
  }
}
const answer = {
  status: "answered",
  answer: "Un moteur 3D avec physique et collisions.",
  citations: [
    { chunk_id: "one", path: "spellwar.md", line_start: 1, line_end: 4 },
  ],
}

test.beforeEach(async ({ page }) => {
  // This fixture is browser-local and cannot fall through to the real RAG.
  await page.route("**/v1/chat", (route) => route.abort())
  await page.addInitScript(() => {
    const fetcher = window.fetch
    let calls = 0
    window.fetch = async function (input, options) {
      const url = input instanceof Request ? input.url : String(input)
      if (new URL(url, location.href).pathname !== "/v1/chat")
        return fetcher(input, options)
      calls++
      const encoder = new TextEncoder()
      let cancelled = false
      const fixture: StreamFixture = {
        calls,
        cancelled,
        push: () => {},
        close: () => {},
      }
      const stream = new ReadableStream<Uint8Array>({
        start(controller) {
          fixture.push = (type, body) => {
            if (!cancelled)
              controller.enqueue(
                encoder.encode(
                  `event: ${type}\ndata: ${JSON.stringify(body)}\n\n`
                )
              )
          }
          fixture.close = () => {
            if (!cancelled) controller.close()
          }
        },
        cancel() {
          cancelled = true
          fixture.cancelled = true
        },
      })
      window.guideStreamFixture = fixture
      return new Response(stream, {
        headers: { "content-type": "text/event-stream" },
      })
    }
  })
})

test("streaming speech survives compact/full transitions and stops with the validated final answer", async ({
  page,
}) => {
  await page.goto("about/")
  await page.getByRole("button", { name: "Ouvrir le guide IA" }).click()
  await page.getByRole("textbox").fill("Présente SpellWar")
  await page.getByRole("button", { name: "Envoyer", exact: true }).click()
  await expect(page.getByRole("textbox")).toHaveValue("")
  await expect(page.locator(".guide-companion")).toHaveAttribute(
    "data-state",
    "thinking"
  )
  await expect
    .poll(() => page.evaluate(() => window.guideStreamFixture?.calls))
    .toBe(1)
  await page.evaluate(() =>
    window.guideStreamFixture?.push("delta", { delta: "Un moteur 3D" })
  )
  const reply = page.locator(".guide-message-assistant .guide-markdown")
  await expect(reply).toHaveText("Un moteur 3D")
  await expect(page.locator(".guide-companion")).toHaveAttribute(
    "data-state",
    "speaking"
  )
  await page.getByRole("button", { name: "Agrandir", exact: true }).click()
  await expect(reply).toHaveText("Un moteur 3D")
  await expect(page.locator(".guide-companion")).toHaveAttribute(
    "data-state",
    "speaking"
  )
  await page.getByRole("button", { name: "Réduire", exact: true }).click()
  await page.evaluate((result) => {
    window.guideStreamFixture?.push("delta", {
      delta: " avec physique et collisions.",
    })
    window.guideStreamFixture?.push("result", result)
    window.guideStreamFixture?.close()
  }, answer)
  await expect(reply).toHaveText(answer.answer)
  await expect(page.locator(".guide-companion")).toHaveAttribute(
    "data-state",
    "idle"
  )
  await expect(
    page.locator(".guide-message-assistant .guide-sr-only")
  ).toHaveCount(0)
  await expect(page.getByRole("log")).not.toHaveAttribute("aria-busy", "true")
  expect(await page.evaluate(() => window.guideStreamFixture?.calls)).toBe(1)
  await page.reload()
  await page.getByRole("button", { name: "Ouvrir le guide IA" }).click()
  await expect(reply).toHaveText(answer.answer)
})

for (const outcome of ["error", "stop", "clear"]) {
  test(`a ${outcome} discards the preview without putting it back after late events`, async ({
    page,
  }) => {
    await page.goto("guide/")
    await page.getByRole("textbox").fill("Question conservée")
    await page.getByRole("button", { name: "Envoyer", exact: true }).click()
    await expect
      .poll(() => page.evaluate(() => window.guideStreamFixture?.calls))
      .toBe(1)
    await page.evaluate(() =>
      window.guideStreamFixture?.push("delta", { delta: "Réponse incomplète" })
    )
    await expect(page.locator(".guide-message-assistant")).toContainText(
      "Réponse incomplète"
    )
    if (outcome === "error")
      await page.evaluate(() =>
        window.guideStreamFixture?.push("error", { code: "response" })
      )
    else
      await page
        .getByRole("button", {
          name: outcome === "stop" ? "Arrêter" : "Nouvelle conversation",
          exact: true,
        })
        .click()
    await expect(page.locator(".guide-message-assistant")).toHaveCount(0)
    await expect
      .poll(() => page.evaluate(() => window.guideStreamFixture?.cancelled))
      .toBe(true)
    await page.evaluate(
      (result) => window.guideStreamFixture?.push("result", result),
      answer
    )
    await expect(page.locator(".guide-message-assistant")).toHaveCount(0)
    await expect(page.getByRole("textbox")).toHaveValue(
      outcome === "clear" ? "" : "Question conservée"
    )
    await page.reload()
    await expect(page.locator(".guide-message-assistant")).toHaveCount(0)
  })
}

test("reduced motion keeps incremental text and a static character", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" })
  await page.goto("en/guide/")
  await page.getByRole("textbox").fill("How does the game work?")
  await page.getByRole("button", { name: "Send", exact: true }).click()
  await expect
    .poll(() => page.evaluate(() => window.guideStreamFixture?.calls))
    .toBe(1)
  await page.evaluate(() =>
    window.guideStreamFixture?.push("delta", { delta: "Un moteur 3D" })
  )
  await expect(
    page.locator(".guide-message-assistant .guide-markdown")
  ).toHaveText("Un moteur 3D")
  await expect(page.locator(".guide-companion")).toHaveAttribute(
    "data-state",
    "idle"
  )
  await page.getByRole("button", { name: "Stop", exact: true }).click()
  await expect(page.locator(".guide-message-assistant")).toHaveCount(0)
})
