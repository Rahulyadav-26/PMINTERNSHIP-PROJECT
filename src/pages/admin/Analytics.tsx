import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
} from 'lucide-react';

interface AnalyticsProps {}

export const Analytics: React.FC<AnalyticsProps> = () => {
  // Mock data for analytics
  const skillsAnalytics = {
    topSkills: [
      {
        skill: 'Python',
        demand: 145,
        available: 89,
        gap: 56,
        matchRate: 61.4
      },
      {
        skill: 'JavaScript',
        demand: 132,
        available: 76,
        gap: 56,
        matchRate: 57.6
      },
      {
        skill: 'Machine Learning',
        demand: 98,
        available: 42,
        gap: 56,
        matchRate: 42.9
      },
      {
        skill: 'React',
        demand: 87,
        available: 58,
        gap: 29,
        matchRate: 66.7
      },
      {
        skill: 'Java',
        demand: 78,
        available: 91,
        gap: -13,
        matchRate: 116.7
      }
    ],
    summary: {
      totalDemand: 540,
      totalAvailable: 356,
      overallGap: 184,
      averageMatchRate: 69.1
    },
    insights: [
      { type: 'High Demand', skill: 'Python', note: 'Highest skill gap - 56 positions unfilled' },
      { type: 'Surplus', skill: 'Java', note: '13 more candidates than required positions' },
      { type: 'Best Match', skill: 'React', note: 'Highest match rate at 66.7%' },
      { type: 'Critical Gap', skill: 'Machine Learning', note: 'Only 42.9% demand fulfilled' }
    ]
  };

  const handleRefreshData = () => {
    console.log('Refreshing analytics data...');
    // Add refresh logic here
  };

  const handleExportAnalytics = () => {
    console.log('Exporting analytics report...');
    // Add export logic here
  };

  const getSkillStatus = (matchRate: number) => {
    if (matchRate >= 80) return { status: 'Excellent', color: 'bg-green-500', textColor: 'text-green-700' };
    if (matchRate >= 60) return { status: 'Good', color: 'bg-blue-500', textColor: 'text-blue-700' };
    if (matchRate >= 40) return { status: 'Low', color: 'bg-orange-500', textColor: 'text-orange-700' };
    return { status: 'Critical', color: 'bg-red-500', textColor: 'text-red-700' };
  };

  const getMaxValue = () => {
    return Math.max(...skillsAnalytics.topSkills.map(skill => Math.max(skill.demand, skill.available)));
  };

  const maxValue = getMaxValue();

  return (
    <DashboardLayout title="Skills Analytics">
      <div className="space-y-6">
        {/* Analytics Header */}
        <Card className="gov-card">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
              <div>
                <h2 className="text-2xl font-bold text-blue-900">Skills Demand Analytics</h2>
                <p className="text-muted-foreground mt-1">
                  Real-time insights into skill demand vs candidate availability
                </p>
              </div>
              <div className="flex space-x-3">
                <Badge className="gov-badge-primary">Live Data</Badge>
                <Button variant="outline" onClick={handleRefreshData}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
                <Button onClick={handleExportAnalytics}>
                  <Download className="h-4 w-4 mr-2" />
                  Export
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
                <Target className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-2xl font-bold">{skillsAnalytics.summary.totalDemand}</p>
                  <p className="text-sm text-muted-foreground">Total Skill Demand</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="gov-card">
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Users className="h-8 w-8 text-secondary" />
                <div>
                  <p className="text-2xl font-bold">{skillsAnalytics.summary.totalAvailable}</p>
                  <p className="text-sm text-muted-foreground">Available Candidates</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="gov-card">
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Activity className="h-8 w-8 text-accent" />
                <div>
                  <p className="text-2xl font-bold">{skillsAnalytics.summary.overallGap}</p>
                  <p className="text-sm text-muted-foreground">Skill Gap</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="gov-card">
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-8 w-8 text-green-600" />
                <div>
                  <p className="text-2xl font-bold">{skillsAnalytics.summary.averageMatchRate}%</p>
                  <p className="text-sm text-muted-foreground">Avg Match Rate</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Analytics Tabs */}
        <Tabs defaultValue="skills" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="skills">Skills Analysis</TabsTrigger>
            <TabsTrigger value="insights">Key Insights</TabsTrigger>
            <TabsTrigger value="trends">Market Trends</TabsTrigger>
          </TabsList>

          <TabsContent value="skills" className="space-y-4">
            {/* Main Bar Chart */}
            <Card className="gov-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5" />
                  <span>Top 5 Skills: Demand vs Available Candidates</span>
                </CardTitle>
                <CardDescription>
                  Compare market demand with candidate availability for in-demand skills
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  {/* Chart Legend */}
                  <div className="flex justify-center space-x-8 mb-6">
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 bg-blue-500 rounded"></div>
                      <span className="text-sm font-medium">Demand</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 bg-green-500 rounded"></div>
                      <span className="text-sm font-medium">Available</span>
                    </div>
                  </div>

                  {/* Bar Chart Visualization */}
                  <div className="space-y-6">
                    {skillsAnalytics.topSkills.map((skill, index) => (
                      <div key={index} className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold text-lg text-gray-900">{skill.skill}</h4>
                          <div className="flex items-center space-x-4">
                            <Badge className={getSkillStatus(skill.matchRate).textColor}>
                              {skill.matchRate}% Match
                            </Badge>
                            <span className="text-sm text-muted-foreground">
                              Gap: {skill.gap > 0 ? '+' : ''}{skill.gap}
                            </span>
                          </div>
                        </div>

                        <div className="space-y-2">
                          {/* Demand Bar */}
                          <div className="flex items-center space-x-3">
                            <span className="text-sm font-medium w-20 text-blue-700">Demand</span>
                            <div className="flex-1 bg-gray-200 rounded-full h-6 relative">
                              <div 
                                className="bg-blue-500 h-6 rounded-full flex items-center justify-end pr-3"
                                style={{ width: `${(skill.demand / maxValue) * 100}%` }}
                              >
                                <span className="text-white text-xs font-medium">{skill.demand}</span>
                              </div>
                            </div>
                          </div>

                          {/* Available Bar */}
                          <div className="flex items-center space-x-3">
                            <span className="text-sm font-medium w-20 text-green-700">Available</span>
                            <div className="flex-1 bg-gray-200 rounded-full h-6 relative">
                              <div 
                                className="bg-green-500 h-6 rounded-full flex items-center justify-end pr-3"
                                style={{ width: `${(skill.available / maxValue) * 100}%` }}
                              >
                                <span className="text-white text-xs font-medium">{skill.available}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Chart Summary */}
                  <div className="bg-blue-50 p-6 rounded-lg border border-blue-200 mt-8">
                    <h4 className="font-semibold text-blue-900 mb-4">Summary</h4>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-900">{skillsAnalytics.summary.totalDemand}</div>
                        <div className="text-blue-700">Total Positions</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-900">{skillsAnalytics.summary.totalAvailable}</div>
                        <div className="text-green-700">Total Candidates</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-orange-900">{skillsAnalytics.summary.overallGap}</div>
                        <div className="text-orange-700">Unfilled Gap</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-900">{skillsAnalytics.summary.averageMatchRate}%</div>
                        <div className="text-purple-700">Avg Match Rate</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="insights" className="space-y-4">
            <Card className="gov-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Eye className="h-5 w-5" />
                  <span>Key Market Insights</span>
                </CardTitle>
                <CardDescription>
                  Actionable intelligence derived from skills demand analysis
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {skillsAnalytics.insights.map((insight, index) => (
                    <div key={index} className="border-l-4 border-blue-500 bg-blue-50 p-4 rounded">
                      <div className="flex items-start space-x-3">
                        <Badge className="gov-badge-primary">{insight.type}</Badge>
                        <div>
                          <h4 className="font-semibold text-blue-900">{insight.skill}</h4>
                          <p className="text-sm text-blue-700 mt-1">{insight.note}</p>
                        </div>
                      </div>
                    </div>
                  ))}

                  <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200 mt-6">
                    <div className="flex items-center space-x-2 mb-3">
                      <Zap className="h-5 w-5 text-yellow-600" />
                      <h4 className="font-semibold text-yellow-900">Recommendation</h4>
                    </div>
                    <p className="text-yellow-800 text-sm">
                      Focus recruitment efforts on Python and Machine Learning candidates. 
                      Consider upskilling programs for JavaScript and React to bridge the gap. 
                      Java shows surplus - redirect to other technologies.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="trends" className="space-y-4">
            <Card className="gov-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5" />
                  <span>Market Trends</span>
                </CardTitle>
                <CardDescription>
                  Skill demand patterns and future projections
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                      <h4 className="font-semibold text-green-900 mb-4">Growing Skills</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Machine Learning</span>
                          <Badge className="bg-green-100 text-green-800">↑ 23%</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Python</span>
                          <Badge className="bg-green-100 text-green-800">↑ 18%</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">React</span>
                          <Badge className="bg-green-100 text-green-800">↑ 15%</Badge>
                        </div>
                      </div>
                    </div>

                    <div className="bg-red-50 p-6 rounded-lg border border-red-200">
                      <h4 className="font-semibold text-red-900 mb-4">Declining Skills</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Legacy Java</span>
                          <Badge className="bg-red-100 text-red-800">↓ 8%</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">PHP</span>
                          <Badge className="bg-red-100 text-red-800">↓ 12%</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">jQuery</span>
                          <Badge className="bg-red-100 text-red-800">↓ 15%</Badge>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                    <h4 className="font-semibold text-gray-900 mb-4">Future Outlook</h4>
                    <div className="text-sm text-gray-700 space-y-2">
                      <p>• AI/ML skills expected to grow 35% in next 6 months</p>
                      <p>• Cloud technologies (AWS, Azure) showing steady 20% increase</p>
                      <p>• Mobile development (React Native, Flutter) gaining traction</p>
                      <p>• Data Science and Analytics maintaining strong demand</p>
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