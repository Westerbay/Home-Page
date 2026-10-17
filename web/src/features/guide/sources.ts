export function safeMarkdownUrl(value: string) {
  try {
    const url = new URL(value)
    if (url.protocol === "https:" && !url.username && !url.password)
      return url.href
  } catch {
    return ""
  }
  return ""
}
