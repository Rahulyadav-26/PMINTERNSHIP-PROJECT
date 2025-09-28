import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useStudent } from '@/contexts/StudentContext';
import { SAMPLE_INTERNSHIPS } from '@/lib/sampleData';

export const Applications: React.FC = () => {
  const { applications, withdrawApplication, simulateOffer } = useStudent();

  const byId = Object.fromEntries(SAMPLE_INTERNSHIPS.map(i => [i.id, i]));

  return (
    <DashboardLayout title="Applications">
      <div className="space-y-4">
        {!applications.length && (
          <p className="text-sm text-muted-foreground">No applications yet. Go to Recommendations to apply.</p>
        )}
        {applications.map(app => {
          const internship = byId[app.internshipId];
          return (
            <Card key={app.id} className="gov-card">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>{internship?.title || app.internshipId}</CardTitle>
                  <CardDescription>{internship?.organization} • Status: {app.status}</CardDescription>
                </div>
                <div className="text-right text-xs text-muted-foreground">
                  <div>Applied: {new Date(app.createdAt).toLocaleString()}</div>
                </div>
              </CardHeader>
              <CardContent className="flex gap-2">
                {app.status === 'applied' && (
                  <Button variant="outline" onClick={() => withdrawApplication(app.id)}>Withdraw</Button>
                )}
                {app.status === 'applied' && (
                  <Button variant="outline" onClick={() => simulateOffer(app.id)}>Simulate Offer</Button>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </DashboardLayout>
  );
};

export default Applications;