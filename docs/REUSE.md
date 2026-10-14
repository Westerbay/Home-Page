# Shared components and helpers

- `packages/config/src/profile.json`: name and public profiles.
- `packages/ui/src/styles/globals.css`: palette, fonts and primitive styles.
- `packages/ui/src/components/button.tsx`: button or composed link with Radix Slot.
- `packages/ui/src/components/sonner.tsx`: theme-aware notifications.
- `packages/ui/src/lib/utils.ts`: class-name merging.
- `packages/i18n/messages/{fr,en}.json`: translated interface text.
- `web/src/lib/assets.ts`: public paths that respect the deployment base.
- `web/src/lib/seo.ts`: page titles and descriptions.
- `web/src/lib/i18n/url-rewrite.ts`: Paraglide and router base-path integration.
- `web/src/components/school-mention.tsx`: degree and ENSICAEN logo.
- `web/src/features/projects/data/projects.ts`: validated, localized catalogue.
- `web/src/features/projects/components/project-card.tsx`: cards for Home and Projects.
- `web/src/features/eyefox/components/eyefox-scene.tsx`: client-only Eyefox package integration and static preview.

- `web/src/features/projects/components/generative-gallery.tsx`: static Cheap DiT gallery and model comparisons, scoped to its detail page.

Keep maintained image files in `web/public/assets`. Reuse current helpers
and components rather than restoring code from the former site or prototype.
Create a new shared abstraction only for an actual repeated need.
