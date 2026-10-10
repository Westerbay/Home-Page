import { z } from "zod"
import * as m from "@workspace/i18n/messages"

const projectSchema = z.object({
  slug: z.string(),
  title: z.string(),
  origin: z.enum(["academic", "personal"]),
  category: z.enum(["games", "generative", "engineering"]),
  image: z.string().nullable(),
  repository: z.url(),
  demo: z.url().optional(),
  tags: z.array(z.string()),
  summary: z.string(),
  detail: z.string(),
  focus: z.string(),
  focusTitle: z.string().optional(),
})
export type Project = z.infer<typeof projectSchema>

export function getProjects(): Project[] {
  return z.array(projectSchema).parse([
    {
      slug: "booster-break",
      origin: "personal",
      title: "Booster Break",
      category: "games",
      image: "assets/booster-break.jpg",
      repository: "https://github.com/Westerbay/Booster-Break",
      demo: "https://booster.mathis-db.com/",
      tags: ["TypeScript", "React", "WebGL", "Bun", "Elysia", "PostgreSQL"],
      summary: m.booster_summary(),
      detail: m.booster_detail(),
      focus: m.booster_focus(),
      focusTitle: m.booster_focus_title(),
    },
    {
      slug: "spellwar",
      origin: "academic",
      title: "SpellWar",
      category: "games",
      image: "assets/spellwar-gameplay.png",
      repository: "https://github.com/Westerbay/SpellWar",
      tags: ["C++", "OpenGL", "GLSL", "PBR"],
      summary: m.spellwar_summary(),
      detail: m.spellwar_detail(),
      focus: m.spellwar_focus(),
    },
    {
      slug: "plants",
      origin: "academic",
      title: "The Algorithmic Beauty of Plants",
      category: "generative",
      image: "assets/plants-render.png",
      repository:
        "https://github.com/Westerbay/The-Algorithmic-Beauty-of-Plants",
      tags: ["WebGL", "L-systems"],
      summary: m.plants_summary(),
      detail: m.plants_detail(),
      focus: m.plants_focus(),
    },
    {
      slug: "eyefox",
      origin: "academic",
      title: "Eyefox Puzzle",
      category: "games",
      image: "assets/eyefox.png",
      repository: "https://github.com/Westerbay/Eyefox-Puzzle",
      tags: ["Java", "Android"],
      summary: m.eyefox_summary(),
      detail: m.eyefox_detail(),
      focus: m.eyefox_focus(),
    },
  ])
}

export const categoryName = (category: Project["category"]) =>
  ({
    games: m.games(),
    generative: m.generative(),
    engineering: m.engineering(),
  })[category]

export const projectOriginName = (origin: Project["origin"]) =>
  ({
    academic: m.academic_project(),
    personal: m.personal_project(),
  })[origin]
