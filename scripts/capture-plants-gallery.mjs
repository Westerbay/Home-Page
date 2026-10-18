import { chromium, expect } from "@playwright/test"
import { mkdir } from "node:fs/promises"

// Capture the actual shared WebGL renderer, with its unmodified preset definitions.
const url = process.argv[2] ?? "http://127.0.0.1:4180/"
const output = process.argv[3] ?? "test-results/plants-captures"
await mkdir(output, { recursive: true })
const browser = await chromium.launch({
  args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader"],
})
try {
  const page = await browser.newPage({
    viewport: { width: 1600, height: 1100 },
    deviceScaleFactor: 1,
    colorScheme: "light",
  })
  await page.goto(url)
  await expect(page.locator(".lsystem [role=status]")).toContainText(
    /Drawing updated|Dessin mis à jour/
  )
  await page.addStyleTag({
    content:
      ".lsystem-viewport { width: 1200px !important; height: 800px !important; min-height: 800px !important; } .lsystem { --lsystem-height: 800px; width: 1540px !important; max-width: none !important; }",
  })
  const preset = page.locator('select[id$="-preset"]')
  for (const name of ["plant", "tree", "flower", "hilbert"]) {
    await preset.selectOption(name)
    await expect(page.locator(".lsystem [role=status]")).toContainText(
      /Drawing updated|Dessin mis à jour/
    )
    // Wait for the renderer's next two frames after geometry/layout updates.
    await page.evaluate(
      () =>
        new Promise((resolve) =>
          requestAnimationFrame(() => requestAnimationFrame(resolve))
        )
    )
    await page
      .locator(".lsystem-canvas")
      .screenshot({ path: `${output}/${name}.png` })
    console.log(
      `${name}: ${await page.locator(".lsystem-canvas").getAttribute("width")} x ${await page.locator(".lsystem-canvas").getAttribute("height")}`
    )
  }
} finally {
  await browser.close()
}
