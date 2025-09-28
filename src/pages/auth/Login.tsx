import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Eye, EyeOff, Mail, Lock, ArrowLeft, CheckCircle, Sparkles, Star, Zap, Award, Users, Building2, GraduationCap, Shield } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login, isLoading } = useAuth();

  const defaultRole = (searchParams.get('role') as 'student' | 'admin' | 'ministry') || 'student';
  const [activeTab, setActiveTab] = useState<'student' | 'admin' | 'ministry'>(defaultRole);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

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
      bgColor: 'bg-blue-50',
      features: ['Smart Matching', 'Progress Tracking', 'Skill Development'],
    },
    admin: {
      icon: Shield,
      title: 'Admin Dashboard',
      description: 'Manage allocation systems',
      demoEmail: 'admin@gov.in',
      gradient: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-50',
      features: ['System Management', 'User Analytics', 'Policy Controls'],
    },
    ministry: {
      icon: Building2,
      title: 'Ministry Console',
      description: 'Policy oversight & insights',
      demoEmail: 'ministry@gov.in',
      gradient: 'from-emerald-500 to-teal-500',
      bgColor: 'bg-emerald-50',
      features: ['Strategic Planning', 'Performance Metrics', 'Resource Allocation'],
    },
  } as const;

  const currentRole = roleConfigs[activeTab];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse" />
        <div className="absolute top-40 right-20 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-20 left-40 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse" style={{ animationDelay: '4s' }} />
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-start">
          {/* Left Card: Overview */}
          <div className="rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 p-8">
            <div className="absolute inset-0 opacity-20 pointer-events-none">
              <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="grid" width="32" height="32" patternUnits="userSpaceOnUse">
                    <path d="M 32 0 L 0 0 0 32" fill="none" stroke="white" strokeWidth="0.5" opacity="0.1" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
              </svg>
            </div>

            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 mb-6">
              <Sparkles className="h-4 w-4 text-yellow-400" />
              <span className="text-white text-sm font-medium">AI-Powered Platform</span>
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
            </div>

            <h1 className="text-4xl font-bold text-white mb-4 leading-tight">
              Smart, Fair & <span className="block bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">Transparent Matching</span>
            </h1>
            <p className="text-white/80 text-lg mb-8 leading-relaxed">
              Experience the future of internship allocation with our advanced AI system designed for fairness and excellence.
            </p>

            <div className="space-y-4 mb-8">
              {[
                { icon: Zap, text: 'Intelligent AI recommendations', color: 'text-yellow-400' },
                { icon: Users, text: 'Preference-aware placements', color: 'text-blue-400' },
                { icon: Award, text: 'Merit & fairness balanced', color: 'text-emerald-400' },
              ].map((feature, idx) => (
                <div key={idx} className="flex items-center gap-3 text-white/90">
                  <div className="w-8 h-8 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center">
                    <feature.icon className={`h-4 w-4 ${feature.color}`} />
                  </div>
                  <span className="font-medium">{feature.text}</span>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-white/20">
              {[
                { value: '10K+', label: 'Students' },
                { value: '500+', label: 'Ministries' },
                { value: '95%', label: 'Success Rate' },
              ].map((stat, idx) => (
                <div key={idx} className="text-center">
                  <div className="text-xl font-bold text-white">{stat.value}</div>
                  <div className="text-white/60 text-xs">{stat.label}</div>
                </div>
              ))}
            </div>

            <div className="mt-6 inline-flex items-center gap-2 px-3 py-2 bg-white/10 rounded-xl">
              <CheckCircle className="h-4 w-4 text-emerald-400" />
              <span className="text-white/90 text-sm">Built with transparency at its core</span>
            </div>
          </div>

          {/* Right Card: Login Form */}
          <div className="w-full max-w-xl mx-auto">
            <button className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-6 transition-colors" onClick={() => navigate('/') }>
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Home</span>
            </button>

            <div className={`rounded-2xl border p-6 ${currentRole.bgColor} border-slate-200/60 mb-6`}>
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${currentRole.gradient} flex items-center justify-center shadow-md`}>
                  <currentRole.icon className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-slate-800">{currentRole.title}</h3>
                  <p className="text-slate-600 text-sm mb-3">{currentRole.description}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {currentRole.features.map((f, i) => (
                      <span key={i} className="px-2 py-1 rounded-full bg-white/70 text-xs text-slate-700 border border-slate-200">{f}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border bg-white/90 backdrop-blur-xl p-6 shadow-xl">
              <div className="flex bg-slate-100 rounded-xl p-1 mb-5">
                {(Object.keys(roleConfigs) as Array<'student' | 'admin' | 'ministry'>).map((role) => (
                  <button
                    key={role}
                    onClick={() => setActiveTab(role)}
                    className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${
                      activeTab === role ? 'bg-white shadow text-slate-900' : 'text-slate-600 hover:text-slate-800'
                    }`}
                  >
                    {role.charAt(0).toUpperCase() + role.slice(1)}
                  </button>
                ))}
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder={currentRole.demoEmail}
                      className="w-full pl-10 pr-3 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white/80"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="Enter your password"
                      className="w-full pl-10 pr-10 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white/80"
                      required
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {error && <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">{error}</div>}

                <button type="submit" disabled={isLoading} className={`w-full py-2.5 rounded-lg bg-gradient-to-r ${currentRole.gradient} text-white font-medium hover:shadow-lg transition-all disabled:opacity-50`}>
                  {isLoading ? 'Signing in…' : 'Sign In'}
                </button>

                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center gap-2 cursor-pointer text-slate-600">
                    <input type="checkbox" className="rounded border-slate-300" />
                    Remember me
                  </label>
                  <button type="button" className="text-blue-600 hover:text-blue-700 font-medium">Forgot password?</button>
                </div>

                {activeTab === 'student' && (
                  <div className="text-center pt-3 border-t border-slate-200">
                    <p className="text-sm text-slate-600">
                      Don't have an account? <button type="button" className="text-blue-600 hover:text-blue-700 font-medium" onClick={() => navigate('/register')}>Register here</button>
                    </p>
                  </div>
                )}

                <div className="mt-4 p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <p className="text-xs font-semibold text-slate-700 mb-1">Demo Credentials</p>
                  <p className="text-xs text-slate-600"><span className="font-medium">Email:</span> demo@example.com</p>
                  <p className="text-xs text-slate-600"><span className="font-medium">Password:</span> demo123</p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
