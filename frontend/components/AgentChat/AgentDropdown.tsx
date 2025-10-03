// components/AgentChat/AgentDropdown.tsx - GitHub Copilot Style Agent Selector
import React, { useState, useRef, useEffect } from 'react';

interface Agent {
  id: string;
  name: string;
  role: string;
  avatar: string;
  model: string;
  modelName: string;
  description: string;
}

const agents: Agent[] = [
  {
    id: 'requirements_analyst',
    name: 'Messi',
    role: 'Requirements Analyst',
    avatar: '⚽',
    model: 'llama-3.3-70b-versatile',
    modelName: 'Llama 3.3 70B',
    description: 'Requirements gathering, user stories, acceptance criteria'
  },
  {
    id: 'software_architect',
    name: 'Ronaldo',
    role: 'Software Architect',
    avatar: '🏗️',
    model: 'llama-3.1-8b-instant',
    modelName: 'Llama 3.1 8B',
    description: 'System design, architecture patterns, technology selection'
  },
  {
    id: 'developer',
    name: 'Neymar',
    role: 'Senior Developer',
    avatar: '💻',
    model: 'llama-3.1-70b-versatile',
    modelName: 'Llama 3.1 70B',
    description: 'Full-stack development, API design, code implementation'
  },
  {
    id: 'qa_tester',
    name: 'Mbappé',
    role: 'QA Engineer',
    avatar: '🧪',
    model: 'llama-3.1-8b-instant',
    modelName: 'Llama 3.1 8B',
    description: 'Test planning, automated testing, quality assurance'
  },
  {
    id: 'devops_engineer',
    name: 'Benzema',
    role: 'DevOps Engineer',
    avatar: '🚀',
    model: 'llama-3.1-8b-instant',
    modelName: 'Llama 3.1 8B',
    description: 'CI/CD pipelines, infrastructure, deployment automation'
  },
  {
    id: 'project_manager',
    name: 'Modric',
    role: 'Project Manager',
    avatar: '📊',
    model: 'llama-3.1-8b-instant',
    modelName: 'Llama 3.1 8B',
    description: 'Sprint planning, team coordination, project management'
  },
  {
    id: 'security_expert',
    name: 'Ramos',
    role: 'Security Expert',
    avatar: '🔒',
    model: 'llama-3.1-8b-instant',
    modelName: 'Llama 3.1 8B',
    description: 'Security assessment, penetration testing, compliance'
  }
];

interface AgentDropdownProps {
  selectedAgent: Agent;
  onAgentChange: (agent: Agent) => void;
}

export const AgentDropdown: React.FC<AgentDropdownProps> = ({
  selectedAgent,
  onAgentChange
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleAgentSelect = (agent: Agent) => {
    onAgentChange(agent);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Dropdown Trigger - GitHub Copilot Style */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg border border-slate-600 transition-all shadow-sm hover:shadow-md min-w-[300px]"
      >
        <div className="flex items-center space-x-2 flex-1">
          <span className="text-xl">{selectedAgent.avatar}</span>
          <div className="text-left">
            <div className="font-semibold text-sm">{selectedAgent.name}</div>
            <div className="text-xs text-slate-400">{selectedAgent.role}</div>
          </div>
        </div>
        
        {/* Model Badge */}
        <div className="px-2 py-1 bg-blue-600/20 text-blue-400 rounded text-xs font-mono border border-blue-600/30">
          {selectedAgent.modelName}
        </div>
        
        {/* Dropdown Icon */}
        <svg 
          className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-full bg-slate-800 border border-slate-600 rounded-lg shadow-2xl z-50 overflow-hidden">
          {/* Header */}
          <div className="px-4 py-3 bg-slate-900/50 border-b border-slate-600">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
              Select AI Agent
            </div>
          </div>

          {/* Agent List */}
          <div className="max-h-96 overflow-y-auto">
            {agents.map((agent) => (
              <button
                key={agent.id}
                onClick={() => handleAgentSelect(agent)}
                className={`w-full px-4 py-3 flex items-start space-x-3 hover:bg-slate-700/50 transition-colors border-l-4 ${
                  selectedAgent.id === agent.id
                    ? 'bg-blue-600/10 border-l-blue-500'
                    : 'border-l-transparent'
                }`}
              >
                {/* Avatar */}
                <div className="text-2xl flex-shrink-0 mt-1">
                  {agent.avatar}
                </div>

                {/* Agent Info */}
                <div className="flex-1 text-left">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-white text-sm">
                      {agent.name}
                    </span>
                    {selectedAgent.id === agent.id && (
                      <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  
                  <div className="text-xs text-slate-400 mb-2">
                    {agent.role}
                  </div>

                  {/* Model Badge */}
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="px-2 py-0.5 bg-blue-600/20 text-blue-400 rounded text-xs font-mono border border-blue-600/30">
                      {agent.modelName}
                    </div>
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-xs text-green-400">Available</span>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-slate-500 leading-relaxed">
                    {agent.description}
                  </p>
                </div>
              </button>
            ))}
          </div>

          {/* Footer */}
          <div className="px-4 py-3 bg-slate-900/50 border-t border-slate-600">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">
                {agents.length} agents available
              </span>
              <div className="flex items-center space-x-1">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                <span className="text-green-400">All systems operational</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Export default agent (Modric - Project Manager)
export const getDefaultAgent = (): Agent => {
  return agents.find(a => a.id === 'project_manager') || agents[0];
};

// Export all agents for external use
export const getAllAgents = (): Agent[] => {
  return agents;
};
