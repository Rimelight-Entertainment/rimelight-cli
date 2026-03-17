import { join } from "node:path"

export const CLI_NAME = "rimelight"
export const PROJECT_ROOT = process.cwd()

// Root detection for both dev (src/utils/constants.ts) and dist (dist/bin.js)
export const CLI_ROOT = import.meta.dirname.endsWith("utils") 
  ? join(import.meta.dirname, "../..") 
  : join(import.meta.dirname, "..")

export const IS_SELF = CLI_ROOT === PROJECT_ROOT
export const TEMPLATES_ROOT = join(CLI_ROOT, "templates")

/**
 * The directory where necessary object copies go for programmatic merging.
 */
export const TEMPLATES_DIR = ".rimelight"

export interface SyncRule {
  mode: "overwrite" | "merge"
  source: string
  destinations?: string | string[] | { path: string | string[], replace?: Record<string, string> }[]
  patch?: {
    target: string
    key: string
    importName: string
  }
}

export type SyncGroups = Record<string, SyncRule[]>

/**
 * Workspace synchronization rules grouped by category.
 */
export const SYNC_GROUPS: SyncGroups = {
  config: [
    { 
      mode: "overwrite", 
      source: "pnpm-workspace.yaml" 
    },
    { 
      mode: "overwrite", 
      source: "gitignore.template", 
      destinations: ".gitignore" 
    },
    { 
      mode: "overwrite", 
      source: ".editorconfig" 
    },
    { 
      mode: "overwrite", 
      source: ".oxlint" 
    },
    { 
      mode: "overwrite", 
      source: "tsconfig.json" 
    },
    { 
      mode: "overwrite", 
      source: "vue-i18n-extract.config.js" 
    },
    { 
      mode: "merge", 
      source: "rimelight.vite.ts", 
      patch: { 
        target: "nuxt.config.ts", 
        key: "vite", 
        importName: "rimelightViteConfig" 
      }
    }
  ],

  agent: [
    {
      mode: "overwrite",
      source: "AGENTS.md",
      destinations: [
        { 
          path: [
            "AGENTS.md", 
            ".agents/AGENTS.md"
          ], 
          replace: { "./.agent": "./.agents" } 
        },
        { 
          path: ["GEMINI.md", ".gemini/GEMINI.md"], 
          replace: { "./.agent": "./.gemini" } 
        },
        { 
          path: ["ANTIGRAVITY.md", ".antigravity/ANTIGRAVITY.md"], 
          replace: { "./.agent": "./.antigravity" } 
        },
        { 
          path: ["CLAUDE.md", ".claude/CLAUDE.md"], 
          replace: { "./.agent": "./.claude" } 
        },
        { 
          path: ["CURSOR.md", ".cursor/CURSOR.md", ".cursorrules"], 
          replace: { "./.agent": "./.cursor" } 
        }
      ]
    },
    {
      mode: "overwrite",
      source: ".agent",
      destinations: [
        ".agents",
        ".gemini",
        ".claude",
        ".antigravity",
        ".cursor"
      ]
    }
  ]
}
