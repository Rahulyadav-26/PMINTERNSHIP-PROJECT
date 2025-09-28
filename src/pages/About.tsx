import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import heroImg from '@/assets/gov-hero.jpg';
import aiImg from '@/assets/ai-allocation.jpg';
import { Link } from 'react-router-dom';

const Stat: React.FC<{ value: string; label: string }> = ({ value, label }) => (
  <div className="p-4 rounded-lg bg-primary/5 border border-primary/10 text-center">
    <div className="text-2xl font-bold text-primary">{value}</div>
    <div className="text-xs text-muted-foreground">{label}</div>
  </div>
);

const Section: React.FC<{ title: string; children: React.ReactNode; subtitle?: string }> = ({ title, children, subtitle }) => (
  <section className="space-y-3">
    <h2 className="text-xl font-semibold">{title}</h2>
    {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
    <div className="space-y-3 text-sm leading-6">{children}</div>
  </section>
);

const Pill: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span className="inline-flex items-center px-2 py-1 text-xs rounded-full bg-secondary/10 text-secondary border border-secondary/20">{children}</span>
);

const About: React.FC = () => {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 gov-gradient opacity-20" />
        <div className="container mx-auto px-4 py-12 lg:py-16 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <Badge className="bg-primary text-primary-foreground">PM Internship Scheme</Badge>
              <h1 className="text-3xl lg:text-4xl font-bold tracking-tight">About the Smart Allocation Engine</h1>
              <p className="text-muted-foreground text-sm lg:text-base">
                A fair, transparent, and intelligent platform to match students across India to government and public sector internship opportunities—built for Smart India Hackathon 2024, Problem Statement 25033.
              </p>
              <div className="flex gap-3 pt-2">
                <Link to="/register"><Button>Get Started</Button></Link>
                <Link to="/"><Button variant="outline">Explore Home</Button></Link>
              </div>
              <div className="grid grid-cols-3 gap-3 pt-6">
                <Stat value="100%" label="Transparent Scoring" />
                <Stat value="0 Bias" label="Fairness-First Design" />
                <Stat value="Real-time" label="Recommendations & Alerts" />
              </div>
            </div>
            <div className="rounded-xl overflow-hidden border border-border shadow-sm">
              <img src={heroImg} alt="Government collaboration and student internships" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10 lg:py-12 space-y-8">
        {/* Mission & Context */}
        <Card className="gov-card">
          <CardHeader>
            <CardTitle>Mission</CardTitle>
            <CardDescription>Fair opportunities. Transparent selection. National-scale impact.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm leading-6">
            <p>
              The Smart Allocation Engine ensures that every student—irrespective of background, geography, or institution—gets equitable access to internships under the PM Internship Scheme. We combine data-driven matching with explicit fairness checks, explainable scoring, and strong privacy controls to uphold public trust.
            </p>
            <p>
              Built for SIH 2024 (PS 25033), the platform addresses end-to-end allocation: from capturing student preferences and capabilities, to ranking and shortlisting, through to allocations and offer management—while preserving transparency and auditability throughout.
            </p>
          </CardContent>
        </Card>

        {/* How it works */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="gov-card lg:col-span-2">
            <CardHeader>
              <CardTitle>How It Works</CardTitle>
              <CardDescription>From profile to placement—explainable and auditable at every step.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Section title="1) Profile & Preferences" subtitle="Students manage skills, resume, and preferences (location, sector, modality)">
                <ul className="list-disc list-inside">
                  <li>Resume upload with optional skill extraction</li>
                  <li>Explicit consent for sensitive data handling</li>
                  <li>Draft saving and edit history across sessions</li>
                </ul>
              </Section>
              <Separator />
              <Section title="2) Intelligent Matching" subtitle="Skill overlap + preference satisfaction + policy constraints">
                <ul className="list-disc list-inside">
                  <li>Weighted coverage of required and preferred skills</li>
                  <li>Location, sector, and modality alignment</li>
                  <li>Explainable scores with the top contributing factors</li>
                </ul>
              </Section>
              <Separator />
              <Section title="3) Fair Allocation & Oversight" subtitle="Bias-aware monitoring and transparent shortlisting">
                <ul className="list-disc list-inside">
                  <li>Capacity-aware shortlisting and waitlisting</li>
                  <li>Bias checks and dashboards for administrators/ministry</li>
                  <li>Clear audit trails and status timelines for applications</li>
                </ul>
              </Section>
              <Separator />
              <Section title="4) Offers, Tracking, and Notifications" subtitle="End-to-end visibility for students and stakeholders">
                <ul className="list-disc list-inside">
                  <li>Application timelines, offer acceptance/decline</li>
                  <li>Deadline management with automated reminders</li>
                  <li>In-app toasts and optional OS notifications</li>
                </ul>
              </Section>
            </CardContent>
          </Card>
          <Card className="gov-card">
            <CardHeader>
              <CardTitle>Fairness & Transparency</CardTitle>
              <CardDescription>Designed to minimize bias and maximize trust.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm leading-6">
              <div className="rounded-lg overflow-hidden border">
                <img src={aiImg} alt="AI allocation illustration" className="w-full h-40 object-cover" />
              </div>
              <ul className="list-disc list-inside">
                <li>Explainable match scores and top contributing factors</li>
                <li>Consent-driven handling of sensitive attributes</li>
                <li>Policy guardrails and bias monitoring dashboards</li>
              </ul>
              <div className="flex flex-wrap gap-2 pt-2">
                <Pill>Explainability</Pill>
                <Pill>Consent</Pill>
                <Pill>Equity</Pill>
                <Pill>Auditability</Pill>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Capabilities */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="gov-card">
            <CardHeader>
              <CardTitle>For Students</CardTitle>
              <CardDescription>Personalized, supportive application experience</CardDescription>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
              <ul className="list-disc list-inside">
                <li>Recommendations with transparent rationale</li>
                <li>Dynamic forms, draft saving, resume extraction</li>
                <li>Bulk apply, deadline reminders, status timelines</li>
              </ul>
            </CardContent>
          </Card>
          <Card className="gov-card">
            <CardHeader>
              <CardTitle>For Host Organisations</CardTitle>
              <CardDescription>Capacity-aware and fair shortlisting</CardDescription>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
              <ul className="list-disc list-inside">
                <li>Skill-based ranking aligned with role requirements</li>
                <li>Visibility into candidate timelines and communication</li>
                <li>Reduced bias via explainability and guardrails</li>
              </ul>
            </CardContent>
          </Card>
          <Card className="gov-card">
            <CardHeader>
              <CardTitle>For Administrators & Ministry</CardTitle>
              <CardDescription>Oversight, policy alignment, and equity</CardDescription>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
              <ul className="list-disc list-inside">
                <li>Bias monitoring and fairness checkpoints</li>
                <li>Policy levers for equitable distribution</li>
                <li>Transparent audit trails across the lifecycle</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Privacy & Technology */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="gov-card">
            <CardHeader>
              <CardTitle>Privacy & Security</CardTitle>
              <CardDescription>Built with consent and minimal data principles</CardDescription>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
              <ul className="list-disc list-inside">
                <li>Consent capture for sensitive attributes (category, disability, rural)</li>
                <li>Local persistence in prototype; server storage pluggable</li>
                <li>Clear user controls to save/withdraw applications</li>
              </ul>
            </CardContent>
          </Card>
          <Card className="gov-card">
            <CardHeader>
              <CardTitle>Technology</CardTitle>
              <CardDescription>Modern web stack, modular and extensible</CardDescription>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
              <ul className="list-disc list-inside">
                <li>React, TypeScript, Vite, Tailwind, shadcn-ui</li>
                <li>TanStack Query for state, modular matching engine</li>
                <li>Backend-agnostic design for future API integration</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* CTA */}
        <Card className="gov-card">
          <CardHeader>
            <CardTitle>Join the Journey</CardTitle>
            <CardDescription>Championing fair access to opportunities—at scale.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-3">
            <Link to="/register"><Button>Create Student Account</Button></Link>
            <Link to="/login"><Button variant="outline">Sign In</Button></Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default About;
