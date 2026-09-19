# Développement

## Environnement

Node.js 24.15.0, pnpm 12.4.1. Travailler dans le système de fichiers natif
du dépôt : ici WSL. Les dépendances du monorepo utilisent les liens pnpm
classiques. Le prototype historique possède son installation séparée.

```sh
pnpm install --frozen-lockfile
pnpm dev
```

L’aperçu de développement écoute sur 127.0.0.1:4174.
`pnpm dev` compile les traductions avant Vite ; le plugin Paraglide les
actualise pendant le développement.

## Vérification

```sh
pnpm format
pnpm check
pnpm exec playwright install chromium
pnpm test:e2e
```

`check` vérifie le format, construit le site puis exécute ESLint, TypeScript
et les tests d’URLs. Le build précède les contrôles typés pour générer
Paraglide et l’arbre des routes sur un checkout neuf.
Les tests navigateur exercent les fichiers statiques sur le port 4175.

```sh
SITE_BASE_PATH=/Home-Page/ pnpm build
SITE_BASE_PATH=/Home-Page/ pnpm test
SITE_BASE_PATH=/Home-Page/ pnpm test:e2e
SITE_BASE_PATH=/Home-Page/ pnpm preview
```

Revenir à `pnpm build` puis `pnpm preview` pour une sortie à la racine.
La même base doit être utilisée pour le build et l’aperçu.
Les traductions et l’arbre de routes générés ne sont pas versionnés.

## Modifier le contenu

Textes dans les catalogues FR/EN, identité publique dans profile.json,
projets dans leur fonctionnalité. Ajouter toute nouvelle fiche à la liste
de prérendu dans `apps/web/vite.config.ts` et vérifier l’accès direct.
Le questionnaire éditorial final reste à faire avant d’arrêter les textes.

## GitHub Pages

CI teste `/` et `/Home-Page/`. Le workflow Pages est déclenchable manuellement
depuis Actions et publie seulement `apps/web/dist/client`.
Configurer la source GitHub Pages sur GitHub Actions au moment de publier.
Le chemin est lu depuis configure-pages ; un domaine personnalisé utilisera
la racine fournie par GitHub Pages.

Le déploiement réel et les réglages distants n’ont pas été exercés localement.
Les sources historiques et assets restent présents tant que leurs
consommateurs externes ne sont pas retirés.

## Git

Commits en anglais : `feat(web): …`, `fix(i18n): …`,
`refactor(ui): …`, `docs: …`. Synchroniser avec rebase et éviter les
commits de merge. Le commit local et la publication restent des étapes distinctes.
