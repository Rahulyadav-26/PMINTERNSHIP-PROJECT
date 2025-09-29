import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform, useInView, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { LucideIcon } from 'lucide-react';
import {
  Users, Shield, Brain, ChartBar, ArrowRight, CheckCircle, Zap, Star,
  Globe, Target, Award, Lightbulb, TrendingUp, BarChart3, PieChart,
  BookOpen, GraduationCap, Building2, Mail, Phone, MapPin, Clock,
  Play, Pause, Volume2, VolumeX, ExternalLink, Download, Share2,
  MessageCircle, Send, ChevronDown, ChevronUp, Menu, X, Search,
  Filter, Calendar, Bell, Settings, User, Home, Briefcase,
  FileText, Camera, Video, Mic, Image as ImageIcon, Sparkles,
  Rocket, Coffee, Heart, ThumbsUp, Eye, Crown, Trophy, Lock,
  Unlock, Key, Database, Cloud, Smartphone, Monitor, Palette,
  CircuitBoard, Cpu, MousePointer, Layers, GitBranch, Infinity as InfinityIcon
} from 'lucide-react';

// Enhanced Custom Hooks
const useTypingEffect = (text: string, speed: number = 100) => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex]);
        setCurrentIndex(currentIndex + 1);
      }, speed);
      return () => clearTimeout(timeout);
    }
  }, [currentIndex, text, speed]);

  return displayText;
};

const useCountUp = (end: number, duration: number = 2000) => {
  const [count, setCount] = useState(0);
  const countRef = useRef<HTMLElement>(null);
  const inView = useInView(countRef, { once: true });

  useEffect(() => {
    if (inView) {
      const startTime = Date.now();
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
  }, [inView, end, duration]);

  return { count, ref: countRef };
};

// Enhanced Aceternity-inspired Components
const AnimatedCounter: React.FC<{ end: number; suffix?: string; duration?: number }> = ({ 
  end, 
  suffix = '', 
  duration = 2000 
}) => {
  const { count, ref } = useCountUp(end, duration);
  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
};

const FloatingOrb: React.FC<{ 
  size?: string; 
  color?: string; 
  delay?: number; 
  className?: string 
}> = ({ size = "w-20 h-20", color = "bg-blue-500", delay = 0, className = "" }) => (
  <motion.div
    className={`${size} ${color} rounded-full absolute opacity-20 blur-xl ${className}`}
    animate={{
      x: [0, 30, -30, 0],
      y: [0, -30, 30, 0],
      scale: [1, 1.2, 0.8, 1],
    }}
    transition={{
      duration: 8,
      repeat: Infinity,
      ease: "easeInOut",
      delay
    }}
  />
);

const GlowCard: React.FC<{
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
}> = ({ children, className = "", glowColor = "blue" }) => (
  <motion.div
    className={`relative group ${className}`}
    whileHover={{ scale: 1.02 }}
    transition={{ duration: 0.3 }}
  >
    <div className={`absolute -inset-1 bg-gradient-to-r from-${glowColor}-600 to-${glowColor}-400 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500`}></div>
    <div className="relative bg-white rounded-2xl p-8 shadow-xl border border-gray-100 h-full">
      {children}
    </div>
  </motion.div>
);

const MagneticButton: React.FC<{
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: "primary" | "secondary" | "outline";
}> = ({ children, onClick, className = "", variant = "primary" }) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setMousePosition({ x: x * 0.1, y: y * 0.1 });
  };

  const baseClasses = "inline-flex items-center justify-center rounded-lg font-medium text-base px-6 py-3 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50";
  const variants = {
    primary: "bg-primary text-primary-foreground hover:bg-primary-hover shadow-sm",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary-hover shadow-sm",
    outline: "border border-gray-300 bg-white text-gray-900 hover:bg-gray-50"
  };

  return (
    <motion.button
      className={`${baseClasses} ${variants[variant]} ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setMousePosition({ x: 0, y: 0 });
      }}
      onClick={onClick}
      animate={{
        x: mousePosition.x,
        y: mousePosition.y,
      }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <span className="relative z-10">{children}</span>
    </motion.button>
  );
};

const ParticleField: React.FC = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {[...Array(50)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute w-1 h-1 bg-blue-400 rounded-full opacity-30"
        style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
        }}
        animate={{
          y: [0, -20, 0],
          opacity: [0.3, 0.8, 0.3],
        }}
        transition={{
          duration: 3 + Math.random() * 2,
          repeat: Infinity,
          delay: Math.random() * 2,
        }}
      />
    ))}
  </div>
);

const ScrollIndicator: React.FC = () => {
  const { scrollYProgress } = useScroll();

  return (
    <motion.div
className="fixed top-0 left-0 right-0 h-1 bg-primary origin-left z-50"
      style={{ scaleX: scrollYProgress }}
    />
  );
};

const TextReveal: React.FC<{ children: string; className?: string }> = ({ children, className = "" }) => {
  const words = children.split(' ');
  
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: 0.1
          }
        }
      }}
    >
      {words.map((word, index) => (
        <motion.span
          key={index}
          className="inline-block mr-2"
          variants={{
            hidden: { y: 50, opacity: 0 },
            visible: { y: 0, opacity: 1 }
          }}
          transition={{ duration: 0.5 }}
        >
          {word}
        </motion.span>
      ))}
    </motion.div>
  );
};

const HolographicCard: React.FC<{
  icon: LucideIcon;
  title: string;
  description: string;
  index: number;
}> = ({ icon: Icon, title, description, index }) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 20;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 20;
    setMousePosition({ x, y });
  };

  return (
    <motion.div
      className="relative group perspective-1000"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      viewport={{ once: true }}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setMousePosition({ x: 0, y: 0 })}
    >
      <motion.div
        className="relative h-full bg-gradient-to-br from-white/90 to-white/70 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-2xl overflow-hidden"
        style={{
          transform: `rotateX(${mousePosition.y}deg) rotateY(${mousePosition.x}deg)`,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        {/* Holographic Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-teal-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {/* Animated Background Pattern */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50" />
          <div className="absolute bottom-0 right-0 w-1 h-full bg-gradient-to-t from-transparent via-purple-500 to-transparent opacity-50" />
        </div>

        <motion.div
          className="relative z-10"
          initial={{ scale: 0.8 }}
          whileInView={{ scale: 1 }}
          transition={{ delay: index * 0.1 + 0.3, duration: 0.5 }}
        >
          <motion.div
className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white font-black text-2xl shadow-lg"
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <Icon className="h-8 w-8 text-white" />
          </motion.div>
          
          <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">
            {title}
          </h3>
          
          <p className="text-gray-600 text-center leading-relaxed">
            {description}
          </p>
        </motion.div>

        {/* Floating Elements */}
        <motion.div
          className="absolute top-4 right-4 w-2 h-2 bg-blue-400 rounded-full opacity-60"
          animate={{ scale: [1, 1.5, 1], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-4 left-4 w-1 h-1 bg-purple-400 rounded-full opacity-40"
          animate={{ scale: [1, 2, 1], opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 3, repeat: Infinity, delay: 1 }}
        />
      </motion.div>
    </motion.div>
  );
};

export const Landing: React.FC = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [newsletter, setNewsletter] = useState('');
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  // Navbar shrink on scroll
  const headerHeight = useTransform(scrollYProgress, [0, 0.15], [80, 56]); // px
  const logoSize = useTransform(scrollYProgress, [0, 0.15], [48, 36]); // px
  const brandScale = useTransform(scrollYProgress, [0, 0.15], [1, 0.95]);
  const shadowAlpha = useTransform(scrollYProgress, [0, 0.15], [0.06, 0.15]);
  const boxShadow = useTransform(shadowAlpha, (a) => `0 8px 24px rgba(0,0,0,${a})`);
  
  const typedText = useTypingEffect('AI-Powered Smart Allocation Engine', 60);

  // Mouse tracking for interactive elements
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const features = [
    {
      icon: Brain,
      title: 'Neural Matching Engine',
      description: 'Advanced deep learning algorithms analyze 200+ data points to create perfect student-internship matches with 98.7% accuracy rate.',
    },
    {
      icon: Shield,
      title: 'Zero-Bias Guarantee',
      description: 'Blockchain-verified fairness protocols with real-time bias detection ensure completely transparent and equitable allocation processes.',
    },
    {
      icon: InfinityIcon,
      title: 'Infinite Scalability',
      description: 'Cloud-native architecture handles millions of concurrent users with sub-second response times across all government systems.',
    },
    {
      icon: CircuitBoard,
      title: 'Quantum Analytics',
      description: 'Real-time predictive insights powered by quantum computing principles for unprecedented allocation optimization.',
    },
    {
      icon: Globe,
      title: 'Universal Access',
      description: 'Multi-language support with AI translation covering 22 official Indian languages and voice-based interactions.',
    },
    {
      icon: Lock,
      title: 'Fort Knox Security',
      description: 'Military-grade encryption with zero-knowledge architecture ensuring absolute data privacy and government compliance.',
    }
  ];

  const stats = [
    {
      number: 125000,
      label: 'Internships Matched',
      suffix: '+',
      icon: Users,
      desc: 'Successful, skills-aligned matches completed across the platform'
    },
    {
      number: 85,
      label: 'Partner Ministries & PSUs',
      suffix: '+',
      icon: Building2,
      desc: 'Central ministries, PSUs, and government-backed organizations onboarded'
    },
    {
      number: 720,
      label: 'Districts Covered',
      suffix: '+',
      icon: MapPin,
      desc: 'Opportunities available across urban and aspirational districts in India'
    },
    {
      number: 7,
      label: 'Avg. Offer Time',
      suffix: ' days',
      icon: Clock,
      desc: 'Average time from application to offer with streamlined workflows'
    }
  ];

  const testimonials = [
    {
      name: 'Arjun Mehta',
      role: 'Final Year B.Tech, IIT Delhi',
      content: 'The AI matching was phenomenal! Got placed at Google through this platform. The process was seamless and completely transparent.',
      rating: 5
    },
    {
      name: 'Dr. Sunita Sharma',
      role: 'Joint Secretary, Ministry of Education',
      content: 'Revolutionary platform that has transformed our allocation process. 100% transparency with zero complaints in the last cycle.',
      rating: 5
    },
    {
      name: 'Rahul Krishnan',
      role: 'VP Engineering, Infosys',
      content: 'We now receive the most qualified and perfectly matched candidates. This platform has elevated our internship program quality exponentially.',
      rating: 5
    }
  ];

  // Auto-rotate testimonials
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [testimonials.length]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        duration: 0.8
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8 }
    }
  };

  return (
<div className="min-h-screen bg-slate-50 relative overflow-hidden">
      {/* Scroll Progress Indicator */}
      <ScrollIndicator />
      
      {/* Particle Field Background */}
      <ParticleField />
      
      {/* Floating Orbs */}
      <FloatingOrb size="w-32 h-32" color="bg-blue-500" delay={0} className="top-20 left-10" />
      <FloatingOrb size="w-24 h-24" color="bg-purple-500" delay={2} className="top-40 right-20" />
      <FloatingOrb size="w-20 h-20" color="bg-teal-500" delay={4} className="bottom-32 left-1/4" />
      <FloatingOrb size="w-28 h-28" color="bg-pink-500" delay={6} className="bottom-20 right-1/3" />

      {/* Enhanced Glassmorphism Header */}
      <motion.header 
        className="fixed top-0 w-full bg-white/80 backdrop-blur-2xl border-b border-white/20 z-50"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        style={{ height: headerHeight, boxShadow }}
      >
        <div className="container mx-auto px-6 h-full flex items-center justify-between">
          <motion.button 
            type="button" 
            onClick={() => navigate('/')} 
            className="flex items-center space-x-3 focus:outline-none group"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div 
className="bg-primary rounded-2xl flex items-center justify-center shadow-2xl relative overflow-hidden"
              style={{ width: logoSize, height: logoSize }}
              whileHover={{ rotate: 10 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <div className="absolute inset-0 bg-white/20 animate-pulse" />
              <span className="text-white font-bold text-xl relative z-10">PM</span>
            </motion.div>
            <motion.span style={{ scale: brandScale }} className="origin-left font-bold text-2xl text-gray-900 group-hover:text-blue-600 transition-all duration-300">
              PM Internship Scheme
            </motion.span>
          </motion.button>

          {/* Desktop Navigation with Glassmorphism */}
          <nav className="hidden md:flex items-center space-x-8">
            {['Features', 'About', 'Contact'].map((item, index) => (
              <motion.a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="relative text-gray-700 hover:text-blue-600 font-medium transition-all duration-300 py-2 px-4 rounded-xl hover:bg-white/10 hover:backdrop-blur-lg"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 + 0.5, duration: 0.5 }}
                whileHover={{ scale: 1.05 }}
              >
                {item}
<span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 hover:w-full"></span>
              </motion.a>
            ))}
          </nav>

          <div className="flex items-center space-x-4">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                variant="ghost" 
                onClick={() => navigate('/login')}
                className="hidden sm:flex bg-white/10 backdrop-blur-lg border border-white/20 hover:bg-white/20 text-gray-700"
              >
                <User className="w-4 h-4 mr-2" />
                Login
              </Button>
            </motion.div>
            
            <MagneticButton
              onClick={() => navigate('/register')}
              variant="primary"
              className="px-3 py-1.5 text-xs rounded-md"
            >
              <Rocket className="w-3 h-3 mr-2" />
              Get Started
            </MagneticButton>
            
            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden bg-white/10 backdrop-blur-lg border border-white/20"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Enhanced Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white/10 backdrop-blur-2xl border-t border-white/20"
            >
              <div className="container mx-auto px-6 py-6 space-y-4">
                {['Features', 'About', 'Contact'].map((item, index) => (
                  <motion.a
                    key={item}
                    href={`#${item.toLowerCase()}`}
                    className="block text-gray-700 hover:text-blue-600 font-medium py-3 px-4 rounded-xl hover:bg-white/10 transition-all duration-300"
                    onClick={() => setIsMenuOpen(false)}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    {item}
                  </motion.a>
                ))}
                <div className="pt-4 border-t border-white/20 space-y-3">
                  <Button 
                    variant="outline" 
                    onClick={() => navigate('/login')}
                    className="w-full bg-white/10 backdrop-blur-lg border-white/20"
                  >
                    Login
                  </Button>
                  <MagneticButton
                    onClick={() => navigate('/register')}
                    className="w-full"
                  >
                    Register
                  </MagneticButton>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Revolutionary Hero Section */}
      <section ref={heroRef} className="relative pt-32 pb-24 overflow-hidden min-h-screen flex items-center">
        {/* Dynamic Background */}
        <motion.div 
          className="absolute inset-0"
          style={{ y: heroY, opacity }}
        >
<div className="absolute inset-0 bg-white/60"></div>
        </motion.div>

        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid lg:grid-cols-2 gap-16 items-center"
          >
            <motion.div variants={itemVariants} className="space-y-10">
              <div className="space-y-8">


                <div className="space-y-6">
                  <TextReveal className="text-6xl lg:text-8xl font-black text-gray-900 leading-tight">
                    Future of
                  </TextReveal>
                  
                  <motion.div 
                    className="text-6xl lg:text-8xl font-black text-blue-600 leading-tight"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, delay: 0.8 }}
                  >
                    {typedText}
                    <motion.span 
                      className="inline-block w-1 h-20 bg-blue-600 ml-2"
                      animate={{ opacity: [1, 0, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    />
                  </motion.div>
                </div>

                <motion.p 
                  className="text-2xl text-gray-600 leading-relaxed max-w-2xl font-light"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 1.2 }}
                >
                  Revolutionary quantum-powered allocation system that matches 2.5M+ students 
                  with perfect internship opportunities using advanced neural networks and 
                  zero-bias transparency protocols.
                </motion.p>
              </div>

              <motion.div 
                className="flex flex-col sm:flex-row gap-6"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.4 }}
              >
                <MagneticButton
                  onClick={() => navigate('/register')}
                  variant="primary"
                  className="text-xl px-10 py-5 shadow-2xl"
                >
                  Launch Your Future
                  <motion.div
                    className="ml-3"
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    <ArrowRight className="h-6 w-6" />
                  </motion.div>
                </MagneticButton>
                
                <MagneticButton
                  onClick={() => navigate('/demo')}
                  variant="outline"
                  className="text-xl px-10 py-5"
                >
                  <Play className="mr-3 h-6 w-6" />
                  Live Demo
                </MagneticButton>
              </motion.div>

              {/* Enhanced Trust Indicators */}
              <motion.div 
                className="grid grid-cols-3 gap-8 pt-12"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 1.6 }}
              >
                {[
                  { value: 99, suffix: '%', label: 'Success Rate', color: 'text-blue-600' },
                  { value: 2500000, suffix: '+', label: 'Students', color: 'text-purple-600' },
                  { value: 50000, suffix: '+', label: 'Partners', color: 'text-teal-600' }
                ].map((stat, index) => (
                  <motion.div 
                    key={stat.label}
                    className="text-center group cursor-pointer"
                    whileHover={{ scale: 1.05 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.8 + index * 0.1 }}
                  >
                    <div className={`text-4xl font-black ${stat.color} group-hover:scale-110 transition-transform duration-300`}>
                      <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                    </div>
                    <div className="text-sm text-gray-500 font-semibold mt-2 uppercase tracking-wider">
                      {stat.label}
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>

            {/* Enhanced 3D Hero Visual */}
            <motion.div 
              variants={itemVariants}
              className="relative perspective-1000"
            >
              <motion.div
                className="relative"
                style={{
                  rotateY: mousePosition.x * 0.01,
                  rotateX: mousePosition.y * -0.01,
                }}
                transition={{ type: "spring", stiffness: 100, damping: 30 }}
              >
                {/* Main Hero Card */}
                <motion.div
className="relative bg-white/80 backdrop-blur-2xl rounded-3xl p-8 shadow-2xl border border-white/20 overflow-hidden"
                  whileHover={{ scale: 1.02, rotateY: 5 }}
                  transition={{ duration: 0.3 }}
                >
<div className="absolute inset-0 bg-transparent" />
                  
                  {/* 3D Elements */}
                  <div className="relative z-10 space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                          <CheckCircle className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <div className="font-bold text-gray-900">AI Match Score</div>
                          <div className="text-sm text-gray-600">Perfect Alignment</div>
                        </div>
                      </div>
                      <div className="text-3xl font-black text-green-500">99.7%</div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700">Skills Compatibility</span>
                        <span className="font-bold text-blue-600">Excellent</span>
                      </div>
                      <Progress value={95} className="h-2" />
                      
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700">Location Match</span>
                        <span className="font-bold text-purple-600">Perfect</span>
                      </div>
                      <Progress value={100} className="h-2" />
                      
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700">Domain Alignment</span>
                        <span className="font-bold text-teal-600">Ideal</span>
                      </div>
                      <Progress value={98} className="h-2" />
                    </div>

                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-2xl">
                      <div className="text-sm font-semibold text-gray-900 mb-2">Recommended Internship</div>
                      <div className="text-lg font-bold text-gray-900">Software Engineering Intern</div>
                      <div className="text-sm text-gray-600">Google India • Bangalore</div>
                    </div>
                  </div>

                  {/* Floating Animated Elements */}
                  <motion.div
                    className="absolute top-4 right-4 w-3 h-3 bg-blue-400 rounded-full"
                    animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  <motion.div
                    className="absolute bottom-4 left-4 w-2 h-2 bg-purple-400 rounded-full"
                    animate={{ scale: [1, 2, 1], opacity: [0.3, 0.8, 0.3] }}
                    transition={{ duration: 3, repeat: Infinity, delay: 1 }}
                  />
                </motion.div>

                {/* Floating Side Cards */}
                <motion.div
                  className="absolute -top-6 -left-6 bg-white/90 backdrop-blur-lg p-4 rounded-2xl shadow-xl border border-white/20"
                  initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
                  animate={{ opacity: 1, scale: 1, rotate: -10 }}
                  transition={{ delay: 1.5, duration: 0.6 }}
                  whileHover={{ scale: 1.05, rotate: -5 }}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg">
                      <Brain className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="font-bold text-gray-900">Neural Engine</div>
                      <div className="text-sm text-gray-600">Active</div>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  className="absolute -bottom-6 -right-6 bg-white/90 backdrop-blur-lg p-4 rounded-2xl shadow-xl border border-white/20"
                  initial={{ opacity: 0, scale: 0.8, rotate: 10 }}
                  animate={{ opacity: 1, scale: 1, rotate: 10 }}
                  transition={{ delay: 1.7, duration: 0.6 }}
                  whileHover={{ scale: 1.05, rotate: 5 }}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-r from-green-500 to-teal-500 rounded-lg">
                      <Users className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="font-bold text-gray-900">
                        <AnimatedCounter end={1500000} suffix="+" />
                      </div>
                      <div className="text-sm text-gray-600">Matched</div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Enhanced Stats Section with Glassmorphism */}
      <section className="py-24 relative overflow-hidden">
<div className="absolute inset-0 bg-primary"></div>
        <div className="absolute inset-0 backdrop-blur-sm"></div>
        
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <motion.div
            className="absolute top-1/4 left-1/4 w-64 h-64 bg-white/10 rounded-full blur-3xl"
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 4, repeat: Infinity }}
          />
          <motion.div
            className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-white/10 rounded-full blur-3xl"
            animate={{ scale: [1.2, 1, 1.2], opacity: [0.6, 0.3, 0.6] }}
            transition={{ duration: 4, repeat: Infinity, delay: 2 }}
          />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-black text-white mb-6">
              Transforming India's Future
            </h2>
            <p className="text-xl text-blue-100 max-w-4xl mx-auto leading-relaxed">
              Our quantum-powered platform has revolutionized internship allocation across the nation, 
              creating unprecedented opportunities and success stories.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8, y: 50 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05, y: -10 }}
                className="group cursor-pointer"
              >
                <GlowCard className="bg-white/10 backdrop-blur-lg border-white/20" glowColor="white">
                  <div className="flex items-center justify-between mb-6">
                    <motion.div
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    >
                      <stat.icon className="w-10 h-10 text-blue-600 opacity-80 group-hover:opacity-100 transition-opacity" />
                    </motion.div>
                    <div className="text-right">
                      <div className="text-4xl font-black text-gray-900">
                        <AnimatedCounter end={stat.number} suffix={stat.suffix} />
                      </div>
                      <div className="text-sm text-gray-600 font-semibold uppercase tracking-wider">
                        {stat.label}
                      </div>
                    </div>
                  </div>
                  <div className="h-1 bg-gray-200 rounded-full group-hover:bg-gray-300 transition-all duration-300"></div>
                  <div className="mt-4 text-sm text-gray-600">
                    {stat.desc}
                  </div>
                </GlowCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Revolutionary Features Section */}
<section id="features" className="py-32 bg-gray-50 relative overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="inline-block"
            >
<Badge className="bg-blue-100 text-blue-700 px-6 py-3 mb-8 text-base border-0 rounded-full">
                <Zap className="w-5 h-5 mr-2" />
                Next-Generation Features
              </Badge>
            </motion.div>
            
            <TextReveal className="text-6xl font-black text-gray-900 mb-8">
              Quantum-Powered Intelligence
            </TextReveal>
            
            <p className="text-2xl text-gray-600 max-w-5xl mx-auto leading-relaxed font-light">
              Experience the future of government technology with our revolutionary AI engine 
              that processes millions of data points in real-time to create perfect matches.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <HolographicCard key={feature.title} {...feature} index={index} />
            ))}
          </div>

          {/* Call to Action */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            viewport={{ once: true }}
            className="text-center mt-20"
          >
            <MagneticButton
              onClick={() => navigate('/register')}
              variant="primary"
              className="text-xl px-12 py-6 shadow-2xl"
            >
              Experience the Future
              <motion.div
                className="ml-3"
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="h-6 w-6" />
              </motion.div>
            </MagneticButton>
          </motion.div>
        </div>
      </section>

      {/* Enhanced Testimonials Section */}
      <section className="py-32 bg-white relative overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
<Badge className="bg-amber-100 text-amber-700 px-6 py-3 mb-8 text-base border-0 rounded-full">
              <Heart className="w-5 h-5 mr-2" />
              Success Stories
            </Badge>
            
            <TextReveal className="text-6xl font-black text-gray-900 mb-8">
              Voices of Transformation
            </TextReveal>
            
            <p className="text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Hear from the students, administrators, and organizations whose lives have been 
              transformed by our revolutionary platform.
            </p>
          </motion.div>

          <div className="max-w-5xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTestimonial}
                initial={{ opacity: 0, x: 100, scale: 0.8 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -100, scale: 0.8 }}
                transition={{ duration: 0.6 }}
              >
                <GlowCard className="p-12" glowColor="blue">
                  <div className="text-center">
                    {/* Rating Stars */}
                    <div className="flex justify-center gap-2 mb-8">
                      {[...Array(5)].map((_, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: i * 0.1, duration: 0.3 }}
                        >
                          <Star className="w-6 h-6 text-amber-400 fill-current" />
                        </motion.div>
                      ))}
                    </div>

                    {/* Testimonial Content */}
                    <motion.blockquote 
                      className="text-3xl text-gray-700 mb-10 italic font-light leading-relaxed"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      "{testimonials[activeTestimonial].content}"
                    </motion.blockquote>

                    {/* Author */}
                    <motion.div 
                      className="flex items-center justify-center gap-6"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                    >
                      <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-black text-2xl shadow-lg">
                        {testimonials[activeTestimonial].name.charAt(0)}
                      </div>
                      <div className="text-left">
                        <div className="font-bold text-xl text-gray-900">
                          {testimonials[activeTestimonial].name}
                        </div>
                        <div className="text-gray-600 font-medium">
                          {testimonials[activeTestimonial].role}
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </GlowCard>
              </motion.div>
            </AnimatePresence>

            {/* Testimonial Navigation */}
            <div className="flex justify-center mt-12 space-x-4">
              {testimonials.map((_, index) => (
                <motion.button
                  key={index}
                  className={`w-4 h-4 rounded-full transition-all duration-300 ${
                    index === activeTestimonial 
? 'bg-blue-600 scale-125'
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                  onClick={() => setActiveTestimonial(index)}
                  whileHover={{ scale: 1.3 }}
                  whileTap={{ scale: 0.9 }}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Newsletter Section */}
      <section className="py-24 relative overflow-hidden">
<div className="absolute inset-0 bg-primary"></div>
        <div className="absolute inset-0 backdrop-blur-sm"></div>
        
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center max-w-4xl mx-auto"
          >
            <h2 className="text-5xl font-black text-white mb-8">
              Stay Ahead of the Future
            </h2>
            <p className="text-xl text-blue-100 mb-12 leading-relaxed">
              Get exclusive access to new features, success stories, and breakthrough updates 
              from India's most advanced internship platform.
            </p>
            
            <div className="max-w-md mx-auto">
              <motion.div 
                className="flex gap-4"
                whileHover={{ scale: 1.02 }}
              >
                <Input
                  type="email"
                  placeholder="Enter your email address"
                  value={newsletter}
                  onChange={(e) => setNewsletter(e.target.value)}
                  className="flex-1 bg-white/10 backdrop-blur-lg border-white/20 text-white placeholder-white/70 h-14 text-lg rounded-xl"
                />
                <MagneticButton
                  onClick={() => {
                    console.log('Newsletter subscription:', newsletter);
                    setNewsletter('');
                  }}
                  variant="secondary"
                  className="px-6 h-14"
                >
                  <Send className="w-5 h-5" />
                </MagneticButton>
              </motion.div>
              <p className="text-sm text-blue-100 mt-4 opacity-80">
                🔒 Your privacy is protected. Unsubscribe anytime.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Revolutionary Footer */}
      <footer className="bg-gray-900 text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0">
<div className="absolute inset-0 bg-transparent"></div>
          <ParticleField />
        </div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid md:grid-cols-4 gap-12 mb-16">
            <div className="space-y-6">
              <motion.div 
                className="flex items-center space-x-4"
                whileHover={{ scale: 1.05 }}
              >
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 via-purple-500 to-teal-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-xl">PM</span>
                </div>
                <span className="font-bold text-2xl text-white">
                  PM Internship Scheme
                </span>
              </motion.div>
              
              <p className="text-gray-400 leading-relaxed text-lg">
                Pioneering the future of internship allocation with quantum-powered AI, 
                ensuring fairness and excellence for every Indian student.
              </p>
              
              <div className="flex space-x-4">
                {[
                  { icon: Mail, href: 'mailto:support@pminternship.gov.in' },
                  { icon: Phone, href: 'tel:+911234567890' },
                  { icon: Globe, href: 'https://pminternship.gov.in' }
                ].map((social, index) => (
                  <motion.a
                    key={index}
                    href={social.href}
                    className="w-12 h-12 bg-gray-800 rounded-xl flex items-center justify-center hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 transition-all duration-300 border border-gray-700 hover:border-transparent"
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <social.icon className="w-5 h-5" />
                  </motion.a>
                ))}
              </div>
            </div>

            {[
              {
                title: 'Platform',
                links: ['Features', 'How It Works', 'Success Stories', 'AI Technology', 'Security']
              },
              {
                title: 'Access Portals',
                links: ['Student Dashboard', 'Admin Panel', 'Ministry Portal', 'Documentation', 'API Reference']
              },
              {
                title: 'Legal & Support',
                links: ['Privacy Policy', 'Terms of Service', 'Accessibility', 'Support Center', 'Status Page']
              }
            ].map((section, index) => (
              <div key={section.title}>
                <h4 className="font-bold text-xl mb-8 text-white">
                  {section.title}
                </h4>
                <div className="space-y-4">
                  {section.links.map((link) => (
                    <motion.a 
                      key={link} 
                      href="#" 
                      className="block text-gray-400 hover:text-white transition-colors duration-300 text-lg hover:translate-x-2 transform transition-transform"
                      whileHover={{ x: 8 }}
                    >
                      {link}
                    </motion.a>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <motion.div 
            className="border-t border-gray-800 pt-12 flex flex-col md:flex-row justify-between items-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="text-gray-400 text-lg mb-6 md:mb-0">
              © 2025 PM Internship Scheme. All rights reserved. 
              <span className="text-blue-400 font-semibold"> Built for Smart India Hackathon 2025.</span>
            </div>
            <div className="flex items-center space-x-8 text-gray-400">
              <motion.span 
                className="flex items-center"
                whileHover={{ scale: 1.05 }}
              >
                🇮🇳 <span className="ml-2 font-semibold">Made in India</span>
              </motion.span>
              <span className="text-gray-600">•</span>
              <span className="text-blue-400 font-semibold">SIH 2025</span>
              <span className="text-gray-600">•</span>
              <span className="text-purple-400 font-semibold">Government of India</span>
            </div>
          </motion.div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
