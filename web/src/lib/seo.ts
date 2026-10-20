import profile from "@workspace/config/profile" with { type: "json" }
import * as m from "@workspace/i18n/messages"
import { getLocale } from "@workspace/i18n/runtime"
import { assetUrl } from "./assets"
import { defaultSiteLocale, pageUrl, SITE_ORIGIN, siteLocales } from "./site"

interface PageHeadOptions {
  title: string
  description: string
  path: string
  imageName?: string
  imageAlt?: string
}

function openGraphLocale(locale: string) {
  return locale === "fr" ? "fr_FR" : "en_GB"
}

export function pageHead({
  title,
  description,
  path,
  imageName,
  imageAlt = m.social_default_alt(),
}: PageHeadOptions) {
  const locale = getLocale()
  const base = import.meta.env.BASE_URL
  const canonical = pageUrl(path, locale, base)
  const imagePrefix = locale === defaultSiteLocale ? "" : `${locale}/`
  let preview = {
    path: "assets/avatar.png",
    type: "image/png",
    width: "450",
    height: "450",
    card: "summary",
  }
  if (imageName) {
    preview = {
      path: `assets/social/${imagePrefix}${imageName}.jpg`,
      type: "image/jpeg",
      width: "1200",
      height: "630",
      card: "summary_large_image",
    }
  }
  const imageUrl = new URL(assetUrl(preview.path), SITE_ORIGIN).href
  const fullTitle = title + " · " + profile.name

  return {
    meta: [
      { title: fullTitle },
      { name: "description", content: description },
      { property: "og:title", content: fullTitle },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: canonical },
      { property: "og:site_name", content: profile.name },
      { property: "og:locale", content: openGraphLocale(locale) },
      ...siteLocales
        .filter((alternate) => alternate !== locale)
        .map((alternate) => ({
          property: "og:locale:alternate",
          content: openGraphLocale(alternate),
        })),
      { property: "og:image", content: imageUrl },
      { property: "og:image:type", content: preview.type },
      { property: "og:image:width", content: preview.width },
      { property: "og:image:height", content: preview.height },
      { property: "og:image:alt", content: imageAlt },
      { name: "twitter:card", content: preview.card },
      { name: "twitter:title", content: fullTitle },
      { name: "twitter:description", content: description },
      { name: "twitter:image", content: imageUrl },
      { name: "twitter:image:alt", content: imageAlt },
    ],
    links: [
      { rel: "canonical", href: canonical },
      ...siteLocales.map((alternate) => ({
        rel: "alternate",
        hrefLang: alternate,
        href: pageUrl(path, alternate, base),
      })),
      {
        rel: "alternate",
        hrefLang: "x-default",
        href: pageUrl(path, defaultSiteLocale, base),
      },
    ],
  }
}
