import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { demoShifts, getJobById } from '@/lib/mock-data';

type JobDetailPageProps = {
  params: {
    id: string;
  };
};

export default function JobDetailPage({ params }: JobDetailPageProps) {
  const job = getJobById(params.id);
  if (!job) {
    notFound();
  }

  const relatedShifts = demoShifts.filter((shift) => shift.jobId === job.id);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">{job.title}</h1>
          <p className="text-sm text-muted-foreground">
            {job.client} · {job.location}
          </p>
        </div>
        <Badge variant="secondary">{job.status.replaceAll('_', ' ')}</Badge>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Brief</CardTitle>
          <CardDescription>Summary and budget visibility</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm leading-relaxed text-muted-foreground">{job.summary}</p>
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <p className="text-xs uppercase text-muted-foreground">Kick-off</p>
              <p className="text-sm font-medium">{new Date(job.startDate).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-xs uppercase text-muted-foreground">Budget</p>
              <p className="text-sm font-medium">{job.budget}</p>
            </div>
            <div>
              <p className="text-xs uppercase text-muted-foreground">AI match score</p>
              <Badge variant="outline">{job.aiMatchScore}%</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>AI ranking insights</CardTitle>
          <CardDescription>
            Talent surfaced automatically using EventOn matching signals. Invite them or adjust weights in settings.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {job.aiRankings.map((candidate) => (
            <div key={candidate.name} className="rounded-lg border p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold">{candidate.name}</p>
                  <p className="text-xs text-muted-foreground">{candidate.role}</p>
                </div>
                <Badge variant="success">Score {candidate.score}</Badge>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">{candidate.notes}</p>
            </div>
          ))}
          <Link className="text-sm font-medium text-primary underline-offset-4 hover:underline" href="/settings/matching">
            Tune AI matching weights
          </Link>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Shift schedule</CardTitle>
          <CardDescription>Operational milestones linked to this job</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {relatedShifts.length ? (
            relatedShifts.map((shift) => (
              <div key={shift.id} className="flex flex-col gap-2 rounded-lg border bg-card px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-medium">{shift.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(shift.date).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })} ·{' '}
                    {shift.location}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">{shift.status.replaceAll('_', ' ')}</Badge>
                  <Badge variant={shift.assignments === 'CONFIRMED' ? 'success' : 'outline'}>
                    {shift.assignments.toLowerCase()}
                  </Badge>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">No shifts scheduled yet.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
