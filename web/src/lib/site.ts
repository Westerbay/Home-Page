import languageSettings from "../../../packages/i18n/project.inlang/settings.json" with { type: "json" }

export const SITE_ORIGIN = "https://portfolio.mathis-db.com"
export const siteLocales = languageSettings.locales
export const defaultSiteLocale = languageSettings.baseLocale

// Shared by prerendering and the sitemap so published pages stay discoverable.
export const publicPagePaths = [
  "/",
  "/projects/",
  "/projects/booster-break/",
  "/projects/spellwar/",
  "/projects/plants/",
  "/projects/eyefox/",
  "/projects/pinnacle/",
  "/projects/stylegan-cheap-dit/",
  "/about/",
  "/contact/",
  "/guide/",
]

export function localizedPagePath(path: string, locale: string, base = "/") {
  const prefix = base.replace(/\/$/, "")
  const localePrefix = locale === defaultSiteLocale ? "" : "/" + locale
  const pagePath = path === "/" ? "/" : "/" + path.replace(/^\/|\/$/g, "") + "/"
  return prefix + localePrefix + pagePath
}

export function pageUrl(path: string, locale: string, base = "/") {
  return new URL(localizedPagePath(path, locale, base), SITE_ORIGIN).href
}
