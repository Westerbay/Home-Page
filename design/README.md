# Prototype du portfolio

Direction graphique validée par Mathis le 19 septembre 2026 : **Atlas × Signal**, avec son orange doux et son fond actuel. Les micro-ajustements sont reportés à plus tard.

Quatre directions restent disponibles dans le navigateur :

- **Atlas × Signal · validée** : identité éditoriale et botanique, blanc légèrement chaud, orange doux et grille Signal.
- **Signal** : grille technique, relief filaire, accent citron.
- **Atlas** : carnet d’exploration, papier et illustration générative.
- **Arcade** : menu de jeu et visuel de projet au premier plan.

Le sélecteur supérieur change de direction sur toutes les pages. Le bouton
mobile limite la largeur du site à 390 px. La navigation, les projets, les
filtres, FR/EN, le thème système/clair/sombre et la copie du profil fonctionnent.

## Démarrage

Node.js 24 et pnpm 12.4.1, selon WebApp-Skull.

```sh
cd design/prototype
pnpm install --frozen-lockfile
pnpm dev
```

Ouvrir http://127.0.0.1:4173. Les liens `?direction=signal`, `?direction=atlas`
et `?direction=arcade` ouvrent directement chaque proposition.

```sh
pnpm build
pnpm typecheck
pnpm format:check
pnpm preview
```

Sur Windows, si le dépôt est accessible via un chemin UNC WSL, exécuter les
commandes depuis le lecteur temporaire créé par `pushd` dans cmd, ou utiliser
un runtime Node natif à WSL. Vite ne résout pas correctement tous ses imports
sur un chemin UNC avec Node Windows.

## Portée

Prototype local, non publié, indépendant des anciennes pages. Les fichiers
historiques `img`, `logo`, `dev`, `style` et `script` ne sont pas modifiés :
des pages de projets peuvent encore les utiliser.

Le prototype utilise React, TypeScript, Vite, TanStack Router, Tailwind,
Paraglide, Zod, next-themes, Lucide et Sonner. Les illustrations filaires et
botaniques sont des compositions SVG originales. Les captures de projets sont
copiées depuis le portfolio, et la photo depuis le profil GitHub Westerbay.
Les polices sont servies localement. Aucun appel à l’ancien compteur de visites.

L’organisation définitive `apps/web` et `packages/*` sera mise en place lors de la refonte. Le prototype utilise temporairement un historique hash
pour fonctionner sur un simple serveur statique, y compris au rechargement des
pages internes. Ce choix ne fixe pas les URL de production.

La sélection et les textes de projets sont provisoires ; ils s’appuient sur
les README publics, sans dates, métriques ou expériences professionnelles
inventées. Les pages À propos et Contact seront précisées avec Mathis.

## Vérification effectuée

- Build Vite et TypeScript strict : réussis.
- 29 états contrôlés dans Chromium : trois directions, clair/sombre,
  aperçu mobile, largeurs réelles 390 et 320 px, routes, rechargement,
  FR/EN, filtre des jeux, copie de lien et notification Sonner.
- Aucune erreur JavaScript, image cassée ou page avec débordement horizontal
  détectée dans ces contrôles.
- Captures desktop et mobile relues visuellement.

Voir [BRIEF.md](BRIEF.md) pour les décisions produit et la cible technique.

## Particularité du partage WSL sur Windows

Le prototype utilise `nodeLinker: hoisted` pour éviter les liens symboliques
sur ce partage. Si pnpm ne trouve pas de cache accessible, passer `--store-dir`
avec un dossier Windows local lors de l’installation.


## Direction retenue : Atlas × Signal

Ouvrir `http://127.0.0.1:4173/?direction=mix#/`, ou choisir le quatrième bouton.
Ce mélange reprend Atlas pour le premier écran et les titres principaux,
et Signal pour les cartes de projets. La palette associe un accent orange à des fonds gris/blanc, et anthracite en sombre. La variante a été contrôlée
en français et en anglais, en clair/sombre et à 1440, 768, 390 et 320 px.
Le build et TypeScript passent. Aucune erreur JavaScript, image cassée ou
page avec débordement horizontal détectée dans ces contrôles.
