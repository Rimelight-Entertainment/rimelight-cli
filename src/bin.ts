#!/usr/bin/env node
import mri from "mri"
import { name, version, description } from "../package.json"
import { renderCliDoc } from "./utils/help.js"
import { SYNC_GROUPS } from "./utils/constants.js"
import { accent, errorMsg, log } from "./utils/terminal.js"

async function main() {
  let args = process.argv.slice(2)

  // Transform `rimelight help [command]` into `rimelight [command] --help`
  if (args[0] === "help" && args[1]) {
    args = [args[1], "--help", ...args.slice(2)]
  }

  // Transform `--version` or `-v` into `version` command
  if (args.includes("--version") || args.includes("-v")) {
    args = ["version"]
  }

  const parsed = mri(args, {
    boolean: ["help", ...Object.keys(SYNC_GROUPS)],
    alias: { h: "help" }
  })

  const command = parsed._[0]

  if (!command || parsed.help) {
    if (command === "sync") {
      log(renderCliDoc({
        usage: `${name} sync [options]`,
        summary: "Synchronize workspace templates and configurations",
        sections: [
          {
            title: "Options",
            rows: Object.keys(SYNC_GROUPS).map(group => ({
              label: accent(`--${group}`),
              description: `Sync ${group}`
            }))
          }
        ]
      }))
      process.exit(0)
    }

    // Default help
    log(renderCliDoc({
      usage: `${name} <command> [options]`,
      summary: `${name} v${version} - ${description}`,
      sections: [
        {
          title: "Commands",
          rows: [
            { label: accent("sync"), description: "Synchronize workspace templates and configurations" },
            { label: accent("version"), description: "Show version information" }
          ]
        },
        {
          title: "Options",
          rows: [
            { label: accent("--help, -h"), description: "Show help for command" },
            { label: accent("--version, -v"), description: "Show version" }
          ]
        }
      ]
    }))
    process.exit(0)
  }

  try {
    if (command === "sync") {
      const { run } = await import("./commands/sync.js")
      await run(parsed)
    } else if (command === "version") {
      const { run } = await import("./commands/version.js")
      await run()
    } else {
      errorMsg(`Unknown command: ${command}`)
      process.exit(1)
    }
  } catch (err: any) {
    errorMsg(err.message || String(err))
    process.exit(1)
  }
}

main().catch(err => {
  errorMsg(err.message || String(err))
  process.exit(1)
})
