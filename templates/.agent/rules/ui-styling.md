---
description: UI & Styling Patterns
always_on: true
---

# UI & Styling

- **Tailwind CSS:**
  - Rely on CSS variables for consistent theme colors (e.g., `--primary`).
  - **Color Palette & Themes:** Use custom colors and classes defined in the project's Nuxt UI or CSS configurations rather than Tailwind's default colors. For example, use semantic names like `error` instead of `red`, and gap-sm instead of gap-2. Never default to standard Tailwind classes if a semantic alternative actually exists in the project.

- **Nuxt UI Integration:**
  - Use Nuxt UI components when possible (prefixed with `U`) instead of custom implementations.
  - Use the Nuxt UI MCP server to retrieve documentation for standard components. If you need to implement a component, DO NOT guess its properties. Use the MCP tools to verify the exact UI schema, slots, and styling options. 

- **[Rimelight Components] Styling (`useRC`):**
  - Components and layouts MUST use the `useRC()` composable to handle dynamic and responsive class resolution.
  - This is built to act identically to Nuxt UI's native `ui` prop override pattern but uses the `rc` prop instead, enabling developers to completely override or extend default component styles seamlessly.
  - It works tightly integrated with `tailwind-variants` (using the `tv` function) to define scoped base slots. Below is an explicit example of how to configure the component setup and structure it in the template:
    ```vue
    <script setup lang="ts">
    import { useRC } from "../../composables";
    import { tv } from "../../internal/tv";
    
    /* region Props */
    export interface ExampleProps {
      rc?: {
        base?: string;
        icon?: string;
      };
    }
    
    const { rc: rcProp } = defineProps<ExampleProps>();
    
    // We initialize the `useRC` hook by passing the component name and the incoming overrides.
    const { rc } = useRC("Example", rcProp);
    /* endregion */
    
    /* region Styles */
    // Base structural slots are defined using tailwind-variants.
    const exampleStyles = tv({
      slots: {
        base: "flex items-center gap-2 p-4",
        icon: "size-6 text-primary",
      },
    });
    
    const { base, icon } = exampleStyles();
    /* endregion */
    </script>
    
    <template>
      <!-- The slot variants are called as functions, injecting the overridden classes via the previously mapped `rc` reactivity! -->
      <div :class="base({ class: rc.base })">
        <UIcon name="lucide:alert-circle" :class="icon({ class: rc.icon })" />
      </div>
    </template>
    ```

- **Icons:**
  - Try to use `lucide` icons whenever possible through the Nuxt UI built-in UIcon component.
  - **[Rimelight Components]** Branding or specific local icons can be used through the `RCLogo` component.
  - **Format Rule:** Icon names MUST use the colon-separated format (e.g., `lucide:icon-name`) instead of the dashed prefix format (`i-lucide-icon-name`). This is enforced by the linting setup.
