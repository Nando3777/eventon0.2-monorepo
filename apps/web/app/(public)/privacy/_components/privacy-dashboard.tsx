'use client';

import { Button } from '@eventon/ui';
import { ConsentScope, DsrStatus, DsrType } from '@eventon/db/enums';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { z } from 'zod';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import {
  getConsents,
  requestDsr,
  requestExport,
  upsertConsent,
  type ConsentRecord,
  type DsrResponse,
  type PrivacyExportResponse,
} from '@/lib/api-client';

const consentSchema = z.object({
  subjectIdentifier: z.string().min(2),
  scope: z.nativeEnum(ConsentScope),
  granted: z.boolean(),
  expiresAt: z.string().optional(),
});

const exportSchema = z.object({
  subjectIdentifier: z.string().min(2),
  deliveryEmail: z.string().email().optional(),
});

const dsrSchema = z.object({
  subjectIdentifier: z.string().min(2),
  notes: z.string().optional(),
});

type ConsentFormState = z.infer<typeof consentSchema>;
type ExportFormState = z.infer<typeof exportSchema>;
type DsrFormState = z.infer<typeof dsrSchema>;

function ConsentList({ consents }: { consents: ConsentRecord[] }) {
  if (!consents.length) {
    return <p className="text-sm text-muted-foreground">No consents recorded for this subject yet.</p>;
  }

  return (
    <ul className="space-y-3">
      {consents.map((consent) => (
        <li key={consent.id} className="flex items-center justify-between rounded-lg border bg-card px-3 py-2 text-sm">
          <div className="space-y-1">
            <p className="font-medium">{consent.scope.replaceAll('_', ' ')}</p>
            <p className="text-xs text-muted-foreground">Granted on {new Date(consent.grantedAt).toLocaleDateString()}</p>
          </div>
          <Badge variant={consent.revokedAt ? 'secondary' : 'success'}>
            {consent.revokedAt ? 'Revoked' : 'Granted'}
          </Badge>
        </li>
      ))}
    </ul>
  );
}

function DsrStatusBadge({ status }: { status: DsrStatus }) {
  const variants: Record<DsrStatus, 'success' | 'secondary' | 'default' | 'destructive'> = {
    [DsrStatus.RECEIVED]: 'default',
    [DsrStatus.VALIDATING]: 'secondary',
    [DsrStatus.IN_PROGRESS]: 'secondary',
    [DsrStatus.COMPLETED]: 'success',
    [DsrStatus.REJECTED]: 'destructive',
  };
  return <Badge variant={variants[status]}>{status.replaceAll('_', ' ')}</Badge>;
}

export function PrivacyDashboard() {
  const queryClient = useQueryClient();
  const [subjectInput, setSubjectInput] = useState('demo.user@example.com');
  const [activeSubject, setActiveSubject] = useState('demo.user@example.com');
  const [consentState, setConsentState] = useState<ConsentFormState>({
    subjectIdentifier: 'demo.user@example.com',
    scope: ConsentScope.MARKETING,
    granted: true,
    expiresAt: '',
  });
  const [exportState, setExportState] = useState<ExportFormState>({
    subjectIdentifier: 'demo.user@example.com',
    deliveryEmail: 'demo.user@example.com',
  });
  const [dsrState, setDsrState] = useState<DsrFormState>({
    subjectIdentifier: 'demo.user@example.com',
    notes: '',
  });
  const [consentMessage, setConsentMessage] = useState<string | null>(null);
  const [exportResponse, setExportResponse] = useState<PrivacyExportResponse | null>(null);
  const [dsrResponse, setDsrResponse] = useState<DsrResponse | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const consentsQuery = useQuery({
    queryKey: ['privacy', 'consents', activeSubject],
    queryFn: () => getConsents(activeSubject),
    enabled: Boolean(activeSubject),
  });

  const consentMutation = useMutation({
    mutationFn: upsertConsent,
    onMutate: async (variables) => {
      setConsentMessage(null);
      setFormError(null);
      await queryClient.cancelQueries({ queryKey: ['privacy', 'consents', variables.subjectIdentifier] });
    },
    onSuccess: async (_, variables) => {
      setConsentMessage('Consent preferences updated.');
      await queryClient.invalidateQueries({ queryKey: ['privacy', 'consents', variables.subjectIdentifier] });
    },
    onError: () => {
      setFormError('Unable to update consent at this time. Please try again later.');
    },
  });

  const exportMutation = useMutation({
    mutationFn: requestExport,
    onMutate: () => {
      setExportResponse(null);
      setFormError(null);
    },
    onSuccess: (response) => setExportResponse(response),
    onError: () => setFormError('Failed to request the export. Please retry.'),
  });

  const dsrMutation = useMutation({
    mutationFn: (variables: DsrFormState) => requestDsr({ ...variables, type: DsrType.ERASURE }),
    onMutate: () => {
      setDsrResponse(null);
      setFormError(null);
    },
    onSuccess: (response) => setDsrResponse(response),
    onError: () => setFormError('The erasure request could not be submitted.'),
  });

  const handleSubjectChange = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!subjectInput.trim()) {
      setFormError('Please provide a subject identifier.');
      return;
    }

    setFormError(null);
    setActiveSubject(subjectInput.trim());
    setConsentState((state) => ({ ...state, subjectIdentifier: subjectInput.trim() }));
    setExportState((state) => ({ ...state, subjectIdentifier: subjectInput.trim() }));
    setDsrState((state) => ({ ...state, subjectIdentifier: subjectInput.trim() }));
  };

  const handleConsentSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const parsed = consentSchema.safeParse(consentState);
    if (!parsed.success) {
      setFormError(parsed.error.issues[0]?.message ?? 'Consent form invalid');
      return;
    }

    try {
      await consentMutation.mutateAsync({
        ...parsed.data,
        expiresAt: parsed.data.expiresAt ? parsed.data.expiresAt : undefined,
      });
    } catch (error) {
      console.error('Failed to update consent', error);
    }
  };

  const handleExportSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const parsed = exportSchema.safeParse(exportState);
    if (!parsed.success) {
      setFormError(parsed.error.issues[0]?.message ?? 'Export form invalid');
      return;
    }

    try {
      const response = await exportMutation.mutateAsync(parsed.data);
      setExportResponse(response);
    } catch (error) {
      console.error('Failed to request export', error);
    }
  };

  const handleDsrSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const parsed = dsrSchema.safeParse(dsrState);
    if (!parsed.success) {
      setFormError(parsed.error.issues[0]?.message ?? 'Request form invalid');
      return;
    }

    try {
      const response = await dsrMutation.mutateAsync(parsed.data);
      setDsrResponse(response);
    } catch (error) {
      console.error('Failed to submit DSR', error);
    }
  };

  return (
    <section className="space-y-10">
      <Card>
        <CardHeader className="space-y-1">
          <CardTitle>Privacy center</CardTitle>
          <CardDescription>Review and control the consents associated with your EventOn account.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <form className="flex flex-col gap-3 sm:flex-row" onSubmit={handleSubjectChange}>
            <div className="flex-1 space-y-1">
              <Label htmlFor="subject">Subject identifier</Label>
              <Input
                id="subject"
                placeholder="you@example.com"
                value={subjectInput}
                onChange={(event) => setSubjectInput(event.target.value)}
              />
            </div>
            <div className="flex items-end">
              <Button className="w-full sm:w-auto" type="submit">
                Load consents
              </Button>
            </div>
          </form>
          <Separator />
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-muted-foreground">Recorded consents</h3>
            {consentsQuery.isLoading ? (
              <p className="text-sm text-muted-foreground">Loading consents…</p>
            ) : consentsQuery.isError ? (
              <p className="text-sm text-destructive">Unable to load consent records.</p>
            ) : (
              <ConsentList consents={consentsQuery.data ?? []} />
            )}
          </div>
          <Separator />
          <form className="grid gap-4 sm:grid-cols-2" onSubmit={handleConsentSubmit}>
            <div className="space-y-2 sm:col-span-2">
              <h3 className="text-sm font-medium text-muted-foreground">Update consent preference</h3>
              <p className="text-xs text-muted-foreground">
                Adjust your marketing and processing preferences. Changes are saved to the privacy ledger.
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="consent-scope">Consent scope</Label>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm"
                id="consent-scope"
                value={consentState.scope}
                onChange={(event) =>
                  setConsentState((state) => ({
                    ...state,
                    scope: event.target.value as ConsentScope,
                  }))
                }
              >
                {Object.values(ConsentScope).map((scope) => (
                  <option key={scope} value={scope}>
                    {scope.replaceAll('_', ' ')}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="consent-status">Status</Label>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm"
                id="consent-status"
                value={consentState.granted ? 'granted' : 'revoked'}
                onChange={(event) =>
                  setConsentState((state) => ({
                    ...state,
                    granted: event.target.value === 'granted',
                  }))
                }
              >
                <option value="granted">Granted</option>
                <option value="revoked">Revoked</option>
              </select>
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="expires">Expires (optional)</Label>
              <Input
                id="expires"
                placeholder="2024-12-31"
                value={consentState.expiresAt ?? ''}
                onChange={(event) =>
                  setConsentState((state) => ({
                    ...state,
                    expiresAt: event.target.value,
                  }))
                }
              />
            </div>
            {consentMessage ? (
              <p className="text-sm text-emerald-600 sm:col-span-2">{consentMessage}</p>
            ) : null}
            <Button className="sm:col-span-2" disabled={consentMutation.isLoading} type="submit">
              {consentMutation.isLoading ? 'Saving…' : 'Save preference'}
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle>Request data export</CardTitle>
            <CardDescription>Receive a machine-readable export of your EventOn activity.</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handleExportSubmit}>
              <div className="space-y-2">
                <Label htmlFor="export-subject">Subject identifier</Label>
                <Input
                  id="export-subject"
                  value={exportState.subjectIdentifier}
                  onChange={(event) =>
                    setExportState((state) => ({
                      ...state,
                      subjectIdentifier: event.target.value,
                    }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="export-email">Delivery email (optional)</Label>
                <Input
                  id="export-email"
                  type="email"
                  placeholder="you@example.com"
                  value={exportState.deliveryEmail ?? ''}
                  onChange={(event) =>
                    setExportState((state) => ({
                      ...state,
                      deliveryEmail: event.target.value || undefined,
                    }))
                  }
                />
              </div>
              {exportResponse ? (
                <p className="text-sm text-muted-foreground">
                  Export <span className="font-medium">{exportResponse.exportId}</span> queued with status{' '}
                  <Badge className="ml-1" variant="secondary">
                    {exportResponse.status}
                  </Badge>
                  .
                </p>
              ) : null}
              <Button className="w-full" disabled={exportMutation.isLoading} type="submit">
                {exportMutation.isLoading ? 'Requesting…' : 'Request export'}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="space-y-1">
            <CardTitle>Request erasure</CardTitle>
            <CardDescription>Submit a GDPR/CCPA erasure request for EventOn records.</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handleDsrSubmit}>
              <div className="space-y-2">
                <Label htmlFor="dsr-subject">Subject identifier</Label>
                <Input
                  id="dsr-subject"
                  value={dsrState.subjectIdentifier}
                  onChange={(event) =>
                    setDsrState((state) => ({
                      ...state,
                      subjectIdentifier: event.target.value,
                    }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dsr-notes">Notes for the privacy team (optional)</Label>
                <Textarea
                  id="dsr-notes"
                  placeholder="Provide any additional context to help us process your request."
                  value={dsrState.notes ?? ''}
                  onChange={(event) =>
                    setDsrState((state) => ({
                      ...state,
                      notes: event.target.value || undefined,
                    }))
                  }
                />
              </div>
              {dsrResponse ? (
                <p className="text-sm text-muted-foreground">
                  Request <span className="font-medium">{dsrResponse.id}</span> captured with status{' '}
                  <DsrStatusBadge status={dsrResponse.status} />.
                </p>
              ) : null}
              <Button className="w-full" disabled={dsrMutation.isLoading} type="submit">
                {dsrMutation.isLoading ? 'Submitting…' : 'Submit request'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      {formError ? <p className="text-sm text-destructive">{formError}</p> : null}
    </section>
  );
}
