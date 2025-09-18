import type { ReactNode } from 'react';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-muted to-background px-4 py-12">
      <div className="w-full max-w-lg space-y-8">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">EventOn Platform</h1>
          <p className="text-sm text-muted-foreground">
            Sign in to orchestrate staffing, match teams, and keep your events running smoothly.
          </p>
        </div>
        {children}
      </div>
    </div>
  );
}
