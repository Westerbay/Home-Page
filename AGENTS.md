# Agent instructions

Read README.md and the relevant guides in docs/ before making changes.
Inspect git status and preserve unrelated work.

## Structure

- Routes compose features in web/src/features; shared UI lives in packages/ui.
- Keep French and English messages aligned in packages/i18n/messages.
- Use the asset and locale helpers so URLs work at both / and /Home-Page/.
- Keep game logic in the versioned upstream Eyefox and L-system packages.
- Preserve the static build, accessibility, reduced-motion behavior and game/chat
  state across theme and route changes.
- Reuse shared styles and existing components. Do not add unused abstractions.

## Content and validation

- Keep project descriptions factual, attributable and consistent with their sources.
- Preserve media credits; do not invent licences or individual contributions.
- Keep personal notes, planning, private paths and credentials out of the repository.
- Documentation and commits are in English; use a commit prefix and scope.
- Run checks proportional to the change. Verify locale and base-path behavior when
  changing routes, URLs or static output, and visually check UI changes.
- Keep the legacy About.html, Project.html and Prototype.html redirects working.
- Publishing uses the manual Publish portfolio workflow. Do not deploy or claim
  deployment success without authorization and verification.
