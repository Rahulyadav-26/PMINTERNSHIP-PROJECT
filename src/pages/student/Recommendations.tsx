import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useStudent } from '@/contexts/StudentContext';
import { Checkbox } from '@/components/ui/checkbox';
import { formatRemaining } from '@/lib/utils';

export const Recommendations: React.FC = () => {
  const navigate = useNavigate();
  const { getRecommendations, applyToInternship } = useStudent();
  const recs = getRecommendations(10);
  const [selected, setSelected] = useState<Record<string, boolean>>({});

  const selectedIds = useMemo(() => Object.keys(selected).filter(k => selected[k]), [selected]);

  return (
    <DashboardLayout title="Recommended Internships">
      <div className="space-y-4">
        {!!selectedIds.length && (
          <div className="flex items-center justify-between p-3 border rounded bg-muted/30">
            <div className="text-sm">Selected {selectedIds.length} opportunities</div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setSelected({})}>Clear</Button>
              <Button onClick={() => navigate('/dashboard/apply/bulk', { state: { ids: selectedIds } })}>Bulk Apply</Button>
            </div>
          </div>
        )}
        {recs.map(({ internship, score, explanations }) => (
          <Card key={internship.id} className="gov-card">
            <CardHeader className="flex flex-row items-center justify-between">
              <div className="flex items-start gap-3">
                <Checkbox
                  checked={!!selected[internship.id]}
                  onCheckedChange={(v) => setSelected(s => ({ ...s, [internship.id]: !!v }))}
                />
                <div>
                  <CardTitle>{internship.title}</CardTitle>
                  <CardDescription>{internship.organization} • {internship.sector} • {internship.modality}</CardDescription>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">{Math.round(score * 100)}%</div>
                <div className="text-xs text-muted-foreground">Match Score</div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">Locations: {internship.locations.join(', ')}{internship.applicationDeadline ? ` • Deadline: ${formatRemaining(internship.applicationDeadline)}` : ''}</p>
              <div>
                <p className="text-sm font-medium mb-1">Why this match</p>
                <ul className="list-disc list-inside text-sm text-muted-foreground">
                  {explanations.map((ex, idx) => (
                    <li key={idx}>{ex.reason}</li>
                  ))}
                </ul>
              </div>
              <div className="flex gap-2">
                <Button onClick={() => navigate(`/dashboard/apply/${internship.id}`)}>Apply</Button>
                <Button variant="outline" onClick={() => applyToInternship(internship)}>Quick Apply</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </DashboardLayout>
  );
};

export default Recommendations;
