import React, { useState, useEffect } from 'react';

interface IntegrationConfig {
  id: string;
  name: string;
  description: string;
  icon: string;
  connected: boolean;
  category: 'project-management' | 'communication' | 'version-control' | 'calendar' | 'documentation';
  features: string[];
  webhookUrl?: string;
}

export const IntegrationHub: React.FC = () => {
  const [integrations, setIntegrations] = useState<IntegrationConfig[]>([
    {
      id: 'jira',
      name: 'Jira',
      description: 'Automated ticket updates and sprint synchronization',
      icon: '🎯',
      connected: true,
      category: 'project-management',
      features: ['Auto-create tickets', 'Sprint sync', 'Status updates', 'Comment sync']
    },
    {
      id: 'linear',
      name: 'Linear',
      description: 'Modern issue tracking with AI insights',
      icon: '📊',
      connected: false,
      category: 'project-management',
      features: ['Issue creation', 'Project sync', 'Team notifications', 'Cycle tracking']
    },
    {
      id: 'slack',
      name: 'Slack',
      description: 'Real-time notifications and chat commands',
      icon: '💬',
      connected: true,
      category: 'communication',
      features: ['Bot commands', 'Notifications', 'Status sync', 'Thread updates']
    },
    {
      id: 'teams',
      name: 'Microsoft Teams',
      description: 'Enterprise communication and collaboration',
      icon: '👥',
      connected: false,
      category: 'communication',
      features: ['Chat integration', 'Meeting notifications', 'File sharing', 'Status updates']
    },
    {
      id: 'gitlab',
      name: 'GitLab',
      description: 'CI/CD and code repository integration',
      icon: '🦊',
      connected: false,
      category: 'version-control',
      features: ['Pipeline status', 'MR reviews', 'Code analysis', 'Deployment tracking']
    },
    {
      id: 'bitbucket',
      name: 'Bitbucket',
      description: 'Git repository and pipelines',
      icon: '🪣',
      connected: false,
      category: 'version-control',
      features: ['Repository sync', 'PR reviews', 'Build status', 'Branch management']
    },
    {
      id: 'gcal',
      name: 'Google Calendar',
      description: 'Sprint planning and meeting scheduling',
      icon: '📅',
      connected: true,
      category: 'calendar',
      features: ['Sprint events', 'Meeting reminders', 'Timeline sync', 'Availability tracking']
    },
    {
      id: 'outlook',
      name: 'Outlook Calendar',
      description: 'Microsoft 365 calendar integration',
      icon: '📧',
      connected: false,
      category: 'calendar',
      features: ['Event sync', 'Meeting scheduling', 'Availability', 'Reminders']
    },
    {
      id: 'confluence',
      name: 'Confluence',
      description: 'Documentation and knowledge base sync',
      icon: '📚',
      connected: false,
      category: 'documentation',
      features: ['Doc sync', 'Page creation', 'Template management', 'Search integration']
    },
    {
      id: 'notion',
      name: 'Notion',
      description: 'Workspace and documentation platform',
      icon: '📝',
      connected: true,
      category: 'documentation',
      features: ['Database sync', 'Page updates', 'Template sharing', 'Wiki integration']
    }
  ]);

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [selectedIntegration, setSelectedIntegration] = useState<IntegrationConfig | null>(null);

  const categories = [
    { value: 'all', label: 'All Integrations', icon: '🔗' },
    { value: 'project-management', label: 'Project Management', icon: '🎯' },
    { value: 'communication', label: 'Communication', icon: '💬' },
    { value: 'version-control', label: 'Version Control', icon: '🔀' },
    { value: 'calendar', label: 'Calendar', icon: '📅' },
    { value: 'documentation', label: 'Documentation', icon: '📚' }
  ];

  const toggleConnection = (id: string) => {
    setIntegrations(prev => prev.map(int => 
      int.id === id ? { ...int, connected: !int.connected } : int
    ));
  };

  const openConfig = (integration: IntegrationConfig) => {
    setSelectedIntegration(integration);
    setShowConfigModal(true);
  };

  const filteredIntegrations = integrations.filter(int =>
    selectedCategory === 'all' || int.category === selectedCategory
  );

  const connectedCount = integrations.filter(int => int.connected).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50 dark:from-gray-900 dark:to-indigo-950 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                🔗 Integration Hub
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Connect FLUX with your favorite tools and platforms
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Connected Integrations</p>
              <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                {connectedCount}/{integrations.length}
              </p>
            </div>
          </div>

          {/* Category Filters */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map(cat => (
              <button
                key={cat.value}
                onClick={() => setSelectedCategory(cat.value)}
                className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition ${
                  selectedCategory === cat.value
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {cat.icon} {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Integrations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredIntegrations.map(integration => (
            <div
              key={integration.id}
              className={`bg-white dark:bg-gray-800 rounded-xl border-2 p-6 transition ${
                integration.connected
                  ? 'border-green-500'
                  : 'border-gray-200 dark:border-gray-700'
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="text-5xl">{integration.icon}</div>
                <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  integration.connected
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                }`}>
                  {integration.connected ? '✓ Connected' : 'Disconnected'}
                </div>
              </div>

              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                {integration.name}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                {integration.description}
              </p>

              <div className="mb-4">
                <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">Features:</p>
                <div className="flex flex-wrap gap-2">
                  {integration.features.slice(0, 3).map((feature, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded text-xs"
                    >
                      {feature}
                    </span>
                  ))}
                  {integration.features.length > 3 && (
                    <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded text-xs">
                      +{integration.features.length - 3} more
                    </span>
                  )}
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => toggleConnection(integration.id)}
                  className={`flex-1 px-4 py-2 rounded-lg font-medium transition ${
                    integration.connected
                      ? 'bg-red-600 hover:bg-red-700 text-white'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  {integration.connected ? '✕ Disconnect' : '✓ Connect'}
                </button>
                <button
                  onClick={() => openConfig(integration)}
                  className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition"
                >
                  ⚙️
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Configuration Modal */}
        {showConfigModal && selectedIntegration && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full p-8 border border-gray-200 dark:border-gray-700">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="text-5xl">{selectedIntegration.icon}</div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      {selectedIntegration.name} Configuration
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">
                      {selectedIntegration.description}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowConfigModal(false)}
                  className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 text-2xl"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    API Key / Token
                  </label>
                  <input
                    type="password"
                    placeholder="Enter your API key"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Webhook URL (Optional)
                  </label>
                  <input
                    type="url"
                    placeholder="https://your-webhook-url.com"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Enable Features
                  </label>
                  <div className="space-y-2">
                    {selectedIntegration.features.map((feature, idx) => (
                      <label key={idx} className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" defaultChecked className="rounded" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">{feature}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    toggleConnection(selectedIntegration.id);
                    setShowConfigModal(false);
                  }}
                  className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition"
                >
                  Save & Connect
                </button>
                <button
                  onClick={() => setShowConfigModal(false)}
                  className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
