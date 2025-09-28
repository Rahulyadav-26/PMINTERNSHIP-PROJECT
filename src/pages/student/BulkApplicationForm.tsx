import React, { useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { SAMPLE_INTERNSHIPS } from '@/lib/sampleData';
import { useStudent } from '@/contexts/StudentContext';

const schema = z.object({
  coverLetter: z.string().min(50, 'Cover letter must be at least 50 characters').max(2000),
  preferredStart: z.string().min(1, 'Please select a preferred start date'),
});

type FormValues = z.infer<typeof schema>;

export const BulkApplicationForm: React.FC = () => {
  const { state } = useLocation() as { state: { ids: string[] } };
  const navigate = useNavigate();
  const { applyBulk, profile } = useStudent();
  const ids = state?.ids || [];
  const internships = SAMPLE_INTERNSHIPS.filter(i => ids.includes(i.id));

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { coverLetter: '', preferredStart: '' },
  });

  useEffect(() => {
    if (!ids.length) navigate('/dashboard/recommendations');
  }, [ids?.length]);

  const onSubmit = (values: FormValues) => {
    applyBulk(ids, { coverLetter: values.coverLetter, preferredStart: values.preferredStart });
    navigate('/dashboard/applications');
  };

  return (
    <DashboardLayout title="Bulk Apply">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="gov-card lg:col-span-2">
          <CardHeader>
            <CardTitle>Apply to {ids.length} opportunities</CardTitle>
            <CardDescription>We will submit the same cover letter and start date to all selected opportunities.</CardDescription>
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
                      <FormDescription>Min 50 characters. We recommend referencing common themes across these roles.</FormDescription>
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

                <div className="flex gap-2">
                  <Button type="submit">Submit {ids.length} Applications</Button>
                  <Link to="/dashboard/resume"><Button type="button" variant="ghost">Manage Resume {profile?.resumeName ? `(${profile.resumeName})` : ''}</Button></Link>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>

        <Card className="gov-card">
          <CardHeader>
            <CardTitle>Selected Opportunities</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            {internships.map(i => (
              <div key={i.id} className="border-b pb-2">
                <div className="font-medium">{i.title}</div>
                <div className="text-muted-foreground">{i.organization} • {i.modality} • {i.locations.join(', ')}</div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default BulkApplicationForm;
