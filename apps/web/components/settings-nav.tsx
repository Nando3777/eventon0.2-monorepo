'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@eventon/ui';

const settingsNav = [
  { title: 'Matching', href: '/settings/matching' },
  { title: 'Privacy', href: '/settings/privacy' },
];

export function SettingsNav() {
  const pathname = usePathname();
  return (
    <nav className="flex flex-wrap gap-2">
      {settingsNav.map((item) => (
        <Link
          key={item.href}
          className={cn(
            'rounded-md border px-3 py-1.5 text-sm font-medium transition-colors',
            pathname === item.href ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted-foreground',
          )}
          href={item.href}
        >
          {item.title}
        </Link>
      ))}
    </nav>
  );
}
