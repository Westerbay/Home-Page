import * as m from "@workspace/i18n/messages"

import { createFileRoute } from "@tanstack/react-router"
import { HomePage } from "../features/home/components/home-page"
import { pageHead } from "../lib/seo"

export const Route = createFileRoute("/")({
  head: () =>
    pageHead({
      title: m.home(),
      description: m.home_meta_description(),
      path: "/",
    }),
  component: HomePage,
})
