import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { useStudent } from '@/contexts/StudentContext';

export const Consent: React.FC = () => {
  const { consent, setConsent } = useStudent();

  return (
    <DashboardLayout title="Consent & Sensitive Attributes">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="gov-card">
          <CardHeader>
            <CardTitle>Consent</CardTitle>
            <CardDescription>Control how your sensitive info is used</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Allow processing of sensitive attributes</Label>
              <Switch checked={consent.shareSensitive} onCheckedChange={(v) => setConsent({ shareSensitive: v })} />
            </div>
            <p className="text-xs text-muted-foreground">We use this information only for fair allocation in compliance with policy guidelines.</p>
          </CardContent>
        </Card>

        <Card className="gov-card">
          <CardHeader>
            <CardTitle>Attributes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>From rural/aspirational district</Label>
              <Switch checked={consent.rural} onCheckedChange={(v) => setConsent({ rural: v })} />
            </div>
            <div>
              <Label>Social Category</Label>
              <Select value={consent.category || undefined} onValueChange={(v) => setConsent({ category: v as any })}>
                <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="SC">SC</SelectItem>
                  <SelectItem value="ST">ST</SelectItem>
                  <SelectItem value="OBC">OBC</SelectItem>
                  <SelectItem value="EWS">EWS</SelectItem>
                  <SelectItem value="General">General</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between">
              <Label>Person with Disability</Label>
              <Switch checked={consent.disability} onCheckedChange={(v) => setConsent({ disability: v })} />
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Consent;