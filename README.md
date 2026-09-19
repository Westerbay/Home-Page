# Mathis Dubuisson · portfolio

Portfolio personnel statique : jeux, IA, rendu 3D et explorations génératives.
La direction Atlas × Signal et sa palette orange doux / blanc chaud sont validées.
Les textes restent provisoires avant le questionnaire éditorial final.

## Développer

Node.js 24.15 et pnpm 12.4.1.

```sh
pnpm install --frozen-lockfile
pnpm dev
```

Le site est accessible sur http://127.0.0.1:4174.
La maquette comparative reste indépendante dans `design/prototype`.

```sh
pnpm format
pnpm check
pnpm exec playwright install chromium
pnpm test:e2e
pnpm preview
```

La sortie à publier est `apps/web/dist/client`. Aucun serveur applicatif
n’est nécessaire après la génération.

## Structure

- `apps/web/src/routes` : URLs, chargement et métadonnées.
- `apps/web/src/features` : accueil, projets, présentation et contact.
- `packages/ui` : tokens, polices et primitives communes.
- `packages/i18n` : catalogues et runtime Paraglide FR/EN.
- `packages/config` : identité publique et configuration TypeScript.

Voir [le contexte](docs/CONTEXT.md), [l’architecture](docs/ARCHITECTURE.md)
et [le guide de développement](docs/DEVELOPMENT.md).

## Publication

Le workflow CI vérifie le site à la racine et sous `/Home-Page/`.
Le workflow Pages se lance manuellement et utilise le chemin déclaré par
GitHub Pages, y compris pour un futur domaine personnalisé.
Aucune publication n’a été effectuée pendant la refonte.

Les anciens fichiers HTML à la racine sont conservés comme source historique.
Le nouveau site est construit depuis `apps/web`. Les dossiers `img`, `logo`,
`dev`, `style` et `script` restent copiés dans la sortie pour préserver
les consommateurs existants. Les anciennes pages principales redirigent
vers les nouvelles routes.
