/**
 * TanStack removes its basepath before input rewriting and restores it after
 * output rewriting. Paraglide expects the complete public pathname.
 */
export function rewriteWithBase(
  url: URL,
  base: string,
  rewrite: (url: URL) => URL
): URL {
  const prefix = base.replace(/\/$/, "")
  const publicUrl = new URL(url)
  publicUrl.pathname = prefix + publicUrl.pathname
  const result = rewrite(publicUrl)
  result.pathname = result.pathname.slice(prefix.length) || "/"
  return result
}
