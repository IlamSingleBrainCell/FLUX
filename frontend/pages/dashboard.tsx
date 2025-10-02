// Enterprise SDLC Dashboard
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
}

interface Sprint {
  id: string;
  name: string;
  status: 'active' | 'planning' | 'completed';
  progress: number;
  stories: number;
  velocity: number;
}

export default function EnterpriseDashboard() {
  const [metrics, setMetrics] = useState<MetricCard[]>([
    { title: 'Active Sprints', value: 2, change: '+1 this week', trend: 'up', icon: '🏃' },
    { title: 'Team Velocity', value: '23.5', change: '+12% vs last sprint', trend: 'up', icon: '⚡' },
    { title: 'Story Points', value: 47, change: '18 completed', trend: 'neutral', icon: '📊' },
    { title: 'Code Quality', value: '94%', change: '+2% improvement', trend: 'up', icon: '✨' },
  ]);

  const [sprints, setSprints] = useState<Sprint[]>([
    { id: '1', name: 'Sprint 24 - Mobile Payment', status: 'active', progress: 65, stories: 12, velocity: 25 },
    { id: '2', name: 'Sprint 25 - Dashboard Redesign', status: 'planning', progress: 15, stories: 8, velocity: 0 },
  ]);

  const [agentActivity, setAgentActivity] = useState<any[]>([]);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected'>('connected');

  useEffect(() => {
    // Load real agent activity from API
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
    const interval = setInterval(loadActivity, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <Head>
        <title>Enterprise SDLC Dashboard | FLUX</title>
        <meta name="description" content="Enterprise Multi-Agent SDLC Platform" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        {/* Professional Header */}
        <header className="bg-slate-900/95 backdrop-blur-xl border-b border-slate-700/50 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="bg-gradient-to-r from-blue-600 to-cyan-500 p-3 rounded-xl shadow-lg">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">FLUX Enterprise</h1>
                  <p className="text-sm text-slate-400">Multi-Agent SDLC Platform</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
                  connectionStatus === 'connected' 
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                    : 'bg-red-500/20 text-red-400 border border-red-500/30'
                }`}>
                  <div className={`w-2 h-2 rounded-full ${
                    connectionStatus === 'connected' ? 'bg-emerald-400 animate-pulse' : 'bg-red-400'
                  }`}></div>
                  <span className="text-sm font-medium">
                    {connectionStatus === 'connected' ? 'System Online' : 'Disconnected'}
                  </span>
                </div>

                <nav className="flex space-x-2">
                  <Link href="/dashboard" className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
                    Dashboard
                  </Link>
                  <Link href="/" className="px-4 py-2 bg-slate-700 text-slate-300 rounded-lg font-medium hover:bg-slate-600 transition-colors">
                    Workspace
                  </Link>
                </nav>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {metrics.map((metric, index) => (
              <div
                key={index}
                className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-xl p-6 hover:border-blue-500/50 transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="text-4xl">{metric.icon}</div>
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                    metric.trend === 'up' 
                      ? 'bg-emerald-500/20 text-emerald-400' 
                      : metric.trend === 'down'
                      ? 'bg-red-500/20 text-red-400'
                      : 'bg-slate-500/20 text-slate-400'
                  }`}>
                    {metric.change}
                  </div>
                </div>
                <h3 className="text-3xl font-bold text-white mb-1">{metric.value}</h3>
                <p className="text-sm text-slate-400">{metric.title}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Active Sprints */}
            <div className="lg:col-span-2 bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white flex items-center">
                  <span className="mr-3">🏃</span>
                  Active Sprints
                </h2>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                  Create Sprint
                </button>
              </div>

              <div className="space-y-4">
                {sprints.map((sprint) => (
                  <div
                    key={sprint.id}
                    className="bg-slate-900/50 border border-slate-700/50 rounded-lg p-5 hover:border-blue-500/50 transition-all"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <h3 className="text-lg font-semibold text-white">{sprint.name}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          sprint.status === 'active'
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : sprint.status === 'planning'
                            ? 'bg-amber-500/20 text-amber-400'
                            : 'bg-slate-500/20 text-slate-400'
                        }`}>
                          {sprint.status.toUpperCase()}
                        </span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-slate-400">{sprint.stories} stories</div>
                        {sprint.velocity > 0 && (
                          <div className="text-sm font-medium text-blue-400">
                            Velocity: {sprint.velocity}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="mb-2">
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-slate-400">Progress</span>
                        <span className="text-white font-medium">{sprint.progress}%</span>
                      </div>
                      <div className="w-full bg-slate-700/50 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-blue-600 to-cyan-500 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${sprint.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Team Agents */}
            <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-xl p-6">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center">
                <span className="mr-3">⚽</span>
                Enterprise Team
              </h2>

              <div className="space-y-3">
                {enterpriseAgents.map((agent) => (
                  <div
                    key={agent.id}
                    className="bg-slate-900/50 border border-slate-700/50 rounded-lg p-4 hover:border-blue-500/50 transition-all group"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-lg flex items-center justify-center text-2xl">
                          {agent.avatar}
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-slate-900 animate-pulse"></div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-white group-hover:text-blue-400 transition-colors">
                          {agent.name}
                        </h3>
                        <p className="text-xs text-slate-400 truncate">{agent.role}</p>
                      </div>
                      <div className="text-xs text-emerald-400 font-medium">Online</div>
                    </div>
                  </div>
                ))}
              </div>

              <Link href="/">
                <button className="w-full mt-4 px-4 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-lg font-medium hover:from-blue-700 hover:to-cyan-600 transition-all shadow-lg">
                  Open Workspace
                </button>
              </Link>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-xl p-6 hover:border-blue-500/50 transition-all text-left group">
              <div className="flex items-center justify-between mb-3">
                <div className="text-3xl">📝</div>
                <svg className="w-5 h-5 text-slate-400 group-hover:text-blue-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white mb-1">Create User Story</h3>
              <p className="text-sm text-slate-400">Define requirements and acceptance criteria</p>
            </button>

            <button className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-xl p-6 hover:border-blue-500/50 transition-all text-left group">
              <div className="flex items-center justify-between mb-3">
                <div className="text-3xl">🔗</div>
                <svg className="w-5 h-5 text-slate-400 group-hover:text-blue-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white mb-1">GitHub Integration</h3>
              <p className="text-sm text-slate-400">Sync issues and pull requests</p>
            </button>

            <button className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-xl p-6 hover:border-blue-500/50 transition-all text-left group">
              <div className="flex items-center justify-between mb-3">
                <div className="text-3xl">🚀</div>
                <svg className="w-5 h-5 text-slate-400 group-hover:text-blue-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white mb-1">Deploy Pipeline</h3>
              <p className="text-sm text-slate-400">Trigger CI/CD deployment</p>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
