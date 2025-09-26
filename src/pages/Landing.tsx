import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Users,
  Shield,
  Brain,
  ChartBar,
  ArrowRight,
  CheckCircle,
  Zap,
} from 'lucide-react';
import govHero from '@/assets/gov-hero.jpg';
import aiAllocation from '@/assets/ai-allocation.jpg';

export const Landing: React.FC = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Allocation',
      description: 'Smart matching algorithm ensures optimal student-internship pairing',
    },
    {
      icon: Shield,
      title: 'Bias-Free & Fair',
      description: 'Transparent allocation with built-in fairness checks and audit trails',
    },
    {
      icon: ChartBar,
      title: 'Real-time Analytics',
      description: 'Comprehensive dashboards with insights and performance metrics',
    },
    {
      icon: Users,
      title: 'Role-based Access',
      description: 'Secure dashboards for students, admins, and ministry officials',
    },
  ];

  const benefits = [
    'Automated resume parsing and skill extraction',
    'Location and domain preference matching',
    'Real-time allocation status tracking',
    'Comprehensive fairness and bias monitoring',
    'Blockchain-based audit trail',
    'Multi-language support (English & Hindi)',
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">PM</span>
            </div>
            <span className="font-semibold text-lg">PM Internship Scheme</span>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={() => navigate('/login')}>
              Login
            </Button>
            <Button onClick={() => navigate('/register')} className="bg-primary hover:bg-primary-hover">
              Register
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 gov-gradient opacity-10"></div>
        <div className="container mx-auto px-6 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 animate-fade-in">
              <div className="space-y-4">
                <Badge className="gov-badge-primary">
                  <Zap className="w-3 h-3 mr-1" />
                  SIH 2024 Problem Statement 25033
                </Badge>
                <h1 className="text-4xl lg:text-5xl font-bold text-foreground leading-tight">
                  AI-Based Smart Allocation Engine for{' '}
                  <span className="text-primary">PM Internship Scheme</span>
                </h1>
                <p className="text-lg text-muted-foreground max-w-xl">
                  Revolutionizing internship allocation with cutting-edge AI technology, 
                  ensuring fair, transparent, and optimal matching between students and opportunities.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  onClick={() => navigate('/login')}
                  className="bg-primary hover:bg-primary-hover text-primary-foreground group"
                >
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => navigate('/about')}
                >
                  Learn More
                </Button>
              </div>
            </div>

            <div className="relative animate-slide-up">
              <img
                src={govHero}
                alt="Government Building"
                className="w-full h-auto rounded-xl shadow-2xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent rounded-xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Intelligent Allocation System
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our platform leverages advanced AI algorithms to ensure fair, efficient, 
              and transparent allocation of internship opportunities.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="gov-card hover:shadow-md transition-shadow">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="h-6 w-6 text-secondary" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <img
                src={aiAllocation}
                alt="AI Allocation Technology"
                className="w-full h-auto rounded-xl shadow-lg"
              />
            </div>
            
            <div className="space-y-6">
              <div>
                <h2 className="text-3xl font-bold text-foreground mb-4">
                  Advanced Features for Modern Governance
                </h2>
                <p className="text-muted-foreground">
                  Experience the next generation of internship allocation with our 
                  comprehensive suite of features designed for transparency and efficiency.
                </p>
              </div>

              <div className="grid gap-3">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-accent flex-shrink-0" />
                    <span className="text-foreground">{benefit}</span>
                  </div>
                ))}
              </div>

              <Button
                size="lg"
                onClick={() => navigate('/register')}
                className="bg-accent hover:bg-accent-hover text-accent-foreground"
              >
                Start Your Journey
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Role-based Access Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Choose Your Access Level
            </h2>
            <p className="text-muted-foreground">
              Different dashboards tailored for different user roles
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <Card className="gov-card hover:shadow-lg transition-all cursor-pointer group" 
                  onClick={() => navigate('/login?role=student')}>
              <CardContent className="p-8 text-center">
                <Users className="h-12 w-12 text-secondary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Student Portal</h3>
                <p className="text-muted-foreground mb-4">
                  Manage your profile, applications, and view allocation results
                </p>
                <Button variant="outline" className="group-hover:bg-secondary group-hover:text-secondary-foreground">
                  Student Login
                </Button>
              </CardContent>
            </Card>

            <Card className="gov-card hover:shadow-lg transition-all cursor-pointer group"
                  onClick={() => navigate('/login?role=admin')}>
              <CardContent className="p-8 text-center">
                <Shield className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Admin Dashboard</h3>
                <p className="text-muted-foreground mb-4">
                  Manage data, allocation rules, and generate reports
                </p>
                <Button variant="outline" className="group-hover:bg-primary group-hover:text-primary-foreground">
                  Admin Login
                </Button>
              </CardContent>
            </Card>

            <Card className="gov-card hover:shadow-lg transition-all cursor-pointer group"
                  onClick={() => navigate('/login?role=ministry')}>
              <CardContent className="p-8 text-center">
                <ChartBar className="h-12 w-12 text-accent mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Ministry Access</h3>
                <p className="text-muted-foreground mb-4">
                  Monitor fairness, bias detection, and policy oversight
                </p>
                <Button variant="outline" className="group-hover:bg-accent group-hover:text-accent-foreground">
                  Ministry Login
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-card/50 py-8">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className="w-6 h-6 bg-primary rounded flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-xs">PM</span>
              </div>
              <span className="text-muted-foreground">PM Internship Scheme - Smart Allocation Engine</span>
            </div>
            <div className="text-sm text-muted-foreground">
              SIH 2024 | Government of India | Built with ❤️ for transparency
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};