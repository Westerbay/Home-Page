import { createFileRoute, notFound } from "@tanstack/react-router"
import { getProjects } from "../features/projects/data/projects"
import { ProjectPage } from "../features/projects/components/project-page"
import { pageMeta } from "../lib/seo"

export const Route = createFileRoute("/projects/$slug")({
  loader: ({ params }) => {
    const project = getProjects().find((item) => item.slug === params.slug)
    if (!project) throw notFound()
    return project
  },
  head: ({ loaderData }) => ({
    meta: loaderData ? pageMeta(loaderData.title, loaderData.summary) : [],
  }),
  component: ProjectRoute,
})
function ProjectRoute() {
  const { slug } = Route.useParams()
  return <ProjectPage slug={slug} />
}
