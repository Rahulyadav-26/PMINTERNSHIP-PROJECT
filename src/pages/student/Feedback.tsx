import React, { useMemo, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useStudent } from '@/contexts/StudentContext';
import { SAMPLE_INTERNSHIPS } from '@/lib/sampleData';
import { Star } from 'lucide-react';
import { toast } from '@/components/ui/sonner';

const Stars: React.FC<{ rating: number }> = ({ rating }) => (
  <div className="flex items-center gap-1">
    {[1,2,3,4,5].map(i => (
      <Star key={i} className={i <= rating ? 'h-4 w-4 text-yellow-500 fill-yellow-500' : 'h-4 w-4 text-muted-foreground'} />
    ))}
  </div>
);

export const Feedback: React.FC = () => {
  const { applications, feedbacks, submitFeedback } = useStudent();
  const [appId, setAppId] = useState<string>('');
  const [rating, setRating] = useState<string>('5');
  const [comment, setComment] = useState<string>('');

  const byId = useMemo(() => Object.fromEntries(SAMPLE_INTERNSHIPS.map(i => [i.id, i])), []);

  const selectedApp = useMemo(() => applications.find(a => a.id === appId), [applications, appId]);
  const selectedInternship = selectedApp ? byId[selectedApp.internshipId] : undefined;

  const onSubmit = () => {
    if (!selectedApp) {
      toast('Select an application', { description: 'Please choose an application to attach your feedback.' });
      return;
    }
    const r = parseInt(rating, 10);
    if (!(r >= 1 && r <= 5)) {
      toast('Invalid rating', { description: 'Please pick a rating between 1 and 5.' });
      return;
    }
    submitFeedback(selectedApp.id, selectedApp.internshipId, r, comment?.trim() || undefined);
    toast('Feedback submitted', { description: selectedInternship ? selectedInternship.title : 'Thank you!' });
    setComment('');
    setRating('5');
  };

  return (
    <DashboardLayout title="Feedback">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Submit feedback */}
        <Card className="gov-card lg:col-span-2">
          <CardHeader>
            <CardTitle>Share Your Feedback</CardTitle>
            <CardDescription>Help improve fair matching and the internship experience</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="mb-2 block">Select Application</Label>
                <Select value={appId} onValueChange={setAppId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose an application" />
                  </SelectTrigger>
                  <SelectContent>
                    {applications.map(app => {
                      const i = byId[app.internshipId];
                      return (
                        <SelectItem key={app.id} value={app.id}>
                          {i ? `${i.title} • ${i.organization}` : app.internshipId} — {app.status}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="mb-2 block">Rating</Label>
                <RadioGroup className="flex gap-4" value={rating} onValueChange={setRating}>
                  {[1,2,3,4,5].map(v => (
                    <div key={v} className="flex items-center gap-2">
                      <RadioGroupItem id={`r-${v}`} value={`${v}`} />
                      <Label htmlFor={`r-${v}`} className="cursor-pointer flex items-center gap-1">
                        {v}
                        <Stars rating={v} />
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            </div>
            <div>
              <Label className="mb-2 block">Comments (optional)</Label>
              <Textarea rows={5} placeholder="Share details about your experience, selection process, or suggestions..." value={comment} onChange={e => setComment(e.target.value)} />
            </div>
            <div className="flex gap-2">
              <Button onClick={onSubmit}>Submit Feedback</Button>
              <Button variant="outline" onClick={() => { setComment(''); setRating('5'); }}>Reset</Button>
            </div>
          </CardContent>
        </Card>

        {/* Past feedback */}
        <Card className="gov-card">
          <CardHeader>
            <CardTitle>Your Feedback</CardTitle>
            <CardDescription>Previously submitted entries</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            {!(feedbacks && feedbacks.length) && (
              <div className="text-muted-foreground">No feedback yet. Submit your first feedback using the form.</div>
            )}
            {(feedbacks || []).map(fb => {
              const i = byId[fb.internshipId];
              return (
                <div key={fb.id} className="p-3 border rounded">
                  <div className="flex items-center justify-between">
                    <div className="font-medium">{i ? i.title : fb.internshipId}</div>
                    <Stars rating={fb.rating} />
                  </div>
                  <div className="text-xs text-muted-foreground">{i?.organization} • {new Date(fb.createdAt).toLocaleString()}</div>
                  {fb.comment && <div className="mt-2">{fb.comment}</div>}
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Feedback;
