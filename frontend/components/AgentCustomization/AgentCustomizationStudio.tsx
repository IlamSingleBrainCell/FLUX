import React, { useState } from 'react';

interface AgentConfig {
  id: string;
  name: string;
  role: string;
  personality: 'professional' | 'friendly' | 'technical' | 'creative';
  responseLength: 'concise' | 'detailed' | 'balanced';
  temperature: number; // 0-1 (creativity level)
  customInstructions: string;
  trainingDocs: string[];
  behaviorMetrics: {
    callsThisWeek: number;
    avgResponseTime: number;
    satisfaction: number;
    collaborations: { agentName: string; count: number }[];
  };
}

export const AgentCustomizationStudio: React.FC = () => {
  const [agents, setAgents] = useState<AgentConfig[]>([
    {
      id: 'marcus',
      name: 'Marcus',
      role: 'Project Manager',
      personality: 'professional',
      responseLength: 'balanced',
      temperature: 0.5,
      customInstructions: 'Always prioritize deadlines and stakeholder communication.',
      trainingDocs: ['Project Management Best Practices', 'Agile Methodology Guide'],
      behaviorMetrics: {
        callsThisWeek: 47,
        avgResponseTime: 2.3,
        satisfaction: 4.7,
        collaborations: [
          { agentName: 'Sarah', count: 23 },
          { agentName: 'Alex', count: 18 },
          { agentName: 'Jordan', count: 15 }
        ]
      }
    },
    {
      id: 'sarah',
      name: 'Sarah',
      role: 'Software Architect',
      personality: 'technical',
      responseLength: 'detailed',
      temperature: 0.7,
      customInstructions: 'Focus on scalability, security, and maintainability in all recommendations.',
      trainingDocs: ['System Design Patterns', 'Cloud Architecture', 'Microservices Best Practices'],
      behaviorMetrics: {
        callsThisWeek: 62,
        avgResponseTime: 3.1,
        satisfaction: 4.9,
        collaborations: [
          { agentName: 'Marcus', count: 23 },
          { agentName: 'Casey', count: 19 },
          { agentName: 'Alex', count: 14 }
        ]
      }
    },
    {
      id: 'alex',
      name: 'Alex',
      role: 'DevOps Engineer',
      personality: 'technical',
      responseLength: 'concise',
      temperature: 0.4,
      customInstructions: 'Prioritize automation, CI/CD, and infrastructure as code.',
      trainingDocs: ['Docker & Kubernetes', 'Terraform Guide', 'CI/CD Pipelines'],
      behaviorMetrics: {
        callsThisWeek: 38,
        avgResponseTime: 1.8,
        satisfaction: 4.6,
        collaborations: [
          { agentName: 'Marcus', count: 18 },
          { agentName: 'Sarah', count: 14 },
          { agentName: 'Riley', count: 12 }
        ]
      }
    }
  ]);

  const [selectedAgent, setSelectedAgent] = useState<AgentConfig>(agents[0]);
  const [activeTab, setActiveTab] = useState<'personality' | 'training' | 'analytics'>('personality');

  const updateAgent = (updates: Partial<AgentConfig>) => {
    const updatedAgent = { ...selectedAgent, ...updates };
    setSelectedAgent(updatedAgent);
    setAgents(prev => prev.map(a => a.id === updatedAgent.id ? updatedAgent : a));
  };

  const personalityDescriptions = {
    professional: 'Formal, business-focused, structured communication',
    friendly: 'Casual, approachable, warm and encouraging',
    technical: 'Detail-oriented, precise, code-focused',
    creative: 'Innovative, exploratory, outside-the-box thinking'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50 dark:from-gray-900 dark:to-purple-950 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            🎨 Agent Customization Studio
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Fine-tune agent personalities, behaviors, and training
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Agent Selector Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 space-y-2">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Select Agent</h3>
              {agents.map(agent => (
                <button
                  key={agent.id}
                  onClick={() => setSelectedAgent(agent)}
                  className={`w-full p-4 rounded-lg text-left transition ${
                    selectedAgent.id === agent.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  <p className="font-semibold">{agent.name}</p>
                  <p className="text-sm opacity-80">{agent.role}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {agent.behaviorMetrics.callsThisWeek} calls this week
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Main Configuration Panel */}
          <div className="lg:col-span-3">
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
              {/* Agent Header */}
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
                <h2 className="text-2xl font-bold mb-2">{selectedAgent.name}</h2>
                <p className="opacity-90">{selectedAgent.role}</p>
              </div>

              {/* Tabs */}
              <div className="flex border-b border-gray-200 dark:border-gray-700">
                {['personality', 'training', 'analytics'].map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab as any)}
                    className={`px-6 py-3 font-medium transition ${
                      activeTab === tab
                        ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border-b-2 border-blue-600'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {activeTab === 'personality' && (
                  <div className="space-y-6">
                    {/* Personality Type */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                        Personality Type
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        {(Object.keys(personalityDescriptions) as Array<keyof typeof personalityDescriptions>).map(type => (
                          <button
                            key={type}
                            onClick={() => updateAgent({ personality: type })}
                            className={`p-4 rounded-lg border-2 text-left transition ${
                              selectedAgent.personality === type
                                ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/30'
                                : 'border-gray-200 dark:border-gray-700 hover:border-blue-400'
                            }`}
                          >
                            <p className="font-semibold text-gray-900 dark:text-white capitalize mb-1">
                              {type}
                            </p>
                            <p className="text-xs text-gray-600 dark:text-gray-400">
                              {personalityDescriptions[type]}
                            </p>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Response Length */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                        Response Length
                      </label>
                      <div className="flex gap-3">
                        {['concise', 'balanced', 'detailed'].map(length => (
                          <button
                            key={length}
                            onClick={() => updateAgent({ responseLength: length as any })}
                            className={`flex-1 px-4 py-3 rounded-lg font-medium transition ${
                              selectedAgent.responseLength === length
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                            }`}
                          >
                            {length.charAt(0).toUpperCase() + length.slice(1)}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Creativity Level (Temperature) */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                        Creativity Level: {selectedAgent.temperature.toFixed(1)}
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        value={selectedAgent.temperature}
                        onChange={(e) => updateAgent({ temperature: parseFloat(e.target.value) })}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mt-1">
                        <span>Conservative</span>
                        <span>Balanced</span>
                        <span>Creative</span>
                      </div>
                    </div>

                    {/* Custom Instructions */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                        Custom Instructions
                      </label>
                      <textarea
                        value={selectedAgent.customInstructions}
                        onChange={(e) => updateAgent({ customInstructions: e.target.value })}
                        rows={4}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="Add custom instructions for this agent..."
                      />
                    </div>
                  </div>
                )}

                {activeTab === 'training' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Training Documentation
                      </h3>
                      <div className="space-y-3 mb-4">
                        {selectedAgent.trainingDocs.map((doc, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between p-3 bg-gray-100 dark:bg-gray-700 rounded-lg"
                          >
                            <span className="text-gray-900 dark:text-white">📄 {doc}</span>
                            <button className="text-red-600 hover:text-red-700 text-sm font-medium">
                              Remove
                            </button>
                          </div>
                        ))}
                      </div>
                      <button className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition">
                        ➕ Upload Training Document
                      </button>
                    </div>

                    <div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-4 border border-blue-200 dark:border-blue-700">
                      <p className="text-sm text-blue-900 dark:text-blue-300">
                        💡 <strong>Tip:</strong> Upload company-specific documentation, coding standards, 
                        or workflow guides to train agents on your unique processes.
                      </p>
                    </div>
                  </div>
                )}

                {activeTab === 'analytics' && (
                  <div className="space-y-6">
                    {/* Behavior Metrics */}
                    <div className="grid grid-cols-3 gap-4">
                      <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 text-white">
                        <p className="text-sm opacity-80 mb-1">Calls This Week</p>
                        <p className="text-3xl font-bold">{selectedAgent.behaviorMetrics.callsThisWeek}</p>
                      </div>
                      <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-4 text-white">
                        <p className="text-sm opacity-80 mb-1">Avg Response Time</p>
                        <p className="text-3xl font-bold">{selectedAgent.behaviorMetrics.avgResponseTime}s</p>
                      </div>
                      <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-4 text-white">
                        <p className="text-sm opacity-80 mb-1">Satisfaction</p>
                        <p className="text-3xl font-bold">{selectedAgent.behaviorMetrics.satisfaction}/5</p>
                      </div>
                    </div>

                    {/* Collaboration Network */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Top Collaborations
                      </h3>
                      <div className="space-y-3">
                        {selectedAgent.behaviorMetrics.collaborations.map((collab, idx) => (
                          <div key={idx} className="flex items-center gap-4">
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-1">
                                <span className="font-medium text-gray-900 dark:text-white">
                                  {collab.agentName}
                                </span>
                                <span className="text-sm text-gray-600 dark:text-gray-400">
                                  {collab.count} interactions
                                </span>
                              </div>
                              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                <div
                                  className="bg-blue-600 h-2 rounded-full"
                                  style={{ width: `${(collab.count / 25) * 100}%` }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Save Button */}
              <div className="border-t border-gray-200 dark:border-gray-700 p-6">
                <button className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition">
                  💾 Save Configuration
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
