import React, { useMemo, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { LOCATIONS, SECTORS } from '@/lib/skills';
import { useStudent } from '@/contexts/StudentContext';

export const Preferences: React.FC = () => {
  const { preferences, setPreferences } = useStudent();
  const [locInput, setLocInput] = useState('');
  const [sectorInput, setSectorInput] = useState('');

  const locSuggestions = useMemo(() => LOCATIONS.filter(l => l.toLowerCase().includes(locInput.toLowerCase())), [locInput]);
  const sectorSuggestions = useMemo(() => SECTORS.filter(s => s.toLowerCase().includes(sectorInput.toLowerCase())), [sectorInput]);

  const addLocation = (l: string) => {
    if (preferences.locations.includes(l)) return;
    setPreferences({ locations: [...preferences.locations, l] });
    setLocInput('');
  };

  const removeLocation = (l: string) => setPreferences({ locations: preferences.locations.filter(x => x !== l) });
  const addSector = (s: string) => {
    if (preferences.sectors.includes(s)) return;
    setPreferences({ sectors: [...preferences.sectors, s] });
    setSectorInput('');
  };
  const removeSector = (s: string) => setPreferences({ sectors: preferences.sectors.filter(x => x !== s) });

  return (
    <DashboardLayout title="Preferences">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="gov-card">
          <CardHeader>
            <CardTitle>Location & Sector</CardTitle>
            <CardDescription>Help us prioritize opportunities</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label>Preferred Locations</Label>
              <div className="flex flex-wrap gap-2 my-2">
                {preferences.locations.map(l => (
                  <span key={l} className="px-2 py-1 bg-muted rounded cursor-pointer" onClick={() => removeLocation(l)}>{l} ✕</span>
                ))}
              </div>
              <Input placeholder="Search locations..." value={locInput} onChange={e => setLocInput(e.target.value)} />
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                {locSuggestions.map(l => (
                  <Button key={l} variant="outline" size="sm" onClick={() => addLocation(l)}>+ {l}</Button>
                ))}
              </div>
            </div>

            <div>
              <Label>Preferred Sectors</Label>
              <div className="flex flex-wrap gap-2 my-2">
                {preferences.sectors.map(s => (
                  <span key={s} className="px-2 py-1 bg-muted rounded cursor-pointer" onClick={() => removeSector(s)}>{s} ✕</span>
                ))}
              </div>
              <Input placeholder="Search sectors..." value={sectorInput} onChange={e => setSectorInput(e.target.value)} />
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                {sectorSuggestions.map(s => (
                  <Button key={s} variant="outline" size="sm" onClick={() => addSector(s)}>+ {s}</Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="gov-card">
          <CardHeader>
            <CardTitle>Other Preferences</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Modality</Label>
              <Select value={preferences.modality} onValueChange={(v) => setPreferences({ modality: v as any })}>
                <SelectTrigger><SelectValue placeholder="Select modality" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any</SelectItem>
                  <SelectItem value="remote">Remote</SelectItem>
                  <SelectItem value="onsite">Onsite</SelectItem>
                  <SelectItem value="hybrid">Hybrid</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="minStipend">Minimum Stipend (₹)</Label>
              <Input id="minStipend" type="number" value={preferences.minStipend || 0} onChange={(e) => setPreferences({ minStipend: Number(e.target.value) })} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Available From</Label>
                <Input type="date" onChange={(e) => setPreferences({ availabilityStart: e.target.value })} />
              </div>
              <div>
                <Label>Available Until</Label>
                <Input type="date" onChange={(e) => setPreferences({ availabilityEnd: e.target.value })} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Preferences;