---
description: Accessibility (a11y) Patterns
always_on: true
---

# Accessibility (a11y) Patterns

- **Semantic HTML:**
  - Leverage proper semantic elements (`<header>`, `<nav>`, `<main>`, `<article>`, `<footer>`, `<section>`) instead of generic `<div>` tags wherever possible to provide inherent document structure.
  - Heading order is crucial. Never skip heading levels (e.g., jumping from `<h1>` down to `<h3>`).

- **ARIA Attributes & Localized Labels:**
  - Interactive elements lacking visible text content (like icon-only buttons or link wrappers) MUST utilize `aria-label` to inform screen readers of their purpose.
  - **Crucial Pattern:** You must NEVER hardcode English text inside an `aria-label` or `aria-describedby`. They must be translated using the `t()` or `rt()` functions just like visible text.
    ```vue
    <!-- ❌ Incorrect: Hardcoded English text -->
    <UButton icon="lucide:x" aria-label="Close modal" />

    <!-- ✅ Correct: Localized string key -->
    <UButton icon="lucide:x" :aria-label="t('app.buttons.close')" />
    ```

- **Interactive Elements:**
  - Focus outlines should never be entirely disabled `outline-none` without providing a visible `:focus-visible` UI state fallback.
  - Standard HTML elements that are clicked (like buttons and links) should rely on `<button>` or `<NuxtLink>` tags. Do not assign `@click` events to a standard `<div>` or `<span>` unless you're explicitly managing its `role="button"` and `tabindex="0"`.

- **Media:**
  - All `<NuxtImg>` and `<img>` elements MUST have descriptive `alt` attributes. If an image is purely decorative, use an empty string `alt=""` so screen readers skip it gracefully.
