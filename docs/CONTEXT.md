# Contexte

## État actuel

Le portfolio frontend reprend la direction **Atlas × Signal**, validée le
19 septembre 2026 : orange doux `#e99245`, blanc légèrement chaud `#fffefc`,
gris anthracite en thème sombre. Les micro-détails graphiques sont reportés.

L’accueil, la liste filtrable des projets, trois fiches, À propos et Contact
sont implémentés. Les versions française et anglaise sont générées en HTML
statique. Les routes se chargent directement sur GitHub Pages.

L’itération sur les grands écrans conserve la direction et la palette.
La largeur utile occupe 90 % de la fenêtre sur ordinateur, jusqu’à
2600 px, sans padding en pourcentage sur une boîte plafonnée. Typographie
et visuels s’adaptent aux fenêtres jusqu’à 3840 px. La plante SVG devient
interactive : « Une autre plante » produit une variante déterministe,
entièrement dans le navigateur et sans backend.

Le thème suit le navigateur tant qu’aucun choix manuel n’est enregistré.
Le bouton affiche une lune ou un soleil pour basculer vers l’autre thème ;
il alterne uniquement entre clair et sombre et mémorise le choix.
Le bouton de langue conserve les libellés FR / EN dans cet ordre, sans
drapeaux, avec la langue active mise en évidence.

## Réponses éditoriales confirmées

Le questionnaire est en cours. Le ton reste personnel et discret, sans
argumentaire commercial ni CV. Les textes et titres ne doivent pas contenir
de tirets cadratins.

Mathis est ingénieur diplômé de l’ENSICAEN et **Product & Software Engineer**.
Aucun nom d’entreprise n’est affiché pour le moment. Son métier couvre déjà
la relation client, le produit, le logiciel, l’infrastructure, les pipelines
et le déploiement. Ces informations sont acquises, sans nouvelle question
sur son emploi.

Il développe pour le plaisir. Les maths, la physique et les résultats
visuels le motivent ; il aime apprendre différentes méthodes et construire
une architecture propre. Son intérêt pour l’IA porte à la fois sur les
modèles et leur architecture, et sur les logiciels qui utilisent ces modèles.
Un jeu et son histoire pourraient lui donner envie de créer plus tard :
c’est une possibilité, pas un projet lancé.

Les trois projets affichés, SpellWar, The Algorithmic Beauty of Plants et
Eyefox Puzzle, sont **académiques**. Mathis souhaite les conserver. Des
projets personnels seront ajoutés ensuite ; la sélection actuelle n’est
plus à redemander.

SpellWar a été réalisé seul. Mathis a écrit le code de zéro, à la main,
sans assistance IA. Les éléments qu’il souhaite présenter sont le moteur
physique, le rendu PBR et les collisions développés maison, ainsi que la
génération de terrain. Ne pas inventer de méthode de génération précise.
Seul le compte GitHub Westerbay est affiché. Skull est conservé dans
`features/projects/data/drafts.ts`, hors du site public et sans URL vers
le second compte.

## À préciser dans la suite du questionnaire

- Les contributions individuelles de Mathis pour les plantes et Eyefox Puzzle.
- Les faits à raconter pour chaque fiche : fonctionnement, difficultés,
  choix techniques et anecdotes, sans inventer de réalisations.
- Les captures, vidéos et démos disponibles pour ces projets.
- Le contact souhaité et la formulation anglaise des textes.
- Le domaine définitif, puis les URL canoniques et le sitemap.

## Documentation

- [PRODUCT.md](PRODUCT.md) : portée et règles de contenu.
- [ARCHITECTURE.md](ARCHITECTURE.md) : structure et flux.
- [DESIGN.md](DESIGN.md) : direction validée.
- [REUSE.md](REUSE.md) : éléments communs.
- [DEVELOPMENT.md](DEVELOPMENT.md) : commandes et publication.

Les assets historiques restent utilisés par des branches `web` d’autres
projets. Leur retrait attend la confirmation de Mathis.
La première version est enregistrée dans le commit `d09967f`.
Aucun push ni déploiement n’a été effectué.
