import { test, expect } from "@playwright/test"

const projects = ["booster-break", "spellwar", "plants", "pinnacle", "eyefox"]

for (const locale of ["", "en/"]) {
  test(`project stories are readable static pages with reachable media: ${locale || "fr"}`, async ({
    browser,
    baseURL,
    request,
  }) => {
    const context = await browser.newContext({ javaScriptEnabled: false })
    const page = await context.newPage()
    try {
      for (const slug of projects) {
        await page.goto(`${baseURL}${locale}projects/${slug}/`)
        await expect(page.locator("html")).toHaveAttribute(
          "lang",
          locale ? "en" : "fr"
        )
        const story = page.locator(".project-story")
        await expect(story).toBeVisible()
        expect(
          await story.getByRole("heading", { level: 2 }).count()
        ).toBeGreaterThanOrEqual(2)
        for (const link of await story
          .locator(".story-images figure a")
          .all()) {
          const href = await link.getAttribute("href")
          expect(href).toBeTruthy()
          const response = await request.get(new URL(href ?? "", baseURL).href)
          expect(response.ok()).toBe(true)
          expect(response.headers()["content-type"]).toContain("image/")
          await expect(link.locator("img")).toHaveAttribute("alt", /\S/)
        }
        for (const width of [390, 1440]) {
          await page.setViewportSize({ width, height: 900 })
          expect(
            await page.evaluate(
              () => document.documentElement.scrollWidth <= innerWidth
            )
          ).toBe(true)
        }
      }
    } finally {
      await context.close()
    }
  })

  test(`SpellWar video waits for the viewport, then autoplays silently and loops: ${locale || "fr"}`, async ({
    page,
    request,
    baseURL,
  }) => {
    const videoRequests: string[] = []
    page.on("request", (request) => {
      if (request.url().endsWith("/spellwar/gravity-transition.mp4")) {
        videoRequests.push(request.url())
      }
    })
    await page.goto(`${locale}projects/spellwar/`)
    const video = page.locator(".project-story video")
    await page.waitForLoadState("networkidle")
    await expect(video).toHaveAttribute("preload", "none")
    await expect(video).not.toHaveAttribute("autoplay")
    expect(videoRequests).toHaveLength(0)
    await video.scrollIntoViewIfNeeded()
    await expect(video).toBeVisible()
    await expect(video).toHaveAccessibleName(/\S/)
    await expect(video).toHaveAttribute("controls", "")
    await expect(video).toHaveAttribute("autoplay", "")
    await expect(video).toHaveAttribute("loop", "")
    await expect(video).toHaveJSProperty("muted", true)
    await expect.poll(() => videoRequests.length).toBeGreaterThan(0)

    const source = await video.getAttribute("src")
    const poster = await video.getAttribute("poster")
    expect(source).toBeTruthy()
    expect(poster).toBeTruthy()
    const response = await request.get(new URL(source ?? "", baseURL).href)
    expect(response.ok()).toBe(true)
    expect(response.headers()["content-type"]).toContain("video/mp4")
    const posterResponse = await request.get(
      new URL(poster ?? "", baseURL).href
    )
    expect(posterResponse.ok()).toBe(true)
    expect(posterResponse.headers()["content-type"]).toContain("image/")

    await expect
      .poll(() =>
        video.evaluate((element: HTMLVideoElement) => element.currentTime)
      )
      .toBeGreaterThan(0.25)
    await video.evaluate((element: HTMLVideoElement) => {
      element.currentTime = element.duration - 0.25
    })
    await expect
      .poll(() =>
        video.evaluate((element: HTMLVideoElement) => element.currentTime)
      )
      .toBeLessThan(2)
    await expect(video).toHaveJSProperty("paused", false)
    await video.evaluate((element: HTMLVideoElement) => element.pause())
  })
}

test("SpellWar video remains playable without JavaScript", async ({
  browser,
  baseURL,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false })
  const page = await context.newPage()
  try {
    await page.goto(`${baseURL}projects/spellwar/`)
    const video = page.locator(".project-story video")
    await video.scrollIntoViewIfNeeded()
    await expect(video).toHaveAttribute("controls", "")
    await expect(video).toHaveAttribute("src", /gravity-transition\.mp4$/)
    await video.evaluate((element: HTMLVideoElement) => element.play())
    await expect
      .poll(() =>
        video.evaluate((element: HTMLVideoElement) => element.currentTime)
      )
      .toBeGreaterThan(0.25)
  } finally {
    await context.close()
  }
})

test("SpellWar video autoplays when viewport observation is unavailable", async ({
  page,
}) => {
  await page.addInitScript(() => {
    Object.defineProperty(window, "IntersectionObserver", { value: undefined })
  })
  await page.goto("projects/spellwar/")
  const video = page.locator(".project-story video")
  await video.scrollIntoViewIfNeeded()
  await expect(video).toHaveAttribute("autoplay", "")
  await expect
    .poll(() =>
      video.evaluate((element: HTMLVideoElement) => element.currentTime)
    )
    .toBeGreaterThan(0.25)
  await expect(video).toHaveJSProperty("muted", true)
})
