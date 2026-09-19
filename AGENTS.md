# Agent instructions

Read `docs/CONTEXT.md`, then the documents relevant to the change.
Inspect `git status --short` and preserve existing work.

Routes compose features; feature components belong in `apps/web/src/features`.
Shared UI primitives belong in `packages/ui`. Maintain both French and English
messages in `packages/i18n`. Do not add services, forms, remote requests or
abstractions without an actual need.

Keep the approved Atlas × Signal design. The portfolio is personal and
understated, about enjoying development and showing projects. Do not display
or link the secondary GitHub account. Follow the confirmed content rules in
`docs/PRODUCT.md`; further content refinements do not block V1.

Removal of the old implementation and comparison prototype is authorized.
Do not reintroduce legacy root HTML, shared asset folders or prototype code.
Keep current assets in `apps/web/public/assets` and preserve the generated
redirects for `About.html`, `Project.html` and `Prototype.html`.

Run checks proportional to the change and update the relevant documentation.
Verify routing changes at both `/` and `/Home-Page/`, in French and English.
Documentation and commit messages are in English. Use a commit prefix and
scope, and prefer rebasing to merge commits.

Publishing uses the manual `workflow_dispatch` GitHub Pages workflow.
Do not claim a deployment succeeded until its workflow and public URL have
been checked.
