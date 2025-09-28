import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Target,
  Users,
  Brain,
  Shield,
  CheckCircle,
  Award,
  Globe,
  Zap,
  Heart,
  Code,
  Database,
  TrendingUp,
} from 'lucide-react';

interface AboutProps {}

export const AdminAbout: React.FC<AboutProps> = () => {
  const systemFeatures = [
    {
      icon: Brain,
      title: 'AI-Powered Matching',
      description: 'Advanced machine learning algorithms analyze candidate profiles and internship requirements for optimal matching.'
    },
    {
      icon: Shield,
      title: 'Fair & Transparent',
      description: 'Quota compliance and affirmative action ensure equal opportunities for all categories of candidates.'
    },
    {
      icon: Target,
      title: 'Efficient Allocation',
      description: 'Automated processing reduces manual effort while maintaining high accuracy in candidate-opportunity matching.'
    },
    {
      icon: TrendingUp,
      title: 'Real-time Analytics',
      description: 'Comprehensive insights into skill demand, placement rates, and system performance metrics.'
    }
  ];

  const techStack = [
    { name: 'Machine Learning', description: 'Candidate-opportunity matching algorithms' },
    { name: 'React & TypeScript', description: 'Modern frontend development' },
    { name: 'Node.js', description: 'Scalable backend processing' },
    { name: 'AI Analytics', description: 'Intelligent insights and reporting' }
  ];

  const impactMetrics = [
    { metric: '1 Crore', description: 'Internships Targeted', icon: Users },
    { metric: '500+', description: 'Top Companies', icon: Award },
    { metric: '24', description: 'Industry Sectors', icon: Globe },
    { metric: '95%+', description: 'Matching Accuracy', icon: CheckCircle }
  ];

  return (
    <DashboardLayout title="About the System">
      <div className="space-y-6">
        {/* About Header */}
        <Card className="gov-card">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
              <div>
                <h2 className="text-2xl font-bold text-blue-900">PM Internship Scheme - Smart Allocation System</h2>
                <p className="text-muted-foreground mt-1">
                  Intelligent matching powered by AI/ML for India's youth employment initiative
                </p>
              </div>
              <div className="flex space-x-3">
                <Badge className="gov-badge-primary">AI-Powered</Badge>
                <Badge variant="outline">Government Initiative</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Impact Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {impactMetrics.map((item, index) => (
            <Card key={index} className="gov-card">
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <item.icon className="h-8 w-8 text-primary" />
                  <div>
                    <p className="text-2xl font-bold">{item.metric}</p>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">System Overview</TabsTrigger>
            <TabsTrigger value="features">Key Features</TabsTrigger>
            <TabsTrigger value="technology">Technology Stack</TabsTrigger>
            <TabsTrigger value="impact">Social Impact</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <Card className="gov-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Zap className="h-5 w-5" />
                  <span>About the Smart Allocation System</span>
                </CardTitle>
                <CardDescription>
                  Revolutionizing internship allocation through artificial intelligence
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* MVP Required Paragraph */}
                  <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                    <p className="text-lg text-blue-900 leading-relaxed">
                      This system demonstrates smart AI/ML-powered allocation of interns under the PM Internship Scheme. 
                      It ensures fair, transparent, and efficient matching of students to opportunities.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="text-xl font-semibold text-gray-900">Mission Statement</h3>
                      <p className="text-gray-700 leading-relaxed">
                        To bridge the gap between academic learning and industry requirements by providing 
                        an intelligent, automated platform that matches qualified candidates with suitable 
                        internship opportunities across India's top 500 companies.
                      </p>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-xl font-semibold text-gray-900">Vision</h3>
                      <p className="text-gray-700 leading-relaxed">
                        Empowering India's youth through technology-driven career opportunities while 
                        supporting the nation's goal of becoming the "Skill Capital of the World" 
                        under the Viksit Bharat initiative.
                      </p>
                    </div>
                  </div>

                  <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                    <div className="flex items-center space-x-2 mb-3">
                      <Heart className="h-5 w-5 text-green-600" />
                      <h4 className="font-semibold text-green-900">Social Impact</h4>
                    </div>
                    <p className="text-green-800 text-sm">
                      Part of the PM's Package for Employment and Skilling with ₹2 lakh crore allocation, 
                      this system supports the goal of providing 1 crore internships over 5 years, 
                      directly contributing to youth employment and skill development in India.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="features" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {systemFeatures.map((feature, index) => (
                <Card key={index} className="gov-card">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="p-3 bg-blue-100 rounded-lg">
                        <feature.icon className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          {feature.title}
                        </h3>
                        <p className="text-gray-600 text-sm leading-relaxed">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="technology" className="space-y-4">
            <Card className="gov-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Code className="h-5 w-5" />
                  <span>Technology Architecture</span>
                </CardTitle>
                <CardDescription>
                  Modern tech stack powering the intelligent allocation system
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {techStack.map((tech, index) => (
                      <div key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <div className="flex items-center space-x-3">
                          <Database className="h-5 w-5 text-blue-600" />
                          <div>
                            <h4 className="font-semibold text-gray-900">{tech.name}</h4>
                            <p className="text-sm text-gray-600">{tech.description}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                    <h4 className="font-semibold text-blue-900 mb-4">AI/ML Capabilities</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Skill-based candidate matching</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Automated quota compliance</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Predictive analytics and insights</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Real-time performance optimization</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="impact" className="space-y-4">
            <Card className="gov-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="h-5 w-5" />
                  <span>Transforming India's Employment Landscape</span>
                </CardTitle>
                <CardDescription>
                  Contributing to national skill development and youth empowerment
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                      <h4 className="font-semibold text-green-900 mb-3">Youth Empowerment</h4>
                      <p className="text-green-800 text-sm">
                        Providing meaningful work experience to young Indians aged 21-24, 
                        bridging the education-employment gap with hands-on industry exposure.
                      </p>
                    </div>

                    <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                      <h4 className="font-semibold text-blue-900 mb-3">Industry Partnership</h4>
                      <p className="text-blue-800 text-sm">
                        Collaborating with India's top 500 companies across 24 sectors including 
                        IT, banking, automotive, and manufacturing for comprehensive skill development.
                      </p>
                    </div>

                    <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
                      <h4 className="font-semibold text-purple-900 mb-3">Social Inclusion</h4>
                      <p className="text-purple-800 text-sm">
                        Ensuring fair representation through automated quota systems for 
                        rural districts (20%) and SC/ST categories (15%) for inclusive growth.
                      </p>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                    <h4 className="font-semibold text-gray-900 mb-4">Economic Impact</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
                      <div>• ₹5,000 monthly stipend supporting 1 crore interns</div>
                      <div>• ₹6,000 one-time grant for career development</div>
                      <div>• Insurance coverage ensuring intern welfare</div>
                      <div>• CSR fund utilization for sustainable skill development</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default AdminAbout;
