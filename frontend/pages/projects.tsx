// Projects Page - Epic/Story/Task Management with Kanban & List Views
import { useState } from 'react';
import Head from 'next/head';
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
      stories: []
    }
  ]);

  const [selectedEpic, setSelectedEpic] = useState<Epic | null>(null);
  const [view, setView] = useState<'list' | 'kanban'>('list');

  const kanbanColumns = [
    { id: 'planning', title: 'Planning', count: epics.filter(e => e.status === 'planning').length },
    { id: 'in-progress', title: 'In Progress', count: epics.filter(e => e.status === 'in-progress').length },
    { id: 'review', title: 'Review', count: epics.filter(e => e.status === 'review').length },
    { id: 'done', title: 'Done', count: epics.filter(e => e.status === 'done').length },
  ];

  const totalStories = epics.reduce((sum, epic) => sum + epic.stories.length, 0);
  const avgProgress = Math.round(epics.reduce((sum, epic) => sum + epic.progress, 0) / epics.length);

  return (
    <>
      <Head>
        <title>Project Management - FLUX Enterprise</title>
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        {/* Header */}
        <div className="bg-slate-900/95 backdrop-blur-xl border-b border-slate-700/50 sticky top-0 z-50 shadow-2xl">
          <div className="max-w-[1800px] mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="bg-gradient-to-r from-blue-600 to-cyan-500 p-3 rounded-xl shadow-lg">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white">FLUX Enterprise</h1>
                  <p className="text-sm text-slate-400">Project Management</p>
                </div>
              </div>

              <nav className="flex space-x-2">
                <Link href="/dashboard" className="px-4 py-2 bg-slate-700 text-slate-300 rounded-lg text-sm font-medium hover:bg-slate-600 transition-colors">
                  Dashboard
                </Link>
                <Link href="/projects" className="px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-lg text-sm font-medium shadow-lg">
                  Projects
                </Link>
                <Link href="/workspace" className="px-4 py-2 bg-slate-700 text-slate-300 rounded-lg text-sm font-medium hover:bg-slate-600 transition-colors">
                  AI Workspace
                </Link>
                <Link href="/analytics" className="px-4 py-2 bg-slate-700 text-slate-300 rounded-lg text-sm font-medium hover:bg-slate-600 transition-colors">
                  Analytics
                </Link>
                <Link href="/integrations" className="px-4 py-2 bg-slate-700 text-slate-300 rounded-lg text-sm font-medium hover:bg-slate-600 transition-colors">
                  Integrations
                </Link>
                <Link href="/settings" className="px-4 py-2 bg-slate-700 text-slate-300 rounded-lg text-sm font-medium hover:bg-slate-600 transition-colors">
                  Settings
                </Link>
              </nav>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-[1800px] mx-auto px-6 py-6 space-y-6">
          {/* Header with Stats & View Toggle */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div>
                <h2 className="text-2xl font-bold text-white">Project Management</h2>
                <p className="text-slate-400">Epic → Story → Task workflow</p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="px-4 py-2 bg-slate-800/50 rounded-lg border border-slate-700">
                  <span className="text-sm text-slate-400">Total Epics</span>
                  <p className="text-xl font-bold text-white">{epics.length}</p>
                </div>
                <div className="px-4 py-2 bg-slate-800/50 rounded-lg border border-slate-700">
                  <span className="text-sm text-slate-400">Active Stories</span>
                  <p className="text-xl font-bold text-white">{totalStories}</p>
                </div>
                <div className="px-4 py-2 bg-slate-800/50 rounded-lg border border-slate-700">
                  <span className="text-sm text-slate-400">In Progress</span>
                  <p className="text-xl font-bold text-white">{kanbanColumns[1].count}</p>
                </div>
                <div className="px-4 py-2 bg-slate-800/50 rounded-lg border border-slate-700">
                  <span className="text-sm text-slate-400">Overall Progress</span>
                  <p className="text-xl font-bold text-white">{avgProgress}%</p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2 bg-slate-800 rounded-lg p-1">
                <button
                  onClick={() => setView('list')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    view === 'list'
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  📋 List
                </button>
                <button
                  onClick={() => setView('kanban')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    view === 'kanban'
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  📊 Kanban
                </button>
              </div>
              <button className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all">
                + Create Epic
              </button>
            </div>
          </div>

          {/* List View */}
          {view === 'list' && (
            <div className="space-y-4">
              {epics.map(epic => (
                <div
                  key={epic.id}
                  onClick={() => setSelectedEpic(epic)}
                  className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50 hover:border-blue-500/50 transition-all cursor-pointer hover:shadow-2xl"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className="px-3 py-1 bg-slate-700 text-slate-300 rounded-lg text-xs font-mono">
                          {epic.id}
                        </span>
                        <span className={`px-3 py-1 rounded-lg text-xs font-bold ${
                          epic.priority === 'critical' ? 'bg-red-500/20 text-red-400' :
                          epic.priority === 'high' ? 'bg-orange-500/20 text-orange-400' :
                          epic.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-blue-500/20 text-blue-400'
                        }`}>
                          {epic.priority.toUpperCase()}
                        </span>
                        <span className={`px-3 py-1 rounded-lg text-xs font-bold ${
                          epic.status === 'planning' ? 'bg-slate-500/20 text-slate-400' :
                          epic.status === 'in-progress' ? 'bg-blue-500/20 text-blue-400' :
                          epic.status === 'review' ? 'bg-purple-500/20 text-purple-400' :
                          'bg-green-500/20 text-green-400'
                        }`}>
                          {epic.status.replace('-', ' ').toUpperCase()}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-white mb-2">{epic.title}</h3>
                      <p className="text-slate-400 text-sm mb-4">{epic.description}</p>
                      <div className="flex items-center space-x-6 text-sm">
                        <div className="flex items-center space-x-2">
                          <span className="text-slate-400">Assignee:</span>
                          <span className="text-white font-semibold">{epic.assignedAgent}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-slate-400">Stories:</span>
                          <span className="text-white font-semibold">{epic.stories.length}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-slate-400">Due:</span>
                          <span className="text-white font-semibold">{epic.dueDate}</span>
                        </div>
                      </div>
                    </div>
                    <div className="ml-6 w-32">
                      <div className="text-sm text-slate-400 mb-2">Progress</div>
                      <div className="text-3xl font-bold text-white mb-2">{epic.progress}%</div>
                      <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full transition-all"
                          style={{ width: `${epic.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  {epic.stories.length > 0 && (
                    <div className="pt-4 border-t border-slate-700">
                      <div className="text-sm font-semibold text-slate-400 mb-3">Stories ({epic.stories.length})</div>
                      <div className="space-y-2">
                        {epic.stories.slice(0, 2).map(story => (
                          <div key={story.id} className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                            <div className="flex items-center space-x-3">
                              <span className="text-xs font-mono text-slate-400">{story.id}</span>
                              <span className="text-white font-medium">{story.title}</span>
                            </div>
                            <div className="flex items-center space-x-3">
                              <span className="text-xs text-slate-400">{story.assignedAgent}</span>
                              <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs font-bold">
                                {story.storyPoints} pts
                              </span>
                            </div>
                          </div>
                        ))}
                        {epic.stories.length > 2 && (
                          <div className="text-xs text-slate-500 text-center py-2">
                            +{epic.stories.length - 2} more stories
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Kanban View */}
          {view === 'kanban' && (
            <div className="grid grid-cols-4 gap-6">
              {kanbanColumns.map(column => (
                <div key={column.id} className="space-y-4">
                  <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-4 border border-slate-700/50">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-bold text-white uppercase tracking-wider">{column.title}</h3>
                      <span className="px-2 py-1 bg-slate-700 text-slate-300 rounded text-xs font-bold">
                        {column.count}
                      </span>
                    </div>
                  </div>

                  {epics
                    .filter(epic => epic.status === column.id)
                    .map(epic => (
                      <div
                        key={epic.id}
                        onClick={() => setSelectedEpic(epic)}
                        className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-4 border border-slate-700/50 hover:border-blue-500/50 transition-all cursor-pointer hover:shadow-xl"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-xs font-mono text-slate-400">{epic.id}</span>
                          <span className={`px-2 py-1 rounded text-xs font-bold ${
                            epic.priority === 'critical' ? 'bg-red-500/20 text-red-400' :
                            epic.priority === 'high' ? 'bg-orange-500/20 text-orange-400' :
                            epic.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-blue-500/20 text-blue-400'
                          }`}>
                            {epic.priority.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <h4 className="text-white font-semibold mb-2 line-clamp-2">{epic.title}</h4>
                        <p className="text-xs text-slate-400 mb-3 line-clamp-2">{epic.description}</p>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-400">{epic.assignedAgent}</span>
                          <span className="text-blue-400 font-semibold">{epic.stories.length} stories</span>
                        </div>
                        <div className="mt-3">
                          <div className="flex items-center justify-between text-xs mb-1">
                            <span className="text-slate-400">Progress</span>
                            <span className="text-white font-bold">{epic.progress}%</span>
                          </div>
                          <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full"
                              style={{ width: `${epic.progress}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Epic Details Modal */}
        {selectedEpic && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-6">
            <div className="bg-slate-800 rounded-2xl p-8 max-w-4xl w-full border border-slate-700 shadow-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="px-3 py-1 bg-slate-700 text-slate-300 rounded-lg text-sm font-mono">
                      {selectedEpic.id}
                    </span>
                    <span className={`px-3 py-1 rounded-lg text-sm font-bold ${
                      selectedEpic.priority === 'critical' ? 'bg-red-500/20 text-red-400' :
                      selectedEpic.priority === 'high' ? 'bg-orange-500/20 text-orange-400' :
                      selectedEpic.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-blue-500/20 text-blue-400'
                    }`}>
                      {selectedEpic.priority.toUpperCase()}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-white">{selectedEpic.title}</h3>
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

              <p className="text-slate-300 mb-6">{selectedEpic.description}</p>

              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-slate-700/50 rounded-lg p-4">
                  <div className="text-sm text-slate-400 mb-1">Assignee</div>
                  <div className="text-lg font-bold text-white">{selectedEpic.assignedAgent}</div>
                </div>
                <div className="bg-slate-700/50 rounded-lg p-4">
                  <div className="text-sm text-slate-400 mb-1">Due Date</div>
                  <div className="text-lg font-bold text-white">{selectedEpic.dueDate}</div>
                </div>
                <div className="bg-slate-700/50 rounded-lg p-4">
                  <div className="text-sm text-slate-400 mb-1">Progress</div>
                  <div className="text-lg font-bold text-white">{selectedEpic.progress}%</div>
                </div>
              </div>

              <div className="mb-6">
                <h4 className="text-lg font-bold text-white mb-4">Stories ({selectedEpic.stories.length})</h4>
                <div className="space-y-3">
                  {selectedEpic.stories.map(story => (
                    <div key={story.id} className="p-4 bg-slate-700/30 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-mono text-slate-400">{story.id}</span>
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 rounded text-xs font-bold ${
                            story.status === 'done' ? 'bg-green-500/20 text-green-400' :
                            story.status === 'in-progress' ? 'bg-blue-500/20 text-blue-400' :
                            'bg-slate-500/20 text-slate-400'
                          }`}>
                            {story.status.toUpperCase()}
                          </span>
                          <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs font-bold">
                            {story.storyPoints} pts
                          </span>
                        </div>
                      </div>
                      <h5 className="text-white font-semibold mb-1">{story.title}</h5>
                      <p className="text-sm text-slate-400 mb-2">{story.description}</p>
                      <div className="text-xs text-slate-500">Assigned to: {story.assignedAgent}</div>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => setSelectedEpic(null)}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
