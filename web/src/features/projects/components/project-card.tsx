import { Link } from "@tanstack/react-router"
import { categoryName } from "../data/projects"
import type { Project } from "../data/projects"
import { ArrowUpRight } from "lucide-react"
import { ProjectVisual } from "./project-visual"

export function ProjectCard({
  project,
  index,
  headingLevel = 3,
  actionLabel,
  layout,
  priority = false,
}: {
  project: Project
  index: number
  headingLevel?: 2 | 3
  actionLabel?: string
  layout: "home" | "directory"
  priority?: boolean
}) {
  const Heading = headingLevel === 2 ? "h2" : "h3"
  // Match the existing grids, mobile gutters and capped desktop container.
  const imageSizes =
    layout === "home"
      ? "(max-width: 600px) calc(100vw - 44px), (max-width: 1100px) calc((90vw - 36px) / 3), calc((min(90vw, 2600px) - 2 * clamp(24px, 1.62vw, 47px)) / 3)"
      : "(max-width: 600px) calc(100vw - 44px), (max-width: 1100px) calc((90vw - 32px) / 2), calc((min(90vw, 2600px) - 2 * clamp(32px, 2.25vw, 65px)) / 3)"

  return (
    <Link
      to="/projects/$slug/"
      params={{ slug: project.slug }}
      className={`project-card project-${project.slug}`}
    >
      <figure className="project-cover">
        <ProjectVisual
          project={project}
          sizes={imageSizes}
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : "auto"}
        />
        <span className="cover-number" aria-hidden="true">
          0{index + 1}
        </span>
        <span className="cover-arrow" aria-hidden="true">
          <ArrowUpRight size={20} />
        </span>
      </figure>
      <div className="project-meta">
        <span>{categoryName(project.category)}</span>
        <span>{project.tags.slice(0, 2).join(" / ")}</span>
      </div>
      <Heading>{project.title}</Heading>
      <p>{project.summary}</p>
      {actionLabel && (
        <span className="project-card-action">
          {actionLabel}
          <ArrowUpRight size={17} aria-hidden="true" />
        </span>
      )}
    </Link>
  )
}
