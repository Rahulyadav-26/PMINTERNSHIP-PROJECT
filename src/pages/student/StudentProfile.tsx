import React, { useRef, useEffect, useState, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, MeshDistortMaterial, Text, Float } from '@react-three/drei';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
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
import {
  User, Mail, School, BookOpen, Upload, Star, TrendingUp, CheckCircle,
  AlertCircle, Edit3, Camera, MapPin, Calendar, Award, Target,
  Zap, Brain, Code, Lightbulb, Rocket, Shield, Settings,
  Download, Share2, ExternalLink, Plus, X, ChevronRight,
  BarChart3, PieChart, Activity, Globe, Briefcase, Users, Eye
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import * as THREE from 'three';

// Three.js Background Component
function AnimatedBackground() {
  const meshRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.2;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.1;
    }
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.05;
    }
  });

  return (
    <group ref={groupRef}>
      <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.5}>
        <Sphere ref={meshRef} args={[1, 64, 64]} position={[2, 0, -5]}>
          <MeshDistortMaterial
            color="#1E3A8A"
            attach="material"
            distort={0.4}
            speed={2}
            opacity={0.1}
            transparent
          />
        </Sphere>
      </Float>
      
      <Float speed={2} rotationIntensity={0.3} floatIntensity={0.3}>
        <Sphere args={[0.5, 32, 32]} position={[-2, 1, -3]}>
          <MeshDistortMaterial
            color="#14B8A6"
            attach="material"
            distort={0.3}
            speed={1.5}
            opacity={0.08}
            transparent
          />
        </Sphere>
      </Float>
      
      <Float speed={1.8} rotationIntensity={0.4} floatIntensity={0.4}>
        <Sphere args={[0.3, 32, 32]} position={[1, -1, -2]}>
          <MeshDistortMaterial
            color="#F59E0B"
            attach="material"
            distort={0.2}
            speed={3}
            opacity={0.06}
            transparent
          />
        </Sphere>
      </Float>
    </group>
  );
}

// Animated Counter Component
function AnimatedCounter({ value, suffix = '', duration = 2 }: { value: number; suffix?: string; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref);

  useEffect(() => {
    if (isInView) {
      let start = 0;
      const end = value;
      const increment = end / (duration * 60); // 60fps
      
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
}

// Skill Tag Component with Animation
function SkillTag({ skill, index, type = 'current' }: { skill: string; index: number; type?: 'current' | 'recommended' }) {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{ scale: 1.05, y: -2 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Badge 
        className={`
          relative overflow-hidden cursor-pointer transition-all duration-300
          ${type === 'current' 
            ? 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white' 
            : 'bg-gradient-to-r from-gray-100 to-gray-200 hover:from-teal-100 hover:to-teal-200 text-gray-700 border-2 border-dashed border-gray-300 hover:border-teal-400'
          }
        `}
      >
        <motion.div
          className="absolute inset-0 bg-white opacity-0"
          animate={{ opacity: isHovered ? 0.2 : 0 }}
          transition={{ duration: 0.2 }}
        />
        <span className="relative z-10 flex items-center gap-1">
          {type === 'recommended' && <Plus className="w-3 h-3" />}
          {skill}
        </span>
      </Badge>
    </motion.div>
  );
}

// Profile Strength Circular Progress
function CircularProgress({ percentage }: { percentage: number }) {
  const [animatedPercentage, setAnimatedPercentage] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref);

  useEffect(() => {
    if (isInView) {
      const timer = setTimeout(() => {
        setAnimatedPercentage(percentage);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isInView, percentage]);

  const circumference = 2 * Math.PI * 45;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (animatedPercentage / 100) * circumference;

  const getColor = (percent: number) => {
    if (percent >= 80) return '#10B981'; // Green
    if (percent >= 60) return '#F59E0B'; // Amber
    return '#EF4444'; // Red
  };

  return (
    <div ref={ref} className="relative w-32 h-32 mx-auto">
      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
        <circle
          cx="50"
          cy="50"
          r="45"
          stroke="currentColor"
          strokeWidth="8"
          fill="transparent"
          className="text-gray-200"
        />
        <motion.circle
          cx="50"
          cy="50"
          r="45"
          stroke={getColor(percentage)}
          strokeWidth="8"
          fill="transparent"
          strokeLinecap="round"
          strokeDasharray={strokeDasharray}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 2 }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl font-bold" style={{ color: getColor(percentage) }}>
            <AnimatedCounter value={percentage} suffix="%" />
          </div>
          <div className="text-xs text-gray-500">Complete</div>
        </div>
      </div>
    </div>
  );
}

export const StudentProfile: React.FC = () => {
  const { user } = useAuth();
  const { scrollYProgress } = useScroll();
  const [activeTab, setActiveTab] = useState('overview');
  const [editMode, setEditMode] = useState(false);
  const [profileData, setProfileData] = useState({
    bio: "Passionate electronics engineering student with a keen interest in emerging technologies and sustainable solutions.",
    location: "Jabalpur, Madhya Pradesh, India",
    website: "https://johndoe.dev",
    linkedin: "https://linkedin.com/in/johndoe",
    github: "https://github.com/johndoe"
  });

  // Mock student data
  const studentData = {
    profileStrength: 78,
    skills: ['React', 'JavaScript', 'Python', 'Node.js', 'MongoDB', 'C++', 'Git', 'Figma'],
    missingSkills: ['Docker', 'AWS', 'Machine Learning', 'Kubernetes', 'GraphQL'],
    university: 'Jabalpur Engineering College, Jabalpur',
    course: 'B.Tech Electronics and Communication Engineering',
    year: '3rd Year',
    enrollmentId: '0201EC231008',
    gpa: 8.5,
    resumeUploaded: true,
    achievements: [
      { title: 'Hackathon Winner', description: 'First place in National Coding Championship', date: '2024' },
      { title: 'Dean\'s List', description: 'Academic Excellence Award', date: '2023-24' },
      { title: 'Open Source Contributor', description: '50+ contributions to React projects', date: '2024' }
    ],
    projects: [
      { name: 'E-Commerce Platform', tech: 'React, Node.js, MongoDB', status: 'Completed' },
      { name: 'AI Chatbot', tech: 'Python, TensorFlow', status: 'In Progress' },
      { name: 'Mobile App', tech: 'React Native', status: 'Planning' }
    ],
    stats: {
      applications: 12,
      interviews: 5,
      offers: 2,
      profileViews: 156
    }
  };

  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);

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
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Three.js Background */}
      <div className="fixed inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
          <Suspense fallback={null}>
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} />
            <AnimatedBackground />
          </Suspense>
        </Canvas>
      </div>

      <DashboardLayout title="">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="relative z-10 space-y-8"
        >
          {/* Enhanced Profile Header */}
          <motion.div variants={itemVariants}>
            <Card className="overflow-hidden bg-white/80 backdrop-blur-lg border-0 shadow-2xl">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-blue-700 to-teal-600 h-32"></div>
                <motion.div 
                  className="absolute inset-0 opacity-30"
                  style={{ y }}
                >
                  <div className="w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_50%)]"></div>
                </motion.div>
              </div>
              
              <CardContent className="relative pt-20 pb-8">
                <div className="flex flex-col lg:flex-row items-start gap-8">
                  <motion.div 
                    className="relative -mt-16 z-10"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="relative">
                      <Avatar className="h-32 w-32 border-4 border-white shadow-xl">
                        <AvatarImage src={user?.profileImage} />
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-teal-500 text-white text-4xl font-bold">
                          {user?.name?.charAt(0) || 'S'}
                        </AvatarFallback>
                      </Avatar>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-lg border-2 border-gray-100 hover:border-blue-400 transition-colors"
                      >
                        <Camera className="w-4 h-4 text-gray-600" />
                      </motion.button>
                    </div>
                  </motion.div>
                  
                  <div className="flex-1 space-y-6">
                    <div className="space-y-2">
                      <motion.h1 
                        className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        {user?.name}
                      </motion.h1>
                      <motion.p 
                        className="text-xl text-gray-600 font-medium"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                      >
                        {studentData.course}
                      </motion.p>
                      <motion.p 
                        className="text-gray-500"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                      >
                        {profileData.bio}
                      </motion.p>
                    </div>
                    
                    <motion.div 
                      className="grid grid-cols-1 md:grid-cols-3 gap-6"
                      variants={containerVariants}
                    >
                      <motion.div variants={itemVariants} className="flex items-center space-x-3 p-3 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg">
                        <School className="h-5 w-5 text-blue-600" />
                        <div>
                          <p className="text-sm font-medium text-blue-900">University</p>
                          <p className="text-xs text-blue-700">{studentData.university}</p>
                        </div>
                      </motion.div>
                      
                      <motion.div variants={itemVariants} className="flex items-center space-x-3 p-3 bg-gradient-to-r from-teal-50 to-teal-100 rounded-lg">
                        <MapPin className="h-5 w-5 text-teal-600" />
                        <div>
                          <p className="text-sm font-medium text-teal-900">Location</p>
                          <p className="text-xs text-teal-700">{profileData.location}</p>
                        </div>
                      </motion.div>
                      
                      <motion.div variants={itemVariants} className="flex items-center space-x-3 p-3 bg-gradient-to-r from-amber-50 to-amber-100 rounded-lg">
                        <User className="h-5 w-5 text-amber-600" />
                        <div>
                          <p className="text-sm font-medium text-amber-900">Student ID</p>
                          <p className="text-xs text-amber-700">{studentData.enrollmentId}</p>
                        </div>
                      </motion.div>
                    </motion.div>
                  </div>
                  
                  <motion.div 
                    className="flex flex-col sm:flex-row gap-3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <Button 
                      onClick={() => setEditMode(!editMode)}
                      className="bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <Edit3 className="w-4 h-4 mr-2" />
                      {editMode ? 'Save Changes' : 'Edit Profile'}
                    </Button>
                    <Button variant="outline" className="border-2 hover:border-blue-400 hover:bg-blue-50">
                      <Share2 className="w-4 h-4 mr-2" />
                      Share Profile
                    </Button>
                  </motion.div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Quick Stats */}
          <motion.div variants={itemVariants}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Applications', value: studentData.stats.applications, icon: Briefcase, color: 'blue' },
                { label: 'Interviews', value: studentData.stats.interviews, icon: Users, color: 'teal' },
                { label: 'Offers', value: studentData.stats.offers, icon: Award, color: 'amber' },
                { label: 'Profile Views', value: studentData.stats.profileViews, icon: Eye, color: 'purple' }
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                >
                  <Card className={`bg-gradient-to-br from-${stat.color}-50 to-${stat.color}-100 border-${stat.color}-200 hover:shadow-lg transition-all duration-300`}>
                    <CardContent className="p-4 text-center">
                      <div className={`inline-flex p-2 rounded-full bg-${stat.color}-200 mb-2`}>
                        <stat.icon className={`w-5 h-5 text-${stat.color}-700`} />
                      </div>
                      <div className={`text-2xl font-bold text-${stat.color}-900`}>
                        <AnimatedCounter value={stat.value} />
                      </div>
                      <div className={`text-sm text-${stat.color}-700 font-medium`}>{stat.label}</div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Enhanced Tabs Section */}
          <motion.div variants={itemVariants}>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-5 bg-white/80 backdrop-blur-lg border shadow-lg">
                <TabsTrigger value="overview" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-teal-500 data-[state=active]:text-white">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Overview
                </TabsTrigger>
                <TabsTrigger value="skills" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-teal-500 data-[state=active]:text-white">
                  <Code className="w-4 h-4 mr-2" />
                  Skills
                </TabsTrigger>
                <TabsTrigger value="academic" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-teal-500 data-[state=active]:text-white">
                  <BookOpen className="w-4 h-4 mr-2" />
                  Academic
                </TabsTrigger>
                <TabsTrigger value="projects" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-teal-500 data-[state=active]:text-white">
                  <Rocket className="w-4 h-4 mr-2" />
                  Projects
                </TabsTrigger>
                <TabsTrigger value="settings" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-teal-500 data-[state=active]:text-white">
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Profile Strength */}
                  <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                  >
                    <Card className="bg-white/80 backdrop-blur-lg border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
                      <CardHeader className="text-center">
                        <CardTitle className="flex items-center justify-center space-x-2">
                          <TrendingUp className="h-5 w-5 text-blue-600" />
                          <span>Profile Strength</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <CircularProgress percentage={studentData.profileStrength} />
                        
                        <div className="space-y-3">
                          {[
                            { label: 'Basic Info', status: 'complete', icon: CheckCircle },
                            { label: 'Resume', status: 'complete', icon: CheckCircle },
                            { label: 'Skills', status: 'partial', icon: AlertCircle },
                            { label: 'Projects', status: 'incomplete', icon: AlertCircle }
                          ].map((item, index) => (
                            <motion.div
                              key={item.label}
                              className="flex items-center justify-between text-sm"
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.8 + index * 0.1 }}
                            >
                              <span className="flex items-center space-x-2">
                                <item.icon className={`h-4 w-4 ${
                                  item.status === 'complete' ? 'text-green-500' : 
                                  item.status === 'partial' ? 'text-amber-500' : 'text-red-500'
                                }`} />
                                <span>{item.label}</span>
                              </span>
                              <Badge variant={item.status === 'complete' ? 'default' : 'outline'}>
                                {item.status === 'complete' ? 'Complete' : 
                                 item.status === 'partial' ? 'Partial' : 'Incomplete'}
                              </Badge>
                            </motion.div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>

                  {/* Academic Info */}
                  <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                  >
                    <Card className="bg-white/80 backdrop-blur-lg border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
                      <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                          <BookOpen className="h-5 w-5 text-teal-600" />
                          <span>Academic Excellence</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="text-center">
                          <div className="text-3xl font-bold text-teal-600 mb-1">
                            <AnimatedCounter value={studentData.gpa} suffix="/10" />
                          </div>
                          <p className="text-sm text-gray-600">Current CGPA</p>
                        </div>
                        
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Academic Year</span>
                            <Badge className="bg-gradient-to-r from-teal-500 to-blue-500 text-white">
                              {studentData.year}
                            </Badge>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Performance</span>
                            <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white">
                              <Star className="h-3 w-3 mr-1" />
                              Excellent
                            </Badge>
                          </div>
                        </div>

                        <Progress value={85} className="h-2" />
                        <p className="text-xs text-center text-gray-500">Top 15% of class</p>
                      </CardContent>
                    </Card>
                  </motion.div>

                  {/* Resume & Documents */}
                  <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                  >
                    <Card className="bg-white/80 backdrop-blur-lg border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
                      <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                          <Upload className="h-5 w-5 text-amber-600" />
                          <span>Documents</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="text-center space-y-3">
                          <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                            <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                            <p className="text-sm font-medium text-green-800">Resume Uploaded</p>
                            <p className="text-xs text-green-600 mt-1">Last updated: 2 days ago</p>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-2">
                            <Button variant="outline" size="sm" className="hover:bg-blue-50 hover:border-blue-400">
                              <Download className="w-4 h-4 mr-1" />
                              Download
                            </Button>
                            <Button variant="outline" size="sm" className="hover:bg-teal-50 hover:border-teal-400">
                              <Edit3 className="w-4 h-4 mr-1" />
                              Update
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </div>

                {/* Achievements Section */}
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                >
                  <Card className="bg-white/80 backdrop-blur-lg border-0 shadow-xl">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Award className="h-5 w-5 text-amber-600" />
                        <span>Achievements & Recognition</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {studentData.achievements.map((achievement, index) => (
                          <motion.div
                            key={achievement.title}
                            className="p-4 bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg border border-amber-200 hover:shadow-md transition-all duration-300"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.8 + index * 0.1 }}
                            whileHover={{ scale: 1.02, y: -2 }}
                          >
                            <div className="flex items-start space-x-3">
                              <div className="p-2 bg-amber-200 rounded-full">
                                <Award className="w-4 h-4 text-amber-700" />
                              </div>
                              <div className="flex-1">
                                <h4 className="font-semibold text-amber-900">{achievement.title}</h4>
                                <p className="text-sm text-amber-700 mt-1">{achievement.description}</p>
                                <p className="text-xs text-amber-600 mt-2">{achievement.date}</p>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>

              {/* Skills Tab */}
              <TabsContent value="skills" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                  >
                    <Card className="bg-white/80 backdrop-blur-lg border-0 shadow-xl">
                      <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                          <Brain className="h-5 w-5 text-blue-600" />
                          <span>Current Skills</span>
                        </CardTitle>
                        <CardDescription>
                          Skills extracted from your resume and portfolio
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-2">
                          {studentData.skills.map((skill, index) => (
                            <SkillTag key={skill} skill={skill} index={index} type="current" />
                          ))}
                        </div>
                        <Button 
                          variant="outline" 
                          className="w-full mt-4 hover:bg-blue-50 hover:border-blue-400"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add Skills
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                  >
                    <Card className="bg-white/80 backdrop-blur-lg border-0 shadow-xl">
                      <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                          <Lightbulb className="h-5 w-5 text-teal-600" />
                          <span>Recommended Skills</span>
                        </CardTitle>
                        <CardDescription>
                          Skills that could boost your profile strength
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-2">
                          {studentData.missingSkills.map((skill, index) => (
                            <SkillTag key={skill} skill={skill} index={index} type="recommended" />
                          ))}
                        </div>
                        <Button 
                          variant="outline" 
                          className="w-full mt-4 hover:bg-teal-50 hover:border-teal-400"
                        >
                          <Target className="w-4 h-4 mr-2" />
                          Learn These Skills
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                </div>
              </TabsContent>

              {/* Other tabs content would go here... */}
              <TabsContent value="academic">
                <Card className="bg-white/80 backdrop-blur-lg border-0 shadow-xl">
                  <CardContent className="p-8 text-center">
                    <School className="w-16 h-16 text-teal-600 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Academic Details</h3>
                    <p className="text-gray-600">Detailed academic information coming soon...</p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="projects">
                <Card className="bg-white/80 backdrop-blur-lg border-0 shadow-xl">
                  <CardContent className="p-8 text-center">
                    <Rocket className="w-16 h-16 text-amber-600 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Projects & Portfolio</h3>
                    <p className="text-gray-600">Project showcase coming soon...</p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="settings">
                <Card className="bg-white/80 backdrop-blur-lg border-0 shadow-xl">
                  <CardContent className="p-8 text-center">
                    <Settings className="w-16 h-16 text-purple-600 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Profile Settings</h3>
                    <p className="text-gray-600">Privacy and notification settings coming soon...</p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            {[
              { title: 'Update Preferences', icon: Settings, color: 'blue', description: 'Modify your internship preferences' },
              { title: 'View Applications', icon: Briefcase, color: 'teal', description: 'Check your application status' },
              { title: 'Explore Opportunities', icon: Globe, color: 'amber', description: 'Find new internship matches' }
            ].map((action, index) => (
              <motion.div
                key={action.title}
                whileHover={{ scale: 1.02, y: -5 }}
                whileTap={{ scale: 0.98 }}
                className="cursor-pointer"
              >
                <Card className={`bg-gradient-to-br from-${action.color}-50 to-${action.color}-100 border-${action.color}-200 hover:shadow-lg transition-all duration-300`}>
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className={`p-3 bg-${action.color}-200 rounded-full`}>
                        <action.icon className={`w-6 h-6 text-${action.color}-700`} />
                      </div>
                      <div className="flex-1">
                        <h3 className={`font-semibold text-${action.color}-900`}>{action.title}</h3>
                        <p className={`text-sm text-${action.color}-700 mt-1`}>{action.description}</p>
                      </div>
                      <ChevronRight className={`w-5 h-5 text-${action.color}-600`} />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </DashboardLayout>
    </div>
  );
};
