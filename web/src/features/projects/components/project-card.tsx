import { Link } from "@tanstack/react-router"
import { categoryName } from "../data/projects"
import type { Project } from "../data/projects"
import { ArrowUpRight } from "lucide-react"
import { ProjectVisual } from "./project-visual"

export function ProjectCard({
  project,
  index,
}: {
  project: Project
  index: number
}) {
  return (
    <Link
      to="/projects/$slug/"
      params={{ slug: project.slug }}
      className={`project-card project-${project.slug}`}
    >
      <div className="project-cover">
        <ProjectVisual project={project} />
        <span className="cover-number">0{index + 1}</span>
        <span className="cover-arrow">
          <ArrowUpRight size={20} />
        </span>
      </div>
      <div className="project-meta">
        <span>{categoryName(project.category)}</span>
        <span>{project.tags.slice(0, 2).join(" / ")}</span>
      </div>
      <h3>{project.title}</h3>
      <p>{project.summary}</p>
    </Link>
  )
}
