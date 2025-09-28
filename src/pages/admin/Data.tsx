import React, { useState } from 'react';
import { 
  Users, 
  Building2, 
  BrainCircuit, 
  BarChart3, 
  Settings, 
  MapPin,
  GraduationCap,
  Target,
  Clock,
  CheckCircle,
  AlertCircle,
  TrendingUp
} from 'lucide-react';

// Main Admin Dashboard Component
const AdminDashboard: React.FC = () => {
  const [activeSection, setActiveSection] = useState('overview');

  const renderContent = () => {
    switch (activeSection) {
      case 'matching':
        return <AIMatchingEngine />;
      case 'analytics':
        return <AnalyticsDashboard />;
      case 'settings':
        return <SystemSettings />;
      default:
        return <OverviewSection />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Internship Admin Panel</h1>
            <p className="text-sm text-slate-600">Smart India Hackathon 2025 Platform</p>
          </div>
          <div className="flex items-center space-x-4">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              Quick Actions
            </button>
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-blue-600">A</span>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar Navigation */}
        <nav className="w-64 bg-white border-r border-slate-200 min-h-screen p-4">
          <div className="space-y-2">
            <button
              onClick={() => setActiveSection('overview')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                activeSection === 'overview'
                  ? 'bg-blue-50 text-blue-600 border border-blue-200'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <BarChart3 className="h-5 w-5" />
              <span>Overview</span>
            </button>

            <button
              onClick={() => setActiveSection('matching')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                activeSection === 'matching'
                  ? 'bg-blue-50 text-blue-600 border border-blue-200'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <BrainCircuit className="h-5 w-5" />
              <span>AI Matching</span>
            </button>

            <button
              onClick={() => setActiveSection('analytics')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                activeSection === 'analytics'
                  ? 'bg-blue-50 text-blue-600 border border-blue-200'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <TrendingUp className="h-5 w-5" />
              <span>Analytics</span>
            </button>

            <button
              onClick={() => setActiveSection('settings')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                activeSection === 'settings'
                  ? 'bg-blue-50 text-blue-600 border border-blue-200'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Settings className="h-5 w-5" />
              <span>System Settings</span>
            </button>

            <div className="border-t border-slate-200 pt-4 mt-4">
              <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left text-slate-600 hover:bg-slate-50 transition-colors">
                <Users className="h-5 w-5" />
                <span>Students</span>
              </button>
              <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left text-slate-600 hover:bg-slate-50 transition-colors">
                <Building2 className="h-5 w-5" />
                <span>Companies</span>
              </button>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

// Overview Section Component
const OverviewSection: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-slate-800 mb-2">Platform Overview</h2>
        <p className="text-slate-600">Monitor key metrics and system performance</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg p-6 shadow-sm border border-blue-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">Total Students</p>
              <p className="text-2xl font-bold text-blue-900">2,847</p>
            </div>
            <GraduationCap className="h-8 w-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-green-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600">Active Internships</p>
              <p className="text-2xl font-bold text-green-900">156</p>
            </div>
            <Building2 className="h-8 w-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-purple-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-600">Successful Matches</p>
              <p className="text-2xl font-bold text-purple-900">1,234</p>
            </div>
            <Target className="h-8 w-8 text-purple-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-orange-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-orange-600">Pending Applications</p>
              <p className="text-2xl font-bold text-orange-900">89</p>
            </div>
            <Clock className="h-8 w-8 text-orange-500" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="bg-blue-50 hover:bg-blue-100 text-blue-700 p-4 rounded-lg text-left transition-colors">
            <div className="font-medium mb-1">Run AI Matching</div>
            <div className="text-sm text-blue-600">Process pending applications</div>
          </button>
          <button className="bg-green-50 hover:bg-green-100 text-green-700 p-4 rounded-lg text-left transition-colors">
            <div className="font-medium mb-1">Generate Report</div>
            <div className="text-sm text-green-600">Export analytics data</div>
          </button>
          <button className="bg-purple-50 hover:bg-purple-100 text-purple-700 p-4 rounded-lg text-left transition-colors">
            <div className="font-medium mb-1">System Backup</div>
            <div className="text-sm text-purple-600">Create data backup</div>
          </button>
        </div>
      </div>
    </div>
  );
};

// Your existing components go here...
// AIMatchingEngine component
// AnalyticsDashboard component  
// SystemSettings component


// AI Matching Engine Component
const AIMatchingEngine: React.FC = () => {
  const [matchingStatus, setMatchingStatus] = useState('idle'); // idle, running, completed
  const [selectedAlgorithm, setSelectedAlgorithm] = useState('advanced');
  const [weightSettings, setWeightSettings] = useState({
    skills: 40,
    location: 20,
    category: 15,
    experience: 15,
    preference: 10
  });

  const matchingRuns = [
    {
      id: 1,
      timestamp: '2025-09-28 14:30',
      studentsProcessed: 1420,
      internshipsProcessed: 89,
      successfulMatches: 445,
      status: 'completed',
      duration: '2m 34s',
      accuracy: 87.5
    },
    {
      id: 2,
      timestamp: '2025-09-28 12:15',
      studentsProcessed: 1388,
      internshipsProcessed: 92,
      successfulMatches: 421,
      status: 'completed',
      duration: '2m 12s',
      accuracy: 89.2
    }
  ];

  const handleRunMatching = () => {
    setMatchingStatus('running');
    // Simulate matching process
    setTimeout(() => {
      setMatchingStatus('completed');
    }, 5000);
  };

  return (
    <div className="space-y-6">
      {/* AI Matching Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-6 shadow-sm border border-blue-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">Total Matches Today</p>
              <p className="text-2xl font-bold text-blue-900">445</p>
            </div>
            <BrainCircuit className="h-8 w-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-green-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600">Match Accuracy</p>
              <p className="text-2xl font-bold text-green-900">87.5%</p>
            </div>
            <Target className="h-8 w-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-purple-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-600">Processing Time</p>
              <p className="text-2xl font-bold text-purple-900">2m 34s</p>
            </div>
            <Clock className="h-8 w-8 text-purple-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-orange-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-orange-600">Pending Reviews</p>
              <p className="text-2xl font-bold text-orange-900">124</p>
            </div>
            <AlertCircle className="h-8 w-8 text-orange-500" />
          </div>
        </div>
      </div>

      {/* Matching Controls */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-slate-800">AI Matching Engine Controls</h3>
          <div className="flex gap-3">
            <button 
              onClick={handleRunMatching}
              disabled={matchingStatus === 'running'}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400"
            >
              {matchingStatus === 'running' ? 'Processing...' : 'Run Matching'}
            </button>
            <button className="border border-slate-300 text-slate-700 px-4 py-2 rounded-lg hover:bg-slate-50 transition-colors">
              Schedule
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Algorithm Selection */}
          <div>
            <h4 className="font-medium text-slate-800 mb-3">Algorithm Configuration</h4>
            <div className="space-y-3">
              <label className="flex items-center space-x-3">
                <input
                  type="radio"
                  value="basic"
                  checked={selectedAlgorithm === 'basic'}
                  onChange={(e) => setSelectedAlgorithm(e.target.value)}
                  className="text-blue-600"
                />
                <div>
                  <div className="font-medium text-slate-700">Basic Matching</div>
                  <div className="text-sm text-slate-600">Simple skill and location based matching</div>
                </div>
              </label>

              <label className="flex items-center space-x-3">
                <input
                  type="radio"
                  value="advanced"
                  checked={selectedAlgorithm === 'advanced'}
                  onChange={(e) => setSelectedAlgorithm(e.target.value)}
                  className="text-blue-600"
                />
                <div>
                  <div className="font-medium text-slate-700">Advanced ML Matching</div>
                  <div className="text-sm text-slate-600">Multi-factor weighted algorithm with learning</div>
                </div>
              </label>

              <label className="flex items-center space-x-3">
                <input
                  type="radio"
                  value="experimental"
                  checked={selectedAlgorithm === 'experimental'}
                  onChange={(e) => setSelectedAlgorithm(e.target.value)}
                  className="text-blue-600"
                />
                <div>
                  <div className="font-medium text-slate-700">Experimental AI</div>
                  <div className="text-sm text-slate-600">Latest neural network based matching</div>
                </div>
              </label>
            </div>
          </div>

          {/* Weight Configuration */}
          <div>
            <h4 className="font-medium text-slate-800 mb-3">Matching Weights (%)</h4>
            <div className="space-y-4">
              {Object.entries(weightSettings).map(([key, value]) => (
                <div key={key}>
                  <div className="flex justify-between mb-1">
                    <label className="text-sm font-medium text-slate-600 capitalize">{key}</label>
                    <span className="text-sm text-slate-800">{value}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="50"
                    value={value}
                    onChange={(e) => setWeightSettings(prev => ({
                      ...prev,
                      [key]: parseInt(e.target.value)
                    }))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Matching Status */}
        {matchingStatus === 'running' && (
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
              <div>
                <div className="font-medium text-blue-800">Matching in Progress</div>
                <div className="text-sm text-blue-600">Processing students and internships...</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Recent Matching Runs */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200">
        <div className="px-6 py-4 border-b border-slate-200">
          <h3 className="text-lg font-semibold text-slate-800">Recent Matching Runs</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Timestamp</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Students</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Internships</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Matches</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Accuracy</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Duration</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {matchingRuns.map((run) => (
                <tr key={run.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 text-sm text-slate-600">{run.timestamp}</td>
                  <td className="px-6 py-4 text-sm text-slate-800">{run.studentsProcessed.toLocaleString()}</td>
                  <td className="px-6 py-4 text-sm text-slate-800">{run.internshipsProcessed}</td>
                  <td className="px-6 py-4 text-sm font-medium text-green-600">{run.successfulMatches}</td>
                  <td className="px-6 py-4 text-sm text-slate-800">{run.accuracy}%</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{run.duration}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                      {run.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Analytics Dashboard Component
const AnalyticsDashboard: React.FC = () => {
  const [timeRange, setTimeRange] = useState('7d');
  const [selectedMetric, setSelectedMetric] = useState('applications');

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Application Trends</h3>
          <div className="text-3xl font-bold text-blue-600 mb-2">+23.5%</div>
          <p className="text-sm text-slate-600">vs last week</p>
          <div className="mt-4 h-20 bg-slate-100 rounded flex items-end justify-center">
            <div className="text-xs text-slate-500">Chart Placeholder</div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Match Success Rate</h3>
          <div className="text-3xl font-bold text-green-600 mb-2">87.5%</div>
          <p className="text-sm text-slate-600">AI matching accuracy</p>
          <div className="mt-4 w-full bg-slate-200 rounded-full h-3">
            <div className="bg-green-500 h-3 rounded-full" style={{ width: '87.5%' }}></div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Geographic Distribution</h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-600">Maharashtra</span>
              <span className="text-sm font-medium">28%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-600">Karnataka</span>
              <span className="text-sm font-medium">22%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-600">Tamil Nadu</span>
              <span className="text-sm font-medium">15%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-600">Others</span>
              <span className="text-sm font-medium">35%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Analytics */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-slate-800">Performance Analytics</h3>
          <div className="flex gap-3">
            <select 
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 3 months</option>
              <option value="1y">Last year</option>
            </select>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              Export Report
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Sector Performance */}
          <div>
            <h4 className="font-medium text-slate-800 mb-4">Top Performing Sectors</h4>
            <div className="space-y-3">
              {[
                { sector: 'Information Technology', applications: 4520, percentage: 82 },
                { sector: 'Finance & Banking', applications: 2340, percentage: 67 },
                { sector: 'Healthcare', applications: 1890, percentage: 54 },
                { sector: 'Manufacturing', applications: 1450, percentage: 41 }
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-slate-700">{item.sector}</div>
                    <div className="text-sm text-slate-600">{item.applications} applications</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-slate-800">{item.percentage}%</div>
                    <div className="w-20 bg-slate-200 rounded-full h-2 mt-1">
                      <div 
                        className="bg-blue-500 h-2 rounded-full" 
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Affirmative Action Stats */}
          <div>
            <h4 className="font-medium text-slate-800 mb-4">Diversity & Inclusion</h4>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="text-2xl font-bold text-blue-600">32%</div>
                  <div className="text-sm text-blue-700">Rural Students</div>
                </div>
                <div className="bg-green-50 rounded-lg p-4">
                  <div className="text-2xl font-bold text-green-600">45%</div>
                  <div className="text-sm text-green-700">Female Participation</div>
                </div>
              </div>

              <div>
                <h5 className="text-sm font-medium text-slate-700 mb-2">Category Distribution</h5>
                <div className="space-y-2">
                  {[
                    { category: 'General', percentage: 40 },
                    { category: 'OBC', percentage: 27 },
                    { category: 'SC', percentage: 15 },
                    { category: 'ST', percentage: 8 },
                    { category: 'Others', percentage: 10 }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <span className="text-slate-600">{item.category}</span>
                      <span className="font-medium">{item.percentage}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// System Settings Component
const SystemSettings: React.FC = () => {
  const [settings, setSettings] = useState({
    autoMatching: true,
    emailNotifications: true,
    dataRetention: '2years',
    maxApplications: 10,
    matchingFrequency: 'daily',
    requireVerification: true
  });

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <div className="space-y-6">
      {/* System Status */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-6 shadow-sm border border-green-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600">System Status</p>
              <p className="text-lg font-bold text-green-900">Online</p>
            </div>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-blue-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">Database Size</p>
              <p className="text-lg font-bold text-blue-900">2.4 GB</p>
            </div>
            <div className="text-blue-500">💾</div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-purple-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-600">API Calls Today</p>
              <p className="text-lg font-bold text-purple-900">12,450</p>
            </div>
            <div className="text-purple-500">📡</div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-orange-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-orange-600">Last Backup</p>
              <p className="text-lg font-bold text-orange-900">2h ago</p>
            </div>
            <div className="text-orange-500">💿</div>
          </div>
        </div>
      </div>

      {/* Configuration Settings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* General Settings */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">General Settings</h3>

          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-slate-700">Auto Matching</div>
                <div className="text-sm text-slate-600">Automatically run matching algorithm</div>
              </div>
              <button
                onClick={() => handleSettingChange('autoMatching', !settings.autoMatching)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.autoMatching ? 'bg-blue-600' : 'bg-slate-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.autoMatching ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-slate-700">Email Notifications</div>
                <div className="text-sm text-slate-600">Send system notifications via email</div>
              </div>
              <button
                onClick={() => handleSettingChange('emailNotifications', !settings.emailNotifications)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.emailNotifications ? 'bg-blue-600' : 'bg-slate-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.emailNotifications ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-slate-700">Require Company Verification</div>
                <div className="text-sm text-slate-600">Companies must be verified to post internships</div>
              </div>
              <button
                onClick={() => handleSettingChange('requireVerification', !settings.requireVerification)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.requireVerification ? 'bg-blue-600' : 'bg-slate-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.requireVerification ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-2">Maximum Applications per Student</label>
              <input
                type="number"
                value={settings.maxApplications}
                onChange={(e) => handleSettingChange('maxApplications', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-2">Matching Frequency</label>
              <select
                value={settings.matchingFrequency}
                onChange={(e) => handleSettingChange('matchingFrequency', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="hourly">Hourly</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="manual">Manual Only</option>
              </select>
            </div>
          </div>
        </div>

        {/* Security & Maintenance */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Security & Maintenance</h3>

          <div className="space-y-6">
            <div>
              <label className="block font-medium text-slate-700 mb-2">Data Retention Policy</label>
              <select
                value={settings.dataRetention}
                onChange={(e) => handleSettingChange('dataRetention', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="1year">1 Year</option>
                <option value="2years">2 Years</option>
                <option value="3years">3 Years</option>
                <option value="5years">5 Years</option>
              </select>
            </div>

            <div className="space-y-3">
              <button className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                Create System Backup
              </button>
              <button className="w-full border border-slate-300 text-slate-700 py-3 px-4 rounded-lg hover:bg-slate-50 transition-colors">
                Download Logs
              </button>
              <button className="w-full border border-slate-300 text-slate-700 py-3 px-4 rounded-lg hover:bg-slate-50 transition-colors">
                System Health Check
              </button>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h4 className="font-medium text-red-800 mb-2">Danger Zone</h4>
              <p className="text-sm text-red-600 mb-3">These actions are irreversible. Please be careful.</p>
              <div className="space-y-2">
                <button className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors text-sm">
                  Clear All Cache
                </button>
                <button className="w-full border border-red-300 text-red-600 py-2 px-4 rounded-lg hover:bg-red-50 transition-colors text-sm">
                  Reset AI Model
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;