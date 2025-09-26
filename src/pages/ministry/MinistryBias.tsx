import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  Shield,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  Users,
  MapPin,
  GraduationCap,
  Download,
} from 'lucide-react';

export const MinistryBias: React.FC = () => {
  // Mock bias detection data
  const genderData = [
    { name: 'Male', allocated: 620, total: 750, percentage: 82.7 },
    { name: 'Female', allocated: 480, total: 497, percentage: 96.6 },
    { name: 'Others', allocated: 15, total: 20, percentage: 75.0 },
  ];

  const stateData = [
    { state: 'Maharashtra', allocated: 145, total: 180, bias: 'Low' },
    { state: 'Karnataka', allocated: 120, total: 140, bias: 'Low' },
    { state: 'Tamil Nadu', allocated: 98, total: 110, bias: 'Medium' },
    { state: 'Delhi', allocated: 85, total: 95, bias: 'Low' },
    { state: 'Gujarat', allocated: 75, total: 100, bias: 'High' },
    { state: 'West Bengal', allocated: 60, total: 90, bias: 'High' },
  ];

  const categoryData = [
    { name: 'General', value: 45, color: '#2563EB' },
    { name: 'OBC', value: 27, color: '#10B981' },
    { name: 'SC', value: 15, color: '#F59E0B' },
    { name: 'ST', value: 8, color: '#EF4444' },
    { name: 'Others', value: 5, color: '#8B5CF6' },
  ];

  const biasMetrics = [
    {
      category: 'Gender Equality',
      score: 92,
      status: 'Excellent',
      color: 'text-accent',
      bgColor: 'bg-accent/10',
    },
    {
      category: 'Regional Balance',
      score: 78,
      status: 'Good',
      color: 'text-secondary',
      bgColor: 'bg-secondary/10',
    },
    {
      category: 'Caste Fairness',
      score: 85,
      status: 'Good',
      color: 'text-accent',
      bgColor: 'bg-accent/10',
    },
    {
      category: 'Economic Diversity',
      score: 67,
      status: 'Needs Attention',
      color: 'text-destructive',
      bgColor: 'bg-destructive/10',
    },
  ];

  const getBiasColor = (bias: string) => {
    switch (bias.toLowerCase()) {
      case 'low': return 'text-accent';
      case 'medium': return 'text-secondary';
      case 'high': return 'text-destructive';
      default: return 'text-muted-foreground';
    }
  };

  const getBiasBadge = (bias: string) => {
    const variant = bias.toLowerCase() === 'low' ? 'default' : 
                   bias.toLowerCase() === 'medium' ? 'secondary' : 'destructive';
    return <Badge variant={variant === 'default' ? undefined : variant}>{bias} Bias</Badge>;
  };

  return (
    <DashboardLayout title="Bias Detection & Fairness Monitoring">
      <div className="space-y-6">
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="gov-card">
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Shield className="h-8 w-8 text-accent" />
                <div>
                  <p className="text-2xl font-bold">82.5%</p>
                  <p className="text-sm text-muted-foreground">Overall Fairness</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="gov-card">
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-8 w-8 text-secondary" />
                <div>
                  <p className="text-2xl font-bold">3</p>
                  <p className="text-sm text-muted-foreground">Bias Alerts</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="gov-card">
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Users className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-2xl font-bold">1,115</p>
                  <p className="text-sm text-muted-foreground">Total Allocated</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="gov-card">
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-8 w-8 text-accent" />
                <div>
                  <p className="text-2xl font-bold">96.2%</p>
                  <p className="text-sm text-muted-foreground">Compliance Rate</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bias Metrics */}
        <Card className="gov-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5" />
              <span>Fairness Metrics</span>
            </CardTitle>
            <CardDescription>
              Real-time monitoring of allocation fairness across different dimensions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {biasMetrics.map((metric, index) => (
                <div key={index} className={`p-4 rounded-lg ${metric.bgColor}`}>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-foreground">{metric.category}</h4>
                    <span className={`text-sm font-medium ${metric.color}`}>
                      {metric.status}
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div className={`text-2xl font-bold ${metric.color}`}>
                      {metric.score}%
                    </div>
                    <Progress value={metric.score} className="h-2" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Detailed Analysis */}
        <Tabs defaultValue="gender" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="gender">Gender Analysis</TabsTrigger>
            <TabsTrigger value="regional">Regional Distribution</TabsTrigger>
            <TabsTrigger value="category">Social Categories</TabsTrigger>
            <TabsTrigger value="trends">Historical Trends</TabsTrigger>
          </TabsList>

          <TabsContent value="gender" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="gov-card">
                <CardHeader>
                  <CardTitle>Gender Distribution</CardTitle>
                  <CardDescription>
                    Allocation fairness across gender categories
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={genderData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="allocated" fill="#2563EB" name="Allocated" />
                      <Bar dataKey="total" fill="#10B981" name="Applied" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="gov-card">
                <CardHeader>
                  <CardTitle>Gender Allocation Rates</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {genderData.map((item, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{item.name}</span>
                        <span className="text-sm text-muted-foreground">
                          {item.allocated}/{item.total}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Progress value={item.percentage} className="flex-1" />
                        <span className="text-sm font-medium w-12">
                          {item.percentage.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="regional" className="space-y-4">
            <Card className="gov-card">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="flex items-center space-x-2">
                      <MapPin className="h-5 w-5" />
                      <span>State-wise Bias Analysis</span>
                    </CardTitle>
                    <CardDescription>
                      Regional distribution and potential bias indicators
                    </CardDescription>
                  </div>
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Export Report
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stateData.map((state, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div>
                          <h4 className="font-medium">{state.state}</h4>
                          <p className="text-sm text-muted-foreground">
                            Allocated: {state.allocated}/{state.total}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <p className="font-medium">
                            {((state.allocated / state.total) * 100).toFixed(1)}%
                          </p>
                          <p className="text-sm text-muted-foreground">Allocation Rate</p>
                        </div>
                        {getBiasBadge(state.bias)}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="category" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="gov-card">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <GraduationCap className="h-5 w-5" />
                    <span>Social Category Distribution</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value }) => `${name}: ${value}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="gov-card">
                <CardHeader>
                  <CardTitle>Category Compliance</CardTitle>
                  <CardDescription>
                    Adherence to reservation policies
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {categoryData.map((category, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded">
                      <div className="flex items-center space-x-3">
                        <div 
                          className="w-4 h-4 rounded"
                          style={{ backgroundColor: category.color }}
                        ></div>
                        <span className="font-medium">{category.name}</span>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{category.value}%</p>
                        <p className="text-xs text-muted-foreground">
                          {category.value >= 15 ? 'On Target' : 'Below Target'}
                        </p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="trends" className="space-y-4">
            <Card className="gov-card">
              <CardHeader>
                <CardTitle>Historical Bias Trends</CardTitle>
                <CardDescription>
                  Tracking fairness improvements over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-muted-foreground">
                  <p>Historical trend analysis will be displayed here</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Action Center */}
        <Card className="gov-card">
          <CardHeader>
            <CardTitle>Bias Mitigation Actions</CardTitle>
            <CardDescription>
              Recommended actions to improve allocation fairness
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button className="h-auto p-4 flex flex-col items-start space-y-2">
                <AlertTriangle className="h-5 w-5 text-destructive" />
                <div className="text-left">
                  <p className="font-medium">Review Gujarat Allocations</p>
                  <p className="text-xs text-muted-foreground">High bias detected</p>
                </div>
              </Button>
              
              <Button variant="outline" className="h-auto p-4 flex flex-col items-start space-y-2">
                <TrendingUp className="h-5 w-5 text-secondary" />
                <div className="text-left">
                  <p className="font-medium">Adjust Economic Quotas</p>
                  <p className="text-xs text-muted-foreground">67% compliance</p>
                </div>
              </Button>
              
              <Button variant="outline" className="h-auto p-4 flex flex-col items-start space-y-2">
                <Download className="h-5 w-5 text-primary" />
                <div className="text-left">
                  <p className="font-medium">Generate Full Report</p>
                  <p className="text-xs text-muted-foreground">Comprehensive analysis</p>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};