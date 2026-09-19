# Instructions pour les agents

Lire `docs/CONTEXT.md`, puis les documents liés au changement.
Inspecter `git status --short` et préserver les modifications existantes.

Les routes composent les fonctionnalités ; les composants métier restent dans
`apps/web/src/features`. Les primitives communes vont dans `packages/ui`.
Les textes doivent exister en français et en anglais dans `packages/i18n`.
Ne pas créer de couche, service, formulaire ou requête distante sans besoin.

Conserver la direction Atlas × Signal validée. Le ton du portfolio est
personnel et discret, centré sur le plaisir de développer. Ne pas afficher
le second compte GitHub. Le questionnaire de contenu final reste à faire.

Préserver les dossiers historiques `img`, `logo`, `dev`, `style` et `script`
tant que Mathis n’a pas confirmé le retrait de leurs consommateurs.

Exécuter les contrôles proportionnés et mettre à jour la documentation
concernée. Les changements de routage doivent être vérifiés à la racine et
sous `/Home-Page/`, en français et anglais.
Commits en anglais avec préfixe et scope. Préférer rebase aux merges.
