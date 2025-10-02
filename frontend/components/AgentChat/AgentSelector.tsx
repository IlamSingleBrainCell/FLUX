// components/AgentChat/AgentSelector.tsx
import React from 'react';
import { AgentInfo } from '../../types/agents';
import { AgentAvatar } from './AgentAvatar';
import { enterpriseAgents } from '../../config/agents';

interface AgentSelectorProps {
  agents: AgentInfo[];
  selectedAgents: string[];
  onAgentToggle: (agentId: string) => void;
  activeAgents: string[];
  thinkingAgents?: string[];
}

export const AgentSelector: React.FC<AgentSelectorProps> = ({
  agents,
  selectedAgents,
  onAgentToggle,
  activeAgents,
  thinkingAgents = []
}) => {
  const getAgentStatus = (agentId: string) => {
    if (thinkingAgents.includes(agentId)) return 'thinking';
    if (activeAgents.includes(agentId)) return 'active';
    return 'idle';
  };

  const getStatusIndicator = (status: string) => {
    switch (status) {
      case 'thinking':
        return (
          <div className="flex space-x-1 items-center">
            <div className="flex space-x-1">
              <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
              <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
              <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
            </div>
            <span className="text-xs text-yellow-600 font-medium ml-1">Thinking...</span>
          </div>
        );
      case 'active':
        return (
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-lg shadow-green-500/50"></div>
            <span className="text-xs text-green-600 font-medium">Available online</span>
          </div>
        );
      default:
        return (
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
            <span className="text-xs text-gray-500">Ready</span>
          </div>
        );
    }
  };

  // Get agent stats (mock data for enhancement)
  const getAgentStats = (agentId: string) => {
    const statsMap: { [key: string]: { tasks: number; responseTime: string; availability: number } } = {
      'requirements_analyst': { tasks: 24, responseTime: '2.3s', availability: 98 },
      'software_architect': { tasks: 18, responseTime: '3.1s', availability: 95 },
      'developer': { tasks: 42, responseTime: '1.8s', availability: 100 },
      'qa_tester': { tasks: 31, responseTime: '2.5s', availability: 97 },
      'devops_engineer': { tasks: 15, responseTime: '4.2s', availability: 94 },
      'project_manager': { tasks: 28, responseTime: '2.0s', availability: 99 },
      'security_expert': { tasks: 12, responseTime: '3.8s', availability: 96 }
    };
    return statsMap[agentId] || { tasks: 0, responseTime: 'N/A', availability: 0 };
  };

  return (
    <div className="bg-gradient-to-br from-white via-slate-50 to-white rounded-2xl shadow-2xl p-6 border border-slate-200/80">
      {/* Enhanced Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-200">
        <div>
          <h3 className="text-2xl font-bold text-slate-900 flex items-center">
            <span className="mr-3 text-3xl">⚽</span>
            SDLC Team
          </h3>
          <p className="text-sm text-slate-500 mt-1">Select agents to collaborate with</p>
        </div>
        <div className="text-right">
          <div className="text-sm font-semibold text-slate-700">
            {activeAgents.length} <span className="text-emerald-600">● online</span>
          </div>
          <div className="text-xs text-slate-500 mt-1">
            {selectedAgents.length} selected
          </div>
        </div>
      </div>
      
      <div className="space-y-3">
        {agents.map((agent) => {
          const isSelected = selectedAgents.includes(agent.id);
          const status = getAgentStatus(agent.id);
          const stats = getAgentStats(agent.id);

          return (
            <div
              key={agent.id}
              onClick={() => onAgentToggle(agent.id)}
              className={`relative p-5 rounded-2xl border-2 cursor-pointer transition-all duration-300 hover:shadow-xl group transform hover:scale-[1.02] ${
                isSelected
                  ? 'border-blue-500 bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-50 shadow-xl ring-2 ring-blue-200'
                  : 'border-slate-200 hover:border-blue-300 hover:bg-slate-50/50'
              } ${
                status === 'thinking' ? 'ring-2 ring-yellow-400/50 animate-pulse' : ''
              } ${
                status === 'active' ? 'ring-1 ring-emerald-400/30' : ''
              }`}
            >
              {/* Selection Indicator */}
              {isSelected && (
                <div className="absolute -top-2 -right-2 w-7 h-7 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full flex items-center justify-center shadow-xl z-10 animate-bounce">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}

              <div className="flex items-start space-x-4">
                <div className="relative flex-shrink-0">
                  <AgentAvatar agent={agent} size="lg" />
                  {/* Enhanced Status dot overlay */}
                  <div className="absolute -bottom-1 -right-1">
                    {status === 'active' && <div className="w-5 h-5 bg-emerald-500 rounded-full border-3 border-white animate-pulse shadow-lg shadow-emerald-500/50"></div>}
                    {status === 'thinking' && <div className="w-5 h-5 bg-yellow-500 rounded-full border-3 border-white animate-bounce shadow-lg shadow-yellow-500/50"></div>}
                    {status === 'idle' && <div className="w-5 h-5 bg-slate-400 rounded-full border-3 border-white"></div>}
                  </div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                      {agent.name}
                    </h4>
                    <div className="flex items-center space-x-2">
                      {/* Performance Badge */}
                      <div className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold border border-emerald-200">
                        {stats.availability}% uptime
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-sm text-slate-600 mb-3 font-semibold flex items-center">
                    <svg className="w-4 h-4 mr-1 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    {agent.role === 'requirements_analyst' && 'Requirements Analyst'}
                    {agent.role === 'software_architect' && 'Software Architect'}
                    {agent.role === 'developer' && 'Senior Developer'}
                    {agent.role === 'qa_tester' && 'QA Engineer'}
                    {agent.role === 'devops_engineer' && 'DevOps Engineer'}
                    {agent.role === 'project_manager' && 'Project Manager'}
                    {agent.role === 'security_expert' && 'Security Expert'}
                  </p>
                  
                  {/* Enhanced Status Indicator */}
                  <div className="mb-3">
                    {getStatusIndicator(status)}
                  </div>

                  {/* Performance Metrics */}
                  <div className="grid grid-cols-2 gap-2 mb-3 p-3 bg-white/60 rounded-lg border border-slate-200/50">
                    <div className="text-center">
                      <div className="text-lg font-bold text-slate-900">{stats.tasks}</div>
                      <div className="text-xs text-slate-500">Tasks Done</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-slate-900">{stats.responseTime}</div>
                      <div className="text-xs text-slate-500">Avg Response</div>
                    </div>
                  </div>
                  
                  {/* Expertise Tags */}
                  <div className="flex flex-wrap gap-1.5">
                    {agent.expertise.slice(0, 3).map((skill, idx) => (
                      <span
                        key={skill}
                        className={`px-2.5 py-1 text-xs font-medium rounded-lg border transition-all ${
                          isSelected 
                            ? 'bg-blue-100 text-blue-700 border-blue-300' 
                            : 'bg-slate-100 text-slate-600 border-slate-200 group-hover:bg-blue-50 group-hover:text-blue-600 group-hover:border-blue-200'
                        }`}
                      >
                        {skill}
                      </span>
                    ))}
                    {agent.expertise.length > 3 && (
                      <span className="px-2.5 py-1 text-xs bg-slate-200 text-slate-600 rounded-lg font-medium border border-slate-300">
                        +{agent.expertise.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Enhanced Hover Effect */}
              <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-400/10 via-indigo-400/10 to-cyan-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none ${isSelected ? 'opacity-100' : ''}`}></div>
              
              {/* Shimmer Effect */}
              {isSelected && (
                <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      {/* Enhanced Team Summary */}
      {selectedAgents.length > 0 && (
        <div className="mt-6 p-5 bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-50 rounded-2xl border-2 border-blue-300 shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div>
                <div className="text-lg font-bold text-blue-900">
                  <strong className="text-2xl">{selectedAgents.length}</strong> agent{selectedAgents.length > 1 ? 's' : ''} selected
                </div>
                <div className="text-sm text-blue-700">Ready for enterprise collaboration</div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse shadow-lg shadow-emerald-500/50"></div>
              <span className="text-xs text-emerald-700 font-bold px-3 py-1 bg-emerald-100 rounded-full border border-emerald-300">
                All systems ready
              </span>
            </div>
          </div>
          
          {/* Selected Agents Preview */}
          <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-blue-200">
            {selectedAgents.map((agentId) => {
              const agent = agents.find(a => a.id === agentId);
              if (!agent) return null;
              return (
                <div key={agentId} className="flex items-center space-x-2 px-3 py-2 bg-white rounded-lg border border-blue-200 shadow-sm">
                  <span className="text-lg">{agent.avatar}</span>
                  <span className="text-sm font-semibold text-slate-700">{agent.name}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
      
      {/* Quick Stats Bar */}
      <div className="mt-4 grid grid-cols-3 gap-3">
        <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-center">
          <div className="text-2xl font-bold text-emerald-700">{agents.length}</div>
          <div className="text-xs text-emerald-600 font-medium">Total Agents</div>
        </div>
        <div className="p-3 bg-blue-50 rounded-xl border border-blue-200 text-center">
          <div className="text-2xl font-bold text-blue-700">{activeAgents.length}</div>
          <div className="text-xs text-blue-600 font-medium">Online Now</div>
        </div>
        <div className="p-3 bg-purple-50 rounded-xl border border-purple-200 text-center">
          <div className="text-2xl font-bold text-purple-700">24/7</div>
          <div className="text-xs text-purple-600 font-medium">Available</div>
        </div>
      </div>
    </div>
  );
};