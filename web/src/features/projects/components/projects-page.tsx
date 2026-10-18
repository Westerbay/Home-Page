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
    <section
      className="inner-page projects-page"
      aria-labelledby="projects-title"
    >
      <header className="page-heading">
        <p className="eyebrow">01 / {m.project_directory()}</p>
        <h1 id="projects-title">{m.projects()}</h1>
        <p>{m.projects_intro()}</p>
      </header>
      <fieldset className="project-filters">
        <legend className="sr-only">{m.projects()}</legend>
        {(["all", "games", "generative", "engineering"] as const).map(
          (item) => (
            <button
              type="button"
              aria-pressed={category === item}
              onClick={() => setCategory(item)}
              key={item}
            >
              {item === "all" ? m.all() : categoryName(item)}
            </button>
          )
        )}
      </fieldset>
      <ul className="project-directory" role="list" aria-live="polite">
        {projects.map((project, index) => (
          <li key={project.slug}>
            <ProjectCard
              project={project}
              index={index}
              headingLevel={2}
              layout="directory"
              priority={index === 0}
            />
          </li>
        ))}
      </ul>
    </section>
  )
}
