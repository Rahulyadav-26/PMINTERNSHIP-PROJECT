import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
} from 'lucide-react';

interface AllocationRulesProps {}

export const AllocationRules: React.FC<AllocationRulesProps> = () => {
  const [weights, setWeights] = useState({
    skill: 50,
    qualification: 20,
    location: 15,
    pastParticipation: -10
  });

  const [quotas, setQuotas] = useState({
    ruralDistricts: false,
    scSt: false
  });

  const handleWeightChange = (key: keyof typeof weights, value: number) => {
    setWeights(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleQuotaToggle = (key: keyof typeof quotas) => {
    setQuotas(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleSave = () => {
    console.log('Allocation Rules Saved:', { weights, quotas });
    // Add save logic here
  };

  const handleReset = () => {
    setWeights({
      skill: 50,
      qualification: 20,
      location: 15,
      pastParticipation: -10
    });
    setQuotas({
      ruralDistricts: false,
      scSt: false
    });
  };

  const getWeightColor = (weight: number) => {
    if (weight >= 40) return 'bg-blue-600';
    if (weight >= 20) return 'bg-blue-500';
    return 'bg-blue-400';
  };

  return (
    <DashboardLayout title="Allocation Rules Configuration">
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="gov-card">
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Sliders className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-2xl font-bold">{Object.values(weights).filter(w => w > 0).length}</p>
                  <p className="text-sm text-muted-foreground">Active Weights</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="gov-card">
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Users className="h-8 w-8 text-secondary" />
                <div>
                  <p className="text-2xl font-bold">{Object.values(quotas).filter(q => q).length}</p>
                  <p className="text-sm text-muted-foreground">Active Quotas</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="gov-card">
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Settings className="h-8 w-8 text-accent" />
                <div>
                  <p className="text-2xl font-bold">
                    {Object.values(weights).reduce((sum, weight) => sum + Math.max(0, weight), 0)}%
                  </p>
                  <p className="text-sm text-muted-foreground">Total Weight</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="gov-card">
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-8 w-8 text-green-600" />
                <div>
                  <p className="text-2xl font-bold">Ready</p>
                  <p className="text-sm text-muted-foreground">System Status</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Configuration Tabs */}
        <Tabs defaultValue="weights" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="weights">Matching Weights</TabsTrigger>
            <TabsTrigger value="quotas">Affirmative Action</TabsTrigger>
            <TabsTrigger value="summary">Configuration Summary</TabsTrigger>
          </TabsList>

          <TabsContent value="weights" className="space-y-4">
            <Card className="gov-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Sliders className="h-5 w-5" />
                  <span>Weight Configuration</span>
                </CardTitle>
                <CardDescription>
                  Configure the importance of different factors in internship matching
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                {/* Skill Weight */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <GraduationCap className="h-5 w-5 text-blue-600" />
                      <Label className="text-base font-medium">Skill Match Weight</Label>
                    </div>
                    <Badge className="gov-badge-primary">{weights.skill}%</Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-4">
                      <Input
                        type="range"
                        min="0"
                        max="100"
                        value={weights.skill}
                        onChange={(e) => handleWeightChange('skill', Number(e.target.value))}
                        className="flex-1 h-2"
                      />
                      <Input
                        type="number"
                        min="0"
                        max="100"
                        value={weights.skill}
                        onChange={(e) => handleWeightChange('skill', Number(e.target.value))}
                        className="w-20"
                      />
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${getWeightColor(weights.skill)}`}
                        style={{ width: `${weights.skill}%` }}
                      ></div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      How closely candidate skills should match internship requirements (Default: 50%)
                    </p>
                  </div>
                </div>

                {/* Qualification Weight */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <GraduationCap className="h-5 w-5 text-blue-600" />
                      <Label className="text-base font-medium">Qualification Weight</Label>
                    </div>
                    <Badge className="gov-badge-primary">{weights.qualification}%</Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-4">
                      <Input
                        type="range"
                        min="0"
                        max="100"
                        value={weights.qualification}
                        onChange={(e) => handleWeightChange('qualification', Number(e.target.value))}
                        className="flex-1 h-2"
                      />
                      <Input
                        type="number"
                        min="0"
                        max="100"
                        value={weights.qualification}
                        onChange={(e) => handleWeightChange('qualification', Number(e.target.value))}
                        className="w-20"
                      />
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${getWeightColor(weights.qualification)}`}
                        style={{ width: `${weights.qualification}%` }}
                      ></div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Importance of academic qualifications and course relevance (Default: 20%)
                    </p>
                  </div>
                </div>

                {/* Location Weight */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-5 w-5 text-blue-600" />
                      <Label className="text-base font-medium">Location Preference Weight</Label>
                    </div>
                    <Badge className="gov-badge-primary">{weights.location}%</Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-4">
                      <Input
                        type="range"
                        min="0"
                        max="100"
                        value={weights.location}
                        onChange={(e) => handleWeightChange('location', Number(e.target.value))}
                        className="flex-1 h-2"
                      />
                      <Input
                        type="number"
                        min="0"
                        max="100"
                        value={weights.location}
                        onChange={(e) => handleWeightChange('location', Number(e.target.value))}
                        className="w-20"
                      />
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${getWeightColor(weights.location)}`}
                        style={{ width: `${weights.location}%` }}
                      ></div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Consider candidate location preferences and proximity (Default: 15%)
                    </p>
                  </div>
                </div>

                {/* Past Participation Penalty */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <AlertCircle className="h-5 w-5 text-red-600" />
                      <Label className="text-base font-medium">Past Participation Penalty</Label>
                    </div>
                    <Badge variant="destructive">{weights.pastParticipation}%</Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-4">
                      <Input
                        type="range"
                        min="-50"
                        max="0"
                        value={weights.pastParticipation}
                        onChange={(e) => handleWeightChange('pastParticipation', Number(e.target.value))}
                        className="flex-1 h-2"
                      />
                      <Input
                        type="number"
                        min="-50"
                        max="0"
                        value={weights.pastParticipation}
                        onChange={(e) => handleWeightChange('pastParticipation', Number(e.target.value))}
                        className="w-20"
                      />
                    </div>
                    <div className="w-full bg-red-200 rounded-full h-2">
                      <div
                        className="h-2 rounded-full bg-red-600"
                        style={{ width: `${Math.abs(weights.pastParticipation) * 2}%` }}
                      ></div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Penalty for candidates who have participated before (Default: -10%)
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="quotas" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Rural Districts Quota */}
              <Card className="gov-card">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Users className="h-5 w-5 text-green-600" />
                      <span>Rural Districts</span>
                    </div>
                    <Button
                      onClick={() => handleQuotaToggle('ruralDistricts')}
                      variant={quotas.ruralDistricts ? "default" : "outline"}
                      size="sm"
                    >
                      {quotas.ruralDistricts ? 'Enabled' : 'Disabled'}
                    </Button>
                  </CardTitle>
                  <CardDescription>
                    Reserve positions for rural and aspirational districts
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-green-900">Reservation Percentage</span>
                        <Badge className="bg-green-100 text-green-800">20%</Badge>
                      </div>
                      <p className="text-sm text-green-700">
                        20% of total internship positions reserved for candidates from rural/aspirational districts
                      </p>
                    </div>
                    {quotas.ruralDistricts && (
                      <div className="p-3 bg-green-100 rounded border-l-4 border-green-500">
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span className="text-sm text-green-800 font-medium">
                            Rural Districts Quota Active
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* SC/ST Quota */}
              <Card className="gov-card">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Users className="h-5 w-5 text-purple-600" />
                      <span>SC/ST Category</span>
                    </div>
                    <Button
                      onClick={() => handleQuotaToggle('scSt')}
                      variant={quotas.scSt ? "default" : "outline"}
                      size="sm"
                    >
                      {quotas.scSt ? 'Enabled' : 'Disabled'}
                    </Button>
                  </CardTitle>
                  <CardDescription>
                    Constitutional mandate for scheduled caste/tribe representation
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-purple-900">Reservation Percentage</span>
                        <Badge className="bg-purple-100 text-purple-800">15%</Badge>
                      </div>
                      <p className="text-sm text-purple-700">
                        15% of total internship positions reserved for SC/ST category candidates
                      </p>
                    </div>
                    {quotas.scSt && (
                      <div className="p-3 bg-purple-100 rounded border-l-4 border-purple-500">
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-purple-600" />
                          <span className="text-sm text-purple-800 font-medium">
                            SC/ST Quota Active
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="summary" className="space-y-4">
            <Card className="gov-card">
              <CardHeader>
                <CardTitle>Current Configuration Summary</CardTitle>
                <CardDescription>
                  Overview of all allocation rules and their current settings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Weight Summary */}
                  <div>
                    <h4 className="text-lg font-semibold mb-4 flex items-center space-x-2">
                      <Sliders className="h-5 w-5" />
                      <span>Matching Weights</span>
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <div className="flex justify-between items-center p-3 bg-blue-50 rounded">
                          <span className="font-medium">Skill Match</span>
                          <Badge className="gov-badge-primary">{weights.skill}%</Badge>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-blue-50 rounded">
                          <span className="font-medium">Qualification</span>
                          <Badge className="gov-badge-primary">{weights.qualification}%</Badge>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center p-3 bg-blue-50 rounded">
                          <span className="font-medium">Location</span>
                          <Badge className="gov-badge-primary">{weights.location}%</Badge>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-red-50 rounded">
                          <span className="font-medium">Past Participation</span>
                          <Badge variant="destructive">{weights.pastParticipation}%</Badge>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Quota Summary */}
                  <div>
                    <h4 className="text-lg font-semibold mb-4 flex items-center space-x-2">
                      <Users className="h-5 w-5" />
                      <span>Active Quotas</span>
                    </h4>
                    <div className="space-y-3">
                      <div className={`p-3 rounded border ${
                        quotas.ruralDistricts ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'
                      }`}>
                        <div className="flex items-center justify-between">
                          <span className="font-medium">Rural Districts (20%)</span>
                          <Badge variant={quotas.ruralDistricts ? "default" : "secondary"}>
                            {quotas.ruralDistricts ? 'Active' : 'Inactive'}
                          </Badge>
                        </div>
                      </div>
                      <div className={`p-3 rounded border ${
                        quotas.scSt ? 'bg-purple-50 border-purple-200' : 'bg-gray-50 border-gray-200'
                      }`}>
                        <div className="flex items-center justify-between">
                          <span className="font-medium">SC/ST Category (15%)</span>
                          <Badge variant={quotas.scSt ? "default" : "secondary"}>
                            {quotas.scSt ? 'Active' : 'Inactive'}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4 justify-end pt-4 border-t">
                    <Button variant="outline" onClick={handleReset}>
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Reset to Defaults
                    </Button>
                    <Button onClick={handleSave}>
                      <Save className="h-4 w-4 mr-2" />
                      Save Configuration
                    </Button>
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