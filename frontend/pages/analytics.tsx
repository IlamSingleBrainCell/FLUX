// Analytics Page - Deep Dive into Team Performance & Metrics  
import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useCommandPalette } from '../components/CommandPalette/CommandPalette';
import { 
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  AreaChart, Area, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';

const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#06b6d4'];

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'quarter' | 'year'>('month');
  const [selectedChart, setSelectedChart] = useState<'velocity' | 'quality' | 'deployment' | 'coverage'>('velocity');

  const velocityTrend = [
    { week: 'Week 1', velocity: 18, forecast: 20 },
    { week: 'Week 2', velocity: 22, forecast: 21 },
    { week: 'Week 3', velocity: 25, forecast: 23 },
    { week: 'Week 4', velocity: 23, forecast: 24 },
  ];

  const qualityMetrics = [
    { category: 'Maintainability', score: 94, trend: '+2%' },
    { category: 'Reliability', score: 91, trend: '+5%' },
    { category: 'Security', score: 98, trend: '+1%' },
    { category: 'Performance', score: 88, trend: '+3%' },
  ];

  const deploymentFrequency = [
    { day: 'Mon', deploys: 3, success: 3 },
    { day: 'Tue', deploys: 4, success: 4 },
    { day: 'Wed', deploys: 2, success: 2 },
    { day: 'Thu', deploys: 5, success: 4 },
    { day: 'Fri', deploys: 3, success: 3 },
  ];

  const coverageTrend = [
    { month: 'Jan', unit: 85, integration: 78, e2e: 65 },
    { month: 'Feb', unit: 88, integration: 82, e2e: 70 },
    { month: 'Mar', unit: 92, integration: 85, e2e: 78 },
  ];

  return (
    <>
      <Head>
        <title>Analytics - FLUX Enterprise</title>
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        {/* Header */}
        <div className="bg-slate-900/95 backdrop-blur-xl border-b border-slate-700/50 sticky top-0 z-50">
          <div className="max-w-[1800px] mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Link href="/dashboard">
                  <div className="bg-gradient-to-r from-purple-600 to-pink-500 p-3 rounded-xl cursor-pointer hover:shadow-lg transition-all">
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                </Link>
                <div>
                  <h1 className="text-xl font-bold text-white">Analytics Dashboard</h1>
                  <p className="text-sm text-slate-400">Deep dive into performance metrics</p>
                </div>
              </div>

              <nav className="flex space-x-2">
                <Link href="/dashboard" className="px-4 py-2 bg-slate-700 text-slate-300 rounded-lg text-sm font-medium hover:bg-slate-600">
                  Dashboard
                </Link>
                <Link href="/projects" className="px-4 py-2 bg-slate-700 text-slate-300 rounded-lg text-sm font-medium hover:bg-slate-600">
                  Projects
                </Link>
                <Link href="/workspace" className="px-4 py-2 bg-slate-700 text-slate-300 rounded-lg text-sm font-medium hover:bg-slate-600">
                  Workspace
                </Link>
                <Link href="/analytics" className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-lg text-sm font-medium shadow-lg">
                  Analytics
                </Link>
              </nav>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-[1800px] mx-auto px-6 py-6 space-y-6">
          {/* Time Range Selector */}
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white">Performance Analytics</h2>
            <div className="flex items-center space-x-2 bg-slate-800 rounded-lg p-1">
              {(['week', 'month', 'quarter', 'year'] as const).map(range => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                    timeRange === range
                      ? 'bg-purple-600 text-white shadow-lg'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {range.charAt(0).toUpperCase() + range.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Key Metrics Summary */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { title: 'Avg Velocity', value: '22.5', change: '+8%', icon: '⚡', color: 'from-yellow-500 to-orange-500' },
              { title: 'Code Quality', value: '94.2%', change: '+2.3%', icon: '✨', color: 'from-green-500 to-emerald-500' },
              { title: 'Deploy Success', value: '98.5%', change: '+1.5%', icon: '🚀', color: 'from-blue-500 to-cyan-500' },
              { title: 'Test Coverage', value: '87%', change: '+5%', icon: '🧪', color: 'from-purple-500 to-pink-500' },
            ].map((metric, index) => (
              <div key={index} className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${metric.color} flex items-center justify-center mb-4`}>
                  <span className="text-2xl">{metric.icon}</span>
                </div>
                <h3 className="text-sm text-slate-400 mb-2">{metric.title}</h3>
                <div className="flex items-end justify-between">
                  <span className="text-3xl font-bold text-white">{metric.value}</span>
                  <span className="text-sm text-green-400">{metric.change}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Velocity Trend Chart */}
            <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50">
              <h3 className="text-lg font-bold text-white mb-6">Velocity Trend & Forecast</h3>
              <div className="space-y-4">
                {velocityTrend.map((data, index) => (
                  <div key={index}>
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-white font-medium">{data.week}</span>
                      <div className="flex items-center space-x-4">
                        <span className="text-cyan-400">Actual: {data.velocity}</span>
                        <span className="text-slate-500">Forecast: {data.forecast}</span>
                      </div>
                    </div>
                    <div className="h-3 bg-slate-700 rounded-full overflow-hidden relative">
                      <div
                        className="absolute top-0 left-0 h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"
                        style={{ width: `${(data.velocity / 30) * 100}%` }}
                      ></div>
                      <div
                        className="absolute top-0 left-0 h-full border-2 border-dashed border-slate-400 rounded-full"
                        style={{ width: `${(data.forecast / 30) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quality Metrics */}
            <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50">
              <h3 className="text-lg font-bold text-white mb-6">Code Quality Breakdown</h3>
              <div className="space-y-4">
                {qualityMetrics.map((metric, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-white font-medium">{metric.category}</span>
                      <div className="flex items-center space-x-3">
                        <span className="text-green-400 text-sm">{metric.trend}</span>
                        <span className="text-white font-bold">{metric.score}%</span>
                      </div>
                    </div>
                    <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          metric.score >= 95 ? 'bg-gradient-to-r from-green-500 to-emerald-500' :
                          metric.score >= 90 ? 'bg-gradient-to-r from-yellow-500 to-orange-500' :
                          'bg-gradient-to-r from-red-500 to-rose-500'
                        }`}
                        style={{ width: `${metric.score}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Deployment Frequency */}
            <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50">
              <h3 className="text-lg font-bold text-white mb-6">Deployment Frequency & Success</h3>
              <div className="space-y-4">
                {deploymentFrequency.map((data, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-white font-medium w-12">{data.day}</span>
                    <div className="flex-1 mx-4 flex items-center space-x-2">
                      <div className="flex-1 h-8 bg-slate-700 rounded-lg overflow-hidden relative">
                        <div
                          className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg"
                          style={{ width: `${(data.deploys / 5) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-white font-bold w-8">{data.deploys}</span>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-bold ${
                      data.success === data.deploys ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {data.success}/{data.deploys}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Test Coverage Trend */}
            <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50">
              <h3 className="text-lg font-bold text-white mb-6">Test Coverage Evolution</h3>
              <div className="space-y-6">
                {coverageTrend.map((data, index) => (
                  <div key={index}>
                    <h4 className="text-white font-semibold mb-3">{data.month}</h4>
                    <div className="space-y-2">
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-slate-400">Unit Tests</span>
                          <span className="text-purple-400">{data.unit}%</span>
                        </div>
                        <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                          <div className="h-full bg-purple-500 rounded-full" style={{ width: `${data.unit}%` }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-slate-400">Integration</span>
                          <span className="text-blue-400">{data.integration}%</span>
                        </div>
                        <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-500 rounded-full" style={{ width: `${data.integration}%` }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-slate-400">E2E Tests</span>
                          <span className="text-cyan-400">{data.e2e}%</span>
                        </div>
                        <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                          <div className="h-full bg-cyan-500 rounded-full" style={{ width: `${data.e2e}%` }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Export Section */}
          <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white mb-2">Export Analytics Report</h3>
                <p className="text-slate-400 text-sm">Download comprehensive analytics data for external analysis</p>
              </div>
              <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all">
                Download Report
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
