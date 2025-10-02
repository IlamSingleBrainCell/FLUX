import React, { useState } from 'react';

interface Template {
  id: string;
  name: string;
  description: string;
  category: 'sprint' | 'code-review' | 'deployment' | 'planning' | 'debugging';
  icon: string;
  commands: string[];
  workflow: string[];
}

export const TemplatesAndSnippets: React.FC = () => {
  const [templates] = useState<Template[]>([
    {
      id: '1',
      name: 'Start Sprint Planning',
      description: 'Initiate sprint planning with AI agents',
      category: 'sprint',
      icon: '🏃‍♂️',
      commands: [
        'Call Marcus to review backlog',
        'Ask Sarah to estimate technical complexity',
        'Get Alex to identify dependencies',
        'Have Jordan plan sprint goals'
      ],
      workflow: ['Project Manager', 'Software Architect', 'DevOps Engineer']
    },
    {
      id: '2',
      name: 'Conduct Code Review',
      description: 'Comprehensive code review workflow',
      category: 'code-review',
      icon: '🔍',
      commands: [
        'Run automated code analysis',
        'Call Sarah for architecture review',
        'Ask Casey for security audit',
        'Get Riley to review test coverage'
      ],
      workflow: ['Developer Agent', 'Security Expert', 'QA Tester']
    },
    {
      id: '3',
      name: 'Deploy to Production',
      description: 'Safe production deployment checklist',
      category: 'deployment',
      icon: '🚀',
      commands: [
        'Call Alex to review deployment pipeline',
        'Ask Riley to run final tests',
        'Get Casey to verify security configurations',
        'Have Marcus approve go-live'
      ],
      workflow: ['DevOps Engineer', 'QA Tester', 'Security Expert', 'Project Manager']
    },
    {
      id: '4',
      name: 'Debug Production Issue',
      description: 'Rapid incident response workflow',
      category: 'debugging',
      icon: '🐛',
      commands: [
        'Call Sarah to analyze error logs',
        'Ask Alex to check infrastructure',
        'Get Riley to reproduce issue',
        'Have Taylor review recent deployments'
      ],
      workflow: ['Developer Agent', 'DevOps Engineer', 'QA Tester']
    },
    {
      id: '5',
      name: 'Architecture Review',
      description: 'System design and architecture discussion',
      category: 'planning',
      icon: '🏗️',
      commands: [
        'Call Sarah to present architecture',
        'Ask Casey about security implications',
        'Get Alex for scalability review',
        'Have Marcus evaluate business alignment'
      ],
      workflow: ['Software Architect', 'Security Expert', 'DevOps Engineer', 'Project Manager']
    },
    {
      id: '6',
      name: 'Generate API Documentation',
      description: 'Automated API docs generation',
      category: 'code-review',
      icon: '📚',
      commands: [
        'Analyze codebase structure',
        'Extract API endpoints',
        'Generate OpenAPI spec',
        'Create usage examples'
      ],
      workflow: ['Developer Agent', 'Software Architect']
    }
  ]);

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { value: 'all', label: 'All Templates', icon: '📋' },
    { value: 'sprint', label: 'Sprint Planning', icon: '🏃‍♂️' },
    { value: 'code-review', label: 'Code Review', icon: '🔍' },
    { value: 'deployment', label: 'Deployment', icon: '🚀' },
    { value: 'planning', label: 'Planning', icon: '🏗️' },
    { value: 'debugging', label: 'Debugging', icon: '🐛' }
  ];

  const filteredTemplates = templates.filter(template => {
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const executeTemplate = (template: Template) => {
    alert(`Executing template: ${template.name}\n\nWorkflow:\n${template.commands.join('\n')}`);
  };

  const saveCustomTemplate = () => {
    alert('Custom template builder coming soon!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50 dark:from-gray-900 dark:to-purple-950 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                🎯 Templates & Snippets
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Reusable workflows and conversation templates
              </p>
            </div>
            <button
              onClick={saveCustomTemplate}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition"
            >
              ➕ Create Custom Template
            </button>
          </div>

          {/* Search and Filter */}
          <div className="flex gap-4">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search templates..."
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              {categories.map(cat => (
                <option key={cat.value} value={cat.value}>
                  {cat.icon} {cat.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map(template => (
            <div
              key={template.id}
              className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-xl transition"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="text-4xl">{template.icon}</div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  template.category === 'sprint'
                    ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                    : template.category === 'code-review'
                    ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
                    : template.category === 'deployment'
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                    : template.category === 'planning'
                    ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300'
                    : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                }`}>
                  {template.category}
                </span>
              </div>

              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                {template.name}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                {template.description}
              </p>

              <div className="mb-4">
                <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">Workflow Steps:</p>
                <div className="space-y-1">
                  {template.commands.slice(0, 3).map((cmd, idx) => (
                    <div key={idx} className="text-xs text-gray-600 dark:text-gray-400 flex items-start gap-2">
                      <span className="text-blue-600 dark:text-blue-400 font-bold">{idx + 1}.</span>
                      <span>{cmd}</span>
                    </div>
                  ))}
                  {template.commands.length > 3 && (
                    <p className="text-xs text-gray-500 dark:text-gray-500 italic">
                      +{template.commands.length - 3} more steps
                    </p>
                  )}
                </div>
              </div>

              <div className="mb-4">
                <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">Agents Involved:</p>
                <div className="flex flex-wrap gap-2">
                  {template.workflow.map((agent, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-xs"
                    >
                      {agent}
                    </span>
                  ))}
                </div>
              </div>

              <button
                onClick={() => executeTemplate(template)}
                className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition"
              >
                ▶️ Execute Template
              </button>
            </div>
          ))}
        </div>

        {filteredTemplates.length === 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-12 text-center">
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              No templates found matching your search.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
