import { defineConfig } from "@playwright/test"
const base = process.env.SITE_BASE_PATH || "/"
export default defineConfig({
  testDir: "./apps/web/test/e2e",
  timeout: 20000,
  fullyParallel: true,
  workers: 3,
  use: {
    baseURL: "http://127.0.0.1:4175" + base,
    browserName: "chromium",
    locale: "fr-FR",
    colorScheme: "light",
    trace: "retain-on-failure",
  },
  webServer: {
    command: "node scripts/serve.mjs",
    env: { PORT: "4175" },
    url: "http://127.0.0.1:4175" + base,
    reuseExistingServer: !process.env.CI,
  },
})
