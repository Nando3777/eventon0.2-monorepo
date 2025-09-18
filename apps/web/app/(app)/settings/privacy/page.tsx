'use client';

import { Button } from '@eventon/ui';
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { SettingsNav } from '@/components/settings-nav';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';

export default function PrivacySettingsPage() {
  const [autoDelete, setAutoDelete] = useState(true);
  const [consentReminders, setConsentReminders] = useState(false);
  const [dsrNotes, setDsrNotes] = useState('');
  const [message, setMessage] = useState<string | null>(null);

  const handleSave = () => {
    setMessage('Privacy preferences saved. Team notifications will use these defaults.');
    setTimeout(() => setMessage(null), 3200);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <h1 className="text-3xl font-semibold tracking-tight">Privacy workspace controls</h1>
        <p className="text-sm text-muted-foreground">
          Configure how your organisation responds to privacy requests and manages retention policies.
        </p>
        <SettingsNav />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Automation</CardTitle>
          <CardDescription>Apply default policies for data minimisation and consent hygiene.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-start justify-between gap-4 rounded-lg border bg-card px-4 py-3">
            <div className="space-y-1">
              <Label className="font-medium">Auto-delete inactive staff data</Label>
              <p className="text-sm text-muted-foreground">
                Removes profiles that have been inactive for 24 months while retaining anonymised metrics.
              </p>
            </div>
            <Switch checked={autoDelete} onCheckedChange={setAutoDelete} />
          </div>
          <div className="flex items-start justify-between gap-4 rounded-lg border bg-card px-4 py-3">
            <div className="space-y-1">
              <Label className="font-medium">Send consent renewal reminders</Label>
              <p className="text-sm text-muted-foreground">
                Email staff and clients quarterly to confirm marketing and data processing preferences.
              </p>
            </div>
            <Switch checked={consentReminders} onCheckedChange={setConsentReminders} />
          </div>
          {message ? <p className="text-sm text-emerald-600">{message}</p> : null}
          <Button onClick={handleSave} type="button">
            Save privacy settings
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Data subject request playbook</CardTitle>
          <CardDescription>
            Align your privacy team on messaging and steps when triaging export or erasure requests.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Document the sequence your team follows, SLAs, and escalation contacts."
            value={dsrNotes}
            onChange={(event) => setDsrNotes(event.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            Tip: Combine this with the public privacy center to give data subjects a clear and compliant experience.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
