import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { createRoot } from "react-dom/client"
import {
  createHashHistory,
  createRootRoute,
  createRoute,
  createRouter,
  Link,
  Outlet,
  RouterProvider,
  useRouterState
} from "@tanstack/react-router"
import { ThemeProvider, useTheme } from "next-themes"
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronRight,
  Copy,
  CodeXml as Github,
  BriefcaseBusiness as Linkedin,
  Monitor,
  Moon,
  Plus,
  Smartphone,
  Sun
} from "lucide-react"
import { Toaster, toast } from "sonner"
import {
  directionSchema,
  directionNames,
  getProjects,
  categoryName,
  profile,
  type Direction,
  type Project
} from "./content"
import * as m from "./paraglide/messages.js"
import { getLocale, setLocale } from "./paraglide/runtime.js"
import "./styles.css"

function readDirection(): Direction {
  try {
    const requested =
      new URLSearchParams(location.search).get("direction") ||
      localStorage.getItem("portfolio-direction")
    return directionSchema.parse(requested)
  } catch {
    return "signal"
  }
}

type Preferences = {
  direction: Direction
  changeDirection: (value: Direction) => void
  locale: "fr" | "en"
  changeLocale: () => void
}
const PreferenceContext = createContext<Preferences | null>(null)
function usePreferences() {
  const context = useContext(PreferenceContext)
  if (!context) throw new Error("Missing portfolio preferences")
  return context
}
function PreferencesProvider({ children }: { children: ReactNode }) {
  const [direction, setDirection] = useState<Direction>(readDirection)
  const [locale, updateLocale] = useState<"fr" | "en">(() => getLocale())
  function changeDirection(next: Direction) {
    setDirection(next)
    try {
      localStorage.setItem("portfolio-direction", next)
    } catch {
      /* Preferences are optional. */
    }
    const url = new URL(location.href)
    url.searchParams.set("direction", next)
    history.replaceState(history.state, "", url)
  }
  function changeLocale() {
    const next = locale === "fr" ? "en" : "fr"
    setLocale(next, { reload: false })
    updateLocale(next)
  }
  useEffect(() => {
    document.documentElement.lang = locale
  }, [locale])
  return (
    <PreferenceContext.Provider
      value={{ direction, changeDirection, locale, changeLocale }}
    >
      {children}
    </PreferenceContext.Provider>
  )
}

function LabToolbar({
  mobile,
  setMobile
}: {
  mobile: boolean
  setMobile: (value: boolean) => void
}) {
  const { direction, changeDirection } = usePreferences()
  const notes = {
    signal: m.signal_note(),
    atlas: m.atlas_note(),
    arcade: m.arcade_note(),
    mix: m.mix_note()
  }
  return (
    <div className="lab-toolbar">
      <div className="lab-brand">
        <span className="lab-dot" />
        <div>
          <strong>{m.lab_label()}</strong>
          <span>{m.lab_hint()}</span>
        </div>
      </div>
      <div className="direction-switch" aria-label={m.lab_label()}>
        {(["signal", "atlas", "arcade", "mix"] as const).map((name, index) => (
          <button
            type="button"
            key={name}
            onClick={() => changeDirection(name)}
            aria-pressed={direction === name}
          >
            <span>0{index + 1}</span>
            {directionNames[name]}
          </button>
        ))}
      </div>
      <div className="device-switch" aria-label="Viewport">
        <button
          type="button"
          aria-label={m.lab_desktop()}
          aria-pressed={!mobile}
          onClick={() => setMobile(false)}
        >
          <Monitor size={17} />
        </button>
        <button
          type="button"
          aria-label={m.lab_mobile()}
          aria-pressed={mobile}
          onClick={() => setMobile(true)}
        >
          <Smartphone size={17} />
        </button>
      </div>
      <p className="direction-description" aria-live="polite">
        {notes[direction]}
      </p>
    </div>
  )
}

function ThemeControl() {
  const { theme, setTheme } = useTheme()
  const modes = ["system", "light", "dark"]
  const labels = {
    system: m.theme_system(),
    light: m.theme_light(),
    dark: m.theme_dark()
  }
  const current = theme === "light" || theme === "dark" ? theme : "system"
  const Icon = current === "system" ? Monitor : current === "light" ? Sun : Moon
  return (
    <button
      className="utility-button theme-button"
      type="button"
      aria-label={`${labels[current]} · ${m.theme_next()}`}
      title={labels[current]}
      onClick={() => setTheme(modes[(modes.indexOf(current) + 1) % modes.length])}
    >
      <Icon size={17} />
      <span>{labels[current]}</span>
    </button>
  )
}

function Header() {
  const { locale, changeLocale } = usePreferences()
  return (
    <header className="site-header">
      <Link className="identity" to="/" aria-label={`${profile.name} · ${m.home()}`}>
        <img src={profile.avatar} alt="" width="38" height="38" />
        <span>
          Mathis Dubuisson<span className="identity-sub">{m.role()}</span>
        </span>
      </Link>
      <nav className="main-nav" aria-label={m.navigation()}>
        <Link
          to="/"
          activeOptions={{ exact: true }}
          activeProps={{ className: "active", "aria-current": "page" }}
        >
          {m.home()}
        </Link>
        <Link
          to="/projects"
          activeProps={{ className: "active", "aria-current": "page" }}
        >
          {m.projects()}
        </Link>
        <Link to="/about" activeProps={{ className: "active", "aria-current": "page" }}>
          {m.about()}
        </Link>
        <Link to="/contact" activeProps={{ className: "active", "aria-current": "page" }}>
          {m.contact()}
        </Link>
      </nav>
      <div className="header-tools">
        <button
          className="utility-button language-button"
          type="button"
          lang={locale === "fr" ? "en" : "fr"}
          aria-label={m.language()}
          onClick={changeLocale}
        >
          {locale.toUpperCase()}
          <span className="alternate-language">/ {locale === "fr" ? "EN" : "FR"}</span>
        </button>
        <ThemeControl />
      </div>
    </header>
  )
}

function Terrain() {
  const project = (u: number, v: number) => {
    const elevation =
      122 * Math.exp(-((u - 0.1) ** 2 * 3.6 + (v + 0.1) ** 2 * 4)) +
      32 * Math.exp(-((u + 0.6) ** 2 * 9 + (v - 0.5) ** 2 * 6))
    return `${300 + (u - v) * 125},${262 + (u + v) * 63 - elevation}`
  }
  const lines = []
  for (let i = 0; i <= 24; i++) {
    const p = -1 + i / 12
    lines.push(
      <polyline
        key={`u${i}`}
        points={Array.from({ length: 49 }, (_, k) => project(p, -1 + k / 24)).join(" ")}
      />
    )
    lines.push(
      <polyline
        key={`v${i}`}
        points={Array.from({ length: 49 }, (_, k) => project(-1 + k / 24, p)).join(" ")}
      />
    )
  }
  return (
    <svg className="terrain" viewBox="0 0 600 430" fill="none" aria-hidden="true">
      <g stroke="currentColor" strokeWidth=".65" opacity=".55">
        {lines}
      </g>
      <g
        className="terrain-axis"
        stroke="currentColor"
        opacity=".25"
        strokeDasharray="3 5"
      >
        <path d="M35 262H565M300 32V405" />
      </g>
      <g fill="currentColor">
        <rect x="295" y="126" width="10" height="10" />
        <rect x="44" y="257" width="6" height="6" />
        <rect x="548" y="258" width="6" height="6" />
      </g>
      <path d="M300 131V56H407" stroke="currentColor" />
      <circle cx="410" cy="56" r="3" fill="currentColor" />
    </svg>
  )
}

function Botanical() {
  const branches: ReactNode[] = []
  function grow(
    x: number,
    y: number,
    length: number,
    angle: number,
    level: number,
    seed: number
  ) {
    if (!level) return
    const rad = (angle * Math.PI) / 180
    const endX = x + Math.cos(rad) * length
    const endY = y + Math.sin(rad) * length
    branches.push(
      <path
        key={seed}
        d={`M${x},${y} Q${x + Math.cos(rad + 0.12) * length * 0.5},${y + Math.sin(rad + 0.12) * length * 0.5} ${endX},${endY}`}
        strokeWidth={Math.max(0.7, level * 0.52)}
      />
    )
    if (level <= 3)
      branches.push(
        <ellipse
          key={`l${seed}`}
          cx={endX}
          cy={endY}
          rx={3 + level}
          ry={10 + level * 2}
          transform={`rotate(${angle + 90} ${endX} ${endY})`}
          fill="currentColor"
          stroke="none"
          opacity=".72"
        />
      )
    grow(endX, endY, length * 0.76, angle - 26 - (seed % 9), level - 1, seed * 2)
    grow(endX, endY, length * 0.72, angle + 31 + (seed % 7), level - 1, seed * 2 + 1)
  }
  grow(265, 447, 94, -90, 7, 1)
  return (
    <svg className="botanical" viewBox="0 0 530 500" fill="none" aria-hidden="true">
      <g stroke="currentColor" strokeLinecap="round">
        {branches}
      </g>
      <path d="M170 461H360" stroke="currentColor" opacity=".3" />
    </svg>
  )
}

function HeroText() {
  return (
    <>
      <p className="eyebrow role-label">
        <span className="status-square" />
        {m.role()}
      </p>
      <h1>
        Mathis
        <br />
        <span>
          Dubuisson<span className="name-period">.</span>
        </span>
      </h1>
      <p className="hero-intro">{m.intro()}</p>
      <p className="hero-description">{m.intro_detail()}</p>
    </>
  )
}
function HeroActions() {
  return (
    <div className="hero-actions">
      <Link to="/projects" className="action primary-action">
        {m.explore()}
        <ArrowUpRight size={18} />
      </Link>
      <Link to="/about" className="text-action">
        {m.about_link()}
        <ArrowRight size={17} />
      </Link>
    </div>
  )
}
function SignalHero() {
  return (
    <section className="hero signal-hero">
      <div className="hero-copy">
        <HeroText />
        <HeroActions />
      </div>
      <div className="signal-art">
        <div className="art-topline">
          <span>MD / 001</span>
          <span>{m.end_to_end()}</span>
          <Plus size={16} />
        </div>
        <Terrain />
        <div className="art-annotation">
          {m.visual_exploration()}
          <span>
            01 · {m.product()}
            <br />
            02 · {m.software()}
            <br />
            03 · {m.infrastructure()}
          </span>
        </div>
        <div className="art-bottomline">
          <span>DESIGN → BUILD → SHIP</span>
          <span>↗</span>
        </div>
      </div>
      <div className="hero-foot">
        <span>{m.degree()}</span>
        <a
          href="#selected"
          onClick={(e) => {
            e.preventDefault()
            document.getElementById("selected")?.scrollIntoView({
              behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
                ? "instant"
                : "smooth"
            })
          }}
        >
          {m.selected_work()}
          <ArrowDown size={15} />
        </a>
      </div>
    </section>
  )
}
function AtlasHero() {
  return (
    <section className="hero atlas-hero">
      <div className="atlas-margin">
        <span>PORTFOLIO / MD</span>
        <span>01 · {m.field_notes()}</span>
      </div>
      <div className="hero-copy">
        <HeroText />
        <HeroActions />
      </div>
      <div className="atlas-art">
        <div className="botanical-header">
          <span>FIG. 01</span>
          <span>L-SYSTEMS</span>
        </div>
        <Botanical />
        <div className="botanical-caption">
          <span>{m.visual_exploration()}</span>
          <Link to="/projects/$slug" params={{ slug: "plants" }}>
            The Algorithmic Beauty of Plants
            <ArrowUpRight size={16} />
          </Link>
        </div>
        <span className="paper-corner" />
      </div>
      <div className="hero-foot">
        <span>{m.degree()}</span>
        <span>{m.personal_site()}</span>
      </div>
    </section>
  )
}
function ArcadeHero() {
  return (
    <section className="hero arcade-hero">
      <div className="hero-copy">
        <p className="eyebrow arcade-kicker">
          <span className="status-square" />
          {m.personal_site()}
        </p>
        <h1>
          Mathis
          <br />
          <span>
            Dubuisson<span className="name-period">.</span>
          </span>
        </h1>
        <p className="arcade-role">{m.role()}</p>
        <p className="hero-intro">{m.intro()}</p>
        <nav className="game-menu" aria-label={m.open_selection()}>
          {(
            [
              { to: "/projects", label: m.explore() },
              { to: "/about", label: m.about() },
              { to: "/contact", label: m.contact() }
            ] as const
          ).map((item, index) => (
            <Link to={item.to} key={item.to}>
              <span>0{index + 1}</span>
              {item.label}
              <ArrowUpRight size={20} />
            </Link>
          ))}
        </nav>
      </div>
      <Link to="/projects/$slug" params={{ slug: "spellwar" }} className="arcade-scene">
        <div className="scene-top">
          <span>{m.selected_work()} / 01</span>
          <ArrowUpRight size={21} />
        </div>
        <img src="assets/spellwar.png" alt={`${m.project_visual()}: SpellWar`} />
        <div className="scene-caption">
          <span>{m.game_and_engine()}</span>
          <strong>SpellWar</strong>
          <span>
            C++ / OPENGL
            <ChevronRight size={17} />
          </span>
        </div>
        <span className="scene-corner top-left" />
        <span className="scene-corner bottom-right" />
      </Link>
      <div className="hero-foot">
        <span>{m.degree()}</span>
        <span>
          {m.product()} / {m.software()} / {m.infrastructure()}
        </span>
      </div>
    </section>
  )
}

function ProjectVisual({ project }: { project: Project }) {
  if (project.image)
    return (
      <img
        src={project.image}
        alt={`${m.project_visual()}: ${project.title}`}
        loading="lazy"
      />
    )
  return (
    <div className="skull-visual" aria-label="WebApp Skull">
      <span>WEBAPP</span>
      <strong>
        Skull<span>_</span>
      </strong>
      <span className="skull-code">React / TanStack / TypeScript</span>
      <div className="skull-lines">
        <span />
        <span />
        <span />
        <span />
      </div>
    </div>
  )
}
function ProjectCard({ project, index }: { project: Project; index: number }) {
  return (
    <Link
      to="/projects/$slug"
      params={{ slug: project.slug }}
      className={`project-card project-${project.slug}`}
    >
      <div className="project-cover">
        <ProjectVisual project={project} />
        <span className="cover-number">0{index + 1}</span>
        <span className="cover-arrow">
          <ArrowUpRight size={20} />
        </span>
      </div>
      <div className="project-meta">
        <span>{categoryName(project.category)}</span>
        <span>{project.tags.slice(0, 2).join(" / ")}</span>
      </div>
      <h3>{project.title}</h3>
      <p>{project.summary}</p>
    </Link>
  )
}
function HomePage() {
  const { direction } = usePreferences()
  const Hero = {
    signal: SignalHero,
    atlas: AtlasHero,
    arcade: ArcadeHero,
    mix: AtlasHero
  }[direction]
  return (
    <>
      <Hero />
      <section className="selected-section" id="selected">
        <div className="section-heading">
          <div>
            <p className="eyebrow">02 / {m.selected_work()}</p>
            <h2>{m.selection()}</h2>
          </div>
          <Link to="/projects" className="text-action">
            {m.all_projects()}
            <ArrowRight size={17} />
          </Link>
        </div>
        <div className="home-projects">
          {getProjects()
            .slice(0, 3)
            .map((project, index) => (
              <ProjectCard project={project} index={index} key={project.slug} />
            ))}
        </div>
      </section>
      <section className="approach-strip">
        <span className="eyebrow">{m.end_to_end()}</span>
        <p>
          {m.product()}
          <span>/</span>
          {m.software()}
          <span>/</span>
          {m.infrastructure()}
        </p>
        <Link className="text-action" to="/about">
          {m.about()}
          <ArrowUpRight size={17} />
        </Link>
      </section>
    </>
  )
}
function ProjectsPage() {
  usePreferences()
  const [category, setCategory] = useState<"all" | Project["category"]>("all")
  const projects = getProjects().filter(
    (project) => category === "all" || project.category === category
  )
  return (
    <section className="inner-page projects-page">
      <div className="page-heading">
        <p className="eyebrow">01 / {m.project_directory()}</p>
        <h1>
          {m.projects()}
          <span className="name-period">.</span>
        </h1>
        <p>{m.projects_intro()}</p>
      </div>
      <div className="project-filters" aria-label={m.projects()}>
        {(["all", "games", "generative", "engineering"] as const).map((item) => (
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
function ProjectPage() {
  usePreferences()
  const { slug } = projectRoute.useParams()
  const projects = getProjects()
  const project = projects.find((item) => item.slug === slug)
  if (!project) return <NotFound />
  const next = projects[(projects.indexOf(project) + 1) % projects.length]
  return (
    <article className="inner-page project-detail">
      <Link to="/projects" className="text-action back-link">
        <ArrowLeft size={16} />
        {m.back_projects()}
      </Link>
      <div className="page-heading">
        <p className="eyebrow">{categoryName(project.category)}</p>
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
      <Link className="next-project" to="/projects/$slug" params={{ slug: next.slug }}>
        <span>{m.next_project()}</span>
        <strong>{next.title}</strong>
        <ArrowRight size={26} />
      </Link>
    </article>
  )
}
function AboutPage() {
  usePreferences()
  const steps = [
    { title: m.approach_1_title(), body: m.approach_1_body() },
    { title: m.approach_2_title(), body: m.approach_2_body() },
    { title: m.approach_3_title(), body: m.approach_3_body() }
  ]
  return (
    <section className="inner-page about-page">
      <div className="page-heading">
        <p className="eyebrow">02 / {m.about()}</p>
        <h1>{m.about_title()}</h1>
      </div>
      <div className="about-content">
        <div className="profile-portrait">
          <img src={profile.avatar} alt={m.profile_alt()} />
          <span>Mathis Dubuisson</span>
          <p>{m.degree()}</p>
        </div>
        <div className="about-prose">
          <p className="lead">{m.about_intro()}</p>
          <p>{m.about_body()}</p>
          <p>{m.about_outro()}</p>
        </div>
      </div>
      <section className="approach-section">
        <h2>{m.approach()}</h2>
        <div className="approach-steps">
          {steps.map((step, index) => (
            <div key={index}>
              <span>0{index + 1}</span>
              <h3>{step.title}</h3>
              <p>{step.body}</p>
            </div>
          ))}
        </div>
      </section>
    </section>
  )
}
function ContactPage() {
  usePreferences()
  const [copied, setCopied] = useState(false)
  async function copy() {
    try {
      await navigator.clipboard.writeText(profile.github)
      setCopied(true)
      toast.success(m.copied())
    } catch {
      toast.error(m.copy_error())
    }
  }
  return (
    <section className="inner-page contact-page">
      <div className="page-heading">
        <p className="eyebrow">03 / {m.contact()}</p>
        <h1>{m.contact_title()}</h1>
        <p>{m.contact_body()}</p>
      </div>
      <div className="contact-links">
        <a href={profile.linkedin} target="_blank" rel="noreferrer">
          <Linkedin size={25} />
          <span>
            <strong>LinkedIn</strong>
            <span>Mathis Dubuisson</span>
          </span>
          <ArrowUpRight size={24} />
        </a>
        <a href={profile.github} target="_blank" rel="noreferrer">
          <Github size={25} />
          <span>
            <strong>GitHub / Westerbay</strong>
            <span>{m.personal_github()}</span>
          </span>
          <ArrowUpRight size={24} />
        </a>
        <a href={profile.secondGithub} target="_blank" rel="noreferrer">
          <Github size={25} />
          <span>
            <strong>GitHub / mathis-gala</strong>
            <span>{m.second_github()}</span>
          </span>
          <ArrowUpRight size={24} />
        </a>
      </div>
      <button className="text-action copy-button" type="button" onClick={copy}>
        {copied ? <Check size={17} /> : <Copy size={17} />}
        {m.copy_link()}
      </button>
    </section>
  )
}
function NotFound() {
  return (
    <div className="inner-page">
      <h1>{m.not_found()}</h1>
      <Link to="/">{m.return_home()}</Link>
    </div>
  )
}

function PageEffects() {
  const path = useRouterState({ select: (state) => state.location.pathname })
  const { locale, direction } = usePreferences()
  useEffect(() => {
    const project = getProjects().find((item) => path === `/projects/${item.slug}`)
    const title =
      project?.title ||
      ({
        "/": m.home(),
        "/projects": m.projects(),
        "/about": m.about(),
        "/contact": m.contact()
      }[path] ??
        m.not_found())
    document.title = `${title} · Mathis Dubuisson · ${directionNames[direction]}`
  }, [path, locale, direction])
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" })
  }, [path])
  return null
}
function Shell() {
  const { direction } = usePreferences()
  const { resolvedTheme } = useTheme()
  const [mobile, setMobile] = useState(false)
  return (
    <>
      <PageEffects />
      <LabToolbar mobile={mobile} setMobile={setMobile} />
      <div className={`preview-stage ${mobile ? "mobile-preview" : ""}`}>
        <div className="site-frame" data-direction={direction}>
          <a
            className="skip-link"
            href="#main-content"
            onClick={(event) => {
              event.preventDefault()
              document.getElementById("main-content")?.focus()
            }}
          >
            {m.skip()}
          </a>
          <div className="site-container">
            <Header />
            <main id="main-content" tabIndex={-1}>
              <Outlet />
            </main>
            <footer className="site-footer">
              <div>
                <span>Mathis Dubuisson</span>
                <span>{m.footer()}</span>
              </div>
              <div>
                <a href={profile.github} target="_blank" rel="noreferrer">
                  GitHub
                  <ArrowUpRight size={13} />
                </a>
                <a href={profile.linkedin} target="_blank" rel="noreferrer">
                  LinkedIn
                  <ArrowUpRight size={13} />
                </a>
                <Link to="/contact">
                  {m.contact()}
                  <ArrowUpRight size={13} />
                </Link>
              </div>
            </footer>
          </div>
        </div>
      </div>
      <div className="lab-footer">
        <span>{m.prototype_label()}</span>
        <span>{m.project_scope()}</span>
      </div>
      <Toaster
        theme={resolvedTheme === "dark" ? "dark" : "light"}
        position="bottom-right"
        richColors
      />
    </>
  )
}

const rootRoute = createRootRoute({ component: Shell, notFoundComponent: NotFound })
const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomePage
})
const projectsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/projects",
  component: ProjectsPage
})
const projectRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/projects/$slug",
  component: ProjectPage
})
const aboutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/about",
  component: AboutPage
})
const contactRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/contact",
  component: ContactPage
})
const routeTree = rootRoute.addChildren([
  homeRoute,
  projectsRoute,
  projectRoute,
  aboutRoute,
  contactRoute
])
const router = createRouter({
  routeTree,
  history: createHashHistory(),
  defaultPreload: "intent"
})
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router
  }
}

createRoot(document.getElementById("root")!).render(
  <ThemeProvider
    attribute="class"
    defaultTheme="system"
    enableSystem
    storageKey="portfolio-theme"
  >
    <PreferencesProvider>
      <RouterProvider router={router} />
    </PreferencesProvider>
  </ThemeProvider>
)
