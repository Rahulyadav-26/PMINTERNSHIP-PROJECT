import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Edit,
  Users,
  Building,
  Save,
  X,
  Plus,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Search,
  Filter,
  History,
} from 'lucide-react';

interface Candidate {
  id: string;
  name: string;
  email: string;
  score: number;
  university: string;
  course: string;
  skills: string[];
}

interface InternshipMatch {
  id: string;
  company: string;
  position: string;
  location: string;
  totalSlots: number;
  matchedCandidates: Candidate[];
}

interface ManualOverridesProps {}

export const ManualOverrides: React.FC<ManualOverridesProps> = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [hasChanges, setHasChanges] = useState(false);
  const [changes, setChanges] = useState<string[]>([]);

  // Mock data for internship matches
  const [internshipMatches, setInternshipMatches] = useState<InternshipMatch[]>([
    {
      id: '1',
      company: 'Google India',
      position: 'Software Engineering Intern',
      location: 'Bangalore',
      totalSlots: 50,
      matchedCandidates: [
        {
          id: '1',
          name: 'Rahul Sharma',
          email: 'rahul.sharma@iit.ac.in',
          score: 92,
          university: 'IIT Delhi',
          course: 'B.Tech CSE',
          skills: ['React', 'Python', 'Machine Learning']
        },
        {
          id: '2',
          name: 'Priya Patel',
          email: 'priya.patel@nit.ac.in',
          score: 88,
          university: 'NIT Surat',
          course: 'B.Tech CSE',
          skills: ['JavaScript', 'Node.js', 'MongoDB']
        },
        {
          id: '3',
          name: 'Amit Kumar',
          email: 'amit.kumar@bits.ac.in',
          score: 85,
          university: 'BITS Pilani',
          course: 'M.Tech AI',
          skills: ['Deep Learning', 'TensorFlow', 'Python']
        }
      ]
    },
    {
      id: '2',
      company: 'Microsoft',
      position: 'AI Research Intern',
      location: 'Hyderabad',
      totalSlots: 25,
      matchedCandidates: [
        {
          id: '4',
          name: 'Sneha Reddy',
          email: 'sneha.reddy@iisc.ac.in',
          score: 94,
          university: 'IISc Bangalore',
          course: 'M.Tech AI',
          skills: ['Machine Learning', 'PyTorch', 'Computer Vision']
        },
        {
          id: '5',
          name: 'Arjun Mehta',
          email: 'arjun.mehta@iitb.ac.in',
          score: 89,
          university: 'IIT Bombay',
          course: 'B.Tech CSE',
          skills: ['AI/ML', 'Python', 'Data Science']
        }
      ]
    },
    {
      id: '3',
      company: 'Infosys',
      position: 'Digital Innovation Intern',
      location: 'Mumbai',
      totalSlots: 100,
      matchedCandidates: [
        {
          id: '6',
          name: 'Kavya Singh',
          email: 'kavya.singh@dtu.ac.in',
          score: 82,
          university: 'DTU Delhi',
          course: 'B.Tech IT',
          skills: ['Web Development', 'Angular', 'Spring Boot']
        },
        {
          id: '7',
          name: 'Ravi Gupta',
          email: 'ravi.gupta@vit.ac.in',
          score: 79,
          university: 'VIT Vellore',
          course: 'B.Tech CSE',
          skills: ['Java', 'React', 'MySQL']
        }
      ]
    }
  ]);

  const handleRemoveCandidate = (internshipId: string, candidateId: string) => {
    setInternshipMatches(prev => 
      prev.map(internship => 
        internship.id === internshipId 
          ? {
              ...internship,
              matchedCandidates: internship.matchedCandidates.filter(c => c.id !== candidateId)
            }
          : internship
      )
    );

    const internship = internshipMatches.find(i => i.id === internshipId);
    const candidate = internship?.matchedCandidates.find(c => c.id === candidateId);

    if (internship && candidate) {
      setChanges(prev => [...prev, `Removed ${candidate.name} from ${internship.company} - ${internship.position}`]);
      setHasChanges(true);
    }
  };

  const handleReassignCandidate = (fromInternshipId: string, candidateId: string, toInternshipId: string) => {
    const candidate = internshipMatches
      .find(i => i.id === fromInternshipId)
      ?.matchedCandidates.find(c => c.id === candidateId);

    if (!candidate) return;

    // Remove from current internship
    setInternshipMatches(prev => 
      prev.map(internship => 
        internship.id === fromInternshipId 
          ? {
              ...internship,
              matchedCandidates: internship.matchedCandidates.filter(c => c.id !== candidateId)
            }
          : internship.id === toInternshipId
          ? {
              ...internship,
              matchedCandidates: [...internship.matchedCandidates, candidate]
            }
          : internship
      )
    );

    const fromInternship = internshipMatches.find(i => i.id === fromInternshipId);
    const toInternship = internshipMatches.find(i => i.id === toInternshipId);

    if (fromInternship && toInternship) {
      setChanges(prev => [...prev, 
        `Reassigned ${candidate.name} from ${fromInternship.company} to ${toInternship.company}`
      ]);
      setHasChanges(true);
    }
  };

  const handleSaveChanges = () => {
    console.log('Saving manual overrides...', changes);
    setHasChanges(false);
    setChanges([]);
    // Add actual save logic here
  };

  const handleResetChanges = () => {
    // Reset to original state - would need to store original data
    setHasChanges(false);
    setChanges([]);
  };

  const getTotalMatches = () => {
    return internshipMatches.reduce((total, internship) => total + internship.matchedCandidates.length, 0);
  };

  const getTotalSlots = () => {
    return internshipMatches.reduce((total, internship) => total + internship.totalSlots, 0);
  };

  const getScoreBadge = (score: number) => {
    if (score >= 90) return <Badge className="gov-badge-accent">Excellent</Badge>;
    if (score >= 80) return <Badge className="gov-badge-primary">Good</Badge>;
    if (score >= 70) return <Badge className="gov-badge-secondary">Average</Badge>;
    return <Badge variant="destructive">Below Average</Badge>;
  };

  return (
    <DashboardLayout title="Manual Overrides">
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="gov-card">
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Building className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-2xl font-bold">{internshipMatches.length}</p>
                  <p className="text-sm text-muted-foreground">Active Internships</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="gov-card">
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Users className="h-8 w-8 text-secondary" />
                <div>
                  <p className="text-2xl font-bold">{getTotalMatches()}</p>
                  <p className="text-sm text-muted-foreground">Matched Candidates</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="gov-card">
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Edit className="h-8 w-8 text-accent" />
                <div>
                  <p className="text-2xl font-bold">{changes.length}</p>
                  <p className="text-sm text-muted-foreground">Pending Changes</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="gov-card">
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <CheckCircle className={`h-8 w-8 ${hasChanges ? 'text-orange-600' : 'text-green-600'}`} />
                <div>
                  <p className="text-2xl font-bold">{Math.round((getTotalMatches() / getTotalSlots()) * 100)}%</p>
                  <p className="text-sm text-muted-foreground">Fill Rate</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Changes Alert */}
        {hasChanges && (
          <Card className="border-orange-200 bg-orange-50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="h-5 w-5 text-orange-600" />
                  <span className="font-medium text-orange-900">
                    You have {changes.length} unsaved change{changes.length !== 1 ? 's' : ''}
                  </span>
                </div>
                <div className="space-x-2">
                  <Button variant="outline" size="sm" onClick={handleResetChanges}>
                    Reset
                  </Button>
                  <Button size="sm" onClick={handleSaveChanges}>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Main Content */}
        <Tabs defaultValue="overrides" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overrides">Manual Overrides</TabsTrigger>
            <TabsTrigger value="changes">Recent Changes</TabsTrigger>
            <TabsTrigger value="summary">Allocation Summary</TabsTrigger>
          </TabsList>

          <TabsContent value="overrides" className="space-y-4">
            <Card className="gov-card">
              <CardHeader>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
                  <div>
                    <CardTitle className="flex items-center space-x-2">
                      <Edit className="h-5 w-5" />
                      <span>Internship Matches</span>
                    </CardTitle>
                    <CardDescription>
                      Manually adjust candidate assignments for optimal matching
                    </CardDescription>
                  </div>
                  <div className="flex space-x-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search internships..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 w-64"
                      />
                    </div>
                    <Button variant="outline">
                      <Filter className="h-4 w-4 mr-2" />
                      Filter
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  {internshipMatches.map((internship) => (
                    <div key={internship.id} className="border rounded-lg p-6 bg-blue-50 border-blue-200">
                      {/* Internship Header */}
                      <div className="mb-6">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-lg font-semibold text-blue-900">
                            {internship.company} - {internship.position}
                          </h3>
                          <div className="flex items-center space-x-2">
                            <Badge className="gov-badge-primary">{internship.location}</Badge>
                            <Badge variant="outline">
                              {internship.matchedCandidates.length}/{internship.totalSlots} filled
                            </Badge>
                          </div>
                        </div>
                      </div>

                      {/* Candidates Table */}
                      {internship.matchedCandidates.length > 0 ? (
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Candidate</TableHead>
                              <TableHead>University</TableHead>
                              <TableHead>Skills</TableHead>
                              <TableHead>Score</TableHead>
                              <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {internship.matchedCandidates.map((candidate) => (
                              <TableRow key={candidate.id}>
                                <TableCell>
                                  <div>
                                    <div className="font-medium">{candidate.name}</div>
                                    <div className="text-sm text-muted-foreground">{candidate.email}</div>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div>
                                    <div className="font-medium">{candidate.university}</div>
                                    <div className="text-sm text-muted-foreground">{candidate.course}</div>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div className="flex flex-wrap gap-1">
                                    {candidate.skills.slice(0, 2).map((skill, index) => (
                                      <Badge key={index} variant="outline" className="text-xs">
                                        {skill}
                                      </Badge>
                                    ))}
                                    {candidate.skills.length > 2 && (
                                      <Badge variant="outline" className="text-xs">
                                        +{candidate.skills.length - 2}
                                      </Badge>
                                    )}
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div className="flex items-center space-x-2">
                                    <span className="font-medium">{candidate.score}</span>
                                    {getScoreBadge(candidate.score)}
                                  </div>
                                </TableCell>
                                <TableCell className="text-right">
                                  <div className="flex items-center justify-end space-x-2">
                                    {/* Reassign Dropdown */}
                                    <Select 
                                      onValueChange={(toInternshipId) => 
                                        handleReassignCandidate(internship.id, candidate.id, toInternshipId)
                                      }
                                    >
                                      <SelectTrigger className="w-10 h-8 p-0">
                                        <Plus className="h-4 w-4" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {internshipMatches
                                          .filter(i => i.id !== internship.id)
                                          .map(i => (
                                            <SelectItem key={i.id} value={i.id}>
                                              <div className="flex items-center space-x-2">
                                                <ArrowRight className="h-3 w-3" />
                                                <span>{i.company} - {i.position}</span>
                                              </div>
                                            </SelectItem>
                                          ))
                                        }
                                      </SelectContent>
                                    </Select>

                                    {/* Remove Button */}
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleRemoveCandidate(internship.id, candidate.id)}
                                      className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                                    >
                                      <X className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      ) : (
                        <div className="text-center py-8 text-muted-foreground">
                          <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                          <p>No candidates assigned to this internship</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="changes" className="space-y-4">
            <Card className="gov-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <History className="h-5 w-5" />
                  <span>Recent Changes</span>
                </CardTitle>
                <CardDescription>
                  Track all manual adjustments made to candidate assignments
                </CardDescription>
              </CardHeader>
              <CardContent>
                {changes.length > 0 ? (
                  <div className="space-y-3">
                    {changes.map((change, index) => (
                      <div key={index} className="flex items-center space-x-3 p-3 bg-blue-50 rounded border">
                        <AlertCircle className="h-4 w-4 text-blue-600" />
                        <span className="text-sm">{change}</span>
                        <Badge variant="outline" className="ml-auto">Pending</Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <History className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No recent changes to display</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="summary" className="space-y-4">
            <Card className="gov-card">
              <CardHeader>
                <CardTitle>Allocation Overview</CardTitle>
                <CardDescription>
                  Summary of current internship allocation status
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                      <div className="text-2xl font-bold text-green-900">{getTotalMatches()}</div>
                      <div className="text-sm text-green-700">Total Assignments</div>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                      <div className="text-2xl font-bold text-blue-900">{getTotalSlots()}</div>
                      <div className="text-sm text-blue-700">Available Positions</div>
                    </div>
                    <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                      <div className="text-2xl font-bold text-orange-900">{getTotalSlots() - getTotalMatches()}</div>
                      <div className="text-sm text-orange-700">Unfilled Positions</div>
                    </div>
                  </div>

                  <div className="border-t pt-6">
                    <div className="flex justify-end space-x-4">
                      <Button variant="outline" onClick={handleResetChanges} disabled={!hasChanges}>
                        Reset Changes
                      </Button>
                      <Button onClick={handleSaveChanges} disabled={!hasChanges}>
                        <Save className="h-4 w-4 mr-2" />
                        Save All Changes
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};