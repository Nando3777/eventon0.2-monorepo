import type { Metadata } from 'next';
import { Providers } from './providers';
import './globals.css';
import { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'EventOn Platform',
  description: 'Booking platform for events teams and talent.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans text-foreground antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
