import React, { useMemo, useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useStudent } from '@/contexts/StudentContext';
import { SAMPLE_INTERNSHIPS } from '@/lib/sampleData';
import { formatRemaining, timeRemaining, cn } from '@/lib/utils';
import { scoreInternship } from '@/lib/matching';
import { 
  MoreHorizontal, Filter, CalendarClock, Clipboard, CheckCircle2, Clock, 
  ListFilter, Search, Download, Star, MapPin, Building2, Users, 
  TrendingUp, Eye, MessageSquare, Bell, FileText, Calendar,
  AlertTriangle, ThumbsUp, ThumbsDown, Bookmark, Share2,
  BarChart3, PieChart, Activity, Target, Zap, Award
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const statusConfig = {
  applied: { 
    color: 'bg-blue-50 text-blue-700 border-blue-200', 
    icon: Clock,
    label: 'Applied',
    description: 'Your application is under review'
  },
  withdrawn: { 
    color: 'bg-gray-50 text-gray-600 border-gray-200', 
    icon: AlertTriangle,
    label: 'Withdrawn',
    description: 'You withdrew this application'
  },
  shortlisted: { 
    color: 'bg-amber-50 text-amber-700 border-amber-200', 
    icon: Star,
    label: 'Shortlisted',
    description: 'Congratulations! You\'ve been shortlisted'
  },
  interview: { 
    color: 'bg-purple-50 text-purple-700 border-purple-200', 
    icon: Users,
    label: 'Interview',
    description: 'Interview scheduled or completed'
  },
  offer: { 
    color: 'bg-green-50 text-green-700 border-green-200', 
    icon: Award,
    label: 'Offer Received',
    description: 'You have an offer! Action required'
  },
  accepted: { 
    color: 'bg-emerald-50 text-emerald-700 border-emerald-200', 
    icon: CheckCircle2,
    label: 'Accepted',
    description: 'Offer accepted - internship confirmed'
  },
  declined: { 
    color: 'bg-red-50 text-red-700 border-red-200', 
    icon: ThumbsDown,
    label: 'Declined',
    description: 'Offer declined'
  },
  rejected: { 
    color: 'bg-red-50 text-red-700 border-red-200', 
    icon: ThumbsDown,
    label: 'Not Selected',
    description: 'Application was not successful'
  },
};

interface ApplicationNote {
  id: string;
  applicationId: string;
  note: string;
  createdAt: string;
  type: 'personal' | 'system';
}

function UrgencyBadge({ deadline }: { deadline?: string }) {
  if (!deadline) return null;
  const { expired, days, hours, minutes } = timeRemaining(deadline);
  const label = expired ? 'Expired' : days > 0 ? `${days}d ${hours}h` : hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
  const color = expired 
    ? 'bg-gray-100 text-gray-600 border-gray-200' 
    : (days > 3 ? 'bg-green-50 text-green-700 border-green-200' 
      : (days > 1 ? 'bg-amber-50 text-amber-700 border-amber-200' 
        : 'bg-red-50 text-red-700 border-red-200'));
  
  return (
    <motion.span 
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full border ${color} font-medium`} 
      title={new Date(deadline).toLocaleString()}
    >
      <CalendarClock className="w-3 h-3" /> 
      {label}
    </motion.span>
  );
}

function ApplicationCard({ app, internship, score, selected, onSelect, onDetails }: any) {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const statusInfo = statusConfig[app.status as keyof typeof statusConfig];
  const StatusIcon = statusInfo?.icon || Clock;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <Card className={cn(
        "group hover:shadow-lg transition-all duration-300 border-l-4 relative overflow-hidden",
        selected ? "ring-2 ring-primary shadow-md" : "",
        app.status === 'offer' ? "border-l-green-500 bg-green-50/20" : "border-l-blue-500"
      )}>
        {/* Priority indicator for offers */}
        {app.status === 'offer' && (
          <div className="absolute top-0 right-0 bg-gradient-to-l from-green-500 to-green-400 text-white px-3 py-1 text-xs font-bold">
            ACTION REQUIRED
          </div>
        )}

        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3 flex-1">
              <Checkbox 
                checked={selected} 
                onCheckedChange={onSelect}
                className="mt-1" 
              />
              
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="flex items-center gap-2 text-lg group-hover:text-primary transition-colors">
                    <Building2 className="w-4 h-4 text-muted-foreground" />
                    {internship.title}
                    {typeof score === 'number' && (
                      <Badge variant="secondary" className="text-xs">
                        <Zap className="w-3 h-3 mr-1" />
                        {Math.round(score*100)}% Match
                      </Badge>
                    )}
                  </CardTitle>
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsBookmarked(!isBookmarked)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Bookmark className={cn("w-4 h-4", isBookmarked && "fill-current")} />
                  </Button>
                </div>
                
                <CardDescription className="flex items-center gap-2 mt-1">
                  <span className="font-medium">{internship.organization}</span>
                  <span>•</span>
                  <span>{internship.sector}</span>
                  <span>•</span>
                  <Badge variant="outline" className="text-xs">
                    <MapPin className="w-3 h-3 mr-1" />
                    {internship.modality}
                  </Badge>
                </CardDescription>

                <div className="flex items-center gap-2 mt-3">
                  <Badge className={cn("text-xs", statusInfo?.color)}>
                    <StatusIcon className="w-3 h-3 mr-1" />
                    {statusInfo?.label}
                  </Badge>
                  
                  {internship.applicationDeadline && (
                    <UrgencyBadge deadline={internship.applicationDeadline} />
                  )}
                  
                  <span className="text-xs text-muted-foreground ml-auto">
                    Applied {new Date(app.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={onDetails}>
                  <Eye className="w-4 h-4 mr-2" />
                  View Details
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Download className="w-4 h-4 mr-2" />
                  Export PDF
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          {/* Progress Timeline */}
          <div className="mb-4">
            <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
              <span>Application Progress</span>
              <span>{app.timeline.length} steps completed</span>
            </div>
            <div className="flex items-center gap-1">
              {['applied', 'shortlisted', 'interview', 'offer', 'accepted'].map((status, idx) => {
                const isCompleted = app.timeline.some(t => t.status === status);
                const isCurrent = app.status === status;
                return (
                  <div
                    key={status}
                    className={cn(
                      "h-2 flex-1 rounded-full transition-all duration-300",
                      isCompleted ? "bg-primary" : 
                      isCurrent ? "bg-primary/50" : "bg-muted"
                    )}
                  />
                );
              })}
            </div>
          </div>

          {/* Key Info */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 p-3 bg-muted/30 rounded-lg">
            <div className="text-center">
              <div className="text-xs text-muted-foreground">Duration</div>
              <div className="font-medium text-sm">{internship.duration}</div>
            </div>
            <div className="text-center">
              <div className="text-xs text-muted-foreground">Stipend</div>
              <div className="font-medium text-sm">{internship.stipend}</div>
            </div>
            <div className="text-center">
              <div className="text-xs text-muted-foreground">Type</div>
              <div className="font-medium text-sm">{internship.type}</div>
            </div>
            <div className="text-center">
              <div className="text-xs text-muted-foreground">Applicants</div>
              <div className="font-medium text-sm">{Math.floor(Math.random() * 100) + 50}</div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={onDetails} className="flex-1 min-w-fit">
              <Eye className="w-4 h-4 mr-2" />
              View Details
            </Button>
            
            {app.status === 'offer' && (
              <>
                <Button className="flex-1 min-w-fit">
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Accept Offer
                </Button>
                <Button variant="destructive" className="flex-1 min-w-fit">
                  <ThumbsDown className="w-4 h-4 mr-2" />
                  Decline
                </Button>
              </>
            )}
            
            {app.status === 'applied' && (
              <Button variant="outline" className="flex-1 min-w-fit">
                <AlertTriangle className="w-4 h-4 mr-2" />
                Withdraw
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function AnalyticsPanel({ applications }: { applications: any[] }) {
  const stats = useMemo(() => {
    const total = applications.length;
    const byStatus = applications.reduce((acc, app) => {
      acc[app.status] = (acc[app.status] || 0) + 1;
      return acc;
    }, {});
    
    const successRate = total > 0 ? ((byStatus.accepted || 0) / total * 100) : 0;
    const responseRate = total > 0 ? ((total - (byStatus.applied || 0)) / total * 100) : 0;
    
    return { total, byStatus, successRate, responseRate };
  }, [applications]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600 font-medium">Total Applications</p>
              <p className="text-2xl font-bold text-blue-900">{stats.total}</p>
            </div>
            <div className="p-2 bg-blue-200 rounded-lg">
              <FileText className="w-6 h-6 text-blue-700" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600 font-medium">Success Rate</p>
              <p className="text-2xl font-bold text-green-900">{stats.successRate.toFixed(1)}%</p>
            </div>
            <div className="p-2 bg-green-200 rounded-lg">
              <TrendingUp className="w-6 h-6 text-green-700" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-amber-600 font-medium">Response Rate</p>
              <p className="text-2xl font-bold text-amber-900">{stats.responseRate.toFixed(1)}%</p>
            </div>
            <div className="p-2 bg-amber-200 rounded-lg">
              <Activity className="w-6 h-6 text-amber-700" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-600 font-medium">Active Offers</p>
              <p className="text-2xl font-bold text-purple-900">{stats.byStatus.offer || 0}</p>
            </div>
            <div className="p-2 bg-purple-200 rounded-lg">
              <Award className="w-6 h-6 text-purple-700" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export const Applications: React.FC = () => {
  const { applications, withdrawApplication, simulateOffer, updateApplicationStatus, acceptOffer, declineOffer, profile, preferences } = useStudent();
  const [q, setQ] = useState('');
  const [status, setStatus] = useState<'all' | string>('all');
  const [sort, setSort] = useState<'recent' | 'oldest' | 'deadline' | 'title' | 'match'>('recent');
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [detailsId, setDetailsId] = useState<string | null>(null);
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [notes, setNotes] = useState<ApplicationNote[]>([]);
  const [newNote, setNewNote] = useState('');

  const byId = useMemo(() => Object.fromEntries(SAMPLE_INTERNSHIPS.map(i => [i.id, i])), []);

  const enriched = useMemo(() => {
    const list = applications.map(app => {
      const internship = byId[app.internshipId];
      const rec = internship && profile ? scoreInternship(profile.skills || [], preferences, internship) : null;
      return { app, internship, score: rec?.score ?? null };
    });
    
    const filtered = list.filter(({ app, internship }) => {
      if (!internship) return false;
      if (status !== 'all' && app.status !== status) return false;
      const text = `${internship.title} ${internship.organization} ${app.status}`.toLowerCase();
      if (q && !text.includes(q.toLowerCase())) return false;
      return true;
    });
    
    const sorted = [...filtered].sort((a, b) => {
      if (sort === 'recent') return new Date(b.app.createdAt).getTime() - new Date(a.app.createdAt).getTime();
      if (sort === 'oldest') return new Date(a.app.createdAt).getTime() - new Date(b.app.createdAt).getTime();
      if (sort === 'deadline') return (new Date(a.internship?.applicationDeadline || 8640000000000000).getTime()) - (new Date(b.internship?.applicationDeadline || 8640000000000000).getTime());
      if (sort === 'title') return (a.internship?.title || '').localeCompare(b.internship?.title || '');
      if (sort === 'match') return (b.score || 0) - (a.score || 0);
      return 0;
    });
    
    return sorted;
  }, [applications, q, status, sort, profile?.skills?.join(','), preferences]);

  const selectedIds = useMemo(() => Object.keys(selected).filter(k => selected[k]), [selected]);

  const bulkActions = {
    withdraw: () => {
      selectedIds.forEach(id => withdrawApplication(id));
      setSelected({});
    },
    copy: async () => {
      const lines = selectedIds.map(id => {
        const row = enriched.find(x => x.app.id === id);
        if (!row) return '';
        const { app, internship, score } = row;
        return `${internship?.title} • ${internship?.organization} | Status: ${app.status} | Applied: ${new Date(app.createdAt).toLocaleString()}${score != null ? ` | Match: ${Math.round(score*100)}%` : ''}`;
      }).filter(Boolean);
      try { 
        await navigator.clipboard.writeText(lines.join('\n')); 
      } catch {}
    },
    export: () => {
      // Export functionality
      console.log('Exporting selected applications...');
    }
  };

  return (
    <DashboardLayout title="My Applications">
      <div className="space-y-6">
        {/* Analytics Overview */}
        <AnalyticsPanel applications={applications} />

        {/* Enhanced Controls */}
        <Card className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input 
                  placeholder="Search by title, organization, or keywords..." 
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
                  <SelectItem value="oldest">Oldest First</SelectItem>
                  <SelectItem value="deadline">By Deadline</SelectItem>
                  <SelectItem value="title">Alphabetical</SelectItem>
                  <SelectItem value="match">Best Match</SelectItem>
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
                  <ListFilter className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Bulk Actions */}
          <AnimatePresence>
            {selectedIds.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 p-3 bg-primary/5 rounded-lg border border-primary/20"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">
                    {selectedIds.length} application{selectedIds.length !== 1 ? 's' : ''} selected
                  </span>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={bulkActions.copy}>
                      <Clipboard className="w-4 h-4 mr-1" />
                      Copy
                    </Button>
                    <Button variant="outline" size="sm" onClick={bulkActions.export}>
                      <Download className="w-4 h-4 mr-1" />
                      Export
                    </Button>
                    <Button variant="destructive" size="sm" onClick={bulkActions.withdraw}>
                      <AlertTriangle className="w-4 h-4 mr-1" />
                      Withdraw
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>

        {/* Applications List */}
        {!applications.length ? (
          <Card className="p-12 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
                <FileText className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No Applications Yet</h3>
              <p className="text-muted-foreground mb-4">
                Start your internship journey by exploring and applying to opportunities that match your skills and interests.
              </p>
              <Button>
                <Target className="w-4 h-4 mr-2" />
                Browse Recommendations
              </Button>
            </div>
          </Card>
        ) : (
          <div className={cn(
            "grid gap-4",
            view === 'grid' ? "grid-cols-1 lg:grid-cols-2" : "grid-cols-1"
          )}>
            <AnimatePresence>
              {enriched.map(({ app, internship, score }) => {
                if (!internship) return null;
                return (
                  <ApplicationCard
                    key={app.id}
                    app={app}
                    internship={internship}
                    score={score}
                    selected={!!selected[app.id]}
                    onSelect={(checked: boolean) => setSelected(s => ({ ...s, [app.id]: checked }))}
                    onDetails={() => setDetailsId(app.id)}
                  />
                );
              })}
            </AnimatePresence>
          </div>
        )}

        {/* Enhanced Details Dialog */}
        <Dialog open={!!detailsId} onOpenChange={(o) => !o && setDetailsId(null)}>
          <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
            {(() => {
              const row = enriched.find(x => x.app.id === detailsId);
              if (!row) return null;
              const { app, internship, score } = row;
              const statusInfo = statusConfig[app.status as keyof typeof statusConfig];

              return (
                <>
                  <DialogHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <DialogTitle className="text-xl">{internship?.title}</DialogTitle>
                        <DialogDescription className="text-base">
                          {internship?.organization} • {internship?.sector} • {internship?.modality}
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
                      <TabsTrigger value="timeline">Timeline</TabsTrigger>
                      <TabsTrigger value="details">Details</TabsTrigger>
                      <TabsTrigger value="notes">Notes</TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview" className="space-y-4">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <Card className="p-3">
                          <div className="text-center">
                            <div className="text-sm text-muted-foreground">Status</div>
                            <Badge className={cn("mt-1", statusInfo?.color)}>
                              {statusInfo?.icon && <statusInfo.icon className="w-3 h-3 mr-1" />}
                              {statusInfo?.label}
                            </Badge>
                          </div>
                        </Card>
                        
                        {typeof score === 'number' && (
                          <Card className="p-3">
                            <div className="text-center">
                              <div className="text-sm text-muted-foreground">Match Score</div>
                              <div className="text-lg font-bold text-primary mt-1">
                                {Math.round(score*100)}%
                              </div>
                            </div>
                          </Card>
                        )}
                        
                        <Card className="p-3">
                          <div className="text-center">
                            <div className="text-sm text-muted-foreground">Applied</div>
                            <div className="text-sm font-medium mt-1">
                              {new Date(app.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                        </Card>
                        
                        {internship?.applicationDeadline && (
                          <Card className="p-3">
                            <div className="text-center">
                              <div className="text-sm text-muted-foreground">Deadline</div>
                              <div className="text-sm font-medium mt-1">
                                {formatRemaining(internship.applicationDeadline)}
                              </div>
                            </div>
                          </Card>
                        )}
                      </div>

                      {statusInfo?.description && (
                        <Card className="p-4 bg-muted/30">
                          <p className="text-sm">{statusInfo.description}</p>
                        </Card>
                      )}

                      {/* Application Details */}
                      {app.formData?.coverLetter && (
                        <Card className="p-4">
                          <h4 className="font-medium mb-2">Cover Letter</h4>
                          <div className="p-3 bg-muted/30 rounded border text-sm whitespace-pre-wrap">
                            {app.formData.coverLetter}
                          </div>
                        </Card>
                      )}
                    </TabsContent>

                    <TabsContent value="timeline" className="space-y-4">
                      <div className="space-y-3">
                        {app.timeline.map((event: any, idx: number) => (
                          <div key={idx} className="flex items-start gap-3 p-3 border rounded-lg">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                              <Clock className="w-4 h-4 text-primary" />
                            </div>
                            <div className="flex-1">
                              <div className="font-medium capitalize">{event.status}</div>
                              <div className="text-sm text-muted-foreground">
                                {new Date(event.at).toLocaleString()}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </TabsContent>

                    <TabsContent value="details" className="space-y-4">
                      <div className="grid gap-4">
                        <Card className="p-4">
                          <h4 className="font-medium mb-2">Internship Details</h4>
                          <div className="space-y-2 text-sm">
                            <div><span className="font-medium">Duration:</span> {internship?.duration}</div>
                            <div><span className="font-medium">Stipend:</span> {internship?.stipend}</div>
                            <div><span className="font-medium">Type:</span> {internship?.type}</div>
                            <div><span className="font-medium">Location:</span> {internship?.location}</div>
                          </div>
                        </Card>

                        {app.formData?.preferredStart && (
                          <Card className="p-4">
                            <h4 className="font-medium mb-2">Your Preferences</h4>
                            <div className="text-sm">
                              <span className="font-medium">Preferred Start:</span> {app.formData.preferredStart}
                            </div>
                          </Card>
                        )}
                      </div>
                    </TabsContent>

                    <TabsContent value="notes" className="space-y-4">
                      <Card className="p-4">
                        <h4 className="font-medium mb-3">Personal Notes</h4>
                        <div className="space-y-3">
                          <Textarea
                            placeholder="Add a note about this application..."
                            value={newNote}
                            onChange={(e) => setNewNote(e.target.value)}
                          />
                          <Button 
                            onClick={() => {
                              if (newNote.trim()) {
                                setNotes(prev => [...prev, {
                                  id: Date.now().toString(),
                                  applicationId: app.id,
                                  note: newNote.trim(),
                                  createdAt: new Date().toISOString(),
                                  type: 'personal'
                                }]);
                                setNewNote('');
                              }
                            }}
                            disabled={!newNote.trim()}
                          >
                            <MessageSquare className="w-4 h-4 mr-2" />
                            Add Note
                          </Button>
                        </div>

                        <div className="space-y-2 mt-4">
                          {notes
                            .filter(note => note.applicationId === app.id)
                            .map(note => (
                              <div key={note.id} className="p-3 bg-muted/30 rounded border">
                                <div className="text-sm">{note.note}</div>
                                <div className="text-xs text-muted-foreground mt-1">
                                  {new Date(note.createdAt).toLocaleString()}
                                </div>
                              </div>
                            ))}
                        </div>
                      </Card>
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

export default Applications;
