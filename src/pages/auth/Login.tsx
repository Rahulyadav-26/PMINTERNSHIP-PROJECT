import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { Eye, EyeOff, Mail, Lock, User, Shield, BarChart3, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const Login: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login, isLoading } = useAuth();
  const { toast } = useToast();
  
  const defaultRole = searchParams.get('role') || 'student';
  const [activeTab, setActiveTab] = useState(defaultRole);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      // Add role prefix to email for demo purposes
      const roleEmail = activeTab === 'student' 
        ? formData.email 
        : `${activeTab}.${formData.email}`;
        
      await login(roleEmail, formData.password);
      
      toast({
        title: 'Login Successful',
        description: `Welcome back to the PM Internship portal!`,
      });

      // Navigate based on role
      const dashboardPath = activeTab === 'student' 
        ? '/dashboard/profile'
        : activeTab === 'admin'
        ? '/admin/data'
        : '/ministry/bias';
        
      navigate(dashboardPath);
    } catch (error) {
      setError('Invalid credentials. Please try again.');
      toast({
        title: 'Login Failed',
        description: 'Please check your credentials and try again.',
        variant: 'destructive',
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const roleConfigs = {
    student: {
      icon: User,
      title: 'Student Login',
      description: 'Access your internship portal',
      demoEmail: 'student@example.com',
    },
    admin: {
      icon: Shield,
      title: 'Admin Login',
      description: 'Manage allocation system',
      demoEmail: 'admin@gov.in',
    },
    ministry: {
      icon: BarChart3,
      title: 'Ministry Login',
      description: 'Policy oversight dashboard',
      demoEmail: 'ministry@gov.in',
    },
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back to Home */}
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="mb-6 -ml-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Button>

        <Card className="gov-card">
          <CardHeader className="text-center pb-4">
            <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mx-auto mb-4">
              <span className="text-primary-foreground font-bold">PM</span>
            </div>
            <CardTitle className="text-2xl">Welcome Back</CardTitle>
            <CardDescription>
              Sign in to your PM Internship account
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="student" className="text-xs">Student</TabsTrigger>
                <TabsTrigger value="admin" className="text-xs">Admin</TabsTrigger>
                <TabsTrigger value="ministry" className="text-xs">Ministry</TabsTrigger>
              </TabsList>

              {Object.entries(roleConfigs).map(([role, config]) => (
                <TabsContent key={role} value={role}>
                  <div className="text-center mb-6">
                    <config.icon className="h-8 w-8 mx-auto mb-2 text-primary" />
                    <h3 className="font-semibold">{config.title}</h3>
                    <p className="text-sm text-muted-foreground">{config.description}</p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          placeholder={config.demoEmail}
                          value={formData.email}
                          onChange={handleInputChange}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="password"
                          name="password"
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Enter your password"
                          value={formData.password}
                          onChange={handleInputChange}
                          className="pl-10 pr-10"
                          required
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <Eye className="h-4 w-4 text-muted-foreground" />
                          )}
                        </Button>
                      </div>
                    </div>

                    {error && (
                      <Alert variant="destructive">
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    )}

                    <Button
                      type="submit"
                      className="w-full bg-primary hover:bg-primary-hover"
                      disabled={isLoading}
                    >
                      {isLoading ? 'Signing in...' : 'Sign In'}
                    </Button>

                    <div className="text-center">
                      <Link
                        to="/forgot-password"
                        className="text-sm text-primary hover:underline"
                      >
                        Forgot your password?
                      </Link>
                    </div>

                    {role === 'student' && (
                      <div className="text-center pt-4 border-t">
                        <p className="text-sm text-muted-foreground">
                          Don't have an account?{' '}
                          <Link
                            to="/register"
                            className="text-primary hover:underline font-medium"
                          >
                            Register here
                          </Link>
                        </p>
                      </div>
                    )}
                  </form>
                </TabsContent>
              ))}
            </Tabs>

            {/* Demo Credentials */}
            <div className="mt-6 p-4 bg-muted/50 rounded-lg">
              <p className="text-xs text-muted-foreground mb-2 font-medium">Demo Credentials:</p>
              <div className="text-xs text-muted-foreground space-y-1">
                <p>Email: demo@example.com</p>
                <p>Password: demo123</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};