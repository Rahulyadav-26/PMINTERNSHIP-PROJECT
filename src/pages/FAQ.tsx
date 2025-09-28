import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Link } from 'react-router-dom';
import { Bell, ClipboardList, Clock, FileText, GraduationCap, Scale, Shield, Users, Building2, Rocket } from 'lucide-react';
import aiImg from '@/assets/ai-allocation.jpg';

const Pill: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span className="inline-flex items-center px-2 py-1 text-xs rounded-full bg-secondary/10 text-secondary border border-secondary/20">{children}</span>
);

const FAQ: React.FC = () => {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 gov-gradient opacity-20" />
        <div className="container mx-auto px-4 py-12 lg:py-16 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <Badge className="bg-primary text-primary-foreground">FAQs</Badge>
              <h1 className="text-3xl lg:text-4xl font-bold tracking-tight">Frequently Asked Questions</h1>
              <p className="text-muted-foreground text-sm lg:text-base">
                Everything you need to know about the PM Internship Scheme Smart Allocation Engine—built for SIH 2024 (Problem Statement 25033).
              </p>
              <div className="flex gap-3 pt-2">
                <Link to="/register"><Button>Get Started</Button></Link>
                <Link to="/about"><Button variant="outline">About the Platform</Button></Link>
              </div>
              <div className="flex flex-wrap gap-2 pt-4">
                <Pill><GraduationCap className="h-3.5 w-3.5 mr-1" /> Students</Pill>
                <Pill><Building2 className="h-3.5 w-3.5 mr-1" /> Host Organisations</Pill>
                <Pill><Users className="h-3.5 w-3.5 mr-1" /> Administrators & Ministry</Pill>
                <Pill><Shield className="h-3.5 w-3.5 mr-1" /> Privacy</Pill>
                <Pill><Scale className="h-3.5 w-3.5 mr-1" /> Fairness</Pill>
              </div>
            </div>
            <div className="rounded-xl overflow-hidden border border-border shadow-sm">
              <img src={aiImg} alt="Smart allocation and fair matching" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10 lg:py-12 space-y-8">
        {/* Quick categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="gov-card">
            <CardHeader className="pb-2"><CardTitle className="text-base flex items-center gap-2"><GraduationCap className="h-4 w-4" /> For Students</CardTitle></CardHeader>
            <CardContent className="text-xs text-muted-foreground">Applications, drafts, deadlines, recommendations</CardContent>
          </Card>
          <Card className="gov-card">
            <CardHeader className="pb-2"><CardTitle className="text-base flex items-center gap-2"><Building2 className="h-4 w-4" /> Host Organisations</CardTitle></CardHeader>
            <CardContent className="text-xs text-muted-foreground">Role setup, capacity, fair shortlisting</CardContent>
          </Card>
          <Card className="gov-card">
            <CardHeader className="pb-2"><CardTitle className="text-base flex items-center gap-2"><Users className="h-4 w-4" /> Admin & Ministry</CardTitle></CardHeader>
            <CardContent className="text-xs text-muted-foreground">Oversight, bias checks, auditability</CardContent>
          </Card>
          <Card className="gov-card">
            <CardHeader className="pb-2"><CardTitle className="text-base flex items-center gap-2"><Shield className="h-4 w-4" /> Privacy & Security</CardTitle></CardHeader>
            <CardContent className="text-xs text-muted-foreground">Consent, data handling, notifications</CardContent>
          </Card>
        </div>

        {/* FAQ Accordions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="gov-card lg:col-span-2">
            <CardHeader>
              <CardTitle>General</CardTitle>
              <CardDescription>Core concepts and platform overview</CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="g1">
                  <AccordionTrigger>What is the Smart Allocation Engine?</AccordionTrigger>
                  <AccordionContent>
                    It’s a fair and transparent matching platform for the PM Internship Scheme (SIH 2024, PS 25033). Students get explainable recommendations, hosts get capacity-aware shortlisting, and authorities get bias monitoring and audit trails.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="g2">
                  <AccordionTrigger>How does the matching score work?</AccordionTrigger>
                  <AccordionContent>
                    The score factors: required skill coverage, preferred skills, location/sector/modality alignment, and student preferences. We surface the top reasons contributing to each score so applicants and hosts can understand the match.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="g3">
                  <AccordionTrigger>Is the allocation fair and unbiased?</AccordionTrigger>
                  <AccordionContent>
                    We use fairness-first design: consent-driven handling of sensitive attributes, bias checks and dashboards, policy guardrails, and explainability. Administrators can review distributions and intervene per policy.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>

          <Card className="gov-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Scale className="h-4 w-4" /> Fairness Principles</CardTitle>
              <CardDescription>Explainability • Consent • Equity • Auditability</CardDescription>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
              <div className="text-muted-foreground">Our matching only uses sensitive attributes within explicit policy levers and with user consent. Scores always include top contributing factors for transparency.</div>
              <div className="flex flex-wrap gap-2 pt-2">
                <Pill>Explainability</Pill>
                <Pill>Consent</Pill>
                <Pill>Equity</Pill>
                <Pill>Auditability</Pill>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="gov-card lg:col-span-2">
            <CardHeader>
              <CardTitle>Students</CardTitle>
              <CardDescription>Applications, drafts, deadlines, resume</CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible>
                <AccordionItem value="s1">
                  <AccordionTrigger>How do I apply to an internship?</AccordionTrigger>
                  <AccordionContent>
                    Go to Recommendations, click Apply on an opportunity to open the dynamic form. Confirm required skills, add a cover letter and preferred start date, then submit. You can also Bulk Apply to multiple selected roles with a single form.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="s2">
                  <AccordionTrigger>Can I save drafts while filling the form?</AccordionTrigger>
                  <AccordionContent>
                    Yes. Drafts auto-save as you type and can be manually saved. You can return anytime to continue. Drafts are stored locally in your browser in this prototype.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="s3">
                  <AccordionTrigger>How do deadline reminders work?</AccordionTrigger>
                  <AccordionContent>
                    We show in-app reminders and optional OS notifications (if enabled) at key intervals (e.g., 48h and 4h before deadlines) for saved, drafted, or applied opportunities while the app is open.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="s4">
                  <AccordionTrigger>Can I track my application status?</AccordionTrigger>
                  <AccordionContent>
                    Yes. The Applications page shows a timeline of events: applied, shortlisted, interview, offer, accepted/declined, etc. You’ll also see toasts for status updates.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="s5">
                  <AccordionTrigger>How does resume extraction help?</AccordionTrigger>
                  <AccordionContent>
                    You can upload your resume and optionally extract skills to update your profile quickly. This improves match quality and saves time.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>

          <Card className="gov-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Bell className="h-4 w-4" /> Reminders & Notifications</CardTitle>
              <CardDescription>Stay on top of deadlines and offers</CardDescription>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
              <div className="flex items-center gap-2 text-muted-foreground"><Clock className="h-4 w-4" /> Time-aware reminders for drafts and saved roles</div>
              <div className="flex items-center gap-2 text-muted-foreground"><Bell className="h-4 w-4" /> In-app toasts and optional OS notifications</div>
              <div className="flex items-center gap-2 text-muted-foreground"><ClipboardList className="h-4 w-4" /> Clear status timelines per application</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="gov-card lg:col-span-2">
            <CardHeader>
              <CardTitle>Host Organisations</CardTitle>
              <CardDescription>Capacity, requirements, and fair shortlisting</CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible>
                <AccordionItem value="h1">
                  <AccordionTrigger>How do we ensure candidates meet required skills?</AccordionTrigger>
                  <AccordionContent>
                    Students must confirm required skills during application. The engine emphasizes required-skill coverage and shows reasons behind each match for transparency.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="h2">
                  <AccordionTrigger>Can we manage capacity and locations?</AccordionTrigger>
                  <AccordionContent>
                    Yes. Opportunities can define capacity, locations, modality, and duration. Matching respects these constraints when ranking and shortlisting.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>

          <Card className="gov-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Shield className="h-4 w-4" /> Privacy & Security</CardTitle>
              <CardDescription>Consent-first design</CardDescription>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
              <div className="text-muted-foreground">Sensitive attributes (e.g., category, disability, rural) are used only with explicit consent and to support policy objectives. You control your data at all times.</div>
              <div className="flex flex-wrap gap-2 pt-2">
                <Pill>Consent</Pill>
                <Pill>Minimal Data</Pill>
                <Pill>User Control</Pill>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* CTA & Help */}
        <Card className="gov-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Rocket className="h-5 w-5" /> Ready to apply?</CardTitle>
            <CardDescription>Start with recommendations or explore opportunities.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-3">
            <Link to="/register"><Button>Create Student Account</Button></Link>
            <Link to="/login"><Button variant="outline">Sign In</Button></Link>
            <Link to="/"><Button variant="ghost">Go to Home</Button></Link>
          </CardContent>
        </Card>

        <div className="text-center text-xs text-muted-foreground">
          Built for Smart India Hackathon 2024 • Problem Statement 25033 • PM Internship Scheme
        </div>
      </div>
    </div>
  );
};

export default FAQ;
