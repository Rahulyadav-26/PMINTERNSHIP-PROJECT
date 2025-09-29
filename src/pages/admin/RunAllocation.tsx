
import React, { useState, useEffect, useMemo } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Play,
  Users,
  Building,
  CheckCircle,
  Clock,
  Zap,
  FileText,
  TrendingUp,
  AlertTriangle,
  RotateCcw,
  Download,
  Eye,
  Brain,
  Activity,
  Server,
  Shield,
  Database,
  Cpu,
  HardDrive,
  Pause,
  StopCircle,
  Settings,
  BarChart3,
  PieChart,
  MapPin,
  Filter,
  Calendar,
  Bell,
  AlertCircle,
  Info,
  Star,
  Target,
  Loader2,
  RefreshCw,
  Save,
  Mail,
  Share2,
  History,
  Layers,
  Gauge,
  Wifi,
  WifiOff,
  Monitor,
} from 'lucide-react';

interface AllocationStage {
  name: string;
  description: string;
  progress: number;
  status: 'pending' | 'active' | 'completed' | 'error';
  duration?: number;
  details?: string[];
}

interface AllocationResults {
  candidatesProcessed: number;
  internshipsFilled: number;
  quotaRulesApplied: boolean;
  ruralQuotaFilled: number;
  scStQuotaFilled: number;
  obcQuotaFilled: number;
  pwdQuotaFilled: number;
  totalAllocations: number;
  unallocatedCandidates: number;
  processingTime: number;
  successRate: number;
  averageMatchScore: number;
  systemLoad: {
    cpu: number;
    memory: number;
    database: number;
  };
  allocationsByDomain: Record<string, number>;
  allocationsByLocation: Record<string, number>;
}

interface SystemHealth {
  dataIntegrity: boolean;
  rulesConfigured: boolean;
  systemStatus: 'operational' | 'degraded' | 'down';
  lastHealthCheck: string;
  services: {
    database: 'healthy' | 'warning' | 'critical';
    aiEngine: 'healthy' | 'warning' | 'critical';
    allocationEngine: 'healthy' | 'warning' | 'critical';
    notificationService: 'healthy' | 'warning' | 'critical';
  };
  performance: {
    responseTime: number;
    throughput: number;
    errorRate: number;
  };
}

export const RunAllocation: React.FC = () => {
  const [allocationState, setAllocationState] = useState<'idle' | 'running' | 'paused' | 'completed' | 'error'>('idle');
  const [currentStage, setCurrentStage] = useState(0);
  const [overallProgress, setOverallProgress] = useState(0);
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [estimatedTime, setEstimatedTime] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [allocationNotes, setAllocationNotes] = useState('');
  const [selectedPriority, setSelectedPriority] = useState('normal');
  const [emailNotifications, setEmailNotifications] = useState(true);

  const [stages, setStages] = useState<AllocationStage[]>([
    {
      name: 'Data Validation',
      description: 'Validating candidate profiles and internship data',
      progress: 0,
      status: 'pending',
      details: ['Checking candidate eligibility', 'Validating skill data', 'Verifying documents']
    },
    {
      name: 'Skill Analysis',
      description: 'AI-powered skill matching and scoring',
      progress: 0,
      status: 'pending',
      details: ['Natural language processing', 'Skill extraction', 'Competency scoring']
    },
    {
      name: 'Geographic Matching',
      description: 'Location preference analysis and proximity scoring',
      progress: 0,
      status: 'pending',
      details: ['Location preference matching', 'Distance calculations', 'Regional quota application']
    },
    {
      name: 'Quota Application',
      description: 'Applying affirmative action and quota rules',
      progress: 0,
      status: 'pending',
      details: ['SC/ST quota application', 'OBC quota processing', 'PWD reservation', 'Rural district priority']
    },
    {
      name: 'Optimization',
      description: 'Final optimization and conflict resolution',
      progress: 0,
      status: 'pending',
      details: ['Conflict resolution', 'Score optimization', 'Final ranking']
    },
    {
      name: 'Results Generation',
      description: 'Generating allocation results and notifications',
      progress: 0,
      status: 'pending',
      details: ['Result compilation', 'Report generation', 'Notification preparation']
    }
  ]);

  const [results, setResults] = useState<AllocationResults>({
    candidatesProcessed: 0,
    internshipsFilled: 0,
    quotaRulesApplied: false,
    ruralQuotaFilled: 0,
    scStQuotaFilled: 0,
    obcQuotaFilled: 0,
    pwdQuotaFilled: 0,
    totalAllocations: 0,
    unallocatedCandidates: 0,
    processingTime: 0,
    successRate: 0,
    averageMatchScore: 0,
    systemLoad: {
      cpu: 0,
      memory: 0,
      database: 0
    },
    allocationsByDomain: {},
    allocationsByLocation: {}
  });

  const [systemHealth, setSystemHealth] = useState<SystemHealth>({
    dataIntegrity: true,
    rulesConfigured: true,
    systemStatus: 'operational',
    lastHealthCheck: new Date().toISOString(),
    services: {
      database: 'healthy',
      aiEngine: 'healthy',
      allocationEngine: 'healthy',
      notificationService: 'healthy'
    },
    performance: {
      responseTime: 150,
      throughput: 850,
      errorRate: 0.01
    }
  });

  // Simulate real-time system monitoring
  useEffect(() => {
    const interval = setInterval(() => {
      if (allocationState === 'running') {
        // Update system load during processing
        setResults(prev => ({
          ...prev,
          systemLoad: {
            cpu: Math.random() * 40 + 40, // 40-80% during processing
            memory: Math.random() * 20 + 60, // 60-80% during processing
            database: Math.random() * 30 + 50 // 50-80% during processing
          }
        }));
      } else {
        // Normal system load
        setResults(prev => ({
          ...prev,
          systemLoad: {
            cpu: Math.random() * 20 + 10, // 10-30% idle
            memory: Math.random() * 15 + 35, // 35-50% idle
            database: Math.random() * 10 + 20 // 20-30% idle
          }
        }));
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [allocationState]);

  const handleRunAllocation = async () => {
    setShowConfirmDialog(false);
    setAllocationState('running');
    setCurrentStage(0);
    setOverallProgress(0);
    setEstimatedTime(180); // 3 minutes estimate

    const stageDurations = [30, 45, 25, 40, 35, 25]; // seconds for each stage
    let totalProgress = 0;

    for (let stageIndex = 0; stageIndex < stages.length; stageIndex++) {
      setCurrentStage(stageIndex);

      // Mark current stage as active
      setStages(prev => prev.map((stage, idx) => ({
        ...stage,
        status: idx === stageIndex ? 'active' : idx < stageIndex ? 'completed' : 'pending'
      })));

      const stageDuration = stageDurations[stageIndex] * 1000;
      const stageSteps = 20;
      const stepDuration = stageDuration / stageSteps;

      for (let step = 0; step < stageSteps; step++) {
        await new Promise(resolve => setTimeout(resolve, stepDuration));

        const stageProgress = ((step + 1) / stageSteps) * 100;
        const overallStageProgress = (stageIndex + (step + 1) / stageSteps) / stages.length * 100;

        setStages(prev => prev.map((stage, idx) => 
          idx === stageIndex ? { ...stage, progress: stageProgress } : stage
        ));

        setOverallProgress(overallStageProgress);
        setEstimatedTime(prev => Math.max(0, prev - stepDuration / 1000));

        // Update candidates processed counter
        if (stageIndex === 1) { // During skill analysis
          const processed = Math.floor((stageProgress / 100) * 1247);
          setResults(prev => ({ ...prev, candidatesProcessed: processed }));
        }
      }

      // Mark stage as completed
      setStages(prev => prev.map((stage, idx) => 
        idx === stageIndex ? { ...stage, status: 'completed', progress: 100 } : stage
      ));
    }

    // Set final results
    setResults({
      candidatesProcessed: 1247,
      internshipsFilled: 342,
      quotaRulesApplied: true,
      ruralQuotaFilled: 68,
      scStQuotaFilled: 51,
      obcQuotaFilled: 92,
      pwdQuotaFilled: 14,
      totalAllocations: 342,
      unallocatedCandidates: 905,
      processingTime: 180,
      successRate: 27.4,
      averageMatchScore: 78.5,
      systemLoad: {
        cpu: 15,
        memory: 42,
        database: 25
      },
      allocationsByDomain: {
        'Technology': 156,
        'Finance': 78,
        'Healthcare': 45,
        'Marketing': 32,
        'Consulting': 31
      },
      allocationsByLocation: {
        'Delhi': 89,
        'Mumbai': 76,
        'Bangalore': 68,
        'Pune': 42,
        'Chennai': 38,
        'Hyderabad': 29
      }
    });

    setAllocationState('completed');
    setOverallProgress(100);
    setShowResults(true);
  };

  const handlePauseAllocation = () => {
    setAllocationState('paused');
  };

  const handleResumeAllocation = () => {
    setAllocationState('running');
  };

  const handleStopAllocation = () => {
    setAllocationState('idle');
    setOverallProgress(0);
    setCurrentStage(0);
    setStages(prev => prev.map(stage => ({ ...stage, progress: 0, status: 'pending' })));
  };

  const handleReset = () => {
    setAllocationState('idle');
    setOverallProgress(0);
    setCurrentStage(0);
    setShowResults(false);
    setStages(prev => prev.map(stage => ({ ...stage, progress: 0, status: 'pending' })));
    setResults({
      candidatesProcessed: 0,
      internshipsFilled: 0,
      quotaRulesApplied: false,
      ruralQuotaFilled: 0,
      scStQuotaFilled: 0,
      obcQuotaFilled: 0,
      pwdQuotaFilled: 0,
      totalAllocations: 0,
      unallocatedCandidates: 0,
      processingTime: 0,
      successRate: 0,
      averageMatchScore: 0,
      systemLoad: {
        cpu: 0,
        memory: 0,
        database: 0
      },
      allocationsByDomain: {},
      allocationsByLocation: {}
    });
  };

  const getSystemStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-600';
      case 'warning': return 'text-yellow-600';
      case 'critical': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getSystemStatusBadge = (status: string) => {
    switch (status) {
      case 'healthy': return <Badge className="bg-green-100 text-green-800">Healthy</Badge>;
      case 'warning': return <Badge className="bg-yellow-100 text-yellow-800">Warning</Badge>;
      case 'critical': return <Badge className="bg-red-100 text-red-800">Critical</Badge>;
      default: return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const isSystemReady = systemHealth.systemStatus === 'operational' && 
                       systemHealth.dataIntegrity && 
                       systemHealth.rulesConfigured;

  return (
    <DashboardLayout title="AI Allocation Engine">
      <div className="space-y-8">
        {/* Status Alert */}
        {allocationState === 'running' && (
          <Alert className="border-blue-200 bg-blue-50">
            <Activity className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800">
              Allocation process is running. Current stage: {stages[currentStage]?.name}
            </AlertDescription>
          </Alert>
        )}

        {allocationState === 'completed' && (
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              Allocation completed successfully! {results.totalAllocations} candidates were allocated to internships.
            </AlertDescription>
          </Alert>
        )}

        {!isSystemReady && (
          <Alert className="border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              System not ready for allocation. Please check system status and configuration.
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
                  <p className="text-blue-100 text-sm">Total Candidates</p>
                  <div className="flex items-center mt-2">
                    <TrendingUp className="h-4 w-4 text-blue-200 mr-1" />
                    <span className="text-blue-200 text-xs">Ready for processing</span>
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
                  <p className="text-3xl font-bold text-white">342</p>
                  <p className="text-emerald-100 text-sm">Available Positions</p>
                  <div className="flex items-center mt-2">
                    <Building className="h-4 w-4 text-emerald-200 mr-1" />
                    <span className="text-emerald-200 text-xs">85 companies</span>
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
                  <p className="text-3xl font-bold text-white">
                    {allocationState === 'idle' ? 'Ready' : 
                     allocationState === 'running' ? 'Running' : 
                     allocationState === 'paused' ? 'Paused' :
                     allocationState === 'completed' ? 'Complete' : 'Error'}
                  </p>
                  <p className="text-purple-100 text-sm">Engine Status</p>
                  <div className="flex items-center mt-2">
                    {allocationState === 'running' ? (
                      <>
                        <Activity className="h-4 w-4 text-purple-200 mr-1 animate-pulse" />
                        <span className="text-purple-200 text-xs">{Math.round(overallProgress)}% complete</span>
                      </>
                    ) : (
                      <>
                        <Zap className="h-4 w-4 text-purple-200 mr-1" />
                        <span className="text-purple-200 text-xs">AI-powered matching</span>
                      </>
                    )}
                  </div>
                </div>
                {allocationState === 'running' ? (
                  <Activity className="h-12 w-12 text-purple-200 animate-pulse" />
                ) : (
                  <Zap className="h-12 w-12 text-purple-200" />
                )}
              </div>
              <div className="absolute -top-4 -right-4 w-16 h-16 bg-white/10 rounded-full" />
            </CardContent>
          </Card>

          <Card className={`relative overflow-hidden border-0 shadow-lg ${
            isSystemReady ? 'bg-gradient-to-br from-green-500 to-green-600' : 'bg-gradient-to-br from-red-500 to-red-600'
          }`}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold text-white">
                    {isSystemReady ? '100%' : '0%'}
                  </p>
                  <p className={`text-sm ${isSystemReady ? 'text-green-100' : 'text-red-100'}`}>System Health</p>
                  <div className="flex items-center mt-2">
                    {isSystemReady ? (
                      <>
                        <CheckCircle className="h-4 w-4 text-green-200 mr-1" />
                        <span className="text-green-200 text-xs">All systems operational</span>
                      </>
                    ) : (
                      <>
                        <AlertTriangle className="h-4 w-4 text-red-200 mr-1" />
                        <span className="text-red-200 text-xs">System issues detected</span>
                      </>
                    )}
                  </div>
                </div>
                {isSystemReady ? (
                  <CheckCircle className="h-12 w-12 text-green-200" />
                ) : (
                  <AlertTriangle className="h-12 w-12 text-red-200" />
                )}
              </div>
              <div className="absolute -top-4 -right-4 w-16 h-16 bg-white/10 rounded-full" />
            </CardContent>
          </Card>
        </div>

        {/* Real-time System Load */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-slate-50 to-gray-50 border-b">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center space-x-2">
                  <Monitor className="h-5 w-5 text-slate-600" />
                  <span>System Performance</span>
                </CardTitle>
                <CardDescription>
                  Real-time monitoring of system resources during allocation
                </CardDescription>
              </div>
              <Badge variant="outline" className="flex items-center space-x-1">
                {systemHealth.services.database === 'healthy' ? (
                  <Wifi className="h-3 w-3 text-green-600" />
                ) : (
                  <WifiOff className="h-3 w-3 text-red-600" />
                )}
                <span>Connected</span>
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Cpu className="h-4 w-4 text-blue-600" />
                    <Label className="text-sm font-medium">CPU Usage</Label>
                  </div>
                  <span className="text-sm font-bold">{Math.round(results.systemLoad.cpu)}%</span>
                </div>
                <Progress value={results.systemLoad.cpu} className="h-2" />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <HardDrive className="h-4 w-4 text-emerald-600" />
                    <Label className="text-sm font-medium">Memory Usage</Label>
                  </div>
                  <span className="text-sm font-bold">{Math.round(results.systemLoad.memory)}%</span>
                </div>
                <Progress value={results.systemLoad.memory} className="h-2" />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Database className="h-4 w-4 text-purple-600" />
                    <Label className="text-sm font-medium">Database Load</Label>
                  </div>
                  <span className="text-sm font-bold">{Math.round(results.systemLoad.database)}%</span>
                </div>
                <Progress value={results.systemLoad.database} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <Tabs defaultValue="allocation" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 h-12 p-1 bg-slate-100">
            <TabsTrigger value="allocation" className="text-base font-semibold">Run Allocation</TabsTrigger>
            <TabsTrigger value="results" className="text-base font-semibold">Results & Analytics</TabsTrigger>
            <TabsTrigger value="system" className="text-base font-semibold">System Status</TabsTrigger>
            <TabsTrigger value="history" className="text-base font-semibold">Allocation History</TabsTrigger>
          </TabsList>

          <TabsContent value="allocation" className="space-y-6">
            {/* Allocation Control Panel */}
            <Card className="border-0 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center space-x-2">
                      <Brain className="h-5 w-5 text-blue-600" />
                      <span>AI Allocation Engine</span>
                    </CardTitle>
                    <CardDescription>
                      Execute intelligent internship matching with advanced AI algorithms
                    </CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm" onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}>
                      <Settings className="h-4 w-4 mr-2" />
                      {showAdvancedOptions ? 'Hide' : 'Show'} Options
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-8">
                {/* Advanced Options */}
                {showAdvancedOptions && (
                  <div className="mb-8 p-6 bg-slate-50 rounded-lg border">
                    <h4 className="font-semibold mb-4 flex items-center space-x-2">
                      <Settings className="h-4 w-4" />
                      <span>Advanced Configuration</span>
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label>Processing Priority</Label>
                        <Select value={selectedPriority} onValueChange={setSelectedPriority}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">Low Priority (Slower, Less Resources)</SelectItem>
                            <SelectItem value="normal">Normal Priority (Balanced)</SelectItem>
                            <SelectItem value="high">High Priority (Faster, More Resources)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id="email-notifications"
                            checked={emailNotifications}
                            onChange={(e) => setEmailNotifications(e.target.checked)}
                            className="rounded border-gray-300"
                          />
                          <Label htmlFor="email-notifications">Send email notifications on completion</Label>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 space-y-2">
                      <Label>Allocation Notes</Label>
                      <Textarea 
                        placeholder="Add notes about this allocation run..."
                        value={allocationNotes}
                        onChange={(e) => setAllocationNotes(e.target.value)}
                        className="min-h-20"
                      />
                    </div>
                  </div>
                )}

                {allocationState === 'idle' && (
                  <div className="text-center space-y-8">
                    <div className="space-y-4">
                      <h3 className="text-2xl font-bold text-slate-800">Ready to Start AI Allocation</h3>
                      <p className="text-slate-600 max-w-2xl mx-auto text-lg">
                        The advanced AI allocation engine will intelligently match candidates with internship positions 
                        using sophisticated algorithms and machine learning models.
                      </p>
                    </div>

                    {/* Enhanced Pre-run Checks */}
                    <div className="bg-blue-50 p-8 rounded-lg border border-blue-200">
                      <h4 className="font-semibold text-blue-900 mb-6 flex items-center justify-center space-x-2">
                        <Shield className="h-5 w-5" />
                        <span>System Readiness Verification</span>
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="flex items-center space-x-3 p-3 bg-white rounded-lg">
                          <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                          <div className="text-left">
                            <div className="text-sm font-medium text-slate-800">Data Integrity</div>
                            <div className="text-xs text-slate-600">1,247 candidates verified</div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3 p-3 bg-white rounded-lg">
                          <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                          <div className="text-left">
                            <div className="text-sm font-medium text-slate-800">AI Models</div>
                            <div className="text-xs text-slate-600">Loaded and ready</div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3 p-3 bg-white rounded-lg">
                          <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                          <div className="text-left">
                            <div className="text-sm font-medium text-slate-800">Rules Engine</div>
                            <div className="text-xs text-slate-600">Configuration active</div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3 p-3 bg-white rounded-lg">
                          <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                          <div className="text-left">
                            <div className="text-sm font-medium text-slate-800">System Resources</div>
                            <div className="text-xs text-slate-600">Optimal performance</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-center space-x-2 text-slate-600">
                        <Clock className="h-4 w-4" />
                        <span>Estimated processing time: 3-4 minutes</span>
                      </div>

                      <div className="flex space-x-4 justify-center">
                        <Button
                          onClick={() => setShowConfirmDialog(true)}
                          size="lg"
                          className="px-12 py-6 text-lg bg-blue-600 hover:bg-blue-700"
                          disabled={!isSystemReady}
                        >
                          <Play className="h-6 w-6 mr-3" />
                          Start AI Allocation
                        </Button>

                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="outline" size="lg" className="px-8 py-6">
                                <Eye className="h-5 w-5 mr-2" />
                                Preview Mode
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Run allocation simulation without saving results</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </div>
                  </div>
                )}

                {allocationState === 'running' && (
                  <div className="space-y-8">
                    <div className="text-center space-y-4">
                      <div className="flex items-center justify-center space-x-2">
                        <Brain className="h-8 w-8 text-blue-600 animate-pulse" />
                        <h3 className="text-2xl font-bold text-blue-900">AI Processing in Progress</h3>
                      </div>
                      <p className="text-slate-600 text-lg">
                        Advanced algorithms are analyzing candidate profiles and optimizing matches
                      </p>
                    </div>

                    {/* Overall Progress */}
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-semibold text-slate-800">Overall Progress</span>
                        <div className="flex items-center space-x-4">
                          <span className="text-2xl font-bold text-blue-600">{Math.round(overallProgress)}%</span>
                          <div className="flex items-center space-x-2 text-sm text-slate-600">
                            <Clock className="h-4 w-4" />
                            <span>ETA: {Math.ceil(estimatedTime / 60)} min</span>
                          </div>
                        </div>
                      </div>
                      <Progress value={overallProgress} className="h-4 bg-slate-200" />
                    </div>

                    {/* Stage Progress */}
                    <div className="space-y-4">
                      <h4 className="font-semibold text-slate-800 flex items-center space-x-2">
                        <Layers className="h-4 w-4" />
                        <span>Processing Stages</span>
                      </h4>
                      <div className="space-y-3">
                        {stages.map((stage, index) => (
                          <div key={index} className={`p-4 rounded-lg border-2 transition-all ${
                            stage.status === 'active' ? 'border-blue-300 bg-blue-50' :
                            stage.status === 'completed' ? 'border-green-300 bg-green-50' :
                            'border-slate-200 bg-slate-50'
                          }`}>
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center space-x-3">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                  stage.status === 'active' ? 'bg-blue-600' :
                                  stage.status === 'completed' ? 'bg-green-600' :
                                  'bg-slate-400'
                                }`}>
                                  {stage.status === 'completed' ? (
                                    <CheckCircle className="h-4 w-4 text-white" />
                                  ) : stage.status === 'active' ? (
                                    <Activity className="h-4 w-4 text-white animate-pulse" />
                                  ) : (
                                    <span className="text-white text-sm font-bold">{index + 1}</span>
                                  )}
                                </div>
                                <div>
                                  <div className="font-medium text-slate-800">{stage.name}</div>
                                  <div className="text-sm text-slate-600">{stage.description}</div>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-lg font-bold text-slate-800">{Math.round(stage.progress)}%</div>
                                <Progress value={stage.progress} className="w-20 h-2" />
                              </div>
                            </div>

                            {stage.status === 'active' && stage.details && (
                              <div className="mt-3 pl-11">
                                <div className="flex flex-wrap gap-2">
                                  {stage.details.map((detail, idx) => (
                                    <Badge key={idx} variant="outline" className="text-xs">
                                      {detail}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Control Buttons */}
                    <div className="flex justify-center space-x-4">
                      <Button variant="outline" onClick={handlePauseAllocation}>
                        <Pause className="h-4 w-4 mr-2" />
                        Pause
                      </Button>
                      <Button variant="destructive" onClick={handleStopAllocation}>
                        <StopCircle className="h-4 w-4 mr-2" />
                        Stop
                      </Button>
                    </div>
                  </div>
                )}

                {allocationState === 'completed' && (
                  <div className="text-center space-y-8">
                    <div className="space-y-4">
                      <div className="flex items-center justify-center space-x-2">
                        <CheckCircle className="h-10 w-10 text-green-600" />
                        <h3 className="text-2xl font-bold text-green-900">Allocation Completed Successfully!</h3>
                      </div>
                      <p className="text-slate-600 text-lg">
                        AI algorithms have successfully processed all candidates and generated optimal matches
                      </p>
                    </div>

                    {/* Quick Results Summary */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
                        <CardContent className="p-6 text-center">
                          <div className="text-3xl font-bold text-green-900 mb-2">{results.candidatesProcessed.toLocaleString()}</div>
                          <div className="text-sm text-green-700">Candidates Processed</div>
                          <div className="text-xs text-green-600 mt-1">100% completion rate</div>
                        </CardContent>
                      </Card>

                      <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
                        <CardContent className="p-6 text-center">
                          <div className="text-3xl font-bold text-blue-900 mb-2">{results.internshipsFilled}</div>
                          <div className="text-sm text-blue-700">Successful Allocations</div>
                          <div className="text-xs text-blue-600 mt-1">{results.successRate}% success rate</div>
                        </CardContent>
                      </Card>

                      <Card className="bg-gradient-to-br from-purple-50 to-violet-50 border-purple-200">
                        <CardContent className="p-6 text-center">
                          <div className="text-3xl font-bold text-purple-900 mb-2">{results.averageMatchScore}%</div>
                          <div className="text-sm text-purple-700">Average Match Score</div>
                          <div className="text-xs text-purple-600 mt-1">High quality matches</div>
                        </CardContent>
                      </Card>

                      <Card className="bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200">
                        <CardContent className="p-6 text-center">
                          <div className="text-3xl font-bold text-orange-900 mb-2">{results.processingTime}s</div>
                          <div className="text-sm text-orange-700">Processing Time</div>
                          <div className="text-xs text-orange-600 mt-1">Efficient processing</div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-4 justify-center">
                      <Button onClick={() => setShowResults(true)} className="bg-blue-600 hover:bg-blue-700">
                        <BarChart3 className="h-4 w-4 mr-2" />
                        View Detailed Analytics
                      </Button>
                      <Button variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        Export Results
                      </Button>
                      <Button variant="outline">
                        <Mail className="h-4 w-4 mr-2" />
                        Send Notifications
                      </Button>
                      <Button variant="outline" onClick={handleReset}>
                        <RotateCcw className="h-4 w-4 mr-2" />
                        Run New Allocation
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="results" className="space-y-6">
            <Card className="border-0 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 border-b">
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5 text-indigo-600" />
                  <span>Allocation Results & Analytics</span>
                </CardTitle>
                <CardDescription>
                  Comprehensive analysis of allocation outcomes and performance metrics
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8">
                {allocationState === 'completed' ? (
                  <div className="space-y-8">
                    {/* Key Metrics Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                        <div className="flex items-center space-x-3 mb-3">
                          <Target className="h-6 w-6 text-blue-600" />
                          <span className="font-semibold text-blue-900">Total Allocations</span>
                        </div>
                        <div className="text-3xl font-bold text-blue-900">{results.totalAllocations}</div>
                        <div className="text-sm text-blue-700">Out of {results.candidatesProcessed} candidates</div>
                      </div>

                      <div className="bg-orange-50 p-6 rounded-lg border border-orange-200">
                        <div className="flex items-center space-x-3 mb-3">
                          <Clock className="h-6 w-6 text-orange-600" />
                          <span className="font-semibold text-orange-900">Unallocated</span>
                        </div>
                        <div className="text-3xl font-bold text-orange-900">{results.unallocatedCandidates}</div>
                        <div className="text-sm text-orange-700">Candidates on waitlist</div>
                      </div>

                      <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                        <div className="flex items-center space-x-3 mb-3">
                          <Star className="h-6 w-6 text-green-600" />
                          <span className="font-semibold text-green-900">Match Quality</span>
                        </div>
                        <div className="text-3xl font-bold text-green-900">{results.averageMatchScore}%</div>
                        <div className="text-sm text-green-700">Average match score</div>
                      </div>

                      <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
                        <div className="flex items-center space-x-3 mb-3">
                          <Gauge className="h-6 w-6 text-purple-600" />
                          <span className="font-semibold text-purple-900">Success Rate</span>
                        </div>
                        <div className="text-3xl font-bold text-purple-900">{results.successRate}%</div>
                        <div className="text-sm text-purple-700">Allocation efficiency</div>
                      </div>
                    </div>

                    {/* Quota Compliance */}
                    <div className="bg-slate-50 p-8 rounded-lg border">
                      <h4 className="font-semibold text-slate-900 mb-6 flex items-center space-x-2">
                        <Shield className="h-5 w-5 text-green-600" />
                        <span>Quota Compliance & Affirmative Action</span>
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="bg-white p-4 rounded-lg border">
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-medium text-slate-800">Rural Districts</span>
                            <Badge className="bg-green-100 text-green-800">{results.ruralQuotaFilled}</Badge>
                          </div>
                          <Progress value={(results.ruralQuotaFilled / (results.totalAllocations * 0.2)) * 100} className="h-2" />
                          <div className="text-xs text-slate-600 mt-1">20% quota target</div>
                        </div>

                        <div className="bg-white p-4 rounded-lg border">
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-medium text-slate-800">SC/ST Category</span>
                            <Badge className="bg-purple-100 text-purple-800">{results.scStQuotaFilled}</Badge>
                          </div>
                          <Progress value={(results.scStQuotaFilled / (results.totalAllocations * 0.15)) * 100} className="h-2" />
                          <div className="text-xs text-slate-600 mt-1">15% quota target</div>
                        </div>

                        <div className="bg-white p-4 rounded-lg border">
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-medium text-slate-800">OBC Category</span>
                            <Badge className="bg-orange-100 text-orange-800">{results.obcQuotaFilled}</Badge>
                          </div>
                          <Progress value={(results.obcQuotaFilled / (results.totalAllocations * 0.27)) * 100} className="h-2" />
                          <div className="text-xs text-slate-600 mt-1">27% quota target</div>
                        </div>

                        <div className="bg-white p-4 rounded-lg border">
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-medium text-slate-800">PWD Category</span>
                            <Badge className="bg-blue-100 text-blue-800">{results.pwdQuotaFilled}</Badge>
                          </div>
                          <Progress value={(results.pwdQuotaFilled / (results.totalAllocations * 0.04)) * 100} className="h-2" />
                          <div className="text-xs text-slate-600 mt-1">4% quota target</div>
                        </div>
                      </div>
                    </div>

                    {/* Domain and Location Distribution */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                        <h4 className="font-semibold text-blue-900 mb-4 flex items-center space-x-2">
                          <PieChart className="h-5 w-5" />
                          <span>Allocations by Domain</span>
                        </h4>
                        <div className="space-y-3">
                          {Object.entries(results.allocationsByDomain).map(([domain, count]) => (
                            <div key={domain} className="flex items-center justify-between">
                              <span className="text-sm font-medium text-blue-800">{domain}</span>
                              <div className="flex items-center space-x-3">
                                <Progress 
                                  value={(count / results.totalAllocations) * 100} 
                                  className="w-20 h-2"
                                />
                                <span className="text-sm font-bold text-blue-900 w-8">{count}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="bg-emerald-50 p-6 rounded-lg border border-emerald-200">
                        <h4 className="font-semibold text-emerald-900 mb-4 flex items-center space-x-2">
                          <MapPin className="h-5 w-5" />
                          <span>Allocations by Location</span>
                        </h4>
                        <div className="space-y-3">
                          {Object.entries(results.allocationsByLocation).map(([location, count]) => (
                            <div key={location} className="flex items-center justify-between">
                              <span className="text-sm font-medium text-emerald-800">{location}</span>
                              <div className="flex items-center space-x-3">
                                <Progress 
                                  value={(count / results.totalAllocations) * 100} 
                                  className="w-20 h-2"
                                />
                                <span className="text-sm font-bold text-emerald-900 w-8">{count}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Performance Summary */}
                    <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                      <h4 className="font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                        <TrendingUp className="h-5 w-5" />
                        <span>Performance Summary</span>
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-gray-800">{results.processingTime}s</div>
                          <div className="text-sm text-gray-600">Total Processing Time</div>
                          <div className="text-xs text-green-600 mt-1">
                            ~{Math.round(results.candidatesProcessed / results.processingTime)} candidates/sec
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-gray-800">
                            {((results.totalAllocations / results.candidatesProcessed) * 100).toFixed(1)}%
                          </div>
                          <div className="text-sm text-gray-600">Allocation Rate</div>
                          <div className="text-xs text-green-600 mt-1">Above industry average</div>
                        </div>
                        <div className="text-center">
                          <div className="flex items-center justify-center space-x-1">
                            <CheckCircle className="h-6 w-6 text-green-600" />
                            <span className="text-2xl font-bold text-green-800">100%</span>
                          </div>
                          <div className="text-sm text-gray-600">Quota Compliance</div>
                          <div className="text-xs text-green-600 mt-1">All targets met</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <AlertTriangle className="h-16 w-16 text-gray-400 mx-auto mb-6" />
                    <h3 className="text-xl font-semibold text-gray-700 mb-3">No Results Available</h3>
                    <p className="text-gray-500 mb-6">
                      Run the allocation process to view detailed analytics and performance metrics.
                    </p>
                    <Button onClick={() => setShowConfirmDialog(true)} disabled={!isSystemReady}>
                      <Play className="h-4 w-4 mr-2" />
                      Start First Allocation
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="system" className="space-y-6">
            <Card className="border-0 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center space-x-2">
                      <Server className="h-5 w-5 text-green-600" />
                      <span>System Health & Status</span>
                    </CardTitle>
                    <CardDescription>
                      Real-time monitoring of system components and readiness
                    </CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={`${isSystemReady ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {isSystemReady ? 'Operational' : 'Issues Detected'}
                    </Badge>
                    <Button variant="outline" size="sm">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Refresh
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-8">
                <div className="space-y-8">
                  {/* Core Services Status */}
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-6 flex items-center space-x-2">
                      <Activity className="h-5 w-5" />
                      <span>Core Services</span>
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      <div className="bg-white p-6 rounded-lg border shadow-sm">
                        <div className="flex items-center space-x-3 mb-4">
                          <div className={`w-3 h-3 rounded-full ${
                            systemHealth.services.database === 'healthy' ? 'bg-green-500' : 
                            systemHealth.services.database === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                          }`} />
                          <span className="font-medium text-slate-800">Database</span>
                        </div>
                        <div className="space-y-2">
                          {getSystemStatusBadge(systemHealth.services.database)}
                          <div className="text-sm text-slate-600">
                            Response: {systemHealth.performance.responseTime}ms
                          </div>
                        </div>
                      </div>

                      <div className="bg-white p-6 rounded-lg border shadow-sm">
                        <div className="flex items-center space-x-3 mb-4">
                          <div className={`w-3 h-3 rounded-full ${
                            systemHealth.services.aiEngine === 'healthy' ? 'bg-green-500' : 
                            systemHealth.services.aiEngine === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                          }`} />
                          <span className="font-medium text-slate-800">AI Engine</span>
                        </div>
                        <div className="space-y-2">
                          {getSystemStatusBadge(systemHealth.services.aiEngine)}
                          <div className="text-sm text-slate-600">
                            Models loaded: 5/5
                          </div>
                        </div>
                      </div>

                      <div className="bg-white p-6 rounded-lg border shadow-sm">
                        <div className="flex items-center space-x-3 mb-4">
                          <div className={`w-3 h-3 rounded-full ${
                            systemHealth.services.allocationEngine === 'healthy' ? 'bg-green-500' : 
                            systemHealth.services.allocationEngine === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                          }`} />
                          <span className="font-medium text-slate-800">Allocation Engine</span>
                        </div>
                        <div className="space-y-2">
                          {getSystemStatusBadge(systemHealth.services.allocationEngine)}
                          <div className="text-sm text-slate-600">
                            Throughput: {systemHealth.performance.throughput}/min
                          </div>
                        </div>
                      </div>

                      <div className="bg-white p-6 rounded-lg border shadow-sm">
                        <div className="flex items-center space-x-3 mb-4">
                          <div className={`w-3 h-3 rounded-full ${
                            systemHealth.services.notificationService === 'healthy' ? 'bg-green-500' : 
                            systemHealth.services.notificationService === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                          }`} />
                          <span className="font-medium text-slate-800">Notifications</span>
                        </div>
                        <div className="space-y-2">
                          {getSystemStatusBadge(systemHealth.services.notificationService)}
                          <div className="text-sm text-slate-600">
                            Queue: Empty
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* System Performance Metrics */}
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-6 flex items-center space-x-2">
                      <Gauge className="h-5 w-5" />
                      <span>Performance Metrics</span>
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                        <div className="flex items-center justify-between mb-3">
                          <span className="font-medium text-blue-900">Average Response Time</span>
                          <Clock className="h-5 w-5 text-blue-600" />
                        </div>
                        <div className="text-3xl font-bold text-blue-900 mb-2">{systemHealth.performance.responseTime}ms</div>
                        <div className="text-sm text-blue-700">
                          {systemHealth.performance.responseTime < 200 ? 'Excellent' : 
                           systemHealth.performance.responseTime < 500 ? 'Good' : 'Needs attention'}
                        </div>
                      </div>

                      <div className="bg-emerald-50 p-6 rounded-lg border border-emerald-200">
                        <div className="flex items-center justify-between mb-3">
                          <span className="font-medium text-emerald-900">Processing Throughput</span>
                          <TrendingUp className="h-5 w-5 text-emerald-600" />
                        </div>
                        <div className="text-3xl font-bold text-emerald-900 mb-2">{systemHealth.performance.throughput}</div>
                        <div className="text-sm text-emerald-700">candidates/minute</div>
                      </div>

                      <div className="bg-orange-50 p-6 rounded-lg border border-orange-200">
                        <div className="flex items-center justify-between mb-3">
                          <span className="font-medium text-orange-900">Error Rate</span>
                          <AlertCircle className="h-5 w-5 text-orange-600" />
                        </div>
                        <div className="text-3xl font-bold text-orange-900 mb-2">
                          {(systemHealth.performance.errorRate * 100).toFixed(2)}%
                        </div>
                        <div className="text-sm text-orange-700">
                          {systemHealth.performance.errorRate < 0.01 ? 'Excellent' : 'Within tolerance'}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Data Integrity Status */}
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-6 flex items-center space-x-2">
                      <Shield className="h-5 w-5" />
                      <span>Data Integrity & Configuration</span>
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className={`p-6 rounded-lg border-2 ${
                        systemHealth.dataIntegrity ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                      }`}>
                        <div className="flex items-center space-x-3 mb-3">
                          {systemHealth.dataIntegrity ? (
                            <CheckCircle className="h-6 w-6 text-green-600" />
                          ) : (
                            <AlertTriangle className="h-6 w-6 text-red-600" />
                          )}
                          <span className={`font-medium ${systemHealth.dataIntegrity ? 'text-green-900' : 'text-red-900'}`}>
                            Data Integrity
                          </span>
                        </div>
                        <div className={`text-sm ${systemHealth.dataIntegrity ? 'text-green-700' : 'text-red-700'}`}>
                          {systemHealth.dataIntegrity ? 'All data validated and consistent' : 'Data validation issues detected'}
                        </div>
                      </div>

                      <div className={`p-6 rounded-lg border-2 ${
                        systemHealth.rulesConfigured ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                      }`}>
                        <div className="flex items-center space-x-3 mb-3">
                          {systemHealth.rulesConfigured ? (
                            <CheckCircle className="h-6 w-6 text-green-600" />
                          ) : (
                            <AlertTriangle className="h-6 w-6 text-red-600" />
                          )}
                          <span className={`font-medium ${systemHealth.rulesConfigured ? 'text-green-900' : 'text-red-900'}`}>
                            Rules Configuration
                          </span>
                        </div>
                        <div className={`text-sm ${systemHealth.rulesConfigured ? 'text-green-700' : 'text-red-700'}`}>
                          {systemHealth.rulesConfigured ? 'Allocation rules properly configured' : 'Rules configuration incomplete'}
                        </div>
                      </div>

                      <div className="bg-blue-50 p-6 rounded-lg border-2 border-blue-200">
                        <div className="flex items-center space-x-3 mb-3">
                          <Info className="h-6 w-6 text-blue-600" />
                          <span className="font-medium text-blue-900">Last Health Check</span>
                        </div>
                        <div className="text-sm text-blue-700">
                          {new Date(systemHealth.lastHealthCheck).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <Card className="border-0 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-indigo-50 border-b">
                <CardTitle className="flex items-center space-x-2">
                  <History className="h-5 w-5 text-purple-600" />
                  <span>Allocation History</span>
                </CardTitle>
                <CardDescription>
                  Historical data and trends from previous allocation runs
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8">
                <div className="text-center py-16">
                  <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-6" />
                  <h3 className="text-xl font-semibold text-gray-700 mb-3">No Historical Data Available</h3>
                  <p className="text-gray-500 mb-6">
                    Historical allocation data will appear here after running multiple allocation cycles.
                  </p>
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Export Historical Reports
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Confirmation Dialog */}
        <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
                <AlertCircle className="h-5 w-5 text-amber-600" />
                <span>Confirm Allocation Start</span>
              </DialogTitle>
              <DialogDescription>
                This will start the AI allocation process for all {1247} candidates. 
                The process cannot be undone once completed.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <div className="text-sm space-y-2">
                  <div className="flex justify-between">
                    <span>Candidates to process:</span>
                    <span className="font-semibold">1,247</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Available positions:</span>
                    <span className="font-semibold">342</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Estimated time:</span>
                    <span className="font-semibold">3-4 minutes</span>
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleRunAllocation} className="bg-blue-600 hover:bg-blue-700">
                <Play className="h-4 w-4 mr-2" />
                Start Allocation
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};
