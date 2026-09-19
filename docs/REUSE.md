# Réutilisation

- `packages/config/src/profile.json` : nom et profils publics, sans second GitHub.
- `packages/ui/src/styles/globals.css` : palette, polices et styles des primitives.
- `packages/ui/src/components/button.tsx` : bouton ou lien composé avec Radix Slot.
- `packages/ui/src/components/sonner.tsx` : notifications adaptées au thème.
- `packages/ui/src/lib/utils.ts` : fusion des classes.
- `packages/i18n/messages/{fr,en}.json` : textes de l’interface.
- `apps/web/src/lib/assets.ts` : chemins publics respectant la base de déploiement.
- `apps/web/src/lib/seo.ts` : titres et descriptions.
- `apps/web/src/lib/i18n/url-rewrite.ts` : compatibilité Paraglide/basepath.
- `features/projects/data/projects.ts` : catalogue validé et localisé.
- `features/projects/components/project-card.tsx` : cartes accueil/liste.

Ne créer une abstraction partagée que pour un besoin réel.
