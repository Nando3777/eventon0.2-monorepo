import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { demoJobs, demoShifts, demoStaff } from '@/lib/mock-data';

const openJobs = demoJobs.filter((job) => job.status === 'OPEN' || job.status === 'IN_PROGRESS');
const activeShifts = demoShifts.slice(0, 3);
const topTalent = demoStaff.slice(0, 3);

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Good afternoon, team</h1>
        <p className="text-sm text-muted-foreground">Here is what is happening across your EventOn workspace.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Total active jobs</CardTitle>
            <CardDescription>Events currently in planning or delivery</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{openJobs.length}</p>
            <p className="text-xs text-muted-foreground">{demoJobs.length} jobs in the pipeline overall</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Shifts this week</CardTitle>
            <CardDescription>Assignments requiring staffing attention</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{activeShifts.length}</p>
            <p className="text-xs text-muted-foreground">Tap into the AI ranker to fill the final slots</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Engaged talent</CardTitle>
            <CardDescription>Staff with high satisfaction scores</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{topTalent.length}</p>
            <p className="text-xs text-muted-foreground">Maintain personalised comms to keep retention high</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Upcoming shifts</CardTitle>
          <CardDescription>Keep teams aligned across venues and timezones</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {activeShifts.map((shift) => (
            <div key={shift.id} className="flex flex-col gap-2 rounded-lg border bg-card px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-medium">{shift.title}</p>
                <p className="text-xs text-muted-foreground">
                  {new Date(shift.date).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })} · {shift.location}
                </p>
              </div>
              <Badge variant={shift.status === 'OPEN' ? 'destructive' : 'secondary'}>{shift.status.replaceAll('_', ' ')}</Badge>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>AI suggested talent</CardTitle>
          <CardDescription>Top matches ready for deployment to your priority jobs</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          {topTalent.map((member) => (
            <div key={member.id} className="rounded-lg border p-4">
              <div className="flex items-baseline justify-between">
                <p className="text-sm font-semibold">{member.name}</p>
                <span className="text-xs text-muted-foreground">Rating {member.rating.toFixed(1)}</span>
              </div>
              <p className="text-xs text-muted-foreground">{member.role}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {member.skills.map((skill) => (
                  <Badge key={skill} variant="outline">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
