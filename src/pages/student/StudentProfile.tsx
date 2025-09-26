import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  User,
  Mail,
  School,
  BookOpen,
  Upload,
  Star,
  TrendingUp,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export const StudentProfile: React.FC = () => {
  const { user } = useAuth();

  // Mock student data
  const studentData = {
    profileStrength: 75,
    skills: ['React', 'JavaScript', 'Python', 'Node.js', 'MongoDB'],
    missingSkills: ['Docker', 'AWS', 'Machine Learning'],
    university: 'Indian Institute of Technology',
    course: 'B.Tech Computer Science',
    year: '3rd Year',
    enrollmentId: 'IIT2021CS001',
    gpa: 8.5,
    resumeUploaded: true,
  };

  const strengthColor = studentData.profileStrength >= 80 ? 'text-accent' : 
                       studentData.profileStrength >= 60 ? 'text-secondary' : 'text-destructive';

  const strengthLevel = studentData.profileStrength >= 80 ? 'Strong' : 
                       studentData.profileStrength >= 60 ? 'Good' : 'Needs Improvement';

  return (
    <DashboardLayout title="Student Profile">
      <div className="space-y-6">
        {/* Profile Header */}
        <Card className="gov-card">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-shrink-0">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={user?.profileImage} />
                  <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                    {user?.name?.charAt(0) || 'S'}
                  </AvatarFallback>
                </Avatar>
              </div>
              
              <div className="flex-1 space-y-4">
                <div>
                  <h2 className="text-2xl font-bold text-foreground">{user?.name}</h2>
                  <p className="text-muted-foreground">{user?.email}</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center space-x-2">
                    <School className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{studentData.university}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <BookOpen className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{studentData.course}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">ID: {studentData.enrollmentId}</span>
                  </div>
                </div>
              </div>
              
              <Button className="bg-primary hover:bg-primary-hover">
                Edit Profile
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Strength */}
          <Card className="gov-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5" />
                <span>Profile Strength</span>
              </CardTitle>
              <CardDescription>
                Complete your profile to increase match accuracy
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className={`text-3xl font-bold ${strengthColor}`}>
                  {studentData.profileStrength}%
                </div>
                <p className="text-sm text-muted-foreground">{strengthLevel}</p>
              </div>
              
              <Progress value={studentData.profileStrength} className="h-2" />
              
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-accent" />
                    <span>Basic Info</span>
                  </span>
                  <span className="text-accent">Complete</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-accent" />
                    <span>Resume</span>
                  </span>
                  <span className="text-accent">Uploaded</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center space-x-2">
                    <AlertCircle className="h-4 w-4 text-secondary" />
                    <span>Skills</span>
                  </span>
                  <span className="text-secondary">Partial</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Academic Info */}
          <Card className="gov-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BookOpen className="h-5 w-5" />
                <span>Academic Details</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Course</p>
                  <p className="text-foreground">{studentData.course}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Year</p>
                  <p className="text-foreground">{studentData.year}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">CGPA</p>
                  <div className="flex items-center space-x-2">
                    <p className="text-foreground">{studentData.gpa}</p>
                    <Badge variant="outline" className="gov-badge-accent">
                      <Star className="h-3 w-3 mr-1" />
                      Excellent
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Resume Status */}
          <Card className="gov-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Upload className="h-5 w-5" />
                <span>Resume</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {studentData.resumeUploaded ? (
                <div className="space-y-3">
                  <div className="flex items-center space-x-2 text-accent">
                    <CheckCircle className="h-4 w-4" />
                    <span className="text-sm font-medium">Resume uploaded</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Last updated: 2 days ago
                  </p>
                  <div className="space-y-2">
                    <Button variant="outline" size="sm" className="w-full">
                      View Resume
                    </Button>
                    <Button variant="outline" size="sm" className="w-full">
                      Update Resume
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center space-y-3">
                  <Upload className="h-8 w-8 text-muted-foreground mx-auto" />
                  <p className="text-sm text-muted-foreground">No resume uploaded</p>
                  <Button className="w-full bg-secondary hover:bg-secondary-hover">
                    Upload Resume
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Skills Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="gov-card">
            <CardHeader>
              <CardTitle>Current Skills</CardTitle>
              <CardDescription>
                Skills extracted from your resume and profile
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {studentData.skills.map((skill, index) => (
                  <Badge key={index} className="gov-badge-primary">
                    {skill}
                  </Badge>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4">
                Add Skills
              </Button>
            </CardContent>
          </Card>

          <Card className="gov-card">
            <CardHeader>
              <CardTitle>Recommended Skills</CardTitle>
              <CardDescription>
                Skills that could improve your profile strength
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {studentData.missingSkills.map((skill, index) => (
                  <Badge key={index} variant="outline" className="gov-badge-secondary">
                    {skill}
                  </Badge>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4">
                Learn More
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="gov-card">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button className="bg-primary hover:bg-primary-hover">
                Update Preferences
              </Button>
              <Button variant="outline">
                View Applications
              </Button>
              <Button variant="outline">
                Check Allocation Status
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};