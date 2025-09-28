import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
} from 'lucide-react';

interface ReportsProps {}

export const Reports: React.FC<ReportsProps> = () => {
  // Mock data for reports
  const reportData = {
    candidates: {
      total: 1247,
      placed: 298,
      unplaced: 949
    },
    internships: {
      total: 342,
      filled: 298,
      vacant: 44
    },
    quotas: {
      rural: {
        target: 20,
        achieved: 18.5,
        filled: 60,
        required: 65
      },
      scSt: {
        target: 15,
        achieved: 14.2,
        filled: 45,
        required: 47
      },
      overall: {
        target: 100,
        achieved: 95.3,
        compliance: 'Good'
      }
    },
    performance: {
      allocationRate: 23.9,
      processingTime: 3.2,
      systemEfficiency: 94.5,
      userSatisfaction: 89
    },
    breakdown: {
      byLocation: [
        { city: 'Bangalore', internships: 85, filled: 78 },
        { city: 'Mumbai', internships: 72, filled: 65 },
        { city: 'Hyderabad', internships: 54, filled: 49 },
        { city: 'Delhi', internships: 48, filled: 43 },
        { city: 'Pune', internships: 35, filled: 32 },
        { city: 'Others', internships: 48, filled: 31 }
      ],
      byDomain: [
        { domain: 'Technology', internships: 125, filled: 118 },
        { domain: 'Finance', internships: 68, filled: 58 },
        { domain: 'Healthcare', internships: 45, filled: 38 },
        { domain: 'Manufacturing', internships: 42, filled: 35 },
        { domain: 'Consulting', internships: 35, filled: 28 },
        { domain: 'Others', internships: 27, filled: 21 }
      ]
    }
  };

  const handleExportReport = () => {
    console.log('Exporting comprehensive report...');
    // Add export logic here
  };

  const getQuotaStatus = (achieved: number, target: number) => {
    const percentage = (achieved / target) * 100;
    if (percentage >= 95) return { status: 'Excellent', color: 'text-green-600', bgColor: 'bg-green-50', borderColor: 'border-green-200' };
    if (percentage >= 80) return { status: 'Good', color: 'text-blue-600', bgColor: 'bg-blue-50', borderColor: 'border-blue-200' };
    if (percentage >= 60) return { status: 'Needs Improvement', color: 'text-orange-600', bgColor: 'bg-orange-50', borderColor: 'border-orange-200' };
    return { status: 'Critical', color: 'text-red-600', bgColor: 'bg-red-50', borderColor: 'border-red-200' };
  };

  const currentDate = new Date().toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <DashboardLayout title="Allocation Reports">
      <div className="space-y-6">
        {/* Report Header */}
        <Card className="gov-card">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
              <div>
                <h2 className="text-2xl font-bold text-blue-900">PM Internship Scheme - Allocation Report</h2>
                <p className="text-muted-foreground mt-1">
                  Generated on {currentDate} | Allocation Cycle 2025
                </p>
              </div>
              <div className="flex space-x-3">
                <Badge className="gov-badge-primary">Live Data</Badge>
                <Button onClick={handleExportReport}>
                  <Download className="h-4 w-4 mr-2" />
                  Export Report
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Key Metrics Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="gov-card">
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Users className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-2xl font-bold">{reportData.candidates.placed}</p>
                  <p className="text-sm text-muted-foreground">Candidates Placed</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="gov-card">
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Building className="h-8 w-8 text-secondary" />
                <div>
                  <p className="text-2xl font-bold">{reportData.internships.filled}</p>
                  <p className="text-sm text-muted-foreground">Positions Filled</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="gov-card">
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Target className="h-8 w-8 text-accent" />
                <div>
                  <p className="text-2xl font-bold">{reportData.quotas.overall.achieved}%</p>
                  <p className="text-sm text-muted-foreground">Quota Compliance</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="gov-card">
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-8 w-8 text-green-600" />
                <div>
                  <p className="text-2xl font-bold">{reportData.performance.allocationRate}%</p>
                  <p className="text-sm text-muted-foreground">Allocation Rate</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Report Tabs */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="quotas">Quota Analysis</TabsTrigger>
            <TabsTrigger value="breakdown">Geographic Breakdown</TabsTrigger>
            <TabsTrigger value="performance">Performance Metrics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            {/* Placement Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="gov-card">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Users className="h-5 w-5" />
                    <span>Candidate Placement Status</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Total Candidates</span>
                      <span className="text-2xl font-bold text-blue-900">{reportData.candidates.total}</span>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm">Placed</span>
                          <span className="text-sm font-medium">{reportData.candidates.placed} ({Math.round((reportData.candidates.placed / reportData.candidates.total) * 100)}%)</span>
                        </div>
                        <Progress 
                          value={(reportData.candidates.placed / reportData.candidates.total) * 100} 
                          className="h-3 bg-green-100"
                        />
                      </div>

                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm">Unplaced</span>
                          <span className="text-sm font-medium">{reportData.candidates.unplaced} ({Math.round((reportData.candidates.unplaced / reportData.candidates.total) * 100)}%)</span>
                        </div>
                        <Progress 
                          value={(reportData.candidates.unplaced / reportData.candidates.total) * 100} 
                          className="h-3 bg-orange-100"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                      <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                        <div className="text-2xl font-bold text-green-900">{reportData.candidates.placed}</div>
                        <div className="text-sm text-green-700">Successfully Placed</div>
                      </div>
                      <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                        <div className="text-2xl font-bold text-orange-900">{reportData.candidates.unplaced}</div>
                        <div className="text-sm text-orange-700">Awaiting Placement</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="gov-card">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Building className="h-5 w-5" />
                    <span>Internship Fulfillment</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Total Positions</span>
                      <span className="text-2xl font-bold text-blue-900">{reportData.internships.total}</span>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm">Filled</span>
                          <span className="text-sm font-medium">{reportData.internships.filled} ({Math.round((reportData.internships.filled / reportData.internships.total) * 100)}%)</span>
                        </div>
                        <Progress 
                          value={(reportData.internships.filled / reportData.internships.total) * 100} 
                          className="h-3 bg-blue-100"
                        />
                      </div>

                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm">Vacant</span>
                          <span className="text-sm font-medium">{reportData.internships.vacant} ({Math.round((reportData.internships.vacant / reportData.internships.total) * 100)}%)</span>
                        </div>
                        <Progress 
                          value={(reportData.internships.vacant / reportData.internships.total) * 100} 
                          className="h-3 bg-gray-100"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                        <div className="text-2xl font-bold text-blue-900">{reportData.internships.filled}</div>
                        <div className="text-sm text-blue-700">Positions Filled</div>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <div className="text-2xl font-bold text-gray-900">{reportData.internships.vacant}</div>
                        <div className="text-sm text-gray-700">Still Vacant</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="quotas" className="space-y-4">
            <Card className="gov-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="h-5 w-5" />
                  <span>Quota Fulfillment Analysis</span>
                </CardTitle>
                <CardDescription>
                  Affirmative action compliance and representation metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  {/* Rural Districts Quota */}
                  <div className={`p-6 rounded-lg border ${getQuotaStatus(reportData.quotas.rural.achieved, reportData.quotas.rural.target).bgColor} ${getQuotaStatus(reportData.quotas.rural.achieved, reportData.quotas.rural.target).borderColor}`}>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">Rural Districts Quota</h3>
                      <Badge className={`${getQuotaStatus(reportData.quotas.rural.achieved, reportData.quotas.rural.target).color}`}>
                        {getQuotaStatus(reportData.quotas.rural.achieved, reportData.quotas.rural.target).status}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <div className="text-2xl font-bold text-gray-900">{reportData.quotas.rural.target}%</div>
                        <div className="text-sm text-gray-600">Target Quota</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-blue-900">{reportData.quotas.rural.achieved}%</div>
                        <div className="text-sm text-gray-600">Achieved</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-green-900">{reportData.quotas.rural.filled}/{reportData.quotas.rural.required}</div>
                        <div className="text-sm text-gray-600">Positions Filled</div>
                      </div>
                    </div>

                    <div className="mt-4">
                      <Progress value={reportData.quotas.rural.achieved * 5} className="h-2" />
                    </div>
                  </div>

                  {/* SC/ST Quota */}
                  <div className={`p-6 rounded-lg border ${getQuotaStatus(reportData.quotas.scSt.achieved, reportData.quotas.scSt.target).bgColor} ${getQuotaStatus(reportData.quotas.scSt.achieved, reportData.quotas.scSt.target).borderColor}`}>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">SC/ST Category Quota</h3>
                      <Badge className={`${getQuotaStatus(reportData.quotas.scSt.achieved, reportData.quotas.scSt.target).color}`}>
                        {getQuotaStatus(reportData.quotas.scSt.achieved, reportData.quotas.scSt.target).status}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <div className="text-2xl font-bold text-gray-900">{reportData.quotas.scSt.target}%</div>
                        <div className="text-sm text-gray-600">Target Quota</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-purple-900">{reportData.quotas.scSt.achieved}%</div>
                        <div className="text-sm text-gray-600">Achieved</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-green-900">{reportData.quotas.scSt.filled}/{reportData.quotas.scSt.required}</div>
                        <div className="text-sm text-gray-600">Positions Filled</div>
                      </div>
                    </div>

                    <div className="mt-4">
                      <Progress value={reportData.quotas.scSt.achieved * 6.67} className="h-2" />
                    </div>
                  </div>

                  {/* Overall Compliance */}
                  <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-green-900">Overall Quota Compliance</h3>
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        <Badge className="bg-green-100 text-green-800">{reportData.quotas.overall.compliance}</Badge>
                      </div>
                    </div>

                    <div className="text-center">
                      <div className="text-4xl font-bold text-green-900 mb-2">{reportData.quotas.overall.achieved}%</div>
                      <div className="text-green-700">Total Compliance Score</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="breakdown" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="gov-card">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <MapPin className="h-5 w-5" />
                    <span>Location-wise Distribution</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {reportData.breakdown.byLocation.map((location, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-blue-50 rounded border">
                        <div>
                          <div className="font-medium">{location.city}</div>
                          <div className="text-sm text-muted-foreground">{location.filled}/{location.internships} filled</div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">{Math.round((location.filled / location.internships) * 100)}%</div>
                          <Badge variant="outline" className="text-xs">
                            {location.filled} placed
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="gov-card">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <BarChart3 className="h-5 w-5" />
                    <span>Domain-wise Analysis</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {reportData.breakdown.byDomain.map((domain, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-green-50 rounded border">
                        <div>
                          <div className="font-medium">{domain.domain}</div>
                          <div className="text-sm text-muted-foreground">{domain.filled}/{domain.internships} filled</div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">{Math.round((domain.filled / domain.internships) * 100)}%</div>
                          <Badge variant="outline" className="text-xs">
                            {domain.filled} placed
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="performance" className="space-y-4">
            <Card className="gov-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5" />
                  <span>System Performance Metrics</span>
                </CardTitle>
                <CardDescription>
                  Efficiency and effectiveness indicators for the allocation system
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-6">
                    <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                      <h4 className="font-semibold text-blue-900 mb-4">Allocation Efficiency</h4>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between mb-2">
                            <span className="text-sm">Allocation Rate</span>
                            <span className="font-medium">{reportData.performance.allocationRate}%</span>
                          </div>
                          <Progress value={reportData.performance.allocationRate * 4.17} className="h-2" />
                        </div>
                        <div>
                          <div className="flex justify-between mb-2">
                            <span className="text-sm">System Efficiency</span>
                            <span className="font-medium">{reportData.performance.systemEfficiency}%</span>
                          </div>
                          <Progress value={reportData.performance.systemEfficiency} className="h-2" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                      <h4 className="font-semibold text-green-900 mb-4">Processing Metrics</h4>
                      <div className="space-y-4">
                        <div className="flex justify-between">
                          <span className="text-sm">Processing Time</span>
                          <span className="font-medium">{reportData.performance.processingTime}s</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">User Satisfaction</span>
                          <span className="font-medium">{reportData.performance.userSatisfaction}%</span>
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