// Workflow Automation Builder - Visual workflow designer like Zapier
import React, { useState, useCallback } from 'react';
import Head from 'next/head';
import { useCommandPalette } from '../components/CommandPalette/CommandPalette';
import CommandPalette from '../components/CommandPalette/CommandPalette';

interface WorkflowNode {
  id: string;
  type: 'trigger' | 'action' | 'condition' | 'delay';
  title: string;
  description: string;
  icon: string;
  position: { x: number; y: number };
  config: {
    [key: string]: any;
  };
  connections: {
    input?: string[];
    output?: string[];
  };
}

interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: string;
  nodes: WorkflowNode[];
  popularity: number;
}

export default function WorkflowBuilder() {
  const { isOpen, setIsOpen } = useCommandPalette();
  const [workflows, setWorkflows] = useState<WorkflowTemplate[]>([]);
  const [currentWorkflow, setCurrentWorkflow] = useState<WorkflowTemplate | null>(null);
  const [selectedNode, setSelectedNode] = useState<WorkflowNode | null>(null);
  const [showNodePanel, setShowNodePanel] = useState(false);
  const [view, setView] = useState<'templates' | 'builder' | 'runs'>('templates');
  const [draggedNode, setDraggedNode] = useState<WorkflowNode | null>(null);

  // Sample workflow templates
  const workflowTemplates: WorkflowTemplate[] = [
    {
      id: 'ci-cd-pipeline',
      name: 'CI/CD Pipeline',
      description: 'Automated deployment pipeline with testing and security checks',
      category: 'DevOps',
      icon: '🚀',
      popularity: 95,
      nodes: [
        {
          id: 'trigger-1',
          type: 'trigger',
          title: 'Git Push',
          description: 'Triggers when code is pushed to main branch',
          icon: '📝',
          position: { x: 50, y: 100 },
          config: { branch: 'main', repository: 'flux-platform' },
          connections: { output: ['action-1'] }
        },
        {
          id: 'action-1',
          type: 'action',
          title: 'Run Tests',
          description: 'Execute automated test suite',
          icon: '🧪',
          position: { x: 250, y: 100 },
          config: { testCommand: 'npm test', timeout: 300 },
          connections: { input: ['trigger-1'], output: ['condition-1'] }
        },
        {
          id: 'condition-1',
          type: 'condition',
          title: 'Tests Pass?',
          description: 'Check if all tests passed',
          icon: '❓',
          position: { x: 450, y: 100 },
          config: { condition: 'tests_passed === true' },
          connections: { input: ['action-1'], output: ['action-2', 'action-3'] }
        },
        {
          id: 'action-2',
          type: 'action',
          title: 'Deploy to Staging',
          description: 'Deploy to staging environment',
          icon: '🚢',
          position: { x: 650, y: 50 },
          config: { environment: 'staging', strategy: 'blue-green' },
          connections: { input: ['condition-1'], output: ['action-4'] }
        },
        {
          id: 'action-3',
          type: 'action',
          title: 'Notify Team',
          description: 'Send failure notification',
          icon: '📢',
          position: { x: 650, y: 150 },
          config: { channel: '#dev-alerts', message: 'Tests failed for {{commit}}' },
          connections: { input: ['condition-1'] }
        },
        {
          id: 'action-4',
          type: 'action',
          title: 'Security Scan',
          description: 'Run security vulnerability scan',
          icon: '🛡️',
          position: { x: 850, y: 50 },
          config: { scanner: 'OWASP ZAP', threshold: 'medium' },
          connections: { input: ['action-2'], output: ['action-5'] }
        },
        {
          id: 'action-5',
          type: 'action',
          title: 'Deploy to Production',
          description: 'Deploy to production environment',
          icon: '🎯',
          position: { x: 1050, y: 50 },
          config: { environment: 'production', approvalRequired: true },
          connections: { input: ['action-4'] }
        }
      ]
    },
    {
      id: 'issue-triaging',
      name: 'Issue Triaging',
      description: 'Automatically categorize and assign new issues',
      category: 'Project Management',
      icon: '🎯',
      popularity: 87,
      nodes: [
        {
          id: 'trigger-2',
          type: 'trigger',
          title: 'New Issue Created',
          description: 'Triggers when a new issue is opened',
          icon: '🐛',
          position: { x: 50, y: 100 },
          config: { repository: 'all', labels: [] },
          connections: { output: ['action-6'] }
        },
        {
          id: 'action-6',
          type: 'action',
          title: 'Analyze Issue',
          description: 'Use AI to analyze issue content',
          icon: '🤖',
          position: { x: 250, y: 100 },
          config: { model: 'gpt-4', prompt: 'Categorize this issue' },
          connections: { input: ['trigger-2'], output: ['condition-2'] }
        },
        {
          id: 'condition-2',
          type: 'condition',
          title: 'Is Bug?',
          description: 'Check if issue is classified as bug',
          icon: '🔍',
          position: { x: 450, y: 100 },
          config: { condition: 'category === "bug"' },
          connections: { input: ['action-6'], output: ['action-7', 'action-8'] }
        },
        {
          id: 'action-7',
          type: 'action',
          title: 'Assign to QA',
          description: 'Assign bug to QA team',
          icon: '👥',
          position: { x: 650, y: 50 },
          config: { team: 'qa', priority: 'high' },
          connections: { input: ['condition-2'] }
        },
        {
          id: 'action-8',
          type: 'action',
          title: 'Assign to PM',
          description: 'Assign feature request to PM',
          icon: '📋',
          position: { x: 650, y: 150 },
          config: { team: 'product', priority: 'medium' },
          connections: { input: ['condition-2'] }
        }
      ]
    },
    {
      id: 'performance-monitoring',
      name: 'Performance Monitoring',
      description: 'Monitor app performance and auto-scale resources',
      category: 'Monitoring',
      icon: '📊',
      popularity: 78,
      nodes: [
        {
          id: 'trigger-3',
          type: 'trigger',
          title: 'High CPU Usage',
          description: 'Triggers when CPU usage exceeds threshold',
          icon: '⚡',
          position: { x: 50, y: 100 },
          config: { threshold: 80, duration: 300 },
          connections: { output: ['action-9'] }
        },
        {
          id: 'action-9',
          type: 'action',
          title: 'Scale Up',
          description: 'Increase server instances',
          icon: '📈',
          position: { x: 250, y: 100 },
          config: { instances: 2, maxInstances: 10 },
          connections: { input: ['trigger-3'], output: ['delay-1'] }
        },
        {
          id: 'delay-1',
          type: 'delay',
          title: 'Wait 10 minutes',
          description: 'Wait before checking metrics again',
          icon: '⏱️',
          position: { x: 450, y: 100 },
          config: { duration: 600 },
          connections: { input: ['action-9'], output: ['condition-3'] }
        },
        {
          id: 'condition-3',
          type: 'condition',
          title: 'Still High Usage?',
          description: 'Check if CPU is still high',
          icon: '❓',
          position: { x: 650, y: 100 },
          config: { condition: 'cpu_usage > 70' },
          connections: { input: ['delay-1'], output: ['action-10', 'action-11'] }
        },
        {
          id: 'action-10',
          type: 'action',
          title: 'Alert DevOps',
          description: 'Send alert to DevOps team',
          icon: '🚨',
          position: { x: 850, y: 50 },
          config: { urgency: 'high', channel: '#alerts' },
          connections: { input: ['condition-3'] }
        },
        {
          id: 'action-11',
          type: 'action',
          title: 'Scale Down',
          description: 'Reduce server instances',
          icon: '📉',
          position: { x: 850, y: 150 },
          config: { instances: -1, minInstances: 2 },
          connections: { input: ['condition-3'] }
        }
      ]
    }
  ];

  // Available node types for drag and drop
  const nodeTypes = [
    { type: 'trigger', title: 'Webhook Trigger', icon: '🔗', description: 'HTTP webhook endpoint' },
    { type: 'trigger', title: 'Schedule Trigger', icon: '⏰', description: 'Time-based trigger' },
    { type: 'trigger', title: 'File Change', icon: '📁', description: 'File system watcher' },
    { type: 'action', title: 'HTTP Request', icon: '🌐', description: 'Make API call' },
    { type: 'action', title: 'Send Email', icon: '📧', description: 'Send notification email' },
    { type: 'action', title: 'Slack Message', icon: '💬', description: 'Post to Slack' },
    { type: 'action', title: 'Deploy App', icon: '🚀', description: 'Deploy application' },
    { type: 'action', title: 'Run Script', icon: '⚡', description: 'Execute custom script' },
    { type: 'condition', title: 'If/Else', icon: '❓', description: 'Conditional branching' },
    { type: 'condition', title: 'Filter', icon: '🔍', description: 'Filter data' },
    { type: 'delay', title: 'Delay', icon: '⏱️', description: 'Wait for duration' },
    { type: 'delay', title: 'Wait for Approval', icon: '✋', description: 'Manual approval step' }
  ];

  const getNodeColor = (type: string) => {
    switch (type) {
      case 'trigger': return 'from-green-500 to-emerald-600';
      case 'action': return 'from-blue-500 to-blue-600';
      case 'condition': return 'from-yellow-500 to-orange-600';
      case 'delay': return 'from-purple-500 to-purple-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const handleDragStart = (e: React.DragEvent, nodeType: any) => {
    setDraggedNode({
      id: `node-${Date.now()}`,
      type: nodeType.type as any,
      title: nodeType.title,
      description: nodeType.description,
      icon: nodeType.icon,
      position: { x: 0, y: 0 },
      config: {},
      connections: {}
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (draggedNode) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const newNode = {
        ...draggedNode,
        position: { x, y }
      };

      if (currentWorkflow) {
        setCurrentWorkflow({
          ...currentWorkflow,
          nodes: [...currentWorkflow.nodes, newNode]
        });
      }
      setDraggedNode(null);
    }
  };

  const createNewWorkflow = () => {
    const newWorkflow: WorkflowTemplate = {
      id: `workflow-${Date.now()}`,
      name: 'New Workflow',
      description: 'Custom workflow',
      category: 'Custom',
      icon: '⚡',
      popularity: 0,
      nodes: []
    };
    setCurrentWorkflow(newWorkflow);
    setView('builder');
  };

  const runWorkflow = (workflow: WorkflowTemplate) => {
    console.log('Running workflow:', workflow.name);
    // In real implementation, this would trigger the workflow execution
    alert(`Running workflow: ${workflow.name}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 dark:from-gray-900 dark:to-indigo-900">
      <Head>
        <title>Workflow Automation Builder - FLUX Platform</title>
        <meta name="description" content="Visual workflow designer for automation" />
      </Head>

      <CommandPalette isOpen={isOpen} onClose={() => setIsOpen(false)} />

      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
                ⚡ Workflow Automation
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Build powerful automation workflows with visual designer
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                <button
                  onClick={() => setView('templates')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    view === 'templates'
                      ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm'
                      : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  📋 Templates
                </button>
                <button
                  onClick={() => setView('builder')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    view === 'builder'
                      ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm'
                      : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  🛠️ Builder
                </button>
                <button
                  onClick={() => setView('runs')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    view === 'runs'
                      ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm'
                      : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  ▶️ Runs
                </button>
              </div>
              <button
                onClick={createNewWorkflow}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-2 rounded-lg font-medium transition-all"
              >
                ➕ New Workflow
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {view === 'templates' && (
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
              Workflow Templates
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {workflowTemplates.map(template => (
                <div key={template.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-xl transition-all">
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="text-4xl">{template.icon}</div>
                      <div className="flex items-center space-x-2">
                        <div className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-full text-xs font-medium">
                          {template.category}
                        </div>
                        <div className="text-xs text-gray-500">
                          {template.popularity}% popularity
                        </div>
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      {template.name}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      {template.description}
                    </p>
                    <div className="text-sm text-gray-500 mb-4">
                      {template.nodes.length} steps
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {
                          setCurrentWorkflow(template);
                          setView('builder');
                        }}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-sm font-medium transition-colors"
                      >
                        🛠️ Customize
                      </button>
                      <button
                        onClick={() => runWorkflow(template)}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                      >
                        ▶️ Run
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {view === 'builder' && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[800px]">
            {/* Node Palette */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-4 overflow-y-auto">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                Node Palette
              </h3>
              <div className="space-y-2">
                {nodeTypes.map((nodeType, index) => (
                  <div
                    key={index}
                    draggable
                    onDragStart={(e) => handleDragStart(e, nodeType)}
                    className={`p-3 rounded-lg cursor-move transition-all hover:shadow-md bg-gradient-to-r ${getNodeColor(nodeType.type)} text-white`}
                  >
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-lg">{nodeType.icon}</span>
                      <span className="font-medium text-sm">{nodeType.title}</span>
                    </div>
                    <div className="text-xs opacity-90">{nodeType.description}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Canvas */}
            <div className="lg:col-span-3 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 relative overflow-hidden">
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {currentWorkflow?.name || 'Workflow Canvas'}
                  </h3>
                  <div className="flex items-center space-x-2">
                    <button className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-sm hover:bg-gray-200 dark:hover:bg-gray-600">
                      💾 Save
                    </button>
                    <button className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700">
                      ▶️ Test Run
                    </button>
                  </div>
                </div>
              </div>
              
              <div
                className="h-full bg-gray-50 dark:bg-gray-900 relative overflow-auto"
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                style={{ 
                  backgroundImage: 'radial-gradient(circle, #e5e7eb 1px, transparent 1px)',
                  backgroundSize: '20px 20px'
                }}
              >
                {currentWorkflow?.nodes.map(node => (
                  <div
                    key={node.id}
                    className={`absolute w-48 p-4 rounded-lg shadow-lg cursor-pointer transition-all hover:shadow-xl bg-gradient-to-r ${getNodeColor(node.type)} text-white`}
                    style={{ 
                      left: node.position.x, 
                      top: node.position.y 
                    }}
                    onClick={() => setSelectedNode(node)}
                  >
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-2xl">{node.icon}</span>
                      <div>
                        <div className="font-semibold text-sm">{node.title}</div>
                        <div className="text-xs opacity-75 capitalize">{node.type}</div>
                      </div>
                    </div>
                    <div className="text-xs opacity-90 leading-relaxed">
                      {node.description}
                    </div>
                  </div>
                ))}
                
                {!currentWorkflow && (
                  <div className="absolute inset-0 flex items-center justify-center text-gray-500 dark:text-gray-400">
                    <div className="text-center">
                      <div className="text-6xl mb-4">🛠️</div>
                      <div className="text-xl mb-2">Start Building</div>
                      <div>Drag nodes from the palette to create your workflow</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {view === 'runs' && (
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
              Workflow Runs
            </h2>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="p-6">
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📊</div>
                  <div className="text-xl text-gray-900 dark:text-white mb-2">
                    Workflow Execution History
                  </div>
                  <div className="text-gray-600 dark:text-gray-400">
                    View and monitor your workflow executions
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}