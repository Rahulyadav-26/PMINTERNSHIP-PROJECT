import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useStudent } from '@/contexts/StudentContext';
import { SAMPLE_INTERNSHIPS } from '@/lib/sampleData';

export const Offers: React.FC = () => {
  const { offers, acceptOffer, declineOffer } = useStudent();
  const byId = Object.fromEntries(SAMPLE_INTERNSHIPS.map(i => [i.id, i]));
  const hasAccepted = offers.some(o => o.status === 'accepted');

  return (
    <DashboardLayout title="Offers">
      <div className="space-y-4">
        {!offers.length && (
          <p className="text-sm text-muted-foreground">No offers yet.</p>
        )}
        {offers.map(offer => {
          const internship = byId[offer.internshipId];
          return (
            <Card key={offer.id} className="gov-card">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>{internship?.title || offer.internshipId}</CardTitle>
                  <CardDescription>{internship?.organization} • Status: {offer.status}</CardDescription>
                </div>
                <div className="text-right text-xs text-muted-foreground">
                  <div>Offered: {new Date(offer.offeredAt).toLocaleString()}</div>
                </div>
              </CardHeader>
              <CardContent className="flex gap-2">
                <Button onClick={() => acceptOffer(offer.applicationId)} disabled={offer.status !== 'offered' || hasAccepted}>Accept</Button>
                <Button variant="outline" onClick={() => declineOffer(offer.applicationId)} disabled={offer.status !== 'offered'}>Decline</Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </DashboardLayout>
  );
};

export default Offers;