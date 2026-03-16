# Rimelight CLI

An opinionated CLI utility for configuration synchronization across multiple projects.

LLM configurations are compatible with all major tools (Antigravity, Cursor, CodeX, etc.).

## Features

- Workspace Sync: Pull shared configurations into any project.
- Agent Hub: Automatically generate instruction files for Gemini, Claude, and Cursor.
- Modular Sync: Use flags to sync agents or configs independently.

## Getting Started

### Installation

Add it as a dev dependency from GitHub:

```bash
pnpm add -D github:Rimelight-Entertainment/rimelight-cli
```

### Usage

Run the sync command to synchronize all configurations with the reference repository:

```bash
pnpm rimelight sync
```

**Sync LLM Configurations Only:**

```bash
pnpm rimelight sync --agents
```

**Sync Workspace Configurations Only:**

```bash
pnpm rimelight sync --configs
```

## Synchronized Files

The CLI maintains parity across repositories for the following files:

### LLM Agent Configuration

- `AGENTS.md`
- `.agent/rules/`
- `.agent/skills/`
- `.agent/workflows/`

### Development Workspace

- **WebStorm:** `.editorconfig`
- **Git:** `.gitignore`
- **Vite+ Config:** `vite.config.ts`

## License

MIT - See [LICENSE.md](LICENSE.md)

---

Copyright (c) 2026 Rimelight Entertainment.
