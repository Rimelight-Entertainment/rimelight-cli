import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"

import { defineConfig } from "vite-plus"

const __dirname = dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  server: {},
  build: {},
  preview: {},
  test: {},
  lint: {
    jsPlugins: [resolve(__dirname, "./.oxlint/rimelight.js")],
    ignorePatterns: [
      "dist/**",
      ".agent/",
      "AGENTS.md",
      "CLAUDE.md",
      "GEMINI.md",
      ".drizzle/",
      "src-tauri/"
    ],
    options: {
      typeAware: true,
      typeCheck: true
    },
    rules: {
      "no-empty-pattern": "off",
      "rimelight/prefer-validated-getters": "warn",
      "rimelight/component-emits-standard": "warn",
      "rimelight/component-props-standard": "warn",
      "rimelight/iconify-standard-format": "warn",
      "rimelight/vue-component-structure": "warn",
      "rimelight/vue-page-structure": "warn"
    }
  },
  fmt: {
    ignorePatterns: [".agent/", "AGENTS.md", "CLAUDE.md", "GEMINI.md", ".drizzle/", "src-tauri/"],
    printWidth: 100,
    tabWidth: 2,
    useTabs: false,
    semi: false,
    singleQuote: false,
    trailingComma: "none",
    bracketSpacing: true,
    insertFinalNewline: true,
    experimentalSortPackageJson: true
  },
  run: {},
  pack: {},
  staged: {}
})
