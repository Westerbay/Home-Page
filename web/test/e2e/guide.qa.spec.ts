import { expect, test } from "@playwright/test"

const endpoint = new URL(
  "/v1/chat",
  process.env.VITE_GUIDE_URL || "http://127.0.0.1:8788"
).href

// Explicitly opt in to a headed, locally intercepted human review. This file is
// outside the application bundle and does not change the public guide.
test("interactive companion review with local responses", async ({
  page,
  baseURL,
}) => {
  test.skip(process.env.GUIDE_QA !== "1", "Human review is opt-in")
  test.setTimeout(0)
  if (!baseURL) throw new Error("The local preview URL is required")
  const previewOrigin = new URL(baseURL).origin
  let calls = 0
  await page.context().route("**/*", async (route) => {
    const url = new URL(route.request().url())
    if (url.origin === previewOrigin) return route.continue()
    if (url.href !== endpoint) return route.abort()
    calls++
    const body: unknown = route.request().postDataJSON()
    if (
      !body ||
      typeof body !== "object" ||
      !("message" in body) ||
      typeof body.message !== "string"
    ) {
      return route.fulfill({ status: 422, json: { error: "invalid_message" } })
    }
    const question = body.message.trim().toLowerCase()
    if (question === "sleep" || question === "dodo") {
      return route.fulfill({
        status: 503,
        json: {
          status: "sleeping",
          service: "workers_ai",
          reason: "quota_exhausted",
          retry_at: new Date(Date.now() + 15_000).toISOString(),
        },
      })
    }
    if (question === "error" || question === "erreur") {
      return route.fulfill({ status: 503, json: { detail: "QA unavailable" } })
    }
    // A short delay makes the thinking pose visible without a network service.
    await new Promise((resolve) => setTimeout(resolve, 1200))
    return route.fulfill({
      json: {
        status: "answered",
        answer:
          "Réponse de démonstration locale. SpellWar utilise un moteur 3D maison, avec physique, collisions et rendu PBR.",
        citations: [
          {
            chunk_id: "qa-spellwar",
            path: "spellwar.md",
            line_start: 1,
            line_end: 4,
          },
        ],
      },
    })
  })
  await page.goto("about/")
  await expect(
    page.getByRole("button", { name: "Ouvrir le guide IA" })
  ).toBeEnabled()
  console.info(
    "Local QA only: any question returns a sample answer; 'sleep' rests for 15s; 'error' simulates a generic error. No external requests are allowed."
  )
  await page.pause()
  console.info(`Local intercepted chat requests: ${calls}`)
})
