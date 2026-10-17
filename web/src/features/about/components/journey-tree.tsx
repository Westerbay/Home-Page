import { Link } from "@tanstack/react-router"
import { ArrowUpRight } from "lucide-react"
import * as m from "@workspace/i18n/messages"
import { assetUrl } from "../../../lib/assets"
import { getProjects } from "../../projects/data/projects"

export function JourneyTree() {
  const academicProjects = getProjects().filter(
    (project) => project.origin === "academic"
  )
  const milestones = [
    {
      id: "professional",
      logo: "assets/galadrim.svg",
      date: m.journey_work_date(),
      title: m.journey_work_title(),
      context: m.journey_work_employer(),
      body: m.journey_work_body(),
      branches: [
        m.journey_work_branch_1(),
        m.journey_work_branch_2(),
        m.journey_work_branch_3(),
        m.journey_work_branch_4(),
      ],
      projects: [],
    },
    {
      id: "engineering",
      logo: "assets/ensicaen.png",
      date: m.journey_engineering_date(),
      title: m.journey_engineering_title(),
      context: m.journey_engineering_school(),
      body: m.journey_engineering_body(),
      branches: [],
      projects: academicProjects,
    },
    {
      id: "computer-science",
      logo: "assets/unicaen.svg",
      date: m.journey_cs_date(),
      title: m.journey_cs_title(),
      context: m.journey_cs_school(),
      body: m.journey_cs_body(),
      branches: [],
      projects: [],
    },
    {
      id: "mathematics",
      logo: "assets/unicaen.svg",
      date: m.journey_math_date(),
      title: m.journey_math_title(),
      context: m.journey_math_school(),
      body: m.journey_math_body(),
      branches: [],
      projects: [],
    },
  ]
  return (
    <section className="journey-section" aria-labelledby="journey-title">
      <header className="journey-heading">
        <p className="eyebrow">{m.journey_label()}</p>
        <h2 id="journey-title">{m.journey_title()}</h2>
        <p>{m.journey_intro()}</p>
      </header>
      <ol className="journey-tree" role="list">
        {milestones.map((milestone) => (
          <li className="journey-milestone" key={milestone.id}>
            <p className="journey-date">{milestone.date}</p>
            <div className="journey-copy">
              <div className="journey-title-row">
                <h3>{milestone.title}</h3>
                <span className={`journey-logo journey-logo-${milestone.id}`}>
                  <img
                    src={assetUrl(milestone.logo)}
                    alt=""
                    width="80"
                    height="56"
                  />
                </span>
              </div>
              {milestone.context && (
                <p className="journey-context">{milestone.context}</p>
              )}
              {milestone.body && <p>{milestone.body}</p>}
              {milestone.branches.length > 0 && (
                <ul className="journey-branches" role="list">
                  {milestone.branches.map((branch) => (
                    <li key={branch}>{branch}</li>
                  ))}
                </ul>
              )}
              {milestone.projects.length > 0 && (
                <ul
                  className="journey-branches journey-projects"
                  role="list"
                  aria-label={m.journey_projects_label()}
                >
                  {milestone.projects.map((project) => (
                    <li key={project.slug}>
                      <Link
                        to="/projects/$slug/"
                        params={{ slug: project.slug }}
                      >
                        {project.title}
                      </Link>
                      <a
                        className="journey-source"
                        href={project.repository}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={`${m.source()} : ${project.title} (${m.external()})`}
                      >
                        <span>GitHub</span>
                        <ArrowUpRight size={12} aria-hidden="true" />
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </li>
        ))}
      </ol>
    </section>
  )
}
