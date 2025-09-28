import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useInView, AnimatePresence, Variants } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Link } from 'react-router-dom';
import {
  Shield, Brain, Users, Globe, Zap, Award, CheckCircle, ArrowRight,
  Target, Sparkles, Database, Lock, Clock, TrendingUp, Star, Crown,
  Layers, Cpu, MousePointer, Rocket, Building2, GraduationCap, Eye,
  Heart, Lightbulb, Infinity as InfinityIcon, CircuitBoard, Smartphone, Monitor, Bell,
  ChevronDown, ChevronUp, Play, Pause, Volume2, VolumeX, Share2,
  MessageCircle, Download, Send, Mail, Phone, MapPin, Search,
  Filter, Calendar, Settings, BookOpen, FileText, Camera, Video,
  BarChart3, PieChart, LineChart, Activity, Code, Palette, Coffee
} from 'lucide-react';

// Enhanced Custom Components
const InteractiveOrb: React.FC<{ 
  size?: string; 
  color?: string; 
  delay?: number; 
  className?: string;
  onClick?: () => void;
}> = ({ size = "w-32 h-32", color = "bg-blue-500", delay = 0, className = "", onClick }) => (
  <motion.div
    className={`${size} ${color} rounded-full absolute opacity-20 blur-xl cursor-pointer ${className}`}
    animate={{
      x: [0, 50, -50, 0],
      y: [0, -50, 50, 0],
      scale: [1, 1.2, 0.8, 1],
    }}
    transition={{
      duration: 10,
      repeat: Infinity,
      ease: "easeInOut",
      delay
    }}
    whileHover={{ scale: 1.5, opacity: 0.4 }}
    onClick={onClick}
  />
);

const AnimatedParticleField: React.FC = () => {
  const [particleCount, setParticleCount] = useState(40);
  
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(particleCount)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-blue-500 rounded-full opacity-30"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.3, 0.8, 0.3],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: 4 + Math.random() * 3,
            repeat: Infinity,
            delay: Math.random() * 3,
          }}
        />
      ))}
    </div>
  );
};

const ScrollProgress: React.FC = () => {
  const { scrollYProgress } = useScroll();
  const [scrollPercentage, setScrollPercentage] = useState(0);

  useEffect(() => {
    const unsubscribe = scrollYProgress.onChange((latest) => {
      setScrollPercentage(Math.round(latest * 100));
    });
    return () => unsubscribe();
  }, [scrollYProgress]);

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      <motion.div
        className="h-1 bg-blue-600 origin-left"
        style={{ scaleX: scrollYProgress }}
      />
      <div className="absolute top-2 right-4 bg-white/90 backdrop-blur-lg px-3 py-1 rounded-full text-xs font-semibold text-blue-600 shadow-lg">
        {scrollPercentage}%
      </div>
    </div>
  );
};

const LiveCounter: React.FC<{ 
  end: number; 
  suffix?: string; 
  duration?: number;
  label: string;
}> = ({ end, suffix = '', duration = 2000, label }) => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const countRef = useRef<HTMLDivElement>(null); // Fixed ref type
  const inView = useInView(countRef, { once: true });

  useEffect(() => {
    if (inView && !isVisible) {
      setIsVisible(true);
      let startTime = Date.now();
      const animate = () => {
        const now = Date.now();
        const progress = Math.min((now - startTime) / duration, 1);
        setCount(Math.floor(progress * end));
        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };
      animate();
    }
  }, [inView, end, duration, isVisible]);

  return (
    <motion.div 
      ref={countRef} // Fixed ref assignment
      className="text-center bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-gray-200 hover:shadow-2xl transition-all duration-300 group cursor-pointer"
      whileHover={{ scale: 1.05, y: -5 }}
      whileTap={{ scale: 0.98 }}
    >
      <motion.div className="text-5xl font-black text-blue-600 mb-2 group-hover:scale-110 transition-transform duration-300">
        {count.toLocaleString()}{suffix}
      </motion.div>
      <div className="text-sm text-gray-600 font-semibold uppercase tracking-wider">
        {label}
      </div>
      <div className="mt-2 w-full bg-gray-200 rounded-full h-1">
        <motion.div
          className="bg-blue-600 h-1 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: isVisible ? '100%' : '0%' }}
          transition={{ duration: 1, delay: 0.5 }}
        />
      </div>
    </motion.div>
  );
};

const InteractiveCard: React.FC<{
  icon: React.ComponentType<any>;
  title: string;
  description: string;
  features: string[];
  index: number;
  color?: string;
  isExpanded?: boolean;
  onToggle?: () => void;
}> = ({ icon: Icon, title, description, features, index, color = "blue", isExpanded = false, onToggle }) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 20;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 20;
    setMousePosition({ x, y });
  };

  const colorMap = {
    blue: { bg: 'bg-blue-600', text: 'text-blue-600', light: 'bg-blue-50' },
    purple: { bg: 'bg-purple-600', text: 'text-purple-600', light: 'bg-purple-50' },
    teal: { bg: 'bg-teal-600', text: 'text-teal-600', light: 'bg-teal-50' },
    green: { bg: 'bg-green-600', text: 'text-green-600', light: 'bg-green-50' }
  };

  const colors = colorMap[color as keyof typeof colorMap] || colorMap.blue;

  return (
    <motion.div
      className="group perspective-1000"
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: index * 0.2 }}
      viewport={{ once: true }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setMousePosition({ x: 0, y: 0 });
        setIsHovered(false);
      }}
    >
      <motion.div
        className="relative h-full bg-white/90 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-gray-200 overflow-hidden hover:shadow-3xl transition-all duration-500 cursor-pointer"
        style={{
          transform: `rotateX(${mousePosition.y}deg) rotateY(${mousePosition.x}deg)`,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        onClick={onToggle}
      >
        {/* Interactive Background Effects */}
        <motion.div 
          className={`absolute inset-0 ${colors.light} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
          animate={{ 
            background: isHovered ? 
              `radial-gradient(circle at ${((mousePosition.x / 20) + 0.5) * 100}% ${((mousePosition.y / 20) + 0.5) * 100}%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)` 
              : 'none'
          }}
        />
        
        {/* Animated Border Lines */}
        <div className="absolute inset-0 overflow-hidden rounded-3xl">
          <motion.div
            className={`absolute top-0 left-0 w-full h-px ${colors.bg} opacity-30`}
            animate={{ x: [-100, 100] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            className={`absolute bottom-0 right-0 w-px h-full ${colors.bg} opacity-30`}
            animate={{ y: [-100, 100] }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          />
        </div>

        <div className="relative z-10">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <motion.div
              className={`w-20 h-20 ${colors.bg} rounded-3xl flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}
            >
              <Icon className="h-10 w-10 text-white" />
            </motion.div>
            
            <motion.button
              className={`p-2 rounded-full ${colors.light} ${colors.text} hover:scale-110 transition-transform duration-200`}
              whileHover={{ rotate: 180 }}
              whileTap={{ scale: 0.9 }}
            >
              {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
            </motion.button>
          </div>
          
          <h3 className="text-2xl font-black text-gray-900 mb-4">
            {title}
          </h3>
          
          <p className="text-gray-600 leading-relaxed mb-6">
            {description}
          </p>

          {/* Expandable Features */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-3"
              >
                {features.map((feature, featureIndex) => (
                  <motion.div
                    key={feature}
                    className="flex items-center gap-3 text-sm text-gray-700 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: featureIndex * 0.1 }}
                  >
                    <div className={`w-2 h-2 ${colors.bg} rounded-full flex-shrink-0`} />
                    <span>{feature}</span>
                  </motion.div>
                ))}
                
                {/* Action Buttons */}
                <div className="flex gap-2 mt-4">
                  <motion.button
                    className={`px-4 py-2 ${colors.bg} text-white rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity duration-200`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Learn More
                  </motion.button>
                  <motion.button
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-300 transition-colors duration-200"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Share2 className="h-4 w-4" />
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Interactive Dots */}
        <div className="absolute top-6 right-6 flex gap-2">
          <motion.div
            className={`w-3 h-3 ${colors.bg} rounded-full opacity-40`}
            animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.8, 0.4] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <motion.div
            className="w-2 h-2 bg-gray-400 rounded-full opacity-20"
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
          />
        </div>
      </motion.div>
    </motion.div>
  );
};

const InteractiveTimeline: React.FC<{
  steps: Array<{
    step: string;
    title: string;
    description: string;
    details: string[];
    icon: React.ComponentType<any>;
    color: string;
  }>;
}> = ({ steps }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setActiveStep((current) => (current + 1) % steps.length);
          return 0;
        }
        return prev + 2;
      });
    }, 100);

    return () => clearInterval(timer);
  }, [steps.length]);

  return (
    <div className="max-w-4xl mx-auto">
      {/* Timeline Navigation */}
      <div className="flex justify-center mb-12">
        <div className="flex items-center gap-4 bg-white/80 backdrop-blur-lg rounded-2xl p-2 shadow-xl border border-gray-200">
          {steps.map((step, index) => (
            <motion.button
              key={step.step}
              onClick={() => setActiveStep(index)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 ${
                activeStep === index 
                  ? `${step.color === 'blue' ? 'bg-blue-600' : step.color === 'purple' ? 'bg-purple-600' : step.color === 'teal' ? 'bg-teal-600' : 'bg-green-600'} text-white shadow-lg` 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <step.icon className="h-4 w-4" />
              <span className="text-sm font-semibold hidden sm:block">{step.step}</span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <motion.div
            className="bg-blue-600 h-2 rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Active Step Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeStep}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.5 }}
          className="bg-white/90 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-gray-200"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className={`w-16 h-16 ${steps[activeStep].color === 'blue' ? 'bg-blue-600' : steps[activeStep].color === 'purple' ? 'bg-purple-600' : steps[activeStep].color === 'teal' ? 'bg-teal-600' : 'bg-green-600'} rounded-2xl flex items-center justify-center shadow-lg`}>
              {React.createElement(steps[activeStep].icon, { className: "h-8 w-8 text-white" })}
            </div>
            <div>
              <Badge className={`${steps[activeStep].color === 'blue' ? 'bg-blue-600' : steps[activeStep].color === 'purple' ? 'bg-purple-600' : steps[activeStep].color === 'teal' ? 'bg-teal-600' : 'bg-green-600'} text-white px-4 py-2 text-sm font-bold mb-2`}>
                {steps[activeStep].step}
              </Badge>
              <h3 className="text-3xl font-black text-gray-900">{steps[activeStep].title}</h3>
            </div>
          </div>
          
          <p className="text-gray-600 mb-6 leading-relaxed text-lg">
            {steps[activeStep].description}
          </p>

          <div className="grid md:grid-cols-2 gap-4">
            {steps[activeStep].details.map((detail, detailIndex) => (
              <motion.div
                key={detail}
                className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: detailIndex * 0.1 }}
              >
                <CheckCircle className={`h-5 w-5 ${steps[activeStep].color === 'blue' ? 'text-blue-600' : steps[activeStep].color === 'purple' ? 'text-purple-600' : steps[activeStep].color === 'teal' ? 'text-teal-600' : 'text-green-600'} flex-shrink-0 mt-0.5`} />
                <span className="text-gray-700 text-sm leading-relaxed">{detail}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

const NewsletterWidget: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);
    setIsSubscribed(true);
    setEmail('');
  };

  return (
    <motion.div
      className="bg-white/90 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-gray-200"
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
    >
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Mail className="h-8 w-8 text-white" />
        </div>
        <h3 className="text-2xl font-black text-gray-900 mb-2">Stay Updated</h3>
        <p className="text-gray-600">Get the latest updates on internship opportunities</p>
      </div>

      <AnimatePresence mode="wait">
        {!isSubscribed ? (
          <motion.form 
            onSubmit={handleSubscribe}
            className="space-y-4"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
          >
            <div className="relative">
              <Input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-12 pr-4 py-3 rounded-xl border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>
            <motion.button
              type="submit"
              disabled={isLoading || !email}
              className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center gap-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isLoading ? (
                <>
                  <motion.div
                    className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                  Subscribing...
                </>
              ) : (
                <>
                  <Send className="h-5 w-5" />
                  Subscribe Now
                </>
              )}
            </motion.button>
          </motion.form>
        ) : (
          <motion.div
            className="text-center py-4"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            >
              <CheckCircle className="h-8 w-8 text-green-600" />
            </motion.div>
            <h4 className="text-xl font-bold text-gray-900 mb-2">Thank You!</h4>
            <p className="text-gray-600">You've been successfully subscribed to our newsletter.</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const InteractiveButton: React.FC<{
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  className?: string;
  variant?: "primary" | "secondary" | "outline";
  icon?: React.ComponentType<any>;
}> = ({ children, href, onClick, className = "", variant = "primary", icon: Icon }) => {
  const [isClicked, setIsClicked] = useState(false);
  
  const variants = {
    primary: "bg-blue-600 text-white shadow-2xl hover:bg-blue-700 hover:shadow-3xl",
    secondary: "bg-teal-600 text-white shadow-2xl hover:bg-teal-700 hover:shadow-3xl",
    outline: "border-2 border-blue-600 hover:border-blue-700 bg-white/80 backdrop-blur-lg hover:bg-blue-50 text-blue-600 hover:text-blue-700"
  };

  const handleClick = () => {
    setIsClicked(true);
    setTimeout(() => setIsClicked(false), 200);
    if (onClick) onClick();
  };

  const ButtonComponent = (
    <motion.button
      className={`relative px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 overflow-hidden inline-flex items-center gap-3 ${variants[variant]} ${className}`}
      onClick={handleClick}
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.95 }}
      animate={{
        boxShadow: isClicked 
          ? "0 0 30px rgba(59, 130, 246, 0.4)" 
          : "0 10px 30px rgba(0, 0, 0, 0.1)"
      }}
    >
      {Icon && <Icon className="h-6 w-6" />}
      <span className="relative z-10">{children}</span>
      <motion.div
        className="absolute inset-0 bg-white/20 rounded-2xl"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ 
          scale: isClicked ? [0, 1.5, 0] : 0, 
          opacity: isClicked ? [0, 0.3, 0] : 0 
        }}
        transition={{ duration: 0.4 }}
      />
    </motion.button>
  );

  return href ? <Link to={href}>{ButtonComponent}</Link> : ButtonComponent;
};

const About: React.FC = () => {
const heroRef = useRef<HTMLDivElement | null>(null);
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 300], [0, 200]);
  const y2 = useTransform(scrollY, [0, 300], [0, -100]);

  // Ensure page opens at the top on route navigation
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, []);

  // State management for interactive elements
  const [expandedCards, setExpandedCards] = useState<number[]>([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [playingVideo, setPlayingVideo] = useState(false);

  const stats = [
    { value: 100, suffix: '%', label: 'Transparent Scoring' },
    { value: 0, suffix: '', label: 'Zero Bias Design' },
    { value: 99, suffix: '%', label: 'Real-time Accuracy' }
  ];

  const capabilities = [
    {
      icon: GraduationCap,
      title: 'For Students',
      description: 'Personalized, AI-powered application experience with transparent recommendations and smart matching.',
      features: [
        'AI-powered recommendations with transparent rationale',
        'Dynamic forms with auto-save and resume extraction',
        'Bulk apply with deadline reminders',
        'Real-time status tracking and notifications',
        'Skill development suggestions',
        'Career pathway guidance',
        'Personalized dashboard with analytics',
        'Mobile-friendly application process'
      ],
      color: 'blue'
    },
    {
      icon: Building2,
      title: 'For Organizations',
      description: 'Capacity-aware allocation with skill-based ranking and bias-free candidate selection.',
      features: [
        'Skill-based ranking aligned with role requirements',
        'Complete candidate timeline visibility',
        'Bias reduction through AI explainability',
        'Automated communication workflows',
        'Advanced filtering and search capabilities',
        'Integration with HR management systems',
        'Performance analytics and reporting',
        'Collaborative evaluation tools'
      ],
      color: 'purple'
    },
    {
      icon: Crown,
      title: 'For Ministry & Admins',
      description: 'Comprehensive oversight with policy controls, bias monitoring, and transparent audit trails.',
      features: [
        'Real-time bias monitoring dashboards',
        'Policy levers for equitable distribution',
        'Complete audit trails and compliance',
        'Advanced analytics and reporting',
        'Multi-level approval workflows',
        'Data export and visualization tools',
        'System health monitoring',
        'User access management'
      ],
      color: 'teal'
    }
  ];

  const timeline = [
    {
      step: 'Step 1',
      title: 'Profile & Preferences',
      description: 'Students create comprehensive profiles with skills, preferences, and career goals.',
      details: [
        'Resume upload with AI skill extraction',
        'Explicit consent for sensitive data',
        'Location and sector preferences',
        'Draft saving across sessions'
      ],
      icon: Users,
      color: 'blue'
    },
    {
      step: 'Step 2',
      title: 'Intelligent Matching',
      description: 'Our AI engine analyzes compatibility using advanced algorithms and policy constraints.',
      details: [
        'Weighted skill coverage analysis',
        'Location and sector alignment',
        'Explainable scoring system',
        'Real-time recommendation updates'
      ],
      icon: Brain,
      color: 'purple'
    },
    {
      step: 'Step 3',
      title: 'Fair Allocation',
      description: 'Bias-aware allocation ensures transparent and equitable selection processes.',
      details: [
        'Capacity-aware shortlisting',
        'Bias detection and monitoring',
        'Transparent audit trails',
        'Policy compliance checks'
      ],
      icon: Shield,
      color: 'teal'
    },
    {
      step: 'Step 4',
      title: 'Tracking & Notifications',
      description: 'End-to-end visibility with automated notifications and deadline management.',
      details: [
        'Application timeline tracking',
        'Offer acceptance workflows',
        'Automated deadline reminders',
        'Real-time status updates'
      ],
      icon: Bell,
      color: 'green'
    }
  ];

  const toggleCardExpansion = (index: number) => {
    setExpandedCards(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: 'easeInOut' }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 relative overflow-hidden">
      {/* Enhanced Scroll Progress */}
      <ScrollProgress />
      
      {/* Interactive Background Elements */}
      <AnimatedParticleField />
      <InteractiveOrb 
        size="w-96 h-96" 
        color="bg-blue-300" 
        delay={0} 
        className="top-20 -left-48" 
        onClick={() => console.log('Orb clicked!')}
      />
      <InteractiveOrb 
        size="w-80 h-80" 
        color="bg-purple-300" 
        delay={3} 
        className="top-1/3 -right-40" 
        onClick={() => setPlayingVideo(!playingVideo)}
      />
      <InteractiveOrb 
        size="w-72 h-72" 
        color="bg-teal-300" 
        delay={6} 
        className="bottom-1/3 left-1/4" 
        onClick={() => setActiveTab(activeTab === 'overview' ? 'details' : 'overview')}
      />

      {/* Enhanced Hero Section */}
      <section ref={heroRef} className="relative pt-32 pb-24 overflow-hidden"> {/* Fixed section element */}
        <motion.div 
          className="absolute inset-0 opacity-30"
          style={{ y: y1 }}
        >
          <div className="absolute inset-0 bg-white/20"></div>
        </motion.div>

        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid lg:grid-cols-2 gap-16 items-center"
          >
            <motion.div variants={itemVariants} className="space-y-8">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <Badge className="bg-blue-600 text-white px-6 py-3 text-lg font-bold shadow-2xl border-0 rounded-full mb-8">
                  <Crown className="w-5 h-5 mr-2" />
                  PM Internship Scheme • Government of India
                </Badge>
              </motion.div>

              <div className="space-y-6">
                <motion.h1 
                  className="text-6xl lg:text-7xl font-black text-gray-900 leading-tight"
                  variants={itemVariants}
                >
                  About the Smart
                  <span className="block text-blue-600">Allocation Engine</span>
                </motion.h1>
                
                <motion.p 
                  className="text-2xl text-gray-600 leading-relaxed max-w-2xl"
                  variants={itemVariants}
                >
                  A revolutionary AI-powered platform ensuring fair, transparent, and intelligent 
                  internship allocation across India—built for Smart India Hackathon 2025.
                </motion.p>
              </div>

              <motion.div 
                className="flex flex-col sm:flex-row gap-6"
                variants={itemVariants}
              >
                <InteractiveButton href="/register" variant="primary" icon={Rocket}>
                  Get Started Today
                </InteractiveButton>
                
                <InteractiveButton href="/" variant="outline" icon={Globe}>
                  Explore Platform
                </InteractiveButton>
              </motion.div>

              {/* Enhanced Stats with Live Counters */}
              <motion.div 
                className="grid grid-cols-3 gap-6 pt-8"
                variants={containerVariants}
              >
                {stats.map((stat, index) => (
                  <LiveCounter
                    key={stat.label}
                    end={stat.value}
                    suffix={stat.suffix}
                    label={stat.label}
                  />
                ))}
              </motion.div>
            </motion.div>

            {/* Enhanced Interactive Hero Visual */}
            <motion.div 
              variants={itemVariants}
              className="relative"
              style={{ y: y2 }}
            >
              <motion.div
                className="relative bg-white/90 backdrop-blur-2xl rounded-3xl p-8 shadow-2xl border border-gray-200 overflow-hidden"
                whileHover={{ rotateY: 5, rotateX: 5 }}
                transition={{ duration: 0.3 }}
              >
                <div className="absolute inset-0 bg-transparent" />
                
                <div className="relative z-10 space-y-6">
                  {/* Interactive Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <motion.div 
                        className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center cursor-pointer"
                        whileHover={{ scale: 1.1, rotate: 10 }}
                        onClick={() => setPlayingVideo(!playingVideo)}
                      >
                        <Brain className="w-6 h-6 text-white" />
                      </motion.div>
                      <div>
                        <div className="font-bold text-gray-900 flex items-center gap-2">
                          AI Engine Status
                          <motion.div
                            className="w-3 h-3 bg-green-500 rounded-full"
                            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                            transition={{ duration: 2, repeat: Infinity }}
                          />
                        </div>
                        <div className="text-sm text-gray-600">Active & Learning</div>
                      </div>
                    </div>
                    <motion.div 
                      className="text-3xl font-black text-green-500"
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 3, repeat: Infinity }}
                    >
                      99.7%
                    </motion.div>
                  </div>

                  {/* Interactive Progress Bars */}
                  <div className="space-y-4">
                    {[
                      { label: 'Skills Analysis', value: 95, color: 'blue' },
                      { label: 'Fairness Score', value: 100, color: 'purple' },
                      { label: 'Match Accuracy', value: 98, color: 'teal' }
                    ].map((item, index) => (
                      <motion.div key={item.label}>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-gray-700">{item.label}</span>
                          <span className={`font-bold ${
                            item.color === 'blue' ? 'text-blue-600' : 
                            item.color === 'purple' ? 'text-purple-600' : 'text-teal-600'
                          }`}>
                            {item.value}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3 cursor-pointer hover:h-4 transition-all duration-200">
                          <motion.div 
                            className={`h-3 hover:h-4 rounded-full transition-all duration-200 ${
                              item.color === 'blue' ? 'bg-blue-600' : 
                              item.color === 'purple' ? 'bg-purple-600' : 'bg-teal-600'
                            }`}
                            initial={{ width: 0 }}
                            animate={{ width: `${item.value}%` }}
                            transition={{ duration: 2, delay: 0.5 + index * 0.2 }}
                          />
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Interactive Achievement Card */}
                  <motion.div 
                    className="bg-blue-50 p-4 rounded-2xl cursor-pointer hover:bg-blue-100 transition-colors duration-200"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="text-sm font-semibold text-gray-900 mb-2">Latest Achievement</div>
                    <div className="text-lg font-bold text-gray-900">2.5M+ Students Successfully Matched</div>
                    <div className="text-sm text-gray-600 flex items-center gap-2">
                      Zero bias incidents reported
                      <motion.div
                        animate={{ rotate: [0, 360] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      >
                        <Award className="h-4 w-4 text-blue-600" />
                      </motion.div>
                    </div>
                  </motion.div>
                </div>

                {/* Interactive Floating Elements */}
                <motion.div
                  className="absolute top-4 right-4 w-4 h-4 bg-green-400 rounded-full cursor-pointer"
                  animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  whileHover={{ scale: 2 }}
                  onClick={() => alert('System running optimally!')}
                />
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Enhanced Mission Section with Tabs */}
      <section className="py-24 relative">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <Badge className="bg-purple-100 text-purple-700 px-6 py-3 mb-8 text-base border-0 rounded-full">
              <Target className="w-5 h-5 mr-2" />
              Our Mission
            </Badge>
            
            <h2 className="text-5xl font-black text-gray-900 mb-8">
              Fair Opportunities for Every Student
            </h2>
            
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              The Smart Allocation Engine ensures that every student—irrespective of background, geography, 
              or institution—gets equitable access to internships under the PM Internship Scheme.
            </p>
          </motion.div>

          {/* Interactive Tab System */}
          <div className="max-w-6xl mx-auto mb-12">
            <div className="flex justify-center mb-8">
              <div className="flex bg-white/80 backdrop-blur-lg rounded-2xl p-2 shadow-xl border border-gray-200">
                {['overview', 'impact', 'technology'].map((tab) => (
                  <motion.button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 capitalize ${
                      activeTab === tab 
                        ? 'bg-blue-600 text-white shadow-lg' 
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {tab}
                  </motion.button>
                ))}
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="bg-white/90 backdrop-blur-2xl rounded-3xl p-12 shadow-2xl border border-gray-200"
              >
                {activeTab === 'overview' && (
                  <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div className="space-y-6">
                      <h3 className="text-3xl font-black text-gray-900">
                        Built for SIH 2025 (PS 25033)
                      </h3>
                      <p className="text-gray-600 leading-relaxed text-lg">
                        We combine data-driven matching with explicit fairness checks, explainable scoring, 
                        and strong privacy controls to uphold public trust. Our platform addresses end-to-end 
                        allocation while preserving transparency and auditability throughout.
                      </p>
                      <div className="grid grid-cols-2 gap-4">
                        {[
                          { icon: Database, text: 'Data-Driven Matching', color: 'blue' },
                          { icon: Shield, text: 'Privacy Protection', color: 'green' },
                          { icon: Eye, text: 'Full Transparency', color: 'purple' },
                          { icon: CheckCircle, text: 'Audit Compliance', color: 'teal' }
                        ].map((feature, index) => (
                          <motion.div
                            key={feature.text}
                            className={`flex items-center gap-3 p-4 ${
                              feature.color === 'blue' ? 'bg-blue-50' :
                              feature.color === 'green' ? 'bg-green-50' :
                              feature.color === 'purple' ? 'bg-purple-50' : 'bg-teal-50'
                            } rounded-xl hover:scale-105 transition-transform duration-200 cursor-pointer`}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ y: -2 }}
                          >
                            <feature.icon className={`h-6 w-6 ${
                              feature.color === 'blue' ? 'text-blue-600' :
                              feature.color === 'green' ? 'text-green-600' :
                              feature.color === 'purple' ? 'text-purple-600' : 'text-teal-600'
                            }`} />
                            <span className="text-gray-800 font-semibold text-sm">{feature.text}</span>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="relative">
                      <motion.div
                        className="bg-blue-600 rounded-2xl p-8 text-white shadow-2xl"
                        whileHover={{ scale: 1.02, rotate: 1 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="flex items-center gap-4 mb-6">
                          <InfinityIcon className="h-8 w-8" />
                          <span className="text-2xl font-bold">Impact Scale</span>
                        </div>
                        <div className="space-y-4">
                          {[
                            { label: 'Students Served:', value: '2.5M+' },
                            { label: 'Partner Organizations:', value: '50K+' },
                            { label: 'Success Rate:', value: '99.7%' }
                          ].map((stat, index) => (
                            <motion.div 
                              key={stat.label}
                              className="flex justify-between items-center p-2 rounded-lg hover:bg-white/10 transition-colors duration-200"
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.1 }}
                            >
                              <span>{stat.label}</span>
                              <span className="font-bold text-xl">{stat.value}</span>
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    </div>
                  </div>
                )}

                {activeTab === 'impact' && (
                  <div className="text-center space-y-8">
                    <h3 className="text-3xl font-black text-gray-900">Real-World Impact</h3>
                    <div className="grid md:grid-cols-3 gap-8">
                      {[
                        { icon: Users, title: 'Student Success', description: '2.5M+ students matched with perfect internships', metric: '98.7%', color: 'blue' },
                        { icon: Building2, title: 'Partner Satisfaction', description: 'Organizations report higher candidate quality', metric: '96.2%', color: 'purple' },
                        { icon: Award, title: 'Fair Allocation', description: 'Zero bias incidents in the selection process', metric: '100%', color: 'green' }
                      ].map((impact, index) => (
                        <motion.div
                          key={impact.title}
                          className={`p-6 ${
                            impact.color === 'blue' ? 'bg-blue-50' :
                            impact.color === 'purple' ? 'bg-purple-50' : 'bg-green-50'
                          } rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300`}
                          initial={{ opacity: 0, y: 50 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.2 }}
                          whileHover={{ scale: 1.05, y: -5 }}
                        >
                          <impact.icon className={`h-12 w-12 ${
                            impact.color === 'blue' ? 'text-blue-600' :
                            impact.color === 'purple' ? 'text-purple-600' : 'text-green-600'
                          } mx-auto mb-4`} />
                          <h4 className="text-xl font-bold text-gray-900 mb-2">{impact.title}</h4>
                          <p className="text-gray-600 mb-4">{impact.description}</p>
                          <div className={`text-3xl font-black ${
                            impact.color === 'blue' ? 'text-blue-600' :
                            impact.color === 'purple' ? 'text-purple-600' : 'text-green-600'
                          }`}>{impact.metric}</div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'technology' && (
                  <div className="space-y-8">
                    <h3 className="text-3xl font-black text-gray-900 text-center">Technology Stack</h3>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                      {[
                        { icon: Code, title: 'Frontend', tech: 'React + TypeScript', color: 'blue' },
                        { icon: Database, title: 'Backend', tech: 'Node.js + MongoDB', color: 'green' },
                        { icon: Brain, title: 'AI/ML', tech: 'TensorFlow + Python', color: 'purple' },
                        { icon: Shield, title: 'Security', tech: 'OAuth + JWT', color: 'red' }
                      ].map((tech, index) => (
                        <motion.div
                          key={tech.title}
                          className="text-center p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.1 }}
                          whileHover={{ scale: 1.05, y: -5 }}
                        >
                          <tech.icon className={`h-10 w-10 mx-auto mb-4 ${
                            tech.color === 'blue' ? 'text-blue-600' :
                            tech.color === 'green' ? 'text-green-600' :
                            tech.color === 'purple' ? 'text-purple-600' : 'text-red-600'
                          }`} />
                          <h4 className="font-bold text-gray-900 mb-2">{tech.title}</h4>
                          <p className="text-sm text-gray-600">{tech.tech}</p>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Enhanced Interactive Timeline */}
      <section className="py-24 bg-gray-100">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <Badge className="bg-blue-100 text-blue-700 px-6 py-3 mb-8 text-base border-0 rounded-full">
              <Cpu className="w-5 h-5 mr-2" />
              How It Works
            </Badge>
            
            <h2 className="text-5xl font-black text-gray-900 mb-8">
              From Profile to Perfect Match
            </h2>
            
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Our intelligent system guides students through a seamless journey from profile creation 
              to successful internship placement—explainable and auditable at every step.
            </p>
          </motion.div>

          <InteractiveTimeline steps={timeline} />
        </div>
      </section>

      {/* Enhanced Capabilities Section */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <Badge className="bg-teal-100 text-teal-700 px-6 py-3 mb-8 text-base border-0 rounded-full">
              <Layers className="w-5 h-5 mr-2" />
              Platform Capabilities
            </Badge>
            
            <h2 className="text-5xl font-black text-gray-900 mb-8">
              Designed for Every Stakeholder
            </h2>
            
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Our comprehensive platform serves students, organizations, and government bodies 
              with tailored features that ensure fairness, efficiency, and transparency.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {capabilities.map((capability, index) => (
              <InteractiveCard 
                key={capability.title} 
                {...capability} 
                index={index}
                isExpanded={expandedCards.includes(index)}
                onToggle={() => toggleCardExpansion(index)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Technology & Privacy Section with Newsletter */}
      <section className="py-24 bg-purple-50">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Privacy Card */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="bg-white/90 backdrop-blur-2xl rounded-3xl p-10 shadow-2xl border border-gray-200 h-full">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-16 h-16 bg-purple-600 rounded-2xl flex items-center justify-center">
                    <Lock className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-gray-900">Privacy & Security</h3>
                    <p className="text-gray-600">Built with consent and minimal data principles</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {[
                    'Consent capture for sensitive attributes',
                    'Zero-knowledge architecture design',
                    'End-to-end encryption protocols',
                    'GDPR and Indian privacy law compliance',
                    'User-controlled data management',
                    'Transparent data usage policies'
                  ].map((feature, index) => (
                    <motion.div
                      key={feature}
                      className="flex items-start gap-3 p-3 rounded-xl hover:bg-purple-50 transition-colors duration-200 cursor-pointer"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      viewport={{ once: true }}
                      whileHover={{ x: 5 }}
                    >
                      <CheckCircle className="h-5 w-5 text-purple-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{feature}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Technology Card */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="bg-white/90 backdrop-blur-2xl rounded-3xl p-10 shadow-2xl border border-gray-200 h-full">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center">
                    <CircuitBoard className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-gray-900">Modern Technology</h3>
                    <p className="text-gray-600">Cutting-edge stack, modular and extensible</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {[
                    'React, TypeScript, Vite foundation',
                    'TailwindCSS + Framer Motion UI',
                    'TanStack Query state management',
                    'Modular AI matching engine',
                    'Cloud-native architecture',
                    'API-first backend design'
                  ].map((feature, index) => (
                    <motion.div
                      key={feature}
                      className="flex items-start gap-3 p-3 rounded-xl hover:bg-blue-50 transition-colors duration-200 cursor-pointer"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      viewport={{ once: true }}
                      whileHover={{ x: 5 }}
                    >
                      <CheckCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{feature}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Newsletter Widget */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <NewsletterWidget />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Enhanced Call to Action */}
      <section className="py-24 relative overflow-hidden bg-blue-600">
        <div className="absolute inset-0 bg-blue-600"></div>
        
        <motion.div
          className="container mx-auto px-6 relative z-10 text-center"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <motion.div
            className="max-w-4xl mx-auto"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-6xl font-black text-white mb-8">
              Join the Future of Fair Allocation
            </h2>
            <p className="text-2xl text-blue-100 mb-12 leading-relaxed">
              Be part of India's most advanced internship platform. Experience transparency, 
              fairness, and AI-powered matching that puts students first.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <InteractiveButton href="/register" variant="secondary" icon={Users}>
                Create Student Account
              </InteractiveButton>
              
              <InteractiveButton href="/login" variant="outline" icon={ArrowRight}>
                Access Portal
              </InteractiveButton>
            </div>

            <motion.div 
              className="mt-12 inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-lg rounded-full border border-white/20"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              <Sparkles className="h-5 w-5 text-yellow-300 animate-pulse" />
              <span className="text-white font-medium">Championing fair access to opportunities—at scale</span>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>
    </div>
  );
};

export default About;
