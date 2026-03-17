import { cp, readFile, writeFile, mkdir, rm } from "node:fs/promises"
import { join, dirname } from "node:path"
import { 
  SYNC_GROUPS, 
  TEMPLATES_DIR, 
  TEMPLATES_ROOT, 
  PROJECT_ROOT, 
  IS_SELF,
  type SyncRule
} from "../utils/constants.js"
import { log, infoMsg, warnMsg, success, accent } from "../utils/terminal.js"

export async function run(args: any) {
  if (IS_SELF) {
    warnMsg("Execution skipped: Cannot run on the rimelight-cli repository itself.")
    return
  }

  infoMsg("Synchronizing shared workspace...")

  const groupKeys = Object.keys(SYNC_GROUPS)
  const active = groupKeys.filter(g => args[g])
  const syncAll = active.length === 0

  for (const [group, rules] of Object.entries(SYNC_GROUPS)) {
    if (syncAll || args[group]) {
      for (const rule of rules) {
        await executeRule(rule)
      }
    }
  }

  log(`\n${success("Workspace synchronization complete!")}`)
}

/**
 * Executes a single synchronization rule.
 */
async function executeRule(rule: SyncRule) {
  const source = join(TEMPLATES_ROOT, rule.source)
  if (!rule.mode) throw new Error(`Rule for ${rule.source} is missing 'mode'`)

  // Normalize destinations: 'merge' uses TEMPLATES_DIR, others use provided or source name
  const rawDests = rule.mode === "merge" 
    ? [join(TEMPLATES_DIR, rule.source)]
    : Array.isArray(rule.destinations) ? rule.destinations : [rule.destinations || rule.source]

  for (const dest of rawDests) {
    const isString = typeof dest === "string"
    const paths = isString ? [dest as string] : (Array.isArray((dest as any).path) ? (dest as any).path : [(dest as any).path])
    const replace = !isString ? (dest as any).replace : null

    for (const p of paths) {
      const target = join(PROJECT_ROOT, p)
      if (source === target) continue

      // Clean sync: Wipe destination first to ensure no stale files persist
      await rm(target, { recursive: true, force: true }).catch(() => {})
      await mkdir(dirname(target), { recursive: true }).catch(() => {})

      if (replace) {
        let content = await readFile(source, "utf-8")
        for (const [key, val] of Object.entries(replace)) {
          content = content.replaceAll(key, val as string)
        }
        await writeFile(target, content)
      } else {
        await cp(source, target, { recursive: true, force: true }).catch(() => {})
      }

      if (rule.mode === "merge" && rule.patch) {
        await patchConfig(rule.patch, p)
      }

      log(`  - ${accent(p)} synced`)
    }
  }
}

/**
 * Surgically grafts shared configurations into target project files.
 */
async function patchConfig(patch: { target: string, key: string, importName: string }, definitionFile: string) {
  const target = join(PROJECT_ROOT, patch.target)
  let content = await readFile(target, "utf-8").catch(() => null)
  if (content === null) return

  const ensureImport = (stmt: string, check: string) => {
    if (!content!.includes(check)) {
      content = stmt + "\n" + content
    }
  }

  ensureImport(`import { ${patch.importName} } from "./${definitionFile.replace(".ts", "")}"`, patch.importName)
  ensureImport('import { defu } from "defu"', 'import { defu } from "defu"')

  const match = content.match(new RegExp(`${patch.key}:\\s*`))
  if (match) {
    const start = match.index! + match[0].length
    const restOfContent = content.slice(start)

    if (!restOfContent.trim().startsWith("defu(")) {
      const braceIndex = restOfContent.indexOf("{")
      if (braceIndex !== -1) {
        const absBraceIndex = start + braceIndex
        const closingBraceIndex = findClosingBrace(content, absBraceIndex)

        if (closingBraceIndex !== -1) {
          const original = content.slice(absBraceIndex, closingBraceIndex + 1)
          content = content.slice(0, absBraceIndex) + `defu(${original}, ${patch.importName})` + content.slice(closingBraceIndex + 1)
        }
      }
    }
  } else {
    // Inject at the start of defineNuxtConfig if the key is missing
    const injectPoint = content.indexOf("defineNuxtConfig({")
    if (injectPoint !== -1) {
      const start = injectPoint + "defineNuxtConfig({".length
      content = content.slice(0, start) + `\n  ${patch.key}: defu({}, ${patch.importName}),` + content.slice(start)
    }
  }

  await writeFile(target, content)
  log(`  ${accent("[MERGE]")} ${patch.target} (${patch.key})`)
}

/**
 * Finding matching closing brace for object literals.
 */
function findClosingBrace(content: string, start: number) {
  let depth = 0
  for (let i = start; i < content.length; i++) {
    if (content[i] === "{") depth++
    if (content[i] === "}") {
      if (--depth === 0) return i
    }
  }
  return -1
}
