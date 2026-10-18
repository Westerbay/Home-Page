import * as m from "@workspace/i18n/messages"
import { Link } from "@tanstack/react-router"
import { getProjects, categoryName, projectOriginName } from "../data/projects"
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react"
import { ProjectVisual } from "./project-visual"
import { LSystemScene } from "../../lsystem/components/lsystem-scene"
import { GenerativeGallery } from "./generative-gallery"
import { EyefoxScene } from "../../eyefox/components/eyefox-scene"
import { ProjectStory } from "./project-story"
import { getProjectStory } from "../data/project-stories"

export function ProjectPage({ slug }: { slug: string }) {
  const projects = getProjects()
  const project = projects.find((item) => item.slug === slug)
  if (!project) return null
  const next = projects[(projects.indexOf(project) + 1) % projects.length]
  const story = getProjectStory(project.slug)
  return (
    <article
      className="inner-page project-detail"
      aria-labelledby="project-title"
    >
      <Link to="/projects/" className="text-action back-link">
        <ArrowLeft size={16} />
        {m.back_projects()}
      </Link>
      <header className="page-heading">
        <p className="eyebrow">
          {projectOriginName(project.origin)}
          <span aria-hidden="true">·</span>
          {categoryName(project.category)}
        </p>
        <h1 id="project-title">{project.title}</h1>
        <p>{project.summary}</p>
      </header>
      {project.slug === "plants" ? (
        <LSystemScene controls="full" />
      ) : project.slug === "eyefox" ? (
        <EyefoxScene />
      ) : (
        <figure className="project-visual">
          <div className={`detail-cover project-${project.slug}`}>
            <ProjectVisual
              project={project}
              sizes="(max-width: 600px) calc(100vw - 44px), min(90vw, 2600px)"
              loading="eager"
              fetchPriority="high"
            />
          </div>
          {project.imageCaption && (
            <figcaption className="project-visual-caption">
              {project.imageCaption}
            </figcaption>
          )}
        </figure>
      )}
      <div className="detail-body">
        <aside aria-labelledby="project-technologies">
          <h2 id="project-technologies" className="eyebrow">
            {m.technologies()}
          </h2>
          <ul className="tag-list" role="list">
            {project.tags.map((tag) => (
              <li key={tag}>{tag}</li>
            ))}
          </ul>
          <div className="project-links">
            {project.demo && (
              <a
                href={project.demo}
                target="_blank"
                rel="noreferrer"
                className="action primary-action"
              >
                {m.play_project()}
                <ArrowUpRight size={17} />
              </a>
            )}
            <a
              href={project.repository}
              target="_blank"
              rel="noreferrer"
              className={
                project.demo ? "action text-action" : "action primary-action"
              }
            >
              {m.source()}
              <ArrowUpRight size={17} />
            </a>
          </div>
        </aside>
        <div>
          <section aria-labelledby="project-overview">
            <h2 id="project-overview">{m.overview()}</h2>
            <p>{project.detail}</p>
          </section>
          <section aria-labelledby="project-focus">
            <h2 id="project-focus">{project.focusTitle ?? m.focus()}</h2>
            <p>{project.focus}</p>
          </section>
        </div>
      </div>
      {project.slug === "stylegan-cheap-dit" && <GenerativeGallery />}
      <ProjectStory sections={story} />
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
