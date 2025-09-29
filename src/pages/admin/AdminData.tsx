
import React, { useState, useMemo } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
  ChevronDown,
  ChevronUp,
  Eye,
  MoreHorizontal,
  CheckCircle,
  AlertCircle,
  Loader2,
  X,
  RefreshCw,
  ArrowUpDown,
  Mail,
  Phone,
  MapPin,
  Calendar,
  TrendingUp,
  UserCheck,
  Clock,
} from 'lucide-react';

interface Student {
  id: string;
  name: string;
  email: string;
  phone?: string;
  university: string;
  course: string;
  year: string;
  skills: string[];
  profileStrength: number;
  location: string;
  registrationDate: string;
  status: 'active' | 'inactive' | 'pending';
  gpa?: number;
  category: 'General' | 'SC' | 'ST' | 'OBC';
  isRural: boolean;
}

interface Internship {
  id: string;
  company: string;
  position: string;
  domain: string;
  location: string;
  duration: string;
  slots: number;
  filled: number;
  stipend: number;
  applicationDeadline: string;
  status: 'active' | 'closed' | 'draft';
  requirements: string[];
  description: string;
}

export const AdminData: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [sortConfig, setSortConfig] = useState<{key: string; direction: 'asc' | 'desc'} | null>(null);
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [selectedInternships, setSelectedInternships] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<{type: 'success' | 'error' | null; message: string}>({type: null, message: ''});
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{type: 'student' | 'internship'; id: string} | null>(null);

  // Enhanced mock data
  const studentData: Student[] = [
    {
      id: '1',
      name: 'Rahul Sharma',
      email: 'rahul.sharma@iitdelhi.ac.in',
      phone: '+91 98765 43210',
      university: 'IIT Delhi',
      course: 'B.Tech CSE',
      year: '3rd',
      skills: ['React', 'Python', 'Machine Learning', 'Django', 'AWS'],
      profileStrength: 85,
      location: 'New Delhi',
      registrationDate: '2025-01-15',
      status: 'active',
      gpa: 8.5,
      category: 'General',
      isRural: false,
    },
    {
      id: '2',
      name: 'Priya Patel',
      email: 'priya.patel@nitsurat.ac.in',
      phone: '+91 87654 32109',
      university: 'NIT Surat',
      course: 'B.Tech ECE',
      year: '4th',
      skills: ['IoT', 'Embedded Systems', 'C++', 'Arduino', 'MATLAB'],
      profileStrength: 92,
      location: 'Surat',
      registrationDate: '2025-01-10',
      status: 'active',
      gpa: 9.1,
      category: 'OBC',
      isRural: true,
    },
    {
      id: '3',
      name: 'Amit Kumar',
      email: 'amit.kumar@bitspilani.ac.in',
      phone: '+91 76543 21098',
      university: 'BITS Pilani',
      course: 'M.Tech AI',
      year: '1st',
      skills: ['Deep Learning', 'TensorFlow', 'Python', 'Computer Vision'],
      profileStrength: 78,
      location: 'Pilani',
      registrationDate: '2025-01-20',
      status: 'pending',
      gpa: 7.8,
      category: 'SC',
      isRural: false,
    },
    {
      id: '4',
      name: 'Sneha Gupta',
      email: 'sneha.gupta@nitk.edu.in',
      university: 'NIT Karnataka',
      course: 'B.Tech CSE',
      year: '2nd',
      skills: ['Java', 'Spring Boot', 'React', 'MySQL'],
      profileStrength: 88,
      location: 'Surathkal',
      registrationDate: '2025-01-25',
      status: 'active',
      gpa: 8.9,
      category: 'General',
      isRural: false,
    }
  ];

  const internshipData: Internship[] = [
    {
      id: '1',
      company: 'Google India',
      position: 'Software Engineering Intern',
      domain: 'Technology',
      location: 'Bangalore',
      duration: '3 months',
      slots: 50,
      filled: 12,
      stipend: 80000,
      applicationDeadline: '2025-03-15',
      status: 'active',
      requirements: ['React', 'Node.js', 'JavaScript', 'Data Structures'],
      description: 'Work on cutting-edge projects with experienced mentors.',
    },
    {
      id: '2',
      company: 'Microsoft',
      position: 'AI Research Intern',
      domain: 'Artificial Intelligence',
      location: 'Hyderabad',
      duration: '6 months',
      slots: 25,
      filled: 8,
      stipend: 90000,
      applicationDeadline: '2025-02-28',
      status: 'active',
      requirements: ['Python', 'TensorFlow', 'Machine Learning', 'Statistics'],
      description: 'Research and develop next-generation AI solutions.',
    },
    {
      id: '3',
      company: 'Infosys',
      position: 'Digital Innovation Intern',
      domain: 'Consulting',
      location: 'Mumbai',
      duration: '4 months',
      slots: 100,
      filled: 45,
      stipend: 25000,
      applicationDeadline: '2025-04-01',
      status: 'active',
      requirements: ['Problem Solving', 'Communication', 'Business Analysis'],
      description: 'Drive digital transformation initiatives for clients.',
    }
  ];

  // Filtering and sorting logic
  const filteredStudents = useMemo(() => {
    let filtered = studentData.filter(student => {
      const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          student.university.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesFilter = selectedFilter === 'all' || student.status === selectedFilter;

      return matchesSearch && matchesFilter;
    });

    if (sortConfig) {
      filtered.sort((a, b) => {
        const aValue = a[sortConfig.key as keyof Student];
        const bValue = b[sortConfig.key as keyof Student];

        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }, [studentData, searchTerm, selectedFilter, sortConfig]);

  const filteredInternships = useMemo(() => {
    return internshipData.filter(internship => {
      const matchesSearch = internship.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          internship.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          internship.domain.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesSearch;
    });
  }, [internshipData, searchTerm]);

  // Pagination logic
  const paginatedStudents = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredStudents.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredStudents, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);

  const handleSort = (key: string) => {
    setSortConfig(current => ({
      key,
      direction: current?.key === key && current.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleBulkDelete = async (type: 'student' | 'internship') => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    if (type === 'student') {
      setSelectedStudents([]);
    } else {
      setSelectedInternships([]);
    }

    setIsLoading(false);
    setUploadStatus({type: 'success', message: `${type === 'student' ? 'Students' : 'Internships'} deleted successfully`});
    setTimeout(() => setUploadStatus({type: null, message: ''}), 3000);
  };

  const handleFileUpload = async (type: 'student' | 'internship', file: File | undefined) => {
    if (!file) return;

    setIsLoading(true);
    setUploadStatus({type: null, message: ''});

    // Simulate file upload
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Simulate success/error randomly
    const success = Math.random() > 0.3;

    if (success) {
      setUploadStatus({
        type: 'success', 
        message: `${type === 'student' ? 'Student' : 'Internship'} data uploaded successfully. ${Math.floor(Math.random() * 100 + 10)} records processed.`
      });
    } else {
      setUploadStatus({
        type: 'error', 
        message: 'Upload failed. Please check file format and try again.'
      });
    }

    setIsLoading(false);
    setTimeout(() => setUploadStatus({type: null, message: ''}), 5000);
  };

  const getProfileStrengthBadge = (strength: number) => {
    if (strength >= 80) return <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-200">Strong</Badge>;
    if (strength >= 60) return <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200">Good</Badge>;
    return <Badge className="bg-red-100 text-red-800 hover:bg-red-200">Weak</Badge>;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-200"><CheckCircle className="w-3 h-3 mr-1" />Active</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
      case 'inactive':
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200">Inactive</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handleSelectAll = (type: 'student' | 'internship') => {
    if (type === 'student') {
      if (selectedStudents.length === paginatedStudents.length) {
        setSelectedStudents([]);
      } else {
        setSelectedStudents(paginatedStudents.map(s => s.id));
      }
    }
  };

  return (
    <DashboardLayout title="Data Management">
      <div className="space-y-8">
        {/* Upload Status Alert */}
        {uploadStatus.type && (
          <Alert className={uploadStatus.type === 'success' ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}>
            {uploadStatus.type === 'success' ? 
              <CheckCircle className="h-4 w-4 text-green-600" /> : 
              <AlertCircle className="h-4 w-4 text-red-600" />
            }
            <AlertDescription className={uploadStatus.type === 'success' ? 'text-green-800' : 'text-red-800'}>
              {uploadStatus.message}
            </AlertDescription>
          </Alert>
        )}

        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-blue-500 to-blue-600">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold text-white">1,247</p>
                  <p className="text-blue-100 text-sm">Total Students</p>
                  <div className="flex items-center mt-2">
                    <TrendingUp className="h-4 w-4 text-blue-200 mr-1" />
                    <span className="text-blue-200 text-xs">+12% this month</span>
                  </div>
                </div>
                <Users className="h-12 w-12 text-blue-200" />
              </div>
              <div className="absolute -top-4 -right-4 w-16 h-16 bg-white/10 rounded-full" />
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-emerald-500 to-emerald-600">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold text-white">85</p>
                  <p className="text-emerald-100 text-sm">Partner Companies</p>
                  <div className="flex items-center mt-2">
                    <TrendingUp className="h-4 w-4 text-emerald-200 mr-1" />
                    <span className="text-emerald-200 text-xs">+5 new partners</span>
                  </div>
                </div>
                <Building className="h-12 w-12 text-emerald-200" />
              </div>
              <div className="absolute -top-4 -right-4 w-16 h-16 bg-white/10 rounded-full" />
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-purple-500 to-purple-600">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold text-white">342</p>
                  <p className="text-purple-100 text-sm">Active Internships</p>
                  <div className="flex items-center mt-2">
                    <UserCheck className="h-4 w-4 text-purple-200 mr-1" />
                    <span className="text-purple-200 text-xs">68% filled</span>
                  </div>
                </div>
                <FileText className="h-12 w-12 text-purple-200" />
              </div>
              <div className="absolute -top-4 -right-4 w-16 h-16 bg-white/10 rounded-full" />
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-orange-500 to-orange-600">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold text-white">98%</p>
                  <p className="text-orange-100 text-sm">Data Completeness</p>
                  <Progress value={98} className="mt-2 h-2" />
                </div>
                <Upload className="h-12 w-12 text-orange-200" />
              </div>
              <div className="absolute -top-4 -right-4 w-16 h-16 bg-white/10 rounded-full" />
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Upload Section */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100">
            <CardTitle className="text-xl text-slate-800">Data Upload Center</CardTitle>
            <CardDescription className="text-slate-600">
              Upload and manage student and internship data efficiently
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-blue-600" />
                  <Label htmlFor="student-file" className="font-semibold text-slate-700">Student Data</Label>
                </div>
                <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 hover:border-blue-400 transition-colors">
                  <Input 
                    id="student-file" 
                    type="file" 
                    accept=".csv,.xlsx" 
                    className="mb-3"
                    onChange={(e) => handleFileUpload('student', e.target.files?.[0])}
                  />
                  <Button 
                    variant="outline" 
                    className="w-full" 
                    disabled={isLoading}
                    onClick={() => document.getElementById('student-file')?.click()}
                  >
                    {isLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Upload className="h-4 w-4 mr-2" />}
                    Choose File
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Building className="h-5 w-5 text-emerald-600" />
                  <Label htmlFor="internship-file" className="font-semibold text-slate-700">Internship Data</Label>
                </div>
                <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 hover:border-emerald-400 transition-colors">
                  <Input 
                    id="internship-file" 
                    type="file" 
                    accept=".csv,.xlsx" 
                    className="mb-3"
                    onChange={(e) => handleFileUpload('internship', e.target.files?.[0])}
                  />
                  <Button 
                    variant="outline" 
                    className="w-full" 
                    disabled={isLoading}
                    onClick={() => document.getElementById('internship-file')?.click()}
                  >
                    {isLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Upload className="h-4 w-4 mr-2" />}
                    Choose File
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Download className="h-5 w-5 text-purple-600" />
                  <Label className="font-semibold text-slate-700">Download Templates</Label>
                </div>
                <div className="space-y-3">
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Download className="h-4 w-4 mr-2" />
                    Student Template
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Download className="h-4 w-4 mr-2" />
                    Internship Template
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Download className="h-4 w-4 mr-2" />
                    Bulk Upload Guide
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Data Tables */}
        <Tabs defaultValue="students" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 h-12 p-1 bg-slate-100">
            <TabsTrigger value="students" className="text-base font-semibold">Student Records</TabsTrigger>
            <TabsTrigger value="internships" className="text-base font-semibold">Internship Listings</TabsTrigger>
          </TabsList>

          <TabsContent value="students" className="space-y-6">
            <Card className="border-0 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0">
                  <div>
                    <CardTitle className="text-xl text-slate-800">Student Database</CardTitle>
                    <CardDescription className="text-slate-600">
                      Comprehensive student records with advanced filtering and management
                    </CardDescription>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input
                        placeholder="Search students..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 w-64"
                      />
                    </div>
                    <Select value={selectedFilter} onValueChange={setSelectedFilter}>
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="Filter by status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Students</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="outline" onClick={() => setCurrentPage(1)}>
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Refresh
                    </Button>
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Student
                    </Button>
                  </div>
                </div>
              </CardHeader>

              {/* Bulk Actions Bar */}
              {selectedStudents.length > 0 && (
                <div className="bg-blue-50 border-b p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-blue-800">
                      {selectedStudents.length} student{selectedStudents.length > 1 ? 's' : ''} selected
                    </span>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Mail className="h-4 w-4 mr-2" />
                        Email Selected
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleBulkDelete('student')}>
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Selected
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-slate-50">
                        <TableHead className="w-12">
                          <Checkbox 
                            checked={selectedStudents.length === paginatedStudents.length && paginatedStudents.length > 0}
                            onCheckedChange={() => handleSelectAll('student')}
                          />
                        </TableHead>
                        <TableHead className="cursor-pointer" onClick={() => handleSort('name')}>
                          <div className="flex items-center space-x-1">
                            <span className="font-semibold">Student Details</span>
                            <ArrowUpDown className="h-4 w-4" />
                          </div>
                        </TableHead>
                        <TableHead className="cursor-pointer" onClick={() => handleSort('university')}>
                          <div className="flex items-center space-x-1">
                            <span className="font-semibold">Institution</span>
                            <ArrowUpDown className="h-4 w-4" />
                          </div>
                        </TableHead>
                        <TableHead className="font-semibold">Skills & Expertise</TableHead>
                        <TableHead className="cursor-pointer" onClick={() => handleSort('profileStrength')}>
                          <div className="flex items-center space-x-1">
                            <span className="font-semibold">Profile Strength</span>
                            <ArrowUpDown className="h-4 w-4" />
                          </div>
                        </TableHead>
                        <TableHead className="font-semibold">Status</TableHead>
                        <TableHead className="font-semibold">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedStudents.map((student) => (
                        <TableRow key={student.id} className="hover:bg-slate-50 transition-colors">
                          <TableCell>
                            <Checkbox 
                              checked={selectedStudents.includes(student.id)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setSelectedStudents([...selectedStudents, student.id]);
                                } else {
                                  setSelectedStudents(selectedStudents.filter(id => id !== student.id));
                                }
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="font-semibold text-slate-900">{student.name}</div>
                              <div className="text-sm text-slate-500 flex items-center">
                                <Mail className="h-3 w-3 mr-1" />
                                {student.email}
                              </div>
                              {student.phone && (
                                <div className="text-sm text-slate-500 flex items-center">
                                  <Phone className="h-3 w-3 mr-1" />
                                  {student.phone}
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="font-medium text-slate-800">{student.university}</div>
                              <div className="text-sm text-slate-600">{student.course} - {student.year}</div>
                              <div className="text-sm text-slate-500 flex items-center">
                                <MapPin className="h-3 w-3 mr-1" />
                                {student.location}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1 max-w-48">
                              {student.skills.slice(0, 2).map((skill, index) => (
                                <Badge key={index} variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                                  {skill}
                                </Badge>
                              ))}
                              {student.skills.length > 2 && (
                                <Badge variant="outline" className="text-xs bg-slate-50 text-slate-600">
                                  +{student.skills.length - 2} more
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-3">
                              <div className="text-lg font-semibold text-slate-800">{student.profileStrength}%</div>
                              <div>
                                {getProfileStrengthBadge(student.profileStrength)}
                                <Progress value={student.profileStrength} className="mt-1 h-2" />
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            {getStatusBadge(student.status)}
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>
                                  <Eye className="mr-2 h-4 w-4" />
                                  View Profile
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit Details
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Mail className="mr-2 h-4 w-4" />
                                  Send Email
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  className="text-red-600"
                                  onClick={() => {
                                    setItemToDelete({type: 'student', id: student.id});
                                    setShowDeleteDialog(true);
                                  }}
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between px-6 py-4 border-t bg-slate-50">
                    <div className="text-sm text-slate-600">
                      Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredStudents.length)} of {filteredStudents.length} students
                    </div>
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                      >
                        Previous
                      </Button>
                      {Array.from({length: totalPages}, (_, i) => i + 1).map(page => (
                        <Button
                          key={page}
                          variant={page === currentPage ? "default" : "outline"}
                          size="sm"
                          onClick={() => setCurrentPage(page)}
                          className="w-10"
                        >
                          {page}
                        </Button>
                      ))}
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="internships" className="space-y-6">
            <Card className="border-0 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-emerald-50 to-green-50 border-b">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0">
                  <div>
                    <CardTitle className="text-xl text-slate-800">Internship Opportunities</CardTitle>
                    <CardDescription className="text-slate-600">
                      Manage and monitor all available internship positions
                    </CardDescription>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input
                        placeholder="Search internships..."
                        className="pl-10 w-64"
                      />
                    </div>
                    <Button variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                    <Button className="bg-emerald-600 hover:bg-emerald-700">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Internship
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-slate-50">
                        <TableHead className="font-semibold">Company & Position</TableHead>
                        <TableHead className="font-semibold">Domain & Requirements</TableHead>
                        <TableHead className="font-semibold">Location & Duration</TableHead>
                        <TableHead className="font-semibold">Capacity & Filled</TableHead>
                        <TableHead className="font-semibold">Stipend & Deadline</TableHead>
                        <TableHead className="font-semibold">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredInternships.map((internship) => (
                        <TableRow key={internship.id} className="hover:bg-slate-50 transition-colors">
                          <TableCell>
                            <div className="space-y-1">
                              <div className="font-semibold text-lg text-slate-900">{internship.company}</div>
                              <div className="font-medium text-slate-700">{internship.position}</div>
                              <div className="text-sm text-slate-500 max-w-xs">{internship.description}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-2">
                              <Badge className="bg-purple-100 text-purple-800 font-medium">
                                {internship.domain}
                              </Badge>
                              <div className="flex flex-wrap gap-1 max-w-48">
                                {internship.requirements.slice(0, 2).map((req, index) => (
                                  <Badge key={index} variant="outline" className="text-xs">
                                    {req}
                                  </Badge>
                                ))}
                                {internship.requirements.length > 2 && (
                                  <Badge variant="outline" className="text-xs">
                                    +{internship.requirements.length - 2}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="flex items-center text-slate-700">
                                <MapPin className="h-4 w-4 mr-1 text-slate-500" />
                                {internship.location}
                              </div>
                              <div className="flex items-center text-slate-600">
                                <Calendar className="h-4 w-4 mr-1 text-slate-500" />
                                {internship.duration}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-2">
                              <div className="flex items-center space-x-2">
                                <span className="text-lg font-semibold text-slate-800">
                                  {internship.filled}/{internship.slots}
                                </span>
                                <span className="text-sm text-slate-500">slots</span>
                              </div>
                              <Progress 
                                value={(internship.filled / internship.slots) * 100} 
                                className="h-2"
                              />
                              <span className="text-xs text-slate-500">
                                {Math.round((internship.filled / internship.slots) * 100)}% filled
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="font-semibold text-green-700">
                                ₹{internship.stipend.toLocaleString()}/month
                              </div>
                              <div className="text-sm text-slate-600">
                                Deadline: {internship.applicationDeadline}
                              </div>
                              {getStatusBadge(internship.status)}
                            </div>
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>
                                  <Eye className="mr-2 h-4 w-4" />
                                  View Applications
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit Details
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <UserCheck className="mr-2 h-4 w-4" />
                                  Manage Selections
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-red-600">
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Delete Confirmation Dialog */}
        <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Deletion</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this {itemToDelete?.type}? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
                Cancel
              </Button>
              <Button 
                variant="destructive" 
                onClick={() => {
                  setShowDeleteDialog(false);
                  setItemToDelete(null);
                }}
              >
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};
