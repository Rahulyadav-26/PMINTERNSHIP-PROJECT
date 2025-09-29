
import React, { useState, useMemo, useCallback, useEffect } from 'react';
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
import { Checkbox } from '@/components/ui/checkbox';
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
  TrendingUp,
  Users,
  Target,
  Download,
  RefreshCw,
  Eye,
  PieChart,
  Activity,
  Zap,
  Search,
  Filter,
  Settings,
  Globe,
  Brain,
  Lightbulb,
  AlertTriangle,
  CheckCircle,
  Clock,
  Star,
  Award,
  Briefcase,
  GraduationCap,
  MapPin,
  Building,
  LineChart,
  Calendar,
  Timer,
  Database,
  Cpu,
  Code,
  Smartphone,
  Monitor,
  Shield,
  CloudRain,
  Layers,
  FileText,
  Share2,
  BookOpen,
  TrendingDown,
  ArrowUp,
  ArrowDown,
  Equal,
  Plus,
  Minus,
  Maximize2,
  MoreHorizontal,
  Info,
  Hash,
  Percent,
  DollarSign,
  Gauge,
  Radar,
  BarChart2,
  Loader2,
  ExternalLink,
  Mail,
  Phone,
  Calendar as CalendarIcon,
  Bookmark,
  Flag,
  ChevronRight,
  ChevronDown,
  RotateCcw,
  Save,
  Copy,
} from 'lucide-react';

interface SkillData {
  skill: string;
  category: string;
  demand: number;
  available: number;
  gap: number;
  matchRate: number;
  avgSalary: number;
  growthRate: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  industryDemand: {
    technology: number;
    finance: number;
    healthcare: number;
    manufacturing: number;
    consulting: number;
  };
  regionalDemand: {
    north: number;
    south: number;
    west: number;
    east: number;
    central: number;
  };
  trends: number[];
  certifications: string[];
  experienceLevel: 'Entry' | 'Mid' | 'Senior';
}

interface SkillsInsight {
  type: 'High Demand' | 'Surplus' | 'Best Match' | 'Critical Gap' | 'Emerging' | 'Declining';
  skill: string;
  note: string;
  priority: 'High' | 'Medium' | 'Low';
  actionRequired: boolean;
  impact: number;
}

interface AnalyticsFilters {
  category: string;
  experienceLevel: string;
  region: string;
  industry: string;
  timeRange: string;
  showOnlyGaps: boolean;
  minDemand: number;
}

export const Analytics: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<AnalyticsFilters>({
    category: 'all',
    experienceLevel: 'all',
    region: 'all',
    industry: 'all',
    timeRange: '30days',
    showOnlyGaps: false,
    minDemand: 0
  });
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [comparisonMode, setComparisonMode] = useState(false);
  const [viewMode, setViewMode] = useState<'chart' | 'table' | 'heatmap'>('chart');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [expandedInsights, setExpandedInsights] = useState<string[]>([]);

  // Enhanced comprehensive skills data
  const skillsData: SkillData[] = [
    {
      skill: 'Python',
      category: 'Programming',
      demand: 145,
      available: 89,
      gap: 56,
      matchRate: 61.4,
      avgSalary: 85000,
      growthRate: 18.5,
      difficulty: 'Medium',
      industryDemand: { technology: 65, finance: 25, healthcare: 20, manufacturing: 15, consulting: 20 },
      regionalDemand: { north: 40, south: 55, west: 30, east: 15, central: 5 },
      trends: [120, 125, 128, 135, 142, 145],
      certifications: ['PCAP', 'PCPP', 'Python Institute'],
      experienceLevel: 'Mid'
    },
    {
      skill: 'JavaScript',
      category: 'Programming',
      demand: 132,
      available: 76,
      gap: 56,
      matchRate: 57.6,
      avgSalary: 75000,
      growthRate: 12.3,
      difficulty: 'Easy',
      industryDemand: { technology: 85, finance: 15, healthcare: 10, manufacturing: 12, consulting: 10 },
      regionalDemand: { north: 35, south: 60, west: 25, east: 8, central: 4 },
      trends: [115, 118, 122, 126, 129, 132],
      certifications: ['JavaScript Certified', 'ES6 Specialist'],
      experienceLevel: 'Entry'
    },
    {
      skill: 'Machine Learning',
      category: 'AI/Data Science',
      demand: 98,
      available: 42,
      gap: 56,
      matchRate: 42.9,
      avgSalary: 125000,
      growthRate: 35.7,
      difficulty: 'Hard',
      industryDemand: { technology: 50, finance: 20, healthcare: 15, manufacturing: 8, consulting: 5 },
      regionalDemand: { north: 25, south: 45, west: 20, east: 6, central: 2 },
      trends: [65, 72, 78, 85, 92, 98],
      certifications: ['ML Engineer', 'TensorFlow', 'AWS ML'],
      experienceLevel: 'Senior'
    },
    {
      skill: 'React',
      category: 'Frontend',
      demand: 87,
      available: 58,
      gap: 29,
      matchRate: 66.7,
      avgSalary: 80000,
      growthRate: 15.2,
      difficulty: 'Medium',
      industryDemand: { technology: 60, finance: 12, healthcare: 8, manufacturing: 4, consulting: 3 },
      regionalDemand: { north: 22, south: 40, west: 18, east: 5, central: 2 },
      trends: [70, 74, 78, 82, 85, 87],
      certifications: ['React Developer', 'Meta Certified'],
      experienceLevel: 'Mid'
    },
    {
      skill: 'Java',
      category: 'Programming',
      demand: 78,
      available: 91,
      gap: -13,
      matchRate: 116.7,
      avgSalary: 90000,
      growthRate: -5.2,
      difficulty: 'Medium',
      industryDemand: { technology: 35, finance: 25, healthcare: 8, manufacturing: 6, consulting: 4 },
      regionalDemand: { north: 18, south: 30, west: 20, east: 8, central: 2 },
      trends: [88, 85, 82, 80, 79, 78],
      certifications: ['Oracle Java', 'Spring Boot'],
      experienceLevel: 'Mid'
    },
    {
      skill: 'AWS',
      category: 'Cloud Computing',
      demand: 92,
      available: 34,
      gap: 58,
      matchRate: 37.0,
      avgSalary: 110000,
      growthRate: 28.4,
      difficulty: 'Hard',
      industryDemand: { technology: 45, finance: 20, healthcare: 12, manufacturing: 10, consulting: 5 },
      regionalDemand: { north: 20, south: 35, west: 25, east: 10, central: 2 },
      trends: [60, 68, 75, 82, 87, 92],
      certifications: ['AWS Certified', 'Solutions Architect'],
      experienceLevel: 'Senior'
    },
    {
      skill: 'Node.js',
      category: 'Backend',
      demand: 74,
      available: 48,
      gap: 26,
      matchRate: 64.9,
      avgSalary: 85000,
      growthRate: 14.7,
      difficulty: 'Medium',
      industryDemand: { technology: 50, finance: 12, healthcare: 6, manufacturing: 4, consulting: 2 },
      regionalDemand: { north: 15, south: 35, west: 18, east: 4, central: 2 },
      trends: [58, 62, 66, 70, 72, 74],
      certifications: ['Node.js Certified', 'Express.js'],
      experienceLevel: 'Mid'
    },
    {
      skill: 'Data Analysis',
      category: 'Data Science',
      demand: 89,
      available: 45,
      gap: 44,
      matchRate: 50.6,
      avgSalary: 95000,
      growthRate: 22.1,
      difficulty: 'Medium',
      industryDemand: { technology: 30, finance: 35, healthcare: 12, manufacturing: 8, consulting: 4 },
      regionalDemand: { north: 22, south: 35, west: 20, east: 10, central: 2 },
      trends: [65, 70, 76, 82, 86, 89],
      certifications: ['Google Analytics', 'Tableau Certified'],
      experienceLevel: 'Mid'
    }
  ];

  // Calculate analytics summary
  const analyticsData = useMemo(() => {
    const filteredSkills = skillsData.filter(skill => {
      const matchesSearch = skill.skill.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           skill.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = filters.category === 'all' || skill.category === filters.category;
      const matchesExperience = filters.experienceLevel === 'all' || skill.experienceLevel === filters.experienceLevel;
      const matchesMinDemand = skill.demand >= filters.minDemand;
      const matchesGapFilter = !filters.showOnlyGaps || skill.gap > 0;

      return matchesSearch && matchesCategory && matchesExperience && matchesMinDemand && matchesGapFilter;
    });

    const summary = {
      totalDemand: filteredSkills.reduce((sum, skill) => sum + skill.demand, 0),
      totalAvailable: filteredSkills.reduce((sum, skill) => sum + skill.available, 0),
      overallGap: filteredSkills.reduce((sum, skill) => sum + Math.max(0, skill.gap), 0),
      averageMatchRate: filteredSkills.reduce((sum, skill) => sum + skill.matchRate, 0) / filteredSkills.length,
      averageSalary: filteredSkills.reduce((sum, skill) => sum + skill.avgSalary, 0) / filteredSkills.length,
      highDemandSkills: filteredSkills.filter(skill => skill.demand > 80).length,
      criticalGaps: filteredSkills.filter(skill => skill.gap > 40).length,
      emergingSkills: filteredSkills.filter(skill => skill.growthRate > 20).length
    };

    const insights: SkillsInsight[] = [
      ...filteredSkills
        .filter(skill => skill.gap > 40)
        .map(skill => ({
          type: 'Critical Gap' as const,
          skill: skill.skill,
          note: `Critical shortage of ${skill.gap} professionals needed`,
          priority: 'High' as const,
          actionRequired: true,
          impact: skill.gap * 2
        })),
      ...filteredSkills
        .filter(skill => skill.growthRate > 25)
        .map(skill => ({
          type: 'Emerging' as const,
          skill: skill.skill,
          note: `Rapidly growing demand (+${skill.growthRate.toFixed(1)}% growth rate)`,
          priority: 'High' as const,
          actionRequired: true,
          impact: Math.round(skill.growthRate)
        })),
      ...filteredSkills
        .filter(skill => skill.gap < -10)
        .map(skill => ({
          type: 'Surplus' as const,
          skill: skill.skill,
          note: `${Math.abs(skill.gap)} excess candidates available for reallocation`,
          priority: 'Medium' as const,
          actionRequired: false,
          impact: Math.abs(skill.gap)
        })),
      ...filteredSkills
        .filter(skill => skill.matchRate > 80)
        .map(skill => ({
          type: 'Best Match' as const,
          skill: skill.skill,
          note: `Excellent supply-demand balance at ${skill.matchRate.toFixed(1)}%`,
          priority: 'Low' as const,
          actionRequired: false,
          impact: Math.round(skill.matchRate - 80)
        }))
    ].sort((a, b) => b.impact - a.impact).slice(0, 8);

    return { filteredSkills, summary, insights };
  }, [skillsData, searchTerm, filters]);

  // Handle data refresh
  const handleRefreshData = useCallback(async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsLoading(false);
  }, []);

  // Handle export functionality
  const handleExportAnalytics = useCallback((format: 'pdf' | 'excel' | 'csv') => {
    console.log(`Exporting analytics data in ${format.toUpperCase()} format...`);
    // Export logic would go here
  }, []);

  // Toggle skill selection for comparison
  const toggleSkillSelection = useCallback((skillName: string) => {
    setSelectedSkills(prev => 
      prev.includes(skillName) 
        ? prev.filter(s => s !== skillName)
        : [...prev, skillName]
    );
  }, []);

  const getSkillStatus = (matchRate: number) => {
    if (matchRate >= 90) return { 
      status: 'Excellent', 
      color: 'bg-green-500', 
      textColor: 'text-green-700',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200'
    };
    if (matchRate >= 70) return { 
      status: 'Good', 
      color: 'bg-blue-500', 
      textColor: 'text-blue-700',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    };
    if (matchRate >= 50) return { 
      status: 'Fair', 
      color: 'bg-orange-500', 
      textColor: 'text-orange-700',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200'
    };
    return { 
      status: 'Critical', 
      color: 'bg-red-500', 
      textColor: 'text-red-700',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200'
    };
  };

  const getGrowthIcon = (rate: number) => {
    if (rate > 15) return <TrendingUp className="h-4 w-4 text-green-600" />;
    if (rate > 0) return <ArrowUp className="h-4 w-4 text-blue-600" />;
    if (rate < -10) return <TrendingDown className="h-4 w-4 text-red-600" />;
    return <Equal className="h-4 w-4 text-gray-600" />;
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getMaxValue = () => {
    return Math.max(...analyticsData.filteredSkills.map(skill => Math.max(skill.demand, skill.available)));
  };

  const maxValue = getMaxValue();

  return (
    <DashboardLayout title="Advanced Skills Intelligence">
      <div className="space-y-8">
        {/* Enhanced Analytics Header */}
        <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-50 to-indigo-50">
          <CardContent className="p-8">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-6 lg:space-y-0">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold text-slate-900">Skills Intelligence Dashboard</h1>
                <h2 className="text-xl text-blue-700 font-semibold">AI-Powered Market Analysis & Demand Forecasting</h2>
                <div className="flex items-center space-x-4 text-sm text-slate-600">
                  <div className="flex items-center space-x-1">
                    <Activity className="h-4 w-4" />
                    <span>Real-time market data</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Brain className="h-4 w-4" />
                    <span>AI-driven insights</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Zap className="h-4 w-4" />
                    <span>Predictive analytics</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                <Select value={filters.timeRange} onValueChange={(value) => setFilters(prev => ({ ...prev, timeRange: value }))}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7days">Last 7 Days</SelectItem>
                    <SelectItem value="30days">Last 30 Days</SelectItem>
                    <SelectItem value="quarter">Last Quarter</SelectItem>
                    <SelectItem value="year">This Year</SelectItem>
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
                      <DialogTitle>Export Skills Analytics</DialogTitle>
                      <DialogDescription>
                        Choose your preferred format for the comprehensive skills analysis report.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid grid-cols-1 gap-4">
                      <Button 
                        variant="outline" 
                        onClick={() => handleExportAnalytics('pdf')}
                        className="justify-start"
                      >
                        <FileText className="h-4 w-4 mr-3" />
                        <div className="text-left">
                          <div className="font-medium">Comprehensive PDF Report</div>
                          <div className="text-xs text-muted-foreground">Detailed analysis with charts and insights</div>
                        </div>
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => handleExportAnalytics('excel')}
                        className="justify-start"
                      >
                        <BarChart3 className="h-4 w-4 mr-3" />
                        <div className="text-left">
                          <div className="font-medium">Excel Analytics Workbook</div>
                          <div className="text-xs text-muted-foreground">Interactive data tables and pivot analysis</div>
                        </div>
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => handleExportAnalytics('csv')}
                        className="justify-start"
                      >
                        <Database className="h-4 w-4 mr-3" />
                        <div className="text-left">
                          <div className="font-medium">Raw Data Export</div>
                          <div className="text-xs text-muted-foreground">CSV format for external analysis</div>
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

        {/* Enhanced Key Metrics Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-blue-500 to-blue-600">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold text-white">{analyticsData.summary.totalDemand}</p>
                  <p className="text-blue-100 text-sm">Total Skill Demand</p>
                  <div className="flex items-center mt-2">
                    <Target className="h-4 w-4 text-blue-200 mr-1" />
                    <span className="text-blue-200 text-xs">
                      {analyticsData.summary.highDemandSkills} high-demand skills
                    </span>
                  </div>
                </div>
                <Target className="h-12 w-12 text-blue-200" />
              </div>
              <div className="absolute -top-4 -right-4 w-16 h-16 bg-white/10 rounded-full" />
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-emerald-500 to-emerald-600">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold text-white">{analyticsData.summary.totalAvailable}</p>
                  <p className="text-emerald-100 text-sm">Available Candidates</p>
                  <div className="flex items-center mt-2">
                    <Users className="h-4 w-4 text-emerald-200 mr-1" />
                    <span className="text-emerald-200 text-xs">
                      Ready for placement
                    </span>
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
                  <p className="text-3xl font-bold text-white">{analyticsData.summary.overallGap}</p>
                  <p className="text-orange-100 text-sm">Skills Gap</p>
                  <div className="flex items-center mt-2">
                    <AlertTriangle className="h-4 w-4 text-orange-200 mr-1" />
                    <span className="text-orange-200 text-xs">
                      {analyticsData.summary.criticalGaps} critical gaps
                    </span>
                  </div>
                </div>
                <Activity className="h-12 w-12 text-orange-200" />
              </div>
              <div className="absolute -top-4 -right-4 w-16 h-16 bg-white/10 rounded-full" />
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-purple-500 to-purple-600">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold text-white">{Math.round(analyticsData.summary.averageMatchRate)}%</p>
                  <p className="text-purple-100 text-sm">Avg Match Rate</p>
                  <div className="flex items-center mt-2">
                    <Gauge className="h-4 w-4 text-purple-200 mr-1" />
                    <span className="text-purple-200 text-xs">
                      {analyticsData.summary.emergingSkills} emerging skills
                    </span>
                  </div>
                </div>
                <TrendingUp className="h-12 w-12 text-purple-200" />
              </div>
              <div className="absolute -top-4 -right-4 w-16 h-16 bg-white/10 rounded-full" />
            </CardContent>
          </Card>
        </div>

        {/* Advanced Filters and Search */}
        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="Search skills, categories, or technologies..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 h-12 text-base"
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <Select value={filters.category} onValueChange={(value) => setFilters(prev => ({ ...prev, category: value }))}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="Programming">Programming</SelectItem>
                    <SelectItem value="AI/Data Science">AI/Data Science</SelectItem>
                    <SelectItem value="Frontend">Frontend</SelectItem>
                    <SelectItem value="Backend">Backend</SelectItem>
                    <SelectItem value="Cloud Computing">Cloud Computing</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={filters.experienceLevel} onValueChange={(value) => setFilters(prev => ({ ...prev, experienceLevel: value }))}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Experience" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Levels</SelectItem>
                    <SelectItem value="Entry">Entry Level</SelectItem>
                    <SelectItem value="Mid">Mid Level</SelectItem>
                    <SelectItem value="Senior">Senior Level</SelectItem>
                  </SelectContent>
                </Select>

                <Button 
                  variant="outline" 
                  onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Advanced
                </Button>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="comparison-mode"
                    checked={comparisonMode}
                    onCheckedChange={(checked) => setComparisonMode(checked as boolean)}
                  />
                  <Label htmlFor="comparison-mode" className="text-sm">Comparison Mode</Label>
                </div>
              </div>
            </div>

            {showAdvancedFilters && (
              <div className="mt-6 p-6 bg-slate-50 rounded-lg border">
                <h4 className="font-semibold mb-4">Advanced Filters</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label>Minimum Demand</Label>
                    <Input
                      type="number"
                      value={filters.minDemand}
                      onChange={(e) => setFilters(prev => ({ ...prev, minDemand: Number(e.target.value) }))}
                      placeholder="e.g., 50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Region Focus</Label>
                    <Select value={filters.region} onValueChange={(value) => setFilters(prev => ({ ...prev, region: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select region" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Regions</SelectItem>
                        <SelectItem value="north">North India</SelectItem>
                        <SelectItem value="south">South India</SelectItem>
                        <SelectItem value="west">West India</SelectItem>
                        <SelectItem value="east">East India</SelectItem>
                        <SelectItem value="central">Central India</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="show-gaps"
                      checked={filters.showOnlyGaps}
                      onCheckedChange={(checked) => setFilters(prev => ({ ...prev, showOnlyGaps: checked as boolean }))}
                    />
                    <Label htmlFor="show-gaps" className="text-sm">Show only skills with gaps</Label>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Main Analytics Tabs */}
        <Tabs defaultValue="skills" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 h-12 p-1 bg-slate-100">
            <TabsTrigger value="skills" className="text-base font-semibold">Skills Analysis</TabsTrigger>
            <TabsTrigger value="insights" className="text-base font-semibold">AI Insights</TabsTrigger>
            <TabsTrigger value="trends" className="text-base font-semibold">Market Trends</TabsTrigger>
            <TabsTrigger value="forecast" className="text-base font-semibold">Demand Forecast</TabsTrigger>
          </TabsList>

          <TabsContent value="skills" className="space-y-6">
            {/* View Mode Selector */}
            <Card className="border-0 shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Label className="text-sm font-medium">View Mode:</Label>
                    <div className="flex space-x-2">
                      <Button
                        variant={viewMode === 'chart' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setViewMode('chart')}
                      >
                        <BarChart3 className="h-4 w-4 mr-2" />
                        Chart
                      </Button>
                      <Button
                        variant={viewMode === 'table' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setViewMode('table')}
                      >
                        <Table className="h-4 w-4 mr-2" />
                        Table
                      </Button>
                      <Button
                        variant={viewMode === 'heatmap' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setViewMode('heatmap')}
                      >
                        <Radar className="h-4 w-4 mr-2" />
                        Heatmap
                      </Button>
                    </div>
                  </div>

                  {selectedSkills.length > 0 && (
                    <Badge variant="outline" className="flex items-center space-x-1">
                      <span>{selectedSkills.length} selected for comparison</span>
                      <Button variant="ghost" size="sm" onClick={() => setSelectedSkills([])}>
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>

            {viewMode === 'chart' && (
              <Card className="border-0 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
                  <CardTitle className="flex items-center space-x-2">
                    <BarChart3 className="h-5 w-5 text-blue-600" />
                    <span>Skills Demand vs Availability Analysis</span>
                  </CardTitle>
                  <CardDescription>
                    Interactive visualization of market demand compared to candidate availability
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-8">
                  <div className="space-y-8">
                    {/* Chart Legend */}
                    <div className="flex justify-center space-x-8 mb-6">
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 bg-blue-500 rounded"></div>
                        <span className="text-sm font-medium">Market Demand</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 bg-emerald-500 rounded"></div>
                        <span className="text-sm font-medium">Available Candidates</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 bg-orange-500 rounded"></div>
                        <span className="text-sm font-medium">Skills Gap</span>
                      </div>
                    </div>

                    {/* Enhanced Bar Chart */}
                    <div className="space-y-8">
                      {analyticsData.filteredSkills.map((skill, index) => (
                        <div 
                          key={index} 
                          className={`p-6 rounded-lg border-2 transition-all ${
                            selectedSkills.includes(skill.skill) 
                              ? 'border-blue-300 bg-blue-50' 
                              : 'border-slate-200 hover:border-slate-300 bg-white'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center space-x-4">
                              <div className="flex items-center space-x-2">
                                {comparisonMode && (
                                  <Checkbox
                                    checked={selectedSkills.includes(skill.skill)}
                                    onCheckedChange={() => toggleSkillSelection(skill.skill)}
                                  />
                                )}
                                <h4 className="font-semibold text-xl text-slate-900">{skill.skill}</h4>
                                <Badge variant="outline" className="text-xs">
                                  {skill.category}
                                </Badge>
                                <Badge variant="outline" className="text-xs">
                                  {skill.experienceLevel}
                                </Badge>
                              </div>
                            </div>
                            <div className="flex items-center space-x-4">
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger>
                                    <div className="flex items-center space-x-1">
                                      {getGrowthIcon(skill.growthRate)}
                                      <span className="text-sm font-medium">
                                        {skill.growthRate > 0 ? '+' : ''}{skill.growthRate.toFixed(1)}%
                                      </span>
                                    </div>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Growth rate over last quarter</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                              <Badge className={getSkillStatus(skill.matchRate).textColor}>
                                {skill.matchRate.toFixed(1)}% Match
                              </Badge>
                              <span className="text-sm text-slate-600">
                                Gap: {skill.gap > 0 ? '+' : ''}{skill.gap}
                              </span>
                            </div>
                          </div>

                          {/* Salary Information */}
                          <div className="mb-4 p-3 bg-slate-50 rounded-lg">
                            <div className="flex items-center justify-between text-sm">
                              <div className="flex items-center space-x-4">
                                <span className="flex items-center space-x-1">
                                  <DollarSign className="h-4 w-4 text-green-600" />
                                  <span className="font-medium">Avg Salary: ₹{skill.avgSalary.toLocaleString()}</span>
                                </span>
                                <span className="flex items-center space-x-1">
                                  <Award className="h-4 w-4 text-purple-600" />
                                  <span>Difficulty: {skill.difficulty}</span>
                                </span>
                              </div>
                              <div className="flex space-x-2">
                                {skill.certifications.slice(0, 2).map((cert, idx) => (
                                  <Badge key={idx} variant="outline" className="text-xs">
                                    {cert}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>

                          <div className="space-y-3">
                            {/* Demand Bar */}
                            <div className="flex items-center space-x-4">
                              <span className="text-sm font-medium w-20 text-blue-700">Demand</span>
                              <div className="flex-1 bg-slate-200 rounded-full h-6 relative">
                                <div 
                                  className="bg-blue-500 h-6 rounded-full flex items-center justify-end pr-3 transition-all duration-500"
                                  style={{ width: `${(skill.demand / maxValue) * 100}%` }}
                                >
                                  <span className="text-white text-xs font-medium">{skill.demand}</span>
                                </div>
                              </div>
                            </div>

                            {/* Available Bar */}
                            <div className="flex items-center space-x-4">
                              <span className="text-sm font-medium w-20 text-emerald-700">Available</span>
                              <div className="flex-1 bg-slate-200 rounded-full h-6 relative">
                                <div 
                                  className="bg-emerald-500 h-6 rounded-full flex items-center justify-end pr-3 transition-all duration-500"
                                  style={{ width: `${(skill.available / maxValue) * 100}%` }}
                                >
                                  <span className="text-white text-xs font-medium">{skill.available}</span>
                                </div>
                              </div>
                            </div>

                            {/* Gap Indicator */}
                            {Math.abs(skill.gap) > 0 && (
                              <div className="flex items-center space-x-4">
                                <span className="text-sm font-medium w-20 text-orange-700">Gap</span>
                                <div className="flex-1 bg-slate-200 rounded-full h-4 relative">
                                  <div 
                                    className={`h-4 rounded-full flex items-center justify-end pr-2 transition-all duration-500 ${
                                      skill.gap > 0 ? 'bg-orange-500' : 'bg-green-500'
                                    }`}
                                    style={{ width: `${(Math.abs(skill.gap) / maxValue) * 100}%` }}
                                  >
                                    <span className="text-white text-xs font-medium">
                                      {Math.abs(skill.gap)}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Regional Demand Breakdown */}
                          <div className="mt-4 p-3 bg-gradient-to-r from-slate-50 to-blue-50 rounded-lg">
                            <h5 className="text-sm font-medium text-slate-800 mb-2">Regional Demand Distribution</h5>
                            <div className="flex space-x-4 text-xs">
                              {Object.entries(skill.regionalDemand).map(([region, demand]) => (
                                <div key={region} className="text-center">
                                  <div className="w-12 h-2 bg-slate-200 rounded">
                                    <div 
                                      className="h-2 bg-blue-500 rounded transition-all duration-300"
                                      style={{ width: `${(demand / Math.max(...Object.values(skill.regionalDemand))) * 100}%` }}
                                    />
                                  </div>
                                  <div className="mt-1 capitalize text-slate-600">{region}</div>
                                  <div className="font-medium text-slate-800">{demand}</div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Enhanced Summary */}
                    <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 p-8 rounded-lg border border-blue-200 mt-8">
                      <h4 className="font-semibold text-blue-900 mb-6 text-xl">Analytics Summary</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                          <div className="text-3xl font-bold text-blue-900 mb-2">{analyticsData.summary.totalDemand}</div>
                          <div className="text-blue-700 font-medium">Total Positions</div>
                          <div className="text-xs text-blue-600 mt-1">Market demand</div>
                        </div>
                        <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                          <div className="text-3xl font-bold text-emerald-900 mb-2">{analyticsData.summary.totalAvailable}</div>
                          <div className="text-emerald-700 font-medium">Available Talent</div>
                          <div className="text-xs text-emerald-600 mt-1">Ready candidates</div>
                        </div>
                        <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                          <div className="text-3xl font-bold text-orange-900 mb-2">{analyticsData.summary.overallGap}</div>
                          <div className="text-orange-700 font-medium">Skills Gap</div>
                          <div className="text-xs text-orange-600 mt-1">Unfilled demand</div>
                        </div>
                        <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                          <div className="text-3xl font-bold text-purple-900 mb-2">₹{Math.round(analyticsData.summary.averageSalary/1000)}k</div>
                          <div className="text-purple-700 font-medium">Avg Salary</div>
                          <div className="text-xs text-purple-600 mt-1">Market rate</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {viewMode === 'table' && (
              <Card className="border-0 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-slate-50 to-gray-50 border-b">
                  <CardTitle className="flex items-center space-x-2">
                    <Database className="h-5 w-5 text-slate-600" />
                    <span>Detailed Skills Data Table</span>
                  </CardTitle>
                  <CardDescription>
                    Comprehensive tabular view with sorting and filtering capabilities
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-slate-50">
                          {comparisonMode && <TableHead>Select</TableHead>}
                          <TableHead className="font-semibold">Skill</TableHead>
                          <TableHead className="font-semibold">Category</TableHead>
                          <TableHead className="font-semibold">Demand</TableHead>
                          <TableHead className="font-semibold">Available</TableHead>
                          <TableHead className="font-semibold">Gap</TableHead>
                          <TableHead className="font-semibold">Match Rate</TableHead>
                          <TableHead className="font-semibold">Growth</TableHead>
                          <TableHead className="font-semibold">Avg Salary</TableHead>
                          <TableHead className="font-semibold">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {analyticsData.filteredSkills.map((skill, index) => (
                          <TableRow key={index} className="hover:bg-slate-50">
                            {comparisonMode && (
                              <TableCell>
                                <Checkbox
                                  checked={selectedSkills.includes(skill.skill)}
                                  onCheckedChange={() => toggleSkillSelection(skill.skill)}
                                />
                              </TableCell>
                            )}
                            <TableCell>
                              <div className="font-medium text-slate-900">{skill.skill}</div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className="text-xs">
                                {skill.category}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <span className="font-medium text-blue-800">{skill.demand}</span>
                            </TableCell>
                            <TableCell>
                              <span className="font-medium text-emerald-800">{skill.available}</span>
                            </TableCell>
                            <TableCell>
                              <span className={`font-medium ${skill.gap > 0 ? 'text-orange-800' : 'text-green-800'}`}>
                                {skill.gap > 0 ? '+' : ''}{skill.gap}
                              </span>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-2">
                                <span className="font-medium">{skill.matchRate.toFixed(1)}%</span>
                                <Progress value={skill.matchRate} className="w-16 h-2" />
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-1">
                                {getGrowthIcon(skill.growthRate)}
                                <span className={`text-sm font-medium ${
                                  skill.growthRate > 0 ? 'text-green-600' : 'text-red-600'
                                }`}>
                                  {skill.growthRate > 0 ? '+' : ''}{skill.growthRate.toFixed(1)}%
                                </span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <span className="font-medium">₹{skill.avgSalary.toLocaleString()}</span>
                            </TableCell>
                            <TableCell>
                              <Button variant="ghost" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="insights" className="space-y-6">
            <Card className="border-0 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 border-b">
                <CardTitle className="flex items-center space-x-2">
                  <Brain className="h-5 w-5 text-purple-600" />
                  <span>AI-Powered Market Intelligence</span>
                </CardTitle>
                <CardDescription>
                  Advanced insights generated through machine learning analysis of market patterns
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8">
                <div className="space-y-6">
                  {/* Priority Insights Grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {analyticsData.insights.map((insight, index) => (
                      <div 
                        key={index} 
                        className={`p-6 rounded-lg border-2 transition-all ${
                          insight.actionRequired ? 'border-red-200 bg-red-50' : 'border-blue-200 bg-blue-50'
                        }`}
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <div className={`p-2 rounded-full ${
                              insight.type === 'Critical Gap' ? 'bg-red-100' :
                              insight.type === 'Emerging' ? 'bg-green-100' :
                              insight.type === 'Surplus' ? 'bg-yellow-100' :
                              'bg-blue-100'
                            }`}>
                              {insight.type === 'Critical Gap' && <AlertTriangle className="h-5 w-5 text-red-600" />}
                              {insight.type === 'Emerging' && <TrendingUp className="h-5 w-5 text-green-600" />}
                              {insight.type === 'Surplus' && <Users className="h-5 w-5 text-yellow-600" />}
                              {insight.type === 'Best Match' && <CheckCircle className="h-5 w-5 text-blue-600" />}
                            </div>
                            <div>
                              <Badge className={getPriorityColor(insight.priority)}>
                                {insight.type}
                              </Badge>
                              <h4 className="font-semibold text-lg text-slate-900 mt-1">{insight.skill}</h4>
                            </div>
                          </div>
                          <Badge className="text-xs" variant="outline">
                            Impact: {insight.impact}
                          </Badge>
                        </div>

                        <p className="text-slate-700 mb-4">{insight.note}</p>

                        {insight.actionRequired && (
                          <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                            <div className="flex items-center space-x-2">
                              <Lightbulb className="h-4 w-4 text-yellow-600" />
                              <span className="text-sm font-medium text-yellow-800">Action Required</span>
                            </div>
                            <p className="text-xs text-yellow-700 mt-1">
                              Immediate intervention recommended to address this skills gap
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Strategic Recommendations */}
                  <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-8 rounded-lg border border-indigo-200">
                    <div className="flex items-center space-x-3 mb-6">
                      <div className="p-3 bg-indigo-100 rounded-full">
                        <Lightbulb className="h-6 w-6 text-indigo-600" />
                      </div>
                      <h4 className="font-semibold text-indigo-900 text-xl">Strategic Recommendations</h4>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="bg-white p-6 rounded-lg shadow-sm">
                        <div className="flex items-center space-x-2 mb-3">
                          <Target className="h-5 w-5 text-blue-600" />
                          <span className="font-semibold text-blue-900">Priority Focus</span>
                        </div>
                        <div className="text-sm text-blue-800 space-y-2">
                          <p>• Accelerate Python and ML hiring initiatives</p>
                          <p>• Launch upskilling programs for JavaScript developers</p>
                          <p>• Establish partnerships with cloud training providers</p>
                        </div>
                      </div>

                      <div className="bg-white p-6 rounded-lg shadow-sm">
                        <div className="flex items-center space-x-2 mb-3">
                          <Users className="h-5 w-5 text-emerald-600" />
                          <span className="font-semibold text-emerald-900">Talent Pipeline</span>
                        </div>
                        <div className="text-sm text-emerald-800 space-y-2">
                          <p>• Redirect Java surplus to emerging technologies</p>
                          <p>• Create cross-training pathways</p>
                          <p>• Develop mentorship programs</p>
                        </div>
                      </div>

                      <div className="bg-white p-6 rounded-lg shadow-sm">
                        <div className="flex items-center space-x-2 mb-3">
                          <TrendingUp className="h-5 w-5 text-purple-600" />
                          <span className="font-semibold text-purple-900">Market Positioning</span>
                        </div>
                        <div className="text-sm text-purple-800 space-y-2">
                          <p>• Position as AI/ML talent hub</p>
                          <p>• Leverage cloud computing growth</p>
                          <p>• Build data science capabilities</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="trends" className="space-y-6">
            <Card className="border-0 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-emerald-50 to-green-50 border-b">
                <CardTitle className="flex items-center space-x-2">
                  <LineChart className="h-5 w-5 text-emerald-600" />
                  <span>Market Trends & Evolution</span>
                </CardTitle>
                <CardDescription>
                  Historical patterns and emerging technology adoption across industries
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8">
                <div className="space-y-8">
                  {/* Trending Skills */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                      <h4 className="font-semibold text-green-900 mb-6 flex items-center space-x-2">
                        <TrendingUp className="h-5 w-5" />
                        <span>High-Growth Skills</span>
                      </h4>
                      <div className="space-y-4">
                        {analyticsData.filteredSkills
                          .filter(skill => skill.growthRate > 15)
                          .sort((a, b) => b.growthRate - a.growthRate)
                          .map((skill, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm">
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                <span className="text-green-800 text-xs font-bold">{index + 1}</span>
                              </div>
                              <span className="font-medium text-green-900">{skill.skill}</span>
                            </div>
                            <Badge className="bg-green-100 text-green-800">
                              +{skill.growthRate.toFixed(1)}%
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-red-50 p-6 rounded-lg border border-red-200">
                      <h4 className="font-semibold text-red-900 mb-6 flex items-center space-x-2">
                        <TrendingDown className="h-5 w-5" />
                        <span>Declining Demand</span>
                      </h4>
                      <div className="space-y-4">
                        {analyticsData.filteredSkills
                          .filter(skill => skill.growthRate < 0)
                          .sort((a, b) => a.growthRate - b.growthRate)
                          .map((skill, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm">
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                                <TrendingDown className="h-4 w-4 text-red-600" />
                              </div>
                              <span className="font-medium text-red-900">{skill.skill}</span>
                            </div>
                            <Badge className="bg-red-100 text-red-800">
                              {skill.growthRate.toFixed(1)}%
                            </Badge>
                          </div>
                        ))}
                        {/* Add mock declining skills */}
                        <div className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                              <TrendingDown className="h-4 w-4 text-red-600" />
                            </div>
                            <span className="font-medium text-red-900">Legacy PHP</span>
                          </div>
                          <Badge className="bg-red-100 text-red-800">-12.3%</Badge>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                              <TrendingDown className="h-4 w-4 text-red-600" />
                            </div>
                            <span className="font-medium text-red-900">jQuery</span>
                          </div>
                          <Badge className="bg-red-100 text-red-800">-15.7%</Badge>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Market Evolution Timeline */}
                  <div className="bg-slate-50 p-8 rounded-lg border border-slate-200">
                    <h4 className="font-semibold text-slate-900 mb-6 text-xl text-center">Technology Evolution Timeline</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                      <div className="text-center">
                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Code className="h-8 w-8 text-blue-600" />
                        </div>
                        <h5 className="font-semibold text-blue-900 mb-3">2023-2024: Foundation</h5>
                        <div className="text-sm text-blue-800 space-y-1">
                          <p>• Web development dominance</p>
                          <p>• JavaScript ecosystem growth</p>
                          <p>• Cloud adoption beginning</p>
                        </div>
                      </div>

                      <div className="text-center">
                        <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Brain className="h-8 w-8 text-purple-600" />
                        </div>
                        <h5 className="font-semibold text-purple-900 mb-3">2024-2025: AI Revolution</h5>
                        <div className="text-sm text-purple-800 space-y-1">
                          <p>• ML/AI skills explosion</p>
                          <p>• Python becoming essential</p>
                          <p>• Data science mainstream</p>
                        </div>
                      </div>

                      <div className="text-center">
                        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <CloudRain className="h-8 w-8 text-emerald-600" />
                        </div>
                        <h5 className="font-semibold text-emerald-900 mb-3">2025+: Cloud Native</h5>
                        <div className="text-sm text-emerald-800 space-y-1">
                          <p>• Multi-cloud expertise</p>
                          <p>• DevOps integration</p>
                          <p>• Edge computing growth</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Industry Adoption Patterns */}
                  <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-8 rounded-lg border border-indigo-200">
                    <h4 className="font-semibold text-indigo-900 mb-6 text-xl">Industry Adoption Patterns</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h5 className="font-medium text-indigo-800">Technology Sector</h5>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center text-sm">
                            <span>AI/ML Adoption</span>
                            <Badge className="bg-green-100 text-green-800">95%</Badge>
                          </div>
                          <div className="flex justify-between items-center text-sm">
                            <span>Cloud Migration</span>
                            <Badge className="bg-blue-100 text-blue-800">87%</Badge>
                          </div>
                          <div className="flex justify-between items-center text-sm">
                            <span>DevOps Practices</span>
                            <Badge className="bg-purple-100 text-purple-800">78%</Badge>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <h5 className="font-medium text-indigo-800">Traditional Industries</h5>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center text-sm">
                            <span>Digital Transformation</span>
                            <Badge className="bg-orange-100 text-orange-800">62%</Badge>
                          </div>
                          <div className="flex justify-between items-center text-sm">
                            <span>Data Analytics</span>
                            <Badge className="bg-blue-100 text-blue-800">45%</Badge>
                          </div>
                          <div className="flex justify-between items-center text-sm">
                            <span>Cloud Adoption</span>
                            <Badge className="bg-yellow-100 text-yellow-800">38%</Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="forecast" className="space-y-6">
            <Card className="border-0 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-orange-50 to-red-50 border-b">
                <CardTitle className="flex items-center space-x-2">
                  <Radar className="h-5 w-5 text-orange-600" />
                  <span>Demand Forecasting & Future Projections</span>
                </CardTitle>
                <CardDescription>
                  AI-powered predictions for skills demand over the next 6-12 months
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8">
                <div className="space-y-8">
                  {/* Forecast Summary */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                      <div className="flex items-center space-x-3 mb-4">
                        <ArrowUp className="h-8 w-8 text-green-600" />
                        <div>
                          <div className="text-2xl font-bold text-green-900">+35%</div>
                          <div className="text-green-700 font-medium">Expected Growth</div>
                        </div>
                      </div>
                      <div className="text-sm text-green-700">
                        AI/ML skills projected to see highest demand increase
                      </div>
                    </div>

                    <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                      <div className="flex items-center space-x-3 mb-4">
                        <Clock className="h-8 w-8 text-blue-600" />
                        <div>
                          <div className="text-2xl font-bold text-blue-900">6-8</div>
                          <div className="text-blue-700 font-medium">Months Ahead</div>
                        </div>
                      </div>
                      <div className="text-sm text-blue-700">
                        Forecast accuracy period with 87% confidence
                      </div>
                    </div>

                    <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
                      <div className="flex items-center space-x-3 mb-4">
                        <Star className="h-8 w-8 text-purple-600" />
                        <div>
                          <div className="text-2xl font-bold text-purple-900">4</div>
                          <div className="text-purple-700 font-medium">Emerging Skills</div>
                        </div>
                      </div>
                      <div className="text-sm text-purple-700">
                        New technology skills entering high-demand category
                      </div>
                    </div>
                  </div>

                  {/* Skill Projection Table */}
                  <div className="bg-white rounded-lg border shadow-sm">
                    <div className="p-6 border-b">
                      <h4 className="font-semibold text-slate-900">6-Month Demand Projections</h4>
                    </div>
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-slate-50">
                            <TableHead className="font-semibold">Skill</TableHead>
                            <TableHead className="font-semibold">Current Demand</TableHead>
                            <TableHead className="font-semibold">Projected Demand</TableHead>
                            <TableHead className="font-semibold">Growth Forecast</TableHead>
                            <TableHead className="font-semibold">Confidence</TableHead>
                            <TableHead className="font-semibold">Risk Level</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {analyticsData.filteredSkills.map((skill, index) => {
                            const projectedDemand = Math.round(skill.demand * (1 + skill.growthRate / 100));
                            const growthForecast = ((projectedDemand - skill.demand) / skill.demand) * 100;
                            const confidence = Math.max(70, Math.min(95, 80 + (skill.demand / 20)));
                            const riskLevel = skill.gap > 50 ? 'High' : skill.gap > 20 ? 'Medium' : 'Low';

                            return (
                              <TableRow key={index} className="hover:bg-slate-50">
                                <TableCell>
                                  <div className="font-medium text-slate-900">{skill.skill}</div>
                                </TableCell>
                                <TableCell>
                                  <span className="font-medium">{skill.demand}</span>
                                </TableCell>
                                <TableCell>
                                  <span className="font-medium text-blue-800">{projectedDemand}</span>
                                </TableCell>
                                <TableCell>
                                  <div className="flex items-center space-x-2">
                                    {getGrowthIcon(growthForecast)}
                                    <span className={`font-medium ${
                                      growthForecast > 0 ? 'text-green-600' : 'text-red-600'
                                    }`}>
                                      {growthForecast > 0 ? '+' : ''}{growthForecast.toFixed(1)}%
                                    </span>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <Badge className={
                                    confidence > 85 ? 'bg-green-100 text-green-800' :
                                    confidence > 75 ? 'bg-blue-100 text-blue-800' :
                                    'bg-orange-100 text-orange-800'
                                  }>
                                    {confidence.toFixed(0)}%
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  <Badge className={
                                    riskLevel === 'High' ? 'bg-red-100 text-red-800' :
                                    riskLevel === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                                    'bg-green-100 text-green-800'
                                  }>
                                    {riskLevel}
                                  </Badge>
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </div>
                  </div>

                  {/* Future Recommendations */}
                  <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-8 rounded-lg border border-yellow-200">
                    <div className="flex items-center space-x-3 mb-6">
                      <div className="p-3 bg-yellow-100 rounded-full">
                        <Lightbulb className="h-6 w-6 text-yellow-600" />
                      </div>
                      <h4 className="font-semibold text-yellow-900 text-xl">Strategic Planning Recommendations</h4>
                    </div>

                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white p-6 rounded-lg shadow-sm">
                          <h5 className="font-semibold text-slate-900 mb-3">Immediate Actions (0-3 months)</h5>
                          <div className="text-sm text-slate-700 space-y-2">
                            <p>• Launch intensive Python and ML bootcamps</p>
                            <p>• Partner with cloud providers for certification programs</p>
                            <p>• Create JavaScript to React transition pathways</p>
                            <p>• Establish AI/ML mentorship networks</p>
                          </div>
                        </div>

                        <div className="bg-white p-6 rounded-lg shadow-sm">
                          <h5 className="font-semibold text-slate-900 mb-3">Medium-term Strategy (3-6 months)</h5>
                          <div className="text-sm text-slate-700 space-y-2">
                            <p>• Develop advanced data science curricula</p>
                            <p>• Build industry-specific skill tracks</p>
                            <p>• Create regional training hubs</p>
                            <p>• Establish performance tracking systems</p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                        <h5 className="font-semibold text-blue-900 mb-3">Long-term Vision (6-12 months)</h5>
                        <div className="text-sm text-blue-800">
                          <p>Position the PM Internship Scheme as the premier destination for AI/ML talent development, 
                          with comprehensive cloud computing capabilities and strong industry partnerships. 
                          Achieve 90% placement rate in high-demand skills while maintaining quality standards 
                          and constitutional compliance.</p>
                        </div>
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
