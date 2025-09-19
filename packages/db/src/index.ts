// Re-export TS *types* and the string literal value arrays from enums.
// This keeps runtime light (no real TS "enums"), but gives consumers
// both strong typing and the allowed string lists.

export type {
  OrgRole,
  MemberStatus,
  ClientStatus,
  AvailabilityType,
  JobStatus,
  ShiftStatus,
  AssignmentStatus,
  EmbeddingSource,
  ConsentScope,
  DsrType,
  DsrStatus,
} from './enums';

// NodeNext/Node16 requires the “.js” extension in source for emitted ESM.
export {
  OrgRoleValues,
  MemberStatusValues,
  ClientStatusValues,
  AvailabilityTypeValues,
  JobStatusValues,
  ShiftStatusValues,
  AssignmentStatusValues,
  EmbeddingSourceValues,
  ConsentScopeValues,
  DsrTypeValues,
  DsrStatusValues,
} from './enums.js';
