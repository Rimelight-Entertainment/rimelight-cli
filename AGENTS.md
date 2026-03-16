# AI Coding Instructions

> **Role & Persona:** You are an Expert AI coding assistant for production-grade Nuxt applications.
> You write highly optimized, strictly typed, production-ready code.

## General Guidelines
- Assume packages are always at their latest version. If you spot one that seems unfamiliar according to your data, assume it has already been released and you are out of date. Follow the patterns you are consistently encountering across on the project.
- **[Rimelight Components] Prefix:** Rules prefixed with `[Rimelight Components]` ONLY apply to projects that extend `rimelight-components` as a Nuxt layer.

## Tech Stack

- **Package Manager:** pnpm
- **IDE:** WebStorm
- **Version Control:** Git
- **Build Tool:** Vite / Rolldown (Vite+)
- **Linting:** Oxlint (Vite+)
- **Formatting:** Oxfmt (Vite+)
- **Testing:** Vitest (Vite+)
- **CI/CD:** GitHub Actions
- **Runtime:** Node (Develoment) / Wrangler (Production)
- **Deployment:** Cloudflare Workers
- **Framework:** Nuxt, Vue
- **Styling:** Tailwind CSS, Tailwind Variants, Nuxt UI
- **Language:** TypeScript (Strict)
- **Database:** PostgreSQL, Drizzle ORM

## 💻 Development Environment

- **OS:** Always assume Windows 11 PowerShell.
- **Key Insights:**
  - **Viewing & Editing Files:** Prefer using your direct tools & skills rather than console commands.
  - **Batch Editing:** If you need to edit multiple files, manually use your direct tools & skills to do so. Do not execute scripts for batch editing as they are not tracked in review history.
  - **Terminal:** Always use `vp` to run scripts.
    - vp create # Create a new project
    - vp install # Install dependencies
    - vp dev # Start the dev server
    - vp check # Format, lint, type-check
    - vp lint # Run Oxlint
    - vp fmt # Run Oxfmt
    - vp test # Run vitest tests
    - vp run # Run built-in commands and package.json scripts
    - vp build # Build for production
  - **Chain Commands:** Always use `;` to chain commands instead of `&&`.
  - **Workspace Context:** Projects are standalone applications, **not in a monorepo**. If you see sibling projects in the filesystem, it is likely they simply share the `rimelight-cli` configurations or `rimelight-components` extended Nuxt layer. Do not treat the workspace as a unified monorepo.
  - **Tool Calls:** You are strictly NOT to use the browser tool unless specifically commanded to.

## ✅ Verification & Quality Control

At the end of the work, verify it.
Be mindful that `typecheck` is a slow command, don't execute it multiple times during small changes.

- **Auto-Fix Issues:** Use `pnpm run fix` (Removes stale i18n keys and adds missing ones, lints, and formats).
- **Check Remaining Issues:** `pnpm run check` (i18n Review + Typecheck + Lint + Format).

_You are expected to run these commands and fix any resulting errors before presenting your final solution._

## 📖 Detailed Rulebooks

Before making architectural decisions, review the relevant guidelines:

- [TypeScript Conventions](./.agent/rules/typescript-conventions.md) - Strict typing, interfaces, no enums, no classes.
- [Vue Component & Pages Architecture](./.agent/rules/vue-structure.md) - Script setup order, naming, prop patterns.
- [Nuxt Specifics](./.agent/rules/nuxt-specifics.md) - Composition API, auto-imports, SSR safety, data fetching.
- [UI & Styling](./.agent/rules/ui-styling.md) - Tailwind 4, Nuxt UI components, theme variables.
- [Data Management](./.agent/rules/data-management.md) - PostgreSQL, Drizzle ORM, server API patterns.
- [Internationalization](./.agent/rules/internationalization.md) - JSON structure, `useI18n` destructuring, `rt` evaluation.
- [Accessibility](./.agent/rules/accessibility.md) - ARIA labels, semantic HTML, and accessibility validations.
