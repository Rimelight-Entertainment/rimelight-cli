---
description: Performs a comprehensive code review following rimelight standards
---

# Code Review Workflow

This workflow performs a comprehensive code review following the established rimelight standards.

## Steps

1. **Verify Automated Checks**
   - Run `bun run fix` to handle auto-fixable issues (e.g., missing i18n keys, formatting).
   - Run `bun run check` to verify i18n JSON structure, Typecheck, linting, and formatting.
   - All pipeline tools MUST pass before proceeding.