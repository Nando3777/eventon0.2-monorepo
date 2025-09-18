'use client';

import { Button } from '@eventon/ui';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useState } from 'react';
import { z } from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { registerOrganisation } from '@/lib/api-client';

const registerSchema = z.object({
  fullName: z.string().min(2, 'Please add your name'),
  email: z.string().email('Enter a valid email'),
  organisationName: z.string().min(2, 'Organisation name is required'),
  description: z.string().max(280).optional(),
  timezone: z.string().min(2, 'Timezone is required'),
});

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')
    .slice(0, 60);
}

export default function RegisterPage() {
  const router = useRouter();
  const [formState, setFormState] = useState({
    fullName: '',
    email: '',
    organisationName: '',
    description: '',
    timezone: 'UTC',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuccessMessage(null);

    const parsed = registerSchema.safeParse(formState);
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? 'Please review the form');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = parsed.data;
      const result = await registerOrganisation({
        name: payload.organisationName,
        slug: slugify(payload.organisationName) || `org-${Date.now()}`,
        description: payload.description?.trim() || undefined,
        timezone: payload.timezone,
        ownerId: payload.email,
      });

      setSuccessMessage(`Organisation ${result.name} created. You can sign in once approved.`);
      setTimeout(() => router.push('/login'), 1200);
    } catch (submissionError) {
      setError('We were unable to submit your request. Please try again shortly.');
      console.error(submissionError);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-semibold tracking-tight">Create an employer account</CardTitle>
        <CardDescription>
          Tell us about your organisation and we will prepare an EventOn workspace for your team.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="fullName">Your name</Label>
            <Input
              id="fullName"
              name="fullName"
              onChange={(event) => setFormState((state) => ({ ...state, fullName: event.target.value }))}
              placeholder="Alex Rivera"
              value={formState.fullName}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Work email</Label>
            <Input
              autoComplete="email"
              id="email"
              name="email"
              onChange={(event) => setFormState((state) => ({ ...state, email: event.target.value }))}
              placeholder="you@agency.com"
              type="email"
              value={formState.email}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="organisationName">Organisation</Label>
            <Input
              id="organisationName"
              name="organisationName"
              onChange={(event) => setFormState((state) => ({ ...state, organisationName: event.target.value }))}
              placeholder="EventOn Agency"
              value={formState.organisationName}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="timezone">Primary timezone</Label>
            <Input
              id="timezone"
              name="timezone"
              onChange={(event) => setFormState((state) => ({ ...state, timezone: event.target.value }))}
              placeholder="UTC"
              value={formState.timezone}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Event focus (optional)</Label>
            <Textarea
              id="description"
              name="description"
              onChange={(event) => setFormState((state) => ({ ...state, description: event.target.value }))}
              placeholder="Tell us about the experiences you create…"
              value={formState.description}
            />
          </div>
          {error ? <p className="text-sm text-destructive">{error}</p> : null}
          {successMessage ? <p className="text-sm text-emerald-600">{successMessage}</p> : null}
          <Button className="w-full" disabled={isSubmitting} type="submit">
            {isSubmitting ? 'Submitting…' : 'Submit application'}
          </Button>
        </form>
        <p className="mt-6 text-sm text-muted-foreground">
          Already onboarded?{' '}
          <Link className="font-medium text-primary underline-offset-4 hover:underline" href="/login">
            Return to sign in
          </Link>
          .
        </p>
      </CardContent>
    </Card>
  );
}
