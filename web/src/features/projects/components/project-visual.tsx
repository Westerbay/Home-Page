import * as m from "@workspace/i18n/messages"
import { assetUrl } from "../../../lib/assets"
import type { Project } from "../data/projects"

export function ProjectVisual({
  project,
  loading = "lazy",
  fetchPriority,
}: {
  project: Project
  loading?: "eager" | "lazy"
  fetchPriority?: "high" | "low" | "auto"
}) {
  if (project.image)
    return (
      <img
        src={assetUrl(project.image)}
        alt={`${m.project_visual()} · ${project.title}`}
        loading={loading}
        fetchPriority={fetchPriority}
      />
    )
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
