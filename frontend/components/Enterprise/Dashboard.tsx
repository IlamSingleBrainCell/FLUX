// Enterprise SDLC Dashboard Component
import React, { useState, useEffect } from 'react';
import { enterpriseAgents } from '../../config/agents';

interface DashboardMetrics {
  activeAgents: number;
  currentSprint: string;
  sprintProgress: number;
  codeReviews: number;
  deployments: number;
  testCoverage: number;
}

interface AgentActivity {
  agentId: string;
  agentName: string;
  lastActivity: string;
  currentTask: string;
  status: 'active' | 'idle' | 'busy';
}

export const EnterpriseDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    activeAgents: 7,
    currentSprint: 'Sprint 24.3',
    sprintProgress: 67,
    codeReviews: 12,
    deployments: 3,
    testCoverage: 87.5
  });

  const [agentActivities, setAgentActivities] = useState<AgentActivity[]>([
    { agentId: 'requirements_analyst', agentName: 'Messi', lastActivity: '2 min ago', currentTask: 'Analyzing user story US-2401', status: 'active' },
    { agentId: 'software_architect', agentName: 'Ronaldo', lastActivity: '5 min ago', currentTask: 'Reviewing system architecture', status: 'active' },
    { agentId: 'developer', agentName: 'Neymar', lastActivity: '1 min ago', currentTask: 'Implementing API endpoints', status: 'busy' },
    { agentId: 'qa_tester', agentName: 'Mbappé', lastActivity: '3 min ago', currentTask: 'Executing test suite', status: 'busy' },
    { agentId: 'devops_engineer', agentName: 'Benzema', lastActivity: '10 min ago', currentTask: 'Monitoring deployment', status: 'active' },
    { agentId: 'project_manager', agentName: 'Modric', lastActivity: '1 min ago', currentTask: 'Sprint planning', status: 'active' },
    { agentId: 'security_expert', agentName: 'Ramos', lastActivity: '15 min ago', currentTask: 'Security audit review', status: 'idle' },
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'busy': return 'bg-yellow-500';
      case 'idle': return 'bg-gray-400';
      default: return 'bg-gray-400';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Active';
      case 'busy': return 'Busy';
      case 'idle': return 'Idle';
      default: return 'Unknown';
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Enterprise SDLC Dashboard</h1>
          <p className="text-gray-600">Real-time view of your multi-agent development team</p>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900 mt-4">{metrics.activeAgents}</p>
            <p className="text-sm text-gray-600">Active Agents</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900 mt-4">{metrics.sprintProgress}%</p>
            <p className="text-sm text-gray-600">{metrics.currentSprint}</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900 mt-4">{metrics.codeReviews}</p>
            <p className="text-sm text-gray-600">Code Reviews</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900 mt-4">{metrics.deployments}</p>
            <p className="text-sm text-gray-600">Deployments Today</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H9a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900 mt-4">{metrics.testCoverage}%</p>
            <p className="text-sm text-gray-600">Test Coverage</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900 mt-4">0</p>
            <p className="text-sm text-gray-600">Security Issues</p>
          </div>
        </div>

        {/* Agent Activities */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Team Activity</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {agentActivities.map((activity) => {
              const agent = enterpriseAgents.find(a => a.id === activity.agentId);
              return (
                <div key={activity.agentId} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-lg">
                        {agent?.avatar}
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <p className="text-sm font-medium text-gray-900">{activity.agentName}</p>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-white ${getStatusColor(activity.status)}`}>
                          {getStatusText(activity.status)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{agent?.role}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-900">{activity.currentTask}</p>
                    <p className="text-sm text-gray-500">{activity.lastActivity}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};