import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform, Variants } from 'framer-motion';
import { 
  Eye, EyeOff, Mail, Lock, ArrowLeft, CheckCircle, Sparkles, Star, Zap, Award, 
  Users, Building2, GraduationCap, Shield, Github, Chrome, Linkedin, Globe,
  MousePointer, Layers, Cpu, Database, User, KeyRound, Rocket, Crown
} from 'lucide-react';

// Enhanced Custom Components
const FloatingParticle: React.FC<{ index: number }> = ({ index }) => (
  <motion.div
    className="absolute w-1 h-1 bg-blue-400 rounded-full opacity-30"
    initial={{ 
      x: Math.random() * window.innerWidth, 
      y: Math.random() * window.innerHeight,
      opacity: 0 
    }}
    animate={{ 
      y: [null, -20, 0],
      opacity: [0.3, 0.8, 0.3],
    }}
    transition={{ 
      duration: 3 + Math.random() * 2,
      repeat: Infinity,
      delay: index * 0.2,
      ease: "easeInOut"
    }}
  />
);

const AnimatedBackground: React.FC = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {/* Particle Field */}
    {[...Array(30)].map((_, i) => (
      <FloatingParticle key={i} index={i} />
    ))}
    
    {/* Animated Gradient Orbs */}
    <motion.div
      className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-r from-blue-300 to-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
      animate={{ 
        scale: [1, 1.2, 1],
        x: [0, 30, 0],
        y: [0, -30, 0]
      }}
      transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
    />
    <motion.div
      className="absolute top-40 right-20 w-80 h-80 bg-gradient-to-r from-purple-300 to-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
      animate={{ 
        scale: [1.2, 1, 1.2],
        x: [0, -30, 0],
        y: [0, 30, 0]
      }}
      transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 2 }}
    />
    <motion.div
      className="absolute bottom-20 left-40 w-72 h-72 bg-gradient-to-r from-teal-300 to-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
      animate={{ 
        scale: [1, 1.3, 1],
        x: [0, 20, 0],
        y: [0, -20, 0]
      }}
      transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 4 }}
    />
  </div>
);

const MagneticButton: React.FC<{
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  type?: "button" | "submit";
  disabled?: boolean;
}> = ({ children, onClick, className = "", type = "button", disabled = false }) => {
  const ref = useRef<HTMLButtonElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const xSpring = useSpring(x, { stiffness: 300, damping: 30 });
  const ySpring = useSpring(y, { stiffness: 300, damping: 30 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      x.set((e.clientX - centerX) * 0.1);
      y.set((e.clientY - centerY) * 0.1);
    }
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.button
      ref={ref}
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`relative ${className}`}
      style={{ x: xSpring, y: ySpring }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {children}
    </motion.button>
  );
};

const GlassmorphismCard: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = "" }) => (
  <motion.div
    className={`backdrop-blur-2xl bg-white/10 border border-white/20 shadow-2xl ${className}`}
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.8, ease: [0.25, 0.25, 0, 1] }}
  >
    <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-2xl pointer-events-none" />
    {children}
  </motion.div>
);


interface AnimatedInputProps {
  type: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  icon: React.ComponentType<any>;
  required?: boolean;
  rightIcon?: React.ReactNode;
  id?: string;
}

const AnimatedInput: React.FC<AnimatedInputProps> = ({
  type,
  name,
  value,
  onChange,
  placeholder,
  icon: Icon,
  required = false,
  rightIcon,
  id,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = useCallback(() => setIsFocused(true), []);
  const handleBlur = useCallback(() => setIsFocused(false), []);

  return (
    <motion.div
      className="relative"
      whileHover={{ scale: 1.01 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
    >
      {/* Glow border */}
      <motion.div
        className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl opacity-0 blur-sm z-[-1]"
        animate={{ opacity: isFocused ? 0.3 : 0 }}
      />

      <div className="relative">
        {/* Left icon */}
        <motion.div
          className="absolute left-3 top-1/2 -translate-y-1/2 z-10"
          animate={{
            color: isFocused ? "#3b82f6" : "#94a3b8",
            scale: isFocused ? 1.1 : 1,
          }}
          transition={{ duration: 0.2 }}
        >
          <Icon className="h-5 w-5" />
        </motion.div>

        {/* Input */}
        <motion.input
          id={id || name}
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          aria-label={placeholder}
          required={required}
          className="w-full pl-12 pr-12 py-4 rounded-2xl border-0 bg-white/80 backdrop-blur-lg text-gray-900 placeholder-gray-500 shadow-lg focus:bg-white/90 focus:shadow-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
          onFocus={handleFocus}
          onBlur={handleBlur}
          animate={{ scale: isFocused ? 1.01 : 1 }}
          transition={{ duration: 0.2 }}
        />

        {/* Right icon */}
        {rightIcon && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {rightIcon}
          </div>
        )}
      </div>
    </motion.div>
  );
};

const SocialLoginButton: React.FC<{
  icon: React.ComponentType<any>;
  provider: string;
  color: string;
}> = ({ icon: Icon, provider, color }) => (
  <MagneticButton className="group">
    <motion.div
      className={`w-14 h-14 rounded-2xl ${color} flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20`}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.95 }}
    >
      <Icon className="w-6 h-6 text-white group-hover:scale-110 transition-transform duration-200" />
    </motion.div>
  </MagneticButton>
);

export default function Login() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login, isLoading } = useAuth();

  const defaultRole = (searchParams.get('role') as 'student' | 'admin' | 'ministry') || 'student';
  const [activeTab, setActiveTab] = useState<'student' | 'admin' | 'ministry'>(defaultRole);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }
    try {
      const roleEmail = activeTab === 'student' ? formData.email : `${activeTab}.${formData.email}`;
      await login(roleEmail, formData.password);
      const dashboardPath = activeTab === 'student' ? '/dashboard/profile' : activeTab === 'admin' ? '/admin/data' : '/ministry/bias';
      navigate(dashboardPath);
    } catch {
      setError('Invalid credentials. Please try again.');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const roleConfigs = {
    student: {
      icon: GraduationCap,
      title: 'Student Portal',
      description: 'Access your internship journey',
      demoEmail: 'student@example.com',
      gradient: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-gradient-to-br from-blue-50/80 to-cyan-50/80',
      features: ['Smart AI Matching', 'Progress Tracking', 'Skill Development'],
    },
    admin: {
      icon: Shield,
      title: 'Admin Dashboard',
      description: 'Manage allocation systems',
      demoEmail: 'admin@gov.in',
      gradient: 'from-purple-500 to-pink-500',
      bgColor: 'bg-gradient-to-br from-purple-50/80 to-pink-50/80',
      features: ['System Management', 'User Analytics', 'Policy Controls'],
    },
    ministry: {
      icon: Building2,
      title: 'Ministry Console',
      description: 'Policy oversight & insights',
      demoEmail: 'ministry@gov.in',
      gradient: 'from-emerald-500 to-teal-500',
      bgColor: 'bg-gradient-to-br from-emerald-50/80 to-teal-50/80',
      features: ['Strategic Planning', 'Performance Metrics', 'Resource Allocation'],
    },
  } as const;

  const currentRole = roleConfigs[activeTab];

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
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 relative overflow-hidden">
      {/* Animated Background */}
      <AnimatedBackground />

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
        <motion.div 
          className="w-full max-w-7xl grid lg:grid-cols-2 gap-12 items-stretch"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Left Side - 3D Illustration/Info */}
          <motion.div
            variants={itemVariants}
            className="relative h-full"
          >
            <GlassmorphismCard className="rounded-3xl p-8 md:p-12 relative overflow-hidden h-full flex flex-col">
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-10">
                <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#3b82f6" strokeWidth="1" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid)" />
                </svg>
              </div>

              <div className="relative z-10">
                {/* Logo & Badge */}
                <motion.div 
                  className="flex items-center gap-4 mb-8"
                  variants={itemVariants}
                >
                  <motion.div 
                    className="w-16 h-16 bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 rounded-2xl flex items-center justify-center shadow-2xl"
                    whileHover={{ rotate: 10, scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <span className="text-white font-black text-2xl">PM</span>
                  </motion.div>
                  <div>
                    <div className="text-2xl font-black text-gray-900">PM Internship Scheme</div>
                    <motion.div 
                      className="inline-flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full border border-blue-200/50 mt-2"
                      whileHover={{ scale: 1.05 }}
                    >
                      <Crown className="h-4 w-4 text-blue-600" />
                      <span className="text-blue-700 text-sm font-semibold">Government of India</span>
                    </motion.div>
                  </div>
                </motion.div>

                {/* Main Content */}
                <motion.div variants={itemVariants} className="space-y-6">
                  <div>
                    <h1 className="text-4xl font-black text-gray-900 leading-tight mb-4">
                      Welcome to the Future of
                      <span className="block text-blue-600">Internship Allocation</span>
                    </h1>
                    <p className="text-xl text-gray-600 leading-relaxed">
                      Experience next-generation AI-powered matching with quantum-level precision, 
                      ensuring fairness and excellence for every Indian student.
                    </p>
                  </div>

                  {/* Features Grid */}
                  <div className="grid grid-cols-2 gap-4 mt-8">
                    {[
                      { icon: Cpu, text: 'AI-Powered Matching', color: 'text-blue-500' },
                      { icon: Database, text: 'Secure & Scalable', color: 'text-purple-500' },
                      { icon: Globe, text: 'Pan-India Access', color: 'text-teal-500' },
                      { icon: Zap, text: 'Real-time Processing', color: 'text-amber-500' }
                    ].map((feature, index) => (
                      <motion.div
                        key={feature.text}
                        className="flex items-center gap-3 p-3 bg-white/50 backdrop-blur-sm rounded-xl border border-white/20 hover:bg-white/70 transition-all duration-300"
                        variants={itemVariants}
                        whileHover={{ scale: 1.02, y: -2 }}
                      >
                        <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                          <feature.icon className={`h-5 w-5 ${feature.color}`} />
                        </div>
                        <span className="font-semibold text-gray-800">{feature.text}</span>
                      </motion.div>
                    ))}
                  </div>

                  {/* Stats */}
                  <motion.div 
                    variants={itemVariants}
                    className="grid grid-cols-3 gap-6 pt-8 border-t border-white/20"
                  >
                    {[
                      { value: '2.5M+', label: 'Active Students' },
                      { value: '50K+', label: 'Partners' },
                      { value: '99%', label: 'Success Rate' }
                    ].map((stat, index) => (
                      <motion.div 
                        key={stat.label}
                        className="text-center"
                        whileHover={{ scale: 1.05 }}
                      >
                        <div className="text-3xl font-black text-blue-600">{stat.value}</div>
                        <div className="text-sm text-gray-600 font-medium">{stat.label}</div>
                      </motion.div>
                    ))}
                  </motion.div>
                </motion.div>
              </div>
            </GlassmorphismCard>
          </motion.div>

          {/* Right Side - Login Form */}
          <motion.div
            variants={itemVariants}
            className="w-full h-full"
          >
            {/* Back Button */}
            <motion.button 
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8 transition-colors group"
              onClick={() => navigate('/')}
              whileHover={{ x: -5 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            >
              <ArrowLeft className="h-5 w-5 group-hover:scale-110 transition-transform" />
              <span className="font-medium">Back to Home</span>
            </motion.button>

            {/* Role Selector Card */}
            <motion.div 
              className={`rounded-3xl p-6 mb-8 border border-white/20 ${currentRole.bgColor} backdrop-blur-lg shadow-xl`}
              variants={itemVariants}
              whileHover={{ scale: 1.01 }}
            >
              <div className="flex items-start gap-4">
                <motion.div 
                  className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${currentRole.gradient} flex items-center justify-center shadow-lg`}
                  whileHover={{ rotate: 5, scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <currentRole.icon className="h-8 w-8 text-white" />
                </motion.div>
                <div className="flex-1">
                  <h3 className="text-2xl font-black text-gray-900 mb-2">{currentRole.title}</h3>
                  <p className="text-gray-600 mb-4">{currentRole.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {currentRole.features.map((feature, index) => (
                      <motion.span 
                        key={feature}
                        className="px-3 py-1 rounded-full bg-white/80 backdrop-blur-sm text-sm text-gray-700 border border-white/30 font-medium"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ scale: 1.05 }}
                      >
                        {feature}
                      </motion.span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Login Form Card */}
            <GlassmorphismCard className="rounded-3xl p-8 md:p-12 backdrop-blur-2xl h-full flex flex-col">
              {/* Tab Selector */}
              <motion.div 
                className="flex bg-gray-100/80 backdrop-blur-sm rounded-2xl p-1.5 mb-8 border border-white/20"
                variants={itemVariants}
              >
                {(Object.keys(roleConfigs) as Array<'student' | 'admin' | 'ministry'>).map((role) => (
                  <motion.button
                    key={role}
                    onClick={() => setActiveTab(role)}
                    className={`flex-1 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
                      activeTab === role 
                        ? 'bg-white shadow-lg text-gray-900 scale-105' 
                        : 'text-gray-600 hover:text-gray-800 hover:bg-white/50'
                    }`}
                    whileHover={{ scale: activeTab === role ? 1.05 : 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {role.charAt(0).toUpperCase() + role.slice(1)}
                  </motion.button>
                ))}
              </motion.div>

              {/* Form */}
              <motion.form 
                onSubmit={handleSubmit} 
                className="space-y-6"
                variants={containerVariants}
              >
                <motion.div variants={itemVariants}>
                  <label className="block text-sm font-bold text-gray-800 mb-3">Email Address</label>
                  <AnimatedInput
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder={currentRole.demoEmail}
                    icon={Mail}
                    required
                  />
                </motion.div>

                <motion.div variants={itemVariants}>
                  <label className="block text-sm font-bold text-gray-800 mb-3">Password</label>
                  <AnimatedInput
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Enter your secure password"
                    icon={Lock}
                    required
                    rightIcon={
                      <MagneticButton onClick={() => setShowPassword(!showPassword)}>
                        <motion.div
                          className="text-gray-400 hover:text-gray-600 p-1"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </motion.div>
                      </MagneticButton>
                    }
                  />
                </motion.div>

                {/* Error Message */}
                <AnimatePresence>
                  {error && (
                    <motion.div 
                      className="p-4 rounded-2xl bg-red-50/80 backdrop-blur-sm border border-red-200/50 text-red-700"
                      initial={{ opacity: 0, y: -20, scale: 0.8 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -20, scale: 0.8 }}
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                        <span className="font-medium">{error}</span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Remember Me & Forgot Password */}
                <motion.div 
                  variants={itemVariants}
                  className="flex items-center justify-between"
                >
                  <motion.label 
                    className="flex items-center gap-3 cursor-pointer group"
                    whileHover={{ scale: 1.02 }}
                  >
                    <motion.input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-5 h-5 rounded-lg border-2 border-gray-300 text-blue-600 focus:ring-blue-500/30 focus:ring-2"
                      whileTap={{ scale: 0.9 }}
                    />
                    <span className="text-gray-700 font-medium group-hover:text-gray-900 transition-colors">
                      Remember me
                    </span>
                  </motion.label>
                  
                  <MagneticButton className="text-blue-600 hover:text-blue-700 font-semibold">
                    Forgot password?
                  </MagneticButton>
                </motion.div>

                {/* Login Button */}
                <motion.div variants={itemVariants}>
                  <MagneticButton
                    type="submit"
                    disabled={isLoading}
                    className={`w-full py-4 rounded-2xl bg-gradient-to-r ${currentRole.gradient} text-white font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden`}
                  >
                    <motion.span
                      className="relative z-10 flex items-center justify-center gap-2"
                      animate={{ opacity: isLoading ? 0.7 : 1 }}
                    >
                      {isLoading ? (
                        <>
                          <motion.div
                            className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          />
                          Signing you in...
                        </>
                      ) : (
                        <>
                          <Rocket className="h-5 w-5" />
                          Sign In to Portal
                        </>
                      )}
                    </motion.span>
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0"
                      initial={{ x: '-100%' }}
                      animate={{ x: isLoading ? '-100%' : '100%' }}
                      transition={{ duration: 0.6, ease: "easeInOut" }}
                    />
                  </MagneticButton>
                </motion.div>

                {/* Social Login */}
                <motion.div variants={itemVariants}>
                  <div className="relative my-8">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-200"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-4 bg-white/80 text-gray-500 font-medium">Or continue with</span>
                    </div>
                  </div>

                  <div className="flex gap-4 justify-center">
                    <SocialLoginButton 
                      icon={Chrome} 
                      provider="Google" 
                      color="bg-gradient-to-r from-red-500 to-pink-500" 
                    />
                    <SocialLoginButton 
                      icon={Github} 
                      provider="GitHub" 
                      color="bg-gradient-to-r from-gray-700 to-gray-900" 
                    />
                    <SocialLoginButton 
                      icon={Linkedin} 
                      provider="LinkedIn" 
                      color="bg-gradient-to-r from-blue-600 to-blue-700" 
                    />
                  </div>
                </motion.div>

                {/* Register Link */}
                {activeTab === 'student' && (
                  <motion.div 
                    variants={itemVariants}
                    className="text-center pt-6 border-t border-white/20"
                  >
                    <p className="text-gray-600">
                      Don't have an account?{' '}
                      <MagneticButton 
                        onClick={() => navigate('/register')}
                        className="text-blue-600 hover:text-blue-700 font-bold underline decoration-2 underline-offset-2"
                      >
                        Create one now
                      </MagneticButton>
                    </p>
                  </motion.div>
                )}

                {/* Demo Credentials */}
                <motion.div 
                  variants={itemVariants}
                  className="p-6 bg-gradient-to-r from-blue-50/80 to-purple-50/80 backdrop-blur-sm rounded-2xl border border-blue-200/50"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <KeyRound className="h-5 w-5 text-blue-600" />
                    <span className="font-bold text-blue-900">Demo Access</span>
                  </div>
                  <div className="space-y-1 text-sm">
                    <p className="text-blue-800">
                      <span className="font-semibold">Email:</span> demo@example.com
                    </p>
                    <p className="text-blue-800">
                      <span className="font-semibold">Password:</span> demo123
                    </p>
                  </div>
                </motion.div>

                {/* Footer Links */}
                <motion.div 
                  variants={itemVariants}
                  className="flex justify-center gap-6 pt-4 text-sm text-gray-500"
                >
                  <MagneticButton className="hover:text-gray-700 transition-colors">
                    Privacy Policy
                  </MagneticButton>
                  <span>•</span>
                  <MagneticButton className="hover:text-gray-700 transition-colors">
                    Terms of Service
                  </MagneticButton>
                  <span>•</span>
                  <MagneticButton className="hover:text-gray-700 transition-colors">
                    Help Center
                  </MagneticButton>
                </motion.div>
              </motion.form>
            </GlassmorphismCard>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
