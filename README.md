# Mathis Dubuisson · portfolio

Games, 3D rendering and machine-learning projects, with a little about me.

**[Visit the portfolio](https://portfolio.mathis-db.com/)**

The site is available in French and English, with light and dark themes, project
galleries, playable Eyefox and L-system demos, and an optional AI guide.
React and TanStack Start generate static HTML for GitHub Pages; the portfolio
does not need an application server.

## Run locally

Use Node.js 24 (see [.node-version](.node-version)) and pnpm 12.4.1.

```sh
pnpm install --frozen-lockfile
pnpm dev
```

Open [localhost:4174](http://127.0.0.1:4174/).

```sh
pnpm check
pnpm exec playwright install chromium
pnpm test:e2e
```

`pnpm check` runs formatting checks, the production build, linting, type checking
and unit tests. Browser tests run against the generated site. See the
[development guide](docs/DEVELOPMENT.md) for previews, HTML validation, the
optional guide and publishing.

## Repository

| Path              | Contents                                              |
| ----------------- | ----------------------------------------------------- |
| `web`             | Routes, page features, project data and public assets |
| `packages/ui`     | Shared components, local fonts and theme styles       |
| `packages/i18n`   | French and English messages and Paraglide generation  |
| `packages/config` | Public profile and TypeScript configuration           |
| `scripts`         | Static output, validation and media generation tools  |

The stack uses TypeScript, React, TanStack Start/Router, Tailwind CSS, Paraglide,
Zod, Sonner and Turborepo. The interactive demos come from the upstream
[L-system component](https://github.com/Westerbay/The-Algorithmic-Beauty-of-Plants)
and [Eyefox component](https://github.com/Westerbay/Eyefox-Puzzle/tree/web).

## Contributing

Keep French and English content aligned, preserve keyboard navigation and reduced
motion, and verify both themes when changing the UI. Run the relevant checks before
opening a pull request. Project descriptions should reflect their linked sources;
media credits and original project licences still apply.

- [Development and deployment](docs/DEVELOPMENT.md)
- [Architecture and integration boundaries](docs/ARCHITECTURE.md)
- [Media sources and regeneration](docs/MEDIA.md)
