import * as m from "@workspace/i18n/messages"

import { createFileRoute } from "@tanstack/react-router"
import { AboutPage } from "../features/about/components/about-page"
import { pageMeta } from "../lib/seo"

export const Route = createFileRoute("/about")({
  head: () => ({ meta: pageMeta(m.about(), m.about_intro()) }),
  component: AboutPage,
})
