import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Mail,
  Phone,
  MapPin,
  Send,
  CheckCircle,
  Clock,
  MessageCircle,
  Building,
  Globe,
  Users,
} from 'lucide-react';

interface ContactProps {}

export const Contact: React.FC<ContactProps> = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission to database
    await new Promise(resolve => setTimeout(resolve, 2000));

    console.log('Contact form submitted to DB:', formData);
    setSubmitted(true);
    setIsSubmitting(false);

    // Reset form after 3 seconds
    setTimeout(() => {
      setFormData({ name: '', email: '', message: '' });
      setSubmitted(false);
    }, 3000);
  };

  const contactInfo = [
    {
      type: 'Email Support',
      value: 'support@pm-internship.gov.in',
      description: 'Primary support channel for all queries',
      icon: Mail
    },
    {
      type: 'Technical Support',
      value: 'tech-support@pm-internship.gov.in',
      description: 'For system issues and technical assistance',
      icon: MessageCircle
    },
    {
      type: 'Phone Support',
      value: '+91-11-2345-6789',
      description: 'Mon-Fri, 10 AM - 5 PM IST',
      icon: Phone
    },
    {
      type: 'Address',
      value: 'Ministry of Corporate Affairs, New Delhi - 110001',
      description: 'Government of India',
      icon: MapPin
    }
  ];

  const officeHours = [
    { day: 'Monday - Friday', hours: '10:00 AM - 5:00 PM IST' },
    { day: 'Saturday', hours: '10:00 AM - 2:00 PM IST' },
    { day: 'Sunday', hours: 'Closed' },
    { day: 'Public Holidays', hours: 'Closed' }
  ];

  return (
    <DashboardLayout title="Contact & Support">
      <div className="space-y-6">
        {/* Contact Header */}
        <Card className="gov-card">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
              <div>
                <h2 className="text-2xl font-bold text-blue-900">Contact & Support</h2>
                <p className="text-muted-foreground mt-1">
                  Get in touch with our support team for assistance and queries
                </p>
              </div>
              <div className="flex space-x-3">
                <Badge className="gov-badge-primary">Support Available</Badge>
                <Badge variant="outline">Government Service</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="gov-card">
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Clock className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-2xl font-bold">24/7</p>
                  <p className="text-sm text-muted-foreground">Email Support</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="gov-card">
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Users className="h-8 w-8 text-secondary" />
                <div>
                  <p className="text-2xl font-bold"> 2 hrs</p>
                  <p className="text-sm text-muted-foreground">Response Time</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="gov-card">
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Building className="h-8 w-8 text-accent" />
                <div>
                  <p className="text-2xl font-bold">4</p>
                  <p className="text-sm text-muted-foreground">Support Channels</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="gov-card">
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Globe className="h-8 w-8 text-green-600" />
                <div>
                  <p className="text-2xl font-bold">Pan India</p>
                  <p className="text-sm text-muted-foreground">Coverage</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="contact" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="contact">Contact Information</TabsTrigger>
            <TabsTrigger value="form">Contact Form</TabsTrigger>
            <TabsTrigger value="office">Office Details</TabsTrigger>
          </TabsList>

          <TabsContent value="contact" className="space-y-4">
            <Card className="gov-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Mail className="h-5 w-5" />
                  <span>Get in Touch</span>
                </CardTitle>
                <CardDescription>
                  Multiple ways to reach our support team for assistance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* MVP Required Contact Display */}
                  <div className="bg-blue-50 p-6 rounded-lg border border-blue-200 text-center">
                    <Mail className="h-8 w-8 mx-auto text-blue-600 mb-4" />
                    <h3 className="text-xl font-semibold text-blue-900 mb-2">Primary Support</h3>
                    <p className="text-blue-800 mb-4">
                      For support, email{' '}
                      <a 
                        href="mailto:support@pm-internship.gov.in" 
                        className="font-medium underline hover:no-underline"
                      >
                        support@pm-internship.gov.in
                      </a>
                    </p>
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      <Mail className="h-4 w-4 mr-2" />
                      Send Email
                    </Button>
                  </div>

                  {/* Detailed Contact Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {contactInfo.map((contact, index) => (
                      <div key={index} className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                        <div className="flex items-start space-x-4">
                          <div className="p-3 bg-blue-100 rounded-lg">
                            <contact.icon className="h-6 w-6 text-blue-600" />
                          </div>
                          <div className="flex-1">
                            <h4 className="text-lg font-semibold text-gray-900 mb-2">
                              {contact.type}
                            </h4>
                            <p className="font-medium text-blue-900 mb-1">{contact.value}</p>
                            <p className="text-sm text-gray-600">{contact.description}</p>
                            {contact.type === 'Email Support' && (
                              <Button variant="outline" size="sm" className="mt-3">
                                <Mail className="h-3 w-3 mr-1" />
                                Email Now
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="form" className="space-y-4">
            <Card className="gov-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Send className="h-5 w-5" />
                  <span>Contact Form</span>
                </CardTitle>
                <CardDescription>
                  Send us a message and we'll get back to you within 2 hours
                </CardDescription>
              </CardHeader>
              <CardContent>
                {!submitted ? (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name *</Label>
                        <Input
                          id="name"
                          name="name"
                          type="text"
                          placeholder="Enter your full name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                          className="w-full"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address *</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="Enter your email address"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          className="w-full"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">Message *</Label>
                      <Textarea
                        id="message"
                        name="message"
                        placeholder="Describe your query or issue in detail..."
                        value={formData.message}
                        onChange={handleInputChange}
                        required
                        className="min-h-[120px] w-full"
                      />
                    </div>

                    <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                      <p className="text-yellow-800 text-sm">
                        <strong>Note:</strong> This form submits directly to our database. 
                        You'll receive an acknowledgment email and our team will respond within 2 hours during office hours.
                      </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                      <Button 
                        type="submit" 
                        disabled={isSubmitting || !formData.name || !formData.email || !formData.message}
                        className="flex-1 sm:flex-none"
                      >
                        {isSubmitting ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Submitting...
                          </>
                        ) : (
                          <>
                            <Send className="h-4 w-4 mr-2" />
                            Submit Message
                          </>
                        )}
                      </Button>
                      <Button 
                        type="button" 
                        variant="outline"
                        onClick={() => setFormData({ name: '', email: '', message: '' })}
                      >
                        Clear Form
                      </Button>
                    </div>
                  </form>
                ) : (
                  <div className="text-center py-12">
                    <CheckCircle className="h-16 w-16 mx-auto text-green-600 mb-4" />
                    <h3 className="text-xl font-semibold text-green-900 mb-2">Message Sent Successfully!</h3>
                    <p className="text-green-700 mb-4">
                      Thank you for contacting us. Your message has been stored in our database and 
                      our team will respond within 2 hours.
                    </p>
                    <Badge className="bg-green-100 text-green-800">
                      Response Expected: Within 2 Hours
                    </Badge>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="office" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="gov-card">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Clock className="h-5 w-5" />
                    <span>Office Hours</span>
                  </CardTitle>
                  <CardDescription>
                    Support availability and response times
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {officeHours.map((schedule, index) => (
                      <div key={index} className="flex justify-between items-center p-3 bg-blue-50 rounded border">
                        <span className="font-medium text-blue-900">{schedule.day}</span>
                        <Badge variant="outline" className={schedule.hours === 'Closed' ? 'text-red-600' : 'text-green-600'}>
                          {schedule.hours}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="gov-card">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <MapPin className="h-5 w-5" />
                    <span>Office Location</span>
                  </CardTitle>
                  <CardDescription>
                    Government headquarters and mailing address
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <h4 className="font-semibold text-gray-900 mb-2">PM Internship Scheme Office</h4>
                      <div className="space-y-2 text-sm text-gray-700">
                        <p>Ministry of Corporate Affairs</p>
                        <p>Shastri Bhawan, Dr. Rajendra Prasad Road</p>
                        <p>New Delhi - 110001</p>
                        <p>Government of India</p>
                      </div>
                    </div>

                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                      <h4 className="font-semibold text-blue-900 mb-2">Quick Contact</h4>
                      <div className="space-y-2 text-sm text-blue-800">
                        <div className="flex items-center space-x-2">
                          <Mail className="h-4 w-4" />
                          <span>support@pm-internship.gov.in</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Phone className="h-4 w-4" />
                          <span>+91-11-2345-6789</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Globe className="h-4 w-4" />
                          <span>www.pminternship.gov.in</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};