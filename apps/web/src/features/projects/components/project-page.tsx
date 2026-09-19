import * as m from "@workspace/i18n/messages"
import { Link } from "@tanstack/react-router"
import { getProjects, categoryName, projectOriginName } from "../data/projects"
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react"
import { ProjectVisual } from "./project-visual"

export function ProjectPage({ slug }: { slug: string }) {
  const projects = getProjects()
  const project = projects.find((item) => item.slug === slug)
  if (!project) return null
  const next = projects[(projects.indexOf(project) + 1) % projects.length]
  return (
    <article className="inner-page project-detail">
      <Link to="/projects/" className="text-action back-link">
        <ArrowLeft size={16} />
        {m.back_projects()}
      </Link>
      <div className="page-heading">
        <p className="eyebrow">
          {projectOriginName(project.origin)}
          <span aria-hidden="true">·</span>
          {categoryName(project.category)}
        </p>
        <h1>{project.title}</h1>
        <p>{project.summary}</p>
      </div>
      <div className={`detail-cover project-${project.slug}`}>
        <ProjectVisual project={project} />
      </div>
      <div className="detail-body">
        <aside>
          <span className="eyebrow">{m.technologies()}</span>
          <ul className="tag-list">
            {project.tags.map((tag) => (
              <li key={tag}>{tag}</li>
            ))}
          </ul>
          <a
            href={project.repository}
            target="_blank"
            rel="noreferrer"
            className="action primary-action"
          >
            {m.source()}
            <ArrowUpRight size={17} />
          </a>
        </aside>
        <div>
          <section>
            <h2>{m.overview()}</h2>
            <p>{project.detail}</p>
          </section>
          <section>
            <h2>{m.focus()}</h2>
            <p>{project.focus}</p>
          </section>
        </div>
      </div>
      <Link
        className="next-project"
        to="/projects/$slug/"
        params={{ slug: next.slug }}
      >
        <span>{m.next_project()}</span>
        <strong>{next.title}</strong>
        <ArrowRight size={26} />
      </Link>
    </article>
  )
}
