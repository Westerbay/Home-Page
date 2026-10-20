import * as m from "@workspace/i18n/messages"
import { assetUrl } from "../../../lib/assets"
import type { Project } from "../data/projects"
import { getProjectImage } from "../data/project-image"

export function ProjectVisual({
  project,
  sizes,
  loading = "lazy",
  fetchPriority,
}: {
  project: Project
  sizes: string
  loading?: "eager" | "lazy"
  fetchPriority?: "high" | "low" | "auto"
}) {
  const image = getProjectImage(project.image)
  return (
    <img
      src={assetUrl(project.image)}
      srcSet={image?.srcSet}
      sizes={sizes}
      width={image?.width}
      height={image?.height}
      alt={`${m.project_visual()} · ${project.title}`}
      loading={loading}
      fetchPriority={fetchPriority}
    />
  )
}
