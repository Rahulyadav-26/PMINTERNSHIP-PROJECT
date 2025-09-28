import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  HelpCircle,
  Search,
  MessageCircle,
  Phone,
  Mail,
  FileText,
  Users,
  Settings,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';

interface FAQProps {}

export const FAQ: React.FC<FAQProps> = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Static FAQ data (hardcoded as requested)
  const faqs = [
    {
      id: 1,
      category: 'Matching Process',
      question: 'How are matches made?',
      answer: 'Based on skills, qualifications, location preferences, and allocation rules defined by admin. Our AI-powered matching algorithm considers skill compatibility (50%), academic qualifications (20%), location preferences (15%), and applies any past participation penalties (-10%). Affirmative action quotas for rural districts (20%) and SC/ST categories (15%) are also enforced to ensure fair representation.',
      popular: true
    },
    {
      id: 2,
      category: 'Application Process',
      question: 'What documents are required for application?',
      answer: 'Candidates need to submit their academic transcripts, resume/CV highlighting relevant skills and projects, recommendation letters from faculty or employers, and a statement of purpose. Additionally, category certificates (if applicable for SC/ST or rural district quotas) and skill certification documents should be provided to strengthen the application.',
      popular: true
    },
    {
      id: 3,
      category: 'Allocation Rules',
      question: 'Can allocation results be changed after processing?',
      answer: 'Yes, administrators have manual override capabilities through the system. They can remove candidates from assignments, reassign candidates to different internships, or make adjustments to ensure optimal matching. However, all changes must be saved and documented, and quota compliance must be maintained throughout the process.',
      popular: false
    },
    {
      id: 4,
      category: 'Quota System',
      question: 'How do reservation quotas work?',
      answer: 'The system reserves 20% of positions for candidates from rural and aspirational districts, and 15% for SC/ST category candidates. These quotas are automatically applied during the allocation process. If sufficient candidates from these categories are not available, positions may be allocated through the general category while maintaining overall compliance targets.',
      popular: true
    },
    {
      id: 5,
      category: 'Technical Issues',
      question: 'What if I encounter technical problems during allocation?',
      answer: 'The system includes comprehensive error handling and system health monitoring. If technical issues occur, administrators can reset the allocation process, export current data, and contact technical support. All allocation data is automatically backed up, and the system provides real-time status updates on processing health and data integrity.',
      popular: false
    }
  ];

  const supportContacts = [
    {
      type: 'Technical Support',
      description: 'For system issues and technical queries',
      contact: 'tech-support@pminternship.gov.in',
      hours: '24/7 Support Available'
    },
    {
      type: 'Application Support',
      description: 'For candidate application assistance',
      contact: 'applications@pminternship.gov.in', 
      hours: 'Mon-Fri, 9 AM - 6 PM'
    },
    {
      type: 'Admin Support',
      description: 'For administrative queries and policy clarifications',
      contact: '+91-11-2345-6789',
      hours: 'Mon-Fri, 10 AM - 5 PM'
    }
  ];

  const filteredFAQs = faqs.filter(faq => 
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout title="FAQ & Support">
      <div className="space-y-6">
        {/* Support Header */}
        <Card className="gov-card">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
              <div>
                <h2 className="text-2xl font-bold text-blue-900">Help & Support Center</h2>
                <p className="text-muted-foreground mt-1">
                  Find answers to common questions and get assistance
                </p>
              </div>
              <div className="flex space-x-3">
                <Badge className="gov-badge-primary">Help Available</Badge>
                <Button>
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Contact Support
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="gov-card">
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <HelpCircle className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-2xl font-bold">{faqs.length}</p>
                  <p className="text-sm text-muted-foreground">Total FAQs</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="gov-card">
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Users className="h-8 w-8 text-secondary" />
                <div>
                  <p className="text-2xl font-bold">{faqs.filter(f => f.popular).length}</p>
                  <p className="text-sm text-muted-foreground">Popular Questions</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="gov-card">
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <MessageCircle className="h-8 w-8 text-accent" />
                <div>
                  <p className="text-2xl font-bold">{supportContacts.length}</p>
                  <p className="text-sm text-muted-foreground">Support Channels</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="gov-card">
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-8 w-8 text-green-600" />
                <div>
                  <p className="text-2xl font-bold">24/7</p>
                  <p className="text-sm text-muted-foreground">Support Available</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="faqs" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="faqs">Frequently Asked Questions</TabsTrigger>
            <TabsTrigger value="support">Contact Support</TabsTrigger>
            <TabsTrigger value="guides">User Guides</TabsTrigger>
          </TabsList>

          <TabsContent value="faqs" className="space-y-4">
            <Card className="gov-card">
              <CardHeader>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
                  <div>
                    <CardTitle className="flex items-center space-x-2">
                      <HelpCircle className="h-5 w-5" />
                      <span>Frequently Asked Questions</span>
                    </CardTitle>
                    <CardDescription>
                      Common questions about the PM Internship Scheme allocation system
                    </CardDescription>
                  </div>
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search FAQs..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-64"
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {filteredFAQs.map((faq, index) => (
                    <div key={faq.id} className="border-l-4 border-blue-500 bg-blue-50 p-6 rounded-r-lg">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <Badge className="gov-badge-primary">{faq.category}</Badge>
                          {faq.popular && (
                            <Badge variant="secondary" className="text-xs">Popular</Badge>
                          )}
                        </div>
                      </div>
                      <h3 className="text-lg font-semibold text-blue-900 mb-3">
                        {faq.question}
                      </h3>
                      <p className="text-blue-800 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  ))}

                  {filteredFAQs.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <HelpCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No FAQs found matching your search.</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="support" className="space-y-4">
            <Card className="gov-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MessageCircle className="h-5 w-5" />
                  <span>Contact Support</span>
                </CardTitle>
                <CardDescription>
                  Get in touch with our support team for assistance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {supportContacts.map((contact, index) => (
                    <div key={index} className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                      <div className="flex items-start space-x-4">
                        <div className="p-3 bg-blue-100 rounded-lg">
                          {contact.type === 'Technical Support' && <Settings className="h-6 w-6 text-blue-600" />}
                          {contact.type === 'Application Support' && <FileText className="h-6 w-6 text-blue-600" />}
                          {contact.type === 'Admin Support' && <Phone className="h-6 w-6 text-blue-600" />}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            {contact.type}
                          </h3>
                          <p className="text-gray-600 mb-3">{contact.description}</p>
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2">
                              {contact.contact.includes('@') ? (
                                <Mail className="h-4 w-4 text-blue-600" />
                              ) : (
                                <Phone className="h-4 w-4 text-blue-600" />
                              )}
                              <span className="font-medium text-blue-900">{contact.contact}</span>
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {contact.hours}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200">
                    <div className="flex items-center space-x-2 mb-3">
                      <AlertCircle className="h-5 w-5 text-yellow-600" />
                      <h4 className="font-semibold text-yellow-900">Before Contacting Support</h4>
                    </div>
                    <ul className="text-yellow-800 text-sm space-y-1">
                      <li>• Check the FAQ section above for quick answers</li>
                      <li>• Have your system details and error messages ready</li>
                      <li>• For technical issues, note the exact steps that led to the problem</li>
                      <li>• Include screenshots if reporting UI/display issues</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="guides" className="space-y-4">
            <Card className="gov-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="h-5 w-5" />
                  <span>User Guides & Documentation</span>
                </CardTitle>
                <CardDescription>
                  Step-by-step guides and documentation for system features
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                    <h4 className="font-semibold text-green-900 mb-4">Administrator Guides</h4>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-sm">Setting up allocation rules</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-sm">Running the matching algorithm</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-sm">Manual override procedures</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-sm">Generating reports</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                    <h4 className="font-semibold text-blue-900 mb-4">System Features</h4>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-blue-600" />
                        <span className="text-sm">Data upload and management</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-blue-600" />
                        <span className="text-sm">Analytics and insights</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-blue-600" />
                        <span className="text-sm">Quota management</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-blue-600" />
                        <span className="text-sm">System monitoring</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 text-center">
                  <Button variant="outline">
                    <FileText className="h-4 w-4 mr-2" />
                    Download Complete User Manual
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default FAQ;
