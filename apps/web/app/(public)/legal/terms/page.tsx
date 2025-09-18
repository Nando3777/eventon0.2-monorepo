import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service – EventOn',
};

export default function TermsPage() {
  return (
    <main className="mx-auto max-w-4xl space-y-12 px-4 py-16">
      <header className="space-y-4">
        <p className="text-sm font-semibold uppercase tracking-wide text-primary">Legal</p>
        <h1 className="text-4xl font-bold tracking-tight">Terms of Service</h1>
        <p className="text-muted-foreground">
          These terms explain your responsibilities when using EventOn as an employer, administrator, or member of staff.
        </p>
      </header>
      <section className="space-y-3">
        <h2 className="text-2xl font-semibold">1. Using EventOn</h2>
        <p>
          By creating an account you confirm that you have authority to represent your organisation and that you will use
          the platform for lawful event staffing purposes. Administrators must ensure staff data shared within EventOn is
          accurate and up to date.
        </p>
      </section>
      <section className="space-y-3">
        <h2 className="text-2xl font-semibold">2. Accounts &amp; access</h2>
        <p>
          You are responsible for maintaining the confidentiality of login credentials. Notify EventOn immediately if you
          suspect unauthorised access. We may suspend accounts that breach policy or to protect the security of the
          service.
        </p>
      </section>
      <section className="space-y-3">
        <h2 className="text-2xl font-semibold">3. Data protection</h2>
        <p>
          EventOn processes personal information to deliver contracted services. Your use of the platform must comply with
          applicable privacy laws and your own agreements with staff and clients.
        </p>
      </section>
      <section className="space-y-3">
        <h2 className="text-2xl font-semibold">4. Availability</h2>
        <p>
          We aim to keep EventOn available 24/7 but may perform scheduled maintenance or take urgent action to protect the
          platform. We are not responsible for downtime caused by factors outside of our control.
        </p>
      </section>
      <section className="space-y-3">
        <h2 className="text-2xl font-semibold">5. Contact</h2>
        <p>
          Questions about these terms? Email us at{' '}
          <a className="text-primary underline-offset-4 hover:underline" href="mailto:legal@eventon.test">
            legal@eventon.test
          </a>
          .
        </p>
      </section>
      <footer className="border-t pt-6 text-sm text-muted-foreground">Effective from 21 February 2024</footer>
    </main>
  );
}
