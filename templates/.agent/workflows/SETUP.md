---
description: Sets up a new project with rimelight-cli configuration
---

# Setup Workflow

This workflow guides new environments and agents through setting up a new project using standard Rimelight constraints.

## Steps

1. **Initialize Project**
   - Run `bun install` to download dependencies natively via bun's locking algorithm.
   - Verify the `bun.lock` file is present and up to date.

2. **Configure Environment**
   - Provide a copied `.env.example` as a `.env` if required by the repository.
   - Fill in necessary development environment variables and database keys.

3. **Verify Git Hooks**
   - Run `bun run prepare` to install the local husk hooks.
   - Verify that the `commitlint` configuration works against standard linting operations.

4. **Sync Utilities**
   - Run `bun run sync` to distribute your updated rulebooks, formats, and configurations directly from `rimelight-cli` into your project repository's root.

5. **Run Initial Checks**
   - Ensure the repository adheres strictly to Rimelight's UI, Accessibility, i18n, and Database standards.
   - Run `bun run fix` to evaluate and format issues instantly.
   - Run `bun run check` to verify TypeScript interfaces, components, and i18n configurations. 
   - Start your development environment locally via `bun run dev`.
