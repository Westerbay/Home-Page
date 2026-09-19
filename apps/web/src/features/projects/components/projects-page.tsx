import * as m from "@workspace/i18n/messages"
import { useState } from "react"
import { getProjects, categoryName } from "../data/projects"
import type { Project } from "../data/projects"
import { ProjectCard } from "./project-card"

export function ProjectsPage() {
  const [category, setCategory] = useState<"all" | Project["category"]>("all")
  const projects = getProjects().filter(
    (project) => category === "all" || project.category === category
  )
  return (
    <section className="inner-page projects-page">
      <div className="page-heading">
        <p className="eyebrow">01 / {m.project_directory()}</p>
        <h1>{m.projects()}</h1>
        <p>{m.projects_intro()}</p>
      </div>
      <div className="project-filters" aria-label={m.projects()}>
        {(["all", "games", "generative"] as const).map((item) => (
          <button
            type="button"
            aria-pressed={category === item}
            onClick={() => setCategory(item)}
            key={item}
          >
            {item === "all" ? m.all() : categoryName(item)}
          </button>
        ))}
      </div>
      <div className="project-directory" aria-live="polite">
        {projects.map((project, index) => (
          <ProjectCard project={project} index={index} key={project.slug} />
        ))}
      </div>
    </section>
  )
}
