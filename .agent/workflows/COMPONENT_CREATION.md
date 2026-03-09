---
description: Guides through creating a standardized Vue component with Rimelight conventions
---

# Component Creation Workflow

This workflow guides the scaffolding and implementation of a new Vue component within the Rimelight ecosystem.

## Steps

1. **Scaffold the Component File**
   - Determine if the component is global (`~/components/`) or scoped to a route (`~/pages/[name]/components/`).
   - Create a `[ComponentName].vue` file.
   - Scaffold the `<script setup lang="ts">` and `<template>` blocks.

2. **Define Strict Interfaces (Region Blocks)**
   - Use the `/* region Props */` blocks.
   - Define an `interface` explicitly.
   - (Optional but recommended) If the project extends `rimelight-components`, apply the `rc` interface parameter.
   - Define `Emits` and `Slots` explicitly via `interface` patterns if they exist.

3. **Implement useRC & UI Styling**
   - **[Rimelight Components]** Import `useRC` from the composables and apply `const { rc } = useRC("ComponentName", rcProp)`.
   - Use `tv({ slots: { ... } })` to define semantic base styles instead of raw classes scattered in the `<template>`.
   - Never hardcode color hexes or Tailwind native color tokens (`bg-red-*`). Use semantic tokens only.

4. **Implement Internationalization & Analytics**
   - Ensure NO text sits directly in the template. Everything must flow through `t('pages.xxx.sections.xxx')`.
   - Open standard locale files (e.g., `en.json`) and populate the proper object-based string definitions (never arrays).
   
5. **Implement Accessibility (a11y)**
   - Audit interactive elements. Define `:aria-label="t('...')"` for generic icons or unlabelled buttons. 
   - Ensure semantic wrapper tags (`ul`/`li`, `nav`, `main`, etc.) are wrapped instead of just divs.

6. **Validate Scaffold**
   - Run `bun run fix` and `bun run check`.
