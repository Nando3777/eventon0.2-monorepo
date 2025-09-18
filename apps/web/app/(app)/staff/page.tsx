import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { demoStaff } from '@/lib/mock-data';

export default function StaffPage() {
  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">Staff roster</h1>
        <p className="text-sm text-muted-foreground">
          Track skill coverage and proactively invite top-rated team members to new shifts.
        </p>
      </header>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {demoStaff.map((member) => (
          <Card key={member.id} className="flex flex-col justify-between">
            <CardHeader>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <CardTitle className="text-xl">{member.name}</CardTitle>
                  <CardDescription>{member.role}</CardDescription>
                </div>
                <Badge variant={member.status === 'ACTIVE' ? 'success' : 'secondary'}>{member.status}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Assignments (90 days)</span>
                <span className="font-medium">{member.recentAssignments}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Rating</span>
                <span className="font-medium">{member.rating.toFixed(1)}</span>
              </div>
              <div className="space-y-1">
                <p className="text-xs uppercase text-muted-foreground">Top skills</p>
                <div className="flex flex-wrap gap-2">
                  {member.skills.map((skill) => (
                    <Badge key={skill} variant="outline">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
              <button className="text-sm font-medium text-primary underline-offset-4 hover:underline" type="button">
                Invite to shift
              </button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
