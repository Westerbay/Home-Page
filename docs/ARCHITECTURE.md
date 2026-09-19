# Architecture

## Frontières

`apps/web` compose React et TanStack Start/Router.
Les routes déclarent navigation, chargement et métadonnées ; les fonctionnalités
possèdent leurs composants et données sous `src/features`.
`src/lib` contient les petites intégrations transversales.

`packages/ui` contient les primitives inspirées de shadcn/ui : Button avec
Radix Slot/CVA, notifications Sonner, utilitaire cn et tokens CSS.
Les composants métier restent dans leurs fonctionnalités.

`packages/i18n` possède les catalogues FR/EN et la génération Paraglide.
`packages/config` partage uniquement l’identité publique et TypeScript.
Les projets sont validés par Zod dans leur fonctionnalité ; il n’y a pas de
package contracts vide ni de couche de données distante fictive.

TanStack Query et Form seront ajoutés lorsqu’une vraie requête distante ou un
formulaire en aura besoin. Les filtres utilisent un état React local.

## Rendu et langues

TanStack Start génère 14 pages HTML au build. Seul `dist/client` est publié.
Son rendu serveur sert à la génération et au développement, sans serveur
applicatif à déployer ni fonction distante.

Paraglide utilise les stratégies URL et langue de base. Son middleware isole
la langue pendant le prérendu concurrent. Le français occupe la racine, l’anglais
le préfixe `/en/`. Le changement de langue recharge la page traduite statique.

TanStack retire son basepath avant les réécritures personnalisées.
`src/lib/i18n/url-rewrite.ts` restitue ce préfixe temporairement pour Paraglide,
puis laisse le routeur le remettre dans les liens publics. Les tests couvrent
la racine et `/Home-Page/`.

## Publication et compatibilité

`SITE_BASE_PATH` configure le build et le serveur de prévisualisation.
Le workflow Pages récupère cette valeur depuis configure-pages.
Le domaine futur n’est pas inventé ; les métadonnées actuelles ont des titres
et descriptions localisés, sans canonical ni sitemap fondé sur une fausse URL.

`scripts/prepare-pages.mjs` conserve les assets historiques et ajoute
les redirections des anciennes pages ainsi qu’une vraie page 404.
Le serveur d’aperçu sert uniquement les fichiers générés : aucun fallback
SPA ne masque une page statique manquante.

## Référence de travail

Technologies, frontières frontend et conventions inspirées de
[WebApp-Skull](https://github.com/mathis-gala/WebApp-Skull), consulté au commit
`561d00ad11e1c18be1c82227663d3d3d8b884132`.
Les fonctionnalités d’API, d’authentification et de base de données n’appartiennent
pas à cette première version du portfolio.
