import * as m from "@workspace/i18n/messages"

import { createFileRoute } from "@tanstack/react-router"
import { ProjectsPage } from "../features/projects/components/projects-page"
import { pageHead } from "../lib/seo"

export const Route = createFileRoute("/projects/")({
  head: () =>
    pageHead({
      title: m.projects(),
      description: m.projects_intro(),
      path: "/projects/",
    }),
  component: ProjectsPage,
})
