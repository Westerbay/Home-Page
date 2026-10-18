import * as m from "@workspace/i18n/messages"

import { createFileRoute } from "@tanstack/react-router"
import { ContactPage } from "../features/contact/components/contact-page"
import { pageHead } from "../lib/seo"

export const Route = createFileRoute("/contact")({
  head: () =>
    pageHead({
      title: m.contact(),
      description: m.contact_body(),
      path: "/contact/",
    }),
  component: ContactPage,
})
