import * as m from "@workspace/i18n/messages"
import { Link } from "@tanstack/react-router"
import { useCallback, useState } from "react"

import { getProjects } from "../data/projects"

interface ProjectNavigationProps {
  inProjects: boolean
  showProjects: boolean
}

export function ProjectNavigation({
  inProjects,
  showProjects,
}: ProjectNavigationProps) {
  const projects = getProjects()
  const [fits, setFits] = useState(false)
  const measureNavigation = useCallback((group: HTMLDivElement | null) => {
    if (!group) return
    const navigation = group.closest("nav")
    const parent = group.querySelector(".nav-parent")
    const branch = group.querySelector("ul")
    if (!navigation || !parent || !branch) return

    const measure = () => {
      const branchStyle = getComputedStyle(branch)
      const navigationStyle = getComputedStyle(navigation)
      const branchHeight =
        branch.scrollHeight +
        Number.parseFloat(branchStyle.marginTop) +
        Number.parseFloat(branchStyle.marginBottom)
      const children = Array.from(navigation.children)
      const linksHeight = children.reduce((height, child) => {
        if (child === group)
          return height + parent.getBoundingClientRect().height + branchHeight
        return height + child.getBoundingClientRect().height
      }, 0)
      const gaps =
        Number.parseFloat(navigationStyle.rowGap) * (children.length - 1)
      setFits(
        branch.scrollHeight > 0 &&
          Math.ceil(linksHeight + gaps) <= navigation.clientHeight
      )
    }

    const observer = new ResizeObserver(measure)
    observer.observe(navigation)
    observer.observe(branch)
    for (const child of [...navigation.children, ...branch.children]) {
      observer.observe(child)
    }
    measure()
    return () => observer.disconnect()
  }, [])
  return (
    <div
      className="project-nav-group"
      ref={measureNavigation}
      data-expanded={showProjects || fits}
    >
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
