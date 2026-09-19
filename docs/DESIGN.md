# Direction graphique

Atlas × Signal a été validé par Mathis. Le nom utilise une composition
éditoriale avec Georgia et le nom de famille en italique.
Les projets utilisent la grille et les lignes fines de Signal.

La palette est centralisée dans `packages/ui/src/styles/globals.css` :

- Clair : fond `#fffefc`, surface `#f8f7f4`, orange `#e99245`.
- Sombre : fond `#1b1b1b`, surface `#252525`, orange `#eaa566`.
- Boutons orange avec texte anthracite pour conserver un contraste lisible.
- Geist et Space Grotesk sont servis localement.

## Composition et grands écrans

La largeur utile est fluide : 90 % de la fenêtre sur ordinateur, avec un
plafond de 2600 px. Le conteneur plafonné ne reçoit plus de padding en
pourcentage du parent, qui réduisait sa zone de contenu à mesure que la
fenêtre s’élargissait. Les espacements mobiles restent adaptés aux petits
écrans.

La typographie et les visuels accompagnent cette largeur jusqu’à 3840 px.
Les paragraphes gardent une largeur de lecture limitée et le visuel du
hero reste proportionné à la composition. Cette itération conserve la
direction Atlas × Signal et la palette validées.

## Grille de la page Projets

La page Projets utilise une grille compacte de trois colonnes au-dessus de
1100 px, deux colonnes sur tablette et une seule sur mobile. Les images
adoptent un ratio de 2:1 et leur hauteur est plafonnée à 360 px, pour
laisser davantage de place aux titres et descriptions.

## Plante et textes

La plante en SVG est générée localement, sans image distante ni backend.
Le bouton « Une autre plante » affiche une nouvelle variante issue d’une
génération déterministe.

Les textes français et anglais emploient un ton personnel et direct :
coder pour le plaisir, concevoir des jeux, s’intéresser à l’IA et au rendu
3D. Ils évitent l’argumentaire commercial. Le questionnaire éditorial
reste prévu en fin de travail ; ces formulations restent provisoires.

Les compositions alternatives et les outils de comparaison sont réservés
à `design/prototype`. Le site public utilise une direction unique.

Navigation clavier, lien d’évitement, focus visible, textes alternatifs,
thème système et réduction des animations sont conservés.
Les micro-détails graphiques attendent la revue finale demandée par Mathis.

La photo de profil conserve ses couleurs originales, sans filtre ni désaturation.

Le thème suit le navigateur tant qu’aucun choix manuel n’est enregistré.
Le bouton affiche une lune ou un soleil pour basculer vers l’autre thème ;
il alterne uniquement entre clair et sombre et mémorise le choix.
Le bouton de langue conserve les libellés FR / EN dans cet ordre, sans
drapeaux, avec la langue active mise en évidence.

Les titres et accroches courtes n’ont pas de point final. L’accroche de
la page À propos est limitée à « Product & Software Engineer ».
Les mentions secondaires du diplôme utilisent le logo ENSICAEN historique,
copié dans les assets du frontend. Il garde ses couleurs originales et un
fond blanc pour rester lisible en thème sombre.
