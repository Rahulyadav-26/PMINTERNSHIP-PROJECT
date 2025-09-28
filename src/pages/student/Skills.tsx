import React, { useMemo, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SKILLS } from '@/lib/skills';
import { useStudent } from '@/contexts/StudentContext';

export const Skills: React.FC = () => {
  const { profile, addSkill, removeSkill } = useStudent();
  const [query, setQuery] = useState('');

  const suggestions = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return SKILLS.slice(0, 20);
    return SKILLS.filter(s => s.toLowerCase().includes(q)).slice(0, 20);
  }, [query]);

  return (
    <DashboardLayout title="Skills">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="gov-card">
          <CardHeader>
            <CardTitle>Your Skills</CardTitle>
            <CardDescription>These are used to find better matches</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2 mb-4">
              {profile?.skills?.length ? profile.skills.map((skill) => (
                <Badge key={skill} className="gov-badge-primary cursor-pointer" onClick={() => removeSkill(skill)}>
                  {skill} ✕
                </Badge>
              )) : <p className="text-sm text-muted-foreground">No skills added yet</p>}
            </div>

            <div className="space-y-2">
              <Input placeholder="Type to search skills..." value={query} onChange={(e) => setQuery(e.target.value)} />
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-72 overflow-auto">
                {suggestions.map(s => (
                  <Button key={s} variant="outline" size="sm" className="justify-start" onClick={() => addSkill(s)}>
                    + {s}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="gov-card">
          <CardHeader>
            <CardTitle>Tips</CardTitle>
            <CardDescription>Focus on skills you can demonstrate</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-2">
              <li>Add at least 5-8 relevant skills</li>
              <li>Remove skills you can't confidently use</li>
              <li>Upload your resume to auto-extract skills</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Skills;