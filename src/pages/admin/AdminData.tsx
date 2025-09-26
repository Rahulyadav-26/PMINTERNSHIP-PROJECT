import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Upload,
  Download,
  Search,
  Filter,
  Edit,
  Trash2,
  Users,
  Building,
  FileText,
  Plus,
} from 'lucide-react';

export const AdminData: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data
  const studentData = [
    {
      id: '1',
      name: 'Rahul Sharma',
      email: 'rahul.sharma@university.edu',
      university: 'IIT Delhi',
      course: 'B.Tech CSE',
      year: '3rd',
      skills: ['React', 'Python', 'Machine Learning'],
      profileStrength: 85,
    },
    {
      id: '2',
      name: 'Priya Patel',
      email: 'priya.patel@university.edu',
      university: 'NIT Surat',
      course: 'B.Tech ECE',
      year: '4th',
      skills: ['IoT', 'Embedded Systems', 'C++'],
      profileStrength: 92,
    },
    {
      id: '3',
      name: 'Amit Kumar',
      email: 'amit.kumar@university.edu',
      university: 'BITS Pilani',
      course: 'M.Tech AI',
      year: '1st',
      skills: ['Deep Learning', 'TensorFlow', 'Python'],
      profileStrength: 78,
    },
  ];

  const internshipData = [
    {
      id: '1',
      company: 'Google India',
      position: 'Software Engineering Intern',
      domain: 'Technology',
      location: 'Bangalore',
      duration: '3 months',
      slots: 50,
      filled: 0,
    },
    {
      id: '2',
      company: 'Microsoft',
      position: 'AI Research Intern',
      domain: 'Artificial Intelligence',
      location: 'Hyderabad',
      duration: '6 months',
      slots: 25,
      filled: 0,
    },
    {
      id: '3',
      company: 'Infosys',
      position: 'Digital Innovation Intern',
      domain: 'Consulting',
      location: 'Mumbai',
      duration: '4 months',
      slots: 100,
      filled: 0,
    },
  ];

  const getProfileStrengthBadge = (strength: number) => {
    if (strength >= 80) return <Badge className="gov-badge-accent">Strong</Badge>;
    if (strength >= 60) return <Badge className="gov-badge-secondary">Good</Badge>;
    return <Badge variant="destructive">Weak</Badge>;
  };

  return (
    <DashboardLayout title="Data Management">
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="gov-card">
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Users className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-2xl font-bold">1,247</p>
                  <p className="text-sm text-muted-foreground">Total Students</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="gov-card">
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Building className="h-8 w-8 text-secondary" />
                <div>
                  <p className="text-2xl font-bold">85</p>
                  <p className="text-sm text-muted-foreground">Companies</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="gov-card">
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <FileText className="h-8 w-8 text-accent" />
                <div>
                  <p className="text-2xl font-bold">342</p>
                  <p className="text-sm text-muted-foreground">Internships</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="gov-card">
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Upload className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-2xl font-bold">98%</p>
                  <p className="text-sm text-muted-foreground">Data Complete</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Upload Section */}
        <Card className="gov-card">
          <CardHeader>
            <CardTitle>Data Upload</CardTitle>
            <CardDescription>
              Upload student and internship data via CSV/Excel files
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="student-file">Student Data</Label>
                <div className="flex space-x-2">
                  <Input id="student-file" type="file" accept=".csv,.xlsx" />
                  <Button variant="outline">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="internship-file">Internship Data</Label>
                <div className="flex space-x-2">
                  <Input id="internship-file" type="file" accept=".csv,.xlsx" />
                  <Button variant="outline">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Templates</Label>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Student Template
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Internship Template
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Data Tables */}
        <Tabs defaultValue="students" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="students">Student Data</TabsTrigger>
            <TabsTrigger value="internships">Internship Data</TabsTrigger>
          </TabsList>

          <TabsContent value="students" className="space-y-4">
            <Card className="gov-card">
              <CardHeader>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
                  <div>
                    <CardTitle>Student Records</CardTitle>
                    <CardDescription>
                      Manage and view all student data
                    </CardDescription>
                  </div>
                  <div className="flex space-x-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search students..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 w-64"
                      />
                    </div>
                    <Button variant="outline">
                      <Filter className="h-4 w-4 mr-2" />
                      Filter
                    </Button>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Student
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>University</TableHead>
                      <TableHead>Course</TableHead>
                      <TableHead>Skills</TableHead>
                      <TableHead>Profile Strength</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {studentData.map((student) => (
                      <TableRow key={student.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{student.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {student.email}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{student.university}</TableCell>
                        <TableCell>
                          {student.course} - {student.year}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {student.skills.slice(0, 2).map((skill, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                            {student.skills.length > 2 && (
                              <Badge variant="outline" className="text-xs">
                                +{student.skills.length - 2}
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm">{student.profileStrength}%</span>
                            {getProfileStrengthBadge(student.profileStrength)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="internships" className="space-y-4">
            <Card className="gov-card">
              <CardHeader>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
                  <div>
                    <CardTitle>Internship Opportunities</CardTitle>
                    <CardDescription>
                      Manage available internship positions
                    </CardDescription>
                  </div>
                  <div className="flex space-x-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search internships..."
                        className="pl-10 w-64"
                      />
                    </div>
                    <Button variant="outline">
                      <Filter className="h-4 w-4 mr-2" />
                      Filter
                    </Button>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Internship
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Company</TableHead>
                      <TableHead>Position</TableHead>
                      <TableHead>Domain</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Slots</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {internshipData.map((internship) => (
                      <TableRow key={internship.id}>
                        <TableCell>
                          <div className="font-medium">{internship.company}</div>
                        </TableCell>
                        <TableCell>{internship.position}</TableCell>
                        <TableCell>
                          <Badge className="gov-badge-primary">
                            {internship.domain}
                          </Badge>
                        </TableCell>
                        <TableCell>{internship.location}</TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {internship.filled}/{internship.slots}
                            <div className="text-muted-foreground">
                              {internship.duration}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};