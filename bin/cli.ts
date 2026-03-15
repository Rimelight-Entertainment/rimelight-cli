#!/usr/bin/env node --import tsx
import { cp, readFile, writeFile, mkdir, rm } from "node:fs/promises"
import { join, dirname } from "node:path"
import { fileURLToPath } from "node:url"

import { defineCommand, runMain } from "citty"

const __dirname = dirname(fileURLToPath(import.meta.url))
const PROJECT_ROOT = process.cwd()

// SHARED_ROOT is the package directory
const SHARED_ROOT = join(__dirname, "..")

const AGENTS = [
  { name: "Gemini", folder: ".gemini", file: "GEMINI.md" },
  { name: "Antigravity", folder: ".antigravity", file: "ANTIGRAVITY.md" },
  { name: "Claude", folder: ".claude", file: "CLAUDE.md" },
  { name: "Cursor", folder: ".cursor", file: "CURSOR.md", extra: ".cursorrules" },
  { name: "Agents", folder: ".agents", file: "AGENTS.md" }
]

const DIRECT_SYNC = [
  ".gitignore",
  ".editorconfig",
  ".husky",
  "commitlint.config.ts",
  "vite.config.ts",
  ".oxlint"
]

const main = defineCommand({
  meta: {
    name: "rimelight",
    version: "1.0.0",
    description: "Rimelight workspace synchronization CLI"
  },
  args: {
    agents: {
      type: "boolean",
      description: "Sync AI agent instructions only",
      alias: "a"
    },
    configs: {
      type: "boolean",
      description: "Sync workspace configurations only",
      alias: "c"
    }
  },
  async run({ args }) {
    console.log("🔄 Synchronizing shared workspace...")

    // If no flags, sync everything
    const syncAll = !args.agents && !args.configs
    const syncAgents = args.agents || syncAll
    const syncConfigs = args.configs || syncAll

    // 1. Direct File/Folder Sync
    if (syncConfigs) {
      console.log("📦 Syncing configs...")
      for (const item of DIRECT_SYNC) {
        const sourcePath = join(SHARED_ROOT, item)
        const destPath = join(PROJECT_ROOT, item)

        // Skip syncing to self if running from within the dev repo
        if (sourcePath === destPath) continue

        try {
          await cp(sourcePath, destPath, { recursive: true, force: true })
          console.log(`  ✅ ${item} synced`)
        } catch {
          // It's okay if something doesn't exist
        }
      }
    }

    // 2. AGENTS.md Processing & Agent Folder Sync
    if (syncAgents) {
      console.log("🤖 Syncing agent instructions...")
      const agentsMdPath = join(SHARED_ROOT, "AGENTS.md")
      let agentsMdContent = ""
      try {
        agentsMdContent = await readFile(agentsMdPath, "utf-8")
      } catch {
        console.warn("⚠️ Warning: AGENTS.md not found. Skipping agent directions sync.")
      }

      if (agentsMdContent) {
        // Skip if in own repo
        if (SHARED_ROOT === PROJECT_ROOT) {
          console.log("ℹ️  Skipping agent generation in self-sync.")
        } else {
          for (const agent of AGENTS) {
            const agentRoot = join(PROJECT_ROOT, agent.folder)

            // Ensure agent directory exists and is entirely clean of old files like `.agent/skills/`
            await rm(agentRoot, { recursive: true, force: true }).catch(() => {})
            await mkdir(agentRoot, { recursive: true })

            // Sync shared rules/workflows to agent folder
            const sharedFolders = ["rules", "workflows", "skills"]
            for (const folder of sharedFolders) {
              const sourceFolder = join(SHARED_ROOT, ".agent", folder)
              const destFolder = join(agentRoot, folder)
              try {
                await cp(sourceFolder, destFolder, { recursive: true, force: true })
              } catch {
                // Folder might not exist in .agent, that's okay
              }
            }

            // Generate agent-specific instruction file
            const agentInstructions = agentsMdContent.replace(/\.\/\.agent/g, `./${agent.folder}`)

            // Write to root
            await writeFile(join(PROJECT_ROOT, agent.file), agentInstructions)

            // Write into agent folder
            await writeFile(join(agentRoot, agent.file), agentInstructions)

            if (agent.extra) {
              await writeFile(join(PROJECT_ROOT, agent.extra), agentInstructions)
            }

            console.log(`  ✅ ${agent.name} instructions generated`)
          }
        }
      }
    }

    // 3. Package JSON Scripts Sync
    if (SHARED_ROOT !== PROJECT_ROOT) {
      const pkgPath = join(PROJECT_ROOT, "package.json")
      try {
        const pkgText = await readFile(pkgPath, "utf-8")
        const pkg = JSON.parse(pkgText)
        pkg.scripts = pkg.scripts || {}

        let updated = false
        const scripts = {
          sync: "pnpm rimelight sync && pnpm husky && pnpm exec nuxt prepare",
          "sync:agents": "pnpm rimelight sync --agents",
          "sync:configs": "pnpm rimelight sync --configs"
        }

        for (const [name, command] of Object.entries(scripts)) {
          if (pkg.scripts[name] !== command) {
            pkg.scripts[name] = command
            updated = true
          }
        }

        if (updated) {
          await writeFile(pkgPath, JSON.stringify(pkg, null, 2) + "\n")
          console.log("  ✅ package.json scripts updated")
        }
      } catch {
        // No package.json or invalid JSON
      }
    }

    console.log("✨ Sync complete.")
  }
})

void runMain(main)
