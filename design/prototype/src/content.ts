import { z } from "zod"
import * as m from "./paraglide/messages.js"

export const directionSchema = z.enum(["signal", "atlas", "arcade", "mix"])
export type Direction = z.infer<typeof directionSchema>
export const directionNames: Record<Direction, string> = {
  signal: "Signal",
  atlas: "Atlas",
  arcade: "Arcade",
  mix: "Atlas × Signal"
}
export const profile = {
  name: "Mathis Dubuisson",
  github: "https://github.com/Westerbay",
  secondGithub: "https://github.com/mathis-gala",
  linkedin: "https://www.linkedin.com/in/mathis-dubuisson",
  avatar: "assets/avatar.png"
} as const

const projectSchema = z.object({
  slug: z.string(),
  title: z.string(),
  category: z.enum(["games", "generative", "engineering"]),
  image: z.string().nullable(),
  repository: z.url(),
  tags: z.array(z.string()),
  summary: z.string(),
  detail: z.string(),
  focus: z.string()
})
export type Project = z.infer<typeof projectSchema>

export function getProjects(): Project[] {
  return z.array(projectSchema).parse([
    {
      slug: "spellwar",
      title: "SpellWar",
      category: "games",
      image: "assets/spellwar.png",
      repository: "https://github.com/Westerbay/SpellWar",
      tags: ["C++", "OpenGL", "GLSL"],
      summary: m.spellwar_summary(),
      detail: m.spellwar_detail(),
      focus: m.spellwar_focus()
    },
    {
      slug: "plants",
      title: "The Algorithmic Beauty of Plants",
      category: "generative",
      image: "assets/plants.png",
      repository: "https://github.com/Westerbay/The-Algorithmic-Beauty-of-Plants",
      tags: ["L-systems", "Generative"],
      summary: m.plants_summary(),
      detail: m.plants_detail(),
      focus: m.plants_focus()
    },
    {
      slug: "eyefox",
      title: "Eyefox Puzzle",
      category: "games",
      image: "assets/eyefox.png",
      repository: "https://github.com/Westerbay/Eyefox-Puzzle",
      tags: ["Java", "Android"],
      summary: m.eyefox_summary(),
      detail: m.eyefox_detail(),
      focus: m.eyefox_focus()
    },
    {
      slug: "skull",
      title: "WebApp Skull",
      category: "engineering",
      image: null,
      repository: "https://github.com/mathis-gala/WebApp-Skull",
      tags: ["TypeScript", "React", "TanStack"],
      summary: m.skull_summary(),
      detail: m.skull_detail(),
      focus: m.skull_focus()
    }
  ])
}

export const categoryName = (category: Project["category"]) =>
  ({
    games: m.games(),
    generative: m.generative(),
    engineering: m.engineering()
  })[category]
