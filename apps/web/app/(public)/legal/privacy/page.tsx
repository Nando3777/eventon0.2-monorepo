import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy Policy – EventOn',
};

export default function PrivacyPolicyPage() {
  return (
    <main className="mx-auto max-w-4xl space-y-12 px-4 py-16">
      <header className="space-y-4">
        <p className="text-sm font-semibold uppercase tracking-wide text-primary">Privacy</p>
        <h1 className="text-4xl font-bold tracking-tight">Privacy Policy</h1>
        <p className="text-muted-foreground">
          EventOn protects the data entrusted to us by employers, staff, and clients. This policy outlines how we
          collect, process, and retain personal information across the platform.
        </p>
      </header>
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">What information we collect</h2>
        <p>
          We collect the details you provide when creating an account, inviting staff, or collaborating with clients.
          This includes contact details, employment preferences, shift history, and compliance documentation required for
          event operations.
        </p>
        <p>
          When you interact with the EventOn platform we may also collect technical metadata such as device type and IP
          address to keep accounts secure and to improve the experience.
        </p>
      </section>
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">How we use data</h2>
        <p>
          Personal information is used to facilitate staffing workflows, match talent to the right opportunities, and
          deliver communication updates. Aggregated data may be used to power analytics and AI ranking features that help
          employers optimise resourcing decisions.
        </p>
        <p>
          We never sell personal data and only share information with processors who support the EventOn service, each
          bound by contractual safeguards.
        </p>
      </section>
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Your rights</h2>
        <p>
          Everyone engaging with EventOn can access, update, export, or request erasure of their data. Visit the{' '}
          <Link className="text-primary underline-offset-4 hover:underline" href="/privacy">
            privacy center
          </Link>{' '}
          to manage consents and submit data subject requests.
        </p>
        <p>
          You can also contact our privacy team directly at{' '}
          <a className="text-primary underline-offset-4 hover:underline" href="mailto:privacy@eventon.test">
            privacy@eventon.test
          </a>{' '}
          for tailored assistance.
        </p>
      </section>
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Retention &amp; security</h2>
        <p>
          EventOn retains information only for as long as it is needed to deliver contracted services or to meet legal
          obligations. We employ encryption in transit and at rest, implement access controls, and continuously monitor
          for anomalous activity.
        </p>
        <p>
          When data is no longer required we delete or anonymise it in line with our data retention schedule.
        </p>
      </section>
      <footer className="border-t pt-6 text-sm text-muted-foreground">
        Last updated: 21 February 2024
      </footer>
    </main>
  );
}
