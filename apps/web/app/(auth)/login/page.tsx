'use client';

import { Button } from '@eventon/ui';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { FormEvent, useState } from 'react';
import { z } from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const loginSchema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
});

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') ?? '/dashboard';
  const [error, setError] = useState<string | null>(null);
  const [formState, setFormState] = useState({ email: '', password: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    const parsed = loginSchema.safeParse(formState);
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? 'Invalid credentials');
      return;
    }

    setIsSubmitting(true);
    const result = await signIn('credentials', {
      redirect: false,
      email: parsed.data.email,
      password: parsed.data.password,
      callbackUrl,
    });

    if (result?.error) {
      setError('Unable to sign in with the provided credentials.');
      setIsSubmitting(false);
      return;
    }

    router.push(result?.url ?? callbackUrl);
  };

  return (
    <Card>
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-semibold tracking-tight">Sign in</CardTitle>
        <CardDescription>Use your EventOn credentials to access the employer and staff tools.</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              autoComplete="email"
              id="email"
              name="email"
              onChange={(event) => setFormState((state) => ({ ...state, email: event.target.value }))}
              placeholder="you@example.com"
              type="email"
              value={formState.email}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              autoComplete="current-password"
              id="password"
              name="password"
              onChange={(event) => setFormState((state) => ({ ...state, password: event.target.value }))}
              type="password"
              value={formState.password}
            />
          </div>
          {error ? <p className="text-sm text-destructive">{error}</p> : null}
          <Button className="w-full" disabled={isSubmitting} type="submit">
            {isSubmitting ? 'Signing in…' : 'Continue'}
          </Button>
        </form>
        <p className="mt-6 text-sm text-muted-foreground">
          Need an account?{' '}
          <Link className="font-medium text-primary underline-offset-4 hover:underline" href="/register">
            Create one
          </Link>
          .
        </p>
        <p className="mt-2 text-xs text-muted-foreground">
          By continuing you agree to our{' '}
          <Link className="underline" href="/legal/terms">
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link className="underline" href="/legal/privacy">
            Privacy Policy
          </Link>
          .
        </p>
      </CardContent>
    </Card>
  );
}
