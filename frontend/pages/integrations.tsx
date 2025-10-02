// Integrations Hub - Visual Status of All Tool Integrations
import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';

interface Integration {
  id: string;
  name: string;
  icon: string;
  status: 'connected' | 'disconnected' | 'error';
  category: string;
  description: string;
  lastSync: string;
  health: number;
  activities: { action: string; time: string }[];
}

export default function IntegrationsPage() {
  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null);

  const integrations: Integration[] = [
    {
      id: 'jira',
      name: 'JIRA',
      icon: '📋',
      status: 'connected',
      category: 'Project Management',
      description: 'Epic, Story, and Task management with real-time sync',
      lastSync: '2 minutes ago',
      health: 98,
      activities: [
        { action: 'Synced 3 new stories', time: '2 min ago' },
        { action: 'Updated epic status', time: '15 min ago' },
      ]
    },
    {
      id: 'github',
      name: 'GitHub',
      icon: '🐙',
      status: 'connected',
      category: 'Version Control',
      description: 'Source code management and collaboration',
      lastSync: '1 minute ago',
      health: 100,
      activities: [
        { action: 'Pushed 5 commits', time: '1 min ago' },
        { action: 'Created pull request', time: '8 min ago' },
      ]
    },
    {
      id: 'jenkins',
      name: 'Jenkins',
      icon: '🔨',
      status: 'connected',
      category: 'CI/CD',
      description: 'Continuous integration and deployment pipelines',
      lastSync: '30 seconds ago',
      health: 95,
      activities: [
        { action: 'Build #234 successful', time: '30 sec ago' },
        { action: 'Deployed to staging', time: '12 min ago' },
      ]
    },
    {
      id: 'docker',
      name: 'Docker Hub',
      icon: '🐳',
      status: 'connected',
      category: 'Containers',
      description: 'Container registry and image management',
      lastSync: '5 minutes ago',
      health: 92,
      activities: [
        { action: 'Pushed new image v2.3.1', time: '5 min ago' },
        { action: 'Updated base image', time: '1 hour ago' },
      ]
    },
    {
      id: 'kubernetes',
      name: 'Kubernetes',
      icon: '☸️',
      status: 'connected',
      category: 'Orchestration',
      description: 'Container orchestration and cluster management',
      lastSync: '3 minutes ago',
      health: 97,
      activities: [
        { action: 'Scaled deployment to 5 pods', time: '3 min ago' },
        { action: 'Updated ingress rules', time: '25 min ago' },
      ]
    },
    {
      id: 'sonarqube',
      name: 'SonarQube',
      icon: '📊',
      status: 'connected',
      category: 'Code Quality',
      description: 'Code analysis and quality metrics',
      lastSync: '10 minutes ago',
      health: 94,
      activities: [
        { action: 'Completed code scan', time: '10 min ago' },
        { action: 'Found 2 new issues', time: '35 min ago' },
      ]
    },
    {
      id: 'grafana',
      name: 'Grafana',
      icon: '📈',
      status: 'connected',
      category: 'Monitoring',
      description: 'Metrics visualization and monitoring dashboards',
      lastSync: '1 minute ago',
      health: 99,
      activities: [
        { action: 'Updated metrics dashboard', time: '1 min ago' },
        { action: 'Created alert rule', time: '20 min ago' },
      ]
    },
    {
      id: 'slack',
      name: 'Slack',
      icon: '💬',
      status: 'connected',
      category: 'Communication',
      description: 'Team notifications and collaboration',
      lastSync: '10 seconds ago',
      health: 100,
      activities: [
        { action: 'Sent build notification', time: '10 sec ago' },
        { action: 'Posted deployment update', time: '12 min ago' },
      ]
    },
  ];

  const connectedCount = integrations.filter(i => i.status === 'connected').length;
  const avgHealth = Math.round(integrations.reduce((sum, i) => sum + i.health, 0) / integrations.length);

  return (
    <>
      <Head>
        <title>Integrations Hub - FLUX Enterprise</title>
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-cyan-900 to-slate-900">
        {/* Header */}
        <div className="bg-slate-900/95 backdrop-blur-xl border-b border-slate-700/50 sticky top-0 z-50">
          <div className="max-w-[1800px] mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Link href="/dashboard">
                  <div className="bg-gradient-to-r from-cyan-600 to-blue-500 p-3 rounded-xl cursor-pointer hover:shadow-lg transition-all">
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
                    </svg>
                  </div>
                </Link>
                <div>
                  <h1 className="text-xl font-bold text-white">Integration Hub</h1>
                  <p className="text-sm text-slate-400">Manage all your SDLC tool connections</p>
                </div>
              </div>

              <nav className="flex space-x-2">
                <Link href="/dashboard" className="px-4 py-2 bg-slate-700 text-slate-300 rounded-lg text-sm font-medium hover:bg-slate-600">
                  Dashboard
                </Link>
                <Link href="/projects" className="px-4 py-2 bg-slate-700 text-slate-300 rounded-lg text-sm font-medium hover:bg-slate-600">
                  Projects
                </Link>
                <Link href="/analytics" className="px-4 py-2 bg-slate-700 text-slate-300 rounded-lg text-sm font-medium hover:bg-slate-600">
                  Analytics
                </Link>
                <Link href="/integrations" className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-500 text-white rounded-lg text-sm font-medium shadow-lg">
                  Integrations
                </Link>
              </nav>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-[1800px] mx-auto px-6 py-6 space-y-6">
          {/* Overview Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                  <span className="text-2xl">✓</span>
                </div>
                <div>
                  <h3 className="text-sm text-slate-400">Connected</h3>
                  <p className="text-2xl font-bold text-white">{connectedCount}/{integrations.length}</p>
                </div>
              </div>
              <p className="text-sm text-slate-500">All systems operational</p>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                  <span className="text-2xl">❤️</span>
                </div>
                <div>
                  <h3 className="text-sm text-slate-400">Avg Health</h3>
                  <p className="text-2xl font-bold text-white">{avgHealth}%</p>
                </div>
              </div>
              <p className="text-sm text-slate-500">System health score</p>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                  <span className="text-2xl">⚡</span>
                </div>
                <div>
                  <h3 className="text-sm text-slate-400">Last Sync</h3>
                  <p className="text-2xl font-bold text-white">10s</p>
                </div>
              </div>
              <p className="text-sm text-slate-500">Slack integration</p>
            </div>
          </div>

          {/* Integrations Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {integrations.map(integration => (
              <div
                key={integration.id}
                onClick={() => setSelectedIntegration(integration)}
                className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50 hover:border-cyan-500/50 transition-all cursor-pointer hover:shadow-2xl hover:scale-105"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center text-3xl">
                    {integration.icon}
                  </div>
                  <div className={`px-2 py-1 rounded-lg text-xs font-bold ${
                    integration.status === 'connected' ? 'bg-green-500/20 text-green-400' :
                    integration.status === 'error' ? 'bg-red-500/20 text-red-400' :
                    'bg-slate-600/20 text-slate-400'
                  }`}>
                    {integration.status}
                  </div>
                </div>

                <h3 className="text-lg font-bold text-white mb-1">{integration.name}</h3>
                <p className="text-xs text-slate-400 mb-3">{integration.category}</p>
                <p className="text-sm text-slate-500 mb-4">{integration.description}</p>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Health</span>
                    <span className={`font-bold ${
                      integration.health >= 95 ? 'text-green-400' :
                      integration.health >= 90 ? 'text-yellow-400' :
                      'text-red-400'
                    }`}>
                      {integration.health}%
                    </span>
                  </div>
                  <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        integration.health >= 95 ? 'bg-green-500' :
                        integration.health >= 90 ? 'bg-yellow-500' :
                        'bg-red-500'
                      }`}
                      style={{ width: `${integration.health}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-slate-500 mt-2">Last sync: {integration.lastSync}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Add New Integration */}
          <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 rounded-2xl p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Add New Integration</h3>
            <p className="text-slate-400 mb-4">Connect more tools to enhance your SDLC workflow</p>
            <button className="px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all">
              Browse Integrations
            </button>
          </div>
        </div>

        {/* Integration Details Modal */}
        {selectedIntegration && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-6">
            <div className="bg-slate-800 rounded-2xl p-8 max-w-2xl w-full border border-slate-700 shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center text-4xl">
                    {selectedIntegration.icon}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">{selectedIntegration.name}</h3>
                    <p className="text-slate-400">{selectedIntegration.category}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedIntegration(null)}
                  className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
                >
                  <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <p className="text-slate-300 mb-6">{selectedIntegration.description}</p>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-slate-700/50 rounded-lg p-4">
                  <div className="text-sm text-slate-400 mb-1">Status</div>
                  <div className={`text-lg font-bold ${
                    selectedIntegration.status === 'connected' ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {selectedIntegration.status.toUpperCase()}
                  </div>
                </div>
                <div className="bg-slate-700/50 rounded-lg p-4">
                  <div className="text-sm text-slate-400 mb-1">Health</div>
                  <div className="text-lg font-bold text-white">{selectedIntegration.health}%</div>
                </div>
              </div>

              <div className="mb-6">
                <h4 className="text-sm font-semibold text-slate-400 mb-3">Recent Activity</h4>
                <div className="space-y-2">
                  {selectedIntegration.activities.map((activity, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                      <span className="text-white text-sm">{activity.action}</span>
                      <span className="text-slate-400 text-xs">{activity.time}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex space-x-3">
                <button className="flex-1 py-3 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg font-semibold transition-colors">
                  Configure
                </button>
                <button className="flex-1 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-semibold transition-colors">
                  Test Connection
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
