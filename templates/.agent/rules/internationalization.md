---
description: Internationalization (i18n) Patterns
always_on: true
---

# Internationalization (i18n) Patterns

- **Locale Files:**
  - All locale files MUST be placed in the `locales/` directory and in JSON format. It is NOT under `i18n/locales`.
  - Locale files MUST be named in the format `{language_code}.json`.
  - **No Arrays:** The JSON files MUST NEVER contain actual JSON arrays (`[]`), they only support objects (`{}`). If a sequence of items is needed, use an object with numeric string keys (e.g., `"0": { ... }`). Translation paths can still resolve them via `items[0].title` or `items.0.title`.

- **Locale Keys Structure:**
  - All localized strings MUST follow a strict, semantic nesting structure within the JSON dictionaries (e.g., `locales/en.json`). Use dot notation for logical grouping.
  - **App Scope:** Text for global layouts and components MUST be nested under `app.`:
    - `app.header.links`
    - `app.footer.links`
  - **Pages Scope:** Text specific to pages MUST be nested under `pages.[page_name]`. Pages must separate their `meta` and `sections`:
    - `pages.[page].meta.title` and `pages.[page].meta.description`
    - `pages.[page].sections.[section_name].title`
    - `pages.[page].sections.[section_name].description`
    - Action buttons or nested object collections go further down (e.g., `pages.home.sections.hero.actions.talk`).

- **Usage in Components (`useI18n`):**
  - Always extract `t` (translation), `rt` (resolve translation – especially useful for dynamic fields in loops), and `locale` via destructuring the `useI18n()` composable inside the `<script setup>` block.
  - Use `useLocalePath()` to resolve routes appropriately with language prefixes.
    ```ts
    /* region State */
    const { t, rt, locale } = useI18n()
    const localePath = useLocalePath()
    /* endregion */
    
    /* region Meta */
    useSeoMeta({
      title: t("pages.home.meta.title"),
      description: t("pages.home.meta.description"),
    })
    /* endregion */
    ```

- **Dynamic Output in Templates (`rt` usage):**
  - When returning translated fields from reactive objects, computed arrays, or APIs (e.g., mapping complex objects like testimonials or FAQs), utilize `rt` in the template to resolve the previously translated/mapped strings.
    ```vue
    <p class="text-xl">
      {{ rt(item.quote) }}
    </p>
    ```

- **Markdown rendering:**
  - If a specific content field expects Markdown within your translations, pass the `t("pages.faq.questions[0].content")` value to the Nuxt UI `<MDC>` (or `<LazyMDC>`) component so it automatically converts text formatting (like lists and strong tags) properly.
