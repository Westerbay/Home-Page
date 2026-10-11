import * as m from "@workspace/i18n/messages"
import { assetUrl } from "../../../lib/assets"
import type { Project } from "../data/projects"

export function ProjectVisual({ project }: { project: Project }) {
  if (project.image)
    return (
      <img
        src={assetUrl(project.image)}
        alt={`${m.project_visual()} · ${project.title}`}
        loading="lazy"
      />
    )
  return (
    <div className="skull-visual" aria-label="WebApp Skull">
      <span>WEBAPP</span>
      <strong>
        Skull<span>_</span>
      </strong>
      <span className="skull-code">React / TanStack / TypeScript</span>
      <div className="skull-lines">
        <span />
        <span />
        <span />
        <span />
      </div>
    </div>
  )
}
