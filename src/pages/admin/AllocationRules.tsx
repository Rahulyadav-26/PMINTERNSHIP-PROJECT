
import React, { useState, useEffect, useMemo } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
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
  Settings,
  Sliders,
  Users,
  MapPin,
  GraduationCap,
  RotateCcw,
  Save,
  AlertCircle,
  CheckCircle,
  Info,
  TrendingUp,
  Target,
  Brain,
  Clock,
  Eye,
  Edit,
  Plus,
  Trash2,
  HelpCircle,
  Download,
  Upload,
  History,
  Zap,
  Shield,
  Calculator,
  BarChart3,
  PieChart,
  Activity,
  Loader2,
  AlertTriangle,
  Star,
} from 'lucide-react';

interface WeightConfig {
  skill: number;
  qualification: number;
  location: number;
  experience: number;
  pastParticipation: number;
  gpa: number;
  projectPortfolio: number;
}

interface QuotaConfig {
  ruralDistricts: boolean;
  scSt: boolean;
  obc: boolean;
  pwd: boolean;
  economicallyWeaker: boolean;
}

interface AllocationMetrics {
  totalAllocations: number;
  successRate: number;
  averageMatchScore: number;
  quotaFulfillment: number;
}

interface ConfigurationHistory {
  id: string;
  timestamp: string;
  weights: WeightConfig;
  quotas: QuotaConfig;
  changedBy: string;
  notes: string;
}

export const AllocationRules: React.FC = () => {
  const [weights, setWeights] = useState<WeightConfig>({
    skill: 35,
    qualification: 20,
    location: 12,
    experience: 8,
    pastParticipation: -8,
    gpa: 15,
    projectPortfolio: 10
  });

  const [quotas, setQuotas] = useState<QuotaConfig>({
    ruralDistricts: true,
    scSt: true,
    obc: false,
    pwd: true,
    economicallyWeaker: false
  });

  const [isLoading, setIsLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState<{type: 'success' | 'error' | null; message: string}>({type: null, message: ''});
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [simulationResults, setSimulationResults] = useState<AllocationMetrics | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);

  // Mock historical data
  const [configHistory] = useState<ConfigurationHistory[]>([
    {
      id: '1',
      timestamp: '2025-09-20T10:30:00Z',
      weights: {skill: 40, qualification: 25, location: 15, experience: 10, pastParticipation: -10, gpa: 12, projectPortfolio: 8},
      quotas: {ruralDistricts: true, scSt: true, obc: false, pwd: false, economicallyWeaker: false},
      changedBy: 'Admin User',
      notes: 'Increased skill weight after feedback analysis'
    },
    {
      id: '2', 
      timestamp: '2025-09-15T14:15:00Z',
      weights: {skill: 35, qualification: 20, location: 12, experience: 8, pastParticipation: -8, gpa: 15, projectPortfolio: 10},
      quotas: {ruralDistricts: true, scSt: true, obc: true, pwd: true, economicallyWeaker: false},
      changedBy: 'System Admin',
      notes: 'Quarterly review adjustments'
    }
  ]);

  // Validation logic
  const validateConfiguration = useMemo(() => {
    const errors: string[] = [];
    const totalPositiveWeights = Object.entries(weights)
      .filter(([key]) => key !== 'pastParticipation')
      .reduce((sum, [, value]) => sum + Math.max(0, value), 0);

    if (totalPositiveWeights === 0) {
      errors.push('At least one positive weight must be greater than 0');
    }

    if (totalPositiveWeights > 100) {
      errors.push(`Total positive weights (${totalPositiveWeights}%) exceed 100%`);
    }

    if (weights.pastParticipation > 0) {
      errors.push('Past participation should be a penalty (negative value)');
    }

    const activeQuotas = Object.values(quotas).filter(Boolean).length;
    if (activeQuotas === 0) {
      errors.push('At least one quota type should be enabled for fair allocation');
    }

    setValidationErrors(errors);
    return errors;
  }, [weights, quotas]);

  const isConfigurationValid = validationErrors.length === 0;

  const handleWeightChange = (key: keyof WeightConfig, value: number) => {
    setWeights(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleQuotaToggle = (key: keyof QuotaConfig) => {
    setQuotas(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleSave = async () => {
    if (!isConfigurationValid) return;

    setIsLoading(true);
    setSaveStatus({type: null, message: ''});

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Simulate success/error
    const success = Math.random() > 0.2;

    if (success) {
      setSaveStatus({
        type: 'success',
        message: 'Configuration saved successfully. Changes will take effect in the next allocation cycle.'
      });
    } else {
      setSaveStatus({
        type: 'error',
        message: 'Failed to save configuration. Please try again or contact system administrator.'
      });
    }

    setIsLoading(false);
    setTimeout(() => setSaveStatus({type: null, message: ''}), 5000);
  };

  const handleReset = () => {
    setWeights({
      skill: 35,
      qualification: 20,
      location: 12,
      experience: 8,
      pastParticipation: -8,
      gpa: 15,
      projectPortfolio: 10
    });
    setQuotas({
      ruralDistricts: true,
      scSt: true,
      obc: false,
      pwd: true,
      economicallyWeaker: false
    });
    setSaveStatus({type: null, message: ''});
    setValidationErrors([]);
  };

  const runSimulation = async () => {
    setIsSimulating(true);

    // Simulate allocation algorithm running
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Generate mock results based on current configuration
    const skillWeight = weights.skill;
    const activeQuotaCount = Object.values(quotas).filter(Boolean).length;

    setSimulationResults({
      totalAllocations: 1247,
      successRate: Math.min(95, 70 + (skillWeight * 0.5) + (activeQuotaCount * 3)),
      averageMatchScore: Math.min(100, 65 + (skillWeight * 0.8)),
      quotaFulfillment: Math.min(100, 80 + (activeQuotaCount * 4))
    });

    setIsSimulating(false);
  };

  const getWeightColor = (weight: number) => {
    if (weight >= 30) return 'bg-blue-600';
    if (weight >= 20) return 'bg-blue-500';
    if (weight >= 10) return 'bg-blue-400';
    return 'bg-blue-300';
  };

  const getImpactLevel = (weight: number) => {
    if (weight >= 30) return { label: 'High Impact', color: 'text-blue-600', icon: TrendingUp };
    if (weight >= 20) return { label: 'Medium Impact', color: 'text-blue-500', icon: Target };
    if (weight >= 10) return { label: 'Low Impact', color: 'text-blue-400', icon: Activity };
    return { label: 'Minimal Impact', color: 'text-gray-500', icon: Clock };
  };

  const totalPositiveWeight = Object.entries(weights)
    .filter(([key]) => key !== 'pastParticipation')
    .reduce((sum, [, value]) => sum + Math.max(0, value), 0);

  return (
    <DashboardLayout title="Allocation Rules Configuration">
      <div className="space-y-8">
        {/* Save Status Alert */}
        {saveStatus.type && (
          <Alert className={saveStatus.type === 'success' ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}>
            {saveStatus.type === 'success' ? 
              <CheckCircle className="h-4 w-4 text-green-600" /> : 
              <AlertCircle className="h-4 w-4 text-red-600" />
            }
            <AlertDescription className={saveStatus.type === 'success' ? 'text-green-800' : 'text-red-800'}>
              {saveStatus.message}
            </AlertDescription>
          </Alert>
        )}

        {/* Validation Errors */}
        {validationErrors.length > 0 && (
          <Alert className="border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              <div className="font-semibold mb-2">Configuration Issues:</div>
              <ul className="list-disc list-inside space-y-1">
                {validationErrors.map((error, index) => (
                  <li key={index} className="text-sm">{error}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}

        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-blue-500 to-blue-600">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold text-white">{Object.values(weights).filter(w => w > 0).length}</p>
                  <p className="text-blue-100 text-sm">Active Weights</p>
                  <div className="flex items-center mt-2">
                    <Sliders className="h-4 w-4 text-blue-200 mr-1" />
                    <span className="text-blue-200 text-xs">{totalPositiveWeight}% allocated</span>
                  </div>
                </div>
                <Sliders className="h-12 w-12 text-blue-200" />
              </div>
              <div className="absolute -top-4 -right-4 w-16 h-16 bg-white/10 rounded-full" />
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-emerald-500 to-emerald-600">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold text-white">{Object.values(quotas).filter(q => q).length}</p>
                  <p className="text-emerald-100 text-sm">Active Quotas</p>
                  <div className="flex items-center mt-2">
                    <Shield className="h-4 w-4 text-emerald-200 mr-1" />
                    <span className="text-emerald-200 text-xs">Fair allocation</span>
                  </div>
                </div>
                <Users className="h-12 w-12 text-emerald-200" />
              </div>
              <div className="absolute -top-4 -right-4 w-16 h-16 bg-white/10 rounded-full" />
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-purple-500 to-purple-600">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold text-white">{totalPositiveWeight}%</p>
                  <p className="text-purple-100 text-sm">Total Weight</p>
                  <Progress value={totalPositiveWeight} className="mt-2 h-2 bg-purple-400" />
                </div>
                <Calculator className="h-12 w-12 text-purple-200" />
              </div>
              <div className="absolute -top-4 -right-4 w-16 h-16 bg-white/10 rounded-full" />
            </CardContent>
          </Card>

          <Card className={`relative overflow-hidden border-0 shadow-lg ${isConfigurationValid ? 'bg-gradient-to-br from-green-500 to-green-600' : 'bg-gradient-to-br from-red-500 to-red-600'}`}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold text-white">{isConfigurationValid ? 'Valid' : 'Issues'}</p>
                  <p className={`text-sm ${isConfigurationValid ? 'text-green-100' : 'text-red-100'}`}>Configuration</p>
                  <div className="flex items-center mt-2">
                    {isConfigurationValid ? 
                      <CheckCircle className="h-4 w-4 text-green-200 mr-1" /> : 
                      <AlertTriangle className="h-4 w-4 text-red-200 mr-1" />
                    }
                    <span className={`text-xs ${isConfigurationValid ? 'text-green-200' : 'text-red-200'}`}>
                      {isConfigurationValid ? 'Ready to deploy' : `${validationErrors.length} error(s)`}
                    </span>
                  </div>
                </div>
                {isConfigurationValid ? 
                  <CheckCircle className="h-12 w-12 text-green-200" /> : 
                  <AlertTriangle className="h-12 w-12 text-red-200" />
                }
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
                  <span>System Active</span>
                </Badge>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button variant="outline" onClick={runSimulation} disabled={isSimulating || !isConfigurationValid}>
                  {isSimulating ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Brain className="h-4 w-4 mr-2" />}
                  Run Simulation
                </Button>
                <Button variant="outline" onClick={() => setShowHistory(true)}>
                  <History className="h-4 w-4 mr-2" />
                  View History
                </Button>
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export Config
                </Button>
                <Button onClick={handleSave} disabled={isLoading || !isConfigurationValid} className="bg-blue-600 hover:bg-blue-700">
                  {isLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                  Save Configuration
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Simulation Results */}
        {simulationResults && (
          <Card className="border-0 shadow-lg bg-gradient-to-r from-indigo-50 to-purple-50">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5 text-indigo-600" />
                <span>Simulation Results</span>
                <Badge className="bg-indigo-100 text-indigo-800">Latest Run</Badge>
              </CardTitle>
              <CardDescription>
                Projected outcomes based on current configuration
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                  <div className="text-2xl font-bold text-slate-800">{simulationResults.totalAllocations.toLocaleString()}</div>
                  <div className="text-sm text-slate-600">Total Allocations</div>
                </div>
                <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                  <div className="text-2xl font-bold text-green-600">{simulationResults.successRate}%</div>
                  <div className="text-sm text-slate-600">Success Rate</div>
                  <Progress value={simulationResults.successRate} className="mt-2 h-2" />
                </div>
                <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                  <div className="text-2xl font-bold text-blue-600">{simulationResults.averageMatchScore}%</div>
                  <div className="text-sm text-slate-600">Avg Match Score</div>
                  <Progress value={simulationResults.averageMatchScore} className="mt-2 h-2" />
                </div>
                <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                  <div className="text-2xl font-bold text-purple-600">{simulationResults.quotaFulfillment}%</div>
                  <div className="text-sm text-slate-600">Quota Fulfillment</div>
                  <Progress value={simulationResults.quotaFulfillment} className="mt-2 h-2" />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Configuration Tabs */}
        <Tabs defaultValue="weights" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 h-12 p-1 bg-slate-100">
            <TabsTrigger value="weights" className="text-base font-semibold">Matching Weights</TabsTrigger>
            <TabsTrigger value="quotas" className="text-base font-semibold">Affirmative Action</TabsTrigger>
            <TabsTrigger value="advanced" className="text-base font-semibold">Advanced Settings</TabsTrigger>
            <TabsTrigger value="summary" className="text-base font-semibold">Summary</TabsTrigger>
          </TabsList>

          <TabsContent value="weights" className="space-y-6">
            <Card className="border-0 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center space-x-2">
                      <Sliders className="h-5 w-5 text-blue-600" />
                      <span>Weight Configuration</span>
                    </CardTitle>
                    <CardDescription>
                      Configure the importance of different factors in internship matching algorithm
                    </CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className="bg-blue-100 text-blue-800">Total: {totalPositiveWeight}%</Badge>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <HelpCircle className="h-4 w-4 text-slate-500" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Weights determine how much each factor influences the matching score.</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-8 space-y-8">
                {/* Skill Weight */}
                <div className="space-y-4 p-6 bg-slate-50 rounded-lg border">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <GraduationCap className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <Label className="text-base font-semibold text-slate-800">Skill Match Weight</Label>
                        <p className="text-sm text-slate-600">Technical skills alignment with job requirements</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Badge className="bg-blue-100 text-blue-800 text-lg px-3 py-1">{weights.skill}%</Badge>
                      {(() => {
                        const impact = getImpactLevel(weights.skill);
                        const IconComponent = impact.icon;
                        return (
                          <div className={`flex items-center space-x-1 ${impact.color}`}>
                            <IconComponent className="h-4 w-4" />
                            <span className="text-sm font-medium">{impact.label}</span>
                          </div>
                        );
                      })()}
                    </div>
                  </div>
                  <div className="space-y-3">
                    <Slider
                      value={[weights.skill]}
                      onValueChange={(value) => handleWeightChange('skill', value[0])}
                      max={50}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-slate-500">
                      <span>0%</span>
                      <span>25%</span>
                      <span>50%</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-3">
                      <div
                        className={`h-3 rounded-full transition-all duration-300 ${getWeightColor(weights.skill)}`}
                        style={{ width: `${(weights.skill / 50) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Qualification Weight */}
                <div className="space-y-4 p-6 bg-slate-50 rounded-lg border">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-emerald-100 rounded-lg">
                        <Star className="h-5 w-5 text-emerald-600" />
                      </div>
                      <div>
                        <Label className="text-base font-semibold text-slate-800">Academic Qualification</Label>
                        <p className="text-sm text-slate-600">Educational background and course relevance</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Badge className="bg-emerald-100 text-emerald-800 text-lg px-3 py-1">{weights.qualification}%</Badge>
                      {(() => {
                        const impact = getImpactLevel(weights.qualification);
                        const IconComponent = impact.icon;
                        return (
                          <div className={`flex items-center space-x-1 ${impact.color}`}>
                            <IconComponent className="h-4 w-4" />
                            <span className="text-sm font-medium">{impact.label}</span>
                          </div>
                        );
                      })()}
                    </div>
                  </div>
                  <div className="space-y-3">
                    <Slider
                      value={[weights.qualification]}
                      onValueChange={(value) => handleWeightChange('qualification', value[0])}
                      max={40}
                      step={1}
                      className="w-full"
                    />
                    <div className="w-full bg-slate-200 rounded-full h-3">
                      <div
                        className={`h-3 rounded-full transition-all duration-300 ${getWeightColor(weights.qualification)}`}
                        style={{ width: `${(weights.qualification / 40) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* GPA Weight */}
                <div className="space-y-4 p-6 bg-slate-50 rounded-lg border">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <TrendingUp className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <Label className="text-base font-semibold text-slate-800">Academic Performance (GPA)</Label>
                        <p className="text-sm text-slate-600">Grade point average and academic excellence</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Badge className="bg-purple-100 text-purple-800 text-lg px-3 py-1">{weights.gpa}%</Badge>
                      {(() => {
                        const impact = getImpactLevel(weights.gpa);
                        const IconComponent = impact.icon;
                        return (
                          <div className={`flex items-center space-x-1 ${impact.color}`}>
                            <IconComponent className="h-4 w-4" />
                            <span className="text-sm font-medium">{impact.label}</span>
                          </div>
                        );
                      })()}
                    </div>
                  </div>
                  <div className="space-y-3">
                    <Slider
                      value={[weights.gpa]}
                      onValueChange={(value) => handleWeightChange('gpa', value[0])}
                      max={30}
                      step={1}
                      className="w-full"
                    />
                    <div className="w-full bg-slate-200 rounded-full h-3">
                      <div
                        className={`h-3 rounded-full transition-all duration-300 ${getWeightColor(weights.gpa)}`}
                        style={{ width: `${(weights.gpa / 30) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Location Weight */}
                <div className="space-y-4 p-6 bg-slate-50 rounded-lg border">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-orange-100 rounded-lg">
                        <MapPin className="h-5 w-5 text-orange-600" />
                      </div>
                      <div>
                        <Label className="text-base font-semibold text-slate-800">Location Preference</Label>
                        <p className="text-sm text-slate-600">Geographic proximity and candidate preferences</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Badge className="bg-orange-100 text-orange-800 text-lg px-3 py-1">{weights.location}%</Badge>
                      {(() => {
                        const impact = getImpactLevel(weights.location);
                        const IconComponent = impact.icon;
                        return (
                          <div className={`flex items-center space-x-1 ${impact.color}`}>
                            <IconComponent className="h-4 w-4" />
                            <span className="text-sm font-medium">{impact.label}</span>
                          </div>
                        );
                      })()}
                    </div>
                  </div>
                  <div className="space-y-3">
                    <Slider
                      value={[weights.location]}
                      onValueChange={(value) => handleWeightChange('location', value[0])}
                      max={25}
                      step={1}
                      className="w-full"
                    />
                    <div className="w-full bg-slate-200 rounded-full h-3">
                      <div
                        className={`h-3 rounded-full transition-all duration-300 ${getWeightColor(weights.location)}`}
                        style={{ width: `${(weights.location / 25) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Past Participation Penalty */}
                <div className="space-y-4 p-6 bg-red-50 rounded-lg border border-red-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-red-100 rounded-lg">
                        <AlertCircle className="h-5 w-5 text-red-600" />
                      </div>
                      <div>
                        <Label className="text-base font-semibold text-slate-800">Past Participation Penalty</Label>
                        <p className="text-sm text-slate-600">Negative weight for previous program participants</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Badge className="bg-red-100 text-red-800 text-lg px-3 py-1">{weights.pastParticipation}%</Badge>
                      <div className="flex items-center space-x-1 text-red-600">
                        <AlertTriangle className="h-4 w-4" />
                        <span className="text-sm font-medium">Penalty</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <Slider
                      value={[Math.abs(weights.pastParticipation)]}
                      onValueChange={(value) => handleWeightChange('pastParticipation', -value[0])}
                      max={20}
                      step={1}
                      className="w-full"
                    />
                    <div className="w-full bg-red-200 rounded-full h-3">
                      <div
                        className="h-3 rounded-full bg-red-600 transition-all duration-300"
                        style={{ width: `${(Math.abs(weights.pastParticipation) / 20) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="quotas" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Rural Districts Quota */}
              <Card className="border-0 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b">
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-5 w-5 text-green-600" />
                      <span>Rural & Aspirational Districts</span>
                    </div>
                    <Switch
                      checked={quotas.ruralDistricts}
                      onCheckedChange={() => handleQuotaToggle('ruralDistricts')}
                    />
                  </CardTitle>
                  <CardDescription>
                    Special reservation for candidates from rural and aspirational districts
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-semibold text-green-900">Reservation Percentage</span>
                        <Badge className="bg-green-100 text-green-800 text-lg px-3 py-1">20%</Badge>
                      </div>
                      <Progress value={20} className="mb-3 h-3" />
                      <p className="text-sm text-green-700">
                        Reserved positions for candidates from 112 aspirational districts and rural areas
                      </p>
                    </div>
                    {quotas.ruralDistricts && (
                      <div className="p-4 bg-green-100 rounded-lg border-l-4 border-green-500">
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="h-5 w-5 text-green-600" />
                          <span className="text-green-800 font-medium">
                            Rural Districts Quota Active
                          </span>
                        </div>
                        <p className="text-sm text-green-700 mt-2">
                          Approximately 249 positions reserved based on current allocation volume
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* SC/ST Quota */}
              <Card className="border-0 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-purple-50 to-violet-50 border-b">
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Shield className="h-5 w-5 text-purple-600" />
                      <span>SC/ST Category</span>
                    </div>
                    <Switch
                      checked={quotas.scSt}
                      onCheckedChange={() => handleQuotaToggle('scSt')}
                    />
                  </CardTitle>
                  <CardDescription>
                    Constitutional mandate for scheduled caste/tribe representation
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-semibold text-purple-900">Reservation Percentage</span>
                        <Badge className="bg-purple-100 text-purple-800 text-lg px-3 py-1">15%</Badge>
                      </div>
                      <Progress value={15} className="mb-3 h-3" />
                      <p className="text-sm text-purple-700">
                        SC: 7.5% | ST: 7.5% as per constitutional provisions
                      </p>
                    </div>
                    {quotas.scSt && (
                      <div className="p-4 bg-purple-100 rounded-lg border-l-4 border-purple-500">
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="h-5 w-5 text-purple-600" />
                          <span className="text-purple-800 font-medium">
                            SC/ST Quota Active
                          </span>
                        </div>
                        <p className="text-sm text-purple-700 mt-2">
                          Approximately 187 positions reserved (93 SC + 94 ST)
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* OBC Quota */}
              <Card className="border-0 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-orange-50 to-yellow-50 border-b">
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Users className="h-5 w-5 text-orange-600" />
                      <span>OBC Category</span>
                    </div>
                    <Switch
                      checked={quotas.obc}
                      onCheckedChange={() => handleQuotaToggle('obc')}
                    />
                  </CardTitle>
                  <CardDescription>
                    Other Backward Classes reservation as per Mandal Commission
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-semibold text-orange-900">Reservation Percentage</span>
                        <Badge className="bg-orange-100 text-orange-800 text-lg px-3 py-1">27%</Badge>
                      </div>
                      <Progress value={27} className="mb-3 h-3" />
                      <p className="text-sm text-orange-700">
                        Reserved for non-creamy layer OBC candidates
                      </p>
                    </div>
                    {quotas.obc && (
                      <div className="p-4 bg-orange-100 rounded-lg border-l-4 border-orange-500">
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="h-5 w-5 text-orange-600" />
                          <span className="text-orange-800 font-medium">
                            OBC Quota Active
                          </span>
                        </div>
                        <p className="text-sm text-orange-700 mt-2">
                          Approximately 337 positions reserved for OBC candidates
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* PWD Quota */}
              <Card className="border-0 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50 border-b">
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Eye className="h-5 w-5 text-blue-600" />
                      <span>Persons with Disabilities</span>
                    </div>
                    <Switch
                      checked={quotas.pwd}
                      onCheckedChange={() => handleQuotaToggle('pwd')}
                    />
                  </CardTitle>
                  <CardDescription>
                    Accessibility and inclusion for differently-abled candidates
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-semibold text-blue-900">Reservation Percentage</span>
                        <Badge className="bg-blue-100 text-blue-800 text-lg px-3 py-1">4%</Badge>
                      </div>
                      <Progress value={4} className="mb-3 h-3" />
                      <p className="text-sm text-blue-700">
                        VI: 1% | HI: 1% | OH: 1% | ID: 1% as per RPwD Act 2016
                      </p>
                    </div>
                    {quotas.pwd && (
                      <div className="p-4 bg-blue-100 rounded-lg border-l-4 border-blue-500">
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="h-5 w-5 text-blue-600" />
                          <span className="text-blue-800 font-medium">
                            PWD Quota Active
                          </span>
                        </div>
                        <p className="text-sm text-blue-700 mt-2">
                          Approximately 50 positions with accessible internship placements
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="advanced" className="space-y-6">
            <Card className="border-0 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-slate-50 to-gray-50 border-b">
                <CardTitle className="flex items-center space-x-2">
                  <Settings className="h-5 w-5 text-slate-600" />
                  <span>Advanced Configuration</span>
                </CardTitle>
                <CardDescription>
                  Fine-tune allocation algorithm parameters and system behavior
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <Label className="text-base font-semibold">Matching Threshold</Label>
                    <div className="space-y-2">
                      <Slider defaultValue={[65]} max={100} step={1} />
                      <p className="text-sm text-slate-600">
                        Minimum match score required for allocation (Default: 65%)
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Label className="text-base font-semibold">Maximum Allocations per Student</Label>
                    <Select defaultValue="1">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 Allocation</SelectItem>
                        <SelectItem value="2">2 Allocations</SelectItem>
                        <SelectItem value="3">3 Allocations</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4">
                  <Label className="text-base font-semibold">Allocation Notes</Label>
                  <Textarea 
                    placeholder="Add notes about this configuration..."
                    className="min-h-20"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="summary" className="space-y-6">
            <Card className="border-0 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 border-b">
                <CardTitle className="flex items-center space-x-2">
                  <PieChart className="h-5 w-5 text-indigo-600" />
                  <span>Configuration Summary</span>
                </CardTitle>
                <CardDescription>
                  Complete overview of allocation rules and current settings
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-8">
                  {/* Weight Distribution Visualization */}
                  <div>
                    <h4 className="text-lg font-semibold mb-4 flex items-center space-x-2">
                      <BarChart3 className="h-5 w-5 text-indigo-600" />
                      <span>Weight Distribution</span>
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Object.entries(weights).map(([key, value]) => (
                        <div key={key} className={`p-4 rounded-lg border ${value < 0 ? 'bg-red-50 border-red-200' : 'bg-blue-50 border-blue-200'}`}>
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-medium capitalize">
                              {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                            </span>
                            <Badge className={value < 0 ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'}>
                              {value}%
                            </Badge>
                          </div>
                          <Progress value={Math.abs(value)} max={50} className="h-2" />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Active Quotas */}
                  <div>
                    <h4 className="text-lg font-semibold mb-4 flex items-center space-x-2">
                      <Shield className="h-5 w-5 text-emerald-600" />
                      <span>Active Quotas & Reservations</span>
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className={`p-4 rounded-lg border transition-all ${
                        quotas.ruralDistricts ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'
                      }`}>
                        <div className="flex items-center justify-between">
                          <span className="font-medium">Rural Districts</span>
                          <div className="flex items-center space-x-2">
                            <Badge className="bg-green-100 text-green-800">20%</Badge>
                            <Badge variant={quotas.ruralDistricts ? "default" : "secondary"}>
                              {quotas.ruralDistricts ? 'Active' : 'Inactive'}
                            </Badge>
                          </div>
                        </div>
                      </div>

                      <div className={`p-4 rounded-lg border transition-all ${
                        quotas.scSt ? 'bg-purple-50 border-purple-200' : 'bg-gray-50 border-gray-200'
                      }`}>
                        <div className="flex items-center justify-between">
                          <span className="font-medium">SC/ST Category</span>
                          <div className="flex items-center space-x-2">
                            <Badge className="bg-purple-100 text-purple-800">15%</Badge>
                            <Badge variant={quotas.scSt ? "default" : "secondary"}>
                              {quotas.scSt ? 'Active' : 'Inactive'}
                            </Badge>
                          </div>
                        </div>
                      </div>

                      <div className={`p-4 rounded-lg border transition-all ${
                        quotas.obc ? 'bg-orange-50 border-orange-200' : 'bg-gray-50 border-gray-200'
                      }`}>
                        <div className="flex items-center justify-between">
                          <span className="font-medium">OBC Category</span>
                          <div className="flex items-center space-x-2">
                            <Badge className="bg-orange-100 text-orange-800">27%</Badge>
                            <Badge variant={quotas.obc ? "default" : "secondary"}>
                              {quotas.obc ? 'Active' : 'Inactive'}
                            </Badge>
                          </div>
                        </div>
                      </div>

                      <div className={`p-4 rounded-lg border transition-all ${
                        quotas.pwd ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200'
                      }`}>
                        <div className="flex items-center justify-between">
                          <span className="font-medium">PWD Category</span>
                          <div className="flex items-center space-x-2">
                            <Badge className="bg-blue-100 text-blue-800">4%</Badge>
                            <Badge variant={quotas.pwd ? "default" : "secondary"}>
                              {quotas.pwd ? 'Active' : 'Inactive'}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4 justify-between items-center pt-6 border-t">
                    <div className="flex items-center space-x-2">
                      <Info className="h-4 w-4 text-blue-600" />
                      <span className="text-sm text-slate-600">
                        Configuration changes will apply to the next allocation cycle
                      </span>
                    </div>
                    <div className="flex space-x-3">
                      <Button variant="outline" onClick={handleReset}>
                        <RotateCcw className="h-4 w-4 mr-2" />
                        Reset to Defaults
                      </Button>
                      <Button onClick={handleSave} disabled={isLoading || !isConfigurationValid} className="bg-blue-600 hover:bg-blue-700">
                        {isLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                        Save Configuration
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Configuration History Dialog */}
        <Dialog open={showHistory} onOpenChange={setShowHistory}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
                <History className="h-5 w-5" />
                <span>Configuration History</span>
              </DialogTitle>
              <DialogDescription>
                Track changes to allocation rules and their impact
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {configHistory.map((config) => (
                <div key={config.id} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">
                      {new Date(config.timestamp).toLocaleDateString()} at {new Date(config.timestamp).toLocaleTimeString()}
                    </span>
                    <Badge variant="outline">{config.changedBy}</Badge>
                  </div>
                  <p className="text-sm text-slate-600 mb-2">{config.notes}</p>
                  <div className="text-xs text-slate-500">
                    Skill: {config.weights.skill}% | Qualification: {config.weights.qualification}% | 
                    Active Quotas: {Object.values(config.quotas).filter(Boolean).length}
                  </div>
                </div>
              ))}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowHistory(false)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};
