import React, { useState, useEffect } from 'react';
import { motion, useInView, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Link } from 'react-router-dom';
import {
  Bell, ClipboardList, Clock, FileText, GraduationCap, Scale, Shield, Users, Building2, Rocket,
  Search, ChevronRight, MessageCircle, Phone, Mail, HelpCircle, BookOpen,
  ArrowRight, Star, ThumbsUp, Filter, Download, ExternalLink, Sparkles,
  Zap, Target, Award, Globe, Lock, Eye, UserCheck, AlertTriangle, CheckCircle,
  TrendingUp, BarChart3, PieChart, Settings, Lightbulb, Brain, Briefcase, MousePointer, Edit
} from 'lucide-react';
import aiImg from '@/assets/ai-allocation.jpg';

// Enhanced Pill Component with animation
const Pill: React.FC<{ 
  children: React.ReactNode; 
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'info';
  icon?: React.ReactNode;
}> = ({ children, variant = 'default', icon }) => {
  const variants = {
    default: 'bg-secondary/10 text-secondary border-secondary/20 hover:bg-secondary/15',
    primary: 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100',
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100',
    warning: 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100',
    info: 'bg-teal-50 text-teal-700 border-teal-200 hover:bg-teal-100'
  };
  
  return (
    <motion.span 
      className={`inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-full border transition-all duration-300 cursor-default ${variants[variant]}`}
      whileHover={{ scale: 1.05, y: -1 }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      {icon && <span className="mr-1.5">{icon}</span>}
      {children}
    </motion.span>
  );
};

// Animated Counter Component
const AnimatedCounter: React.FC<{ value: number; suffix?: string; duration?: number }> = ({ 
  value, 
  suffix = '', 
  duration = 2 
}) => {
  const [count, setCount] = useState(0);
  const ref = React.useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      let start = 0;
      const end = value;
      const increment = end / (duration * 60);
      
      const timer = setInterval(() => {
        start += increment;
        if (start >= end) {
          setCount(end);
          clearInterval(timer);
        } else {
          setCount(Math.floor(start));
        }
      }, 1000 / 60);

      return () => clearInterval(timer);
    }
  }, [isInView, value, duration]);

  return <span ref={ref}>{count}{suffix}</span>;
};

// Enhanced FAQ Item Component
const FAQItem: React.FC<{
  question: string;
  answer: React.ReactNode;
  category?: string;
  helpful?: boolean;
  searchTerm?: string;
}> = ({ question, answer, category, helpful = false, searchTerm }) => {
  const [isHelpful, setIsHelpful] = useState(false);
  const [helpfulCount, setHelpfulCount] = useState(Math.floor(Math.random() * 50) + 5);

  const highlightText = (text: string, term: string) => {
    if (!term) return text;
    const regex = new RegExp(`(${term})`, 'gi');
    const parts = text.split(regex);
    return parts.map((part, index) => 
      regex.test(part) ? <mark key={index} className="bg-yellow-200 px-1 rounded">{part}</mark> : part
    );
  };

  return (
    <AccordionItem value={question} className="border border-gray-200 rounded-lg mb-3 overflow-hidden hover:shadow-md transition-all duration-300">
      <AccordionTrigger className="px-6 py-4 hover:bg-gray-50 text-left">
        <div className="flex items-start justify-between w-full">
          <span className="font-medium text-gray-900 pr-4">
            {searchTerm ? highlightText(question, searchTerm) : question}
          </span>
          {category && (
            <Badge variant="outline" className="ml-2 text-xs shrink-0">
              {category}
            </Badge>
          )}
        </div>
      </AccordionTrigger>
      <AccordionContent className="px-6 pb-6">
        <div className="space-y-4">
          <div className="text-gray-600 leading-relaxed">
            {typeof answer === 'string' ? (searchTerm ? highlightText(answer, searchTerm) : answer) : answer}
          </div>
          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-500">Was this helpful?</span>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className={`text-emerald-600 hover:bg-emerald-50 ${isHelpful ? 'bg-emerald-50' : ''}`}
                  onClick={() => {
                    setIsHelpful(!isHelpful);
                    setHelpfulCount(prev => isHelpful ? prev - 1 : prev + 1);
                  }}
                >
                  <ThumbsUp className="w-4 h-4 mr-1" />
                  Yes ({helpfulCount})
                </Button>
              </div>
            </div>
            <Button variant="ghost" size="sm" className="text-blue-600 hover:bg-blue-50">
              <MessageCircle className="w-4 h-4 mr-1" />
              Contact Support
            </Button>
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};

// Statistics Component
const StatCard: React.FC<{ 
  icon: React.ReactNode; 
  value: number; 
  label: string; 
  color: string;
}> = ({ icon, value, label, color }) => (
  <motion.div
    className={`bg-gradient-to-br from-${color}-50 to-${color}-100 p-6 rounded-xl border border-${color}-200`}
    whileHover={{ scale: 1.05, y: -5 }}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <div className="flex items-center justify-between">
      <div>
        <div className={`text-2xl font-bold text-${color}-700 mb-1`}>
          <AnimatedCounter value={value} />
        </div>
        <div className={`text-sm font-medium text-${color}-600`}>{label}</div>
      </div>
      <div className={`p-3 bg-${color}-200 rounded-lg text-${color}-700`}>
        {icon}
      </div>
    </div>
  </motion.div>
);

const FAQ: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activeTab, setActiveTab] = useState('general');
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);

  // FAQ data structure
  const faqData = {
    general: [
      {
        question: "What is the Smart Allocation Engine?",
        answer: "It's a fair and transparent matching platform for the PM Internship Scheme (SIH 2024, PS 25033). Students get explainable recommendations, hosts get capacity-aware shortlisting, and authorities get bias monitoring and audit trails.",
        category: "Overview"
      },
      {
        question: "How does the matching score work?",
        answer: (
          <div className="space-y-3">
            <p>The score factors include:</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Required skill coverage and proficiency levels</li>
              <li>Preferred skills alignment and expertise</li>
              <li>Location, sector, and work modality preferences</li>
              <li>Student preferences and career goals</li>
              <li>Past experience and academic background</li>
            </ul>
            <p className="text-sm bg-blue-50 p-3 rounded-lg border border-blue-200">
              💡 <strong>Pro Tip:</strong> We surface the top reasons contributing to each score so applicants and hosts can understand the match quality.
            </p>
          </div>
        ),
        category: "Matching"
      },
      {
        question: "Is the allocation fair and unbiased?",
        answer: (
          <div className="space-y-3">
            <p>We use fairness-first design principles:</p>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-emerald-50 p-3 rounded-lg border border-emerald-200">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="w-4 h-4 text-emerald-600" />
                  <span className="font-semibold text-emerald-800">Consent-driven</span>
                </div>
                <p className="text-sm text-emerald-700">Sensitive attributes handled with explicit consent only</p>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                <div className="flex items-center gap-2 mb-2">
                  <Eye className="w-4 h-4 text-blue-600" />
                  <span className="font-semibold text-blue-800">Transparent</span>
                </div>
                <p className="text-sm text-blue-700">Explainable AI with clear reasoning</p>
              </div>
            </div>
            <p>Administrators can review distributions and intervene per policy guidelines.</p>
          </div>
        ),
        category: "Fairness"
      }
    ],
    students: [
      {
        question: "How do I apply to an internship?",
        answer: (
          <div className="space-y-3">
            <p>Follow these simple steps:</p>
            <div className="space-y-3">
              {[
                { step: 1, text: "Go to Recommendations page", icon: <Target className="w-4 h-4" /> },
                { step: 2, text: "Click 'Apply' on an opportunity", icon: <MousePointer className="w-4 h-4" /> },
                { step: 3, text: "Fill the dynamic application form", icon: <FileText className="w-4 h-4" /> },
                { step: 4, text: "Add cover letter and preferred start date", icon: <Edit className="w-4 h-4" /> },
                { step: 5, text: "Submit your application", icon: <CheckCircle className="w-4 h-4" /> }
              ].map(({ step, text, icon }) => (
                <div key={step} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                  <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold">
                    {step}
                  </div>
                  <div className="text-blue-600">{icon}</div>
                  <span className="text-sm">{text}</span>
                </div>
              ))}
            </div>
            <div className="bg-amber-50 p-3 rounded-lg border border-amber-200">
              <p className="text-sm text-amber-800">
                <Zap className="w-4 h-4 inline mr-1" />
                <strong>Bulk Apply:</strong> Select multiple roles and apply with a single form!
              </p>
            </div>
          </div>
        ),
        category: "Application"
      },
      {
        question: "Can I save drafts while filling the form?",
        answer: "Yes! Drafts auto-save as you type and can be manually saved. You can return anytime to continue. Drafts are stored locally in your browser in this prototype.",
        category: "Application"
      },
      {
        question: "How do deadline reminders work?",
        answer: (
          <div className="space-y-3">
            <p>Our smart reminder system keeps you on track:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
                <Bell className="w-4 h-4 text-purple-600 mb-2" />
                <p className="text-sm text-purple-800"><strong>In-app notifications</strong><br />Real-time alerts while using the platform</p>
              </div>
              <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                <Clock className="w-4 h-4 text-green-600 mb-2" />
                <p className="text-sm text-green-800"><strong>Deadline tracking</strong><br />48h and 4h before deadlines</p>
              </div>
            </div>
          </div>
        ),
        category: "Notifications"
      }
    ],
    hosts: [
      {
        question: "How do we ensure candidates meet required skills?",
        answer: "Students must confirm required skills during application. The engine emphasizes required-skill coverage and shows reasons behind each match for transparency.",
        category: "Matching"
      },
      {
        question: "Can we manage capacity and locations?",
        answer: "Yes. Opportunities can define capacity, locations, modality, and duration. Matching respects these constraints when ranking and shortlisting.",
        category: "Management"
      }
    ],
    technical: [
      {
        question: "What technologies power the platform?",
        answer: (
          <div className="space-y-3">
            <p>Our modern tech stack ensures performance and reliability:</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {['React', 'TypeScript', 'Node.js', 'AI/ML', 'PostgreSQL', 'AWS'].map(tech => (
                <Badge key={tech} variant="outline" className="justify-center">{tech}</Badge>
              ))}
            </div>
          </div>
        ),
        category: "Technical"
      }
    ]
  };

  // Filter FAQs based on search and category
  const filteredFAQs = React.useMemo(() => {
    let faqs = faqData[activeTab as keyof typeof faqData] || [];
    
    if (searchTerm) {
      faqs = faqs.filter(faq => 
        faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (typeof faq.answer === 'string' && faq.answer.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    if (selectedCategory !== 'all') {
      faqs = faqs.filter(faq => faq.category === selectedCategory);
    }
    
    return faqs;
  }, [activeTab, searchTerm, selectedCategory, faqData]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        duration: 0.6
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      {/* Enhanced Hero Section */}
      <div className="relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-blue-700 to-teal-600 opacity-90" />
          <motion.div 
            className="absolute inset-0 opacity-30"
            style={{ y }}
          >
            <div className="w-full h-full bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.4),transparent_70%)]"></div>
          </motion.div>
        </div>
        
        <div className="container mx-auto px-4 py-16 lg:py-24 relative z-10">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
          >
            <motion.div variants={itemVariants} className="space-y-8 text-white">
              <div className="space-y-4">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <Badge className="bg-white/20 text-white border-white/30 hover:bg-white/30 transition-colors">
                    <Sparkles className="w-4 h-4 mr-2" />
                    Frequently Asked Questions
                  </Badge>
                </motion.div>
                <motion.h1 
                  className="text-4xl lg:text-6xl font-bold tracking-tight"
                  initial={{ opacity: 0, y: -30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  Get All Your
                  <span className="block bg-gradient-to-r from-yellow-300 to-amber-300 bg-clip-text text-transparent">
                    Questions Answered
                  </span>
                </motion.h1>
                <motion.p 
                  className="text-xl text-blue-100 leading-relaxed max-w-2xl"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  Everything you need to know about the PM Internship Scheme Smart Allocation Engine—built for SIH 2024 (Problem Statement 25033).
                </motion.p>
              </div>
              
              <motion.div 
                className="flex flex-wrap gap-4"
                variants={itemVariants}
              >
                <Link to="/register">
                  <Button size="lg" className="bg-white text-blue-700 hover:bg-blue-50 shadow-lg hover:shadow-xl transition-all duration-300">
                    <Rocket className="w-5 h-5 mr-2" />
                    Get Started Now
                  </Button>
                </Link>
                <Link to="/about">
                  <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-blue-700 transition-all duration-300">
                    <BookOpen className="w-5 h-5 mr-2" />
                    Learn More
                  </Button>
                </Link>
              </motion.div>
              
              <motion.div 
                className="flex flex-wrap gap-3 pt-4"
                variants={containerVariants}
              >
                <Pill variant="info" icon={<GraduationCap className="h-3.5 w-3.5" />}>Students</Pill>
                <Pill variant="success" icon={<Building2 className="h-3.5 w-3.5" />}>Organizations</Pill>
                <Pill variant="warning" icon={<Users className="h-3.5 w-3.5" />}>Administrators</Pill>
                <Pill variant="primary" icon={<Shield className="h-3.5 w-3.5" />}>Privacy</Pill>
                <Pill variant="default" icon={<Scale className="h-3.5 w-3.5" />}>Fairness</Pill>
              </motion.div>
            </motion.div>
            
            <motion.div 
              variants={itemVariants}
              className="relative"
            >
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white/20 backdrop-blur-sm">
                <img 
                  src={aiImg} 
                  alt="Smart allocation and fair matching" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
              </div>
              
              {/* Floating Stats */}
              <motion.div
                className="absolute -bottom-6 -left-6 bg-white rounded-xl p-4 shadow-xl border border-gray-200"
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-100 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <div className="text-lg font-bold text-gray-900">
                      <AnimatedCounter value={98} suffix="%" />
                    </div>
                    <div className="text-sm text-gray-600">Match Accuracy</div>
                  </div>
                </div>
              </motion.div>
              
              <motion.div
                className="absolute -top-6 -right-6 bg-white rounded-xl p-4 shadow-xl border border-gray-200"
                initial={{ opacity: 0, scale: 0.8, y: -20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1 }}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Users className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-lg font-bold text-gray-900">
                      <AnimatedCounter value={25000} suffix="+" />
                    </div>
                    <div className="text-sm text-gray-600">Active Users</div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 lg:py-16 space-y-12">
        {/* Platform Statistics */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6"
        >
          <StatCard
            icon={<Users className="w-6 h-6" />}
            value={25000}
            label="Active Students"
            color="blue"
          />
          <StatCard
            icon={<Building2 className="w-6 h-6" />}
            value={500}
            label="Partner Organizations"
            color="emerald"
          />
          <StatCard
            icon={<Briefcase className="w-6 h-6" />}
            value={12000}
            label="Internships Posted"
            color="amber"
          />
          <StatCard
            icon={<Award className="w-6 h-6" />}
            value={98}
            label="Success Rate %"
            color="purple"
          />
        </motion.div>

        {/* Enhanced Search and Filter Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="bg-white/80 backdrop-blur-lg border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="w-5 h-5 text-blue-600" />
                Find Your Answer
              </CardTitle>
              <CardDescription>
                Search through our comprehensive FAQ database or browse by category
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    placeholder="Search for questions, topics, or keywords..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 h-12 text-lg"
                  />
                </div>
                <Button 
                  variant="outline" 
                  className="h-12 px-6"
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('all');
                  }}
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Clear Filters
                </Button>
              </div>
              
              {searchTerm && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="bg-blue-50 p-3 rounded-lg border border-blue-200"
                >
                  <p className="text-sm text-blue-800">
                    Found <strong>{filteredFAQs.length}</strong> results for "<strong>{searchTerm}</strong>"
                  </p>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Enhanced FAQ Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 h-14 bg-white/80 backdrop-blur-lg shadow-lg border-0">
              <TabsTrigger 
                value="general" 
                className="data-[state=active]:bg-blue-500 data-[state=active]:text-white font-medium transition-all duration-300"
              >
                <HelpCircle className="w-4 h-4 mr-2" />
                General
              </TabsTrigger>
              <TabsTrigger 
                value="students"
                className="data-[state=active]:bg-emerald-500 data-[state=active]:text-white font-medium transition-all duration-300"
              >
                <GraduationCap className="w-4 h-4 mr-2" />
                Students
              </TabsTrigger>
              <TabsTrigger 
                value="hosts"
                className="data-[state=active]:bg-amber-500 data-[state=active]:text-white font-medium transition-all duration-300"
              >
                <Building2 className="w-4 h-4 mr-2" />
                Organizations
              </TabsTrigger>
              <TabsTrigger 
                value="technical"
                className="data-[state=active]:bg-purple-500 data-[state=active]:text-white font-medium transition-all duration-300"
              >
                <Settings className="w-4 h-4 mr-2" />
                Technical
              </TabsTrigger>
            </TabsList>

            {Object.entries(faqData).map(([key, faqs]) => (
              <TabsContent key={key} value={key} className="space-y-6">
                <Card className="bg-white/80 backdrop-blur-lg border-0 shadow-xl">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="capitalize flex items-center gap-2">
                          {key === 'general' && <HelpCircle className="w-5 h-5 text-blue-600" />}
                          {key === 'students' && <GraduationCap className="w-5 h-5 text-emerald-600" />}
                          {key === 'hosts' && <Building2 className="w-5 h-5 text-amber-600" />}
                          {key === 'technical' && <Settings className="w-5 h-5 text-purple-600" />}
                          {key} Questions
                        </CardTitle>
                        <CardDescription>
                          {key === 'general' && 'Core concepts and platform overview'}
                          {key === 'students' && 'Applications, profiles, and recommendations'}
                          {key === 'hosts' && 'Organization setup and candidate management'}
                          {key === 'technical' && 'Technical specifications and integrations'}
                        </CardDescription>
                      </div>
                      <Badge variant="outline" className="font-medium">
                        {filteredFAQs.length} Questions
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Accordion type="single" collapsible className="w-full space-y-0">
                      <AnimatePresence>
                        {filteredFAQs.length > 0 ? (
                          filteredFAQs.map((faq, index) => (
                            <motion.div
                              key={faq.question}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -20 }}
                              transition={{ duration: 0.3, delay: index * 0.1 }}
                            >
                              <FAQItem
                                question={faq.question}
                                answer={faq.answer}
                                category={faq.category}
                                searchTerm={searchTerm}
                              />
                            </motion.div>
                          ))
                        ) : (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center py-12"
                          >
                            <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">No questions found</h3>
                            <p className="text-gray-600 mb-4">
                              {searchTerm ? 
                                `No results found for "${searchTerm}". Try different keywords or browse other categories.` :
                                'No questions available in this category yet.'
                              }
                            </p>
                            <Button 
                              variant="outline" 
                              onClick={() => {
                                setSearchTerm('');
                                setActiveTab('general');
                              }}
                            >
                              Browse All Questions
                            </Button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </Accordion>
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>
        </motion.div>

        {/* Enhanced Feature Highlights */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        >
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-800">
                <Brain className="h-5 w-5" />
                AI-Powered Matching
              </CardTitle>
              <CardDescription className="text-blue-700">
                Advanced algorithms for precise candidate-opportunity matching
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-blue-700">
                <CheckCircle className="h-4 w-4" />
                <span className="text-sm">Smart skill assessment</span>
              </div>
              <div className="flex items-center gap-2 text-blue-700">
                <CheckCircle className="h-4 w-4" />
                <span className="text-sm">Preference-based recommendations</span>
              </div>
              <div className="flex items-center gap-2 text-blue-700">
                <CheckCircle className="h-4 w-4" />
                <span className="text-sm">Real-time match scoring</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200 hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-emerald-800">
                <Shield className="h-5 w-5" />
                Fair & Transparent
              </CardTitle>
              <CardDescription className="text-emerald-700">
                Bias-free allocation with complete transparency
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-emerald-700">
                <CheckCircle className="h-4 w-4" />
                <span className="text-sm">Explainable AI decisions</span>
              </div>
              <div className="flex items-center gap-2 text-emerald-700">
                <CheckCircle className="h-4 w-4" />
                <span className="text-sm">Audit trail for all actions</span>
              </div>
              <div className="flex items-center gap-2 text-emerald-700">
                <CheckCircle className="h-4 w-4" />
                <span className="text-sm">Bias monitoring dashboard</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200 hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-amber-800">
                <Zap className="h-5 w-5" />
                Efficient Process
              </CardTitle>
              <CardDescription className="text-amber-700">
                Streamlined application and selection workflow
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-amber-700">
                <CheckCircle className="h-4 w-4" />
                <span className="text-sm">One-click applications</span>
              </div>
              <div className="flex items-center gap-2 text-amber-700">
                <CheckCircle className="h-4 w-4" />
                <span className="text-sm">Automated shortlisting</span>
              </div>
              <div className="flex items-center gap-2 text-amber-700">
                <CheckCircle className="h-4 w-4" />
                <span className="text-sm">Real-time status updates</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Contact Support Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <Card className="bg-gradient-to-r from-blue-600 to-teal-600 text-white border-0 shadow-2xl">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                <MessageCircle className="h-6 w-6" />
                Still Need Help?
              </CardTitle>
              <CardDescription className="text-blue-100 text-lg">
                Our support team is here to help you succeed
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex items-center gap-3 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
                  <Mail className="h-6 w-6 text-blue-200" />
                  <div>
                    <div className="font-semibold">Email Support</div>
                    <div className="text-sm text-blue-200">support@pminternship.gov.in</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
                  <Phone className="h-6 w-6 text-blue-200" />
                  <div>
                    <div className="font-semibold">Phone Support</div>
                    <div className="text-sm text-blue-200">1800-123-4567</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
                  <MessageCircle className="h-6 w-6 text-blue-200" />
                  <div>
                    <div className="font-semibold">Live Chat</div>
                    <div className="text-sm text-blue-200">Available 24/7</div>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-4">
                <Button size="lg" className="bg-white text-blue-700 hover:bg-blue-50">
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Start Live Chat
                </Button>
                <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-blue-700">
                  <FileText className="w-5 h-5 mr-2" />
                  Download Guide
                </Button>
                <Link to="/">
                  <Button variant="ghost" size="lg" className="text-white hover:bg-white/10">
                    <ArrowRight className="w-5 h-5 mr-2" />
                    Back to Home
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Footer CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="text-center py-8"
        >
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-gray-900">Ready to Get Started?</h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Join thousands of students and organizations using our smart allocation platform
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/register">
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700">
                  <Rocket className="w-5 h-5 mr-2" />
                  Create Account
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="outline" size="lg">
                  <UserCheck className="w-5 h-5 mr-2" />
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Built for Smart India Hackathon 2024 • Problem Statement 25033 • PM Internship Scheme
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default FAQ;
