// packages/db/src/enums.ts
// Re-export **types only** from Prisma. These are erased at runtime so
// CJS apps (ts-node) won’t try to load this ESM package.
// Usage from consumers: `import type { OrgRole } from '@eventon/db';`

// Prisma v5 exposes enum types under $Enums.
export type OrgRole = import('@prisma/client').$Enums.OrgRole;
export type AssignmentStatus = import('@prisma/client').$Enums.AssignmentStatus;
export type ConsentScope = import('@prisma/client').$Enums.ConsentScope;
export type DsrStatus = import('@prisma/client').$Enums.DsrStatus;
export type DsrType = import('@prisma/client').$Enums.DsrType;

// If you want to expose more enum types, follow the same pattern:
//
// export type SomeEnum = import('@prisma/client').$Enums.SomeEnum;
