// Settings Page - Configure Integrations, Notifications, Team & Preferences
import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<'integrations' | 'notifications' | 'team' | 'api' | 'preferences'>('integrations');
  const [darkMode, setDarkMode] = useState(true);
  const [notifications, setNotifications] = useState({
    email: true,
    slack: true,
    deployments: true,
    buildFailures: true,
    codeReviews: false,
    securityAlerts: true,
  });

  const tabs = [
    { id: 'integrations', label: 'Integrations', icon: '🔌' },
    { id: 'notifications', label: 'Notifications', icon: '🔔' },
    { id: 'team', label: 'Team', icon: '👥' },
    { id: 'api', label: 'API Keys', icon: '🔑' },
    { id: 'preferences', label: 'Preferences', icon: '⚙️' },
  ];

  const integrationConfigs = [
    { name: 'JIRA', configured: true, apiKey: 'jira_***********3f2a' },
    { name: 'GitHub', configured: true, apiKey: 'ghp_***********8j3k' },
    { name: 'Jenkins', configured: true, apiKey: 'jenkins_***********9l2m' },
    { name: 'Docker Hub', configured: false, apiKey: '' },
  ];

  const teamMembers = [
    { name: 'Messi', role: 'Requirements Analyst', email: 'messi@flux.ai', status: 'Active' },
    { name: 'Ronaldo', role: 'Software Architect', email: 'ronaldo@flux.ai', status: 'Active' },
    { name: 'Neymar', role: 'Developer', email: 'neymar@flux.ai', status: 'Active' },
    { name: 'Mbappé', role: 'QA Tester', email: 'mbappe@flux.ai', status: 'Active' },
  ];

  return (
    <>
      <Head>
        <title>Settings - FLUX Enterprise</title>
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900">
        {/* Header */}
        <div className="bg-slate-900/95 backdrop-blur-xl border-b border-slate-700/50 sticky top-0 z-50">
          <div className="max-w-[1800px] mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Link href="/dashboard">
                  <div className="bg-gradient-to-r from-indigo-600 to-purple-500 p-3 rounded-xl cursor-pointer hover:shadow-lg transition-all">
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                </Link>
                <div>
                  <h1 className="text-xl font-bold text-white">Settings</h1>
                  <p className="text-sm text-slate-400">Configure your FLUX Enterprise platform</p>
                </div>
              </div>

              <nav className="flex space-x-2">
                <Link href="/dashboard" className="px-4 py-2 bg-slate-700 text-slate-300 rounded-lg text-sm font-medium hover:bg-slate-600">
                  Dashboard
                </Link>
                <Link href="/settings" className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-500 text-white rounded-lg text-sm font-medium shadow-lg">
                  Settings
                </Link>
              </nav>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-[1800px] mx-auto px-6 py-6">
          <div className="grid grid-cols-12 gap-6">
            {/* Sidebar Tabs */}
            <div className="col-span-3">
              <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-4 border border-slate-700/50 sticky top-24">
                <div className="space-y-2">
                  {tabs.map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                        activeTab === tab.id
                          ? 'bg-indigo-600 text-white shadow-lg'
                          : 'text-slate-400 hover:bg-slate-700/50 hover:text-white'
                      }`}
                    >
                      <span className="text-xl">{tab.icon}</span>
                      <span className="font-medium">{tab.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Content Area */}
            <div className="col-span-9 space-y-6">
              {/* Integrations Tab */}
              {activeTab === 'integrations' && (
                <div className="space-y-6">
                  <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50">
                    <h2 className="text-xl font-bold text-white mb-6">Integration Configuration</h2>
                    <div className="space-y-4">
                      {integrationConfigs.map((config, index) => (
                        <div key={index} className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg">
                          <div className="flex-1">
                            <h3 className="text-white font-semibold">{config.name}</h3>
                            {config.configured && (
                              <p className="text-sm text-slate-400 mt-1">API Key: {config.apiKey}</p>
                            )}
                          </div>
                          <div className="flex items-center space-x-3">
                            <span className={`px-3 py-1 rounded-lg text-xs font-bold ${
                              config.configured
                                ? 'bg-green-500/20 text-green-400'
                                : 'bg-red-500/20 text-red-400'
                            }`}>
                              {config.configured ? 'Connected' : 'Not Configured'}
                            </span>
                            <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold transition-colors">
                              {config.configured ? 'Edit' : 'Configure'}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/30 rounded-2xl p-6">
                    <h3 className="text-lg font-bold text-white mb-2">Webhook Configuration</h3>
                    <p className="text-slate-400 text-sm mb-4">Configure webhooks for real-time event notifications</p>
                    <button className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold transition-colors">
                      Manage Webhooks
                    </button>
                  </div>
                </div>
              )}

              {/* Notifications Tab */}
              {activeTab === 'notifications' && (
                <div className="space-y-6">
                  <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50">
                    <h2 className="text-xl font-bold text-white mb-6">Notification Preferences</h2>
                    <div className="space-y-4">
                      {Object.entries(notifications).map(([key, value]) => (
                        <div key={key} className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg">
                          <div>
                            <h3 className="text-white font-semibold capitalize">{key.replace(/([A-Z])/g, ' $1')}</h3>
                            <p className="text-sm text-slate-400">Receive notifications for {key}</p>
                          </div>
                          <button
                            onClick={() => setNotifications(prev => ({ ...prev, [key]: !value }))}
                            className={`relative w-14 h-8 rounded-full transition-colors ${
                              value ? 'bg-green-500' : 'bg-slate-600'
                            }`}
                          >
                            <div className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${
                              value ? 'translate-x-6' : ''
                            }`}></div>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Team Tab */}
              {activeTab === 'team' && (
                <div className="space-y-6">
                  <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-xl font-bold text-white">Team Members</h2>
                      <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold transition-colors">
                        + Add Member
                      </button>
                    </div>
                    <div className="space-y-3">
                      {teamMembers.map((member, index) => (
                        <div key={index} className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center text-white font-bold">
                              {member.name[0]}
                            </div>
                            <div>
                              <h3 className="text-white font-semibold">{member.name}</h3>
                              <p className="text-sm text-slate-400">{member.role}</p>
                              <p className="text-xs text-slate-500">{member.email}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3">
                            <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-lg text-xs font-bold">
                              {member.status}
                            </span>
                            <button className="px-3 py-1 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm transition-colors">
                              Edit
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* API Keys Tab */}
              {activeTab === 'api' && (
                <div className="space-y-6">
                  <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-xl font-bold text-white">API Keys</h2>
                      <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold transition-colors">
                        Generate New Key
                      </button>
                    </div>
                    <div className="space-y-4">
                      {[
                        { name: 'Production API', key: 'flux_prod_***********a3b2', created: '2025-01-15' },
                        { name: 'Staging API', key: 'flux_stag_***********c4d5', created: '2025-02-20' },
                      ].map((apiKey, index) => (
                        <div key={index} className="p-4 bg-slate-700/30 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="text-white font-semibold">{apiKey.name}</h3>
                            <button className="text-red-400 hover:text-red-300 text-sm">Revoke</button>
                          </div>
                          <p className="text-sm text-slate-400 font-mono">{apiKey.key}</p>
                          <p className="text-xs text-slate-500 mt-2">Created: {apiKey.created}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-2xl p-6">
                    <h3 className="text-lg font-bold text-yellow-400 mb-2">⚠️ Security Warning</h3>
                    <p className="text-slate-300 text-sm">Never share your API keys publicly. Rotate keys regularly and revoke unused keys immediately.</p>
                  </div>
                </div>
              )}

              {/* Preferences Tab */}
              {activeTab === 'preferences' && (
                <div className="space-y-6">
                  <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50">
                    <h2 className="text-xl font-bold text-white mb-6">General Preferences</h2>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg">
                        <div>
                          <h3 className="text-white font-semibold">Dark Mode</h3>
                          <p className="text-sm text-slate-400">Use dark theme across the platform</p>
                        </div>
                        <button
                          onClick={() => setDarkMode(!darkMode)}
                          className={`relative w-14 h-8 rounded-full transition-colors ${
                            darkMode ? 'bg-indigo-600' : 'bg-slate-600'
                          }`}
                        >
                          <div className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${
                            darkMode ? 'translate-x-6' : ''
                          }`}></div>
                        </button>
                      </div>

                      <div className="p-4 bg-slate-700/30 rounded-lg">
                        <h3 className="text-white font-semibold mb-3">Default Dashboard View</h3>
                        <select className="w-full px-4 py-2 bg-slate-800 text-white rounded-lg border border-slate-600">
                          <option>Overview</option>
                          <option>Team Performance</option>
                          <option>Velocity Chart</option>
                          <option>Activity Feed</option>
                        </select>
                      </div>

                      <div className="p-4 bg-slate-700/30 rounded-lg">
                        <h3 className="text-white font-semibold mb-3">Time Zone</h3>
                        <select className="w-full px-4 py-2 bg-slate-800 text-white rounded-lg border border-slate-600">
                          <option>UTC</option>
                          <option>EST (UTC-5)</option>
                          <option>PST (UTC-8)</option>
                          <option>IST (UTC+5:30)</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50">
                    <h2 className="text-xl font-bold text-white mb-6">Data & Privacy</h2>
                    <div className="space-y-3">
                      <button className="w-full px-4 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-left font-semibold transition-colors">
                        Download Your Data
                      </button>
                      <button className="w-full px-4 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-left font-semibold transition-colors">
                        Privacy Settings
                      </button>
                      <button className="w-full px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg text-left font-semibold transition-colors">
                        Delete Account
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
