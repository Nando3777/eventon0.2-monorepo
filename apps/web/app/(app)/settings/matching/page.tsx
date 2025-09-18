'use client';

import { Button } from '@eventon/ui';
import { useMemo, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SettingsNav } from '@/components/settings-nav';

const defaultWeights = {
  skills: 45,
  experience: 30,
  availability: 15,
  culture: 10,
};

type MatchingWeight = keyof typeof defaultWeights;

export default function MatchingSettingsPage() {
  const [weights, setWeights] = useState(defaultWeights);
  const totalWeight = useMemo(
    () => Object.values(weights).reduce((accumulator, value) => accumulator + Number(value || 0), 0),
    [weights],
  );
  const [message, setMessage] = useState<string | null>(null);

  const handleChange = (key: MatchingWeight, value: number) => {
    setWeights((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    setMessage('Matching configuration saved. The AI ranker will use these weights for the next scoring cycle.');
    setTimeout(() => setMessage(null), 3200);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <h1 className="text-3xl font-semibold tracking-tight">Matching preferences</h1>
        <p className="text-sm text-muted-foreground">
          Control how EventOn ranks talent by adjusting the relative importance of key signals.
        </p>
        <SettingsNav />
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Scoring weights</CardTitle>
          <CardDescription>Distribute 100 points across the factors that matter to your organisation.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            {Object.entries(weights).map(([key, value]) => (
              <div key={key} className="space-y-2">
                <Label className="capitalize" htmlFor={`weight-${key}`}>
                  {key} weight
                </Label>
                <Input
                  id={`weight-${key}`}
                  min={0}
                  max={100}
                  type="number"
                  value={value}
                  onChange={(event) => handleChange(key as MatchingWeight, Number(event.target.value))}
                />
              </div>
            ))}
          </div>
          <p className="text-sm text-muted-foreground">
            Total allocation:{' '}
            <span className={totalWeight === 100 ? 'font-semibold text-emerald-600' : 'font-semibold text-destructive'}>
              {totalWeight}
            </span>
            /100
          </p>
          {message ? <p className="text-sm text-emerald-600">{message}</p> : null}
          <div className="flex flex-wrap gap-3">
            <Button onClick={handleSave} type="button">
              Save changes
            </Button>
            <Button
              onClick={() => setWeights(defaultWeights)}
              type="button"
              variant="outline"
            >
              Reset to defaults
            </Button>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Signal descriptions</CardTitle>
          <CardDescription>Understand how each weight influences the AI rank panel.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="rounded-lg border p-4">
            <h3 className="text-sm font-semibold">Skills</h3>
            <p className="text-sm text-muted-foreground">
              Matches staff profiles and certifications against job requirements, including languages and compliance flags.
            </p>
          </div>
          <div className="rounded-lg border p-4">
            <h3 className="text-sm font-semibold">Experience</h3>
            <p className="text-sm text-muted-foreground">
              Considers shift history, client feedback, and venue familiarity to promote proven collaborators.
            </p>
          </div>
          <div className="rounded-lg border p-4">
            <h3 className="text-sm font-semibold">Availability</h3>
            <p className="text-sm text-muted-foreground">
              Prioritises talent with matching availability windows and minimises scheduling conflicts across jobs.
            </p>
          </div>
          <div className="rounded-lg border p-4">
            <h3 className="text-sm font-semibold">Culture</h3>
            <p className="text-sm text-muted-foreground">
              Weaves in softer signals such as brand affinity, tone of past engagements, and colleague compatibility.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
