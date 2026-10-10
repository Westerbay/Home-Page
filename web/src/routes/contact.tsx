import * as m from "@workspace/i18n/messages"

import { createFileRoute } from "@tanstack/react-router"
import { ContactPage } from "../features/contact/components/contact-page"
import { pageMeta } from "../lib/seo"

export const Route = createFileRoute("/contact")({
  head: () => ({ meta: pageMeta(m.contact(), m.contact_body()) }),
  component: ContactPage,
})
