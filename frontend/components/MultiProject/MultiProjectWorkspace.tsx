import React, { useState } from 'react';

interface Project {
  id: string;
  name: string;
  description: string;
  color: string;
  lastActivity: Date;
  team: string[];
  status: 'active' | 'archived' | 'planning';
  progress: number;
}

export const MultiProjectWorkspace: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([
    {
      id: '1',
      name: 'E-Commerce Platform',
      description: 'Next.js storefront with Stripe integration',
      color: 'from-blue-500 to-cyan-500',
      lastActivity: new Date(),
      team: ['Marcus', 'Sarah', 'Alex'],
      status: 'active',
      progress: 67
    },
    {
      id: '2',
      name: 'Mobile App Backend',
      description: 'REST API with GraphQL layer',
      color: 'from-purple-500 to-pink-500',
      lastActivity: new Date(Date.now() - 86400000),
      team: ['Jordan', 'Riley'],
      status: 'active',
      progress: 45
    },
    {
      id: '3',
      name: 'AI Dashboard',
      description: 'Real-time analytics and insights',
      color: 'from-green-500 to-emerald-500',
      lastActivity: new Date(Date.now() - 259200000),
      team: ['Taylor', 'Casey', 'Sarah'],
      status: 'active',
      progress: 82
    },
    {
      id: '4',
      name: 'Analytics Engine',
      description: 'Data pipeline and processing',
      color: 'from-orange-500 to-yellow-500',
      lastActivity: new Date(Date.now() - 604800000),
      team: ['Alex', 'Marcus'],
      status: 'planning',
      progress: 15
    }
  ]);

  const [currentProject, setCurrentProject] = useState<Project | null>(projects[0]);
  const [view, setView] = useState<'grid' | 'list' | 'portfolio'>('grid');

  const createNewProject = () => {
    alert('Project creation wizard coming soon!');
  };

  const switchProject = (project: Project) => {
    setCurrentProject(project);
    // In a real implementation, this would preserve context and switch workspaces
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-950 p-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              🗂️ Multi-Project Workspace
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage multiple projects with context preservation
            </p>
          </div>
          <div className="flex gap-3">
            <div className="flex gap-2 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
              <button
                onClick={() => setView('grid')}
                className={`px-4 py-2 rounded-lg transition ${
                  view === 'grid' ? 'bg-white dark:bg-gray-600 shadow' : ''
                }`}
              >
                📊 Grid
              </button>
              <button
                onClick={() => setView('list')}
                className={`px-4 py-2 rounded-lg transition ${
                  view === 'list' ? 'bg-white dark:bg-gray-600 shadow' : ''
                }`}
              >
                📋 List
              </button>
              <button
                onClick={() => setView('portfolio')}
                className={`px-4 py-2 rounded-lg transition ${
                  view === 'portfolio' ? 'bg-white dark:bg-gray-600 shadow' : ''
                }`}
              >
                📈 Portfolio
              </button>
            </div>
            <button
              onClick={createNewProject}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              ➕ New Project
            </button>
          </div>
        </div>

        {/* Current Project Badge */}
        {currentProject && (
          <div className={`bg-gradient-to-r ${currentProject.color} rounded-lg p-4 text-white`}>
            <p className="text-sm font-medium mb-1">Currently Active:</p>
            <p className="text-2xl font-bold">{currentProject.name}</p>
          </div>
        )}
      </div>

      {/* Projects Grid/List View */}
      {view !== 'portfolio' && (
        <div className={view === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
          {projects.map(project => (
            <div
              key={project.id}
              onClick={() => switchProject(project)}
              className={`bg-white dark:bg-gray-800 rounded-xl border-2 ${
                currentProject?.id === project.id
                  ? 'border-blue-500'
                  : 'border-gray-200 dark:border-gray-700'
              } p-6 cursor-pointer hover:shadow-lg transition`}
            >
              <div className={`bg-gradient-to-r ${project.color} rounded-lg p-4 mb-4`}>
                <h3 className="text-xl font-bold text-white">{project.name}</h3>
              </div>

              <p className="text-gray-600 dark:text-gray-400 mb-4">{project.description}</p>

              <div className="mb-4">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600 dark:text-gray-400">Progress</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{project.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all"
                    style={{ width: `${project.progress}%` }}
                  ></div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex -space-x-2">
                  {project.team.slice(0, 3).map((member, idx) => (
                    <div
                      key={idx}
                      className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 border-2 border-white dark:border-gray-800 flex items-center justify-center text-white text-xs font-bold"
                    >
                      {member[0]}
                    </div>
                  ))}
                  {project.team.length > 3 && (
                    <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600 border-2 border-white dark:border-gray-800 flex items-center justify-center text-gray-700 dark:text-gray-300 text-xs font-bold">
                      +{project.team.length - 3}
                    </div>
                  )}
                </div>

                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  project.status === 'active'
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                    : project.status === 'planning'
                    ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}>
                  {project.status}
                </span>
              </div>

              <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">
                Last activity: {project.lastActivity.toRelativeDateString()}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Portfolio View */}
      {view === 'portfolio' && (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Portfolio Dashboard</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
              <p className="text-sm opacity-80 mb-2">Total Projects</p>
              <p className="text-4xl font-bold">{projects.length}</p>
            </div>
            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white">
              <p className="text-sm opacity-80 mb-2">Active Projects</p>
              <p className="text-4xl font-bold">{projects.filter(p => p.status === 'active').length}</p>
            </div>
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white">
              <p className="text-sm opacity-80 mb-2">Team Members</p>
              <p className="text-4xl font-bold">{new Set(projects.flatMap(p => p.team)).size}</p>
            </div>
            <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white">
              <p className="text-sm opacity-80 mb-2">Avg Progress</p>
              <p className="text-4xl font-bold">
                {Math.round(projects.reduce((acc, p) => acc + p.progress, 0) / projects.length)}%
              </p>
            </div>
          </div>

          {/* Project Timeline */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Project Timeline</h3>
            {projects.map(project => (
              <div key={project.id} className="flex items-center gap-4">
                <div className={`bg-gradient-to-r ${project.color} rounded-lg p-3 text-white font-bold min-w-[200px]`}>
                  {project.name}
                </div>
                <div className="flex-1">
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-6 relative">
                    <div
                      className={`bg-gradient-to-r ${project.color} h-6 rounded-full flex items-center justify-end px-3 text-white text-sm font-semibold`}
                      style={{ width: `${project.progress}%` }}
                    >
                      {project.progress}%
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Helper to format relative dates
declare global {
  interface Date {
    toRelativeDateString(): string;
  }
}

Date.prototype.toRelativeDateString = function() {
  const now = new Date();
  const diffMs = now.getTime() - this.getTime();
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  return `${Math.floor(diffDays / 30)} months ago`;
};
