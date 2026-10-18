import * as m from "@workspace/i18n/messages"
import { createFileRoute } from "@tanstack/react-router"
import { GuidePage } from "../features/guide/guide-page"
import { pageHead } from "../lib/seo"

export const Route = createFileRoute("/guide")({
  head: () =>
    pageHead({
      title: m.guide_title(),
      description: m.guide_description(),
      path: "/guide/",
    }),
  component: GuidePage,
})
