import React, { useState, useMemo } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { 
  Award, CheckCircle2, Clock, AlertTriangle, Users, Building2, MapPin,
  TrendingUp, Target, Zap, Star, BarChart3, Calendar, Download,
  ThumbsUp, ThumbsDown, Eye, Share2, Filter, Search, FileText,
  Trophy, Briefcase, Activity, Globe, ChevronRight, ExternalLink,
  MessageSquare, Bell, BookOpen, Settings
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Mock allocation data
const MOCK_ALLOCATIONS = [
  {
    id: '1',
    studentName: 'Arjun Patel',
    studentId: '0201EC231008',
    internshipTitle: 'Full Stack Developer Intern',
    organization: 'Tech Innovations Pvt Ltd',
    location: 'Bangalore, Karnataka',
    duration: '6 months',
    stipend: '25000',
    matchScore: 95,
    status: 'allocated',
    allocationDate: '2024-09-25',
    responseDeadline: '2024-10-05',
    preferences: [1, 2, 3],
    allocatedPreference: 1,
    sector: 'Information Technology',
    modality: 'Hybrid'
  },
  {
    id: '2',
    studentName: 'Priya Sharma',
    studentId: '0201CS231045',
    internshipTitle: 'Data Science Intern',
    organization: 'Analytics Hub Solutions',
    location: 'Pune, Maharashtra',
    duration: '4 months',
    stipend: '22000',
    matchScore: 88,
    status: 'accepted',
    allocationDate: '2024-09-25',
    responseDeadline: '2024-10-05',
    preferences: [2, 1, 4],
    allocatedPreference: 2,
    sector: 'Data Analytics',
    modality: 'Remote'
  },
  {
    id: '3',
    studentName: 'Rohit Kumar',
    studentId: '0201ME231067',
    internshipTitle: 'Mechanical Design Engineer',
    organization: 'Engineering Solutions Ltd',
    location: 'Chennai, Tamil Nadu',
    duration: '5 months',
    stipend: '18000',
    matchScore: 82,
    status: 'pending',
    allocationDate: '2024-09-25',
    responseDeadline: '2024-10-05',
    preferences: [3, 2, 1],
    allocatedPreference: 3,
    sector: 'Engineering',
    modality: 'On-site'
  },
  {
    id: '4',
    studentName: 'Sneha Reddy',
    studentId: '0201EC231089',
    internshipTitle: 'Product Manager Intern',
    organization: 'StartupTech Innovations',
    location: 'Hyderabad, Telangana',
    duration: '6 months',
    stipend: '30000',
    matchScore: 91,
    status: 'declined',
    allocationDate: '2024-09-25',
    responseDeadline: '2024-10-05',
    preferences: [1, 3, 2],
    allocatedPreference: 1,
    sector: 'Product Management',
    modality: 'Hybrid'
  }
];

const statusConfig = {
  allocated: { 
    color: 'bg-blue-50 text-blue-700 border-blue-200', 
    icon: Clock,
    label: 'Allocated',
    description: 'Waiting for student response'
  },
  accepted: { 
    color: 'bg-green-50 text-green-700 border-green-200', 
    icon: CheckCircle2,
    label: 'Accepted',
    description: 'Student accepted the allocation'
  },
  declined: { 
    color: 'bg-red-50 text-red-700 border-red-200', 
    icon: ThumbsDown,
    label: 'Declined',
    description: 'Student declined the allocation'
  },
  pending: { 
    color: 'bg-amber-50 text-amber-700 border-amber-200', 
    icon: AlertTriangle,
    label: 'Pending Review',
    description: 'Under administrative review'
  }
};

// Analytics Panel Component
function AnalyticsPanel({ allocations }: { allocations: any[] }) {
  const stats = useMemo(() => {
    const total = allocations.length;
    const allocated = allocations.filter(a => a.status === 'allocated').length;
    const accepted = allocations.filter(a => a.status === 'accepted').length;
    const avgMatchScore = total > 0 ? 
      Math.round(allocations.reduce((sum, a) => sum + a.matchScore, 0) / total) : 0;
    const acceptanceRate = total > 0 ? Math.round((accepted / total) * 100) : 0;

    return [
      { 
        label: 'Total Allocations', 
        value: total, 
        icon: Briefcase,
        description: 'Students allocated'
      },
      { 
        label: 'Acceptance Rate', 
        value: acceptanceRate, 
        icon: TrendingUp,
        suffix: '%',
        description: 'Students accepted'
      },
      { 
        label: 'Avg Match Score', 
        value: avgMatchScore, 
        icon: Target,
        suffix: '%',
        description: 'Algorithm accuracy'
      },
      { 
        label: 'Pending Responses', 
        value: allocated, 
        icon: Clock,
        description: 'Awaiting student action'
      }
    ];
  }, [allocations]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:shadow-lg transition-all duration-300">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-600 font-medium">{stat.label}</p>
                  <p className="text-2xl font-bold text-blue-900">
                    {stat.value}{stat.suffix || ''}
                  </p>
                </div>
                <div className="p-2 bg-blue-200 rounded-lg">
                  <stat.icon className="w-6 h-6 text-blue-700" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}

// Allocation Card Component
function AllocationCard({ allocation, onViewDetails, onAccept, onDecline }: any) {
  const statusInfo = statusConfig[allocation.status as keyof typeof statusConfig];
  const StatusIcon = statusInfo?.icon || Clock;
  
  const getPreferenceColor = (allocatedPref: number) => {
    if (allocatedPref === 1) return 'text-green-600 bg-green-50 border-green-200';
    if (allocatedPref === 2) return 'text-amber-600 bg-amber-50 border-amber-200';
    return 'text-orange-600 bg-orange-50 border-orange-200';
  };

  const daysRemaining = () => {
    const deadline = new Date(allocation.responseDeadline);
    const today = new Date();
    const diffTime = deadline.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="group hover:shadow-lg transition-all duration-300 border-l-4 border-l-blue-500 relative overflow-hidden">
        {allocation.status === 'allocated' && (
          <div className="absolute top-0 right-0 bg-gradient-to-l from-blue-500 to-blue-400 text-white px-3 py-1 text-xs font-bold">
            ACTION REQUIRED
          </div>
        )}

        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <CardTitle className="flex items-center gap-2 text-lg group-hover:text-primary transition-colors">
                <Building2 className="w-4 h-4 text-muted-foreground" />
                {allocation.internshipTitle}
                <Badge variant="secondary" className="text-xs">
                  <Zap className="w-3 h-3 mr-1" />
                  {allocation.matchScore}% Match
                </Badge>
              </CardTitle>
              
              <CardDescription className="flex items-center gap-2 mt-1">
                <span className="font-medium">{allocation.organization}</span>
                <span>•</span>
                <span>{allocation.sector}</span>
                <span>•</span>
                <Badge variant="outline" className="text-xs">
                  <MapPin className="w-3 h-3 mr-1" />
                  {allocation.modality}
                </Badge>
              </CardDescription>

              <div className="flex items-center gap-2 mt-3">
                <Badge className={statusInfo?.color}>
                  <StatusIcon className="w-3 h-3 mr-1" />
                  {statusInfo?.label}
                </Badge>
                
                <Badge className={`text-xs border ${getPreferenceColor(allocation.allocatedPreference)}`}>
                  Preference #{allocation.allocatedPreference}
                </Badge>
                
                {allocation.status === 'allocated' && (
                  <Badge className="text-xs bg-amber-50 text-amber-700 border-amber-200">
                    <Calendar className="w-3 h-3 mr-1" />
                    {daysRemaining()} days left
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          {/* Student Info */}
          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-blue-500 text-white text-sm">
                  {allocation.studentName.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium text-sm">{allocation.studentName}</p>
                <p className="text-xs text-gray-600">{allocation.studentId}</p>
              </div>
            </div>
          </div>

          {/* Key Info */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 p-3 bg-muted/30 rounded-lg">
            <div className="text-center">
              <div className="text-xs text-muted-foreground">Duration</div>
              <div className="font-medium text-sm">{allocation.duration}</div>
            </div>
            <div className="text-center">
              <div className="text-xs text-muted-foreground">Stipend</div>
              <div className="font-medium text-sm">₹{allocation.stipend}</div>
            </div>
            <div className="text-center">
              <div className="text-xs text-muted-foreground">Location</div>
              <div className="font-medium text-sm">{allocation.location.split(',')[0]}</div>
            </div>
            <div className="text-center">
              <div className="text-xs text-muted-foreference">Match Score</div>
              <div className="font-medium text-sm">{allocation.matchScore}%</div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={() => onViewDetails(allocation)} className="flex-1 min-w-fit">
              <Eye className="w-4 h-4 mr-2" />
              View Details
            </Button>
            
            {allocation.status === 'allocated' && (
              <>
                <Button onClick={() => onAccept(allocation)} className="flex-1 min-w-fit">
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Accept
                </Button>
                <Button variant="destructive" onClick={() => onDecline(allocation)} className="flex-1 min-w-fit">
                  <ThumbsDown className="w-4 h-4 mr-2" />
                  Decline
                </Button>
              </>
            )}
            
            {allocation.status === 'accepted' && (
              <Button variant="outline" className="flex-1 min-w-fit">
                <MessageSquare className="w-4 h-4 mr-2" />
                Contact Mentor
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export const AllocationResults: React.FC = () => {
  const [allocations] = useState(MOCK_ALLOCATIONS);
  const [q, setQ] = useState('');
  const [status, setStatus] = useState<'all' | string>('all');
  const [sort, setSort] = useState<'recent' | 'match' | 'preference' | 'deadline'>('recent');
  const [detailsId, setDetailsId] = useState<string | null>(null);
  const [view, setView] = useState<'grid' | 'list'>('grid');

  const filteredAndSorted = useMemo(() => {
    let filtered = allocations.filter(allocation => {
      if (status !== 'all' && allocation.status !== status) return false;
      if (q) {
        const searchText = `${allocation.studentName} ${allocation.internshipTitle} ${allocation.organization}`.toLowerCase();
        if (!searchText.includes(q.toLowerCase())) return false;
      }
      return true;
    });

    return filtered.sort((a, b) => {
      if (sort === 'recent') return new Date(b.allocationDate).getTime() - new Date(a.allocationDate).getTime();
      if (sort === 'match') return b.matchScore - a.matchScore;
      if (sort === 'preference') return a.allocatedPreference - b.allocatedPreference;
      if (sort === 'deadline') return new Date(a.responseDeadline).getTime() - new Date(b.responseDeadline).getTime();
      return 0;
    });
  }, [allocations, q, status, sort]);

  const handleAccept = (allocation: any) => {
    console.log('Accepting allocation:', allocation.id);
    // Handle accept logic
  };

  const handleDecline = (allocation: any) => {
    console.log('Declining allocation:', allocation.id);
    // Handle decline logic
  };

  return (
    <DashboardLayout title="Allocation Results">
      <div className="space-y-6">
        {/* Analytics Overview */}
        <AnalyticsPanel allocations={allocations} />

        {/* Enhanced Controls */}
        <Card className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input 
                  placeholder="Search by student name, internship, or organization..." 
                  value={q} 
                  onChange={e => setQ(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  {Object.entries(statusConfig).map(([key, config]) => (
                    <SelectItem key={key} value={key}>
                      <div className="flex items-center gap-2">
                        <config.icon className="w-4 h-4" />
                        {config.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={sort} onValueChange={(v: any) => setSort(v)}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">Most Recent</SelectItem>
                  <SelectItem value="match">Best Match</SelectItem>
                  <SelectItem value="preference">By Preference</SelectItem>
                  <SelectItem value="deadline">By Deadline</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex items-center border rounded-lg">
                <Button
                  variant={view === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setView('grid')}
                >
                  <BarChart3 className="w-4 h-4" />
                </Button>
                <Button
                  variant={view === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setView('list')}
                >
                  <FileText className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Allocation Results */}
        {!allocations.length ? (
          <Card className="p-12 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
                <Trophy className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No Allocation Results</h3>
              <p className="text-muted-foreground mb-4">
                Allocation results will appear here once the matching process is completed.
              </p>
              <Button>
                <Activity className="w-4 h-4 mr-2" />
                Check Status
              </Button>
            </div>
          </Card>
        ) : (
          <div className={`grid gap-4 ${view === 'grid' ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'}`}>
            <AnimatePresence>
              {filteredAndSorted.map((allocation) => (
                <AllocationCard
                  key={allocation.id}
                  allocation={allocation}
                  onViewDetails={() => setDetailsId(allocation.id)}
                  onAccept={handleAccept}
                  onDecline={handleDecline}
                />
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* Enhanced Details Dialog */}
        <Dialog open={!!detailsId} onOpenChange={(o) => !o && setDetailsId(null)}>
          <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
            {(() => {
              const allocation = allocations.find(a => a.id === detailsId);
              if (!allocation) return null;
              const statusInfo = statusConfig[allocation.status as keyof typeof statusConfig];

              return (
                <>
                  <DialogHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <DialogTitle className="text-xl">{allocation.internshipTitle}</DialogTitle>
                        <DialogDescription className="text-base">
                          {allocation.organization} • {allocation.location}
                        </DialogDescription>
                      </div>
                      <Button variant="outline" size="sm">
                        <Share2 className="w-4 h-4 mr-2" />
                        Share
                      </Button>
                    </div>
                  </DialogHeader>

                  <Tabs defaultValue="overview" className="mt-4">
                    <TabsList className="grid w-full grid-cols-4">
                      <TabsTrigger value="overview">Overview</TabsTrigger>
                      <TabsTrigger value="student">Student</TabsTrigger>
                      <TabsTrigger value="internship">Internship</TabsTrigger>
                      <TabsTrigger value="timeline">Timeline</TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview" className="space-y-4">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <Card className="p-3">
                          <div className="text-center">
                            <div className="text-sm text-muted-foreground">Status</div>
                            <Badge className={statusInfo?.color}>
                              {statusInfo?.icon && <statusInfo.icon className="w-3 h-3 mr-1" />}
                              {statusInfo?.label}
                            </Badge>
                          </div>
                        </Card>
                        
                        <Card className="p-3">
                          <div className="text-center">
                            <div className="text-sm text-muted-foreground">Match Score</div>
                            <div className="text-lg font-bold text-primary">
                              {allocation.matchScore}%
                            </div>
                          </div>
                        </Card>
                        
                        <Card className="p-3">
                          <div className="text-center">
                            <div className="text-sm text-muted-foreground">Preference</div>
                            <div className="text-sm font-medium">
                              #{allocation.allocatedPreference}
                            </div>
                          </div>
                        </Card>
                        
                        <Card className="p-3">
                          <div className="text-center">
                            <div className="text-sm text-muted-foreground">Deadline</div>
                            <div className="text-sm font-medium">
                              {new Date(allocation.responseDeadline).toLocaleDateString()}
                            </div>
                          </div>
                        </Card>
                      </div>

                      {statusInfo?.description && (
                        <Card className="p-4 bg-muted/30">
                          <p className="text-sm">{statusInfo.description}</p>
                        </Card>
                      )}
                    </TabsContent>

                    <TabsContent value="student" className="space-y-4">
                      <Card className="p-4">
                        <h4 className="font-medium mb-2">Student Information</h4>
                        <div className="space-y-2 text-sm">
                          <div><span className="font-medium">Name:</span> {allocation.studentName}</div>
                          <div><span className="font-medium">Student ID:</span> {allocation.studentId}</div>
                          <div><span className="font-medium">Preferences:</span> {allocation.preferences.join(', ')}</div>
                        </div>
                      </Card>
                    </TabsContent>

                    <TabsContent value="internship" className="space-y-4">
                      <Card className="p-4">
                        <h4 className="font-medium mb-2">Internship Details</h4>
                        <div className="space-y-2 text-sm">
                          <div><span className="font-medium">Organization:</span> {allocation.organization}</div>
                          <div><span className="font-medium">Duration:</span> {allocation.duration}</div>
                          <div><span className="font-medium">Stipend:</span> ₹{allocation.stipend}</div>
                          <div><span className="font-medium">Location:</span> {allocation.location}</div>
                          <div><span className="font-medium">Modality:</span> {allocation.modality}</div>
                        </div>
                      </Card>
                    </TabsContent>

                    <TabsContent value="timeline" className="space-y-4">
                      <div className="space-y-3">
                        <div className="flex items-start gap-3 p-3 border rounded-lg">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <Clock className="w-4 h-4 text-primary" />
                          </div>
                          <div className="flex-1">
                            <div className="font-medium">Allocated</div>
                            <div className="text-sm text-muted-foreground">
                              {new Date(allocation.allocationDate).toLocaleString()}
                            </div>
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </>
              );
            })()}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default AllocationResults;
