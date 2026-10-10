import profile from "@workspace/config/profile" with { type: "json" }

export function pageMeta(title: string, description: string) {
  return [
    { title: title + " · " + profile.name },
    { name: "description", content: description },
    { property: "og:title", content: title + " · " + profile.name },
    { property: "og:description", content: description },
    { property: "og:type", content: "website" },
  ]
}
