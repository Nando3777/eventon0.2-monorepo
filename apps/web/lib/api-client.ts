import { ConsentScope, DsrStatus, DsrType } from '@eventon/db';

export class ApiError<T = unknown> extends Error {
  constructor(message: string, public status: number, public data: T | null) {
    super(message);
    this.name = 'ApiError';
  }
}

function resolveBaseUrl() {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!baseUrl) {
    throw new Error('NEXT_PUBLIC_API_BASE_URL is not configured. Add it to apps/web/.env.');
  }
  return baseUrl;
}

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const baseUrl = resolveBaseUrl();
  const url = new URL(path, baseUrl).toString();
  const headers = new Headers(init?.headers);
  if (!headers.has('Accept')) {
    headers.set('Accept', 'application/json');
  }
  if (init?.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(url, {
    ...init,
    headers,
    cache: 'no-store',
  });

  let data: unknown = null;
  const contentType = response.headers.get('content-type');
  if (contentType?.includes('application/json')) {
    data = await response.json().catch(() => null);
  } else {
    data = await response.text().catch(() => null);
  }

  if (!response.ok) {
    throw new ApiError(`Request to ${url} failed`, response.status, data);
  }

  return data as T;
}

export interface LoginResponse {
  accessToken: string;
  expiresIn: number;
  tokenType: string;
}

export async function loginWithCredentials({
  email,
  password,
}: {
  email: string;
  password: string;
}): Promise<LoginResponse> {
  return apiFetch<LoginResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export interface AuthProfile {
  id: string;
  email: string;
  name: string | null;
  roles?: string[];
}

export async function fetchAuthProfile(accessToken: string, tokenType = 'bearer'): Promise<AuthProfile> {
  return apiFetch<AuthProfile>('/auth/profile', {
    headers: {
      Authorization: `${tokenType} ${accessToken}`,
    },
  });
}

export interface OrganisationPayload {
  name: string;
  slug: string;
  ownerId: string;
  description?: string;
  timezone?: string;
}

export interface OrganisationResponse {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  timezone?: string | null;
}

export async function registerOrganisation(payload: OrganisationPayload): Promise<OrganisationResponse> {
  return apiFetch<OrganisationResponse>('/orgs', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export interface HealthResponse {
  status: 'ok' | 'degraded';
  database: boolean;
}

export async function getHealth(): Promise<HealthResponse> {
  return apiFetch<HealthResponse>('/health');
}

export interface ConsentRecord {
  id: string;
  subjectIdentifier: string;
  scope: ConsentScope;
  grantedAt: string;
  revokedAt?: string | null;
}

export interface UpsertConsentPayload {
  subjectIdentifier: string;
  scope: ConsentScope;
  granted: boolean;
  expiresAt?: string;
}

export async function getConsents(subjectIdentifier: string): Promise<ConsentRecord[]> {
  if (!subjectIdentifier) {
    return [];
  }
  const query = new URLSearchParams({ subject: subjectIdentifier });
  return apiFetch<ConsentRecord[]>(`/privacy/consents?${query.toString()}`);
}

export async function upsertConsent(payload: UpsertConsentPayload): Promise<ConsentRecord> {
  return apiFetch<ConsentRecord>('/privacy/consents', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export interface PrivacyExportPayload {
  subjectIdentifier: string;
  deliveryEmail?: string;
}

export interface PrivacyExportResponse {
  exportId: string;
  status: string;
}

export async function requestExport(payload: PrivacyExportPayload): Promise<PrivacyExportResponse> {
  return apiFetch<PrivacyExportResponse>('/privacy/export', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export interface CreateDsrPayload {
  subjectIdentifier: string;
  type: DsrType;
  notes?: string;
}

export interface DsrResponse {
  id: string;
  status: DsrStatus;
  subjectIdentifier: string;
}

export async function requestDsr(payload: CreateDsrPayload): Promise<DsrResponse> {
  return apiFetch<DsrResponse>('/privacy/dsr', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}
