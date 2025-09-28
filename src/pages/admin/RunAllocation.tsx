import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
} from 'lucide-react';

interface RunAllocationProps {}

export const RunAllocation: React.FC<RunAllocationProps> = () => {
  const [allocationState, setAllocationState] = useState<'idle' | 'running' | 'completed'>('idle');
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState({
    candidatesProcessed: 0,
    internshipsFilled: 0,
    quotaRulesApplied: false,
    ruralQuotaFilled: 0,
    scStQuotaFilled: 0,
    totalAllocations: 0,
    unallocatedCandidates: 0,
    processingTime: 0
  });

  const handleRunAllocation = async () => {
    setAllocationState('running');
    setProgress(0);

    // Simulate allocation process with progress updates
    const duration = 3000; // 3 seconds
    const intervals = 20;
    const increment = 100 / intervals;

    for (let i = 0; i <= intervals; i++) {
      await new Promise(resolve => setTimeout(resolve, duration / intervals));
      setProgress(i * increment);
    }

    // Set final results
    setResults({
      candidatesProcessed: 1247,
      internshipsFilled: 298,
      quotaRulesApplied: true,
      ruralQuotaFilled: 60,
      scStQuotaFilled: 45,
      totalAllocations: 298,
      unallocatedCandidates: 949,
      processingTime: 3.2
    });

    setAllocationState('completed');
  };

  const handleReset = () => {
    setAllocationState('idle');
    setProgress(0);
    setResults({
      candidatesProcessed: 0,
      internshipsFilled: 0,
      quotaRulesApplied: false,
      ruralQuotaFilled: 0,
      scStQuotaFilled: 0,
      totalAllocations: 0,
      unallocatedCandidates: 0,
      processingTime: 0
    });
  };

  const getSystemReadiness = () => {
    // Mock system readiness check
    return {
      dataIntegrity: true,
      rulesConfigured: true,
      systemStatus: 'operational'
    };
  };

  const systemReadiness = getSystemReadiness();

  return (
    <DashboardLayout title="Allocation Engine">
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="gov-card">
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Users className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-2xl font-bold">1,247</p>
                  <p className="text-sm text-muted-foreground">Total Candidates</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="gov-card">
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Building className="h-8 w-8 text-secondary" />
                <div>
                  <p className="text-2xl font-bold">342</p>
                  <p className="text-sm text-muted-foreground">Available Positions</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="gov-card">
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Zap className="h-8 w-8 text-accent" />
                <div>
                  <p className="text-2xl font-bold">
                    {allocationState === 'idle' ? 'Ready' : 
                     allocationState === 'running' ? 'Running' : 'Completed'}
                  </p>
                  <p className="text-sm text-muted-foreground">Engine Status</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="gov-card">
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <CheckCircle className={`h-8 w-8 ${systemReadiness.systemStatus === 'operational' ? 'text-green-600' : 'text-red-600'}`} />
                <div>
                  <p className="text-2xl font-bold">
                    {systemReadiness.systemStatus === 'operational' ? '100%' : '0%'}
                  </p>
                  <p className="text-sm text-muted-foreground">System Health</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="allocation" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="allocation">Run Allocation</TabsTrigger>
            <TabsTrigger value="results">Results</TabsTrigger>
            <TabsTrigger value="system">System Status</TabsTrigger>
          </TabsList>

          <TabsContent value="allocation" className="space-y-4">
            {/* Allocation Control */}
            <Card className="gov-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Zap className="h-5 w-5" />
                  <span>Allocation Engine Control</span>
                </CardTitle>
                <CardDescription>
                  Execute the AI-powered internship matching algorithm
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {allocationState === 'idle' && (
                  <div className="text-center space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-xl font-semibold text-blue-900">Ready to Run Allocation</h3>
                      <p className="text-muted-foreground max-w-2xl mx-auto">
                        The allocation engine will process all candidate applications and match them 
                        with available internship positions based on configured rules and weights.
                      </p>
                    </div>

                    {/* Pre-run Checks */}
                    <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                      <h4 className="font-semibold text-blue-900 mb-4 flex items-center space-x-2">
                        <CheckCircle className="h-5 w-5" />
                        <span>Pre-Run System Checks</span>
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span>Data Integrity: OK</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span>Rules Configured: OK</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span>System Status: OK</span>
                        </div>
                      </div>
                    </div>

                    <Button
                      onClick={handleRunAllocation}
                      size="lg"
                      className="px-12 py-6 text-lg"
                    >
                      <Play className="h-6 w-6 mr-3" />
                      Run Allocation
                    </Button>
                  </div>
                )}

                {allocationState === 'running' && (
                  <div className="text-center space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-center space-x-2">
                        <Clock className="h-6 w-6 text-blue-600 animate-spin" />
                        <h3 className="text-xl font-semibold text-blue-900">Processing Allocations...</h3>
                      </div>
                      <p className="text-muted-foreground">
                        The AI engine is analyzing candidate profiles and matching them with internship opportunities.
                      </p>
                    </div>

                    <div className="space-y-4 max-w-2xl mx-auto">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>{Math.round(progress)}%</span>
                      </div>
                      <Progress value={progress} className="h-4" />
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground">
                        <div>Analyzing skills...</div>
                        <div>Applying quotas...</div>
                        <div>Optimizing matches...</div>
                      </div>
                    </div>
                  </div>
                )}

                {allocationState === 'completed' && (
                  <div className="text-center space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-center space-x-2">
                        <CheckCircle className="h-6 w-6 text-green-600" />
                        <h3 className="text-xl font-semibold text-green-900">Allocation Completed Successfully!</h3>
                      </div>
                      <p className="text-muted-foreground">
                        All candidates have been processed and optimal matches have been generated.
                      </p>
                    </div>

                    {/* Results Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Card className="bg-green-50 border-green-200">
                        <CardContent className="p-4 text-center">
                          <div className="text-2xl font-bold text-green-900">{results.candidatesProcessed}</div>
                          <div className="text-sm text-green-700">Candidates Processed</div>
                        </CardContent>
                      </Card>

                      <Card className="bg-blue-50 border-blue-200">
                        <CardContent className="p-4 text-center">
                          <div className="text-2xl font-bold text-blue-900">{results.internshipsFilled}</div>
                          <div className="text-sm text-blue-700">Internships Filled</div>
                        </CardContent>
                      </Card>

                      <Card className="bg-purple-50 border-purple-200">
                        <CardContent className="p-4 text-center">
                          <div className="flex items-center justify-center space-x-1">
                            <CheckCircle className="h-5 w-5 text-green-600" />
                            <span className="text-green-900 font-medium">Applied</span>
                          </div>
                          <div className="text-sm text-purple-700">Quota Rules</div>
                        </CardContent>
                      </Card>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <Button variant="outline" onClick={handleReset}>
                        <RotateCcw className="h-4 w-4 mr-2" />
                        Run Again
                      </Button>
                      <Button>
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                      <Button variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        Export Results
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="results" className="space-y-4">
            <Card className="gov-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="h-5 w-5" />
                  <span>Detailed Results</span>
                </CardTitle>
                <CardDescription>
                  Comprehensive breakdown of allocation results and statistics
                </CardDescription>
              </CardHeader>
              <CardContent>
                {allocationState === 'completed' ? (
                  <div className="space-y-6">
                    {/* Main Statistics */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                        <div className="text-2xl font-bold text-blue-900">{results.totalAllocations}</div>
                        <div className="text-sm text-blue-700">Total Allocations</div>
                      </div>
                      <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                        <div className="text-2xl font-bold text-orange-900">{results.unallocatedCandidates}</div>
                        <div className="text-sm text-orange-700">Unallocated Candidates</div>
                      </div>
                      <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                        <div className="text-2xl font-bold text-green-900">{results.ruralQuotaFilled}</div>
                        <div className="text-sm text-green-700">Rural Quota Filled</div>
                      </div>
                      <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                        <div className="text-2xl font-bold text-purple-900">{results.scStQuotaFilled}</div>
                        <div className="text-sm text-purple-700">SC/ST Quota Filled</div>
                      </div>
                    </div>

                    {/* Performance Metrics */}
                    <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                      <h4 className="font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                        <TrendingUp className="h-5 w-5" />
                        <span>Performance Metrics</span>
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div className="flex justify-between">
                          <span>Processing Time:</span>
                          <span className="font-medium">{results.processingTime}s</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Allocation Rate:</span>
                          <span className="font-medium">
                            {((results.totalAllocations / results.candidatesProcessed) * 100).toFixed(1)}%
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Quota Compliance:</span>
                          <div className="flex items-center space-x-1">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <span className="font-medium text-green-600">100%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">No Results Available</h3>
                    <p className="text-gray-500">Run the allocation process to view detailed results.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="system" className="space-y-4">
            <Card className="gov-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5" />
                  <span>System Status</span>
                </CardTitle>
                <CardDescription>
                  Current system health and readiness for allocation processing
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                      <div className="flex items-center space-x-2 mb-2">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        <span className="font-medium text-green-900">Data Integrity</span>
                      </div>
                      <div className="text-sm text-green-700">All data validated and ready</div>
                      <Badge className="mt-2 bg-green-100 text-green-800">Healthy</Badge>
                    </div>

                    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                      <div className="flex items-center space-x-2 mb-2">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        <span className="font-medium text-green-900">Rules Engine</span>
                      </div>
                      <div className="text-sm text-green-700">Configuration verified</div>
                      <Badge className="mt-2 bg-green-100 text-green-800">Active</Badge>
                    </div>

                    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                      <div className="flex items-center space-x-2 mb-2">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        <span className="font-medium text-green-900">AI Engine</span>
                      </div>
                      <div className="text-sm text-green-700">Matching algorithms ready</div>
                      <Badge className="mt-2 bg-green-100 text-green-800">Operational</Badge>
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