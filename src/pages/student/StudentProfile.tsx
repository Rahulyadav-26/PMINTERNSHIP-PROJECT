import React, { useRef, useEffect, useState, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sphere, MeshDistortMaterial, Text, Environment } from '@react-three/drei';
import { motion, useScroll, useTransform, useInView, AnimatePresence } from 'framer-motion';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  User, Mail, School, BookOpen, Upload, Star, TrendingUp, CheckCircle,
  AlertCircle, Edit3, Camera, MapPin, Calendar, Award, Target,
  Zap, Brain, Code, Lightbulb, Rocket, Shield, Settings,
  Download, Share2, ExternalLink, Plus, X, ChevronRight,
  BarChart3, PieChart, Activity, Globe, Briefcase, Users, Eye,
  GraduationCap, Phone, Linkedin, Github, Link, Save, Copy,
  MessageCircle, Bell, Clock, Filter, Search, ArrowUp, Trash2,
  FileText, Image, Video, Mic, Palette, Monitor, Smartphone,
  Coffee, Music, Gamepad2, Heart, Sparkles, Crown, Trophy,
  Calendar as CalendarIcon, Bookmark, ThumbsUp, Share
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import * as THREE from 'three';

// Enhanced Three.js Background with particle system
function AnimatedBackground() {
  const groupRef = useRef<THREE.Group>(null);
  const particlesRef = useRef<THREE.Points>(null);
  const spheresRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    const time = state.clock.elapsedTime;
    
    if (groupRef.current) {
      groupRef.current.rotation.y = time * 0.005;
    }
    
    if (particlesRef.current) {
      particlesRef.current.rotation.x = time * 0.02;
      particlesRef.current.rotation.y = time * 0.01;
    }
    
    if (spheresRef.current) {
      spheresRef.current.children.forEach((child, i) => {
        child.rotation.x = time * (0.1 + i * 0.05);
        child.rotation.y = time * (0.05 + i * 0.02);
        child.position.y = Math.sin(time + i) * 0.2;
      });
    }
  });

  const particleCount = 100;
  const positions = new Float32Array(particleCount * 3);
  
  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 10;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
  }

  return (
    <group ref={groupRef}>
      <Environment preset="city" />
      
      {/* Floating particles */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            array={positions}
            count={particleCount}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial color="#3B82F6" size={0.02} opacity={0.6} transparent />
      </points>
      
      {/* Animated spheres */}
      <group ref={spheresRef}>
        <Float speed={1.2} rotationIntensity={0.3} floatIntensity={0.4}>
          <Sphere args={[0.6, 32, 32]} position={[2.5, 0, -4]}>
            <MeshDistortMaterial
              color="#1E40AF"
              distort={0.3}
              speed={1.5}
              opacity={0.08}
              transparent
            />
          </Sphere>
        </Float>
        
        <Float speed={1.8} rotationIntensity={0.2} floatIntensity={0.3}>
          <Sphere args={[0.4, 32, 32]} position={[-2, -1, -3]}>
            <MeshDistortMaterial
              color="#0D9488"
              distort={0.4}
              speed={2}
              opacity={0.06}
              transparent
            />
          </Sphere>
        </Float>
        
        <Float speed={1.5} rotationIntensity={0.4} floatIntensity={0.5}>
          <Sphere args={[0.3, 32, 32]} position={[1, -2, -2]}>
            <MeshDistortMaterial
              color="#F59E0B"
              distort={0.2}
              speed={2.5}
              opacity={0.05}
              transparent
            />
          </Sphere>
        </Float>
      </group>
    </group>
  );
}

// Enhanced Loading with progress
function LoadingFallback() {
  const [progress, setProgress] = useState(0);
  
  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        return prev + Math.random() * 10;
      });
    }, 100);
    
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="text-center space-y-6">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-blue-200 rounded-full mx-auto"></div>
          <div className="w-20 h-20 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto absolute inset-0"></div>
        </div>
        <div className="space-y-2">
          <p className="text-gray-600 font-medium">Loading your profile...</p>
          <div className="w-64 bg-gray-200 rounded-full h-2 mx-auto">
            <div 
              className="bg-gradient-to-r from-blue-600 to-teal-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-xs text-gray-500">{Math.round(progress)}% complete</p>
        </div>
      </div>
    </div>
  );
}

// Enhanced Animated Counter with formatting
function AnimatedCounter({ 
  value, 
  suffix = '', 
  prefix = '',
  duration = 2,
  format = 'number'
}: { 
  value: number; 
  suffix?: string; 
  prefix?: string;
  duration?: number;
  format?: 'number' | 'decimal' | 'percentage';
}) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
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
          setCount(format === 'decimal' ? Math.floor(start * 10) / 10 : Math.floor(start));
        }
      }, 1000 / 60);

      return () => clearInterval(timer);
    }
  }, [isInView, value, duration, format]);

  const formatValue = (val: number) => {
    if (format === 'decimal') return val.toFixed(1);
    if (format === 'percentage') return val.toFixed(0);
    return val.toLocaleString();
  };

  return <span ref={ref}>{prefix}{formatValue(count)}{suffix}</span>;
}

// Enhanced Skill Tag with interactive features
function SkillTag({ 
  skill, 
  index, 
  type = 'current',
  level,
  onRemove,
  onClick
}: { 
  skill: string; 
  index: number; 
  type?: 'current' | 'recommended' | 'learning';
  level?: 'beginner' | 'intermediate' | 'advanced';
  onRemove?: () => void;
  onClick?: () => void;
}) {
  const [isHovered, setIsHovered] = useState(false);
  
  const getSkillConfig = () => {
    if (type === 'recommended') {
      return {
        bg: 'from-gray-100 to-gray-200 hover:from-teal-50 hover:to-teal-100',
        text: 'text-gray-700 hover:text-teal-800',
        border: 'border border-gray-300 hover:border-teal-400',
        icon: <Plus className="w-3 h-3" />
      };
    }
    
    if (type === 'learning') {
      return {
        bg: 'from-orange-100 to-orange-200 hover:from-orange-200 hover:to-orange-300',
        text: 'text-orange-700 hover:text-orange-800',
        border: 'border border-orange-300 hover:border-orange-400',
        icon: <Clock className="w-3 h-3" />
      };
    }
    
    switch(level) {
      case 'advanced':
        return {
          bg: 'from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700',
          text: 'text-white',
          border: 'border-0',
          icon: <Crown className="w-3 h-3" />
        };
      case 'intermediate':
        return {
          bg: 'from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700',
          text: 'text-white',
          border: 'border-0',
          icon: <Star className="w-3 h-3" />
        };
      default:
        return {
          bg: 'from-slate-500 to-slate-600 hover:from-slate-600 hover:to-slate-700',
          text: 'text-white',
          border: 'border-0',
          icon: <Zap className="w-3 h-3" />
        };
    }
  };
  
  const config = getSkillConfig();
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8, y: -20 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      whileHover={{ scale: 1.05, y: -2 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="relative group"
    >
      <Badge 
        className={`
          relative overflow-hidden cursor-pointer transition-all duration-300 px-3 py-2 text-sm font-medium
          bg-gradient-to-r ${config.bg} ${config.text} ${config.border}
        `}
        onClick={onClick}
      >
        <motion.div
          className="absolute inset-0 bg-white opacity-0"
          animate={{ opacity: isHovered ? 0.15 : 0 }}
          transition={{ duration: 0.2 }}
        />
        <span className="relative z-10 flex items-center gap-1.5">
          {config.icon}
          {skill}
        </span>
        {onRemove && type === 'current' && isHovered && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600"
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
          >
            <X className="w-2 h-2" />
          </motion.button>
        )}
      </Badge>
    </motion.div>
  );
}

// Enhanced Circular Progress with animation effects
function CircularProgress({ 
  percentage, 
  size = 140, 
  strokeWidth = 10,
  showPercentage = true,
  color = 'auto',
  label = 'Complete'
}: { 
  percentage: number; 
  size?: number; 
  strokeWidth?: number;
  showPercentage?: boolean;
  color?: 'auto' | string;
  label?: string;
}) {
  const [animatedPercentage, setAnimatedPercentage] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      const timer = setTimeout(() => {
        setAnimatedPercentage(percentage);
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [isInView, percentage]);

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (animatedPercentage / 100) * circumference;

  const getColor = (percent: number) => {
    if (color !== 'auto') return color;
    if (percent >= 90) return '#059669'; // Emerald-600
    if (percent >= 75) return '#10B981'; // Emerald-500
    if (percent >= 60) return '#3B82F6'; // Blue-500
    if (percent >= 40) return '#F59E0B'; // Amber-500
    return '#EF4444'; // Red-500
  };

  const currentColor = getColor(percentage);

  return (
    <div ref={ref} className="relative" style={{ width: size, height: size }}>
      <svg className="w-full h-full transform -rotate-90" viewBox={`0 0 ${size} ${size}`}>
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#E5E7EB"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        
        {/* Progress circle with gradient */}
        <defs>
          <linearGradient id={`gradient-${percentage}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={currentColor} stopOpacity="0.8" />
            <stop offset="100%" stopColor={currentColor} stopOpacity="1" />
          </linearGradient>
        </defs>
        
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={`url(#gradient-${percentage})`}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeLinecap="round"
          strokeDasharray={strokeDasharray}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 2, ease: "easeInOut" }}
          filter="drop-shadow(0 0 6px rgba(59, 130, 246, 0.4))"
        />
      </svg>
      
      {/* Center content */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          {showPercentage && (
            <div className="text-3xl font-bold mb-1" style={{ color: currentColor }}>
              <AnimatedCounter value={percentage} suffix="%" />
            </div>
          )}
          <div className="text-sm text-gray-500 font-medium">{label}</div>
        </div>
      </div>
    </div>
  );
}

// Enhanced Stat Card with trends and animations
function StatCard({ 
  label, 
  value, 
  icon: Icon, 
  color, 
  trend,
  subtitle,
  onClick
}: { 
  label: string; 
  value: number; 
  icon: any; 
  color: string;
  trend?: { value: number; isPositive: boolean };
  subtitle?: string;
  onClick?: () => void;
}) {
  const colorClasses = {
    blue: 'from-blue-50 to-blue-100 border-blue-200 hover:from-blue-100 hover:to-blue-150',
    teal: 'from-teal-50 to-teal-100 border-teal-200 hover:from-teal-100 hover:to-teal-150',
    amber: 'from-amber-50 to-amber-100 border-amber-200 hover:from-amber-100 hover:to-amber-150',
    purple: 'from-purple-50 to-purple-100 border-purple-200 hover:from-purple-100 hover:to-purple-150',
    emerald: 'from-emerald-50 to-emerald-100 border-emerald-200 hover:from-emerald-100 hover:to-emerald-150',
  };

  const textColorClasses = {
    blue: 'text-blue-700',
    teal: 'text-teal-700',
    amber: 'text-amber-700',
    purple: 'text-purple-700',
    emerald: 'text-emerald-700',
  };

  const iconBgClasses = {
    blue: 'bg-blue-200 group-hover:bg-blue-300',
    teal: 'bg-teal-200 group-hover:bg-teal-300',
    amber: 'bg-amber-200 group-hover:bg-amber-300',
    purple: 'bg-purple-200 group-hover:bg-purple-300',
    emerald: 'bg-emerald-200 group-hover:bg-emerald-300',
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -5 }}
      whileTap={{ scale: 0.98 }}
      className="group cursor-pointer"
      onClick={onClick}
    >
      <Card className={`
        bg-gradient-to-br ${colorClasses[color as keyof typeof colorClasses]} 
        hover:shadow-lg transition-all duration-300 border-0 relative overflow-hidden
      `}>
        <div className="absolute inset-0 bg-gradient-to-r from-white/0 to-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        <CardContent className="p-6 relative">
          <div className="flex items-center justify-between mb-3">
            <div className={`p-3 ${iconBgClasses[color as keyof typeof iconBgClasses]} rounded-xl transition-colors duration-300`}>
              <Icon className={`w-6 h-6 ${textColorClasses[color as keyof typeof textColorClasses]}`} />
            </div>
            {trend && (
              <div className="flex items-center gap-1">
                <div className={`flex items-center text-xs font-medium px-2 py-1 rounded-full ${
                  trend.isPositive 
                    ? 'text-emerald-700 bg-emerald-100' 
                    : 'text-red-700 bg-red-100'
                }`}>
                  <TrendingUp className={`w-3 h-3 mr-1 ${!trend.isPositive && 'rotate-180'}`} />
                  {trend.value}%
                </div>
              </div>
            )}
          </div>
          
          <div className="space-y-1">
            <div className={`text-3xl font-bold ${textColorClasses[color as keyof typeof textColorClasses]}`}>
              <AnimatedCounter value={value} />
            </div>
            <div className={`text-sm font-medium ${textColorClasses[color as keyof typeof textColorClasses]}`}>
              {label}
            </div>
            {subtitle && (
              <div className={`text-xs ${textColorClasses[color as keyof typeof textColorClasses]} opacity-80`}>
                {subtitle}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// Achievement Card Component
function AchievementCard({ achievement, index }: { achievement: any; index: number }) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const categoryIcons = {
    'Competition': Trophy,
    'Academic': GraduationCap,
    'Technical': Code,
    'Leadership': Users,
    'Community': Heart
  };
  
  const CategoryIcon = categoryIcons[achievement.category as keyof typeof categoryIcons] || Award;
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{ scale: 1.02, y: -5 }}
      className="group cursor-pointer"
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 hover:shadow-lg transition-all duration-300 overflow-hidden">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-amber-200 rounded-full group-hover:bg-amber-300 transition-colors">
                <CategoryIcon className="w-5 h-5 text-amber-700" />
              </div>
              <div>
                <Badge className="mb-2 bg-amber-100 text-amber-800 border-amber-300">
                  {achievement.category}
                </Badge>
                <h4 className="font-bold text-amber-900 leading-tight">
                  {achievement.title}
                </h4>
              </div>
            </div>
            <div className="text-xs font-medium text-amber-600 bg-amber-100 px-2 py-1 rounded-full">
              {achievement.date}
            </div>
          </div>
          
          <motion.div
            initial={false}
            animate={{ height: isExpanded ? 'auto' : '60px' }}
            className="overflow-hidden"
          >
            <p className="text-sm text-amber-700 leading-relaxed">
              {achievement.description}
            </p>
            {achievement.skills && (
              <div className="flex flex-wrap gap-1 mt-3">
                {achievement.skills.map((skill: string, idx: number) => (
                  <Badge key={idx} variant="outline" className="text-xs bg-white border-amber-300">
                    {skill}
                  </Badge>
                ))}
              </div>
            )}
          </motion.div>
          
          <div className="flex items-center justify-between mt-4 pt-3 border-t border-amber-200">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" className="text-amber-700 hover:bg-amber-100">
                <ThumbsUp className="w-4 h-4 mr-1" />
                12
              </Button>
              <Button variant="ghost" size="sm" className="text-amber-700 hover:bg-amber-100">
                <Share className="w-4 h-4 mr-1" />
                Share
              </Button>
            </div>
            <Button variant="ghost" size="sm" className="text-amber-600">
              {isExpanded ? 'Show Less' : 'Show More'}
              <ChevronRight className={`w-4 h-4 ml-1 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// Project Card Component
function ProjectCard({ project, index }: { project: any; index: number }) {
  const statusColors = {
    'Completed': 'bg-green-100 text-green-800 border-green-300',
    'In Progress': 'bg-blue-100 text-blue-800 border-blue-300',
    'Planning': 'bg-amber-100 text-amber-800 border-amber-300'
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{ scale: 1.02, y: -5 }}
      className="group cursor-pointer"
    >
      <Card className="bg-white/90 backdrop-blur-sm border border-gray-200 hover:shadow-lg transition-all duration-300">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-full group-hover:bg-blue-200 transition-colors">
                <Rocket className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 mb-1">{project.name}</h4>
                <p className="text-sm text-gray-600">{project.tech}</p>
              </div>
            </div>
            <Badge className={statusColors[project.status as keyof typeof statusColors]}>
              {project.status}
            </Badge>
          </div>
          
          {project.description && (
            <p className="text-sm text-gray-600 mb-4 leading-relaxed">
              {project.description}
            </p>
          )}
          
          <div className="flex items-center gap-2">
            {project.link && (
              <Button variant="outline" size="sm" className="flex-1">
                <ExternalLink className="w-4 h-4 mr-1" />
                View Project
              </Button>
            )}
            <Button variant="ghost" size="sm">
              <Edit3 className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export const StudentProfile: React.FC = () => {
  const { user } = useAuth();
  const { scrollYProgress } = useScroll();
  const [activeTab, setActiveTab] = useState('overview');
  const [editMode, setEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [notifications, setNotifications] = useState(3);

  // Profile data with enhanced structure
  const [profileData, setProfileData] = useState({
    bio: "Passionate electronics engineering student with expertise in full-stack development and AI/ML. Seeking innovative internship opportunities to apply theoretical knowledge in real-world projects and contribute to cutting-edge solutions.",
    location: "Jabalpur, Madhya Pradesh, India",
    phone: "+91 9876543210",
    website: "https://johndoe.dev",
    linkedin: "https://linkedin.com/in/johndoe",
    github: "https://github.com/johndoe",
    interests: ["Artificial Intelligence", "Web Development", "IoT", "Blockchain", "Cybersecurity"],
    languages: ["English", "Hindi", "Marathi"],
    availability: "Immediately",
    workMode: "Hybrid"
  });

  // Enhanced student data with more comprehensive information
  const studentData = {
    profileStrength: 92,
    completionTasks: {
      basicInfo: 100,
      resume: 100,
      skills: 85,
      projects: 70,
      achievements: 95,
      preferences: 90
    },
    skills: [
      { name: 'React', level: 'advanced', experience: '2+ years' },
      { name: 'JavaScript', level: 'advanced', experience: '3+ years' },
      { name: 'Python', level: 'intermediate', experience: '1.5 years' },
      { name: 'Node.js', level: 'intermediate', experience: '1 year' },
      { name: 'MongoDB', level: 'intermediate', experience: '1 year' },
      { name: 'C++', level: 'advanced', experience: '2+ years' },
      { name: 'Git', level: 'advanced', experience: '2+ years' },
      { name: 'AWS', level: 'beginner', experience: '6 months' },
      { name: 'Docker', level: 'beginner', experience: '3 months' },
      { name: 'TypeScript', level: 'intermediate', experience: '1 year' }
    ],
    learningSkills: ['Machine Learning', 'Kubernetes', 'GraphQL', 'React Native'],
    recommendedSkills: ['TensorFlow', 'Microservices', 'DevOps', 'Cloud Architecture'],
    university: 'Jabalpur Engineering College, Jabalpur',
    course: 'B.Tech Electronics and Communication Engineering',
    year: '3rd Year',
    semester: '6th Semester',
    enrollmentId: '0201EC231008',
    gpa: 8.9,
    cgpa: 8.7,
    resumeUploaded: true,
    profilePicture: true,
    achievements: [
      { 
        title: 'Smart India Hackathon Winner', 
        description: 'Led a team of 6 developers to create an AI-powered solution for rural healthcare accessibility, winning first place among 1000+ teams nationwide.', 
        date: '2024',
        category: 'Competition',
        skills: ['React', 'Python', 'Machine Learning', 'AWS'],
        impact: 'Solution deployed in 5 states, serving 10,000+ users'
      },
      { 
        title: 'Dean\'s List Scholar', 
        description: 'Maintained consistent academic excellence with CGPA above 8.5 for four consecutive semesters, ranking in top 5% of the class.', 
        date: '2023-24',
        category: 'Academic',
        skills: ['Leadership', 'Research', 'Problem Solving']
      },
      { 
        title: 'Open Source Contributor', 
        description: 'Active contributor to popular open-source projects including React ecosystem libraries, with 150+ commits and 20+ merged PRs.', 
        date: '2024',
        category: 'Technical',
        skills: ['React', 'TypeScript', 'Git', 'Community Building'],
        impact: '500+ developers using contributed features'
      },
      {
        title: 'Tech Community Lead',
        description: 'Founded and led the university\'s first AI/ML club, organizing workshops and competitions for 200+ students.',
        date: '2023',
        category: 'Leadership',
        skills: ['Leadership', 'Event Management', 'Public Speaking'],
        impact: '200+ students trained in AI/ML fundamentals'
      }
    ],
    projects: [
      { 
        name: 'E-Commerce Platform', 
        tech: 'React, Node.js, MongoDB, Stripe', 
        status: 'Completed', 
        link: 'https://github.com/johndoe/ecommerce',
        description: 'Full-stack e-commerce solution with real-time inventory management, secure payments, and analytics dashboard.',
        features: ['Real-time chat', 'Payment integration', 'Admin dashboard', 'Mobile responsive'],
        metrics: '1000+ products, 500+ users, 99.9% uptime'
      },
      { 
        name: 'AI-Powered Chatbot', 
        tech: 'Python, TensorFlow, NLP, FastAPI', 
        status: 'In Progress', 
        link: 'https://github.com/johndoe/chatbot',
        description: 'Intelligent customer service chatbot using natural language processing and machine learning.',
        features: ['Multi-language support', 'Sentiment analysis', 'Learning capability'],
        metrics: '85% accuracy, 50ms response time'
      },
      { 
        name: 'IoT Home Automation', 
        tech: 'Arduino, React Native, Firebase', 
        status: 'Planning', 
        link: '',
        description: 'Smart home system with mobile app control, voice commands, and energy monitoring.',
        features: ['Voice control', 'Energy monitoring', 'Scheduling', 'Security alerts']
      },
      {
        name: 'Blockchain Voting System',
        tech: 'Solidity, Web3.js, React, Ethereum',
        status: 'Completed',
        link: 'https://github.com/johndoe/blockchain-voting',
        description: 'Decentralized voting platform ensuring transparency and security in elections.',
        features: ['Smart contracts', 'Voter verification', 'Real-time results', 'Audit trail'],
        metrics: '100% transparent, zero tampering'
      }
    ],
    stats: {
      applications: 23,
      interviews: 12,
      offers: 5,
      profileViews: 456,
      connectionsMade: 89,
      endorsements: 34
    },
    activities: [
      { type: 'application', description: 'Applied to Software Engineer Intern at Google', time: '2 hours ago' },
      { type: 'skill', description: 'Added Machine Learning skill', time: '1 day ago' },
      { type: 'project', description: 'Updated AI Chatbot project', time: '3 days ago' },
      { type: 'achievement', description: 'Received endorsement for React', time: '1 week ago' }
    ]
  };

  const y = useTransform(scrollYProgress, [0, 1], ['0%', '15%']);

  // Enhanced animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.06,
        duration: 0.8
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8 }
    }
  };

  const slideInVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.6 }
    }
  };

  // Scroll to top functionality
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isLoading) {
    return <LoadingFallback />;
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      {/* Enhanced Three.js Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <Canvas camera={{ position: [0, 0, 6], fov: 45 }}>
          <Suspense fallback={null}>
            <ambientLight intensity={0.4} />
            <pointLight position={[10, 10, 10]} intensity={0.3} />
            <AnimatedBackground />
          </Suspense>
        </Canvas>
      </div>

      {/* Scroll to Top Button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 z-50 p-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors"
          >
            <ArrowUp className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Notification Badge */}
      {notifications > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="fixed top-4 right-4 z-50"
        >
          <Button variant="outline" className="relative">
            <Bell className="w-4 h-4" />
            <span className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
              {notifications}
            </span>
          </Button>
        </motion.div>
      )}

      <DashboardLayout title="">
        <TooltipProvider>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="relative z-10 space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
          >
            {/* Enhanced Profile Header */}
            <motion.div variants={itemVariants}>
              <Card className="overflow-hidden bg-white/95 backdrop-blur-xl border-0 shadow-2xl rounded-3xl">
                {/* Enhanced Cover Background with Pattern */}
                <div className="relative h-56 bg-gradient-to-r from-blue-600 via-blue-700 to-teal-600 overflow-hidden">
                  <motion.div 
                    className="absolute inset-0 opacity-30"
                    style={{ y }}
                  >
                    <div className="w-full h-full bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.4),transparent_70%)]"></div>
                  </motion.div>
                  
                  {/* Enhanced Decorative Pattern */}
                  <div className="absolute inset-0">
                    <motion.div 
                      className="absolute top-6 right-6 w-24 h-24 border-2 border-white/20 rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    />
                    <motion.div 
                      className="absolute bottom-6 left-6 w-16 h-16 border-2 border-white/30 rounded-full"
                      animate={{ rotate: -360 }}
                      transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                    />
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 border border-white/10 rounded-full"></div>
                    
                    {/* Floating elements */}
                    <motion.div 
                      className="absolute top-8 left-1/3 w-3 h-3 bg-white/20 rounded-full"
                      animate={{ y: [-10, 10, -10] }}
                      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    />
                    <motion.div 
                      className="absolute bottom-12 right-1/3 w-2 h-2 bg-white/30 rounded-full"
                      animate={{ y: [10, -10, 10] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    />
                  </div>
                  
                  {/* Edit Cover Button */}
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="absolute top-4 left-4 text-white/80 hover:text-white hover:bg-white/20"
                  >
                    <Edit3 className="w-4 h-4 mr-2" />
                    Edit Cover
                  </Button>
                </div>
                
                <CardContent className="relative px-6 sm:px-8 lg:px-12 py-8">
                  <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8 -mt-24 lg:-mt-20">
                    {/* Enhanced Avatar Section */}
                    <motion.div 
                      className="relative z-10 flex-shrink-0"
                      whileHover={{ scale: 1.02 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <div className="relative">
                        <Avatar className="h-36 w-36 border-4 border-white shadow-2xl ring-4 ring-blue-100">
                          <AvatarImage src={user?.profileImage} className="object-cover" />
                          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-teal-500 text-white text-5xl font-bold">
                            {user?.name?.charAt(0) || 'S'}
                          </AvatarFallback>
                        </Avatar>
                        
                        {/* Enhanced Camera Button */}
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.95 }}
                              className="absolute -bottom-2 -right-2 p-3 bg-gradient-to-r from-blue-500 to-teal-500 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                            >
                              <Camera className="w-4 h-4" />
                            </motion.button>
                          </TooltipTrigger>
                          <TooltipContent>Update profile picture</TooltipContent>
                        </Tooltip>
                        
                        {/* Online Status Indicator */}
                        <div className="absolute top-2 right-2 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                      </div>
                    </motion.div>
                    
                    {/* Enhanced Profile Info */}
                    <div className="flex-1 space-y-6 text-center lg:text-left min-w-0">
                      <div className="space-y-4">
                        <motion.div className="flex items-center justify-center lg:justify-start gap-3">
                          <motion.h1 
                            className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 bg-clip-text text-transparent leading-tight"
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                          >
                            {user?.name || 'Student User'}
                          </motion.h1>
                          {/* Verification Badge */}
                          <Tooltip>
                            <TooltipTrigger>
                              <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.5 }}
                              >
                                <CheckCircle className="w-6 h-6 text-blue-500" />
                              </motion.div>
                            </TooltipTrigger>
                            <TooltipContent>Verified Student</TooltipContent>
                          </Tooltip>
                        </motion.div>
                        
                        <motion.p 
                          className="text-xl sm:text-2xl text-gray-600 font-medium"
                          initial={{ opacity: 0, y: -20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 }}
                        >
                          {studentData.course} • {studentData.year}
                        </motion.p>
                        
                        <motion.p 
                          className="text-gray-500 leading-relaxed text-base max-w-4xl mx-auto lg:mx-0"
                          initial={{ opacity: 0, y: -20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.4 }}
                        >
                          {profileData.bio}
                        </motion.p>
                      </div>
                      
                      {/* Enhanced Contact Info Pills */}
                      <motion.div 
                        className="flex flex-wrap items-center justify-center lg:justify-start gap-3"
                        variants={containerVariants}
                      >
                        <motion.div 
                          variants={itemVariants} 
                          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-150 rounded-full transition-all duration-300 cursor-pointer"
                        >
                          <School className="h-4 w-4 text-blue-600" />
                          <span className="text-sm font-medium text-blue-800 truncate max-w-48">
                            {studentData.university}
                          </span>
                        </motion.div>
                        
                        <motion.div 
                          variants={itemVariants} 
                          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-teal-50 to-teal-100 hover:from-teal-100 hover:to-teal-150 rounded-full transition-all duration-300 cursor-pointer"
                        >
                          <MapPin className="h-4 w-4 text-teal-600" />
                          <span className="text-sm font-medium text-teal-800">
                            {profileData.location.split(',')[0]}
                          </span>
                        </motion.div>
                        
                        <motion.div 
                          variants={itemVariants} 
                          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-50 to-amber-100 hover:from-amber-100 hover:to-amber-150 rounded-full transition-all duration-300 cursor-pointer"
                        >
                          <GraduationCap className="h-4 w-4 text-amber-600" />
                          <span className="text-sm font-medium text-amber-800">
                            CGPA: {studentData.cgpa}/10
                          </span>
                        </motion.div>
                        
                        <motion.div 
                          variants={itemVariants} 
                          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-50 to-emerald-100 hover:from-emerald-100 hover:to-emerald-150 rounded-full transition-all duration-300 cursor-pointer"
                        >
                          <Clock className="h-4 w-4 text-emerald-600" />
                          <span className="text-sm font-medium text-emerald-800">
                            Available {profileData.availability}
                          </span>
                        </motion.div>
                      </motion.div>

                      {/* Enhanced Social Links */}
                      <motion.div 
                        className="flex items-center justify-center lg:justify-start gap-4"
                        variants={containerVariants}
                      >
                        {[
                          { icon: Linkedin, href: profileData.linkedin, color: 'text-blue-600 hover:bg-blue-50' },
                          { icon: Github, href: profileData.github, color: 'text-gray-700 hover:bg-gray-50' },
                          { icon: Link, href: profileData.website, color: 'text-emerald-600 hover:bg-emerald-50' },
                          { icon: Mail, href: `mailto:${user?.email}`, color: 'text-red-500 hover:bg-red-50' }
                        ].map((social, index) => (
                          <Tooltip key={index}>
                            <TooltipTrigger asChild>
                              <motion.a
                                variants={itemVariants}
                                href={social.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`p-3 rounded-full border-2 border-gray-200 transition-all duration-300 ${social.color} hover:scale-110 hover:shadow-lg`}
                                whileHover={{ scale: 1.1, y: -2 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                <social.icon className="w-5 h-5" />
                              </motion.a>
                            </TooltipTrigger>
                            <TooltipContent>
                              {social.icon === Linkedin && 'LinkedIn Profile'}
                              {social.icon === Github && 'GitHub Profile'}
                              {social.icon === Link && 'Personal Website'}
                              {social.icon === Mail && 'Send Email'}
                            </TooltipContent>
                          </Tooltip>
                        ))}
                      </motion.div>
                    </div>
                    
                    {/* Enhanced Action Buttons */}
                    <motion.div 
                      className="flex flex-col gap-3 w-full sm:w-auto sm:min-w-fit"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 }}
                    >
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            className="bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 px-8 py-3"
                            size="lg"
                          >
                            <Edit3 className="w-5 h-5 mr-2" />
                            Edit Profile
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Edit Profile</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <label className="text-sm font-medium">Bio</label>
                              <Textarea 
                                value={profileData.bio}
                                onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                                placeholder="Tell us about yourself..."
                                className="mt-1"
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="text-sm font-medium">Phone</label>
                                <Input 
                                  value={profileData.phone}
                                  onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                                  className="mt-1"
                                />
                              </div>
                              <div>
                                <label className="text-sm font-medium">Work Mode</label>
                                <Input 
                                  value={profileData.workMode}
                                  onChange={(e) => setProfileData(prev => ({ ...prev, workMode: e.target.value }))}
                                  className="mt-1"
                                />
                              </div>
                            </div>
                            <div className="flex justify-end gap-2">
                              <Button variant="outline">Cancel</Button>
                              <Button>Save Changes</Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                      
                      <Button 
                        variant="outline" 
                        className="border-2 hover:border-blue-400 hover:bg-blue-50 px-8 py-3 transition-all duration-300"
                        size="lg"
                      >
                        <Share2 className="w-5 h-5 mr-2" />
                        Share Profile
                      </Button>
                      
                      <Button 
                        variant="ghost" 
                        className="hover:bg-gray-100 px-8 py-3 transition-all duration-300"
                        size="lg"
                      >
                        <Copy className="w-5 h-5 mr-2" />
                        Copy Link
                      </Button>
                    </motion.div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Enhanced Quick Stats */}
            <motion.div variants={itemVariants}>
              <div className="grid grid-cols-2 lg:grid-cols-6 gap-4 sm:gap-6">
                <StatCard
                  label="Applications"
                  value={studentData.stats.applications}
                  icon={Briefcase}
                  color="blue"
                  trend={{ value: 15, isPositive: true }}
                  subtitle="This month"
                />
                <StatCard
                  label="Interviews"
                  value={studentData.stats.interviews}
                  icon={Users}
                  color="teal"
                  trend={{ value: 25, isPositive: true }}
                  subtitle="52% success rate"
                />
                <StatCard
                  label="Offers"
                  value={studentData.stats.offers}
                  icon={Award}
                  color="amber"
                  trend={{ value: 67, isPositive: true }}
                  subtitle="42% conversion"
                />
                <StatCard
                  label="Profile Views"
                  value={studentData.stats.profileViews}
                  icon={Eye}
                  color="purple"
                  trend={{ value: 12, isPositive: true }}
                  subtitle="Last 30 days"
                />
                <StatCard
                  label="Connections"
                  value={studentData.stats.connectionsMade}
                  icon={Users}
                  color="emerald"
                  trend={{ value: 8, isPositive: true }}
                  subtitle="Professional network"
                />
                <StatCard
                  label="Endorsements"
                  value={studentData.stats.endorsements}
                  icon={ThumbsUp}
                  color="blue"
                  trend={{ value: 20, isPositive: true }}
                  subtitle="Skills validated"
                />
              </div>
            </motion.div>

            {/* Enhanced Tabs Section */}
            <motion.div variants={itemVariants}>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
                <TabsList className="grid w-full grid-cols-6 bg-white/95 backdrop-blur-lg border-0 shadow-lg h-14 rounded-2xl p-1">
                  {[
                    { value: 'overview', label: 'Overview', icon: BarChart3 },
                    { value: 'skills', label: 'Skills', icon: Code },
                    { value: 'projects', label: 'Projects', icon: Rocket },
                    { value: 'achievements', label: 'Achievements', icon: Award },
                    { value: 'activity', label: 'Activity', icon: Activity },
                    { value: 'settings', label: 'Settings', icon: Settings }
                  ].map(tab => (
                    <TabsTrigger 
                      key={tab.value}
                      value={tab.value} 
                      className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-teal-500 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300 rounded-xl flex-col gap-1 h-12"
                    >
                      <tab.icon className="w-4 h-4" />
                      <span className="text-xs font-medium hidden sm:block">{tab.label}</span>
                    </TabsTrigger>
                  ))}
                </TabsList>

                {/* Overview Tab - Enhanced */}
                <TabsContent value="overview" className="space-y-8">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Enhanced Profile Strength */}
                    <motion.div variants={slideInVariants}>
                      <Card className="bg-white/95 backdrop-blur-lg border-0 shadow-xl hover:shadow-2xl transition-all duration-300 rounded-2xl">
                        <CardHeader className="text-center pb-4">
                          <CardTitle className="flex items-center justify-center gap-2 text-xl">
                            <TrendingUp className="h-6 w-6 text-blue-600" />
                            Profile Strength
                          </CardTitle>
                          <CardDescription>
                            Complete your profile for better matches
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                          <div className="flex justify-center">
                            <CircularProgress 
                              percentage={studentData.profileStrength} 
                              size={160}
                              strokeWidth={12}
                            />
                          </div>
                          
                          <div className="space-y-4">
                            {Object.entries(studentData.completionTasks).map(([key, value], index) => (
                              <motion.div
                                key={key}
                                className="space-y-2"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.8 + index * 0.1 }}
                              >
                                <div className="flex items-center justify-between text-sm">
                                  <span className="flex items-center gap-2 capitalize">
                                    {value === 100 ? (
                                      <CheckCircle className="h-4 w-4 text-emerald-500" />
                                    ) : value >= 70 ? (
                                      <AlertCircle className="h-4 w-4 text-amber-500" />
                                    ) : (
                                      <AlertCircle className="h-4 w-4 text-red-500" />
                                    )}
                                    <span className="font-medium">{key.replace(/([A-Z])/g, ' $1')}</span>
                                  </span>
                                  <span className="text-xs text-gray-500 font-semibold">{value}%</span>
                                </div>
                                <Progress value={value} className="h-3 rounded-full" />
                              </motion.div>
                            ))}
                          </div>
                          
                          <Button className="w-full bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600">
                            <Plus className="w-4 h-4 mr-2" />
                            Improve Profile
                          </Button>
                        </CardContent>
                      </Card>
                    </motion.div>

                    {/* Enhanced Academic Excellence */}
                    <motion.div variants={slideInVariants}>
                      <Card className="bg-white/95 backdrop-blur-lg border-0 shadow-xl hover:shadow-2xl transition-all duration-300 rounded-2xl">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2 text-xl">
                            <GraduationCap className="h-6 w-6 text-teal-600" />
                            Academic Excellence
                          </CardTitle>
                          <CardDescription>
                            Your academic achievements and standing
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                          <div className="text-center space-y-2">
                            <div className="text-5xl font-bold text-teal-600 mb-2">
                              <AnimatedCounter value={studentData.cgpa} suffix="/10" format="decimal" />
                            </div>
                            <p className="text-sm text-gray-600 font-medium">Current CGPA</p>
                            <Badge className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-4 py-1">
                              <Crown className="h-3 w-3 mr-1" />
                              First Class with Distinction
                            </Badge>
                          </div>
                          
                          <div className="space-y-4">
                            {[
                              { label: 'Current Semester', value: studentData.semester, color: 'bg-blue-50 text-blue-800' },
                              { label: 'Academic Year', value: studentData.year, color: 'bg-teal-50 text-teal-800' },
                              { label: 'Class Ranking', value: 'Top 5%', color: 'bg-emerald-50 text-emerald-800' },
                              { label: 'Credits Completed', value: '156/200', color: 'bg-amber-50 text-amber-800' }
                            ].map((item, index) => (
                              <motion.div
                                key={item.label}
                                className="flex justify-between items-center p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                              >
                                <span className="text-sm font-medium text-gray-700">{item.label}</span>
                                <Badge className={`${item.color} px-3 py-1`}>
                                  {item.value}
                                </Badge>
                              </motion.div>
                            ))}
                          </div>

                          <div className="space-y-3">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Academic Progress</span>
                              <span className="font-medium">78% Complete</span>
                            </div>
                            <Progress value={78} className="h-3 rounded-full" />
                            <p className="text-xs text-center text-gray-500">Expected graduation: May 2025</p>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>

                    {/* Enhanced Documents & Resume */}
                    <motion.div variants={slideInVariants}>
                      <Card className="bg-white/95 backdrop-blur-lg border-0 shadow-xl hover:shadow-2xl transition-all duration-300 rounded-2xl">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2 text-xl">
                            <Upload className="h-6 w-6 text-amber-600" />
                            Documents
                          </CardTitle>
                          <CardDescription>
                            Manage your resume and certificates
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                          {studentData.resumeUploaded ? (
                            <div className="space-y-4">
                              <div className="p-4 bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl border border-emerald-200">
                                <div className="flex items-center gap-3 mb-3">
                                  <div className="p-2 bg-emerald-100 rounded-full">
                                    <CheckCircle className="h-6 w-6 text-emerald-600" />
                                  </div>
                                  <div>
                                    <p className="font-semibold text-emerald-800">Resume Active</p>
                                    <p className="text-xs text-emerald-600">Last updated 2 days ago • ATS Optimized</p>
                                  </div>
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                  <Button variant="outline" size="sm" className="hover:bg-emerald-50">
                                    <Eye className="w-4 h-4 mr-1" />
                                    Preview
                                  </Button>
                                  <Button variant="outline" size="sm" className="hover:bg-blue-50">
                                    <Download className="w-4 h-4 mr-1" />
                                    Download
                                  </Button>
                                </div>
                              </div>
                              
                              {/* Additional Documents */}
                              <div className="space-y-2">
                                <h4 className="font-medium text-gray-900">Additional Documents</h4>
                                {[
                                  { name: 'Academic Transcript', status: 'verified', icon: FileText },
                                  { name: 'Portfolio', status: 'active', icon: Image },
                                  { name: 'Certificates', status: 'pending', icon: Award }
                                ].map((doc, index) => (
                                  <div key={doc.name} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                                    <div className="flex items-center gap-2">
                                      <doc.icon className="w-4 h-4 text-gray-600" />
                                      <span className="text-sm font-medium">{doc.name}</span>
                                    </div>
                                    <Badge variant={doc.status === 'verified' ? 'default' : 'outline'} className="text-xs">
                                      {doc.status}
                                    </Badge>
                                  </div>
                                ))}
                              </div>
                              
                              <Button variant="outline" className="w-full hover:bg-amber-50 hover:border-amber-400">
                                <Upload className="w-4 h-4 mr-2" />
                                Update Resume
                              </Button>
                            </div>
                          ) : (
                            <div className="text-center py-8">
                              <Upload className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                              <h4 className="font-semibold text-gray-900 mb-2">No resume uploaded</h4>
                              <p className="text-sm text-gray-600 mb-4">Upload your resume to get better matches</p>
                              <Button className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600">
                                <Upload className="w-4 h-4 mr-2" />
                                Upload Resume
                              </Button>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </motion.div>
                  </div>

                  {/* Recent Activity Feed */}
                  <motion.div variants={itemVariants}>
                    <Card className="bg-white/95 backdrop-blur-lg border-0 shadow-xl rounded-2xl">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-xl">
                          <Activity className="h-6 w-6 text-purple-600" />
                          Recent Activity
                        </CardTitle>
                        <CardDescription>
                          Your latest actions and updates
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {studentData.activities.map((activity, index) => (
                            <motion.div
                              key={index}
                              className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.1 }}
                            >
                              <div className={`p-2 rounded-full ${
                                activity.type === 'application' ? 'bg-blue-100 text-blue-600' :
                                activity.type === 'skill' ? 'bg-green-100 text-green-600' :
                                activity.type === 'project' ? 'bg-purple-100 text-purple-600' :
                                'bg-amber-100 text-amber-600'
                              }`}>
                                {activity.type === 'application' && <Briefcase className="w-4 h-4" />}
                                {activity.type === 'skill' && <Code className="w-4 h-4" />}
                                {activity.type === 'project' && <Rocket className="w-4 h-4" />}
                                {activity.type === 'achievement' && <Award className="w-4 h-4" />}
                              </div>
                              <div className="flex-1">
                                <p className="text-sm font-medium text-gray-900">{activity.description}</p>
                                <p className="text-xs text-gray-500">{activity.time}</p>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                        <Button variant="outline" className="w-full mt-4">
                          View All Activity
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                </TabsContent>

                {/* Enhanced Skills Tab */}
                <TabsContent value="skills" className="space-y-8">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Current Skills */}
                    <motion.div variants={slideInVariants}>
                      <Card className="bg-white/95 backdrop-blur-lg border-0 shadow-xl rounded-2xl">
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <div>
                              <CardTitle className="flex items-center gap-2 text-xl">
                                <Brain className="h-6 w-6 text-blue-600" />
                                Technical Skills
                              </CardTitle>
                              <CardDescription>
                                Your current technical expertise and proficiency levels
                              </CardDescription>
                            </div>
                            <Button variant="outline" size="sm">
                              <Plus className="w-4 h-4 mr-1" />
                              Add Skill
                            </Button>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-6">
                          <div className="flex flex-wrap gap-3">
                            {studentData.skills.map((skill, index) => (
                              <SkillTag 
                                key={skill.name} 
                                skill={skill.name} 
                                index={index} 
                                type="current"
                                level={skill.level as any}
                                onRemove={() => {
                                  // Handle skill removal
                                  console.log('Remove skill:', skill.name);
                                }}
                                onClick={() => {
                                  // Handle skill click (show details)
                                  console.log('Skill details:', skill);
                                }}
                              />
                            ))}
                          </div>
                          
                          {/* Skill Level Distribution */}
                          <div className="space-y-3">
                            <h4 className="font-medium text-gray-900">Skill Distribution</h4>
                            {[
                              { level: 'Advanced', count: 4, color: 'emerald' },
                              { level: 'Intermediate', count: 4, color: 'blue' },
                              { level: 'Beginner', count: 2, color: 'slate' }
                            ].map((item) => (
                              <div key={item.level} className="flex items-center justify-between">
                                <span className="text-sm font-medium text-gray-700">{item.level}</span>
                                <div className="flex items-center gap-2">
                                  <div className={`w-20 h-2 bg-${item.color}-200 rounded-full overflow-hidden`}>
                                    <div 
                                      className={`h-full bg-${item.color}-500 rounded-full transition-all duration-1000`}
                                      style={{ width: `${(item.count / 10) * 100}%` }}
                                    ></div>
                                  </div>
                                  <span className="text-sm text-gray-500">{item.count}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>

                    {/* Learning & Recommended Skills */}
                    <div className="space-y-6">
                      {/* Currently Learning */}
                      <motion.div variants={slideInVariants}>
                        <Card className="bg-white/95 backdrop-blur-lg border-0 shadow-xl rounded-2xl">
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                              <Clock className="h-5 w-5 text-orange-600" />
                              Currently Learning
                            </CardTitle>
                            <CardDescription>
                              Skills you're actively developing
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="flex flex-wrap gap-3">
                              {studentData.learningSkills.map((skill, index) => (
                                <SkillTag 
                                  key={skill} 
                                  skill={skill} 
                                  index={index} 
                                  type="learning"
                                />
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>

                      {/* Recommended Skills */}
                      <motion.div variants={slideInVariants}>
                        <Card className="bg-white/95 backdrop-blur-lg border-0 shadow-xl rounded-2xl">
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                              <Lightbulb className="h-5 w-5 text-teal-600" />
                              Skill Recommendations
                            </CardTitle>
                            <CardDescription>
                              Skills that could enhance your profile
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div className="flex flex-wrap gap-3">
                              {studentData.recommendedSkills.map((skill, index) => (
                                <SkillTag 
                                  key={skill} 
                                  skill={skill} 
                                  index={index} 
                                  type="recommended"
                                  onClick={() => {
                                    // Add to learning list
                                    console.log('Add to learning:', skill);
                                  }}
                                />
                              ))}
                            </div>
                            <Button 
                              variant="outline" 
                              className="w-full hover:bg-teal-50 hover:border-teal-400"
                            >
                              <Target className="w-4 h-4 mr-2" />
                              Create Learning Path
                            </Button>
                          </CardContent>
                        </Card>
                      </motion.div>
                    </div>
                  </div>
                </TabsContent>

                {/* Enhanced Projects Tab */}
                <TabsContent value="projects" className="space-y-8">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">My Projects</h2>
                      <p className="text-gray-600">Showcase your work and technical achievements</p>
                    </div>
                    <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Project
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {studentData.projects.map((project, index) => (
                      <ProjectCard key={project.name} project={project} index={index} />
                    ))}
                  </div>
                </TabsContent>

                {/* Enhanced Achievements Tab */}
                <TabsContent value="achievements" className="space-y-8">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">Achievements & Recognition</h2>
                      <p className="text-gray-600">Your accomplishments and milestones</p>
                    </div>
                    <Button className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Achievement
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {studentData.achievements.map((achievement, index) => (
                      <AchievementCard key={achievement.title} achievement={achievement} index={index} />
                    ))}
                  </div>
                </TabsContent>

                {/* Activity Tab */}
                <TabsContent value="activity" className="space-y-6">
                  <Card className="bg-white/95 backdrop-blur-lg border-0 shadow-xl rounded-2xl">
                    <CardContent className="p-12 text-center">
                      <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Activity className="w-10 h-10 text-purple-600" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-3">Activity Timeline</h3>
                      <p className="text-gray-600 max-w-md mx-auto">
                        Comprehensive activity tracking and analytics coming soon.
                      </p>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Settings Tab */}
                <TabsContent value="settings" className="space-y-6">
                  <Card className="bg-white/95 backdrop-blur-lg border-0 shadow-xl rounded-2xl">
                    <CardContent className="p-12 text-center">
                      <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Settings className="w-10 h-10 text-gray-600" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-3">Profile Settings</h3>
                      <p className="text-gray-600 max-w-md mx-auto">
                        Privacy settings, notifications, and account preferences.
                      </p>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </motion.div>

            {/* Enhanced Quick Actions */}
            <motion.div
              variants={itemVariants}
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              {[
                { 
                  title: 'Update Preferences', 
                  icon: Settings, 
                  color: 'blue', 
                  description: 'Modify your internship preferences and career goals',
                  action: 'Configure',
                  gradient: 'from-blue-500 to-cyan-500'
                },
                { 
                  title: 'View Applications', 
                  icon: Briefcase, 
                  color: 'teal', 
                  description: 'Track your application status and interview schedules',
                  action: 'View Status',
                  gradient: 'from-teal-500 to-emerald-500'
                },
                { 
                  title: 'Discover Opportunities', 
                  icon: Globe, 
                  color: 'amber', 
                  description: 'Explore new internships matched to your profile',
                  action: 'Explore Now',
                  gradient: 'from-amber-500 to-orange-500'
                }
              ].map((action, index) => (
                <motion.div
                  key={action.title}
                  whileHover={{ scale: 1.03, y: -8 }}
                  whileTap={{ scale: 0.98 }}
                  className="cursor-pointer group"
                >
                  <Card className="bg-white/90 backdrop-blur-sm border-0 hover:shadow-2xl transition-all duration-500 rounded-2xl overflow-hidden">
                    <div className={`h-2 bg-gradient-to-r ${action.gradient}`}></div>
                    <CardContent className="p-8">
                      <div className="flex items-start justify-between mb-6">
                        <div className={`p-4 bg-gradient-to-r ${action.gradient} rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                          <action.icon className="w-8 h-8 text-white" />
                        </div>
                        <ChevronRight className="w-6 h-6 text-gray-400 group-hover:text-gray-600 group-hover:translate-x-1 transition-all duration-300" />
                      </div>
                      <div className="space-y-4">
                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-gray-700 transition-colors">
                          {action.title}
                        </h3>
                        <p className="text-gray-600 leading-relaxed">
                          {action.description}
                        </p>
                        <Button 
                          className={`w-full bg-gradient-to-r ${action.gradient} hover:shadow-lg transition-all duration-300`}
                        >
                          {action.action}
                          <ArrowUp className="w-4 h-4 ml-2 rotate-45" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </TooltipProvider>
      </DashboardLayout>
    </div>
  );
};

export default StudentProfile;
