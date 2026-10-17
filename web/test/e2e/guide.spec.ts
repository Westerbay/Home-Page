import { expect, test } from "@playwright/test"
import type { Page } from "@playwright/test"
import { readFileSync } from "node:fs"

const builtHome = readFileSync(
  new URL("../../dist/client/index.html", import.meta.url),
  "utf8"
)
test.skip(
  !/class="[^"]*\bguide-launcher\b/.test(builtHome),
  "Requires an explicitly enabled guide build"
)

const endpoint = new URL(
  "/v1/chat",
  process.env.VITE_GUIDE_URL || "http://127.0.0.1:8788"
).href

test.beforeEach(async ({ page }) => {
  // A mismatched build/test origin must never fall through to the live service.
  // Each request test installs its more specific response handler afterward.
  await page.route("**/v1/chat", (route) => route.abort())
})
const citation = {
  chunk_id: "spellwar-1",
  path: "spellwar.md",
  line_start: 1,
  line_end: 4,
}
const answer = {
  status: "answered",
  answer: "SpellWar utilise un moteur 3D maison.",
  citations: [citation],
}

for (const locale of ["fr", "en"]) {
  const prefix = locale === "en" ? "en/" : ""
  const open = locale === "en" ? "Open the assistant" : "Ouvrir l’assistant"
  const expand = locale === "en" ? "Expand" : "Agrandir"
  const minimize = locale === "en" ? "Minimize" : "Réduire"
  const title = "Assistant"

  test(`guide round trip preserves an article query and anchor (${locale})`, async ({
    page,
  }) => {
    await page.goto(
      `${prefix}projects/stylegan-cheap-dit/?from=guide&view=steps#diffusion`
    )
    const articleUrl = page.url()
    await page.getByRole("button", { name: open, exact: true }).click()
    await page.getByRole("textbox").fill("Brouillon conservé")
    await page.getByRole("button", { name: expand, exact: true }).click()
    await expect(page).toHaveURL(new RegExp(`/${prefix}guide/$`))
    await page.getByRole("button", { name: minimize, exact: true }).click()
    await expect(page).toHaveURL(articleUrl)
    await expect(page.getByRole("textbox")).toHaveValue("Brouillon conservé")
  })

  test(`header guide entry remembers Eyefox; direct entry falls back home (${locale})`, async ({
    page,
  }) => {
    await page.goto(`${prefix}projects/eyefox/`)
    await expect(page.locator(".guide-companion")).toHaveAttribute(
      "data-character",
      "fox"
    )
    const eyefoxUrl = page.url()
    const guideLink = page.getByRole("navigation").getByRole("link", {
      name: title,
      exact: true,
    })
    await guideLink.click()
    await expect(page).toHaveURL(new RegExp(`/${prefix}guide/$`))
    await expect(page.locator(".guide-companion")).toHaveAttribute(
      "data-character",
      "fox"
    )
    await guideLink.click()
    await page.getByRole("button", { name: minimize, exact: true }).click()
    await expect(page).toHaveURL(eyefoxUrl)
    await expect(page.locator(".guide-companion")).toHaveAttribute(
      "data-character",
      "fox"
    )
    await expect(page.getByRole("dialog")).toBeVisible()

    await page.goto(`${prefix}guide/`)
    await expect(page.locator(".guide-companion")).toHaveAttribute(
      "data-character",
      "adventurer"
    )
    const homeUrl = page.url().replace(/guide\/$/, "")
    await page.getByRole("button", { name: minimize, exact: true }).click()
    await expect(page).toHaveURL(homeUrl)
  })
}

for (const scenario of [
  { surface: "compact-fr", draft: "", name: "empty field" },
  {
    surface: "page-en",
    draft: "An older draft that must not be sent",
    name: "existing draft",
  },
  {
    surface: "page-en",
    draft: "Which project should I start with?",
    name: "draft identical to the suggestion",
  },
]) {
  test(`a suggestion sends once without changing the composer (${scenario.surface}, ${scenario.name})`, async ({
    page,
  }) => {
    const suggestion =
      scenario.surface === "compact-fr"
        ? "Par quel projet commencer ?"
        : "Which project should I start with?"
    const stop = scenario.surface === "compact-fr" ? "Arrêter" : "Stop"
    let calls = 0
    let visibleWelcome = ""
    let release: (() => void) | undefined
    const responseReady = new Promise<void>((resolve) => {
      release = resolve
    })
    await page.route(endpoint, async (route) => {
      calls++
      expect(route.request().postDataJSON()).toEqual({
        message: suggestion,
        history: [{ role: "assistant", content: visibleWelcome }],
      })
      await responseReady
      await route.fulfill({ json: answer })
    })
    if (scenario.surface === "compact-fr") await openGuide(page)
    else await page.goto("en/guide/")
    visibleWelcome = await page.locator(".guide-welcome-text").innerText()
    const composer = page.getByRole("textbox")
    await composer.fill(scenario.draft)
    await page.getByRole("button", { name: suggestion, exact: true }).click()
    await expect.poll(() => calls).toBe(1)
    await expect(
      page.getByRole("button", { name: stop, exact: true })
    ).toBeVisible()
    await expect(composer).toHaveValue(scenario.draft)
    await expect(composer).toBeFocused()
    await expect(
      page.getByRole("log").getByText(suggestion, { exact: true })
    ).toHaveCount(1)
    await expect(page.locator(".guide-suggestions")).toHaveCount(0)
    await composer.press("Enter")
    expect(calls).toBe(1)
    release?.()
    await expect(
      page.locator(".guide-message-assistant .guide-markdown")
    ).toHaveText(answer.answer)
    await expect(composer).toHaveValue(scenario.draft)
    await expect(composer).toBeFocused()
    expect(calls).toBe(1)
  })
}

test("follow-up questions retain the visible welcome and recent questions without rewriting the conversation", async ({
  page,
}) => {
  const requests: unknown[] = []
  await page.route(endpoint, async (route) => {
    requests.push(route.request().postDataJSON())
    await route.fulfill({ json: answer })
  })
  await openGuide(page)
  const visibleWelcome = await page.locator(".guide-welcome-text").innerText()
  const questions = [
    "Quels jeux a-t-il créés ?",
    "Comment on gagne ?",
    "Il a fait quoi à son dernier poste ? C’est quoi les missions ou autres ?",
  ]
  for (const [index, question] of questions.entries()) {
    await page.getByRole("textbox").fill(question)
    await page.getByRole("button", { name: "Envoyer", exact: true }).click()
    await expect(
      page.locator(".guide-message-assistant .guide-markdown")
    ).toHaveCount(index + 1)
    await expect(
      page.locator(".guide-message-assistant .guide-markdown").last()
    ).toHaveText(answer.answer)
    await expect(
      page.getByRole("log").getByText(question, { exact: true })
    ).toHaveCount(1)
  }
  expect(requests).toEqual([
    {
      message: questions[0],
      history: [{ role: "assistant", content: visibleWelcome }],
    },
    {
      message: questions[1],
      history: [
        { role: "assistant", content: visibleWelcome },
        { role: "user", content: questions[0] },
        { role: "assistant", content: answer.answer },
      ],
    },
    {
      message: questions[2],
      history: [
        { role: "assistant", content: visibleWelcome },
        { role: "user", content: questions[0] },
        { role: "user", content: questions[1] },
        { role: "assistant", content: answer.answer },
      ],
    },
  ])
})

test("generic failures and redirects preserve the question without sleeping or following another origin", async ({
  page,
}) => {
  let calls = 0
  let redirectedCalls = 0
  await page.route("https://unexpected.example/**", (route) => {
    redirectedCalls++
    return route.abort()
  })
  await page.route(endpoint, (route) => {
    calls++
    if (calls === 1)
      return route.fulfill({ status: 503, json: { detail: "unavailable" } })
    if (calls === 2) return route.fulfill({ status: 200, body: "invalid JSON" })
    return route.fulfill({
      status: 307,
      headers: { location: "https://unexpected.example/private" },
    })
  })
  await page.goto("guide/")
  await page.getByRole("textbox").fill("Question conservée")
  for (const expected of ["indisponible", "illisible", "connexion"]) {
    await page.getByRole("button", { name: "Envoyer", exact: true }).click()
    await expect(page.getByRole("alert")).toContainText(
      new RegExp(expected, "i")
    )
    await expect(page.getByRole("textbox")).toHaveValue("Question conservée")
    await expect(page.getByText(/L’assistant se repose/)).toHaveCount(0)
    await expect(page.locator(".guide-companion")).toHaveAttribute(
      "data-state",
      "idle"
    )
  }
  expect(calls).toBe(3)
  expect(redirectedCalls).toBe(0)
})

test("manual submission clears immediately and failed replies restore only an untouched composer", async ({
  page,
}) => {
  let calls = 0
  let release: (() => void) | undefined
  await page.route(endpoint, async (route) => {
    calls++
    expect(route.request().postDataJSON().message).toBe("Question envoyée")
    await new Promise<void>((resolve) => {
      release = resolve
    })
    await route.fulfill({ status: 503, json: { detail: "unavailable" } })
  })
  await page.goto("guide/")
  const composer = page.getByRole("textbox")
  for (const replacement of [undefined, "La question suivante"]) {
    await composer.fill("Question envoyée")
    await composer.press("Enter")
    await expect(
      page.getByRole("button", { name: "Arrêter", exact: true })
    ).toBeVisible()
    await expect(composer).toHaveValue("")
    await expect(composer).toBeFocused()
    await expect.poll(() => calls).toBe(replacement === undefined ? 1 : 2)
    if (replacement !== undefined) await composer.fill(replacement)
    release?.()
    await expect(page.getByRole("alert")).toContainText("indisponible")
    await expect(composer).toHaveValue(replacement ?? "Question envoyée")
  }
  expect(calls).toBe(2)
})

test("new replies follow the transcript on mobile without moving document scroll", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.route(endpoint, (route) =>
    route.fulfill({
      json: {
        ...answer,
        answer:
          "Un paragraphe sur le moteur de jeu.\n\n".repeat(15) +
          "Fin de la réponse",
      },
    })
  )
  await openGuide(page)
  const before = await page.evaluate(() => window.scrollY)
  await page.getByRole("textbox").fill("Raconte le moteur")
  await page.getByRole("button", { name: "Envoyer", exact: true }).click()
  await expect(
    page
      .locator(".guide-message-assistant .guide-markdown")
      .getByText("Fin de la réponse", { exact: true })
  ).toBeVisible()
  await expect
    .poll(() =>
      page
        .locator(".guide-transcript")
        .evaluate(
          (node) => node.scrollHeight - node.scrollTop - node.clientHeight
        )
    )
    .toBeLessThan(50)
  expect(await page.evaluate(() => window.scrollY)).toBe(before)
})

test("a reply animates to completion across views, announces once and preserves composer focus", async ({
  page,
}) => {
  const response = { ...answer, answer: answer.answer.repeat(15) }
  let calls = 0
  await page.route(endpoint, (route) => {
    calls++
    return route.fulfill({ json: response })
  })
  await openGuide(page)
  await page.clock.install()
  await page.clock.pauseAt(new Date(Date.now() + 1000))
  await page.getByRole("textbox").fill("Raconte-moi ce projet")
  await page.getByRole("button", { name: "Envoyer", exact: true }).click()
  await expect(page.locator(".guide-companion")).toHaveAttribute(
    "data-state",
    "speaking"
  )
  const reply = page.locator(".guide-message-assistant")
  const visibleText = reply.locator(".guide-markdown")
  await expect(visibleText).toHaveAttribute("aria-hidden", "true")
  await expect(visibleText).toHaveAttribute("inert", "")
  await expect(reply.locator(".guide-sr-only")).toHaveText(response.answer)
  await expect(reply.getByRole("button")).toHaveCount(0)
  await expect(page.getByRole("log")).toHaveAttribute(
    "aria-relevant",
    "additions"
  )
  await page.clock.runFor(200)
  const prefix = await visibleText.innerText()
  expect(prefix.length).toBeGreaterThan(0)
  expect(prefix.length).toBeLessThan(response.answer.length)
  await page.getByRole("button", { name: "Agrandir", exact: true }).click()
  await expect(visibleText).toHaveText(prefix)
  await expect(page.locator(".guide-companion")).toHaveAttribute(
    "data-state",
    "speaking"
  )
  await page.getByRole("button", { name: "Réduire", exact: true }).click()
  await expect(page.getByRole("textbox")).toBeFocused()
  await page.clock.runFor(4000)
  await expect(visibleText).toHaveText(response.answer)
  await expect(reply.locator(".guide-sr-only")).toHaveCount(0)
  await expect(page.getByRole("textbox")).toBeFocused()
  await expect(visibleText).not.toHaveAttribute("aria-hidden", "true")
  await expect(page.locator(".guide-companion")).toHaveAttribute(
    "data-state",
    "idle"
  )
  await page.clock.runFor(5000)
  expect(calls).toBe(1)
  await page.getByRole("textbox").fill("Une autre question")
  await page.getByRole("textbox").press("Enter")
  await expect(page.locator(".guide-companion")).toHaveAttribute(
    "data-state",
    "speaking"
  )
  await page.clock.runFor(4000)
  await expect(reply.last().locator(".guide-markdown")).toHaveText(
    response.answer
  )
  await expect(page.getByRole("textbox")).toBeFocused()
  await expect(page.locator(".guide-companion")).toHaveAttribute(
    "data-state",
    "idle"
  )
  expect(calls).toBe(2)
})

test("reload during speech restores the complete reply; reduced motion skips dialogue animation", async ({
  page,
}) => {
  const response = { ...answer, answer: answer.answer.repeat(15) }
  let calls = 0
  await page.route(endpoint, (route) => {
    calls++
    return route.fulfill({ json: response })
  })
  await page.goto("guide/")
  await page.getByRole("textbox").fill("Une première question")
  await page.getByRole("button", { name: "Envoyer", exact: true }).click()
  await expect(page.locator(".guide-companion")).toHaveAttribute(
    "data-state",
    "speaking"
  )
  await expect(page.getByRole("textbox")).toHaveValue("")
  await page.reload()
  await expect(
    page.locator(".guide-message-assistant .guide-markdown")
  ).toHaveText(response.answer)
  await expect(
    page.locator(".guide-message-assistant .guide-sr-only")
  ).toHaveCount(0)
  await expect(page.locator(".guide-companion")).toHaveAttribute(
    "data-state",
    "idle"
  )
  expect(calls).toBe(1)
  await page.emulateMedia({ reducedMotion: "reduce" })
  await page.getByRole("textbox").fill("Une deuxième question")
  await page.getByRole("button", { name: "Envoyer", exact: true }).click()
  await expect(
    page.locator(".guide-message-assistant .guide-markdown")
  ).toHaveCount(2)
  await expect(
    page.locator(".guide-message-assistant .guide-markdown").last()
  ).toHaveText(response.answer)
  await expect(
    page.locator(".guide-message-assistant .guide-sr-only")
  ).toHaveCount(0)
  await expect(page.locator(".guide-companion")).toHaveAttribute(
    "data-state",
    "idle"
  )
  expect(calls).toBe(2)
})

async function openGuide(page: Page) {
  await page.goto("about/")
  await expect(
    page.getByRole("button", { name: "Ouvrir l’assistant" })
  ).toBeEnabled()
  await page.locator(".guide-launcher-bubble").click()
  await expect(
    page.getByRole("textbox", { name: "Votre question" })
  ).toBeEnabled()
}

test("assistant landmarks and conversation order survive compact and full-page navigation", async ({
  page,
}) => {
  const question = "Présente SpellWar"
  const draft = "Et les collisions ?"
  const response =
    "# Résumé\n\nUn moteur maison.\n\n## Détails\n\nC++ et OpenGL."
  let calls = 0
  await page.setViewportSize({ width: 1280, height: 900 })
  await page.route(endpoint, (route) => {
    calls++
    return route.fulfill({ json: { ...answer, answer: response } })
  })
  await openGuide(page)
  const originalTitle = await page
    .getByRole("heading", { level: 1 })
    .innerText()
  const composer = page
    .getByRole("form", { name: "Votre question", exact: true })
    .getByRole("textbox", { name: "Votre question", exact: true })
  await expect(composer).toBeFocused()
  await composer.fill(question)
  await page.getByRole("button", { name: "Envoyer", exact: true }).click()
  await expect(page.getByText("C++ et OpenGL.", { exact: true })).toBeVisible()
  await composer.fill(draft)

  async function expectConversation(title: string) {
    // Generated Markdown must stay inside the conversation, without becoming
    // document headings or introducing extra site-level landmarks.
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(title)
    await expect(page.getByRole("heading", { name: "Détails" })).toHaveCount(0)
    await expect(page.getByRole("banner")).toHaveCount(1)
    await expect(page.getByRole("contentinfo")).toHaveCount(1)
    const conversation = page.getByRole("log", {
      name: "Conversation avec l’assistant",
      exact: true,
    })
    const turns = conversation.getByRole("list")
    await expect(turns).toHaveJSProperty("tagName", "OL")
    await expect(turns.getByRole("listitem")).toContainText([
      question,
      /Résumé\s*Un moteur maison\.\s*Détails\s*C\+\+ et OpenGL\./,
    ])
    await expect(
      conversation.getByRole("article", { name: "Vous", exact: true })
    ).toContainText(question)
    await expect(
      conversation.getByRole("article", { name: "Assistant", exact: true })
    ).toContainText("C++ et OpenGL.")
    await expect(page.getByRole("textbox")).toHaveCount(1)
    await expect(composer).toHaveValue(draft)
    await expect(composer).toBeFocused()
  }

  await expect(
    page.getByRole("dialog", { name: "Assistant", exact: true })
  ).toBeVisible()
  await expectConversation(originalTitle)
  await page.getByRole("button", { name: "Agrandir", exact: true }).click()
  await expect(page).toHaveURL(/\/guide\/$/)
  await expect(page.getByRole("dialog")).toHaveCount(0)
  await expectConversation("Assistant")
  await page.getByRole("button", { name: "Réduire", exact: true }).click()
  await expect(page).toHaveURL(/\/about\/$/)
  await expect(
    page.getByRole("dialog", { name: "Assistant", exact: true })
  ).toBeVisible()
  await expectConversation(originalTitle)
  expect(calls).toBe(1)
})

test("opening is local; one request survives panel, page and route navigation", async ({
  page,
}) => {
  let calls = 0
  let visibleWelcome = ""
  let complete: (() => void) | undefined
  const pending = new Promise<void>((resolve) => {
    complete = resolve
  })
  await page.route(endpoint, async (route) => {
    calls++
    expect(route.request().headers().authorization).toBeUndefined()
    expect(route.request().headers().cookie).toBeUndefined()
    expect(route.request().postDataJSON()).toEqual({
      message: "Parle-moi de SpellWar",
      history: [{ role: "assistant", content: visibleWelcome }],
    })
    await pending
    await route.fulfill({ json: answer })
  })
  await openGuide(page)
  visibleWelcome = await page.locator(".guide-welcome-text").innerText()
  expect(calls).toBe(0)
  await page.getByRole("textbox").fill("Parle-moi de SpellWar")
  await page.getByRole("button", { name: "Envoyer", exact: true }).click()
  await expect.poll(() => calls).toBe(1)
  await expect(page.getByRole("textbox")).toHaveValue("")
  await page.getByRole("button", { name: "Agrandir", exact: true }).click()
  await expect(page).toHaveURL(/\/guide\/$/)
  await expect(page.getByRole("textbox")).toHaveCount(1)
  await expect(
    page.getByRole("button", { name: "Arrêter", exact: true })
  ).toBeVisible()
  // The new DOM is visible to Playwright before the transition and its
  // focus handoff finish. Wait before selecting and replacing the draft.
  await expect(page.locator("html:active-view-transition")).toHaveCount(0)
  await page.getByRole("textbox").fill("Un brouillon pendant la réponse")
  await page.getByRole("button", { name: "Réduire", exact: true }).click()
  await expect(page).toHaveURL(/\/about\/$/)
  await expect(page.getByRole("textbox")).toHaveValue(
    "Un brouillon pendant la réponse"
  )
  await page.getByRole("button", { name: "Fermer l’assistant" }).click()
  await page.getByRole("link", { name: "Contact", exact: true }).first().click()
  complete?.()
  await page.getByRole("button", { name: "Ouvrir l’assistant" }).click()
  await expect(
    page
      .locator(".guide-message-assistant .guide-markdown")
      .getByText(answer.answer, { exact: true })
  ).toBeVisible()
  await expect(page.getByRole("textbox")).toHaveValue(
    "Un brouillon pendant la réponse"
  )
  await expect(
    page.getByRole("button", { name: "Envoyer", exact: true })
  ).toBeEnabled()
  expect(calls).toBe(1)
})

test("reload and language changes preserve messages and draft without another request", async ({
  page,
}) => {
  let calls = 0
  await page.route(endpoint, async (route) => {
    calls++
    await route.fulfill({ json: answer })
  })
  await openGuide(page)
  await page.getByRole("textbox").fill("SpellWar ?")
  await page.getByRole("button", { name: "Envoyer", exact: true }).click()
  await expect(
    page
      .locator(".guide-message-assistant .guide-markdown")
      .getByText(answer.answer, { exact: true })
  ).toBeVisible()
  await page.getByRole("textbox").fill("Question suivante")
  await page.getByRole("button", { name: "Agrandir", exact: true }).click()
  await page.reload()
  await expect(page.getByRole("textbox")).toHaveValue("Question suivante")
  await expect(
    page
      .locator(".guide-message-assistant .guide-markdown")
      .getByText(answer.answer, { exact: true })
  ).toBeVisible()
  await page.locator(".language-button").click()
  await expect(page).toHaveURL(/\/en\/guide\/$/)
  await expect(
    page.getByRole("textbox", { name: "Your question" })
  ).toHaveValue("Question suivante")
  await expect(
    page
      .locator(".guide-message-assistant .guide-markdown")
      .getByText(answer.answer, { exact: true })
  ).toBeVisible()
  await expect(page.getByText("Sources", { exact: true })).toHaveCount(0)
  await expect(page.getByText(/spellwar\.md/)).toHaveCount(0)
  expect(calls).toBe(1)
})

test("reload during an active request marks interruption without replay", async ({
  page,
}) => {
  let calls = 0
  await page.route(endpoint, (route) => {
    calls++
    return new Promise<void>((resolve) => {
      page.once("close", resolve)
      void route
    })
  })
  await page.goto("guide/")
  await page.getByRole("textbox").fill("Question interrompue")
  await page.getByRole("button", { name: "Envoyer", exact: true }).click()
  await expect.poll(() => calls).toBe(1)
  await expect(page.getByRole("textbox")).toHaveValue("")
  await page.reload()
  await expect(page.getByRole("alert")).toContainText("interrompue")
  await expect(page.getByRole("textbox")).toHaveValue("Question interrompue")
  await expect(
    page.getByRole("button", { name: "Envoyer", exact: true })
  ).toBeEnabled()
  expect(calls).toBe(1)
})

test("sleeping retains the question and survives clearing and reload; retry is manual", async ({
  page,
}) => {
  await page.clock.install()
  let calls = 0
  const retryAt = new Date(Date.now() + 60_000).toISOString()
  await page.route(endpoint, async (route) => {
    calls++
    await route.fulfill({
      status: calls === 1 ? 503 : 200,
      json:
        calls === 1
          ? {
              status: "sleeping",
              service: "workers_ai",
              reason: "quota_exhausted",
              retry_at: retryAt,
            }
          : answer,
    })
  })
  await page.goto("guide/")
  await page.getByRole("textbox").fill("Question conservée")
  await page.getByRole("button", { name: "Envoyer", exact: true }).click()
  await expect(page.getByText(/L’assistant se repose/)).toBeVisible()
  await expect(page.getByRole("textbox")).toHaveValue("Question conservée")
  await expect(
    page.getByRole("button", { name: "Envoyer", exact: true })
  ).toBeDisabled()
  await page.getByRole("button", { name: "Nouvelle conversation" }).click()
  await page.reload()
  await expect(page.getByText(/L’assistant se repose/)).toBeVisible()
  await page.getByRole("textbox").fill("Nouvel essai manuel")
  await expect(
    page.getByRole("button", { name: "Envoyer", exact: true })
  ).toBeDisabled()
  await page.clock.fastForward(61_000)
  await expect(
    page.getByRole("button", { name: "Envoyer", exact: true })
  ).toBeEnabled()
  expect(calls).toBe(1)
  await page.getByRole("button", { name: "Envoyer", exact: true }).click()
  await expect(
    page
      .locator(".guide-message-assistant .guide-markdown")
      .getByText(answer.answer, { exact: true })
  ).toBeVisible()
  await expect(page.getByText(/L’assistant se repose/)).toHaveCount(0)
  expect(calls).toBe(2)
})

test("stop and clear suppress late responses without automatic retry", async ({
  page,
}) => {
  let release: (() => void) | undefined
  let calls = 0
  await page.route(endpoint, async (route) => {
    calls++
    await new Promise<void>((resolve) => {
      release = resolve
    })
    await route.fulfill({ json: answer })
  })
  await page.goto("guide/")
  await page.getByRole("textbox").fill("Question en attente")
  await page.getByRole("button", { name: "Envoyer", exact: true }).click()
  await expect.poll(() => calls).toBe(1)
  await page.getByRole("button", { name: "Arrêter", exact: true }).click()
  await expect(page.getByRole("textbox")).toHaveValue("Question en attente")
  release?.()
  await expect(page.getByRole("alert")).toContainText("interrompue")
  await page.getByRole("button", { name: "Nouvelle conversation" }).click()
  await expect(page.getByRole("log")).toBeEmpty()
  await expect(page.getByRole("textbox")).toHaveValue("")
  expect(calls).toBe(1)
})

test("HTML, remote images and unsafe links stay inert; citations stay out of the answer UI", async ({
  page,
}) => {
  const requests: string[] = []
  page.on("request", (request) => requests.push(request.url()))
  await page.route(endpoint, (route) =>
    route.fulfill({
      json: {
        ...answer,
        answer:
          "<script>alert(1)</script>\n\n![remote](https://untrusted.example/image.png) [unsafe](javascript:alert(1)) [safe](https://example.com/docs) **Texte sûr**",
        citations: [{ ...citation, path: "unrecognized.md" }],
      },
    })
  )
  await page.goto("guide/")
  await page.getByRole("textbox").fill("Question")
  await page.getByRole("button", { name: "Envoyer", exact: true }).click()
  await expect(page.getByText("Texte sûr", { exact: true })).toBeVisible()
  await expect(page.getByRole("log").locator("img, script")).toHaveCount(0)
  await expect(page.getByRole("log").getByRole("link")).toHaveCount(1)
  await expect(page.getByText("Sources", { exact: true })).toHaveCount(0)
  await expect(page.getByText(/unrecognized\.md/)).toHaveCount(0)
  await expect(
    page.getByRole("log").getByRole("link", { name: /unrecognized/ })
  ).toHaveCount(0)
  expect(requests.some((url) => url.includes("untrusted.example"))).toBe(false)
})

test("mobile modal traps focus and Escape restores the launcher", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await openGuide(page)
  await expect(page.getByRole("dialog")).toBeVisible()
  await expect(page.getByRole("textbox")).toBeFocused()
  await page.getByRole("button", { name: "Nouvelle conversation" }).focus()
  await page.keyboard.press("Tab")
  await expect(
    page.getByRole("button", { name: "Agrandir", exact: true })
  ).toBeFocused()
  await page.keyboard.press("Escape")
  await expect(page.getByRole("dialog")).toHaveCount(0)
  await expect(
    page.getByRole("button", { name: "Ouvrir l’assistant" })
  ).toBeFocused()
})

test("corrupt and denied storage still allow a session without resuming or making requests", async ({
  page,
}) => {
  await page.addInitScript(() => {
    sessionStorage.setItem(
      `portfolio-guide:v1:${location.pathname.replace(/guide\/$/, "")}`,
      "corrupt"
    )
  })
  let calls = 0
  await page.route(endpoint, (route) => {
    calls++
    return route.fulfill({ json: answer })
  })
  await page.goto("guide/")
  await expect(page.getByText(/ne pourra pas être restaurée/)).toBeVisible()
  expect(calls).toBe(0)
  await page.getByRole("textbox").fill("Toujours utilisable")
  await page.getByRole("button", { name: "Envoyer", exact: true }).click()
  await expect(
    page
      .locator(".guide-message-assistant .guide-markdown")
      .getByText(answer.answer, { exact: true })
  ).toBeVisible()
})

test("sleep keeps launcher focus, follows the same sequence across views, and never polls", async ({
  page,
}) => {
  let release: (() => void) | undefined
  let calls = 0
  const response = new Promise<void>((resolve) => {
    release = resolve
  })
  await page.route(endpoint, async (route) => {
    calls++
    await response
    await route.fulfill({
      status: 503,
      json: {
        status: "sleeping",
        service: "workers_ai",
        reason: "service_unavailable",
        retry_at: new Date(Date.now() + 60_000).toISOString(),
      },
    })
  })
  await openGuide(page)
  await page.clock.install()
  await page.getByRole("textbox").fill("Une question")
  await page.getByRole("button", { name: "Envoyer", exact: true }).click()
  await expect(page.locator(".guide-companion")).toHaveAttribute(
    "data-state",
    "thinking"
  )
  await page.getByRole("button", { name: "Fermer l’assistant" }).click()
  const launcher = page.getByRole("button", { name: "Ouvrir l’assistant" })
  await expect(launcher).toBeFocused()
  release?.()
  await expect(page.locator(".guide-companion")).toHaveAttribute(
    "data-state",
    "yawning"
  )
  await expect(launcher).toBeFocused()
  await page.clock.fastForward(950)
  await expect(page.locator(".guide-companion")).toHaveAttribute(
    "data-state",
    "asleep"
  )
  await expect(launcher).toBeFocused()
  await page
    .getByRole("navigation")
    .getByRole("link", { name: "Assistant" })
    .click()
  await expect(page.locator(".guide-companion")).toHaveAttribute(
    "data-state",
    "asleep"
  )
  await page.clock.fastForward(2000)
  await expect(page.locator(".guide-companion")).toHaveAttribute(
    "data-state",
    "hidden"
  )
  await expect(page.getByRole("textbox")).toHaveValue("Une question")
  await page.getByRole("button", { name: "Réduire", exact: true }).click()
  await page.getByRole("button", { name: "Fermer l’assistant" }).click()
  await expect(launcher).toBeFocused()
  await expect(launcher).toContainText("Je me repose")
  await page.clock.fastForward(120_000)
  expect(calls).toBe(1)
})

test("reduced motion hides sleeping immediately; manual retry thinks then wakes", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce", colorScheme: "dark" })
  await page.clock.install()
  let calls = 0
  let release: (() => void) | undefined
  await page.route(endpoint, async (route) => {
    calls++
    if (calls === 1) {
      await route.fulfill({
        status: 503,
        json: {
          status: "sleeping",
          service: "workers_ai",
          reason: "quota_exhausted",
          retry_at: new Date(Date.now() + 10_000).toISOString(),
        },
      })
      return
    }
    await new Promise<void>((resolve) => {
      release = resolve
    })
    await route.fulfill({ json: answer })
  })
  await page.goto("guide/")
  await page.getByRole("textbox").fill("Question conservée")
  await page.getByRole("button", { name: "Envoyer", exact: true }).click()
  await expect(page.locator(".guide-companion")).toHaveAttribute(
    "data-state",
    "hidden"
  )
  await page.reload()
  await expect(page.locator(".guide-companion")).toHaveAttribute(
    "data-state",
    "hidden"
  )
  await page.clock.fastForward(11_000)
  expect(calls).toBe(1)
  await page.getByRole("button", { name: "Envoyer", exact: true }).click()
  await expect(page.locator(".guide-companion")).toHaveAttribute(
    "data-state",
    "thinking"
  )
  release?.()
  await expect(
    page
      .locator(".guide-message-assistant .guide-markdown")
      .getByText(answer.answer, { exact: true })
  ).toBeVisible()
  await expect(page.locator(".guide-companion")).toHaveAttribute(
    "data-state",
    "idle"
  )
  expect(calls).toBe(2)
})

test("notifications and the mobile assistant remain reachable together", async ({
  page,
  context,
}) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"])
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto("contact/")
  await page.getByRole("button", { name: "Copier le lien du profil" }).click()
  const toast = page.getByText("Lien du profil copié.", { exact: true })
  await expect(toast).toBeVisible()
  const launcher = page.getByRole("button", { name: "Ouvrir l’assistant" })
  const toastBox = await toast.boundingBox()
  const launcherBox = await launcher.boundingBox()
  expect(
    toastBox && launcherBox && toastBox.y + toastBox.height < launcherBox.y
  ).toBe(true)
  await launcher.click()
  await expect(page.getByRole("textbox")).toBeFocused()
  await page.keyboard.press("Escape")
  await expect(launcher).toBeFocused()
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth
    )
  ).toBe(true)
})

test("the assistant is explanatory and makes no API request without JavaScript", async ({
  browser,
  baseURL,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false })
  await context.route("**/v1/chat", (route) => route.abort())
  const page = await context.newPage()
  const calls: string[] = []
  page.on("request", (request) => {
    if (request.url().includes("/v1/chat")) calls.push(request.url())
  })
  for (const [route, title, explanation] of [
    [
      "guide/",
      "Assistant",
      "Activez JavaScript pour discuter avec l’assistant.",
    ],
    ["en/guide/", "Assistant", "Enable JavaScript to chat with the assistant."],
  ]) {
    await page.goto(new URL(route, baseURL).href)
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(title)
    await expect(page.getByText(explanation, { exact: true })).toBeVisible()
    await expect(page.getByRole("textbox")).toBeDisabled()
    const suggestions = page.locator(".guide-suggestions button")
    await expect(suggestions).toHaveCount(3)
    for (const suggestion of await suggestions.all())
      await expect(suggestion).toBeDisabled()
  }
  expect(calls).toEqual([])
  await context.close()
})
