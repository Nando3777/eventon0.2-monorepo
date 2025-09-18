import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { demoAvailability } from '@/lib/mock-data';

export default function AvailabilityPage() {
  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">Availability planner</h1>
        <p className="text-sm text-muted-foreground">
          Let coordinators know when you are ready to work so AI recommendations stay accurate.
        </p>
      </header>
      <Card>
        <CardHeader>
          <CardTitle>Weekly pattern</CardTitle>
          <CardDescription>Tap each slot in the mobile app to update your live status.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {demoAvailability.map((day) => (
            <div key={day.day} className="rounded-lg border bg-card px-4 py-3">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm font-medium">{day.day}</p>
                <div className="flex flex-wrap gap-2">
                  {day.slots.map((slot) => (
                    <Badge key={slot.label} variant={slot.type === 'AVAILABLE' ? 'success' : 'secondary'}>
                      {slot.label}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
