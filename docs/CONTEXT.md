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

Les textes publics doivent rester sobres et centrés sur les projets. Le
travail en solo est un fait acquis, sans insister sur « tout seul » dans
les descriptions. Ne pas afficher la mention « sans IA » pour SpellWar ni
l’indisponibilité d’Eyefox dans les stores sur le portfolio. Ces faits
restent conservés ci-dessous comme contexte.

SpellWar a été réalisé seul. Mathis a écrit le code de zéro, à la main,
sans assistance IA. Les éléments qu’il souhaite présenter sont le moteur
physique, le rendu PBR et les collisions développés maison, ainsi que la
génération de terrain. Ne pas inventer de méthode de génération précise.

The Algorithmic Beauty of Plants a été réalisé entièrement seul : Mathis
a tout fait. Il le présente comme un travail de recherche et de lecture
d’ABOP, mis en pratique avec des L-systems et un rendu 3D en WebGL. Les
maths et la physique sont évoquées, sans précision permettant d’affirmer
une simulation ou une technique particulière. Les mentions « mat » et
« base 64 » restent ambiguës : ne pas les interpréter ni les ajouter aux
textes publics. La contribution et cet angle de présentation sont confirmés.
Ne pas redemander un défi ou une réalisation phare : Mathis souhaite
présenter ce travail simplement, sans le survaloriser.

Eyefox Puzzle est un jeu mobile Android académique entièrement réalisé
seul. Mathis confirme qu’il n’est plus disponible dans les stores. Sa
contribution et cette indisponibilité sont acquises, sans nouvelle question
à ce sujet. Ne pas en déduire une fin de développement, une date, une raison
de retrait ou l’existence d’un APK disponible. La nouvelle fiche renvoie
vers le dépôt de code, sans lien ni badge de téléchargement dans un store.

Le dépôt Eyefox-Puzzle a été mis à jour et poussé : commit `6a49278` sur
`main` pour le README (projet académique, solo, retrait des stores), et
`76622fd` sur `web` pour remplacer le bouton du store par un lien vers le
code source. Cette publication concerne Eyefox-Puzzle uniquement. Ces
corrections publiées restent en place : les retouches éditoriales demandées
ensuite concernent le portfolio, pas le README ni l’ancienne page d’Eyefox.

Seul le compte GitHub Westerbay est affiché. Skull est conservé dans
`features/projects/data/drafts.ts`, hors du site public et sans URL vers
le second compte.

Le contact sur le portfolio se limite à GitHub et LinkedIn, comme confirmé
par Mathis. Ne pas afficher d’adresse e-mail et ne pas redemander ce choix.
Cette règle ne modifie pas le contact historique dans la politique de
confidentialité d’Eyefox, qui reste conservé.

## À préciser dans la suite du questionnaire

- Les faits encore utiles pour les autres fiches : fonctionnement, choix
  techniques et anecdotes, sans inventer de réalisations.
- Les captures, vidéos et démos disponibles pour ces projets.
- La formulation anglaise des textes.
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
Aucun push ni déploiement de Home-Page n’a été effectué.
