import { createFileRoute, notFound } from "@tanstack/react-router"
import { getProjects } from "../features/projects/data/projects"
import { ProjectPage } from "../features/projects/components/project-page"
import * as m from "@workspace/i18n/messages"
import { pageHead } from "../lib/seo"

export const Route = createFileRoute("/projects/$slug")({
  loader: ({ params }) => {
    const project = getProjects().find((item) => item.slug === params.slug)
    if (!project) throw notFound()
    return project
  },
  head: ({ loaderData }) => {
    if (!loaderData) return {}
    return pageHead({
      title: loaderData.title,
      description: loaderData.summary,
      path: `/projects/${loaderData.slug}/`,
      imageName: loaderData.slug,
      imageAlt: m.social_project_alt({ project: loaderData.title }),
    })
  },
  component: ProjectRoute,
})
function ProjectRoute() {
  const { slug } = Route.useParams()
  return <ProjectPage slug={slug} />
}
