// Enterprise SDLC Dashboard - ENHANCED PROFESSIONAL VERSION
import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { enterpriseAgents } from '../config/agents';
import { useToolsStatus } from '../hooks/useToolsStatus';

interface MetricCard {
  title: string;
  value: string | number;
  change: string;
  trend: 'up' | 'down' | 'neutral';
  icon: string;
  color: string;
  bgGradient: string;
}

interface Sprint {
  id: string;
  name: string;
  status: 'active' | 'planning' | 'completed';
  progress: number;
  stories: number;
  velocity: number;
  startDate: string;
  endDate: string;
  team: string[];
}

interface Activity {
  id: string;
  agent: string;
  agentName: string;
  action: string;
  target: string;
  time: string;
  type: 'commit' | 'review' | 'deploy' | 'test' | 'story' | 'bug';
}

interface ChartData {
  day: string;
  velocity: number;
  completed: number;
  planned: number;
}

export default function EnterpriseDashboard() {
  const [metrics, setMetrics] = useState<MetricCard[]>([
    { 
      title: 'Active Sprints', 
      value: 2, 
      change: '+1 from last week', 
      trend: 'up', 
      icon: '🏃',
      color: 'blue',
      bgGradient: 'from-blue-500 to-cyan-500'
    },
    { 
      title: 'Team Velocity', 
      value: '23.5', 
      change: '+12% vs last sprint', 
      trend: 'up', 
      icon: '⚡',
      color: 'yellow',
      bgGradient: 'from-yellow-500 to-orange-500'
    },
    { 
      title: 'Story Points', 
      value: 47, 
      change: '18 completed today', 
      trend: 'neutral', 
      icon: '📊',
      color: 'purple',
      bgGradient: 'from-purple-500 to-pink-500'
    },
    { 
      title: 'Code Quality', 
      value: '94.2%', 
      change: '+2.3% this week', 
      trend: 'up', 
      icon: '✨',
      color: 'green',
      bgGradient: 'from-green-500 to-emerald-500'
    },
    { 
      title: 'Test Coverage', 
      value: '87%', 
      change: '+5% improved', 
      trend: 'up', 
      icon: '🧪',
      color: 'indigo',
      bgGradient: 'from-indigo-500 to-purple-500'
    },
    { 
      title: 'Deployments', 
      value: '12', 
      change: 'This week', 
      trend: 'neutral', 
      icon: '🚀',
      color: 'red',
      bgGradient: 'from-red-500 to-rose-500'
    },
  ]);

  const [sprints, setSprints] = useState<Sprint[]>([
    { 
      id: '1', 
      name: 'Sprint 24 - Mobile Payment Integration', 
      status: 'active', 
      progress: 65, 
      stories: 12, 
      velocity: 25,
      startDate: '2025-03-15',
      endDate: '2025-03-29',
      team: ['Messi', 'Ronaldo', 'Neymar', 'Benzema']
    },
    { 
      id: '2', 
      name: 'Sprint 25 - Dashboard Redesign & Analytics', 
      status: 'planning', 
      progress: 15, 
      stories: 8, 
      velocity: 0,
      startDate: '2025-03-30',
      endDate: '2025-04-13',
      team: ['Mbappé', 'Modric', 'Ramos']
    },
  ]);

  const [recentActivities, setRecentActivities] = useState<Activity[]>([
    { id: '1', agent: 'developer', agentName: 'Neymar', action: 'Committed', target: 'Payment Gateway API', time: '2 min ago', type: 'commit' },
    { id: '2', agent: 'qa_tester', agentName: 'Mbappé', action: 'Reviewed', target: 'User Authentication Tests', time: '5 min ago', type: 'review' },
    { id: '3', agent: 'devops_engineer', agentName: 'Benzema', action: 'Deployed', target: 'Production v2.3.1', time: '12 min ago', type: 'deploy' },
    { id: '4', agent: 'requirements_analyst', agentName: 'Messi', action: 'Created', target: 'US-2401: Mobile Checkout', time: '18 min ago', type: 'story' },
    { id: '5', agent: 'software_architect', agentName: 'Ronaldo', action: 'Designed', target: 'Microservices Architecture', time: '25 min ago', type: 'review' },
    { id: '6', agent: 'security_expert', agentName: 'Ramos', action: 'Fixed', target: 'Security Vulnerability CVE-2024-001', time: '32 min ago', type: 'bug' },
    { id: '7', agent: 'project_manager', agentName: 'Modric', action: 'Planned', target: 'Sprint 25 Kickoff', time: '45 min ago', type: 'story' },
    { id: '8', agent: 'qa_tester', agentName: 'Mbappé', action: 'Executed', target: '245 Automated Tests', time: '1 hour ago', type: 'test' },
  ]);

  const [velocityData] = useState<ChartData[]>([
    { day: 'Mon', velocity: 18, completed: 15, planned: 20 },
    { day: 'Tue', velocity: 22, completed: 20, planned: 22 },
    { day: 'Wed', velocity: 25, completed: 24, planned: 25 },
    { day: 'Thu', velocity: 20, completed: 18, planned: 20 },
    { day: 'Fri', velocity: 28, completed: 26, planned: 28 },
  ]);

  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected'>('connected');
  const [currentTime, setCurrentTime] = useState(new Date());

  // Real-time tools status integration
  const { tools, loading: toolsLoading, error: toolsError } = useToolsStatus(30000);

  useEffect(() => {
    const loadActivity = async () => {
      try {
        const response = await fetch('/api/health');
        const data = await response.json();
        setConnectionStatus(data.status === 'healthy' ? 'connected' : 'disconnected');
      } catch (error) {
        setConnectionStatus('disconnected');
      }
    };

    loadActivity();
    const healthInterval = setInterval(loadActivity, 30000);
    const timeInterval = setInterval(() => setCurrentTime(new Date()), 1000);
    
    return () => {
      clearInterval(healthInterval);
      clearInterval(timeInterval);
    };
  }, []);

  const getActivityIcon = (type: string) => {
    const icons = {
      commit: '📝',
      review: '👀',
      deploy: '🚀',
      test: '🧪',
      story: '📋',
      bug: '🐛'
    };
    return icons[type as keyof typeof icons] || '📌';
  };

  const getActivityColor = (type: string) => {
    const colors = {
      commit: 'bg-blue-100 text-blue-700 border-blue-200',
      review: 'bg-purple-100 text-purple-700 border-purple-200',
      deploy: 'bg-green-100 text-green-700 border-green-200',
      test: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      story: 'bg-indigo-100 text-indigo-700 border-indigo-200',
      bug: 'bg-red-100 text-red-700 border-red-200'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-700 border-gray-200';
  };

  return (
    <>
      <Head>
        <title>Enterprise SDLC Dashboard | FLUX</title>
        <meta name="description" content="Enterprise Multi-Agent SDLC Platform" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        {/* Professional Header */}
        <header className="bg-slate-900/95 backdrop-blur-xl border-b border-slate-700/50 sticky top-0 z-50 shadow-2xl">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="bg-gradient-to-r from-blue-600 to-cyan-500 p-3 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">FLUX Enterprise</h1>
                  <p className="text-sm text-slate-400">Multi-Agent SDLC Platform</p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                {/* Live Clock */}
                <div className="hidden md:flex items-center space-x-2 px-4 py-2 bg-slate-800/50 rounded-lg border border-slate-700/50">
                  <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-sm font-mono text-slate-300">
                    {currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </span>
                </div>

                {/* Connection Status */}
                <div className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-all ${
                  connectionStatus === 'connected' 
                    ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' 
                    : 'bg-red-500/20 text-red-400 border-red-500/30'
                }`}>
                  <div className={`w-2 h-2 rounded-full ${
                    connectionStatus === 'connected' ? 'bg-emerald-400 animate-pulse' : 'bg-red-400'
                  }`}></div>
                  <span className="text-sm font-medium">
                    {connectionStatus === 'connected' ? 'System Online' : 'Disconnected'}
                  </span>
                </div>

                {/* Navigation */}
                <nav className="flex space-x-2">
                  <Link href="/dashboard" className="px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-lg font-medium hover:from-blue-700 hover:to-cyan-600 transition-all shadow-lg">
                    Dashboard
                  </Link>
                  <Link href="/projects" className="px-4 py-2 bg-slate-700 text-slate-300 rounded-lg font-medium hover:bg-slate-600 transition-colors">
                    Projects
                  </Link>
                  <Link href="/workspace" className="px-4 py-2 bg-slate-700 text-slate-300 rounded-lg font-medium hover:bg-slate-600 transition-colors">
                    AI Workspace
                  </Link>
                </nav>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Enhanced Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {metrics.map((metric, index) => (
              <div
                key={index}
                className="relative bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 hover:border-blue-500/50 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl group overflow-hidden"
              >
                {/* Background Gradient Effect */}
                <div className={`absolute inset-0 bg-gradient-to-br ${metric.bgGradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
                
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-5xl">{metric.icon}</div>
                    <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                      metric.trend === 'up' 
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                        : metric.trend === 'down'
                        ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                        : 'bg-slate-500/20 text-slate-400 border border-slate-500/30'
                    }`}>
                      {metric.change}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-4xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                      {metric.value}
                    </h3>
                    <p className="text-sm text-slate-400 font-medium uppercase tracking-wide">
                      {metric.title}
                    </p>
                  </div>

                  {/* Trend Indicator */}
                  <div className="mt-4 flex items-center space-x-2">
                    {metric.trend === 'up' && (
                      <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                    )}
                    {metric.trend === 'down' && (
                      <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                      </svg>
                    )}
                    <span className="text-xs text-slate-500 font-medium">
                      {metric.trend === 'up' ? 'Trending up' : metric.trend === 'down' ? 'Declining' : 'Stable'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Main Dashboard Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Sprint Velocity Chart */}
            <div className="lg:col-span-2 bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 shadow-xl">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-white flex items-center">
                    <span className="mr-3">📈</span>
                    Sprint Velocity Trend
                  </h2>
                  <p className="text-sm text-slate-400 mt-1">Last 5 working days performance</p>
                </div>
                <button className="px-4 py-2 bg-slate-700/50 text-slate-300 rounded-lg text-sm font-medium hover:bg-slate-600/50 transition-colors border border-slate-600/50">
                  Export Data
                </button>
              </div>

              {/* Simple Bar Chart */}
              <div className="space-y-4">
                {velocityData.map((data, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-slate-300 w-12">{data.day}</span>
                      <div className="flex-1 mx-4">
                        <div className="flex items-center space-x-2 h-8 bg-slate-900/50 rounded-lg overflow-hidden border border-slate-700/30">
                          <div 
                            className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-end pr-2 transition-all duration-500"
                            style={{ width: `${(data.completed / data.planned) * 100}%` }}
                          >
                            <span className="text-xs font-bold text-white">{data.completed}</span>
                          </div>
                        </div>
                      </div>
                      <span className="text-xs text-slate-400 w-20 text-right">
                        {data.completed}/{data.planned} points
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Chart Legend */}
              <div className="mt-6 pt-4 border-t border-slate-700/50 flex items-center justify-between text-xs">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500"></div>
                    <span className="text-slate-400">Completed</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-slate-700"></div>
                    <span className="text-slate-400">Remaining</span>
                  </div>
                </div>
                <span className="text-slate-500">Avg: 23.5 points/day</span>
              </div>
            </div>

            {/* Team Activity Feed */}
            <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 shadow-xl">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white flex items-center">
                  <span className="mr-3">⚡</span>
                  Live Activity
                </h2>
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
              </div>

              <div className="space-y-3 max-h-96 overflow-y-auto scrollbar-thin scrollbar-track-slate-800 scrollbar-thumb-slate-600">
                {recentActivities.map((activity) => (
                  <div
                    key={activity.id}
                    className="group p-3 rounded-xl bg-slate-900/50 border border-slate-700/30 hover:border-blue-500/50 transition-all hover:bg-slate-900/80"
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-sm border ${getActivityColor(activity.type)}`}>
                        {getActivityIcon(activity.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-white font-medium truncate">
                          <span className="text-blue-400">{activity.agentName}</span> {activity.action.toLowerCase()}
                        </p>
                        <p className="text-xs text-slate-400 truncate mt-1">
                          {activity.target}
                        </p>
                        <p className="text-xs text-slate-500 mt-1">
                          {activity.time}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Active Sprints Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {sprints.map((sprint) => (
              <div
                key={sprint.id}
                className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 hover:border-blue-500/50 transition-all shadow-xl"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <h3 className="text-lg font-bold text-white">{sprint.name}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                      sprint.status === 'active'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : sprint.status === 'planning'
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        : 'bg-slate-500/20 text-slate-400 border border-slate-500/30'
                    }`}>
                      {sprint.status}
                    </span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-slate-400">Sprint Progress</span>
                    <span className="text-white font-bold">{sprint.progress}%</span>
                  </div>
                  <div className="w-full bg-slate-900/50 rounded-full h-3 border border-slate-700/30 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 via-cyan-500 to-emerald-500 rounded-full transition-all duration-500 shadow-lg"
                      style={{ width: `${sprint.progress}%` }}
                    ></div>
                  </div>
                </div>

                {/* Sprint Details */}
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="bg-slate-900/50 rounded-lg p-3 border border-slate-700/30">
                    <div className="text-2xl font-bold text-white">{sprint.stories}</div>
                    <div className="text-xs text-slate-400 uppercase tracking-wide">Stories</div>
                  </div>
                  <div className="bg-slate-900/50 rounded-lg p-3 border border-slate-700/30">
                    <div className="text-2xl font-bold text-white">{sprint.velocity || '-'}</div>
                    <div className="text-xs text-slate-400 uppercase tracking-wide">Velocity</div>
                  </div>
                  <div className="bg-slate-900/50 rounded-lg p-3 border border-slate-700/30">
                    <div className="text-2xl font-bold text-white">{sprint.team.length}</div>
                    <div className="text-xs text-slate-400 uppercase tracking-wide">Team</div>
                  </div>
                </div>

                {/* Team Members */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-700/30">
                  <div className="flex -space-x-2">
                    {sprint.team.slice(0, 4).map((member, idx) => (
                      <div
                        key={idx}
                        className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 border-2 border-slate-800 flex items-center justify-center text-xs font-bold text-white"
                        title={member}
                      >
                        {member[0]}
                      </div>
                    ))}
                    {sprint.team.length > 4 && (
                      <div className="w-8 h-8 rounded-full bg-slate-700 border-2 border-slate-800 flex items-center justify-center text-xs font-bold text-slate-300">
                        +{sprint.team.length - 4}
                      </div>
                    )}
                  </div>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-lg">
                    View Sprint
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* SDLC Tools & Integrations Panel */}
          <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 shadow-xl mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-white flex items-center">
                  <span className="mr-3">🔗</span>
                  SDLC Tools & Integrations
                </h2>
                <p className="text-sm text-slate-400 mt-1">End-to-end development workflow automation</p>
              </div>
              <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors shadow-lg">
                <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add Integration
              </button>
            </div>

            {/* SDLC Workflow Stages */}
            <div className="mb-6">
              <h3 className="text-sm font-bold text-slate-300 mb-3 uppercase tracking-wide">Complete SDLC Workflow</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
                {[
                  { stage: 'Epic', icon: '📋', color: 'from-purple-500 to-pink-500', status: 'active' },
                  { stage: 'Story', icon: '📝', color: 'from-blue-500 to-cyan-500', status: 'active' },
                  { stage: 'Design', icon: '🎨', color: 'from-indigo-500 to-purple-500', status: 'active' },
                  { stage: 'Code', icon: '💻', color: 'from-green-500 to-emerald-500', status: 'active' },
                  { stage: 'Test', icon: '🧪', color: 'from-yellow-500 to-orange-500', status: 'active' },
                  { stage: 'Deploy', icon: '🚀', color: 'from-red-500 to-rose-500', status: 'active' },
                  { stage: 'Monitor', icon: '📊', color: 'from-teal-500 to-cyan-500', status: 'active' }
                ].map((workflow, idx) => (
                  <div key={idx} className="relative">
                    <div className={`bg-gradient-to-br ${workflow.color} p-4 rounded-xl text-center shadow-lg hover:shadow-xl transition-all transform hover:scale-105 cursor-pointer`}>
                      <div className="text-3xl mb-2">{workflow.icon}</div>
                      <div className="text-white font-bold text-sm">{workflow.stage}</div>
                      <div className="text-white/80 text-xs mt-1">
                        {workflow.status === 'active' ? 'Active' : 'Setup'}
                      </div>
                    </div>
                    {idx < 6 && (
                      <div className="hidden lg:block absolute top-1/2 -right-1.5 transform -translate-y-1/2 z-10">
                        <svg className="w-3 h-3 text-slate-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Integrated Tools Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {toolsLoading ? (
                <div className="col-span-full text-center py-8 text-slate-400">
                  Loading tools status...
                </div>
              ) : toolsError ? (
                <div className="col-span-full text-center py-8 text-red-400">
                  {toolsError}
                </div>
              ) : (
                tools.map((tool) => {
                  const colorClasses = {
                    blue: { bg: 'bg-blue-600', border: 'border-blue-500/50', text: 'text-blue-400' },
                    slate: { bg: 'bg-slate-700', border: 'border-purple-500/50', text: 'text-purple-400' },
                    red: { bg: 'bg-red-600', border: 'border-red-500/50', text: 'text-red-400' },
                    cyan: { bg: 'bg-cyan-600', border: 'border-cyan-500/50', text: 'text-cyan-400' },
                    indigo: { bg: 'bg-indigo-600', border: 'border-indigo-500/50', text: 'text-indigo-400' },
                    emerald: { bg: 'bg-emerald-600', border: 'border-emerald-500/50', text: 'text-emerald-400' },
                    orange: { bg: 'bg-orange-600', border: 'border-orange-500/50', text: 'text-orange-400' },
                    purple: { bg: 'bg-purple-600', border: 'border-purple-500/50', text: 'text-purple-400' }
                  };

                  const colors = colorClasses[tool.color as keyof typeof colorClasses] || colorClasses.blue;

                  return (
                    <div key={tool.id} className={`bg-slate-900/50 border border-slate-700/30 rounded-xl p-5 hover:${colors.border} transition-all group`}>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className={`w-12 h-12 ${colors.bg} rounded-lg flex items-center justify-center shadow-lg`}>
                            <span className="text-2xl">{tool.icon}</span>
                          </div>
                          <div>
                            <h4 className={`font-bold text-white group-hover:${colors.text} transition-colors`}>{tool.name}</h4>
                            <p className="text-xs text-slate-400">{tool.type}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className={`w-2 h-2 ${
                            tool.status === 'connected' || tool.status === 'running' 
                              ? 'bg-emerald-500' 
                              : 'bg-red-500'
                          } rounded-full animate-pulse`}></div>
                          <span className={`text-xs font-bold ${
                            tool.status === 'connected' || tool.status === 'running'
                              ? 'text-emerald-400'
                              : 'text-red-400'
                          }`}>
                            {tool.status === 'connected' ? 'Connected' : tool.status === 'running' ? 'Running' : 'Offline'}
                          </span>
                        </div>
                      </div>
                      <div className="space-y-2 mb-4">
                        {Object.entries(tool.metrics).slice(0, 3).map(([key, value], idx) => (
                          <div key={idx} className="flex justify-between text-sm">
                            <span className="text-slate-400 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                            <span className={`font-bold ${
                              typeof value === 'string' && (value.includes('Passed') || value.includes('%')) 
                                ? 'text-emerald-400'
                                : typeof value === 'number' && key.toLowerCase().includes('bug')
                                  ? 'text-red-400'
                                  : 'text-white'
                            }`}>
                              {value}
                            </span>
                          </div>
                        ))}
                      </div>
                      <button className={`w-full px-3 py-2 ${colors.bg} text-white rounded-lg text-sm font-medium hover:opacity-90 transition-colors`}>
                        {tool.id === 'jira' ? (
                          <Link href="/projects">Manage Projects</Link>
                        ) : (
                          `View ${tool.name}`
                        )}
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Enterprise Team Panel */}
          <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white flex items-center">
                <span className="mr-3">⚽</span>
                Enterprise Team
              </h2>
              <Link href="/workspace">
                <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-lg font-medium hover:from-blue-700 hover:to-cyan-600 transition-all shadow-lg transform hover:scale-105">
                  Open AI Workspace →
                </button>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {enterpriseAgents.map((agent) => (
                <div
                  key={agent.id}
                  className="bg-slate-900/50 border border-slate-700/30 rounded-xl p-4 hover:border-blue-500/50 transition-all group hover:bg-slate-900/80"
                >
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="relative">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-lg flex items-center justify-center text-2xl shadow-lg">
                        {agent.avatar}
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-slate-900 animate-pulse"></div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-white group-hover:text-blue-400 transition-colors">
                        {agent.name}
                      </h3>
                      <p className="text-xs text-slate-400 truncate">{agent.role}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500">Status</span>
                      <span className="text-emerald-400 font-medium">Online</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {agent.expertise.slice(0, 2).map((skill, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-slate-800 text-slate-400 rounded text-xs border border-slate-700/50"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
