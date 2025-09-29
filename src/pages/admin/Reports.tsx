
import React, { useState, useMemo, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
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
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  BarChart3,
  Users,
  Building,
  TrendingUp,
  CheckCircle,
  AlertTriangle,
  Download,
  FileText,
  Target,
  PieChart,
  Calendar,
  MapPin,
  Filter,
  Search,
  RefreshCw,
  Share2,
  Print,
  Mail,
  Eye,
  Settings,
  Activity,
  Clock,
  Award,
  Shield,
  Zap,
  Globe,
  BookOpen,
  GraduationCap,
  Briefcase,
  Star,
  TrendingDown,
  ArrowUp,
  ArrowDown,
  Info,
  ExternalLink,
  LineChart,
  DollarSign,
  Percent,
  Hash,
  Timer,
  Database,
  CloudRain,
  Sun,
  Moon,
  Sunrise,
  Sunset,
  MoreHorizontal,
  ChevronRight,
  ChevronDown,
  Maximize2,
  Minimize2,
  RotateCcw,
  Bookmark,
  Flag,
  AlertCircle,
} from 'lucide-react';

interface TimeFilter {
  label: string;
  value: string;
  days: number;
}

interface ReportMetrics {
  candidates: {
    total: number;
    placed: number;
    unplaced: number;
    pending: number;
    withdrawn: number;
  };
  internships: {
    total: number;
    filled: number;
    vacant: number;
    overFilled: number;
  };
  quotas: {
    rural: {
      target: number;
      achieved: number;
      filled: number;
      required: number;
    };
    scSt: {
      target: number;
      achieved: number;
      filled: number;
      required: number;
    };
    obc: {
      target: number;
      achieved: number;
      filled: number;
      required: number;
    };
    pwd: {
      target: number;
      achieved: number;
      filled: number;
      required: number;
    };
    overall: {
      target: number;
      achieved: number;
      compliance: string;
    };
  };
  performance: {
    allocationRate: number;
    processingTime: number;
    systemEfficiency: number;
    userSatisfaction: number;
    matchAccuracy: number;
    responseTime: number;
  };
  trends: {
    last7Days: number[];
    last30Days: number[];
    monthlyGrowth: number;
    weeklyGrowth: number;
  };
  breakdown: {
    byLocation: Array<{
      city: string;
      state: string;
      internships: number;
      filled: number;
      avgStipend: number;
      topDomain: string;
    }>;
    byDomain: Array<{
      domain: string;
      internships: number;
      filled: number;
      avgScore: number;
      avgStipend: number;
      growthRate: number;
    }>;
    byUniversity: Array<{
      name: string;
      tier: string;
      candidates: number;
      placed: number;
      avgScore: number;
      successRate: number;
    }>;
    byCompany: Array<{
      name: string;
      sector: string;
      positions: number;
      filled: number;
      avgStipend: number;
      rating: number;
    }>;
  };
}

export const Reports: React.FC = () => {
  const [selectedTimeFilter, setSelectedTimeFilter] = useState('7days');
  const [selectedReportType, setSelectedReportType] = useState('comprehensive');
  const [searchTerm, setSearchTerm] = useState('');
  const [isExporting, setIsExporting] = useState(false);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [expandedSections, setExpandedSections] = useState<string[]>(['overview']);
  const [comparisonMode, setComparisonMode] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState('placement');
  const [isLoading, setIsLoading] = useState(false);

  const timeFilters: TimeFilter[] = [
    { label: 'Last 7 Days', value: '7days', days: 7 },
    { label: 'Last 30 Days', value: '30days', days: 30 },
    { label: 'Last Quarter', value: 'quarter', days: 90 },
    { label: 'Last 6 Months', value: '6months', days: 180 },
    { label: 'This Year', value: 'year', days: 365 }
  ];

  // Enhanced mock data with comprehensive metrics
  const reportData: ReportMetrics = {
    candidates: {
      total: 1247,
      placed: 298,
      unplaced: 849,
      pending: 75,
      withdrawn: 25
    },
    internships: {
      total: 342,
      filled: 298,
      vacant: 38,
      overFilled: 6
    },
    quotas: {
      rural: {
        target: 20,
        achieved: 18.5,
        filled: 55,
        required: 60
      },
      scSt: {
        target: 15,
        achieved: 14.8,
        filled: 44,
        required: 45
      },
      obc: {
        target: 27,
        achieved: 26.2,
        filled: 78,
        required: 81
      },
      pwd: {
        target: 4,
        achieved: 3.8,
        filled: 11,
        required: 12
      },
      overall: {
        target: 100,
        achieved: 95.8,
        compliance: 'Excellent'
      }
    },
    performance: {
      allocationRate: 23.9,
      processingTime: 3.2,
      systemEfficiency: 94.5,
      userSatisfaction: 89,
      matchAccuracy: 92.3,
      responseTime: 0.15
    },
    trends: {
      last7Days: [15, 23, 18, 34, 28, 42, 38],
      last30Days: [25, 28, 32, 29, 35, 38, 42, 45, 38, 41, 47, 52, 48, 55, 61, 58, 62, 65, 68, 72, 69, 74, 78, 75, 82, 86, 83, 89, 92, 95],
      monthlyGrowth: 12.5,
      weeklyGrowth: 8.3
    },
    breakdown: {
      byLocation: [
        { city: 'Bangalore', state: 'Karnataka', internships: 85, filled: 78, avgStipend: 45000, topDomain: 'Technology' },
        { city: 'Mumbai', state: 'Maharashtra', internships: 72, filled: 65, avgStipend: 38000, topDomain: 'Finance' },
        { city: 'Hyderabad', state: 'Telangana', internships: 54, filled: 49, avgStipend: 42000, topDomain: 'Technology' },
        { city: 'Delhi', state: 'Delhi', internships: 48, filled: 43, avgStipend: 35000, topDomain: 'Consulting' },
        { city: 'Pune', state: 'Maharashtra', internships: 35, filled: 32, avgStipend: 32000, topDomain: 'Manufacturing' },
        { city: 'Chennai', state: 'Tamil Nadu', internships: 28, filled: 19, avgStipend: 30000, topDomain: 'Healthcare' },
        { city: 'Ahmedabad', state: 'Gujarat', internships: 20, filled: 12, avgStipend: 25000, topDomain: 'Manufacturing' }
      ],
      byDomain: [
        { domain: 'Technology', internships: 125, filled: 118, avgScore: 88.5, avgStipend: 48000, growthRate: 15.2 },
        { domain: 'Finance', internships: 68, filled: 58, avgScore: 85.2, avgStipend: 42000, growthRate: 8.7 },
        { domain: 'Healthcare', internships: 45, filled: 38, avgScore: 82.1, avgStipend: 35000, growthRate: 12.3 },
        { domain: 'Manufacturing', internships: 42, filled: 35, avgScore: 79.8, avgStipend: 30000, growthRate: 5.6 },
        { domain: 'Consulting', internships: 35, filled: 28, avgScore: 86.7, avgStipend: 38000, growthRate: 10.1 },
        { domain: 'Education', internships: 27, filled: 21, avgScore: 81.4, avgStipend: 25000, growthRate: 7.8 }
      ],
      byUniversity: [
        { name: 'IIT Delhi', tier: 'Tier 1', candidates: 45, placed: 42, avgScore: 94.2, successRate: 93.3 },
        { name: 'IIT Bombay', tier: 'Tier 1', candidates: 38, placed: 36, avgScore: 93.8, successRate: 94.7 },
        { name: 'NIT Karnataka', tier: 'Tier 1', candidates: 52, placed: 45, avgScore: 89.5, successRate: 86.5 },
        { name: 'BITS Pilani', tier: 'Tier 1', candidates: 35, placed: 31, avgScore: 91.2, successRate: 88.6 },
        { name: 'Delhi University', tier: 'Tier 2', candidates: 68, placed: 48, avgScore: 82.3, successRate: 70.6 },
        { name: 'VIT Vellore', tier: 'Tier 2', candidates: 72, placed: 52, avgScore: 84.1, successRate: 72.2 }
      ],
      byCompany: [
        { name: 'Google India', sector: 'Technology', positions: 50, filled: 50, avgStipend: 80000, rating: 4.8 },
        { name: 'Microsoft', sector: 'Technology', positions: 35, filled: 33, avgStipend: 75000, rating: 4.7 },
        { name: 'Infosys', sector: 'Technology', positions: 100, filled: 82, avgStipend: 25000, rating: 4.2 },
        { name: 'HDFC Bank', sector: 'Finance', positions: 45, filled: 38, avgStipend: 35000, rating: 4.3 },
        { name: 'Tata Consultancy', sector: 'Consulting', positions: 60, filled: 48, avgStipend: 28000, rating: 4.1 },
        { name: 'Apollo Hospitals', sector: 'Healthcare', positions: 25, filled: 20, avgStipend: 30000, rating: 4.4 }
      ]
    }
  };

  // Calculate derived metrics
  const derivedMetrics = useMemo(() => {
    return {
      placementRate: (reportData.candidates.placed / reportData.candidates.total) * 100,
      fillRate: (reportData.internships.filled / reportData.internships.total) * 100,
      pendingRate: (reportData.candidates.pending / reportData.candidates.total) * 100,
      avgStipend: reportData.breakdown.byDomain.reduce((sum, domain) => sum + domain.avgStipend * domain.filled, 0) / reportData.candidates.placed,
      topPerformingCity: reportData.breakdown.byLocation.reduce((top, current) => 
        (current.filled / current.internships) > (top.filled / top.internships) ? current : top
      ),
      topPerformingDomain: reportData.breakdown.byDomain.reduce((top, current) => 
        (current.filled / current.internships) > (top.filled / top.internships) ? current : top
      )
    };
  }, [reportData]);

  const handleExport = async (format: 'pdf' | 'excel' | 'csv') => {
    setIsExporting(true);

    // Simulate export process
    await new Promise(resolve => setTimeout(resolve, 2000));

    console.log(`Exporting comprehensive report in ${format.toUpperCase()} format...`);
    setIsExporting(false);
  };

  const handleRefreshData = async () => {
    setIsLoading(true);

    // Simulate data refresh
    await new Promise(resolve => setTimeout(resolve, 1500));

    setIsLoading(false);
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev => 
      prev.includes(section) 
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  const getQuotaStatus = (achieved: number, target: number) => {
    const percentage = (achieved / target) * 100;
    if (percentage >= 95) return { 
      status: 'Excellent', 
      color: 'text-green-600', 
      bgColor: 'bg-green-50', 
      borderColor: 'border-green-200',
      icon: CheckCircle
    };
    if (percentage >= 85) return { 
      status: 'Good', 
      color: 'text-blue-600', 
      bgColor: 'bg-blue-50', 
      borderColor: 'border-blue-200',
      icon: CheckCircle
    };
    if (percentage >= 70) return { 
      status: 'Fair', 
      color: 'text-orange-600', 
      bgColor: 'bg-orange-50', 
      borderColor: 'border-orange-200',
      icon: AlertCircle
    };
    return { 
      status: 'Critical', 
      color: 'text-red-600', 
      bgColor: 'bg-red-50', 
      borderColor: 'border-red-200',
      icon: AlertTriangle
    };
  };

  const getTrendIcon = (value: number) => {
    if (value > 0) return <ArrowUp className="h-4 w-4 text-green-600" />;
    if (value < 0) return <ArrowDown className="h-4 w-4 text-red-600" />;
    return <Activity className="h-4 w-4 text-gray-600" />;
  };

  const currentDate = new Date().toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const currentTime = new Date().toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <DashboardLayout title="Comprehensive Analytics & Reports">
      <div className="space-y-8">
        {/* Enhanced Report Header */}
        <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-50 to-indigo-50">
          <CardContent className="p-8">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-6 lg:space-y-0">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold text-slate-900">PM Internship Scheme</h1>
                <h2 className="text-xl text-blue-700 font-semibold">Comprehensive Allocation Analytics</h2>
                <div className="flex items-center space-x-4 text-sm text-slate-600">
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>Generated on {currentDate}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>Last updated: {currentTime}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Activity className="h-4 w-4" />
                    <span>Allocation Cycle 2025</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                <Select value={selectedTimeFilter} onValueChange={setSelectedTimeFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {timeFilters.map(filter => (
                      <SelectItem key={filter.value} value={filter.value}>
                        {filter.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button variant="outline" onClick={handleRefreshData} disabled={isLoading}>
                  <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
                <Button variant="outline">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      <Download className="h-4 w-4 mr-2" />
                      Export Report
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Export Report</DialogTitle>
                      <DialogDescription>
                        Choose your preferred format for the comprehensive allocation report.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid grid-cols-1 gap-4">
                      <Button 
                        variant="outline" 
                        onClick={() => handleExport('pdf')}
                        disabled={isExporting}
                        className="justify-start"
                      >
                        <FileText className="h-4 w-4 mr-3" />
                        <div className="text-left">
                          <div className="font-medium">PDF Report</div>
                          <div className="text-xs text-muted-foreground">Comprehensive report with charts and analysis</div>
                        </div>
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => handleExport('excel')}
                        disabled={isExporting}
                        className="justify-start"
                      >
                        <BarChart3 className="h-4 w-4 mr-3" />
                        <div className="text-left">
                          <div className="font-medium">Excel Workbook</div>
                          <div className="text-xs text-muted-foreground">Data tables with pivot analysis</div>
                        </div>
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => handleExport('csv')}
                        disabled={isExporting}
                        className="justify-start"
                      >
                        <Database className="h-4 w-4 mr-3" />
                        <div className="text-left">
                          <div className="font-medium">CSV Data</div>
                          <div className="text-xs text-muted-foreground">Raw data for external analysis</div>
                        </div>
                      </Button>
                    </div>
                    <DialogFooter>
                      <Button variant="outline">Cancel</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Key Performance Indicators */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-emerald-500 to-emerald-600">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold text-white">{reportData.candidates.placed}</p>
                  <p className="text-emerald-100 text-sm">Candidates Placed</p>
                  <div className="flex items-center mt-2">
                    {getTrendIcon(reportData.trends.weeklyGrowth)}
                    <span className="text-emerald-200 text-xs ml-1">
                      {reportData.trends.weeklyGrowth > 0 ? '+' : ''}{reportData.trends.weeklyGrowth}% this week
                    </span>
                  </div>
                </div>
                <Users className="h-12 w-12 text-emerald-200" />
              </div>
              <div className="absolute -top-4 -right-4 w-16 h-16 bg-white/10 rounded-full" />
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-blue-500 to-blue-600">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold text-white">{reportData.internships.filled}</p>
                  <p className="text-blue-100 text-sm">Positions Filled</p>
                  <div className="flex items-center mt-2">
                    <Target className="h-4 w-4 text-blue-200 mr-1" />
                    <span className="text-blue-200 text-xs">
                      {Math.round(derivedMetrics.fillRate)}% fill rate
                    </span>
                  </div>
                </div>
                <Building className="h-12 w-12 text-blue-200" />
              </div>
              <div className="absolute -top-4 -right-4 w-16 h-16 bg-white/10 rounded-full" />
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-purple-500 to-purple-600">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold text-white">{reportData.quotas.overall.achieved}%</p>
                  <p className="text-purple-100 text-sm">Quota Compliance</p>
                  <div className="flex items-center mt-2">
                    <Shield className="h-4 w-4 text-purple-200 mr-1" />
                    <span className="text-purple-200 text-xs">
                      {reportData.quotas.overall.compliance}
                    </span>
                  </div>
                </div>
                <Target className="h-12 w-12 text-purple-200" />
              </div>
              <div className="absolute -top-4 -right-4 w-16 h-16 bg-white/10 rounded-full" />
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-orange-500 to-orange-600">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold text-white">{Math.round(derivedMetrics.placementRate)}%</p>
                  <p className="text-orange-100 text-sm">Success Rate</p>
                  <div className="flex items-center mt-2">
                    <Star className="h-4 w-4 text-orange-200 mr-1" />
                    <span className="text-orange-200 text-xs">
                      {reportData.performance.matchAccuracy}% match accuracy
                    </span>
                  </div>
                </div>
                <TrendingUp className="h-12 w-12 text-orange-200" />
              </div>
              <div className="absolute -top-4 -right-4 w-16 h-16 bg-white/10 rounded-full" />
            </CardContent>
          </Card>
        </div>

        {/* Quick Insights Bar */}
        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <MapPin className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <div className="font-semibold text-slate-800">Top Performing City</div>
                  <div className="text-sm text-slate-600">
                    {derivedMetrics.topPerformingCity.city} - {Math.round((derivedMetrics.topPerformingCity.filled / derivedMetrics.topPerformingCity.internships) * 100)}% fill rate
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="p-3 bg-emerald-100 rounded-lg">
                  <Briefcase className="h-6 w-6 text-emerald-600" />
                </div>
                <div>
                  <div className="font-semibold text-slate-800">Leading Domain</div>
                  <div className="text-sm text-slate-600">
                    {derivedMetrics.topPerformingDomain.domain} - {derivedMetrics.topPerformingDomain.filled} placements
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <DollarSign className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <div className="font-semibold text-slate-800">Average Stipend</div>
                  <div className="text-sm text-slate-600">
                    ₹{Math.round(derivedMetrics.avgStipend).toLocaleString()}/month
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Analytics Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 h-12 p-1 bg-slate-100">
            <TabsTrigger value="overview" className="text-base font-semibold">Executive Summary</TabsTrigger>
            <TabsTrigger value="quotas" className="text-base font-semibold">Quota Analysis</TabsTrigger>
            <TabsTrigger value="breakdown" className="text-base font-semibold">Geographic Insights</TabsTrigger>
            <TabsTrigger value="performance" className="text-base font-semibold">Performance Metrics</TabsTrigger>
            <TabsTrigger value="trends" className="text-base font-semibold">Trend Analysis</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Placement Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-0 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-emerald-50 to-green-50 border-b">
                  <CardTitle className="flex items-center space-x-2">
                    <Users className="h-5 w-5 text-emerald-600" />
                    <span>Candidate Placement Analytics</span>
                  </CardTitle>
                  <CardDescription>
                    Comprehensive view of candidate allocation outcomes
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold text-slate-800">Total Registered</span>
                      <span className="text-3xl font-bold text-emerald-900">{reportData.candidates.total.toLocaleString()}</span>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <div className="flex items-center space-x-2">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <span className="text-sm font-medium">Successfully Placed</span>
                          </div>
                          <span className="text-sm font-bold">
                            {reportData.candidates.placed} ({Math.round(derivedMetrics.placementRate)}%)
                          </span>
                        </div>
                        <Progress value={derivedMetrics.placementRate} className="h-3 bg-green-100" />
                      </div>

                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <div className="flex items-center space-x-2">
                            <Clock className="h-4 w-4 text-orange-600" />
                            <span className="text-sm font-medium">Under Review</span>
                          </div>
                          <span className="text-sm font-bold">
                            {reportData.candidates.pending} ({Math.round(derivedMetrics.pendingRate)}%)
                          </span>
                        </div>
                        <Progress value={derivedMetrics.pendingRate} className="h-3 bg-orange-100" />
                      </div>

                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <div className="flex items-center space-x-2">
                            <AlertCircle className="h-4 w-4 text-slate-600" />
                            <span className="text-sm font-medium">Awaiting Placement</span>
                          </div>
                          <span className="text-sm font-bold">
                            {reportData.candidates.unplaced} ({Math.round((reportData.candidates.unplaced / reportData.candidates.total) * 100)}%)
                          </span>
                        </div>
                        <Progress value={(reportData.candidates.unplaced / reportData.candidates.total) * 100} className="h-3 bg-slate-200" />
                      </div>
                    </div>

                    {/* Status Breakdown Cards */}
                    <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                      <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                        <div className="text-2xl font-bold text-green-900">{reportData.candidates.placed}</div>
                        <div className="text-sm text-green-700">Active Internships</div>
                        <div className="text-xs text-green-600 mt-1">
                          Avg. score: {reportData.performance.matchAccuracy}%
                        </div>
                      </div>
                      <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                        <div className="text-2xl font-bold text-orange-900">{reportData.candidates.pending}</div>
                        <div className="text-sm text-orange-700">Processing</div>
                        <div className="text-xs text-orange-600 mt-1">
                          Est. time: {reportData.performance.processingTime}s avg
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
                  <CardTitle className="flex items-center space-x-2">
                    <Building className="h-5 w-5 text-blue-600" />
                    <span>Internship Capacity Analysis</span>
                  </CardTitle>
                  <CardDescription>
                    Real-time monitoring of position availability and utilization
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold text-slate-800">Total Positions</span>
                      <span className="text-3xl font-bold text-blue-900">{reportData.internships.total}</span>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <div className="flex items-center space-x-2">
                            <CheckCircle className="h-4 w-4 text-blue-600" />
                            <span className="text-sm font-medium">Positions Filled</span>
                          </div>
                          <span className="text-sm font-bold">
                            {reportData.internships.filled} ({Math.round(derivedMetrics.fillRate)}%)
                          </span>
                        </div>
                        <Progress value={derivedMetrics.fillRate} className="h-3 bg-blue-100" />
                      </div>

                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <div className="flex items-center space-x-2">
                            <AlertTriangle className="h-4 w-4 text-red-600" />
                            <span className="text-sm font-medium">Over-filled</span>
                          </div>
                          <span className="text-sm font-bold">
                            {reportData.internships.overFilled} ({Math.round((reportData.internships.overFilled / reportData.internships.total) * 100)}%)
                          </span>
                        </div>
                        <Progress value={(reportData.internships.overFilled / reportData.internships.total) * 100} className="h-3 bg-red-100" />
                      </div>

                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <div className="flex items-center space-x-2">
                            <Clock className="h-4 w-4 text-slate-600" />
                            <span className="text-sm font-medium">Available</span>
                          </div>
                          <span className="text-sm font-bold">
                            {reportData.internships.vacant} ({Math.round((reportData.internships.vacant / reportData.internships.total) * 100)}%)
                          </span>
                        </div>
                        <Progress value={(reportData.internships.vacant / reportData.internships.total) * 100} className="h-3 bg-slate-200" />
                      </div>
                    </div>

                    {/* Capacity Breakdown Cards */}
                    <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                        <div className="text-2xl font-bold text-blue-900">{reportData.internships.filled}</div>
                        <div className="text-sm text-blue-700">Active Placements</div>
                        <div className="text-xs text-blue-600 mt-1">
                          Fill rate: {Math.round(derivedMetrics.fillRate)}%
                        </div>
                      </div>
                      <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                        <div className="text-2xl font-bold text-slate-900">{reportData.internships.vacant}</div>
                        <div className="text-sm text-slate-700">Open Positions</div>
                        <div className="text-xs text-slate-600 mt-1">
                          Ready to fill
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* University Performance Table */}
            <Card className="border-0 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 border-b">
                <CardTitle className="flex items-center space-x-2">
                  <GraduationCap className="h-5 w-5 text-purple-600" />
                  <span>University Performance Leaderboard</span>
                </CardTitle>
                <CardDescription>
                  Top performing institutions by placement success rate
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-slate-50">
                        <TableHead className="font-semibold">Rank</TableHead>
                        <TableHead className="font-semibold">Institution</TableHead>
                        <TableHead className="font-semibold">Tier</TableHead>
                        <TableHead className="font-semibold">Candidates</TableHead>
                        <TableHead className="font-semibold">Placed</TableHead>
                        <TableHead className="font-semibold">Success Rate</TableHead>
                        <TableHead className="font-semibold">Avg Score</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {reportData.breakdown.byUniversity
                        .sort((a, b) => b.successRate - a.successRate)
                        .map((university, index) => (
                        <TableRow key={university.name} className="hover:bg-slate-50">
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                                index === 0 ? 'bg-yellow-100 text-yellow-800' :
                                index === 1 ? 'bg-gray-100 text-gray-800' :
                                index === 2 ? 'bg-orange-100 text-orange-800' :
                                'bg-slate-100 text-slate-800'
                              }`}>
                                {index + 1}
                              </div>
                              {index < 3 && <Star className="h-4 w-4 text-yellow-500" />}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="font-medium text-slate-900">{university.name}</div>
                          </TableCell>
                          <TableCell>
                            <Badge className={
                              university.tier === 'Tier 1' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                            }>
                              {university.tier}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <span className="font-medium">{university.candidates}</span>
                          </TableCell>
                          <TableCell>
                            <span className="font-medium text-green-800">{university.placed}</span>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <span className="font-bold">{university.successRate.toFixed(1)}%</span>
                              <Progress value={university.successRate} className="w-16 h-2" />
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className="font-medium">{university.avgScore.toFixed(1)}</span>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="quotas" className="space-y-6">
            <Card className="border-0 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b">
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="h-5 w-5 text-green-600" />
                  <span>Constitutional Quota Compliance Analysis</span>
                </CardTitle>
                <CardDescription>
                  Detailed breakdown of affirmative action implementation and compliance
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8">
                <div className="space-y-8">
                  {/* Overall Compliance Status */}
                  <div className="text-center p-8 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center justify-center space-x-3 mb-4">
                      <CheckCircle className="h-12 w-12 text-green-600" />
                      <div>
                        <div className="text-4xl font-bold text-green-900">{reportData.quotas.overall.achieved}%</div>
                        <div className="text-green-700 font-medium">Overall Compliance Score</div>
                      </div>
                    </div>
                    <Badge className="bg-green-100 text-green-800 text-lg px-4 py-2">
                      {reportData.quotas.overall.compliance} Compliance
                    </Badge>
                  </div>

                  {/* Detailed Quota Analysis */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Rural Districts Quota */}
                    <div className={`p-6 rounded-lg border-2 ${getQuotaStatus(reportData.quotas.rural.achieved, reportData.quotas.rural.target).bgColor} ${getQuotaStatus(reportData.quotas.rural.achieved, reportData.quotas.rural.target).borderColor}`}>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-slate-900 flex items-center space-x-2">
                          <MapPin className="h-5 w-5 text-green-600" />
                          <span>Rural Districts Quota</span>
                        </h3>
                        <Badge className={`${getQuotaStatus(reportData.quotas.rural.achieved, reportData.quotas.rural.target).color} bg-white`}>
                          {getQuotaStatus(reportData.quotas.rural.achieved, reportData.quotas.rural.target).status}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-3 gap-4 mb-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-slate-900">{reportData.quotas.rural.target}%</div>
                          <div className="text-sm text-slate-600">Target</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-900">{reportData.quotas.rural.achieved}%</div>
                          <div className="text-sm text-slate-600">Achieved</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-900">{reportData.quotas.rural.filled}</div>
                          <div className="text-sm text-slate-600">Placed</div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progress to Target</span>
                          <span className="font-medium">{Math.round((reportData.quotas.rural.achieved / reportData.quotas.rural.target) * 100)}%</span>
                        </div>
                        <Progress value={(reportData.quotas.rural.achieved / reportData.quotas.rural.target) * 100} className="h-3" />
                      </div>

                      <div className="mt-4 text-sm text-slate-600">
                        <p>Shortfall: {reportData.quotas.rural.required - reportData.quotas.rural.filled} positions</p>
                      </div>
                    </div>

                    {/* SC/ST Quota */}
                    <div className={`p-6 rounded-lg border-2 ${getQuotaStatus(reportData.quotas.scSt.achieved, reportData.quotas.scSt.target).bgColor} ${getQuotaStatus(reportData.quotas.scSt.achieved, reportData.quotas.scSt.target).borderColor}`}>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-slate-900 flex items-center space-x-2">
                          <Shield className="h-5 w-5 text-purple-600" />
                          <span>SC/ST Category</span>
                        </h3>
                        <Badge className={`${getQuotaStatus(reportData.quotas.scSt.achieved, reportData.quotas.scSt.target).color} bg-white`}>
                          {getQuotaStatus(reportData.quotas.scSt.achieved, reportData.quotas.scSt.target).status}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-3 gap-4 mb-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-slate-900">{reportData.quotas.scSt.target}%</div>
                          <div className="text-sm text-slate-600">Target</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-purple-900">{reportData.quotas.scSt.achieved}%</div>
                          <div className="text-sm text-slate-600">Achieved</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-900">{reportData.quotas.scSt.filled}</div>
                          <div className="text-sm text-slate-600">Placed</div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progress to Target</span>
                          <span className="font-medium">{Math.round((reportData.quotas.scSt.achieved / reportData.quotas.scSt.target) * 100)}%</span>
                        </div>
                        <Progress value={(reportData.quotas.scSt.achieved / reportData.quotas.scSt.target) * 100} className="h-3" />
                      </div>

                      <div className="mt-4 text-sm text-slate-600">
                        <p>Constitutional mandate: SC: 7.5% | ST: 7.5%</p>
                      </div>
                    </div>

                    {/* OBC Quota */}
                    <div className={`p-6 rounded-lg border-2 ${getQuotaStatus(reportData.quotas.obc.achieved, reportData.quotas.obc.target).bgColor} ${getQuotaStatus(reportData.quotas.obc.achieved, reportData.quotas.obc.target).borderColor}`}>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-slate-900 flex items-center space-x-2">
                          <Users className="h-5 w-5 text-orange-600" />
                          <span>OBC Category</span>
                        </h3>
                        <Badge className={`${getQuotaStatus(reportData.quotas.obc.achieved, reportData.quotas.obc.target).color} bg-white`}>
                          {getQuotaStatus(reportData.quotas.obc.achieved, reportData.quotas.obc.target).status}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-3 gap-4 mb-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-slate-900">{reportData.quotas.obc.target}%</div>
                          <div className="text-sm text-slate-600">Target</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-orange-900">{reportData.quotas.obc.achieved}%</div>
                          <div className="text-sm text-slate-600">Achieved</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-900">{reportData.quotas.obc.filled}</div>
                          <div className="text-sm text-slate-600">Placed</div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progress to Target</span>
                          <span className="font-medium">{Math.round((reportData.quotas.obc.achieved / reportData.quotas.obc.target) * 100)}%</span>
                        </div>
                        <Progress value={(reportData.quotas.obc.achieved / reportData.quotas.obc.target) * 100} className="h-3" />
                      </div>

                      <div className="mt-4 text-sm text-slate-600">
                        <p>Mandal Commission guidelines: 27% reservation</p>
                      </div>
                    </div>

                    {/* PWD Quota */}
                    <div className={`p-6 rounded-lg border-2 ${getQuotaStatus(reportData.quotas.pwd.achieved, reportData.quotas.pwd.target).bgColor} ${getQuotaStatus(reportData.quotas.pwd.achieved, reportData.quotas.pwd.target).borderColor}`}>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-slate-900 flex items-center space-x-2">
                          <Eye className="h-5 w-5 text-blue-600" />
                          <span>PWD Category</span>
                        </h3>
                        <Badge className={`${getQuotaStatus(reportData.quotas.pwd.achieved, reportData.quotas.pwd.target).color} bg-white`}>
                          {getQuotaStatus(reportData.quotas.pwd.achieved, reportData.quotas.pwd.target).status}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-3 gap-4 mb-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-slate-900">{reportData.quotas.pwd.target}%</div>
                          <div className="text-sm text-slate-600">Target</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-900">{reportData.quotas.pwd.achieved}%</div>
                          <div className="text-sm text-slate-600">Achieved</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-900">{reportData.quotas.pwd.filled}</div>
                          <div className="text-sm text-slate-600">Placed</div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progress to Target</span>
                          <span className="font-medium">{Math.round((reportData.quotas.pwd.achieved / reportData.quotas.pwd.target) * 100)}%</span>
                        </div>
                        <Progress value={(reportData.quotas.pwd.achieved / reportData.quotas.pwd.target) * 100} className="h-3" />
                      </div>

                      <div className="mt-4 text-sm text-slate-600">
                        <p>RPwD Act 2016: VI: 1% | HI: 1% | OH: 1% | ID: 1%</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="breakdown" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Geographic Distribution */}
              <Card className="border-0 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50 border-b">
                  <CardTitle className="flex items-center space-x-2">
                    <MapPin className="h-5 w-5 text-blue-600" />
                    <span>Geographic Distribution</span>
                  </CardTitle>
                  <CardDescription>
                    State and city-wise allocation analysis
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-slate-50">
                          <TableHead className="font-semibold">Location</TableHead>
                          <TableHead className="font-semibold">State</TableHead>
                          <TableHead className="font-semibold">Positions</TableHead>
                          <TableHead className="font-semibold">Fill Rate</TableHead>
                          <TableHead className="font-semibold">Avg. Stipend</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {reportData.breakdown.byLocation.map((location, index) => (
                          <TableRow key={location.city} className="hover:bg-slate-50">
                            <TableCell>
                              <div className="flex items-center space-x-2">
                                <div className="font-medium text-slate-900">{location.city}</div>
                                <Badge variant="outline" className="text-xs">
                                  {location.topDomain}
                                </Badge>
                              </div>
                            </TableCell>
                            <TableCell>
                              <span className="text-slate-600">{location.state}</span>
                            </TableCell>
                            <TableCell>
                              <div className="text-center">
                                <div className="font-medium">{location.filled}/{location.internships}</div>
                                <Progress 
                                  value={(location.filled / location.internships) * 100} 
                                  className="w-16 h-2 mt-1"
                                />
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge className={
                                (location.filled / location.internships) > 0.8 ? 'bg-green-100 text-green-800' :
                                (location.filled / location.internships) > 0.6 ? 'bg-blue-100 text-blue-800' :
                                'bg-orange-100 text-orange-800'
                              }>
                                {Math.round((location.filled / location.internships) * 100)}%
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <span className="font-medium">₹{location.avgStipend.toLocaleString()}</span>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>

              {/* Domain Analysis */}
              <Card className="border-0 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-emerald-50 to-green-50 border-b">
                  <CardTitle className="flex items-center space-x-2">
                    <Briefcase className="h-5 w-5 text-emerald-600" />
                    <span>Industry Domain Analysis</span>
                  </CardTitle>
                  <CardDescription>
                    Sector-wise performance and growth metrics
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-slate-50">
                          <TableHead className="font-semibold">Domain</TableHead>
                          <TableHead className="font-semibold">Placements</TableHead>
                          <TableHead className="font-semibold">Avg. Score</TableHead>
                          <TableHead className="font-semibold">Growth</TableHead>
                          <TableHead className="font-semibold">Stipend</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {reportData.breakdown.byDomain.map((domain, index) => (
                          <TableRow key={domain.domain} className="hover:bg-slate-50">
                            <TableCell>
                              <div className="font-medium text-slate-900">{domain.domain}</div>
                            </TableCell>
                            <TableCell>
                              <div className="text-center">
                                <div className="font-medium">{domain.filled}/{domain.internships}</div>
                                <Progress 
                                  value={(domain.filled / domain.internships) * 100} 
                                  className="w-16 h-2 mt-1"
                                />
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-2">
                                <span className="font-medium">{domain.avgScore.toFixed(1)}</span>
                                <Star className="h-3 w-3 text-yellow-500" />
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-2">
                                {getTrendIcon(domain.growthRate)}
                                <span className={`font-medium ${domain.growthRate > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                  {domain.growthRate > 0 ? '+' : ''}{domain.growthRate.toFixed(1)}%
                                </span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <span className="font-medium">₹{domain.avgStipend.toLocaleString()}</span>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Company Performance */}
            <Card className="border-0 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 border-b">
                <CardTitle className="flex items-center space-x-2">
                  <Building className="h-5 w-5 text-purple-600" />
                  <span>Top Performing Companies</span>
                </CardTitle>
                <CardDescription>
                  Company-wise internship allocation and satisfaction metrics
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-slate-50">
                        <TableHead className="font-semibold">Company</TableHead>
                        <TableHead className="font-semibold">Sector</TableHead>
                        <TableHead className="font-semibold">Capacity</TableHead>
                        <TableHead className="font-semibold">Fill Rate</TableHead>
                        <TableHead className="font-semibold">Rating</TableHead>
                        <TableHead className="font-semibold">Avg. Stipend</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {reportData.breakdown.byCompany.map((company, index) => (
                        <TableRow key={company.name} className="hover:bg-slate-50">
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <div className="font-medium text-slate-900">{company.name}</div>
                              {index < 3 && <Star className="h-4 w-4 text-yellow-500" />}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="text-xs">
                              {company.sector}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="text-center">
                              <div className="font-medium">{company.filled}/{company.positions}</div>
                              <Progress 
                                value={(company.filled / company.positions) * 100} 
                                className="w-16 h-2 mt-1"
                              />
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={
                              (company.filled / company.positions) >= 1 ? 'bg-green-100 text-green-800' :
                              (company.filled / company.positions) > 0.8 ? 'bg-blue-100 text-blue-800' :
                              'bg-orange-100 text-orange-800'
                            }>
                              {Math.round((company.filled / company.positions) * 100)}%
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <div className="flex">
                                {Array.from({length: 5}).map((_, i) => (
                                  <Star key={i} className={`h-3 w-3 ${
                                    i < Math.floor(company.rating) ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'
                                  }`} />
                                ))}
                              </div>
                              <span className="text-sm font-medium">{company.rating}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className="font-medium">₹{company.avgStipend.toLocaleString()}</span>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* System Performance Metrics */}
              <Card className="border-0 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
                  <CardTitle className="flex items-center space-x-2">
                    <Zap className="h-5 w-5 text-blue-600" />
                    <span>System Performance</span>
                  </CardTitle>
                  <CardDescription>
                    Technical efficiency and processing metrics
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                        <div className="flex items-center space-x-2 mb-2">
                          <Timer className="h-4 w-4 text-blue-600" />
                          <span className="text-sm font-medium text-blue-800">Processing Time</span>
                        </div>
                        <div className="text-2xl font-bold text-blue-900">{reportData.performance.processingTime}s</div>
                        <div className="text-xs text-blue-700">Average per allocation</div>
                      </div>

                      <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                        <div className="flex items-center space-x-2 mb-2">
                          <Activity className="h-4 w-4 text-green-600" />
                          <span className="text-sm font-medium text-green-800">System Efficiency</span>
                        </div>
                        <div className="text-2xl font-bold text-green-900">{reportData.performance.systemEfficiency}%</div>
                        <div className="text-xs text-green-700">Operational efficiency</div>
                      </div>

                      <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                        <div className="flex items-center space-x-2 mb-2">
                          <Target className="h-4 w-4 text-purple-600" />
                          <span className="text-sm font-medium text-purple-800">Match Accuracy</span>
                        </div>
                        <div className="text-2xl font-bold text-purple-900">{reportData.performance.matchAccuracy}%</div>
                        <div className="text-xs text-purple-700">AI matching precision</div>
                      </div>

                      <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                        <div className="flex items-center space-x-2 mb-2">
                          <Clock className="h-4 w-4 text-orange-600" />
                          <span className="text-sm font-medium text-orange-800">Response Time</span>
                        </div>
                        <div className="text-2xl font-bold text-orange-900">{reportData.performance.responseTime}s</div>
                        <div className="text-xs text-orange-700">API response time</div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium">Allocation Success Rate</span>
                          <span className="font-bold">{Math.round(derivedMetrics.placementRate)}%</span>
                        </div>
                        <Progress value={derivedMetrics.placementRate} className="h-3" />
                      </div>

                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium">User Satisfaction Score</span>
                          <span className="font-bold">{reportData.performance.userSatisfaction}%</span>
                        </div>
                        <Progress value={reportData.performance.userSatisfaction} className="h-3" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Operational Metrics */}
              <Card className="border-0 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-emerald-50 to-green-50 border-b">
                  <CardTitle className="flex items-center space-x-2">
                    <BarChart3 className="h-5 w-5 text-emerald-600" />
                    <span>Operational Excellence</span>
                  </CardTitle>
                  <CardDescription>
                    Key operational performance indicators
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-6">
                    <div className="text-center p-6 bg-emerald-50 rounded-lg border border-emerald-200">
                      <div className="text-4xl font-bold text-emerald-900 mb-2">
                        {Math.round(derivedMetrics.placementRate)}%
                      </div>
                      <div className="text-emerald-700 font-medium">Overall Success Rate</div>
                      <div className="text-sm text-emerald-600 mt-1">
                        {reportData.candidates.placed} out of {reportData.candidates.total} candidates
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                      <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <Globe className="h-5 w-5 text-slate-600" />
                          <span className="font-medium">Geographic Coverage</span>
                        </div>
                        <span className="font-bold">{reportData.breakdown.byLocation.length} cities</span>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <Briefcase className="h-5 w-5 text-slate-600" />
                          <span className="font-medium">Industry Sectors</span>
                        </div>
                        <span className="font-bold">{reportData.breakdown.byDomain.length} domains</span>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <Building className="h-5 w-5 text-slate-600" />
                          <span className="font-medium">Partner Companies</span>
                        </div>
                        <span className="font-bold">{reportData.breakdown.byCompany.length}+ organizations</span>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <GraduationCap className="h-5 w-5 text-slate-600" />
                          <span className="font-medium">Universities</span>
                        </div>
                        <span className="font-bold">{reportData.breakdown.byUniversity.length} institutions</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="trends" className="space-y-6">
            <Card className="border-0 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 border-b">
                <CardTitle className="flex items-center space-x-2">
                  <LineChart className="h-5 w-5 text-indigo-600" />
                  <span>Trend Analysis & Forecasting</span>
                </CardTitle>
                <CardDescription>
                  Historical patterns and future projections for allocation performance
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8">
                <div className="space-y-8">
                  {/* Growth Metrics */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                      <div className="flex items-center space-x-3 mb-4">
                        <ArrowUp className="h-8 w-8 text-green-600" />
                        <div>
                          <div className="text-2xl font-bold text-green-900">+{reportData.trends.monthlyGrowth}%</div>
                          <div className="text-green-700 font-medium">Monthly Growth</div>
                        </div>
                      </div>
                      <div className="text-sm text-green-700">
                        Consistent upward trend in successful placements over the past month
                      </div>
                    </div>

                    <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                      <div className="flex items-center space-x-3 mb-4">
                        <TrendingUp className="h-8 w-8 text-blue-600" />
                        <div>
                          <div className="text-2xl font-bold text-blue-900">+{reportData.trends.weeklyGrowth}%</div>
                          <div className="text-blue-700 font-medium">Weekly Growth</div>
                        </div>
                      </div>
                      <div className="text-sm text-blue-700">
                        Strong performance acceleration in recent week
                      </div>
                    </div>
                  </div>

                  {/* Trend Visualization Placeholder */}
                  <div className="bg-slate-50 p-8 rounded-lg border">
                    <h4 className="font-semibold text-slate-900 mb-6 text-center">
                      Placement Trend - Last 30 Days
                    </h4>
                    <div className="flex items-end justify-between h-32 space-x-2">
                      {reportData.trends.last30Days.slice(-7).map((value, index) => (
                        <div key={index} className="flex flex-col items-center space-y-2">
                          <div 
                            className="bg-blue-500 rounded-t"
                            style={{ 
                              height: `${(value / Math.max(...reportData.trends.last30Days)) * 100}px`,
                              width: '40px'
                            }}
                          />
                          <div className="text-xs text-slate-600 font-medium">{value}</div>
                          <div className="text-xs text-slate-500">
                            Day {index + 1}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="text-center mt-4 text-sm text-slate-600">
                      Daily placement trends showing consistent growth pattern
                    </div>
                  </div>

                  {/* Key Insights */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                      <div className="flex items-center space-x-2 mb-2">
                        <Sun className="h-5 w-5 text-yellow-600" />
                        <span className="font-semibold text-yellow-800">Peak Performance</span>
                      </div>
                      <div className="text-sm text-yellow-700">
                        Highest placement rates observed during mid-week periods (Tuesday-Thursday)
                      </div>
                    </div>

                    <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                      <div className="flex items-center space-x-2 mb-2">
                        <Star className="h-5 w-5 text-purple-600" />
                        <span className="font-semibold text-purple-800">Quality Improvement</span>
                      </div>
                      <div className="text-sm text-purple-700">
                        Average match scores have improved by 8.3% over the last quarter
                      </div>
                    </div>

                    <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                      <div className="flex items-center space-x-2 mb-2">
                        <Award className="h-5 w-5 text-emerald-600" />
                        <span className="font-semibold text-emerald-800">Future Outlook</span>
                      </div>
                      <div className="text-sm text-emerald-700">
                        Projected 15-20% increase in placements for the next quarter based on current trends
                      </div>
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
