import * as m from "@workspace/i18n/messages"

import { createFileRoute } from "@tanstack/react-router"
import { HomePage } from "../features/home/components/home-page"
import { pageMeta } from "../lib/seo"

export const Route = createFileRoute("/")({
  head: () => ({ meta: pageMeta(m.home(), m.intro()) }),
  component: HomePage,
})
