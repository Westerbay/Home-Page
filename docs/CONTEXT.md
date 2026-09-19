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

Le ton demandé est personnel : développer pour le fun, concevoir des jeux,
s’intéresser à l’IA et à la 3D. Les textes français et anglais ont été
simplifiés dans ce sens. Le diplôme ENSICAEN et le poste Product & Software
Engineering sont du contexte, sans argumentaire commercial ni CV.
Le questionnaire éditorial commence par l’accueil et la page À propos. Les textes et titres ne doivent pas contenir de tirets cadratins.

Seul le compte GitHub Westerbay est affiché. Skull est conservé dans
`features/projects/data/drafts.ts`, hors du site public et sans URL vers
le second compte. Les autres projets sont encore une sélection provisoire.

## À préciser lors du questionnaire final

- Les expériences et intérêts à raconter, avec les mots de Mathis.
- Les projets à afficher, leur ordre et leur état réel.
- Les captures, vidéos, démos et anecdotes de chaque fiche.
- La place du parcours professionnel sur À propos.
- Le contact souhaité et la formulation anglaise.
- Le domaine définitif, puis les URL canoniques et le sitemap.

## Documentation

- [PRODUCT.md](PRODUCT.md) : portée et règles de contenu.
- [ARCHITECTURE.md](ARCHITECTURE.md) : structure et flux.
- [DESIGN.md](DESIGN.md) : direction validée.
- [REUSE.md](REUSE.md) : éléments communs.
- [DEVELOPMENT.md](DEVELOPMENT.md) : commandes et publication.

Les assets historiques restent utilisés par des branches `web` d’autres
projets. Leur retrait attend la confirmation de Mathis.
La première version est prête à être versionnée. Aucun push ni déploiement n’a été effectué.

Le thème suit le navigateur tant qu’aucun choix manuel n’est enregistré.
Le bouton affiche une lune ou un soleil pour basculer vers l’autre thème ;
il alterne uniquement entre clair et sombre et mémorise le choix.
Le bouton de langue conserve les libellés FR / EN dans cet ordre, sans
drapeaux, avec la langue active mise en évidence.
