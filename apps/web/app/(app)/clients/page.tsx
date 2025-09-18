import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { demoClients } from '@/lib/mock-data';

export default function ClientsPage() {
  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">Clients</h1>
        <p className="text-sm text-muted-foreground">
          A snapshot of the agencies and brands collaborating with your staffing team.
        </p>
      </header>
      <Card>
        <CardHeader>
          <CardTitle>Relationships</CardTitle>
          <CardDescription>Stay ahead of renewals and deliver excellence to priority accounts.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-border text-sm">
              <thead>
                <tr className="text-left">
                  <th className="py-3 font-medium">Client</th>
                  <th className="py-3 font-medium">Location</th>
                  <th className="py-3 font-medium">Status</th>
                  <th className="py-3 font-medium">Active projects</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {demoClients.map((client) => (
                  <tr key={client.id}>
                    <td className="py-3 font-medium">{client.name}</td>
                    <td className="py-3 text-muted-foreground">{client.location}</td>
                    <td className="py-3">
                      <Badge variant={client.status === 'ACTIVE' ? 'success' : 'secondary'}>{client.status}</Badge>
                    </td>
                    <td className="py-3 text-muted-foreground">{client.activeProjects}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
