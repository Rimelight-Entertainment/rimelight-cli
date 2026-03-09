---
description: TypeScript Architecture & Conventions
always_on: true
---

# TypeScript Conventions

- **Type Imports:**
  - When importing types, `type` MUST be placed outside the curly brackets (i.e., use top-level type imports).
  - Mixing inline type imports (e.g., `import { type User, getUser }`) occasionally causes bundlers or Nuxt to trace the entire file unintentionally into client or server bundles (especially frequent with Drizzle/DB schemas).
  - **Correct:** `import type { User } from "@/shared/db/auth"`
  - **Incorrect:** `import { type User } from "@/shared/db/auth"`

- **Interfaces over Types:** 
  - Prefer `interface` for defining object shapes and component props. 
  - Only use `type` for defining unions, primitive aliases, or utility types (e.g., `Pick`, `Omit`).

- **No Enums:** 
  - Standard TypeScript `enum` declarations generate unnecessary IIFEs causing extra runtime payload and bundle size issues.
  - Utilize union types instead of enums. 
  - Example:
    ```ts
    // ❌ Incorrect
    enum Status {
      Active = "active",
      Inactive = "inactive"
    }
    
    // ✅ Correct
    type Status = "active" | "inactive"
    ```

- **Readonly Assertions:**
  - Utilize `readonly` for standard component props if you are extracting their interfaces outside the component declaration, ensuring mutation safety.
  - Example:
    ```ts
    export interface CardProps {
      readonly title: string;
      readonly description?: string;
    }
    ```

- **Explicit Return Types:**
  - Always enforce explicit return types for functions, components, and API handlers. This speeds up the TypeScript compiler (preventing deep inference checking) and serves as self-documenting code.
  - Example:
    ```ts
    // ❌ Incorrect
    const generateTag = () => "0000"
    
    // ✅ Correct
    const generateTag = (): string => "0000"
    
    // ✅ Correct (Async)
    const fetchUser = async (id: string): Promise<User> => {
      return await $api(`/users/${id}`)
    }
    ```
