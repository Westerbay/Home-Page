import * as m from "@workspace/i18n/messages"

import { createFileRoute } from "@tanstack/react-router"
import { ProjectsPage } from "../features/projects/components/projects-page"
import { pageMeta } from "../lib/seo"

export const Route = createFileRoute("/projects/")({
  head: () => ({ meta: pageMeta(m.projects(), m.projects_intro()) }),
  component: ProjectsPage,
})
