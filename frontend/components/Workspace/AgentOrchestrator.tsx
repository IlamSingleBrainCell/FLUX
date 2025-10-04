// components/Workspace/AgentOrchestrator.tsx - Multi-Agent Workflow Orchestration
import React, { useState } from 'react';

interface Agent {
  id: string;
  name: string;
  avatar: string;
  role: string;
}

interface Task {
  id: string;
  agentId: string;
  agentName: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed' | 'failed';
  result?: string;
  startTime?: number;
  endTime?: number;
}

interface WorkflowStep {
  agentId: string;
  prompt: string;
  dependencies?: string[]; // IDs of tasks that must complete first
}

interface AgentOrchestratorProps {
  agents: Agent[];
  onWorkflowComplete?: (results: Task[]) => void;
  className?: string;
}

export const AgentOrchestrator: React.FC<AgentOrchestratorProps> = ({
  agents,
  onWorkflowComplete,
  className = ''
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const orchestrateWorkflow = async (userMessage: string) => {
    setIsRunning(true);
    setIsVisible(true);
    
    // Step 1: Analyze request with Project Manager
    const analysisTask: Task = {
      id: 'task-1',
      agentId: 'project_manager',
      agentName: 'Modric',
      description: 'Analyzing request and creating task breakdown',
      status: 'in-progress',
      startTime: Date.now()
    };
    
    setTasks([analysisTask]);

    try {
      // Simulate PM analysis
      await simulateAgentWork(1500);
      
      const workflow = analyzeAndCreateWorkflow(userMessage);
      
      setTasks(prev => prev.map(t => 
        t.id === 'task-1' 
          ? { ...t, status: 'completed', endTime: Date.now(), result: 'Workflow created' }
          : t
      ));

      // Execute workflow
      await executeWorkflow(workflow);
      
      onWorkflowComplete?.(tasks);
    } catch (error) {
      console.error('Workflow failed:', error);
    } finally {
      setIsRunning(false);
    }
  };

  const analyzeAndCreateWorkflow = (message: string): WorkflowStep[] => {
    const lower = message.toLowerCase();
    const workflow: WorkflowStep[] = [];

    // Detect required agents based on message
    if (lower.includes('requirement') || lower.includes('user story')) {
      workflow.push({
        agentId: 'requirements_analyst',
        prompt: `Create detailed requirements for: ${message}`
      });
    }

    if (lower.includes('architect') || lower.includes('design')) {
      workflow.push({
        agentId: 'software_architect',
        prompt: `Design architecture for: ${message}`,
        dependencies: workflow.length > 0 ? [workflow[workflow.length - 1].agentId] : undefined
      });
    }

    if (lower.includes('code') || lower.includes('implement')) {
      workflow.push({
        agentId: 'developer',
        prompt: `Implement code for: ${message}`,
        dependencies: workflow.length > 0 ? [workflow[workflow.length - 1].agentId] : undefined
      });
    }

    if (lower.includes('test') || lower.includes('qa')) {
      workflow.push({
        agentId: 'qa_tester',
        prompt: `Create tests for: ${message}`,
        dependencies: workflow.length > 0 ? [workflow[workflow.length - 1].agentId] : undefined
      });
    }

    if (lower.includes('security') || lower.includes('audit')) {
      workflow.push({
        agentId: 'security_expert',
        prompt: `Security review for: ${message}`,
        dependencies: workflow.length > 0 ? [workflow[workflow.length - 1].agentId] : undefined
      });
    }

    if (lower.includes('deploy')) {
      workflow.push({
        agentId: 'devops_engineer',
        prompt: `Plan deployment for: ${message}`,
        dependencies: workflow.length > 0 ? [workflow[workflow.length - 1].agentId] : undefined
      });
    }

    // If no specific agents detected, use full team
    if (workflow.length === 0) {
      workflow.push(
        { agentId: 'requirements_analyst', prompt: `Analyze: ${message}` },
        { agentId: 'software_architect', prompt: `Design solution for: ${message}`, dependencies: ['requirements_analyst'] },
        { agentId: 'developer', prompt: `Implement: ${message}`, dependencies: ['software_architect'] },
        { agentId: 'qa_tester', prompt: `Test: ${message}`, dependencies: ['developer'] }
      );
    }

    return workflow;
  };

  const executeWorkflow = async (workflow: WorkflowStep[]) => {
    const completedTasks = new Set<string>();

    for (const step of workflow) {
      // Wait for dependencies
      if (step.dependencies) {
        while (!step.dependencies.every(dep => completedTasks.has(dep))) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      }

      const agent = agents.find(a => a.id === step.agentId);
      if (!agent) continue;

      const task: Task = {
        id: `task-${Date.now()}-${step.agentId}`,
        agentId: step.agentId,
        agentName: agent.name,
        description: step.prompt,
        status: 'in-progress',
        startTime: Date.now()
      };

      setTasks(prev => [...prev, task]);

      // Simulate agent work
      await simulateAgentWork(2000 + Math.random() * 2000);

      setTasks(prev => prev.map(t =>
        t.id === task.id
          ? {
              ...t,
              status: 'completed',
              endTime: Date.now(),
              result: `Completed by ${agent.name}`
            }
          : t
      ));

      completedTasks.add(step.agentId);
    }
  };

  const simulateAgentWork = (ms: number) => {
    return new Promise(resolve => setTimeout(resolve, ms));
  };

  const getTaskDuration = (task: Task): string => {
    if (!task.startTime) return '0s';
    const endTime = task.endTime || Date.now();
    const duration = (endTime - task.startTime) / 1000;
    return `${duration.toFixed(1)}s`;
  };

  if (!isVisible) return null;

  return (
    <div className={`fixed bottom-4 right-4 w-96 bg-white rounded-xl shadow-2xl border border-slate-200 z-50 ${className}`}>
      {/* Header */}
      <div className="px-4 py-3 border-b border-slate-200 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Agent Workflow</h3>
              <p className="text-xs text-slate-500">
                {isRunning ? 'Orchestrating...' : 'Completed'}
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsVisible(false)}
            className="p-1 hover:bg-slate-100 rounded transition-colors"
          >
            <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Task List */}
      <div className="max-h-96 overflow-y-auto p-4 space-y-3">
        {tasks.map((task, index) => {
          const agent = agents.find(a => a.id === task.agentId);
          
          return (
            <div
              key={task.id}
              className={`p-3 rounded-lg border transition-all ${
                task.status === 'completed'
                  ? 'bg-green-50 border-green-200'
                  : task.status === 'in-progress'
                  ? 'bg-blue-50 border-blue-200 animate-pulse'
                  : task.status === 'failed'
                  ? 'bg-red-50 border-red-200'
                  : 'bg-slate-50 border-slate-200'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center text-white font-bold text-sm">
                    {agent?.avatar || '🤖'}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-semibold text-slate-900">
                      {task.agentName}
                    </span>
                    <span className="text-xs text-slate-500">
                      {getTaskDuration(task)}
                    </span>
                    {task.status === 'completed' && (
                      <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    )}
                    {task.status === 'in-progress' && (
                      <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    )}
                  </div>
                  <p className="text-xs text-slate-600 line-clamp-2">
                    {task.description}
                  </p>
                  {task.result && (
                    <p className="text-xs text-green-600 mt-1">
                      ✓ {task.result}
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Progress Bar */}
      {isRunning && (
        <div className="px-4 py-3 border-t border-slate-200">
          <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500"
              style={{
                width: `${(tasks.filter(t => t.status === 'completed').length / tasks.length) * 100}%`
              }}
            ></div>
          </div>
          <p className="text-xs text-slate-500 mt-2 text-center">
            {tasks.filter(t => t.status === 'completed').length} of {tasks.length} tasks completed
          </p>
        </div>
      )}
    </div>
  );
};

// Export function to trigger orchestration
export function useAgentOrchestrator() {
  const [orchestratorRef, setOrchestratorRef] = useState<{
    orchestrate: (message: string) => Promise<void>;
  } | null>(null);

  const orchestrate = async (message: string) => {
    if (orchestratorRef) {
      await orchestratorRef.orchestrate(message);
    }
  };

  return { orchestrate, setOrchestratorRef };
}
