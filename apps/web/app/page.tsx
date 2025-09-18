import Link from 'next/link';
import { Button } from '@eventon/ui';

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-gradient-to-b from-background to-muted px-4">
      <h1 className="text-4xl font-bold sm:text-5xl">Welcome to EventOn</h1>
      <p className="max-w-xl text-center text-muted-foreground">
        EventOn helps event professionals match the right teams to unforgettable experiences. This
        monorepo is powered by Turborepo, PNPM, and a modern TypeScript stack.
      </p>
      <div className="flex gap-3">
        <Button asChild>
          <Link href="/app">Enter app</Link>
        </Button>
        <Button variant="secondary" asChild>
          <Link href="/docs">View docs</Link>
        </Button>
      </div>
    </main>
  );
}
