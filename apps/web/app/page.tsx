import Link from 'next/link';
import { Button } from '@eventon/ui';

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 bg-gradient-to-b from-background to-muted px-4 text-center">
      <div className="space-y-4">
        <p className="text-sm font-semibold uppercase tracking-wide text-primary">EventOn platform</p>
        <h1 className="text-4xl font-bold sm:text-5xl">Orchestrate unforgettable events</h1>
        <p className="mx-auto max-w-2xl text-muted-foreground">
          A unified workspace for employers, admins, and staff to manage jobs, shifts, privacy, and AI-assisted matching.
          Sign in to explore the dashboard or create a new organisation to get started.
        </p>
      </div>
      <div className="flex flex-col gap-3 sm:flex-row">
        <Button asChild size="lg">
          <Link href="/login">Sign in</Link>
        </Button>
        <Button asChild size="lg" variant="outline">
          <Link href="/register">Request access</Link>
        </Button>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground">
        <Link className="underline-offset-4 hover:underline" href="/legal/terms">
          Terms
        </Link>
        <Link className="underline-offset-4 hover:underline" href="/legal/privacy">
          Privacy
        </Link>
        <Link className="underline-offset-4 hover:underline" href="/privacy">
          Privacy center
        </Link>
      </div>
    </main>
  );
}
