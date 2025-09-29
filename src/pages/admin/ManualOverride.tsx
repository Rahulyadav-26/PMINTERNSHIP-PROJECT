
import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
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
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
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
  Move,
  MoreHorizontal,
  Eye,
  UserCheck,
  UserX,
  AlertTriangle,
  Clock,
  TrendingUp,
  BarChart3,
  FileText,
  Download,
  Upload,
  RefreshCw,
  Undo,
  Redo,
  Star,
  Shield,
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  Award,
  Target,
  Zap,
  Activity,
  Calendar,
  Hash,
  Info,
  Settings,
  Loader2,
  CheckSquare,
  Square,
  ArrowUpDown,
  SortAsc,
  SortDesc,
  ExternalLink,
  Copy,
  Trash2,
  RotateCcw,
} from 'lucide-react';

interface Candidate {
  id: string;
  name: string;
  email: string;
  phone?: string;
  score: number;
  university: string;
  course: string;
  year: string;
  skills: string[];
  location: string;
  category: 'General' | 'SC' | 'ST' | 'OBC' | 'PWD';
  isRural: boolean;
  gpa: number;
  experience?: string;
  profileStrength: number;
  matchReason: string;
  conflictFlags: string[];
  lastModified: string;
}

interface InternshipMatch {
  id: string;
  company: string;
  position: string;
  location: string;
  domain: string;
  totalSlots: number;
  reservedSlots: {
    general: number;
    scSt: number;
    obc: number;
    pwd: number;
    rural: number;
  };
  matchedCandidates: Candidate[];
  requirements: string[];
  stipend: number;
  duration: string;
  applicationDeadline: string;
  priority: 'high' | 'medium' | 'low';
  conflictCount: number;
}

interface ChangeLog {
  id: string;
  timestamp: string;
  action: 'assign' | 'unassign' | 'reassign' | 'bulk_assign' | 'bulk_unassign';
  candidateName: string;
  candidateId: string;
  fromInternship?: string;
  toInternship: string;
  reason: string;
  userId: string;
  status: 'pending' | 'applied' | 'reverted';
}

interface ValidationResult {
  isValid: boolean;
  warnings: string[];
  errors: string[];
  quotaViolations: string[];
}

export const ManualOverrides: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedInternships, setSelectedInternships] = useState<string[]>([]);
  const [selectedCandidates, setSelectedCandidates] = useState<string[]>([]);
  const [hasChanges, setHasChanges] = useState(false);
  const [changes, setChanges] = useState<ChangeLog[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sortConfig, setSortConfig] = useState<{key: string; direction: 'asc' | 'desc'} | null>(null);
  const [showConflicts, setShowConflicts] = useState(false);
  const [showBulkDialog, setShowBulkDialog] = useState(false);
  const [bulkAction, setBulkAction] = useState<'assign' | 'unassign' | 'reassign'>('assign');
  const [bulkTargetInternship, setBulkTargetInternship] = useState('');
  const [bulkReason, setBulkReason] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [validation, setValidation] = useState<ValidationResult>({
    isValid: true,
    warnings: [],
    errors: [],
    quotaViolations: []
  });
  const [showValidationPanel, setShowValidationPanel] = useState(false);
  const [autoSave, setAutoSave] = useState(false);

  // Enhanced mock data for internship matches
  const [internshipMatches, setInternshipMatches] = useState<InternshipMatch[]>([
    {
      id: '1',
      company: 'Google India',
      position: 'Software Engineering Intern',
      location: 'Bangalore',
      domain: 'Technology',
      totalSlots: 50,
      reservedSlots: {
        general: 25,
        scSt: 8,
        obc: 13,
        pwd: 2,
        rural: 2
      },
      priority: 'high',
      stipend: 80000,
      duration: '3 months',
      applicationDeadline: '2025-03-15',
      requirements: ['React', 'JavaScript', 'Python', 'System Design'],
      conflictCount: 2,
      matchedCandidates: [
        {
          id: '1',
          name: 'Rahul Sharma',
          email: 'rahul.sharma@iit.ac.in',
          phone: '+91 98765 43210',
          score: 92,
          university: 'IIT Delhi',
          course: 'B.Tech CSE',
          year: '3rd',
          skills: ['React', 'Python', 'Machine Learning', 'System Design'],
          location: 'New Delhi',
          category: 'General',
          isRural: false,
          gpa: 9.2,
          experience: 'Internship at startup',
          profileStrength: 95,
          matchReason: 'Excellent skill match and academic performance',
          conflictFlags: [],
          lastModified: '2025-09-28T10:30:00Z'
        },
        {
          id: '2',
          name: 'Priya Patel',
          email: 'priya.patel@nit.ac.in',
          phone: '+91 87654 32109',
          score: 88,
          university: 'NIT Surat',
          course: 'B.Tech CSE',
          year: '4th',
          skills: ['JavaScript', 'Node.js', 'MongoDB', 'React'],
          location: 'Surat',
          category: 'OBC',
          isRural: true,
          gpa: 8.8,
          profileStrength: 90,
          matchReason: 'Strong technical skills and rural background',
          conflictFlags: ['Multiple applications'],
          lastModified: '2025-09-28T11:45:00Z'
        },
        {
          id: '3',
          name: 'Amit Kumar',
          email: 'amit.kumar@bits.ac.in',
          phone: '+91 76543 21098',
          score: 85,
          university: 'BITS Pilani',
          course: 'M.Tech AI',
          year: '1st',
          skills: ['Deep Learning', 'TensorFlow', 'Python'],
          location: 'Pilani',
          category: 'SC',
          isRural: false,
          gpa: 8.5,
          profileStrength: 88,
          matchReason: 'AI specialization aligns with company focus',
          conflictFlags: ['Score below threshold'],
          lastModified: '2025-09-28T09:15:00Z'
        }
      ]
    },
    {
      id: '2',
      company: 'Microsoft',
      position: 'AI Research Intern',
      location: 'Hyderabad',
      domain: 'Artificial Intelligence',
      totalSlots: 25,
      reservedSlots: {
        general: 12,
        scSt: 4,
        obc: 7,
        pwd: 1,
        rural: 1
      },
      priority: 'high',
      stipend: 90000,
      duration: '6 months',
      applicationDeadline: '2025-02-28',
      requirements: ['Machine Learning', 'Python', 'Research Experience'],
      conflictCount: 0,
      matchedCandidates: [
        {
          id: '4',
          name: 'Sneha Reddy',
          email: 'sneha.reddy@iisc.ac.in',
          score: 94,
          university: 'IISc Bangalore',
          course: 'M.Tech AI',
          year: '2nd',
          skills: ['Machine Learning', 'PyTorch', 'Computer Vision', 'Research'],
          location: 'Bangalore',
          category: 'General',
          isRural: false,
          gpa: 9.4,
          experience: 'Research publications',
          profileStrength: 98,
          matchReason: 'Outstanding research background and technical expertise',
          conflictFlags: [],
          lastModified: '2025-09-28T08:20:00Z'
        },
        {
          id: '5',
          name: 'Arjun Mehta',
          email: 'arjun.mehta@iitb.ac.in',
          score: 89,
          university: 'IIT Bombay',
          course: 'B.Tech CSE',
          year: '4th',
          skills: ['AI/ML', 'Python', 'Data Science', 'Statistics'],
          location: 'Mumbai',
          category: 'General',
          isRural: false,
          gpa: 8.9,
          profileStrength: 92,
          matchReason: 'Strong analytical skills and ML experience',
          conflictFlags: [],
          lastModified: '2025-09-28T12:00:00Z'
        }
      ]
    },
    {
      id: '3',
      company: 'Infosys',
      position: 'Digital Innovation Intern',
      location: 'Mumbai',
      domain: 'Consulting',
      totalSlots: 100,
      reservedSlots: {
        general: 50,
        scSt: 15,
        obc: 27,
        pwd: 4,
        rural: 4
      },
      priority: 'medium',
      stipend: 25000,
      duration: '4 months',
      applicationDeadline: '2025-04-01',
      requirements: ['Problem Solving', 'Communication', 'Business Analysis'],
      conflictCount: 1,
      matchedCandidates: [
        {
          id: '6',
          name: 'Kavya Singh',
          email: 'kavya.singh@dtu.ac.in',
          score: 82,
          university: 'DTU Delhi',
          course: 'B.Tech IT',
          year: '3rd',
          skills: ['Web Development', 'Angular', 'Spring Boot', 'Communication'],
          location: 'Delhi',
          category: 'General',
          isRural: false,
          gpa: 8.2,
          profileStrength: 85,
          matchReason: 'Well-rounded technical and communication skills',
          conflictFlags: ['Late application'],
          lastModified: '2025-09-28T13:30:00Z'
        }
      ]
    }
  ]);

  // Auto-save functionality
  useEffect(() => {
    if (autoSave && hasChanges) {
      const timer = setTimeout(() => {
        handleSaveChanges();
      }, 5000); // Auto-save after 5 seconds of inactivity

      return () => clearTimeout(timer);
    }
  }, [changes, autoSave, hasChanges]);

  // Real-time validation
  useEffect(() => {
    validateCurrentState();
  }, [internshipMatches]);

  const validateCurrentState = useCallback(() => {
    const warnings: string[] = [];
    const errors: string[] = [];
    const quotaViolations: string[] = [];

    internshipMatches.forEach(internship => {
      const categoryCount = {
        general: 0,
        scSt: 0,
        obc: 0,
        pwd: 0,
        rural: 0
      };

      internship.matchedCandidates.forEach(candidate => {
        if (candidate.category === 'SC' || candidate.category === 'ST') {
          categoryCount.scSt++;
        } else if (candidate.category === 'OBC') {
          categoryCount.obc++;
        } else if (candidate.category === 'PWD') {
          categoryCount.pwd++;
        } else {
          categoryCount.general++;
        }

        if (candidate.isRural) {
          categoryCount.rural++;
        }
      });

      // Check quota violations
      Object.entries(categoryCount).forEach(([category, count]) => {
        const reserved = internship.reservedSlots[category as keyof typeof internship.reservedSlots];
        if (count > reserved) {
          quotaViolations.push(
            `${internship.company}: ${category.toUpperCase()} quota exceeded (${count}/${reserved})`
          );
        }
      });

      // Check for conflicts
      const conflictCandidates = internship.matchedCandidates.filter(c => c.conflictFlags.length > 0);
      if (conflictCandidates.length > 0) {
        warnings.push(
          `${internship.company}: ${conflictCandidates.length} candidate(s) with conflicts`
        );
      }

      // Check for low scores
      const lowScoreCandidates = internship.matchedCandidates.filter(c => c.score < 70);
      if (lowScoreCandidates.length > 0) {
        warnings.push(
          `${internship.company}: ${lowScoreCandidates.length} candidate(s) with low scores`
        );
      }
    });

    setValidation({
      isValid: errors.length === 0 && quotaViolations.length === 0,
      warnings,
      errors,
      quotaViolations
    });
  }, [internshipMatches]);

  const filteredInternships = useMemo(() => {
    let filtered = internshipMatches.filter(internship =>
      internship.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      internship.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
      internship.location.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (selectedFilter === 'conflicts') {
      filtered = filtered.filter(i => i.conflictCount > 0);
    } else if (selectedFilter === 'priority') {
      filtered = filtered.filter(i => i.priority === 'high');
    } else if (selectedFilter === 'unfilled') {
      filtered = filtered.filter(i => i.matchedCandidates.length < i.totalSlots);
    }

    if (sortConfig) {
      filtered.sort((a, b) => {
        let aValue: any = a[sortConfig.key as keyof InternshipMatch];
        let bValue: any = b[sortConfig.key as keyof InternshipMatch];

        if (sortConfig.key === 'fillRate') {
          aValue = a.matchedCandidates.length / a.totalSlots;
          bValue = b.matchedCandidates.length / b.totalSlots;
        }

        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }, [internshipMatches, searchTerm, selectedFilter, sortConfig]);

  const handleSort = (key: string) => {
    setSortConfig(current => ({
      key,
      direction: current?.key === key && current.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleRemoveCandidate = (internshipId: string, candidateId: string, reason = 'Manual removal') => {
    const internship = internshipMatches.find(i => i.id === internshipId);
    const candidate = internship?.matchedCandidates.find(c => c.id === candidateId);

    if (!internship || !candidate) return;

    setInternshipMatches(prev => 
      prev.map(i => 
        i.id === internshipId 
          ? {
              ...i,
              matchedCandidates: i.matchedCandidates.filter(c => c.id !== candidateId)
            }
          : i
      )
    );

    const changeLog: ChangeLog = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      action: 'unassign',
      candidateName: candidate.name,
      candidateId: candidate.id,
      toInternship: `${internship.company} - ${internship.position}`,
      reason,
      userId: 'current_user',
      status: 'pending'
    };

    setChanges(prev => [...prev, changeLog]);
    setHasChanges(true);
  };

  const handleReassignCandidate = (fromInternshipId: string, candidateId: string, toInternshipId: string, reason = 'Manual reassignment') => {
    const fromInternship = internshipMatches.find(i => i.id === fromInternshipId);
    const toInternship = internshipMatches.find(i => i.id === toInternshipId);
    const candidate = fromInternship?.matchedCandidates.find(c => c.id === candidateId);

    if (!fromInternship || !toInternship || !candidate) return;

    // Check if target internship has space
    if (toInternship.matchedCandidates.length >= toInternship.totalSlots) {
      alert('Target internship is full');
      return;
    }

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
              matchedCandidates: [...internship.matchedCandidates, {
                ...candidate,
                lastModified: new Date().toISOString()
              }]
            }
          : internship
      )
    );

    const changeLog: ChangeLog = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      action: 'reassign',
      candidateName: candidate.name,
      candidateId: candidate.id,
      fromInternship: `${fromInternship.company} - ${fromInternship.position}`,
      toInternship: `${toInternship.company} - ${toInternship.position}`,
      reason,
      userId: 'current_user',
      status: 'pending'
    };

    setChanges(prev => [...prev, changeLog]);
    setHasChanges(true);
  };

  const handleBulkOperation = async () => {
    if (selectedCandidates.length === 0) return;

    setIsLoading(true);

    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1500));

    selectedCandidates.forEach(candidateId => {
      // Find candidate in any internship
      let foundCandidate: Candidate | undefined;
      let sourceInternshipId: string | undefined;

      for (const internship of internshipMatches) {
        const candidate = internship.matchedCandidates.find(c => c.id === candidateId);
        if (candidate) {
          foundCandidate = candidate;
          sourceInternshipId = internship.id;
          break;
        }
      }

      if (!foundCandidate || !sourceInternshipId) return;

      if (bulkAction === 'assign' && bulkTargetInternship) {
        handleReassignCandidate(sourceInternshipId, candidateId, bulkTargetInternship, bulkReason);
      } else if (bulkAction === 'unassign') {
        handleRemoveCandidate(sourceInternshipId, candidateId, bulkReason);
      }
    });

    setSelectedCandidates([]);
    setShowBulkDialog(false);
    setBulkReason('');
    setIsLoading(false);
  };

  const handleSaveChanges = async () => {
    setIsLoading(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Mark all changes as applied
    setChanges(prev => prev.map(c => ({ ...c, status: 'applied' as const })));
    setHasChanges(false);
    setIsLoading(false);
  };

  const handleResetChanges = () => {
    // In a real app, this would restore from the last saved state
    setChanges([]);
    setHasChanges(false);
    // Reset internship matches to original state would go here
  };

  const handleSelectAllCandidates = (internshipId: string) => {
    const internship = internshipMatches.find(i => i.id === internshipId);
    if (!internship) return;

    const candidateIds = internship.matchedCandidates.map(c => c.id);
    const allSelected = candidateIds.every(id => selectedCandidates.includes(id));

    if (allSelected) {
      setSelectedCandidates(prev => prev.filter(id => !candidateIds.includes(id)));
    } else {
      setSelectedCandidates(prev => [...prev, ...candidateIds.filter(id => !prev.includes(id))]);
    }
  };

  const getTotalMatches = () => {
    return internshipMatches.reduce((total, internship) => total + internship.matchedCandidates.length, 0);
  };

  const getTotalSlots = () => {
    return internshipMatches.reduce((total, internship) => total + internship.totalSlots, 0);
  };

  const getConflictCount = () => {
    return internshipMatches.reduce((total, internship) => 
      total + internship.matchedCandidates.filter(c => c.conflictFlags.length > 0).length, 0
    );
  };

  const getScoreBadge = (score: number) => {
    if (score >= 90) return <Badge className="bg-emerald-100 text-emerald-800">Excellent</Badge>;
    if (score >= 80) return <Badge className="bg-blue-100 text-blue-800">Good</Badge>;
    if (score >= 70) return <Badge className="bg-amber-100 text-amber-800">Average</Badge>;
    return <Badge className="bg-red-100 text-red-800">Below Average</Badge>;
  };

  const getCategoryBadge = (category: string) => {
    const colors = {
      'General': 'bg-slate-100 text-slate-800',
      'SC': 'bg-purple-100 text-purple-800',
      'ST': 'bg-purple-100 text-purple-800',
      'OBC': 'bg-orange-100 text-orange-800',
      'PWD': 'bg-blue-100 text-blue-800'
    };
    return <Badge className={colors[category as keyof typeof colors] || colors.General}>{category}</Badge>;
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Badge className="bg-red-100 text-red-800">High Priority</Badge>;
      case 'medium':
        return <Badge className="bg-yellow-100 text-yellow-800">Medium Priority</Badge>;
      case 'low':
        return <Badge className="bg-green-100 text-green-800">Low Priority</Badge>;
      default:
        return <Badge variant="outline">{priority}</Badge>;
    }
  };

  return (
    <DashboardLayout title="Manual Allocation Overrides">
      <div className="space-y-8">
        {/* Validation Panel */}
        {(!validation.isValid || validation.warnings.length > 0) && (
          <Alert className={`${!validation.isValid ? 'border-red-200 bg-red-50' : 'border-yellow-200 bg-yellow-50'}`}>
            {!validation.isValid ? (
              <AlertTriangle className="h-4 w-4 text-red-600" />
            ) : (
              <AlertCircle className="h-4 w-4 text-yellow-600" />
            )}
            <AlertDescription className={!validation.isValid ? 'text-red-800' : 'text-yellow-800'}>
              <div className="space-y-2">
                {validation.errors.length > 0 && (
                  <div>
                    <strong>Errors:</strong>
                    <ul className="list-disc list-inside mt-1">
                      {validation.errors.map((error, index) => (
                        <li key={index} className="text-sm">{error}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {validation.quotaViolations.length > 0 && (
                  <div>
                    <strong>Quota Violations:</strong>
                    <ul className="list-disc list-inside mt-1">
                      {validation.quotaViolations.map((violation, index) => (
                        <li key={index} className="text-sm">{violation}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {validation.warnings.length > 0 && (
                  <div>
                    <strong>Warnings:</strong>
                    <ul className="list-disc list-inside mt-1">
                      {validation.warnings.map((warning, index) => (
                        <li key={index} className="text-sm">{warning}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Changes Alert */}
        {hasChanges && (
          <Alert className="border-blue-200 bg-blue-50">
            <Info className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="font-medium">
                    You have {changes.filter(c => c.status === 'pending').length} unsaved change{changes.filter(c => c.status === 'pending').length !== 1 ? 's' : ''}
                  </span>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="auto-save"
                      checked={autoSave}
                      onCheckedChange={(checked) => setAutoSave(checked as boolean)}
                    />
                    <Label htmlFor="auto-save" className="text-sm">Auto-save</Label>
                  </div>
                </div>
                <div className="space-x-2">
                  <Button variant="outline" size="sm" onClick={handleResetChanges}>
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Reset
                  </Button>
                  <Button size="sm" onClick={handleSaveChanges} disabled={isLoading || !validation.isValid}>
                    {isLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                    Save Changes
                  </Button>
                </div>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-blue-500 to-blue-600">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold text-white">{internshipMatches.length}</p>
                  <p className="text-blue-100 text-sm">Active Internships</p>
                  <div className="flex items-center mt-2">
                    <Building className="h-4 w-4 text-blue-200 mr-1" />
                    <span className="text-blue-200 text-xs">{internshipMatches.filter(i => i.priority === 'high').length} high priority</span>
                  </div>
                </div>
                <Building className="h-12 w-12 text-blue-200" />
              </div>
              <div className="absolute -top-4 -right-4 w-16 h-16 bg-white/10 rounded-full" />
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-emerald-500 to-emerald-600">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold text-white">{getTotalMatches()}</p>
                  <p className="text-emerald-100 text-sm">Matched Candidates</p>
                  <div className="flex items-center mt-2">
                    <TrendingUp className="h-4 w-4 text-emerald-200 mr-1" />
                    <span className="text-emerald-200 text-xs">{Math.round((getTotalMatches()/getTotalSlots())*100)}% fill rate</span>
                  </div>
                </div>
                <Users className="h-12 w-12 text-emerald-200" />
              </div>
              <div className="absolute -top-4 -right-4 w-16 h-16 bg-white/10 rounded-full" />
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-orange-500 to-orange-600">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold text-white">{changes.filter(c => c.status === 'pending').length}</p>
                  <p className="text-orange-100 text-sm">Pending Changes</p>
                  <div className="flex items-center mt-2">
                    <Clock className="h-4 w-4 text-orange-200 mr-1" />
                    <span className="text-orange-200 text-xs">
                      {changes.filter(c => c.status === 'applied').length} applied
                    </span>
                  </div>
                </div>
                <Edit className="h-12 w-12 text-orange-200" />
              </div>
              <div className="absolute -top-4 -right-4 w-16 h-16 bg-white/10 rounded-full" />
            </CardContent>
          </Card>

          <Card className={`relative overflow-hidden border-0 shadow-lg ${
            getConflictCount() > 0 ? 'bg-gradient-to-br from-red-500 to-red-600' : 'bg-gradient-to-br from-green-500 to-green-600'
          }`}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold text-white">{getConflictCount()}</p>
                  <p className={`text-sm ${getConflictCount() > 0 ? 'text-red-100' : 'text-green-100'}`}>
                    Conflicts Detected
                  </p>
                  <div className="flex items-center mt-2">
                    {getConflictCount() > 0 ? (
                      <>
                        <AlertTriangle className="h-4 w-4 text-red-200 mr-1" />
                        <span className="text-red-200 text-xs">Needs attention</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-4 w-4 text-green-200 mr-1" />
                        <span className="text-green-200 text-xs">All clear</span>
                      </>
                    )}
                  </div>
                </div>
                {getConflictCount() > 0 ? (
                  <AlertTriangle className="h-12 w-12 text-red-200" />
                ) : (
                  <CheckCircle className="h-12 w-12 text-green-200" />
                )}
              </div>
              <div className="absolute -top-4 -right-4 w-16 h-16 bg-white/10 rounded-full" />
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions Bar */}
        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex flex-wrap gap-4 items-center justify-between">
              <div className="flex items-center space-x-4">
                <h3 className="text-lg font-semibold text-slate-800">Quick Actions</h3>
                <Badge variant="outline" className="flex items-center space-x-1">
                  <Activity className="h-3 w-3" />
                  <span>{selectedCandidates.length} selected</span>
                </Badge>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button 
                  variant="outline" 
                  onClick={() => setShowBulkDialog(true)}
                  disabled={selectedCandidates.length === 0}
                >
                  <Users className="h-4 w-4 mr-2" />
                  Bulk Actions
                </Button>
                <Button variant="outline" onClick={() => setShowConflicts(!showConflicts)}>
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  {showConflicts ? 'Hide' : 'Show'} Conflicts
                </Button>
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export Data
                </Button>
                <Button variant="outline">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <Tabs defaultValue="overrides" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 h-12 p-1 bg-slate-100">
            <TabsTrigger value="overrides" className="text-base font-semibold">Manual Overrides</TabsTrigger>
            <TabsTrigger value="analytics" className="text-base font-semibold">Analytics</TabsTrigger>
            <TabsTrigger value="changes" className="text-base font-semibold">Change History</TabsTrigger>
            <TabsTrigger value="summary" className="text-base font-semibold">Summary</TabsTrigger>
          </TabsList>

          <TabsContent value="overrides" className="space-y-6">
            <Card className="border-0 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0">
                  <div>
                    <CardTitle className="flex items-center space-x-2">
                      <Edit className="h-5 w-5 text-blue-600" />
                      <span>Internship Allocation Management</span>
                    </CardTitle>
                    <CardDescription>
                      Fine-tune candidate assignments with advanced override capabilities
                    </CardDescription>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input
                        placeholder="Search internships..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 w-64"
                      />
                    </div>
                    <Select value={selectedFilter} onValueChange={setSelectedFilter}>
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="Filter" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Internships</SelectItem>
                        <SelectItem value="conflicts">With Conflicts</SelectItem>
                        <SelectItem value="priority">High Priority</SelectItem>
                        <SelectItem value="unfilled">Unfilled Positions</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="outline" onClick={() => handleSort('company')}>
                      <ArrowUpDown className="h-4 w-4 mr-2" />
                      Sort
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-8">
                <div className="space-y-8">
                  {filteredInternships.map((internship) => (
                    <div key={internship.id} className="border-2 rounded-lg bg-gradient-to-r from-slate-50 to-blue-50 border-slate-200">
                      {/* Enhanced Internship Header */}
                      <div className="p-6 border-b bg-white rounded-t-lg">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-4">
                            <div>
                              <h3 className="text-xl font-bold text-slate-900 flex items-center space-x-2">
                                <span>{internship.company}</span>
                                {internship.conflictCount > 0 && (
                                  <AlertTriangle className="h-5 w-5 text-red-500" />
                                )}
                              </h3>
                              <p className="text-slate-600 font-medium">{internship.position}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3">
                            {getPriorityBadge(internship.priority)}
                            <Badge className="bg-blue-100 text-blue-800">
                              <MapPin className="h-3 w-3 mr-1" />
                              {internship.location}
                            </Badge>
                            <Badge variant="outline">
                              {internship.matchedCandidates.length}/{internship.totalSlots} filled
                            </Badge>
                            <div className="flex items-center space-x-1">
                              <Checkbox
                                checked={internship.matchedCandidates.every(c => selectedCandidates.includes(c.id))}
                                onCheckedChange={() => handleSelectAllCandidates(internship.id)}
                              />
                              <Label className="text-sm">All</Label>
                            </div>
                          </div>
                        </div>

                        {/* Internship Details */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-slate-50 rounded-lg">
                          <div className="flex items-center space-x-2">
                            <Award className="h-4 w-4 text-emerald-600" />
                            <span className="text-sm">₹{internship.stipend.toLocaleString()}/month</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Clock className="h-4 w-4 text-blue-600" />
                            <span className="text-sm">{internship.duration}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-4 w-4 text-purple-600" />
                            <span className="text-sm">Due: {internship.applicationDeadline}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Target className="h-4 w-4 text-orange-600" />
                            <span className="text-sm">{internship.domain}</span>
                          </div>
                        </div>

                        {/* Requirements */}
                        <div className="mt-4">
                          <Label className="text-sm font-medium text-slate-700 mb-2 block">Requirements:</Label>
                          <div className="flex flex-wrap gap-2">
                            {internship.requirements.map((req, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {req}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        {/* Quota Information */}
                        <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                          <Label className="text-sm font-medium text-blue-900 mb-2 block">Reserved Slots:</Label>
                          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-xs">
                            {Object.entries(internship.reservedSlots).map(([category, count]) => (
                              <div key={category} className="text-center">
                                <div className="font-bold text-blue-800">{count}</div>
                                <div className="text-blue-600 capitalize">{category}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Enhanced Candidates Table */}
                      <div className="p-6">
                        {internship.matchedCandidates.length > 0 ? (
                          <div className="overflow-x-auto">
                            <Table>
                              <TableHeader>
                                <TableRow className="bg-slate-50">
                                  <TableHead className="w-12">
                                    <Checkbox
                                      checked={internship.matchedCandidates.every(c => selectedCandidates.includes(c.id))}
                                      onCheckedChange={() => handleSelectAllCandidates(internship.id)}
                                    />
                                  </TableHead>
                                  <TableHead className="font-semibold">Candidate Details</TableHead>
                                  <TableHead className="font-semibold">Academic Info</TableHead>
                                  <TableHead className="font-semibold">Skills & Category</TableHead>
                                  <TableHead className="font-semibold">Performance</TableHead>
                                  <TableHead className="font-semibold">Status</TableHead>
                                  <TableHead className="font-semibold text-right">Actions</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {internship.matchedCandidates.map((candidate) => (
                                  <TableRow 
                                    key={candidate.id}
                                    className={`hover:bg-slate-50 transition-colors ${
                                      candidate.conflictFlags.length > 0 ? 'bg-red-50 border-l-4 border-red-400' : ''
                                    }`}
                                  >
                                    <TableCell>
                                      <Checkbox
                                        checked={selectedCandidates.includes(candidate.id)}
                                        onCheckedChange={(checked) => {
                                          if (checked) {
                                            setSelectedCandidates(prev => [...prev, candidate.id]);
                                          } else {
                                            setSelectedCandidates(prev => prev.filter(id => id !== candidate.id));
                                          }
                                        }}
                                      />
                                    </TableCell>
                                    <TableCell>
                                      <div className="space-y-1">
                                        <div className="font-semibold text-slate-900 flex items-center space-x-2">
                                          <span>{candidate.name}</span>
                                          {candidate.conflictFlags.length > 0 && (
                                            <TooltipProvider>
                                              <Tooltip>
                                                <TooltipTrigger>
                                                  <AlertTriangle className="h-4 w-4 text-red-500" />
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                  <div className="text-xs">
                                                    Conflicts: {candidate.conflictFlags.join(', ')}
                                                  </div>
                                                </TooltipContent>
                                              </Tooltip>
                                            </TooltipProvider>
                                          )}
                                        </div>
                                        <div className="text-sm text-slate-500 flex items-center space-x-1">
                                          <Mail className="h-3 w-3" />
                                          <span>{candidate.email}</span>
                                        </div>
                                        {candidate.phone && (
                                          <div className="text-sm text-slate-500 flex items-center space-x-1">
                                            <Phone className="h-3 w-3" />
                                            <span>{candidate.phone}</span>
                                          </div>
                                        )}
                                        <div className="text-sm text-slate-500 flex items-center space-x-1">
                                          <MapPin className="h-3 w-3" />
                                          <span>{candidate.location}</span>
                                          {candidate.isRural && (
                                            <Badge className="bg-green-100 text-green-800 text-xs">Rural</Badge>
                                          )}
                                        </div>
                                      </div>
                                    </TableCell>
                                    <TableCell>
                                      <div className="space-y-1">
                                        <div className="font-medium text-slate-800">{candidate.university}</div>
                                        <div className="text-sm text-slate-600 flex items-center space-x-1">
                                          <GraduationCap className="h-3 w-3" />
                                          <span>{candidate.course} - {candidate.year}</span>
                                        </div>
                                        <div className="text-sm text-slate-600">
                                          GPA: <span className="font-medium">{candidate.gpa}</span>
                                        </div>
                                        {candidate.experience && (
                                          <div className="text-xs text-slate-500">{candidate.experience}</div>
                                        )}
                                      </div>
                                    </TableCell>
                                    <TableCell>
                                      <div className="space-y-2">
                                        <div className="flex flex-wrap gap-1">
                                          {candidate.skills.slice(0, 3).map((skill, index) => (
                                            <Badge key={index} variant="outline" className="text-xs">
                                              {skill}
                                            </Badge>
                                          ))}
                                          {candidate.skills.length > 3 && (
                                            <Badge variant="outline" className="text-xs">
                                              +{candidate.skills.length - 3}
                                            </Badge>
                                          )}
                                        </div>
                                        <div className="flex items-center space-x-2">
                                          {getCategoryBadge(candidate.category)}
                                        </div>
                                      </div>
                                    </TableCell>
                                    <TableCell>
                                      <div className="space-y-2">
                                        <div className="flex items-center space-x-2">
                                          <span className="text-lg font-bold text-slate-800">{candidate.score}</span>
                                          {getScoreBadge(candidate.score)}
                                        </div>
                                        <div className="text-xs text-slate-600">
                                          Profile: {candidate.profileStrength}%
                                        </div>
                                        <Progress value={candidate.profileStrength} className="h-2" />
                                      </div>
                                    </TableCell>
                                    <TableCell>
                                      <div className="space-y-1">
                                        <div className="text-xs text-slate-500">
                                          Modified: {new Date(candidate.lastModified).toLocaleDateString()}
                                        </div>
                                        <div className="text-xs text-slate-600 italic">
                                          {candidate.matchReason}
                                        </div>
                                      </div>
                                    </TableCell>
                                    <TableCell className="text-right">
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
                                            <Mail className="mr-2 h-4 w-4" />
                                            Send Email
                                          </DropdownMenuItem>
                                          <DropdownMenuItem>
                                            <Move className="mr-2 h-4 w-4" />
                                            Reassign
                                          </DropdownMenuItem>
                                          <DropdownMenuItem 
                                            className="text-red-600"
                                            onClick={() => handleRemoveCandidate(internship.id, candidate.id)}
                                          >
                                            <UserX className="mr-2 h-4 w-4" />
                                            Remove
                                          </DropdownMenuItem>
                                        </DropdownMenuContent>
                                      </DropdownMenu>
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>
                        ) : (
                          <div className="text-center py-12">
                            <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-gray-700 mb-2">No Candidates Assigned</h3>
                            <p className="text-gray-500 mb-4">This internship currently has no matched candidates.</p>
                            <Button variant="outline">
                              <Plus className="h-4 w-4 mr-2" />
                              Add Candidates
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <Card className="border-0 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 border-b">
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5 text-indigo-600" />
                  <span>Allocation Analytics</span>
                </CardTitle>
                <CardDescription>
                  Comprehensive analysis of allocation patterns and performance
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8">
                <div className="space-y-8">
                  {/* Key Metrics */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                      <div className="text-3xl font-bold text-blue-900 mb-2">{Math.round((getTotalMatches()/getTotalSlots())*100)}%</div>
                      <div className="text-sm text-blue-700">Overall Fill Rate</div>
                      <Progress value={(getTotalMatches()/getTotalSlots())*100} className="mt-2 h-2" />
                    </div>

                    <div className="bg-emerald-50 p-6 rounded-lg border border-emerald-200">
                      <div className="text-3xl font-bold text-emerald-900 mb-2">
                        {Math.round(internshipMatches.reduce((sum, i) => sum + i.matchedCandidates.reduce((s, c) => s + c.score, 0), 0) / getTotalMatches())}
                      </div>
                      <div className="text-sm text-emerald-700">Average Match Score</div>
                      <div className="text-xs text-emerald-600 mt-1">Quality indicator</div>
                    </div>

                    <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
                      <div className="text-3xl font-bold text-purple-900 mb-2">
                        {internshipMatches.filter(i => i.priority === 'high').length}
                      </div>
                      <div className="text-sm text-purple-700">High Priority Internships</div>
                      <div className="text-xs text-purple-600 mt-1">Need immediate attention</div>
                    </div>

                    <div className="bg-orange-50 p-6 rounded-lg border border-orange-200">
                      <div className="text-3xl font-bold text-orange-900 mb-2">
                        {Math.round((changes.filter(c => c.status === 'applied').length / Math.max(changes.length, 1)) * 100)}%
                      </div>
                      <div className="text-sm text-orange-700">Changes Applied</div>
                      <div className="text-xs text-orange-600 mt-1">Override success rate</div>
                    </div>
                  </div>

                  {/* Category Distribution */}
                  <div className="bg-slate-50 p-6 rounded-lg border">
                    <h4 className="font-semibold text-slate-900 mb-6 flex items-center space-x-2">
                      <Shield className="h-5 w-5" />
                      <span>Category-wise Allocation Distribution</span>
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                      {['General', 'SC', 'ST', 'OBC', 'PWD'].map(category => {
                        const count = internshipMatches.reduce((total, i) => 
                          total + i.matchedCandidates.filter(c => 
                            c.category === category || (category === 'ST' && c.category === 'ST')
                          ).length, 0
                        );
                        const percentage = Math.round((count / getTotalMatches()) * 100);

                        return (
                          <div key={category} className="bg-white p-4 rounded-lg border text-center">
                            <div className="text-2xl font-bold text-slate-800">{count}</div>
                            <div className="text-sm text-slate-600">{category}</div>
                            <div className="text-xs text-slate-500">{percentage}%</div>
                            <Progress value={percentage} className="mt-2 h-2" />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="changes" className="space-y-6">
            <Card className="border-0 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 border-b">
                <CardTitle className="flex items-center space-x-2">
                  <History className="h-5 w-5 text-purple-600" />
                  <span>Change History & Audit Trail</span>
                </CardTitle>
                <CardDescription>
                  Track all manual adjustments and system modifications
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8">
                {changes.length > 0 ? (
                  <div className="space-y-4">
                    {changes.map((change) => (
                      <div key={change.id} className={`p-4 rounded-lg border-l-4 ${
                        change.status === 'applied' ? 'bg-green-50 border-green-400' :
                        change.status === 'reverted' ? 'bg-red-50 border-red-400' :
                        'bg-blue-50 border-blue-400'
                      }`}>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-3">
                            {change.action === 'assign' && <UserCheck className="h-5 w-5 text-green-600" />}
                            {change.action === 'unassign' && <UserX className="h-5 w-5 text-red-600" />}
                            {change.action === 'reassign' && <Move className="h-5 w-5 text-blue-600" />}
                            <div>
                              <div className="font-medium text-slate-800">
                                {change.action === 'assign' && 'Candidate Assigned'}
                                {change.action === 'unassign' && 'Candidate Removed'}
                                {change.action === 'reassign' && 'Candidate Reassigned'}
                              </div>
                              <div className="text-sm text-slate-600">
                                {change.candidateName}
                                {change.fromInternship && ` from ${change.fromInternship}`}
                                {change.toInternship && ` to ${change.toInternship}`}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3">
                            <Badge variant={
                              change.status === 'applied' ? 'default' :
                              change.status === 'reverted' ? 'destructive' : 'secondary'
                            }>
                              {change.status}
                            </Badge>
                            <span className="text-xs text-slate-500">
                              {new Date(change.timestamp).toLocaleString()}
                            </span>
                          </div>
                        </div>
                        {change.reason && (
                          <div className="text-sm text-slate-600 italic">
                            Reason: {change.reason}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <History className="h-16 w-16 text-gray-400 mx-auto mb-6" />
                    <h3 className="text-xl font-semibold text-gray-700 mb-3">No Changes Recorded</h3>
                    <p className="text-gray-500">
                      All manual adjustments and modifications will appear here with full audit trails.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="summary" className="space-y-6">
            <Card className="border-0 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-slate-50 to-gray-50 border-b">
                <CardTitle>Allocation Summary & Overview</CardTitle>
                <CardDescription>
                  Comprehensive view of current allocation status and system health
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8">
                <div className="space-y-8">
                  {/* Summary Statistics */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                      <div className="text-3xl font-bold text-green-900 mb-2">{getTotalMatches()}</div>
                      <div className="text-sm text-green-700">Total Assignments</div>
                      <div className="text-xs text-green-600 mt-1">Across all internships</div>
                    </div>
                    <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                      <div className="text-3xl font-bold text-blue-900 mb-2">{getTotalSlots()}</div>
                      <div className="text-sm text-blue-700">Available Positions</div>
                      <div className="text-xs text-blue-600 mt-1">Total capacity</div>
                    </div>
                    <div className="bg-orange-50 p-6 rounded-lg border border-orange-200">
                      <div className="text-3xl font-bold text-orange-900 mb-2">{getTotalSlots() - getTotalMatches()}</div>
                      <div className="text-sm text-orange-700">Unfilled Positions</div>
                      <div className="text-xs text-orange-600 mt-1">Remaining slots</div>
                    </div>
                  </div>

                  {/* System Status */}
                  <div className="bg-slate-50 p-6 rounded-lg border">
                    <h4 className="font-semibold text-slate-900 mb-4 flex items-center space-x-2">
                      <Activity className="h-5 w-5" />
                      <span>System Status</span>
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className={`p-4 rounded-lg border ${
                        validation.isValid ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                      }`}>
                        <div className="flex items-center space-x-2 mb-2">
                          {validation.isValid ? (
                            <CheckCircle className="h-5 w-5 text-green-600" />
                          ) : (
                            <AlertTriangle className="h-5 w-5 text-red-600" />
                          )}
                          <span className={`font-medium ${
                            validation.isValid ? 'text-green-900' : 'text-red-900'
                          }`}>
                            Validation Status
                          </span>
                        </div>
                        <div className={`text-sm ${
                          validation.isValid ? 'text-green-700' : 'text-red-700'
                        }`}>
                          {validation.isValid ? 'All validations passed' : `${validation.errors.length + validation.quotaViolations.length} issues detected`}
                        </div>
                      </div>

                      <div className={`p-4 rounded-lg border ${
                        hasChanges ? 'bg-orange-50 border-orange-200' : 'bg-green-50 border-green-200'
                      }`}>
                        <div className="flex items-center space-x-2 mb-2">
                          {hasChanges ? (
                            <Clock className="h-5 w-5 text-orange-600" />
                          ) : (
                            <CheckCircle className="h-5 w-5 text-green-600" />
                          )}
                          <span className={`font-medium ${
                            hasChanges ? 'text-orange-900' : 'text-green-900'
                          }`}>
                            Changes Status
                          </span>
                        </div>
                        <div className={`text-sm ${
                          hasChanges ? 'text-orange-700' : 'text-green-700'
                        }`}>
                          {hasChanges ? `${changes.filter(c => c.status === 'pending').length} pending changes` : 'All changes saved'}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Center */}
                  <div className="border-t pt-6">
                    <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
                      <div className="text-sm text-slate-600">
                        Last updated: {new Date().toLocaleString()}
                      </div>
                      <div className="flex space-x-4">
                        <Button variant="outline" onClick={handleResetChanges} disabled={!hasChanges}>
                          <RotateCcw className="h-4 w-4 mr-2" />
                          Reset All Changes
                        </Button>
                        <Button 
                          onClick={handleSaveChanges} 
                          disabled={!hasChanges || isLoading || !validation.isValid}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          {isLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                          Save All Changes
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Bulk Actions Dialog */}
        <Dialog open={showBulkDialog} onOpenChange={setShowBulkDialog}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
                <Users className="h-5 w-5" />
                <span>Bulk Actions</span>
              </DialogTitle>
              <DialogDescription>
                Perform actions on {selectedCandidates.length} selected candidate{selectedCandidates.length !== 1 ? 's' : ''}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="bulk-action">Action</Label>
                <Select value={bulkAction} onValueChange={(value: any) => setBulkAction(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="reassign">Reassign to Internship</SelectItem>
                    <SelectItem value="unassign">Remove from All</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {bulkAction === 'reassign' && (
                <div>
                  <Label htmlFor="target-internship">Target Internship</Label>
                  <Select value={bulkTargetInternship} onValueChange={setBulkTargetInternship}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select internship" />
                    </SelectTrigger>
                    <SelectContent>
                      {internshipMatches.map(internship => (
                        <SelectItem key={internship.id} value={internship.id}>
                          {internship.company} - {internship.position}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div>
                <Label htmlFor="bulk-reason">Reason</Label>
                <Textarea
                  id="bulk-reason"
                  placeholder="Enter reason for this action..."
                  value={bulkReason}
                  onChange={(e) => setBulkReason(e.target.value)}
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowBulkDialog(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleBulkOperation}
                disabled={isLoading || (bulkAction === 'reassign' && !bulkTargetInternship)}
              >
                {isLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Zap className="h-4 w-4 mr-2" />}
                Apply Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};
