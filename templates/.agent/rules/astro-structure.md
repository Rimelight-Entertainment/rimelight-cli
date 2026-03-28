---
description: Astro Component & Pages Architecture
always_on: true
---

# Astro Component & Pages Architecture

- **File Naming:**
  - Folders: `kebab-case`
  - Components: `PascalCase`
  - Pages: `kebab-case` (within `src/pages/`)

  _Keep general components in the `src/components/` folder, and project-specific components in their own nested `/components/` folders inside page directories if applicable._

- **Prefixing Conventions**:
  - RimelightComponents are prefixed `RC` (e.g., `<RCMovieCard />`).
  - Project-specific components use their own unique prefix (e.g., `AS` for astronaut) to avoid collisions.

- **Component Structure:**
  - All `.astro` files MUST start with the frontmatter block (`---`), even if empty.
  - The structure follows:
    1. Frontmatter (`--- ... ---`)
    2. Template (HTML/JSX-like)
    3. `<style>` (Scoped by default)
    4. `<script>` (Client-side logic)

- **Frontmatter Region Formatting:**
  - The frontmatter MUST be divided into region comments (`/* region RegionName */` and `/* endregion */`) in the exact order below.
  - **Regions**: Imports, Props, Logic.

- **Explicit Formats:**
  - **Props:** Components MUST define props as an interface named `Props` and use destructuring from `Astro.props`.
    ```ts
    ---
    /* region Imports */
    import { someHelper } from '@/utils/helpers'
    /* endregion */

    /* region Props */
    interface Props {
      title: string
      description?: string
    }
    const { title, description = 'Default description' } = Astro.props
    /* endregion */

    /* region Logic */
    const formattedTitle = title.toUpperCase()
    /* endregion */
    ---
    ```

- **UI & Styling:**
  - **Tailwind CSS:** Standard Tailwind 4 practices apply. Rely on CSS variables for consistent theme colors (e.g., `--primary`). Use semantic names like `error` instead of `red`.
  - **Component Styling:** Use scoped `<style>` tags within `.astro` files for component-specific styles. For complex components, consider using `tailwind-variants` in the frontmatter.
  - **Icons:** Use `astro-icon` for icons following the integration format (e.g., `social/github`). Use raw SVGs for simple cases.
  - **Responsive Design:** Use Tailwind prefixes (`sm:`, `md:`, etc.) and prefer mobile-first styling.

- **Client Directives:**
  - Use `client:load`, `client:idle`, `client:visible`, or `client:only` ONLY when client-side interactivity is required.
  - Prefer server-side rendering (default) whenever possible for performance.

- **Slots:**
  - Use `<slot />` for the default slot and `<slot name="name" />` for named slots.
  - Ensure documentation comments explain required slots.
