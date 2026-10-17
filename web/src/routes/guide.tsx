import * as m from "@workspace/i18n/messages"
import { createFileRoute } from "@tanstack/react-router"
import { GuidePage } from "../features/guide/guide-page"
import { pageMeta } from "../lib/seo"

export const Route = createFileRoute("/guide")({
  head: () => ({ meta: pageMeta(m.guide_title(), m.guide_description()) }),
  component: GuidePage,
})
