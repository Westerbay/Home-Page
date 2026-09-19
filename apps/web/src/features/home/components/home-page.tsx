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
    <section className="hero atlas-hero">
      <div className="hero-copy">
        <p className="eyebrow role-label">
          <span className="status-square" />
          {m.personal_site()}
        </p>
        <h1>
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
      <div className="hero-foot">
        <SchoolMention />
        <p className="hero-topics">
          <span>{m.games()}</span>
          <span>{m.ai()}</span>
          <span>{m.rendering()}</span>
        </p>
      </div>
    </section>
  )
}

export function HomePage() {
  const projects = getProjects().slice(0, 3)

  return (
    <>
      <AtlasHero />
      <section className="selected-section" id="selected">
        <div className="section-heading">
          <div>
            <p className="eyebrow">{m.selected_work()}</p>
            <h2>
              {m.selection()}
              <span className="project-total">
                {String(projects.length).padStart(2, "0")}
              </span>
            </h2>
          </div>
          <Link to="/projects/" className="text-action">
            {m.all_projects()}
            <ArrowRight size={17} />
          </Link>
        </div>
        <div className="home-projects">
          {projects.map((project, index) => (
            <ProjectCard project={project} index={index} key={project.slug} />
          ))}
        </div>
      </section>
    </>
  )
}
