import * as m from "@workspace/i18n/messages"
import { Link } from "@tanstack/react-router"
import { ArrowUpRight, ArrowRight } from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import { BotanicalFigure } from "./botanical-figure"
import { SchoolMention } from "../../../components/school-mention"
import { getProjects } from "../../projects/data/projects"
import { ProjectCard } from "../../projects/components/project-card"

function AtlasHero() {
  return (
    <section className="hero atlas-hero" aria-labelledby="home-title">
      <div className="hero-copy">
        <p className="eyebrow role-label">
          <span className="status-square" />
          {m.personal_site()}
        </p>
        <h1 id="home-title">
          Mathis
          <br />
          <span>Dubuisson</span>
        </h1>
        <p className="hero-intro">{m.intro()}</p>
        <p className="hero-description">{m.intro_detail()}</p>
        <div className="hero-actions">
          <Button asChild>
            <Link to="/projects/">
              {m.explore()}
              <ArrowUpRight size={18} />
            </Link>
          </Button>
          <Link to="/about/" className="text-action">
            {m.about_link()}
            <ArrowRight size={17} />
          </Link>
        </div>
      </div>
      <BotanicalFigure />
      <footer className="hero-foot">
        <SchoolMention />
        <ul className="hero-topics" role="list">
          <li>{m.games()}</li>
          <li>{m.ai()}</li>
          <li>{m.rendering()}</li>
        </ul>
      </footer>
    </section>
  )
}

export function HomePage() {
  const projects = getProjects().slice(0, 3)

  return (
    <>
      <AtlasHero />
      <section
        className="selected-section"
        id="selected"
        aria-labelledby="selected-title"
      >
        <header className="section-heading">
          <hgroup>
            <p className="eyebrow">{m.selected_work()}</p>
            <h2 id="selected-title">
              {m.selection()}
              <span className="project-total">
                {String(projects.length).padStart(2, "0")}
              </span>
            </h2>
          </hgroup>
          <Link to="/projects/" className="text-action">
            {m.all_projects()}
            <ArrowRight size={17} />
          </Link>
        </header>
        <ul className="home-projects" role="list">
          {projects.map((project, index) => (
            <li key={project.slug}>
              <ProjectCard project={project} index={index} />
            </li>
          ))}
        </ul>
      </section>
    </>
  )
}
