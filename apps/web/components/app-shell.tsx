'use client';

import { Button, cn } from '@eventon/ui';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getHealth } from '@/lib/api-client';

interface NavigationItem {
  title: string;
  href: string;
  description?: string;
}

const employerNavigation: NavigationItem[] = [
  { title: 'Dashboard', href: '/dashboard', description: 'Insights and activity overview' },
  { title: 'Jobs', href: '/jobs', description: 'Manage open roles and events' },
  { title: 'Staff', href: '/staff', description: 'Talent roster and availability' },
  { title: 'Clients', href: '/clients', description: 'Agency and brand partners' },
  { title: 'Matching settings', href: '/settings/matching' },
  { title: 'Privacy settings', href: '/settings/privacy' },
];

const staffNavigation: NavigationItem[] = [
  { title: 'My profile', href: '/me', description: 'Update your skills and documents' },
  { title: 'Availability', href: '/availability', description: 'Set when you can work' },
  { title: 'Shifts', href: '/shifts', description: 'Upcoming and past assignments' },
];

function isActive(pathname: string, href: string) {
  if (href === '/') {
    return pathname === href;
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

function DesktopSidebar({ pathname }: { pathname: string }) {
  return (
    <aside className="hidden w-72 flex-none border-r bg-background px-6 py-8 lg:flex lg:flex-col lg:gap-8">
      <div className="space-y-1">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Employer</p>
        <nav className="space-y-1">
          {employerNavigation.map((item) => (
            <Link
              key={item.href}
              className={cn(
                'block rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground',
                isActive(pathname, item.href) ? 'bg-primary/10 text-primary' : 'text-muted-foreground',
              )}
              href={item.href}
            >
              <div className="font-medium">{item.title}</div>
              {item.description ? <p className="text-xs text-muted-foreground">{item.description}</p> : null}
            </Link>
          ))}
        </nav>
      </div>
      <div className="space-y-1">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Staff</p>
        <nav className="space-y-1">
          {staffNavigation.map((item) => (
            <Link
              key={item.href}
              className={cn(
                'block rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground',
                isActive(pathname, item.href) ? 'bg-primary/10 text-primary' : 'text-muted-foreground',
              )}
              href={item.href}
            >
              <div className="font-medium">{item.title}</div>
              {item.description ? <p className="text-xs text-muted-foreground">{item.description}</p> : null}
            </Link>
          ))}
        </nav>
      </div>
    </aside>
  );
}

function MobileNav({ pathname }: { pathname: string }) {
  const items = useMemo(() => [...employerNavigation, ...staffNavigation], []);
  return (
    <nav className="flex gap-2 overflow-x-auto px-4 py-3 lg:hidden">
      {items.map((item) => (
        <Link
          key={item.href}
          className={cn(
            'flex flex-col rounded-md border px-3 py-2 text-xs font-medium transition-colors',
            isActive(pathname, item.href) ? 'border-primary bg-primary/10 text-primary' : 'border-transparent bg-muted',
          )}
          href={item.href}
        >
          {item.title}
        </Link>
      ))}
    </nav>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const { data: health, isError: healthError } = useQuery({
    queryKey: ['health'],
    queryFn: getHealth,
    refetchInterval: 60000,
    retry: false,
  });

  const healthLabel = healthError ? 'unavailable' : health?.status ?? 'checking…';
  const healthClass = healthError
    ? 'text-destructive'
    : health?.status === 'ok'
      ? 'text-emerald-600'
      : 'text-amber-600';

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl">
        <DesktopSidebar pathname={pathname} />
        <div className="flex min-h-screen flex-1 flex-col">
          <MobileNav pathname={pathname} />
          <header className="flex flex-col gap-3 border-b bg-background px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-lg font-semibold">EventOn workspace</p>
              <p className="text-xs text-muted-foreground">
                Platform health:{' '}
                <span className={cn('font-medium', healthClass)}>{healthLabel}</span>
                {health && !healthError ? (
                  <span className="ml-2 text-muted-foreground">
                    Database {health.database ? 'connected' : 'offline'}
                  </span>
                ) : null}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-medium leading-tight">{session?.user?.name ?? 'Guest user'}</p>
                <p className="text-xs text-muted-foreground">{session?.user?.email ?? 'Not signed in'}</p>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() =>
                  signOut({ callbackUrl: '/login' }).catch((error) => {
                    console.error('Failed to sign out', error);
                  })
                }
              >
                Sign out
              </Button>
            </div>
          </header>
          <main className="flex-1 space-y-6 bg-background px-4 py-8 sm:px-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
