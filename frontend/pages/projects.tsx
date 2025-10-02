import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Epic {
  id: string;
  title: string;
  description: string;
  status: 'planning' | 'in-progress' | 'review' | 'done';
  priority: 'critical' | 'high' | 'medium' | 'low';
  stories: Story[];
  assignedAgent: string;
  progress: number;
  dueDate: string;
  createdAt: string;
}

interface Story {
  id: string;
  epicId: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'code-review' | 'testing' | 'done';
  priority: 'critical' | 'high' | 'medium' | 'low';
  assignedAgent: string;
  storyPoints: number;
  tasks: Task[];
  createdAt: string;
}

interface Task {
  id: string;
  storyId: string;
  title: string;
  completed: boolean;
  assignedAgent: string;
}

export default function ProjectsPage() {
  const [epics, setEpics] = useState<Epic[]>([
    {
      id: 'EPIC-001',
      title: 'Authentication System Overhaul',
      description: 'Implement OAuth2.0, JWT tokens, and multi-factor authentication across all services',
      status: 'in-progress',
      priority: 'critical',
      assignedAgent: 'Messi',
      progress: 65,
      dueDate: '2025-11-15',
      createdAt: '2025-10-01',
      stories: [
        {
          id: 'STORY-001',
          epicId: 'EPIC-001',
          title: 'Implement OAuth2.0 Provider Integration',
          description: 'Integrate Google, GitHub, and Microsoft OAuth providers',
          status: 'in-progress',
          priority: 'critical',
          assignedAgent: 'Neymar',
          storyPoints: 8,
          createdAt: '2025-10-02',
          tasks: [
            { id: 'TASK-001', storyId: 'STORY-001', title: 'Setup OAuth apps', completed: true, assignedAgent: 'Neymar' },
            { id: 'TASK-002', storyId: 'STORY-001', title: 'Implement callback handlers', completed: true, assignedAgent: 'Neymar' },
            { id: 'TASK-003', storyId: 'STORY-001', title: 'Add token validation', completed: false, assignedAgent: 'Neymar' }
          ]
        },
        {
          id: 'STORY-002',
          epicId: 'EPIC-001',
          title: 'JWT Token Management',
          description: 'Create secure JWT generation, validation, and refresh logic',
          status: 'code-review',
          priority: 'high',
          assignedAgent: 'Ronaldo',
          storyPoints: 5,
          createdAt: '2025-10-03',
          tasks: [
            { id: 'TASK-004', storyId: 'STORY-002', title: 'Design token structure', completed: true, assignedAgent: 'Ronaldo' },
            { id: 'TASK-005', storyId: 'STORY-002', title: 'Implement signing/verification', completed: true, assignedAgent: 'Ronaldo' }
          ]
        }
      ]
    },
    {
      id: 'EPIC-002',
      title: 'Microservices Migration',
      description: 'Break monolith into containerized microservices with API gateway',
      status: 'planning',
      priority: 'high',
      assignedAgent: 'Ronaldo',
      progress: 25,
      dueDate: '2025-12-30',
      createdAt: '2025-10-01',
      stories: [
        {
          id: 'STORY-003',
          epicId: 'EPIC-002',
          title: 'Service Decomposition Analysis',
          description: 'Identify bounded contexts and service boundaries',
          status: 'in-progress',
          priority: 'high',
          assignedAgent: 'Ronaldo',
          storyPoints: 13,
          createdAt: '2025-10-03',
          tasks: [
            { id: 'TASK-006', storyId: 'STORY-003', title: 'Map domain models', completed: true, assignedAgent: 'Ronaldo' },
            { id: 'TASK-007', storyId: 'STORY-003', title: 'Define service contracts', completed: false, assignedAgent: 'Ronaldo' }
          ]
        }
      ]
    },
    {
      id: 'EPIC-003',
      title: 'Performance Optimization',
      description: 'Improve application response time by 50% through caching and query optimization',
      status: 'done',
      priority: 'medium',
      assignedAgent: 'Benzema',
      progress: 100,
      dueDate: '2025-10-25',
      createdAt: '2025-09-15',
      stories: []
    }
  ]);

  const [selectedEpic, setSelectedEpic] = useState<Epic | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [view, setView] = useState<'list' | 'kanban'>('list');

  const priorityColors = {
    critical: 'bg-red-500',
    high: 'bg-orange-500',
    medium: 'bg-yellow-500',
    low: 'bg-blue-500'
  };

  const statusColors = {
    planning: 'bg-slate-500',
    'in-progress': 'bg-blue-500',
    review: 'bg-purple-500',
    done: 'bg-emerald-500',
    todo: 'bg-slate-500',
    'code-review': 'bg-purple-500',
    testing: 'bg-yellow-500'
  };

  const agentAvatars = {
    Messi: '🏆',
    Ronaldo: '⚡',
    Neymar: '🎯',
    Mbappé: '🧪',
    Benzema: '🚀',
    Modric: '📊',
    Ramos: '🛡️'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="bg-slate-800/50 backdrop-blur-xl border-b border-slate-700/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard">
                <button className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors">
                  <svg className="w-6 h-6 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                </button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-white flex items-center">
                  <span className="mr-3">📋</span>
                  Project Management
                </h1>
                <p className="text-sm text-slate-400 mt-1">Epic → Story → Task workflow</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="flex bg-slate-700/50 rounded-lg p-1">
                <button
                  onClick={() => setView('list')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    view === 'list' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  📋 List
                </button>
                <button
                  onClick={() => setView('kanban')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    view === 'kanban' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  📊 Kanban
                </button>
              </div>
              
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors shadow-lg"
              >
                <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Create Epic
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {view === 'list' ? (
          <>
            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-xl p-6">
                <div className="text-3xl mb-2">📋</div>
                <div className="text-3xl font-bold text-white mb-1">{epics.length}</div>
                <div className="text-sm text-slate-400">Total Epics</div>
              </div>
              <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-xl p-6">
                <div className="text-3xl mb-2">📝</div>
                <div className="text-3xl font-bold text-white mb-1">
                  {epics.reduce((sum, epic) => sum + epic.stories.length, 0)}
                </div>
                <div className="text-sm text-slate-400">Active Stories</div>
              </div>
              <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-xl p-6">
                <div className="text-3xl mb-2">⚡</div>
                <div className="text-3xl font-bold text-white mb-1">
                  {epics.filter(e => e.status === 'in-progress').length}
                </div>
                <div className="text-sm text-slate-400">In Progress</div>
              </div>
              <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-xl p-6">
                <div className="text-3xl mb-2">✅</div>
                <div className="text-3xl font-bold text-emerald-400 mb-1">
                  {Math.round(epics.reduce((sum, epic) => sum + epic.progress, 0) / epics.length)}%
                </div>
                <div className="text-sm text-slate-400">Overall Progress</div>
              </div>
            </div>

            {/* Epics List */}
            <div className="space-y-4">
              {epics.map((epic) => (
                <div
                  key={epic.id}
                  className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-xl p-6 hover:border-blue-500/50 transition-all cursor-pointer"
                  onClick={() => setSelectedEpic(epic)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className="text-sm font-mono text-slate-400">{epic.id}</span>
                        <span className={`px-2 py-1 ${priorityColors[epic.priority]} text-white text-xs font-bold rounded`}>
                          {epic.priority.toUpperCase()}
                        </span>
                        <span className={`px-2 py-1 ${statusColors[epic.status]} text-white text-xs font-bold rounded`}>
                          {epic.status.replace('-', ' ').toUpperCase()}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-white mb-2">{epic.title}</h3>
                      <p className="text-sm text-slate-400 mb-4">{epic.description}</p>
                      
                      {/* Progress Bar */}
                      <div className="mb-4">
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-slate-400">Progress</span>
                          <span className="text-white font-bold">{epic.progress}%</span>
                        </div>
                        <div className="w-full bg-slate-700 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-blue-500 to-emerald-500 h-2 rounded-full transition-all"
                            style={{ width: `${epic.progress}%` }}
                          />
                        </div>
                      </div>

                      {/* Stories Summary */}
                      <div className="flex items-center space-x-6 text-sm">
                        <div className="flex items-center space-x-2">
                          <span className="text-slate-400">📝 Stories:</span>
                          <span className="text-white font-bold">{epic.stories.length}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-slate-400">📅 Due:</span>
                          <span className="text-white">{new Date(epic.dueDate).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-slate-400">👤 Lead:</span>
                          <span className="text-white font-bold">
                            {agentAvatars[epic.assignedAgent as keyof typeof agentAvatars]} {epic.assignedAgent}
                          </span>
                        </div>
                      </div>
                    </div>

                    <button className="ml-4 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                      View Details →
                    </button>
                  </div>

                  {/* Story Pills */}
                  {epic.stories.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-4 border-t border-slate-700">
                      {epic.stories.map((story) => (
                        <div
                          key={story.id}
                          className="px-3 py-1 bg-slate-700/50 border border-slate-600 rounded-full text-xs text-slate-300 hover:border-blue-500/50 transition-all"
                        >
                          {story.id}: {story.title}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        ) : (
          /* Kanban Board View */
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {['planning', 'in-progress', 'review', 'done'].map((status) => (
              <div key={status} className="bg-slate-800/30 backdrop-blur-xl border border-slate-700/50 rounded-xl p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-white uppercase text-sm">
                    {status.replace('-', ' ')}
                  </h3>
                  <span className="px-2 py-1 bg-slate-700 text-white text-xs font-bold rounded">
                    {epics.filter(e => e.status === status).length}
                  </span>
                </div>
                
                <div className="space-y-3">
                  {epics
                    .filter(epic => epic.status === status)
                    .map((epic) => (
                      <div
                        key={epic.id}
                        className="bg-slate-700/50 border border-slate-600 rounded-lg p-4 hover:border-blue-500/50 transition-all cursor-pointer"
                        onClick={() => setSelectedEpic(epic)}
                      >
                        <div className={`w-1 h-1 ${priorityColors[epic.priority]} rounded-full mb-2`} />
                        <h4 className="font-bold text-white text-sm mb-2">{epic.title}</h4>
                        <p className="text-xs text-slate-400 mb-3 line-clamp-2">{epic.description}</p>
                        
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-400">
                            {agentAvatars[epic.assignedAgent as keyof typeof agentAvatars]} {epic.assignedAgent}
                          </span>
                          <span className="text-white font-bold">{epic.progress}%</span>
                        </div>
                        
                        <div className="w-full bg-slate-600 rounded-full h-1 mt-2">
                          <div
                            className="bg-blue-500 h-1 rounded-full"
                            style={{ width: `${epic.progress}%` }}
                          />
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Epic Detail Modal */}
      {selectedEpic && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-6">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-slate-800 border-b border-slate-700 p-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white">{selectedEpic.title}</h2>
                <p className="text-sm text-slate-400 mt-1">{selectedEpic.id}</p>
              </div>
              <button
                onClick={() => setSelectedEpic(null)}
                className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
              >
                <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6">
              <p className="text-slate-300 mb-6">{selectedEpic.description}</p>

              <h3 className="text-lg font-bold text-white mb-4">Stories ({selectedEpic.stories.length})</h3>
              <div className="space-y-4">
                {selectedEpic.stories.map((story) => (
                  <div key={story.id} className="bg-slate-700/50 border border-slate-600 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="text-sm font-mono text-slate-400">{story.id}</span>
                          <span className={`px-2 py-1 ${statusColors[story.status]} text-white text-xs font-bold rounded`}>
                            {story.status.toUpperCase()}
                          </span>
                        </div>
                        <h4 className="font-bold text-white">{story.title}</h4>
                        <p className="text-sm text-slate-400 mt-1">{story.description}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-slate-400">Story Points</div>
                        <div className="text-2xl font-bold text-white">{story.storyPoints}</div>
                      </div>
                    </div>

                    {/* Tasks */}
                    <div className="mt-4 space-y-2">
                      {story.tasks.map((task) => (
                        <div key={task.id} className="flex items-center space-x-3 text-sm">
                          <input
                            type="checkbox"
                            checked={task.completed}
                            className="w-4 h-4"
                            readOnly
                          />
                          <span className={task.completed ? 'text-slate-500 line-through' : 'text-slate-300'}>
                            {task.title}
                          </span>
                          <span className="text-slate-400 text-xs ml-auto">
                            {agentAvatars[task.assignedAgent as keyof typeof agentAvatars]} {task.assignedAgent}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
