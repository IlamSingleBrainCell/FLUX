// Enterprise SDLC Dashboard - ULTRA ENHANCED VERSION
import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { enterpriseAgents } from '../config/agents';

interface MetricCard {
  title: string;
  value: string | number;
  change: string;
  trend: 'up' | 'down' | 'neutral';
  icon: string;
  color: string;
  bgGradient: string;
  details?: { label: string; value: string }[];
}

interface Activity {
  id: string;
  agent: string;
  agentName: string;
  action: string;
  target: string;
  time: string;
  type: 'commit' | 'review' | 'deploy' | 'test' | 'story' | 'bug';
  details?: string;
}

interface ChartData {
  day: string;
  velocity: number;
  completed: number;
  planned: number;
}

interface Notification {
  id: string;
  type: 'success' | 'warning' | 'error' | 'info';
  title: string;
  message: string;
  time: string;
  read: boolean;
}

export default function EnterpriseDashboard() {
  const [dateRange, setDateRange] = useState<'today' | 'week' | 'month' | 'quarter'>('week');
  const [selectedMetric, setSelectedMetric] = useState<MetricCard | null>(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  const [notifications, setNotifications] = useState<Notification[]>([
    { id: '1', type: 'error', title: 'Build Failed', message: 'Production build failed on staging', time: '2 min ago', read: false },
    { id: '2', type: 'success', title: 'Deployment Success', message: 'v2.3.1 deployed to production', time: '12 min ago', read: false },
    { id: '3', type: 'warning', title: 'Security Alert', message: 'CVE-2024-001 detected in dependencies', time: '32 min ago', read: true },
    { id: '4', type: 'info', title: 'Code Review', message: '3 PRs waiting for review', time: '1 hour ago', read: true },
  ]);

  const [metrics, setMetrics] = useState<MetricCard[]>([
    { 
      title: 'Active Sprints', 
      value: 2, 
      change: '+1 from last week', 
      trend: 'up', 
      icon: '🏃',
      color: 'blue',
      bgGradient: 'from-blue-500 to-cyan-500',
      details: [
        { label: 'In Progress', value: '1 sprint' },
        { label: 'Planning', value: '1 sprint' },
        { label: 'Avg Stories', value: '10 stories' },
        { label: 'Team Size', value: '7 members' }
      ]
    },
    { 
      title: 'Team Velocity', 
      value: '23.5', 
      change: '+12% vs last sprint', 
      trend: 'up', 
      icon: '⚡',
      color: 'yellow',
      bgGradient: 'from-yellow-500 to-orange-500',
      details: [
        { label: 'Current Sprint', value: '23.5 points/day' },
        { label: 'Last Sprint', value: '21.0 points/day' },
        { label: 'Best Sprint', value: '28.3 points/day' },
        { label: 'Improvement', value: '+12%' }
      ]
    },
    { 
      title: 'Story Points', 
      value: 47, 
      change: '18 completed today', 
      trend: 'neutral', 
      icon: '📊',
      color: 'purple',
      bgGradient: 'from-purple-500 to-pink-500',
      details: [
        { label: 'Completed', value: '47 points' },
        { label: 'In Progress', value: '28 points' },
        { label: 'Remaining', value: '15 points' },
        { label: 'Total Sprint', value: '90 points' }
      ]
    },
    { 
      title: 'Code Quality', 
      value: '94.2%', 
      change: '+2.3% this week', 
      trend: 'up', 
      icon: '✨',
      color: 'green',
      bgGradient: 'from-green-500 to-emerald-500',
      details: [
        { label: 'Maintainability', value: 'A+' },
        { label: 'Complexity', value: 'Low' },
        { label: 'Duplication', value: '2.1%' },
        { label: 'Tech Debt', value: '3.2 days' }
      ]
    },
    { 
      title: 'Test Coverage', 
      value: '87%', 
      change: '+5% improved', 
      trend: 'up', 
      icon: '🧪',
      color: 'indigo',
      bgGradient: 'from-indigo-500 to-purple-500',
      details: [
        { label: 'Unit Tests', value: '92%' },
        { label: 'Integration', value: '85%' },
        { label: 'E2E Tests', value: '78%' },
        { label: 'Total Suites', value: '1,247 tests' }
      ]
    },
    { 
      title: 'Deployments', 
      value: '12', 
      change: 'This week', 
      trend: 'neutral', 
      icon: '🚀',
      color: 'red',
      bgGradient: 'from-red-500 to-rose-500',
      details: [
        { label: 'Production', value: '4 deploys' },
        { label: 'Staging', value: '8 deploys' },
        { label: 'Success Rate', value: '100%' },
        { label: 'Avg Duration', value: '4.2 min' }
      ]
    },
  ]);

  const [recentActivities, setRecentActivities] = useState<Activity[]>([
    { id: '1', agent: 'developer', agentName: 'Neymar', action: 'Committed', target: 'Payment Gateway API', time: '2 min ago', type: 'commit', details: 'Added OAuth2 integration with 245 lines' },
    { id: '2', agent: 'qa_tester', agentName: 'Mbappé', action: 'Reviewed', target: 'User Authentication Tests', time: '5 min ago', type: 'review', details: 'Approved with 2 suggestions' },
    { id: '3', agent: 'devops_engineer', agentName: 'Benzema', action: 'Deployed', target: 'Production v2.3.1', time: '12 min ago', type: 'deploy', details: 'Zero-downtime deployment successful' },
    { id: '4', agent: 'requirements_analyst', agentName: 'Messi', action: 'Created', target: 'US-2401: Mobile Checkout', time: '18 min ago', type: 'story', details: '8 story points, High priority' },
    { id: '5', agent: 'software_architect', agentName: 'Ronaldo', action: 'Designed', target: 'Microservices Architecture', time: '25 min ago', type: 'review', details: 'API Gateway + 6 services' },
    { id: '6', agent: 'security_expert', agentName: 'Ramos', action: 'Fixed', target: 'Security Vulnerability CVE-2024-001', time: '32 min ago', type: 'bug', details: 'Critical severity resolved' },
  ]);

  const [velocityData] = useState<ChartData[]>([
    { day: 'Mon', velocity: 18, completed: 15, planned: 20 },
    { day: 'Tue', velocity: 22, completed: 20, planned: 22 },
    { day: 'Wed', velocity: 25, completed: 24, planned: 25 },
    { day: 'Thu', velocity: 20, completed: 18, planned: 20 },
    { day: 'Fri', velocity: 28, completed: 26, planned: 28 },
  ]);

  const [teamPerformance] = useState([
    { agent: 'Neymar', role: 'Developer', tasks: 24, velocity: 28.5, quality: 96, commits: 45 },
    { agent: 'Messi', role: 'Requirements Analyst', tasks: 18, velocity: 22.0, quality: 94, commits: 12 },
    { agent: 'Ronaldo', role: 'Software Architect', tasks: 15, velocity: 25.3, quality: 98, commits: 8 },
    { agent: 'Mbappé', role: 'QA Tester', tasks: 32, velocity: 18.7, quality: 92, commits: 28 },
    { agent: 'Benzema', role: 'DevOps Engineer', tasks: 20, velocity: 21.5, quality: 95, commits: 35 },
  ]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const exportReport = (format: 'pdf' | 'excel' | 'csv') => {
    alert(`Exporting report as ${format.toUpperCase()}... (Demo)`);
    setShowExportModal(false);
  };

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  return (
    <>
      <Head>
        <title>Enterprise Dashboard - FLUX</title>
        <meta name="description" content="Comprehensive SDLC metrics and analytics" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        {/* Enhanced Header with Notifications */}
        <div className="bg-slate-900/95 backdrop-blur-xl border-b border-slate-700/50 sticky top-0 z-50 shadow-2xl">
          <div className="max-w-[1800px] mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="bg-gradient-to-r from-blue-600 to-cyan-500 p-3 rounded-xl shadow-lg">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white">FLUX Enterprise</h1>
                  <p className="text-sm text-slate-400">Multi-Agent SDLC Platform</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                {/* Time Display */}
                <div className="flex items-center space-x-2 text-slate-300">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-sm font-mono">
                    {currentTime.toLocaleTimeString('en-US', { hour12: true })}
                  </span>
                </div>

                {/* System Status */}
                <div className="flex items-center space-x-2 px-3 py-1.5 bg-emerald-500/20 rounded-lg border border-emerald-500/30">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                  <span className="text-xs font-semibold text-emerald-400">System Online</span>
                </div>

                {/* Notifications Bell */}
                <div className="relative">
                  <button
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="relative p-2 hover:bg-slate-800 rounded-lg transition-colors"
                  >
                    <svg className="w-6 h-6 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                        {unreadCount}
                      </span>
                    )}
                  </button>

                  {/* Notifications Dropdown */}
                  {showNotifications && (
                    <div className="absolute right-0 mt-2 w-96 bg-slate-800 rounded-xl shadow-2xl border border-slate-700 overflow-hidden">
                      <div className="p-4 border-b border-slate-700 flex items-center justify-between">
                        <h3 className="font-bold text-white">Notifications</h3>
                        <button
                          onClick={markAllRead}
                          className="text-xs text-blue-400 hover:text-blue-300"
                        >
                          Mark all read
                        </button>
                      </div>
                      <div className="max-h-96 overflow-y-auto">
                        {notifications.map(notif => (
                          <div
                            key={notif.id}
                            className={`p-4 border-b border-slate-700 hover:bg-slate-750 transition-colors ${
                              !notif.read ? 'bg-blue-500/5' : ''
                            }`}
                          >
                            <div className="flex items-start space-x-3">
                              <div className={`w-2 h-2 rounded-full mt-2 ${
                                notif.type === 'error' ? 'bg-red-500' :
                                notif.type === 'warning' ? 'bg-yellow-500' :
                                notif.type === 'success' ? 'bg-green-500' :
                                'bg-blue-500'
                              }`}></div>
                              <div className="flex-1">
                                <div className="flex items-center justify-between">
                                  <span className="font-semibold text-white text-sm">{notif.title}</span>
                                  {!notif.read && (
                                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                                  )}
                                </div>
                                <p className="text-xs text-slate-400 mt-1">{notif.message}</p>
                                <span className="text-xs text-slate-500 mt-1 block">{notif.time}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Navigation */}
                <nav className="flex space-x-2">
                  <Link href="/dashboard" className="px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-lg text-sm font-medium shadow-lg">
                    Dashboard
                  </Link>
                  <Link href="/projects" className="px-4 py-2 bg-slate-700 text-slate-300 rounded-lg text-sm font-medium hover:bg-slate-600 transition-colors">
                    Projects
                  </Link>
                  <Link href="/workspace" className="px-4 py-2 bg-slate-700 text-slate-300 rounded-lg text-sm font-medium hover:bg-slate-600 transition-colors">
                    AI Workspace
                  </Link>
                  <Link href="/analytics" className="px-4 py-2 bg-slate-700 text-slate-300 rounded-lg text-sm font-medium hover:bg-slate-600 transition-colors">
                    Analytics
                  </Link>
                  <Link href="/integrations" className="px-4 py-2 bg-slate-700 text-slate-300 rounded-lg text-sm font-medium hover:bg-slate-600 transition-colors">
                    Integrations
                  </Link>
                  <Link href="/settings" className="px-4 py-2 bg-slate-700 text-slate-300 rounded-lg text-sm font-medium hover:bg-slate-600 transition-colors">
                    Settings
                  </Link>
                </nav>
              </div>
            </div>
          </div>
        </div>

        {/* Main Dashboard Content */}
        <div className="max-w-[1800px] mx-auto px-6 py-6 space-y-6">
          {/* Date Range Filter & Export */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <h2 className="text-2xl font-bold text-white">Dashboard Overview</h2>
              <div className="flex items-center space-x-2 bg-slate-800 rounded-lg p-1">
                {(['today', 'week', 'month', 'quarter'] as const).map(range => (
                  <button
                    key={range}
                    onClick={() => setDateRange(range)}
                    className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                      dateRange === range
                        ? 'bg-blue-600 text-white shadow-lg'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {range.charAt(0).toUpperCase() + range.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => setShowExportModal(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>Export Report</span>
            </button>
          </div>

          {/* Metrics Grid with Drill-down */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {metrics.map((metric, index) => (
              <div
                key={index}
                onClick={() => setSelectedMetric(metric)}
                className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50 hover:border-slate-600 transition-all cursor-pointer hover:shadow-2xl hover:scale-105"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${metric.bgGradient} shadow-lg`}>
                    <span className="text-3xl">{metric.icon}</span>
                  </div>
                  <div className={`flex items-center space-x-1 px-2 py-1 rounded-lg ${
                    metric.trend === 'up' ? 'bg-emerald-500/20 text-emerald-400' :
                    metric.trend === 'down' ? 'bg-red-500/20 text-red-400' :
                    'bg-slate-600/20 text-slate-400'
                  }`}>
                    {metric.trend === 'up' ? '📈' : metric.trend === 'down' ? '📉' : '➖'}
                    <span className="text-xs font-semibold">Trending {metric.trend}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">{metric.title}</h3>
                  <p className="text-4xl font-bold text-white">{metric.value}</p>
                  <p className="text-sm text-slate-500">{metric.change}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Sprint Velocity Chart */}
            <div className="lg:col-span-2 bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white flex items-center">
                  <span className="mr-2">📊</span>
                  Sprint Velocity Trend
                </h2>
                <span className="text-sm text-slate-400">Last 5 working days performance</span>
              </div>
              <div className="space-y-4">
                {velocityData.map((data, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-semibold text-white w-12">{data.day}</span>
                      <div className="flex-1 mx-4 bg-slate-700 rounded-full h-8 overflow-hidden relative">
                        <div
                          className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full transition-all duration-500 flex items-center justify-end pr-3"
                          style={{ width: `${(data.velocity / 30) * 100}%` }}
                        >
                          <span className="text-xs font-bold text-white">{data.velocity}</span>
                        </div>
                      </div>
                      <span className="text-slate-400 w-24 text-right">{data.completed}/{data.planned} points</span>
                    </div>
                  </div>
                ))}
              </div>
              <button className="mt-6 w-full py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm font-semibold transition-colors">
                Export Data
              </button>
            </div>

            {/* Live Activity Feed */}
            <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white flex items-center">
                  <span className="mr-2">⚡</span>
                  Live Activity
                </h2>
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              </div>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {recentActivities.map(activity => (
                  <div
                    key={activity.id}
                    className="flex items-start space-x-3 p-3 rounded-lg hover:bg-slate-700/50 transition-all cursor-pointer"
                  >
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center flex-shrink-0 shadow-lg">
                      <span className="text-lg">
                        {enterpriseAgents.find(a => a.id === activity.agent)?.avatar || '🤖'}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white">
                        <span className="font-semibold text-blue-400">{activity.agentName}</span>
                        {' '}{activity.action.toLowerCase()}{' '}
                        <span className="font-medium">{activity.target}</span>
                      </p>
                      {activity.details && (
                        <p className="text-xs text-slate-400 mt-1">{activity.details}</p>
                      )}
                      <span className="text-xs text-slate-500 mt-1 block">{activity.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Team Performance Section */}
          <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center">
              <span className="mr-2">👥</span>
              Team Performance
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-400">Agent</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-400">Role</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-slate-400">Tasks</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-slate-400">Velocity</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-slate-400">Quality</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-slate-400">Commits</th>
                  </tr>
                </thead>
                <tbody>
                  {teamPerformance.map((member, index) => (
                    <tr key={index} className="border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center">
                            <span>{enterpriseAgents.find(a => a.name === member.agent)?.avatar}</span>
                          </div>
                          <span className="font-semibold text-white">{member.agent}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm text-slate-400">{member.role}</td>
                      <td className="py-3 px-4 text-right font-semibold text-white">{member.tasks}</td>
                      <td className="py-3 px-4 text-right font-semibold text-cyan-400">{member.velocity}</td>
                      <td className="py-3 px-4 text-right">
                        <span className={`px-2 py-1 rounded text-xs font-bold ${
                          member.quality >= 95 ? 'bg-green-500/20 text-green-400' :
                          member.quality >= 90 ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-red-500/20 text-red-400'
                        }`}>
                          {member.quality}%
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right font-semibold text-purple-400">{member.commits}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Metric Drill-down Modal */}
        {selectedMetric && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-6">
            <div className="bg-slate-800 rounded-2xl p-8 max-w-2xl w-full border border-slate-700 shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div className={`p-4 rounded-xl bg-gradient-to-br ${selectedMetric.bgGradient}`}>
                    <span className="text-4xl">{selectedMetric.icon}</span>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">{selectedMetric.title}</h3>
                    <p className="text-slate-400">{selectedMetric.change}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedMetric(null)}
                  className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
                >
                  <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="text-6xl font-bold text-white mb-8">{selectedMetric.value}</div>

              <div className="grid grid-cols-2 gap-4">
                {selectedMetric.details?.map((detail, index) => (
                  <div key={index} className="bg-slate-700/50 rounded-lg p-4">
                    <div className="text-sm text-slate-400 mb-1">{detail.label}</div>
                    <div className="text-xl font-bold text-white">{detail.value}</div>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setSelectedMetric(null)}
                className="mt-6 w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
              >
                Close Details
              </button>
            </div>
          </div>
        )}

        {/* Export Modal */}
        {showExportModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-6">
            <div className="bg-slate-800 rounded-2xl p-8 max-w-md w-full border border-slate-700 shadow-2xl">
              <h3 className="text-2xl font-bold text-white mb-6">Export Dashboard Report</h3>
              <div className="space-y-3">
                <button
                  onClick={() => exportReport('pdf')}
                  className="w-full px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2"
                >
                  <span>📄</span>
                  <span>Export as PDF</span>
                </button>
                <button
                  onClick={() => exportReport('excel')}
                  className="w-full px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2"
                >
                  <span>📊</span>
                  <span>Export as Excel</span>
                </button>
                <button
                  onClick={() => exportReport('csv')}
                  className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2"
                >
                  <span>📋</span>
                  <span>Export as CSV</span>
                </button>
                <button
                  onClick={() => setShowExportModal(false)}
                  className="w-full px-4 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-semibold transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
