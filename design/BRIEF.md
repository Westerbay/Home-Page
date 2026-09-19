# Brief validé par les réponses de Mathis

## Identité et positionnement

Mathis Dubuisson, ingénieur diplômé de l’ENSICAEN. Activité actuelle :
Product & Software Engineering. Prise en charge autonome du produit de bout
en bout : client, logiciel, infrastructure et pipelines.

Le portfolio montre qui il est et ce qu’il a construit. Il peut servir aux
recruteurs, aux clients ou aux développeurs sans se transformer en CV ou en
page de vente. Ton direct, personnel et discret. Aucun CV à télécharger.
Photo de profil GitHub, pas de logo de marque inventé.

## Interface

- Inspiration des sites de jeux, avec simplicité et lisibilité.
- Plusieurs propositions concrètes avant de choisir une direction.
- Éviter les dégradés omniprésents et les compositions de landing pages génériques.
- Plusieurs pages ; l’accueil remplace à terme `index.html`.
- Thème du navigateur par défaut avec choix explicite clair/sombre/système.
- Français et anglais ; ne pas disperser les traductions dans les composants.
- Navigation clavier, liens d’évitement et respect de la réduction des animations.
- Questions détaillées sur chaque page à poser au moment de son travail final.

## Prototype présenté

Quatre directions : Signal, Atlas, Arcade et Atlas × Signal. Chacune permet de visiter l’accueil,
le répertoire des projets, quatre fiches de projets, À propos et Contact.
Les mêmes informations sont utilisées afin de comparer la patte graphique.

Sélection temporaire : SpellWar, The Algorithmic Beauty of Plants, Eyefox Puzzle
et WebApp Skull. Le contenu doit pouvoir être remplacé facilement.
Les représentations du relief et de la plante sont décoratives ; ce ne sont
pas des captures d’une fonctionnalité ou des résultats mesurés.

## Cible technique après validation graphique

Référence : https://github.com/mathis-gala/WebApp-Skull

Reprendre ses technologies frontend et conventions : TypeScript, React,
TanStack Start/Router/Query/Form, Tailwind, primitives shadcn/ui, Zod,
Paraglide, Sonner, Lucide et next-themes. Les briques Query/Form seront
utilisées lorsqu’une fonctionnalité en a besoin, sans inventer d’API ou de
formulaire pour la vitrine. Pas d’authentification, de NestJS ou de base de
données pour cette première version du portfolio.

Organisation cible :

```text
apps/web/src/routes           composition, métadonnées, navigation
apps/web/src/features         pages et composants propres aux fonctionnalités
apps/web/src/lib              configuration transversale du frontend
packages/ui                   primitives et tokens partagés
packages/i18n                 catalogues FR/EN, génération Paraglide
packages/config               identité publique
packages/contracts            schémas de contenu lorsque partagés
```

Conventions à conserver : séparation des responsabilités, validation aux
frontières, constantes auprès de leur propriétaire, absence d’abstractions
sans besoin concret, documentation à jour et contrôles proportionnés.
Commits en anglais avec préfixes `feat`, `fix`, `refactor`, `docs`, `chore`
et scope pertinent. Pas de commit de merge ; pas de réécriture de branche
publiée sans autorisation. Aucun commit n’a été créé pour la maquette.

## Publication future

GitHub Pages, puis ajout d’un nom de domaine par Mathis. Prévoir une sortie
statique et le chemin de base `/Home-Page/`, puis tester également la racine
d’un domaine personnalisé. TanStack Start documente le prérendu statique :
https://tanstack.com/start/latest/docs/framework/react/guide/static-prerendering

La stratégie exacte des routes FR/EN, du prérendu, des métadonnées et de la CI
sera appliquée lors de la refonte. Le prototype reste `noindex` et non déployé.

Des branches `web` d’autres projets consomment les assets historiques du site.
Mathis prévoit de supprimer ces branches lui-même. Préserver les anciens
chemins jusqu’à confirmation que leurs consommateurs ont été retirés.

## Sources de contenu

- https://github.com/Westerbay/SpellWar
- https://github.com/Westerbay/The-Algorithmic-Beauty-of-Plants
- https://github.com/Westerbay/Eyefox-Puzzle
- https://github.com/mathis-gala/WebApp-Skull
- Réponses de Mathis dans cette conversation pour le diplôme et le poste actuel.

## Direction graphique validée · 19 septembre 2026

Mathis valide **Atlas × Signal** dans sa version actuelle, accessible avec
`?direction=mix&palette=orange`. Cette maquette est la référence graphique
pour la refonte. Les micro-ajustements visuels seront traités plus tard.

- Atlas : typographie éditoriale, nom en italique et illustration botanique.
- Signal : lignes fines, grille de projets alignée, titres et descriptions
  de projets sans empattements.
- Orange doux : `#e99245` en clair et `#eaa566` en sombre, avec du texte
  anthracite sur les boutons.
- Fond clair blanc légèrement chaud `#fffefc`, surfaces secondaires
  `#f8f7f4` ; fond sombre anthracite `#1b1b1b`.
- L’impression de fond bleuté a été discutée ; Mathis conserve le fond actuel
  et reporte les éventuels ajustements de perception.
- Les trois pistes originales restent accessibles comme références.

Cette validation porte sur la direction graphique. Les contenus et besoins
détaillés de chaque page seront précisés avec Mathis au moment de leur
réalisation, conformément au brief.

## Mise en œuvre et ton éditorial

La refonte est maintenant dans `apps/web`, avec ses packages partagés.
La documentation courante se trouve dans [docs/CONTEXT.md](../docs/CONTEXT.md).

Mathis souhaite parler du plaisir de développer, de ses jeux, de l’IA et
du rendu 3D, sans argumentaire commercial. Les textes restent provisoires
jusqu’au questionnaire éditorial final. Seul le profil GitHub Westerbay
est affiché ; Skull reste préparé en brouillon, sans lien vers le second compte.
