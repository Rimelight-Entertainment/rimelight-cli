# Rimelight CLI

A CLI utility for configuration synchronization across multiple projects.

## Features

- Workspace Sync: Pull shared configurations into any project.
- Agent Hub: Automatically generate instruction files for Gemini, Claude, and Cursor.
- Modular Sync: Use flags to sync agents or configs independently.
- Bun First: Built for the modern ecosystem using Bun and TypeScript.

## Getting Started

### Installation

Add it as a dev dependency from GitHub:

```bash
bun add -D github:Rimelight-Entertainment/rimelight-cli
```

### Usage

Run the sync command to synchronize all local with the reference repository:

```bash
bunx rimelight sync
```

**Sync LLM Agent Instructions only:**

```bash
bunx rimelight sync --agents
```

**Sync configurations only:**

```bash
bunx rimelight sync --configs
```

## Synchronized Files

The CLI maintains parity for:

- WebStorm (.editorconfig)
- Bun (bunfig.toml)
- Git (.gitignore, .husky/, commitlint.config.ts)
- Oxlint (oxlint.config.ts & .oxlint/ rules)
- Oxfmt (.oxfmtrc.jsonc)

## License

MIT - See [LICENSE.md](LICENSE.md)

---

Copyright (c) 2026 Rimelight Entertainment.
