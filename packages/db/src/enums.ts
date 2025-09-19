/**
 * Type-only enums (string unions) + value arrays.
 * No Prisma imports here; this file must compile with zero runtime code.
 */

export type OrgRole = 'OWNER' | 'ADMIN' | 'MANAGER' | 'STAFF' | 'VIEWER';
export const OrgRoleValues = ['OWNER', 'ADMIN', 'MANAGER', 'STAFF', 'VIEWER'] as const;

export type MemberStatus = 'INVITED' | 'ACTIVE' | 'SUSPENDED' | 'ARCHIVED';
export const MemberStatusValues = ['INVITED', 'ACTIVE', 'SUSPENDED', 'ARCHIVED'] as const;

export type ClientStatus = 'ACTIVE' | 'INACTIVE' | 'ARCHIVED';
export const ClientStatusValues = ['ACTIVE', 'INACTIVE', 'ARCHIVED'] as const;

export type AvailabilityType = 'AVAILABLE' | 'UNAVAILABLE';
export const AvailabilityTypeValues = ['AVAILABLE', 'UNAVAILABLE'] as const;

export type JobStatus = 'DRAFT' | 'OPEN' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'ARCHIVED';
export const JobStatusValues = ['DRAFT', 'OPEN', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'ARCHIVED'] as const;

export type ShiftStatus = 'PLANNED' | 'OPEN' | 'FILLED' | 'COMPLETED' | 'CANCELLED';
export const ShiftStatusValues = ['PLANNED', 'OPEN', 'FILLED', 'COMPLETED', 'CANCELLED'] as const;

export type AssignmentStatus = 'PENDING' | 'CONFIRMED' | 'DECLINED' | 'COMPLETED' | 'CANCELLED';
export const AssignmentStatusValues = ['PENDING', 'CONFIRMED', 'DECLINED', 'COMPLETED', 'CANCELLED'] as const;

export type EmbeddingSource = 'STAFF_PROFILE' | 'JOB' | 'CLIENT' | 'SHIFT';
export const EmbeddingSourceValues = ['STAFF_PROFILE', 'JOB', 'CLIENT', 'SHIFT'] as const;

export type ConsentScope = 'MARKETING' | 'TERMS' | 'DATA_PROCESSING' | 'ACCOUNT_MANAGEMENT' | 'CUSTOM';
export const ConsentScopeValues = ['MARKETING', 'TERMS', 'DATA_PROCESSING', 'ACCOUNT_MANAGEMENT', 'CUSTOM'] as const;

export type DsrType = 'ACCESS' | 'ERASURE' | 'RECTIFICATION' | 'PORTABILITY' | 'OBJECTION' | 'RESTRICTION';
export const DsrTypeValues = ['ACCESS', 'ERASURE', 'RECTIFICATION', 'PORTABILITY', 'OBJECTION', 'RESTRICTION'] as const;

export type DsrStatus = 'RECEIVED' | 'VALIDATING' | 'IN_PROGRESS' | 'COMPLETED' | 'REJECTED';
export const DsrStatusValues = ['RECEIVED', 'VALIDATING', 'IN_PROGRESS', 'COMPLETED', 'REJECTED'] as const;