---
trigger: always_on
---

# Data Management

- **[Rimelight Components] Database & ORM (PostgreSQL):**
  - **Database:** PostgreSQL 18.
  - **ORM:** Drizzle ORM.
  - **IDs:** Always use UUIDv7 (`uuid("id").default(sql`uuidv7()`)` or via the internal `id` helper) for primary keys.
  - **Helpers:** Build tables utilizing the common `id` and `timestamps` helpers (imported from `shared/db/helpers`) whenever possible instead of explicitly redeclaring standard columns.
  - **Schema Location:** Schemas are broken down and robustly defined inside the `shared/db/` directory (e.g., `shared/db/auth.ts`). 
  - **Schema Rules:** Tables (`pgTable`) MUST be highly robust. You must define explicit types, relations (`relations()`), comprehensive indexes (including composite and unique indexes), and directly export types via `$inferSelect`.
  - **Migrations:** Managed via `drizzle-kit`. **IMPORTANT:** NEVER execute database migrations directly. Always explicitly ask the user for permission or provide the command for them to run before executing any schema migrations.
  - **Server API:** Typed responses using `zod` or TypeScript interfaces.

- **Standalone/Content Projects Database (Cloudflare D1):**
  - Projects not extending `rimelight-components` (such as standalone portfolios or content websites) utilize a different stack.
  - **Database:** Cloudflare D1. 
  - **Content Management:** Driven by `@nuxt/content` and `@nuxtjs/studio`.
  - **Configuration:** The database is natively bound through the Nuxt config inside the `$production` block:
    ```ts
    content: {
      database: {
        type: "d1",
        bindingName: "DB"
      }
    }
    ```