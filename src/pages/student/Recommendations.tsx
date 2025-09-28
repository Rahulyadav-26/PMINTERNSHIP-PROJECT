import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useStudent } from '@/contexts/StudentContext';

export const Recommendations: React.FC = () => {
  const { profile, preferences, getRecommendations, applyToInternship } = useStudent();
  const recs = getRecommendations(10);

  return (
    <DashboardLayout title="Recommended Internships">
      <div className="space-y-4">
        {recs.map(({ internship, score, explanations }) => (
          <Card key={internship.id} className="gov-card">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>{internship.title}</CardTitle>
                <CardDescription>{internship.organization} • {internship.sector} • {internship.modality}</CardDescription>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">{Math.round(score * 100)}%</div>
                <div className="text-xs text-muted-foreground">Match Score</div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">Locations: {internship.locations.join(', ')}</p>
              <div>
                <p className="text-sm font-medium mb-1">Why this match</p>
                <ul className="list-disc list-inside text-sm text-muted-foreground">
                  {explanations.map((ex, idx) => (
                    <li key={idx}>{ex.reason}</li>
                  ))}
                </ul>
              </div>
              <div className="flex gap-2">
                <Button onClick={() => applyToInternship(internship)}>Apply</Button>
                <Button variant="outline">View Details</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </DashboardLayout>
  );
};

export default Recommendations;