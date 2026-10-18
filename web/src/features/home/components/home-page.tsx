import * as m from "@workspace/i18n/messages"
import { Link } from "@tanstack/react-router"
import { ArrowUpRight, ArrowRight } from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import { BotanicalFigure } from "./botanical-figure"
import { SchoolMention } from "../../../components/school-mention"
import { getProjects } from "../../projects/data/projects"
import { ProjectCard } from "../../projects/components/project-card"
import { assetUrl } from "../../../lib/assets"

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
            <a href="#selected">
              {m.explore()}
              <ArrowRight size={18} />
            </a>
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
  const previews: Record<string, { summary: string; image?: string }> = {
    "booster-break": { summary: m.home_booster_description() },
    spellwar: {
      summary: m.home_spellwar_description(),
      image: "assets/spellwar/gravity-transition-poster.webp",
    },
    plants: { summary: m.home_plants_description() },
  }
  const projects = getProjects()
    .slice(0, 3)
    .map((project) => ({ ...project, ...previews[project.slug] }))

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
            <p className="selection-intro">{m.selection_note()}</p>
          </hgroup>
          <Link to="/projects/" className="text-action">
            {m.all_projects()}
            <ArrowRight size={17} />
          </Link>
        </header>
        <ul className="home-projects" role="list">
          {projects.map((project, index) => (
            <li key={project.slug}>
              <ProjectCard
                project={project}
                index={index}
                layout="home"
                actionLabel={m.explore_project()}
              />
            </li>
          ))}
        </ul>
      </section>
      <section className="home-research" aria-labelledby="home-research-title">
        <header>
          <p className="eyebrow">{m.engineering()}</p>
          <h2 id="home-research-title">{m.home_research_title()}</h2>
        </header>
        <div>
          <p>{m.home_research_body()}</p>
          <ul className="home-research-links" role="list">
            <li>
              <Link
                to="/projects/$slug/"
                params={{ slug: "stylegan-cheap-dit" }}
              >
                <img
                  className="research-preview"
                  src={assetUrl("assets/home/stylegan-cheap-dit.webp")}
                  alt=""
                  width={600}
                  height={301}
                  loading="lazy"
                  decoding="async"
                />
                <span>
                  <strong>StyleGAN &amp; Cheap DiT</strong>
                  <span>{m.home_dit_note()}</span>
                </span>
                <ArrowUpRight size={22} aria-hidden="true" />
              </Link>
            </li>
            <li>
              <Link to="/projects/$slug/" params={{ slug: "pinnacle" }}>
                <img
                  className="research-preview"
                  src={assetUrl("assets/home/pinnacle.webp")}
                  alt=""
                  width={600}
                  height={338}
                  loading="lazy"
                  decoding="async"
                />
                <span>
                  <strong>PINNacle</strong>
                  <span>{m.home_pinnacle_note()}</span>
                </span>
                <ArrowUpRight size={22} aria-hidden="true" />
              </Link>
            </li>
          </ul>
        </div>
      </section>
    </>
  )
}
