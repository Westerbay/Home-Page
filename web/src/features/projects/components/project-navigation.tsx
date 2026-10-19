import * as m from "@workspace/i18n/messages"
import { Link } from "@tanstack/react-router"

import { getProjects } from "../data/projects"

interface ProjectNavigationProps {
  inProjects: boolean
}

export function ProjectNavigation({ inProjects }: ProjectNavigationProps) {
  const projects = getProjects()
  return (
    <div className="project-nav-group">
      <Link
        to="/projects/"
        className={inProjects ? "nav-parent current-branch" : "nav-parent"}
        activeOptions={{ exact: true }}
        activeProps={{ className: "active", "aria-current": "page" }}
      >
        {m.projects()}
      </Link>
      <ul className="project-nav-branch">
        {projects.map((project) => (
          <li key={project.slug}>
            <Link
              className="project-nav-link"
              to="/projects/$slug/"
              params={{ slug: project.slug }}
              activeOptions={{ exact: true, includeHash: false }}
              activeProps={{ className: "active", "aria-current": "page" }}
            >
              {project.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
