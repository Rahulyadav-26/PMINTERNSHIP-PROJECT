import React, { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { SAMPLE_INTERNSHIPS } from '@/lib/sampleData';
import { useStudent } from '@/contexts/StudentContext';
import { formatRemaining } from '@/lib/utils';

const schema = z.object({
  coverLetter: z.string().min(50, 'Cover letter must be at least 50 characters').max(2000, 'Keep it under 2000 characters'),
  preferredStart: z.string().min(1, 'Please select a preferred start date'),
  confirmedSkills: z.array(z.string()).default([]),
});

type FormValues = z.infer<typeof schema>;

export const ApplicationForm: React.FC = () => {
  const { internshipId } = useParams();
  const navigate = useNavigate();
  const { applyToInternship, loadDraft, saveDraft, profile } = useStudent();
  const internship = SAMPLE_INTERNSHIPS.find(i => i.id === internshipId);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      coverLetter: '',
      preferredStart: '',
      confirmedSkills: [],
    },
  });

  // load draft if present
  useEffect(() => {
    if (!internshipId) return;
    const draft = loadDraft(internshipId);
    if (draft) {
      form.reset({
        coverLetter: draft.coverLetter || '',
        preferredStart: draft.preferredStart || '',
        confirmedSkills: [],
      });
    }
  }, [internshipId]);

  // autosave
  useEffect(() => {
    const sub = form.watch((values) => {
      if (internshipId) {
        saveDraft(internshipId, { coverLetter: values.coverLetter || '', preferredStart: values.preferredStart || '' });
      }
    });
    return () => sub.unsubscribe();
  }, [form.watch, internshipId]);

  if (!internship) {
    return (
      <DashboardLayout title="Application">
        <Card className="gov-card"><CardContent className="p-6">Invalid internship.</CardContent></Card>
      </DashboardLayout>
    );
  }

  const required = internship.requiredSkills || [];

  const onSubmit = (values: FormValues) => {
    // Validate that all required skills are confirmed
    const missing = required.filter(s => !values.confirmedSkills.includes(s));
    if (missing.length) {
      form.setError('confirmedSkills', { type: 'manual', message: `Confirm required skills: ${missing.join(', ')}` });
      return;
    }
    applyToInternship(internship, { coverLetter: values.coverLetter, preferredStart: values.preferredStart });
    navigate('/dashboard/applications');
  };

  return (
    <DashboardLayout title="Application">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="gov-card lg:col-span-2">
          <CardHeader>
            <CardTitle>Apply to {internship.title}</CardTitle>
            <CardDescription>{internship.organization} • Deadline: {formatRemaining(internship.applicationDeadline)}</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
                <FormField
                  control={form.control}
                  name="coverLetter"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cover Letter</FormLabel>
                      <FormControl>
                        <Textarea rows={6} placeholder="Write a brief cover letter..." {...field} />
                      </FormControl>
                      <FormDescription>Min 50 characters. Tailor to {internship.title}.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="preferredStart"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Preferred Start Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {required.length > 0 && (
                  <FormItem>
                    <FormLabel>Confirm Required Skills</FormLabel>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                      {required.map((s) => (
                        <FormField
                          key={s}
                          control={form.control}
                          name="confirmedSkills"
                          render={({ field }) => {
                            const checked = field.value?.includes(s);
                            return (
                              <div className="flex items-center space-x-2">
                                <Checkbox
                                  checked={checked}
                                  onCheckedChange={(v) => {
                                    const next = new Set(field.value || []);
                                    if (v) next.add(s); else next.delete(s);
                                    field.onChange(Array.from(next));
                                  }}
                                />
                                <label className="text-sm">I have {s}</label>
                              </div>
                            );
                          }}
                        />
                      ))}
                    </div>
                    <FormDescription>All required skills must be confirmed.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}

                <div className="flex gap-2">
                  <Button type="submit">Submit Application</Button>
                  <Button type="button" variant="outline" onClick={() => internshipId && saveDraft(internshipId, { coverLetter: form.getValues('coverLetter') || '', preferredStart: form.getValues('preferredStart') || '' })}>Save Draft</Button>
                  <Link to="/dashboard/resume"><Button type="button" variant="ghost">Manage Resume {profile?.resumeName ? `(${profile.resumeName})` : ''}</Button></Link>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>

        <Card className="gov-card">
          <CardHeader>
            <CardTitle>Opportunity Summary</CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-2">
            <div><span className="font-medium">Title:</span> {internship.title}</div>
            <div><span className="font-medium">Organization:</span> {internship.organization}</div>
            <div><span className="font-medium">Locations:</span> {internship.locations.join(', ')}</div>
            <div><span className="font-medium">Modality:</span> {internship.modality}</div>
            <div><span className="font-medium">Required:</span> {internship.requiredSkills.join(', ')}</div>
            <div><span className="font-medium">Preferred:</span> {internship.preferredSkills.join(', ')}</div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default ApplicationForm;
