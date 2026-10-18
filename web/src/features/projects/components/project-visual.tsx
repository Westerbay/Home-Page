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
  if (project.image) {
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
  return (
    <div className="skull-visual" role="img" aria-label="WebApp Skull">
      <span>WEBAPP</span>
      <strong>
        Skull<span>_</span>
      </strong>
      <span className="skull-code">React / TanStack / TypeScript</span>
      <div className="skull-lines" aria-hidden="true">
        <span />
        <span />
        <span />
        <span />
      </div>
    </div>
  )
}
