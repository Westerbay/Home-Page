import * as m from "@workspace/i18n/messages"

import { createFileRoute } from "@tanstack/react-router"
import { AboutPage } from "../features/about/components/about-page"
import { pageHead } from "../lib/seo"

export const Route = createFileRoute("/about")({
  head: () =>
    pageHead({
      title: m.about(),
      description: m.about_meta_description(),
      path: "/about/",
    }),
  component: AboutPage,
})
