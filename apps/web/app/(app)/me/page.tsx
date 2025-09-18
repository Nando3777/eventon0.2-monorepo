'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useSession } from 'next-auth/react';

export default function MePage() {
  const { data: session } = useSession();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">My profile</h1>
        <p className="text-sm text-muted-foreground">
          Review your EventOn identity and share the latest wins with staffing leads.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>{session?.user?.name ?? 'Guest user'}</CardTitle>
          <CardDescription>{session?.user?.email ?? 'Sign in to view your staff profile.'}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-xs uppercase text-muted-foreground">Roles</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {(session?.user as unknown as { roles?: string[] })?.roles?.length ? (
                (session?.user as unknown as { roles?: string[] }).roles!.map((role) => (
                  <Badge key={role} variant="outline">
                    {role}
                  </Badge>
                ))
              ) : (
                <Badge variant="secondary">No roles assigned</Badge>
              )}
            </div>
          </div>
          <div>
            <p className="text-xs uppercase text-muted-foreground">Bio</p>
            <p className="text-sm text-muted-foreground">
              Highlight recent events, specialisms, and achievements so coordinators can match you with the best shifts.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
