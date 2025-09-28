import React, { useRef, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useStudent } from '@/contexts/StudentContext';

export const Resume: React.FC = () => {
  const { profile, uploadResume, extractSkillsFromText, addSkill } = useStudent();
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [text, setText] = useState('');
  const [extracted, setExtracted] = useState<string[]>([]);

  const onUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    await uploadResume(f);
  };

  const onExtract = () => {
    const found = extractSkillsFromText(text);
    setExtracted(found);
  };

  const addAll = () => {
    extracted.forEach(s => addSkill(s));
    setExtracted([]);
    setText('');
  };

  return (
    <DashboardLayout title="Resume & Extraction">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="gov-card">
          <CardHeader>
            <CardTitle>Upload Resume</CardTitle>
            <CardDescription>PDF/DOC accepted (preview link shown)</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input type="file" accept="application/pdf,.pdf,.doc,.docx" ref={fileRef} onChange={onUpload} />
            {profile?.resumeUrl && (
              <div className="space-y-2">
                <p className="text-sm">Uploaded: {profile.resumeName}</p>
                <a href={profile.resumeUrl} target="_blank" className="text-primary underline">Open Resume</a>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="gov-card">
          <CardHeader>
            <CardTitle>Extract Skills from Text</CardTitle>
            <CardDescription>Paste your resume text; we will detect known skills</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Textarea placeholder="Paste resume text here..." value={text} onChange={e => setText(e.target.value)} rows={10} />
            <div className="flex gap-2">
              <Button onClick={onExtract}>Extract</Button>
              <Button variant="outline" onClick={addAll} disabled={!extracted.length}>Add All</Button>
            </div>
            {!!extracted.length && (
              <div className="text-sm">
                <p className="mb-2 text-muted-foreground">Detected Skills:</p>
                <div className="flex flex-wrap gap-2">
                  {extracted.map(s => (
                    <span key={s} className="px-2 py-1 bg-muted rounded">{s}</span>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Resume;