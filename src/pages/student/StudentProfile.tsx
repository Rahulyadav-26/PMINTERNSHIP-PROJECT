import React, { useRef, useEffect, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, MeshDistortMaterial, Float } from '@react-three/drei';
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
import {
  User, Mail, School, BookOpen, Upload, Star, TrendingUp, CheckCircle,
  AlertCircle, Edit3, Camera, MapPin, Calendar, Award, Target,
  Zap, Brain, Code, Lightbulb, Rocket, Shield, Settings,
  Download, Share2, ExternalLink, Plus, X, ChevronRight,
  BarChart3, PieChart, Activity, Globe, Briefcase, Users, Eye,
  FileText, Clock, Building2, GraduationCap, Trophy
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useStudent } from '@/contexts/StudentContext';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import * as THREE from 'three';

// Enhanced Analytics Panel Component (following Applications pattern)
function AnalyticsPanel({ studentData }: { studentData: any }) {
  const stats = useMemo(() => [
    { 
      label: 'Profile Strength', 
      value: studentData.profileStrength, 
      icon: TrendingUp, 
      suffix: '%',
      description: 'Profile completion'
    },
    { 
      label: 'Total Applications', 
      value: studentData.stats.applications, 
      icon: Briefcase, 
      suffix: '',
      description: 'Applications sent'
    },
    { 
      label: 'Skills Mastered', 
      value: studentData.skills.length, 
      icon: Brain, 
      suffix: '',
      description: 'Technical skills'
    },
    { 
      label: 'Profile Views', 
      value: studentData.stats.profileViews, 
      icon: Eye, 
      suffix: '',
      description: 'This month'
    }
  ], [studentData]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      {stats.map((stat, index) => (
        <Card key={stat.label} className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 font-medium">{stat.label}</p>
                <p className="text-2xl font-bold text-blue-900">
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                </p>
              </div>
              <div className="p-2 bg-blue-200 rounded-lg">
                <stat.icon className="w-6 h-6 text-blue-700" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// Enhanced Animated Counter Component
function AnimatedCounter({ value, suffix = '', duration = 2 }: { value: number; suffix?: string; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref);

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
}

// Enhanced Skill Tag Component
function SkillTag({ skill, index, type = 'current' }: { skill: string; index: number; type?: 'current' | 'recommended' }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      whileHover={{ scale: 1.05, y: -2 }}
    >
      <Badge 
        className={`
          cursor-pointer transition-all duration-300 px-3 py-1 text-sm font-medium
          ${type === 'current' 
            ? 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-sm hover:shadow-md' 
            : 'bg-gradient-to-r from-gray-100 to-gray-200 hover:from-teal-100 hover:to-teal-200 text-gray-700 border-2 border-dashed border-gray-300 hover:border-teal-400'
          }
        `}
      >
        <span className="flex items-center gap-1">
          {type === 'recommended' && <Plus className="w-3 h-3" />}
          {skill}
        </span>
      </Badge>
    </motion.div>
  );
}

// Enhanced Circular Progress Component
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
    if (percent >= 80) return '#10B981';
    if (percent >= 60) return '#F59E0B';
    return '#EF4444';
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
          transition={{ duration: 2, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl font-bold" style={{ color: getColor(percentage) }}>
            <AnimatedCounter value={percentage} suffix="%" />
          </div>
          <div className="text-xs text-gray-500 font-medium">Complete</div>
        </div>
      </div>
    </div>
  );
}

export const StudentProfile: React.FC = () => {
  const { user } = useAuth();
  const { profile, setProfile } = useStudent();
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const [cropOpen, setCropOpen] = useState(false);
  const [pendingImageUrl, setPendingImageUrl] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1.2);
  const [activeTab, setActiveTab] = useState('overview');
  const [editMode, setEditMode] = useState(false);

  // Local UI-only extras
  const [profileData, setProfileData] = useState({
    bio: "Passionate electronics engineering student with expertise in emerging technologies and sustainable innovation.",
    location: "Jabalpur, Madhya Pradesh, India",
    website: "https://johndoe.dev",
    linkedin: "https://linkedin.com/in/johndoe",
    github: "https://github.com/johndoe"
  });

  // Edit form state mapped to StudentProfile fields
  const [form, setForm] = useState({
    name: '',
    university: '',
    course: '',
    stream: '',
    year: '',
    gpa: '',
    graduationYear: '',
    enrollmentId: '',
  });

  useEffect(() => {
    // Initialize form from profile when available or when toggling edit mode on
    if (profile) {
      setForm({
        name: profile.name || '',
        university: profile.university || '',
        course: profile.course || '',
        stream: profile.stream || '',
        year: profile.year || '',
        gpa: typeof profile.gpa === 'number' ? String(profile.gpa) : '',
        graduationYear: typeof profile.graduationYear === 'number' ? String(profile.graduationYear) : '',
        enrollmentId: profile.enrollmentId || '',
      });
    }
  }, [profile, editMode]);

  // Simple profile strength computation based on filled fields
  const computedProfileStrength = useMemo(() => {
    const fields = [
      profile?.name,
      profile?.email,
      profile?.university,
      profile?.course,
      profile?.year,
      profile?.gpa,
      profile?.enrollmentId,
      (profile?.skills || []).length > 0 ? 'skills' : ''
    ];
    const filled = fields.filter(Boolean).length;
    const total = fields.length;
    return Math.round((filled / total) * 100) || 0;
  }, [profile?.name, profile?.email, profile?.university, profile?.course, profile?.year, profile?.gpa, profile?.enrollmentId, profile?.skills]);

  // Avatar size preference
  const avatarSize = Math.min(160, Math.max(64, profile?.avatarScale || 128));

  // Enhanced student data using context profile where possible
  const studentData = {
    profileStrength: computedProfileStrength,
    skills: profile?.skills || [],
    missingSkills: ['Docker', 'Kubernetes', 'Machine Learning', 'GraphQL', 'Redis', 'Microservices'],
    university: profile?.university || '—',
    course: profile?.course || '—',
    year: profile?.year || '—',
    enrollmentId: profile?.enrollmentId || '—',
    gpa: typeof profile?.gpa === 'number' ? profile!.gpa : 0,
    resumeUploaded: !!profile?.resumeUrl,
    achievements: [
      { 
        title: 'Hackathon Champion', 
        description: 'First place in National Coding Championship 2024', 
        date: '2024', 
        icon: Trophy
      },
      { 
        title: 'Academic Excellence', 
        description: 'Dean\'s List for outstanding performance', 
        date: '2023-24', 
        icon: GraduationCap
      },
      { 
        title: 'Open Source Contributor', 
        description: '100+ contributions to React ecosystem', 
        date: '2024', 
        icon: Code
      }
    ],
    projects: [
      { 
        name: 'E-Commerce Platform', 
        tech: 'React, Node.js, MongoDB', 
        status: 'Completed', 
        color: 'emerald',
        description: 'Full-stack e-commerce solution with payment integration'
      },
      { 
        name: 'AI Chatbot Assistant', 
        tech: 'Python, TensorFlow, FastAPI', 
        status: 'In Progress', 
        color: 'amber',
        description: 'Intelligent chatbot with natural language processing'
      },
      { 
        name: 'Mobile Task Manager', 
        tech: 'React Native, Firebase', 
        status: 'Planning', 
        color: 'slate',
        description: 'Cross-platform productivity application'
      }
    ],
    stats: {
      applications: 12,
      interviews: 5,
      offers: 2,
      profileViews: 156
    }
  };

  return (
    <DashboardLayout title="Student Profile">
      <div className="space-y-6">
        {/* Analytics Overview - Following Applications pattern exactly */}
        <AnalyticsPanel studentData={studentData} />

        Enhanced Profile Header
        <Card className="overflow-hidden border-0 shadow-xl">
          {/* <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-700 to-teal-600 h-32"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent h-32"></div>
          </div> */}
          
          <CardContent className="relative pt-20 pb-8">
            <div className="flex flex-col lg:flex-row items-start gap-8">
              <motion.div 
                className="relative  z-10"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="relative">
                  <Avatar className="border-4 border-white shadow-xl" style={{ width: avatarSize, height: avatarSize }}>
                    <AvatarImage src={profile?.avatarUrl || (user as any)?.profileImage} alt={profile?.name || user?.name || 'Profile'} />
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-teal-500 text-white text-4xl font-bold">
                      {(profile?.name || user?.name || 'S').charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <input
                    ref={avatarInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      const max = 5 * 1024 * 1024;
                      if (file.size > max) return;
                      const url = URL.createObjectURL(file);
                      setPendingImageUrl(url);
                      setZoom(1.2);
                      setCropOpen(true);
                    }}
                  />
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => avatarInputRef.current?.click()}
                    className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-lg border-2 border-gray-100 hover:border-blue-400 transition-colors"
                  >
                    <Camera className="w-4 h-4 text-gray-600" />
                  </motion.button>
                </div>
              </motion.div>
              
              <div className="flex-1 space-y-6">
                <div className="space-y-2">
                  <h1 className="text-4xl font-bold text-gray-900">
                    {profile?.name || user?.name || "Student"}
                  </h1>
                  <p className="text-xl text-gray-600 font-medium">
                    {studentData.course}
                  </p>
                  <p className="text-gray-500">
                    {profileData.bio}
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border border-blue-200">
                    <School className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="text-sm font-medium text-blue-900">University</p>
                      <p className="text-xs text-blue-700">{profile?.university || '—'}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-green-50 to-green-100 rounded-lg border border-green-200">
                    <MapPin className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="text-sm font-medium text-green-900">Location</p>
                      <p className="text-xs text-green-700">{profileData.location}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-amber-50 to-amber-100 rounded-lg border border-amber-200">
                    <User className="h-5 w-5 text-amber-600" />
                    <div>
                      <p className="text-sm font-medium text-amber-900">Student ID</p>
                      <p className="text-xs text-amber-700">{studentData.enrollmentId}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex gap-3">
                  {!editMode ? (
                    <Button 
                      onClick={() => setEditMode(true)}
                      className="bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <Edit3 className="w-4 h-4 mr-2" />
                      Edit Profile
                    </Button>
                  ) : (
                    <>
                      <Button 
                        onClick={() => {
                          const updates: any = {
                            name: form.name.trim() || undefined,
                            university: form.university.trim() || undefined,
                            course: form.course.trim() || undefined,
                            stream: form.stream.trim() || undefined,
                            year: form.year.trim() || undefined,
                            enrollmentId: form.enrollmentId.trim() || undefined,
                          };
                          const gpaNum = parseFloat(form.gpa);
                          if (!Number.isNaN(gpaNum)) updates.gpa = gpaNum;
                          const gradNum = parseInt(form.graduationYear, 10);
                          if (!Number.isNaN(gradNum)) updates.graduationYear = gradNum;
                          setProfile(updates);
                          setEditMode(false);
                        }}
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        Save Changes
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => {
                          // reset form from current profile and exit edit mode
                          if (profile) {
                            setForm({
                              name: profile.name || '',
                              university: profile.university || '',
                              course: profile.course || '',
                              stream: profile.stream || '',
                              year: profile.year || '',
                              gpa: typeof profile.gpa === 'number' ? String(profile.gpa) : '',
                              graduationYear: typeof profile.graduationYear === 'number' ? String(profile.graduationYear) : '',
                              enrollmentId: profile.enrollmentId || '',
                            });
                          }
                          setEditMode(false);
                        }}
                      >
                        Cancel
                      </Button>
                    </>
                  )}
                </div>
                <Button variant="outline" className="border-2 hover:border-blue-400 hover:bg-blue-50">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share Profile
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Crop/Zoom Dialog */}
        <Dialog open={cropOpen} onOpenChange={(open) => {
          if (!open) {
            if (pendingImageUrl) URL.revokeObjectURL(pendingImageUrl);
            setPendingImageUrl(null);
            setCropOpen(false);
          } else {
            setCropOpen(true);
          }
        }}>
          <DialogContent className="sm:max-w-[540px]">
            <DialogHeader>
              <DialogTitle>Adjust profile photo</DialogTitle>
              <DialogDescription>Zoom to crop the image to a square. The center will be used.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="mx-auto w-[360px] h-[360px] bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
                {pendingImageUrl ? (
                  <img
                    src={pendingImageUrl}
                    alt="Crop preview"
                    className="select-none pointer-events-none"
                    style={{
                      width: 'auto',
                      height: '100%',
                      transform: `scale(${zoom})`,
                      objectFit: 'cover',
                    }}
                  />
                ) : (
                  <div className="text-gray-500 text-sm">No image selected</div>
                )}
              </div>
              <div>
                <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                  <span>Zoom</span>
                  <span>{zoom.toFixed(2)}x</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={3}
                  step={0.02}
                  value={zoom}
                  onChange={(e) => setZoom(parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => {
                if (pendingImageUrl) URL.revokeObjectURL(pendingImageUrl);
                setPendingImageUrl(null);
                setCropOpen(false);
              }}>Cancel</Button>
              <Button
                onClick={async () => {
                  if (!pendingImageUrl) return;
                  const img = new Image();
                  img.crossOrigin = 'anonymous';
                  img.src = pendingImageUrl;
                  await new Promise(resolve => { img.onload = resolve; });
                  const iw = img.naturalWidth || img.width;
                  const ih = img.naturalHeight || img.height;
                  const size = 512; // output square
                  const s0 = size / Math.min(iw, ih);
                  const scale = s0 * zoom;
                  const dw = iw * scale;
                  const dh = ih * scale;
                  const dx = (size - dw) / 2;
                  const dy = (size - dh) / 2;
                  const canvas = document.createElement('canvas');
                  canvas.width = size;
                  canvas.height = size;
                  const ctx = canvas.getContext('2d');
                  if (!ctx) return;
                  ctx.fillStyle = '#ffffff';
                  ctx.fillRect(0, 0, size, size);
                  ctx.drawImage(img, dx, dy, dw, dh);
                  canvas.toBlob((blob) => {
                    if (!blob) return;
                    const url = URL.createObjectURL(blob);
                    setProfile({ avatarUrl: url });
                    // cleanup previous pending url
                    if (pendingImageUrl) URL.revokeObjectURL(pendingImageUrl);
                    setPendingImageUrl(null);
                    setCropOpen(false);
                  }, 'image/png');
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Save Photo
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Form */}
        {editMode && (
          <Card className="border-0 shadow-xl">
            <CardHeader>
              <CardTitle>Edit Profile</CardTitle>
              <CardDescription>Update your basic information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={profile?.avatarUrl || (user as any)?.profileImage} alt={profile?.name || user?.name || 'Profile'} />
                  <AvatarFallback className="text-xl">{(profile?.name || user?.name || 'S').charAt(0)}</AvatarFallback>
                </Avatar>
                <Button variant="outline" onClick={() => setProfile({ avatarUrl: undefined })}>
                  Remove Profile Photo
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <Input value={form.name} onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Your name" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">University</label>
                  <Input value={form.university} onChange={(e) => setForm(f => ({ ...f, university: e.target.value }))} placeholder="University" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Course</label>
                  <Input value={form.course} onChange={(e) => setForm(f => ({ ...f, course: e.target.value }))} placeholder="Course (e.g., B.Tech)" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stream</label>
                  <Input value={form.stream} onChange={(e) => setForm(f => ({ ...f, stream: e.target.value }))} placeholder="Stream (e.g., ECE)" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                  <Input value={form.year} onChange={(e) => setForm(f => ({ ...f, year: e.target.value }))} placeholder="e.g., 3rd Year" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">GPA</label>
                  <Input type="number" step="0.01" value={form.gpa} onChange={(e) => setForm(f => ({ ...f, gpa: e.target.value }))} placeholder="e.g., 8.5" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Graduation Year</label>
                  <Input type="number" value={form.graduationYear} onChange={(e) => setForm(f => ({ ...f, graduationYear: e.target.value }))} placeholder="e.g., 2026" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Enrollment ID</label>
                  <Input value={form.enrollmentId} onChange={(e) => setForm(f => ({ ...f, enrollmentId: e.target.value }))} placeholder="Enrollment ID" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email (read-only)</label>
                  <Input value={profile?.email || ''} readOnly />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Enhanced Tabs Section - Following Applications pattern */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 bg-white border shadow-lg">
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
              <Card className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
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
                      <div key={item.label} className="flex items-center justify-between text-sm">
                        <span className="flex items-center space-x-2">
                          <item.icon className={`h-4 w-4 ${
                            item.status === 'complete' ? 'text-green-500' : 
                            item.status === 'partial' ? 'text-amber-500' : 'text-red-500'
                          }`} />
                          <span>{item.label}</span>
                        </span>
                        <Badge 
                          className={
                            item.status === 'complete' ? 'bg-green-50 text-green-700 border-green-200' :
                            item.status === 'partial' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                            'bg-red-50 text-red-700 border-red-200'
                          }
                        >
                          {item.status === 'complete' ? 'Complete' : 
                           item.status === 'partial' ? 'Partial' : 'Incomplete'}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Academic Info */}
              <Card className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <BookOpen className="h-5 w-5 text-green-600" />
                    <span>Academic Excellence</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600 mb-1">
                      <AnimatedCounter value={studentData.gpa} suffix="/10" />
                    </div>
                    <p className="text-sm text-gray-600">Current CGPA</p>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Academic Year</span>
                      <Badge className="bg-gradient-to-r from-green-500 to-blue-500 text-white">
                        {studentData.year}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Performance</span>
                      <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white">
                        <Star className="h-3 w-3 mr-1" />
                        {studentData.gpa >= 8.5 ? 'Excellent' : studentData.gpa >= 7 ? 'Good' : 'Average'}
                      </Badge>
                    </div>
                  </div>

                  <Progress value={85} className="h-2" />
                  <p className="text-xs text-center text-gray-500">Top 15% of class</p>
                </CardContent>
              </Card>

              {/* Resume & Documents */}
              <Card className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
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
                      <Button variant="outline" size="sm" className="hover:bg-green-50 hover:border-green-400">
                        <Edit3 className="w-4 h-4 mr-1" />
                        Update
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Achievements Section */}
            <Card className="border-0 shadow-xl">
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
                          <achievement.icon className="w-4 h-4 text-amber-700" />
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
          </TabsContent>

          {/* Skills Tab */}
          <TabsContent value="skills" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-0 shadow-xl">
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

              <Card className="border-0 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Lightbulb className="h-5 w-5 text-green-600" />
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
                    className="w-full mt-4 hover:bg-green-50 hover:border-green-400"
                  >
                    <Target className="w-4 h-4 mr-2" />
                    Learn These Skills
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Projects Tab */}
          <TabsContent value="projects" className="space-y-6">
            <Card className="border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Rocket className="h-5 w-5 text-purple-600" />
                  <span>Projects & Portfolio</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {studentData.projects.map((project, index) => (
                    <motion.div
                      key={project.name}
                      className="p-4 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-lg border border-purple-200 hover:shadow-md transition-all duration-300"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.02, y: -2 }}
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold text-purple-900">{project.name}</h4>
                          <Badge 
                            className={`
                              ${project.color === 'emerald' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                                project.color === 'amber' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                                'bg-slate-50 text-slate-700 border-slate-200'}
                            `}
                          >
                            {project.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-purple-700">{project.description}</p>
                        <p className="text-xs text-purple-600 bg-purple-100 rounded px-2 py-1">{project.tech}</p>
                        <div className="flex justify-between items-center">
                          <Button variant="outline" size="sm" className="hover:bg-purple-50 hover:border-purple-400">
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </Button>
                          <Button variant="outline" size="sm" className="hover:bg-indigo-50 hover:border-indigo-400">
                            <ExternalLink className="w-4 h-4 mr-1" />
                            Demo
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Other tabs */}
          <TabsContent value="academic">
            <Card className="border-0 shadow-xl">
              <CardContent className="p-12 text-center">
                <div className="max-w-md mx-auto">
                  <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                    <School className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Academic Details</h3>
                  <p className="text-gray-600 mb-4">Detailed academic information coming soon...</p>
                  <Button className="bg-gradient-to-r from-green-600 to-blue-600 text-white">
                    <BookOpen className="w-4 h-4 mr-2" />
                    Explore Features
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card className="border-0 shadow-xl">
              <CardContent className="p-12 text-center">
                <div className="max-w-md mx-auto">
                  <div className="w-16 h-16 mx-auto mb-4 bg-purple-100 rounded-full flex items-center justify-center">
                    <Settings className="w-8 h-8 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Profile Settings</h3>
                  <p className="text-gray-600 mb-4">Privacy and notification settings coming soon...</p>
                  <Button className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                    <Settings className="w-4 h-4 mr-2" />
                    Configure Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Quick Actions - Following Applications pattern exactly */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { 
              title: 'Update Preferences', 
              icon: Settings, 
              description: 'Modify your internship preferences',
              gradient: 'from-blue-50 to-blue-100',
              border: 'border-blue-200',
              iconBg: 'bg-blue-200',
              iconColor: 'text-blue-700',
              textColor: 'text-blue-900',
              descColor: 'text-blue-700',
              chevronColor: 'text-blue-600'
            },
            { 
              title: 'View Applications', 
              icon: Briefcase, 
              description: 'Check your application status',
              gradient: 'from-green-50 to-green-100',
              border: 'border-green-200',
              iconBg: 'bg-green-200',
              iconColor: 'text-green-700',
              textColor: 'text-green-900',
              descColor: 'text-green-700',
              chevronColor: 'text-green-600'
            },
            { 
              title: 'Explore Opportunities', 
              icon: Globe, 
              description: 'Find new internship matches',
              gradient: 'from-amber-50 to-amber-100',
              border: 'border-amber-200',
              iconBg: 'bg-amber-200',
              iconColor: 'text-amber-700',
              textColor: 'text-amber-900',
              descColor: 'text-amber-700',
              chevronColor: 'text-amber-600'
            }
          ].map((action, index) => (
            <motion.div
              key={action.title}
              whileHover={{ scale: 1.02, y: -5 }}
              whileTap={{ scale: 0.98 }}
              className="cursor-pointer"
            >
              <Card className={`bg-gradient-to-br ${action.gradient} ${action.border} hover:shadow-lg transition-all duration-300`}>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className={`p-3 ${action.iconBg} rounded-full`}>
                      <action.icon className={`w-6 h-6 ${action.iconColor}`} />
                    </div>
                    <div className="flex-1">
                      <h3 className={`font-semibold ${action.textColor}`}>{action.title}</h3>
                      <p className={`text-sm ${action.descColor} mt-1`}>{action.description}</p>
                    </div>
                    <ChevronRight className={`w-5 h-5 ${action.chevronColor}`} />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StudentProfile;
