---
description: Nuxt Architecture Specifics
always_on: true
---

# Nuxt Architecture Specifics

- **Nuxt Configuration Patterns:**
  - **Modules Registration Order:** Module loading order strictly matters to avoid conflicts. The standard inclusion pattern is: 1. Dev Modules (`@nuxt/hints`), 2. Core Integrations (`@nuxtjs/i18n`, `@nuxt/image`, `@nuxt/content`), 3. Styling prerequisites (`@nuxt/fonts`, `@nuxt/icon`), and 4. UI Frameworks (`@nuxt/ui`).
  - **Pages & Components Setup:** To keep the project-specific component locality logic working as expected (placing specific components inside their page directories without them acting as routes or missing prefixes), the configuration MUST declare:
    ```ts
    components: [
      { path: "~/components", pathPrefix: false, prefix: "ProjectPrefix" },
      { path: "~/pages", pattern: "**/components/**", pathPrefix: false, prefix: "ProjectPrefix" },
    ],
    pages: {
      pattern: ["**/*.vue", "!**/components/**"],
    },
    ```

- **Data Fetching:**
  - **[Rimelight Components]** When fetching data, components MUST use `useApi` or `$api` instead of the built-in `useFetch` or `$fetch`.
  - The API matches the Nuxt implementation 1-to-1 (`useFetch` and `$fetch`), but acts as a wrapper to redirect to an HTTP request if executed in a non-server environment like Tauri. Example:
    ```ts
    const { data: user } = await useApi("/api/users/profile")
    ```

  _This ensures consistent API interceptor execution across different runtime environments._


- **Internationalization (i18n):**
  - All static user-facing text MUST go through `@nuxtjs/i18n` dictionaries.
  - When linking to pages, always use the `localePath()` helper to ensure language prefixes are correctly resolved.
    ```vue
    <NuxtLink :to="localePath('/blog')">Read Blog</NuxtLink>
    ```


- **SSR Safety:**
  - Code that directly accesses browser APIs (`window`, `document`, `localStorage`) MUST be deferred to the client by wrapping it in `onMounted()` or executing inside `<ClientOnly>` components.


- **Route Protection & Middleware:**
  - Custom page metadata or route middleware MUST be defined using `definePageMeta()`. Example inside `/* region Meta */`:
    ```ts
    /* region Meta */
    definePageMeta({
      middleware: ["auth"],
      layout: "default"
    })
    /* endregion */
    ```
