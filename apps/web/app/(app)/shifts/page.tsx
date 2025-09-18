import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { demoJobs, demoShifts } from '@/lib/mock-data';

export default function ShiftsPage() {
  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">Shifts</h1>
        <p className="text-sm text-muted-foreground">
          Stay across confirmed assignments and requests waiting for action.
        </p>
      </header>
      <Card>
        <CardHeader>
          <CardTitle>Upcoming schedule</CardTitle>
          <CardDescription>Reach out to your coordinator if anything changes.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {demoShifts.map((shift) => {
            const job = demoJobs.find((item) => item.id === shift.jobId);
            return (
              <div key={shift.id} className="flex flex-col gap-3 rounded-lg border bg-card px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-medium">{shift.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(shift.date).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })} ·{' '}
                    {shift.location}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {job ? `${job.client} · ${job.title}` : 'Independent shift'}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant={shift.status === 'OPEN' ? 'destructive' : 'secondary'}>{shift.status.replaceAll('_', ' ')}</Badge>
                  <Badge variant={shift.assignments === 'CONFIRMED' ? 'success' : 'outline'}>
                    {shift.assignments.toLowerCase()}
                  </Badge>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}
