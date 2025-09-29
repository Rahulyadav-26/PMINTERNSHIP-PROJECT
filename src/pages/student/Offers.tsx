import React, { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { useStudent } from '@/contexts/StudentContext';
import { SAMPLE_INTERNSHIPS } from '@/lib/sampleData';
import { toast } from '@/components/ui/sonner';
import {
  CheckCircle, XCircle, Clock, Calendar, MapPin, DollarSign,
  Building2, Eye, Download, Star, TrendingUp, Award,
  Target, Zap, AlertCircle, Timer, Globe, Users,
  Briefcase, FileText, ArrowRight, ChevronRight,
  BarChart3, PieChart, Activity, Heart, Sparkles,
  Mail, Phone, ExternalLink, Copy, Share2, Shield
} from 'lucide-react';
import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';

// TypeScript Interfaces
interface Offer {
  id: string;
  applicationId: string;
  internshipId: string;
  status: 'offered' | 'accepted' | 'declined' | 'expired';
  offeredAt: string;
  expiresAt: string;
  matchScore: number;
  salary?: number;
  stipend?: number;
  duration?: string;
  startDate?: string;
  companyContact?: {
    name: string;
    email: string;
    phone: string;
  };
}

interface OfferDetails {
  description: string;
  requirements: string[];
  benefits: string[];
  timeline: {
    applicationDate: string;
    offerDate: string;
    responseDeadline: string;
    startDate: string;
  };
  companyInfo: {
    about: string;
    size: string;
    founded: string;
    website: string;
  };
}

// Animation Variants
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring" as const,
      stiffness: 300,
      damping: 30
    }
  }
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 400,
      damping: 25
    }
  },
  hover: {
    y: -4,
    scale: 1.02,
    transition: {
      type: "spring" as const,
      stiffness: 400,
      damping: 25
    }
  }
};

// Utility Functions
const getTimeLeft = (expiresAt: string): { days: number; hours: number; isExpiring: boolean } => {
  const now = new Date().getTime();
  const expiry = new Date(expiresAt).getTime();
  const diff = expiry - now;
  
  if (diff <= 0) return { days: 0, hours: 0, isExpiring: true };
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  
  return { days, hours, isExpiring: days <= 2 };
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'accepted': return 'bg-green-100 text-green-700 border-green-200';
    case 'declined': return 'bg-red-100 text-red-700 border-red-200';
    case 'expired': return 'bg-gray-100 text-gray-700 border-gray-200';
    default: return 'bg-blue-100 text-blue-700 border-blue-200';
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'accepted': return CheckCircle;
    case 'declined': return XCircle;
    case 'expired': return AlertCircle;
    default: return Clock;
  }
};

// Reusable Components
const CountdownTimer: React.FC<{ expiresAt: string }> = ({ expiresAt }) => {
  const [timeLeft, setTimeLeft] = React.useState(getTimeLeft(expiresAt));
  
  React.useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(getTimeLeft(expiresAt));
    }, 1000 * 60); // Update every minute
    
    return () => clearInterval(timer);
  }, [expiresAt]);
  
  if (timeLeft.days === 0 && timeLeft.hours === 0) {
    return (
      <Badge className="bg-red-100 text-red-700 border-red-200 flex items-center gap-1">
        <AlertCircle className="w-3 h-3" />
        Expired
      </Badge>
    );
  }
  
  return (
    <Badge 
      className={`
        flex items-center gap-1 ${
          timeLeft.isExpiring 
            ? 'bg-orange-100 text-orange-700 border-orange-200 animate-pulse' 
            : 'bg-blue-100 text-blue-700 border-blue-200'
        }
      `}
    >
      <Timer className="w-3 h-3" />
      {timeLeft.days > 0 ? `${timeLeft.days}d ${timeLeft.hours}h` : `${timeLeft.hours}h left`}
    </Badge>
  );
};

const MatchScore: React.FC<{ score: number }> = ({ score }) => {
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1">
        <div className="flex items-center justify-between text-xs mb-1">
          <span className="text-gray-600">Match Score</span>
          <span className="font-semibold text-purple-700">{score}%</span>
        </div>
        <Progress value={score} className="h-2 bg-purple-100">
          <div 
            className="h-full bg-purple-600 transition-all duration-1000 ease-out rounded-full" 
            style={{ width: `${score}%` }}
          />
        </Progress>
      </div>
      <div className="p-1.5 bg-purple-100 rounded-lg">
        <Star className="w-3 h-3 text-purple-600 fill-purple-600" />
      </div>
    </div>
  );
};

const OfferDetailsModal: React.FC<{
  offer: Offer;
  internship: any;
  isOpen: boolean;
  onClose: () => void;
  onAccept: () => void;
  onDecline: () => void;
}> = ({ offer, internship, isOpen, onClose, onAccept, onDecline }) => {
  const mockOfferDetails: OfferDetails = {
    description: `We are excited to offer you the ${internship?.title} position at ${internship?.organization}. This role offers an excellent opportunity to work with cutting-edge technology and contribute to meaningful projects that impact thousands of users globally.`,
    requirements: [
      'Bachelor\'s degree in relevant field or equivalent experience',
      'Strong programming skills in modern technologies',
      'Excellent communication and teamwork abilities',
      'Passion for learning and continuous improvement'
    ],
    benefits: [
      'Comprehensive health and wellness programs',
      'Flexible working arrangements',
      'Professional development opportunities',
      'Mentorship from industry experts',
      'Access to latest tools and technologies'
    ],
    timeline: {
      applicationDate: '2025-01-15',
      offerDate: offer.offeredAt,
      responseDeadline: offer.expiresAt,
      startDate: offer.startDate || '2025-06-01'
    },
    companyInfo: {
      about: `${internship?.organization} is a leading technology company focused on innovation and excellence. We are committed to creating solutions that make a positive impact on society while fostering a culture of creativity and collaboration.`,
      size: '500-1000 employees',
      founded: '2015',
      website: `https://${internship?.organization?.toLowerCase().replace(/\s+/g, '')}.com`
    }
  };

  const downloadOfferLetter = useCallback(() => {
    toast('Offer letter downloaded successfully!');
    // Simulate PDF download
  }, []);

  const copyOfferLink = useCallback(() => {
    navigator.clipboard.writeText(`https://pm-internship.gov.in/offer/${offer.id}`);
    toast('Offer link copied to clipboard!');
  }, [offer.id]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Briefcase className="w-6 h-6 text-blue-600" />
            </div>
            Offer Details
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-8">
          {/* Offer Summary */}
          <Card className="border border-blue-200 bg-blue-50">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <CardTitle className="text-blue-800">{internship?.title}</CardTitle>
                  <CardDescription className="text-blue-700 flex items-center gap-2">
                    <Building2 className="w-4 h-4" />
                    {internship?.organization}
                  </CardDescription>
                </div>
                <MatchScore score={offer.matchScore} />
              </div>
            </CardHeader>
            <CardContent className="bg-white rounded-b-lg">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-600" />
                  <span className="text-sm text-gray-700">{internship?.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-gray-600" />
                  <span className="text-sm text-gray-700">₹{(offer.stipend || internship?.stipend || 25000).toLocaleString()}/month</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-600" />
                  <span className="text-sm text-gray-700">{offer.duration || internship?.duration || '3 months'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-gray-600" />
                  <span className="text-sm text-gray-700">{internship?.modality || 'Hybrid'}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Description */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <FileText className="w-5 h-5 text-gray-600" />
              Position Description
            </h3>
            <p className="text-gray-700 leading-relaxed">{mockOfferDetails.description}</p>
          </div>

          {/* Requirements & Benefits */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-orange-600" />
                Requirements
              </h3>
              <ul className="space-y-2">
                {mockOfferDetails.requirements.map((req, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    {req}
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Heart className="w-5 h-5 text-red-600" />
                Benefits
              </h3>
              <ul className="space-y-2">
                {mockOfferDetails.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                    <Sparkles className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Timeline */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-600" />
              Application Timeline
            </h3>
            <div className="space-y-4">
              {[
                { label: 'Application Submitted', date: mockOfferDetails.timeline.applicationDate, icon: Briefcase, color: 'green' },
                { label: 'Offer Extended', date: mockOfferDetails.timeline.offerDate, icon: Award, color: 'blue' },
                { label: 'Response Deadline', date: mockOfferDetails.timeline.responseDeadline, icon: Timer, color: 'orange' },
                { label: 'Expected Start Date', date: mockOfferDetails.timeline.startDate, icon: Calendar, color: 'purple' }
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className={`
                    p-2 rounded-full
                    ${item.color === 'green' ? 'bg-green-100' :
                      item.color === 'blue' ? 'bg-blue-100' :
                      item.color === 'orange' ? 'bg-orange-100' : 'bg-purple-100'}
                  `}>
                    <item.icon className={`
                      w-4 h-4
                      ${item.color === 'green' ? 'text-green-600' :
                        item.color === 'blue' ? 'text-blue-600' :
                        item.color === 'orange' ? 'text-orange-600' : 'text-purple-600'}
                    `} />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{item.label}</p>
                    <p className="text-sm text-gray-600">{new Date(item.date).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Company Info */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Building2 className="w-5 w-5 text-gray-600" />
              About {internship?.organization}
            </h3>
            <div className="space-y-4">
              <p className="text-gray-700 leading-relaxed">{mockOfferDetails.companyInfo.about}</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-900">Company Size</p>
                  <p className="text-sm text-gray-600">{mockOfferDetails.companyInfo.size}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Founded</p>
                  <p className="text-sm text-gray-600">{mockOfferDetails.companyInfo.founded}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Website</p>
                  <a 
                    href={mockOfferDetails.companyInfo.website}
                    className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Visit Website
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          {offer.companyContact && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-gray-600" />
                Contact Information
              </h3>
              <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-gray-600" />
                  <span className="text-sm text-gray-700">{offer.companyContact.email}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-gray-600" />
                  <span className="text-sm text-gray-700">{offer.companyContact.phone}</span>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t">
            <div className="flex gap-3 flex-1">
              <motion.div
                className="flex-1"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  onClick={onAccept}
                  disabled={offer.status !== 'offered'}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Accept Offer
                </Button>
              </motion.div>
              
              <motion.div
                className="flex-1"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  onClick={onDecline}
                  disabled={offer.status !== 'offered'}
                  variant="outline"
                  className="w-full border-2 border-red-300 text-red-700 hover:bg-red-50 font-semibold py-3"
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Decline Offer
                </Button>
              </motion.div>
            </div>
            
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                onClick={downloadOfferLetter}
                className="px-6 py-3"
              >
                <Download className="w-4 h-4 mr-2" />
                Download PDF
              </Button>
              <Button 
                variant="outline" 
                onClick={copyOfferLink}
                className="px-6 py-3"
              >
                <Copy className="w-4 h-4 mr-2" />
                Copy Link
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const OfferCard: React.FC<{
  offer: Offer;
  internship: any;
  onAccept: () => void;
  onDecline: () => void;
  onViewDetails: () => void;
}> = ({ offer, internship, onAccept, onDecline, onViewDetails }) => {
  const StatusIcon = getStatusIcon(offer.status);
  const isActionable = offer.status === 'offered';
  
  return (
    <motion.div
      variants={cardVariants}
      whileHover="hover"
      className="group"
    >
      <Card className="border-2 border-gray-200 hover:border-blue-300 transition-all duration-300 overflow-hidden">
        <CardHeader className="space-y-4">
          {/* Header with status */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="h-12 w-12 border-2 border-gray-200">
                <AvatarImage src={`https://ui-avatars.com/api/?name=${internship?.organization}&background=6366f1&color=fff&size=128`} />
                <AvatarFallback className="bg-blue-500 text-white font-bold">
                  {internship?.organization?.charAt(0) || 'C'}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
                  {internship?.title || offer.internshipId}
                </h3>
                <p className="text-gray-600 flex items-center gap-2">
                  <Building2 className="w-4 h-4" />
                  {internship?.organization}
                </p>
              </div>
            </div>
            
            <div className="flex flex-col items-end gap-2">
              <Badge className={`${getStatusColor(offer.status)} flex items-center gap-1 capitalize`}>
                <StatusIcon className="w-3 h-3" />
                {offer.status}
              </Badge>
              {offer.status === 'offered' && (
                <CountdownTimer expiresAt={offer.expiresAt} />
              )}
            </div>
          </div>

          {/* Match Score */}
          <MatchScore score={offer.matchScore} />
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Offer Details */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-700">{internship?.location || 'Remote'}</span>
            </div>
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-700">
                ₹{(offer.stipend || internship?.stipend || 25000).toLocaleString()}/month
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-700">{offer.duration || internship?.duration || '3 months'}</span>
            </div>
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-700">{internship?.modality || 'Hybrid'}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <motion.div
              className="flex-1"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                onClick={onViewDetails}
                variant="outline"
                className="w-full border-2 border-blue-300 text-blue-700 hover:bg-blue-50 font-medium"
              >
                <Eye className="w-4 h-4 mr-2" />
                View Details
              </Button>
            </motion.div>
            
            {isActionable && (
              <>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    onClick={onAccept}
                    className="bg-green-600 hover:bg-green-700 text-white font-medium px-6"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Accept
                  </Button>
                </motion.div>
                
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    onClick={onDecline}
                    variant="outline"
                    className="border-2 border-red-300 text-red-700 hover:bg-red-50 font-medium px-6"
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Decline
                  </Button>
                </motion.div>
              </>
            )}
          </div>

          {/* Offer timestamp */}
          <div className="text-xs text-gray-500 pt-2 border-t">
            Offered on {new Date(offer.offeredAt).toLocaleDateString('en-IN', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const OffersSummary: React.FC<{ offers: Offer[] }> = ({ offers }) => {
  const stats = useMemo(() => {
    const total = offers.length;
    const accepted = offers.filter(o => o.status === 'accepted').length;
    const declined = offers.filter(o => o.status === 'declined').length;
    const pending = offers.filter(o => o.status === 'offered').length;
    const expired = offers.filter(o => o.status === 'expired').length;
    
    return { total, accepted, declined, pending, expired };
  }, [offers]);

  const chartData = useMemo(() => [
    { name: 'Pending', value: stats.pending, color: '#3b82f6' },
    { name: 'Accepted', value: stats.accepted, color: '#10b981' },
    { name: 'Declined', value: stats.declined, color: '#ef4444' },
    { name: 'Expired', value: stats.expired, color: '#6b7280' }
  ].filter(item => item.value > 0), [stats]);

  const topOffer = useMemo(() => {
    return offers
      .filter(o => o.status === 'offered')
      .sort((a, b) => b.matchScore - a.matchScore)[0];
  }, [offers]);

  if (offers.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Stats Cards */}
      <div className="lg:col-span-2 grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Offers', value: stats.total, icon: Briefcase, color: 'blue' },
          { label: 'Pending', value: stats.pending, icon: Clock, color: 'orange' },
          { label: 'Accepted', value: stats.accepted, icon: CheckCircle, color: 'green' },
          { label: 'Declined', value: stats.declined, icon: XCircle, color: 'red' }
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            variants={itemVariants}
            whileHover={{ scale: 1.02, y: -2 }}
          >
            <Card className={`
              ${stat.color === 'blue' ? 'bg-blue-50 border-blue-200' :
                stat.color === 'orange' ? 'bg-orange-50 border-orange-200' :
                stat.color === 'green' ? 'bg-green-50 border-green-200' :
                'bg-red-50 border-red-200'}
            `}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-sm font-medium mb-1 ${
                      stat.color === 'blue' ? 'text-blue-600' :
                      stat.color === 'orange' ? 'text-orange-600' :
                      stat.color === 'green' ? 'text-green-600' :
                      'text-red-600'
                    }`}>
                      {stat.label}
                    </p>
                    <p className={`text-3xl font-bold ${
                      stat.color === 'blue' ? 'text-blue-900' :
                      stat.color === 'orange' ? 'text-orange-900' :
                      stat.color === 'green' ? 'text-green-900' :
                      'text-red-900'
                    }`}>
                      {stat.value}
                    </p>
                  </div>
                  <div className={`p-3 rounded-xl ${
                    stat.color === 'blue' ? 'bg-blue-200' :
                    stat.color === 'orange' ? 'bg-orange-200' :
                    stat.color === 'green' ? 'bg-green-200' :
                    'bg-red-200'
                  }`}>
                    <stat.icon className={`w-6 h-6 ${
                      stat.color === 'blue' ? 'text-blue-700' :
                      stat.color === 'orange' ? 'text-orange-700' :
                      stat.color === 'green' ? 'text-green-700' :
                      'text-red-700'
                    }`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Pie Chart */}
      <motion.div variants={itemVariants}>
        <Card className="border border-purple-200 bg-purple-50">
          <CardHeader>
            <CardTitle className="text-purple-800 flex items-center gap-2">
              <PieChart className="w-5 h-5" />
              Offers Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent className="bg-white rounded-b-lg">
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap gap-2 justify-center mt-4">
              {chartData.map((item) => (
                <div key={item.name} className="flex items-center gap-1">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-xs text-gray-600">{item.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Top Match Offer */}
      {topOffer && (
        <motion.div variants={itemVariants} className="lg:col-span-3">
          <Card className="border-2 border-yellow-300 bg-yellow-50 relative overflow-hidden">
            <div className="absolute top-2 right-2">
              <Badge className="bg-yellow-500 text-yellow-900">
                <Star className="w-3 h-3 mr-1 fill-yellow-900" />
                Top Match
              </Badge>
            </div>
            <CardHeader>
              <CardTitle className="text-yellow-800 flex items-center gap-2">
                <Award className="w-5 h-5" />
                Highest Match Score Offer
              </CardTitle>
            </CardHeader>
            <CardContent className="bg-white rounded-b-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-gray-900">Match Score: {topOffer.matchScore}%</p>
                  <p className="text-sm text-gray-600">This offer aligns perfectly with your preferences!</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-yellow-600">{topOffer.matchScore}%</p>
                  <p className="text-sm text-gray-600">Match</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
};

const EmptyState: React.FC = () => {
  return (
    <motion.div 
      variants={itemVariants}
      className="text-center py-16"
    >
      <Card className="max-w-md mx-auto border-2 border-dashed border-gray-300">
        <CardContent className="p-12">
          <div className="w-20 h-20 mx-auto mb-6 bg-blue-100 rounded-full flex items-center justify-center">
            <Briefcase className="w-10 h-10 text-blue-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No offers yet</h3>
          <p className="text-gray-600 mb-6 leading-relaxed">
            Keep applying and check back soon! Great opportunities are waiting for you.
          </p>
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button className="bg-blue-600 hover:bg-blue-700 text-white font-medium">
              <Target className="w-4 h-4 mr-2" />
              Browse Recommendations
            </Button>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

// Main Component
export const Offers: React.FC = () => {
  const { offers, acceptOffer, declineOffer } = useStudent();
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  
  const byId = useMemo(() => Object.fromEntries(SAMPLE_INTERNSHIPS.map(i => [i.id, i])), []);
  
  // Enhanced offers with mock data for demonstration
  const enhancedOffers: Offer[] = useMemo(() => {
    if (offers.length === 0) {
      // Mock data for demonstration
      return [
        {
          id: '1',
          applicationId: 'app-001',
          internshipId: 'intern-001',
          status: 'offered',
          offeredAt: '2025-09-25T10:00:00Z',
          expiresAt: '2025-10-05T23:59:59Z',
          matchScore: 92,
          stipend: 35000,
          duration: '3 months',
          startDate: '2025-11-01',
          companyContact: {
            name: 'Sarah Johnson',
            email: 'sarah.johnson@techcorp.com',
            phone: '+91 9876543210'
          }
        },
        {
          id: '2',
          applicationId: 'app-002',
          internshipId: 'intern-002',
          status: 'offered',
          offeredAt: '2025-09-28T14:30:00Z',
          expiresAt: '2025-10-08T23:59:59Z',
          matchScore: 85,
          stipend: 28000,
          duration: '4 months',
          startDate: '2025-11-15'
        },
        {
          id: '3',
          applicationId: 'app-003',
          internshipId: 'intern-003',
          status: 'accepted',
          offeredAt: '2025-09-20T09:15:00Z',
          expiresAt: '2025-09-30T23:59:59Z',
          matchScore: 78,
          stipend: 30000,
          duration: '6 months',
          startDate: '2025-10-15'
        },
        {
          id: '4',
          applicationId: 'app-004',
          internshipId: 'intern-004',
          status: 'declined',
          offeredAt: '2025-09-22T16:45:00Z',
          expiresAt: '2025-10-02T23:59:59Z',
          matchScore: 65,
          stipend: 22000,
          duration: '3 months',
          startDate: '2025-11-01'
        }
      ];
    }
    return offers.map((offer, index) => ({
      ...offer,
      matchScore: Math.floor(Math.random() * 30) + 70, // 70-100%
      stipend: Math.floor(Math.random() * 25000) + 15000, // 15k-40k
      duration: ['3 months', '4 months', '6 months'][Math.floor(Math.random() * 3)],
      startDate: new Date(Date.now() + (30 + index * 15) * 24 * 60 * 60 * 1000).toISOString(),
      expiresAt: new Date(Date.now() + (7 + index * 2) * 24 * 60 * 60 * 1000).toISOString()
    }));
  }, [offers]);

  const handleAcceptOffer = useCallback((offer: Offer) => {
    acceptOffer(offer.applicationId);
    toast('Offer accepted successfully!', {
      description: 'Congratulations! You can now prepare for your internship.'
    });
    setDetailsModalOpen(false);
  }, [acceptOffer]);

  const handleDeclineOffer = useCallback((offer: Offer) => {
    declineOffer(offer.applicationId);
    toast('Offer declined', {
      description: 'The offer has been declined successfully.'
    });
    setDetailsModalOpen(false);
  }, [declineOffer]);

  const handleViewDetails = useCallback((offer: Offer) => {
    setSelectedOffer(offer);
    setDetailsModalOpen(true);
  }, []);

  if (enhancedOffers.length === 0) {
    return (
      <DashboardLayout title="Your Offers">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="text-center space-y-4">
            <h1 className="text-5xl font-black text-gray-900">Your Offers</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Track and manage your internship offers in one place. Every offer brings you closer to your career goals.
            </p>
          </motion.div>

          <EmptyState />
        </motion.div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Your Offers">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-8"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="text-center space-y-4">
          <h1 className="text-5xl font-black text-gray-900">Your Offers</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Track and manage your internship offers in one place. Every offer brings you closer to your career goals.
          </p>
          <div className="flex items-center justify-center gap-6 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span>Secure Process</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-blue-600" />
              <span>Verified Offers</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 text-yellow-600" />
              <span>Best Matches</span>
            </div>
          </div>
        </motion.div>

        {/* Offers Summary */}
        <motion.div variants={itemVariants}>
          <OffersSummary offers={enhancedOffers} />
        </motion.div>

        {/* Offers List */}
        <div className="space-y-6">
          <motion.div variants={itemVariants}>
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">All Offers</h2>
              <Badge className="bg-blue-100 text-blue-700">
                {enhancedOffers.length} total
              </Badge>
            </div>
          </motion.div>

          <motion.div
            variants={containerVariants}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          >
            {enhancedOffers.map((offer) => {
              const internship = byId[offer.internshipId];
              return (
                <OfferCard
                  key={offer.id}
                  offer={offer}
                  internship={internship}
                  onAccept={() => handleAcceptOffer(offer)}
                  onDecline={() => handleDeclineOffer(offer)}
                  onViewDetails={() => handleViewDetails(offer)}
                />
              );
            })}
          </motion.div>
        </div>

        {/* Offer Details Modal */}
        {selectedOffer && (
          <OfferDetailsModal
            offer={selectedOffer}
            internship={byId[selectedOffer.internshipId]}
            isOpen={detailsModalOpen}
            onClose={() => setDetailsModalOpen(false)}
            onAccept={() => handleAcceptOffer(selectedOffer)}
            onDecline={() => handleDeclineOffer(selectedOffer)}
          />
        )}

        {/* Footer CTA */}
        <motion.div variants={itemVariants} className="text-center py-8">
          <Card className="max-w-2xl mx-auto border border-gray-200">
            <CardContent className="p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Ready to explore more opportunities?
              </h3>
              <p className="text-gray-600 mb-6">
                Discover more internships that match your skills and preferences.
              </p>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button className="bg-blue-600 hover:bg-blue-700 text-white font-medium">
                  <ArrowRight className="w-4 h-4 mr-2" />
                  Browse Recommendations
                </Button>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </DashboardLayout>
  );
};

export default Offers;
