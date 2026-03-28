---
description: Astro Architecture Specifics & i18n
always_on: true
---

# Astro Architecture Specifics

- **Astro Configuration Patterns:**
  - **Integrations Order:** Order matters. Typically: 1. Tailwind (`@tailwindcss/vite`), 2. Content features (`@astrojs/mdx`, `@astrojs/sitemap`), 3. Deployment adapters (`@astrojs/cloudflare`).
  - **Output mode:** Always explicitly define `output` (e.g., `'server'` or `'hybrid'`).
  - **Prerendering:** Prefer `export const prerender = true` for static pages when using SSR mode.

- **Data Fetching:**
  - **Top-level await:** Use top-level await in the frontmatter (`---`) for server-side data fetching.
  - **API Interaction:** Wrap API calls in try-catch blocks and handle errors gracefully within the template.
    ```ts
    ---
    /* region Logic */
    let data;
    try {
      const response = await fetch('https://api.example.com/data');
      data = await response.json();
    } catch (e) {
      console.error(e);
    }
    /* endregion */
    ---
    ```

- **Internationalization (i18n):**
  - **Locale Files:** All locale files MUST be placed in the `locales/` directory in JSON format (named `{language_code}.json`).
  - Same rules as Nuxt apply: **No Arrays**, use objects with numeric string keys. Standard nesting structure: `app.`, `pages.`, `meta.`, `sections.`.
  - **Usage in Components:** Use standard helper functions like `t()` and `rt()` defined in `@/utils/i18n` to retrieve translations.
    ```ts
    ---
    import { t, rt } from '@/utils/i18n';
    ---
    <h1>{t('pages.home.meta.title')}</h1>
    ```
  - **Routing with i18n:** Use `@astrojs/i18n` built-in routing helpers when enabled, otherwise manually manage language prefixes in links.

- **Client-side Interactivity:**
  - **Islands Architecture:** Only use `client:*` directives when necessary.
  - **Hydration:** Be mindful of where hydration starts. Prefer `client:visible` for components below the fold.

- **Routing & Middleware:**
  - **Middleware:** Use `src/middleware.ts` for concerns like authentication or logging.
  - **Page Metadata:** Define SEO metadata in the frontmatter of pages, often passed to a `<Layout>` component.

- **SSR Safety:**
  - Frontmatter code runs on the server (or at build time). Do NOT access `window` or `document` in the frontmatter.
  - Use `<script>` tags for client-side logic that needs browser APIs.
