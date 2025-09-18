import { Metadata } from 'next';
import { PrivacyDashboard } from './_components/privacy-dashboard';

export const metadata: Metadata = {
  title: 'Privacy center – EventOn',
};

export default function PrivacyCenterPage() {
  return (
    <main className="mx-auto max-w-5xl space-y-12 px-4 py-16">
      <header className="space-y-3">
        <p className="text-sm font-semibold uppercase tracking-wide text-primary">Privacy controls</p>
        <h1 className="text-4xl font-bold tracking-tight">Manage your data with EventOn</h1>
        <p className="max-w-3xl text-muted-foreground">
          View and update consents, and request data exports or erasure directly from the EventOn privacy center.
          Requests are routed to the privacy team and tracked via the platform API.
        </p>
      </header>
      <PrivacyDashboard />
    </main>
  );
}
