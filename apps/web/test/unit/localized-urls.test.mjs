import { test } from "node:test"
import assert from "node:assert/strict"
import {
  deLocalizeUrl,
  localizeUrl,
  extractLocaleFromUrl,
} from "../../../../packages/i18n/src/generated/runtime.js"
const base = (process.env.SITE_BASE_PATH || "/").replace(/\/$/, "")
for (const path of [
  "/",
  "/projects",
  "/projects/spellwar",
  "/about",
  "/contact",
]) {
  test("locale round trip: " + path, () => {
    const original = new URL(
      base + path + "?from=test#section",
      "https://portfolio.example"
    )
    const english = localizeUrl(original, { locale: "en" })
    assert.equal(extractLocaleFromUrl(english), "en")
    assert.equal(english.search, "?from=test")
    assert.equal(english.hash, "#section")
    assert.equal(
      deLocalizeUrl(english).pathname.replace(/\/$/, ""),
      original.pathname.replace(/\/$/, "")
    )
    assert.equal(
      extractLocaleFromUrl(localizeUrl(english, { locale: "fr" })),
      "fr"
    )
  })
}
