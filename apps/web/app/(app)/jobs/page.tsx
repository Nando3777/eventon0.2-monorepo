import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { demoJobs } from '@/lib/mock-data';

export default function JobsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Jobs</h1>
          <p className="text-sm text-muted-foreground">Monitor every event brief and drill into AI scoring detail.</p>
        </div>
        <Link className="text-sm font-medium text-primary underline-offset-4 hover:underline" href="/jobs/new">
          Create job (coming soon)
        </Link>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {demoJobs.map((job) => (
          <Card key={job.id} className="flex flex-col justify-between">
            <CardHeader>
              <div className="flex items-start justify-between gap-3">
                <CardTitle className="text-xl">{job.title}</CardTitle>
                <Badge variant={job.status === 'OPEN' ? 'success' : 'secondary'}>{job.status.replaceAll('_', ' ')}</Badge>
              </div>
              <CardDescription>
                {job.client} · {job.location}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">{job.summary}</p>
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">AI match score</span>
                <Badge variant="outline">{job.aiMatchScore}%</Badge>
              </div>
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>Kick-off</span>
                <span>{new Date(job.startDate).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>Budget</span>
                <span>{job.budget}</span>
              </div>
              <Link className="text-sm font-medium text-primary underline-offset-4 hover:underline" href={`/jobs/${job.id}`}>
                View details
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
