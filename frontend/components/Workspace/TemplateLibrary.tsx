// components/Workspace/TemplateLibrary.tsx - Prompt Template Library
import React, { useState } from 'react';

interface PromptTemplate {
  id: string;
  title: string;
  description: string;
  template: string;
  category: string;
  variables?: string[];
  icon: string;
  popular?: boolean;
}

interface TemplateLibraryProps {
  onSelectTemplate: (template: string) => void;
  onClose: () => void;
  isOpen: boolean;
}

export const TemplateLibrary: React.FC<TemplateLibraryProps> = ({
  onSelectTemplate,
  onClose,
  isOpen
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [customTemplates, setCustomTemplates] = useState<PromptTemplate[]>([]);
  const [showCreateTemplate, setShowCreateTemplate] = useState(false);

  const builtInTemplates: PromptTemplate[] = [
    {
      id: 'code-review',
      title: 'Code Review',
      description: 'Comprehensive code review with best practices',
      template: 'Please review this code for:\n- Code quality and readability\n- Performance optimizations\n- Security vulnerabilities\n- Best practices\n- Potential bugs\n\n```\n[YOUR CODE HERE]\n```',
      category: 'Code Review',
      icon: '🔍',
      popular: true
    },
    {
      id: 'debug-error',
      title: 'Debug Error',
      description: 'Debug and fix errors with detailed explanation',
      template: 'I\'m getting this error:\n```\n[ERROR MESSAGE]\n```\n\nIn this code:\n```\n[YOUR CODE]\n```\n\nPlease help me:\n1. Understand what\'s causing the error\n2. Fix the issue\n3. Explain how to prevent it in the future',
      category: 'Debugging',
      icon: '🐛',
      popular: true
    },
    {
      id: 'optimize-performance',
      title: 'Performance Optimization',
      description: 'Optimize code for better performance',
      template: 'Please optimize this code for performance:\n\n```\n[YOUR CODE]\n```\n\nFocus on:\n- Time complexity\n- Memory usage\n- Algorithmic efficiency\n- Caching opportunities',
      category: 'Optimization',
      icon: '⚡',
      popular: true
    },
    {
      id: 'write-tests',
      title: 'Unit Tests',
      description: 'Generate comprehensive unit tests',
      template: 'Write unit tests for this code:\n\n```\n[YOUR CODE]\n```\n\nInclude:\n- Happy path tests\n- Edge cases\n- Error handling\n- 100% code coverage',
      category: 'Testing',
      icon: '🧪',
      popular: true
    },
    {
      id: 'api-design',
      title: 'REST API Design',
      description: 'Design a RESTful API',
      template: 'Design a REST API for [FEATURE/RESOURCE] with:\n- Proper HTTP methods\n- Endpoint structure\n- Request/Response schemas\n- Authentication\n- Error handling\n- Rate limiting',
      category: 'Architecture',
      icon: '🔌',
      popular: false
    },
    {
      id: 'database-schema',
      title: 'Database Schema',
      description: 'Design database schema',
      template: 'Design a database schema for [YOUR SYSTEM]:\n- Tables and relationships\n- Indexes for performance\n- Constraints and validations\n- Migration strategy\n- Sample queries',
      category: 'Architecture',
      icon: '🗄️',
      popular: false
    },
    {
      id: 'security-audit',
      title: 'Security Audit',
      description: 'Security vulnerability assessment',
      template: 'Perform a security audit on this code:\n\n```\n[YOUR CODE]\n```\n\nCheck for:\n- SQL injection\n- XSS vulnerabilities\n- CSRF protection\n- Authentication issues\n- Data exposure\n- Input validation',
      category: 'Security',
      icon: '🔒',
      popular: false
    },
    {
      id: 'documentation',
      title: 'Documentation',
      description: 'Generate comprehensive documentation',
      template: 'Generate documentation for this code:\n\n```\n[YOUR CODE]\n```\n\nInclude:\n- Overview and purpose\n- Parameter descriptions\n- Return values\n- Usage examples\n- Edge cases',
      category: 'Documentation',
      icon: '📚',
      popular: false
    },
    {
      id: 'refactor',
      title: 'Refactor Code',
      description: 'Refactor for better maintainability',
      template: 'Refactor this code to improve:\n\n```\n[YOUR CODE]\n```\n\n- Readability\n- Maintainability\n- Following SOLID principles\n- Design patterns\n- Code reusability',
      category: 'Refactoring',
      icon: '♻️',
      popular: false
    },
    {
      id: 'algorithm-explain',
      title: 'Explain Algorithm',
      description: 'Explain algorithm step by step',
      template: 'Explain this algorithm:\n\n```\n[YOUR CODE]\n```\n\n- Step-by-step walkthrough\n- Time complexity analysis\n- Space complexity\n- Use cases\n- Alternative approaches',
      category: 'Learning',
      icon: '🎓',
      popular: false
    }
  ];

  const categories = ['all', ...Array.from(new Set(builtInTemplates.map(t => t.category)))];

  const allTemplates = [...builtInTemplates, ...customTemplates];
  
  const filteredTemplates = allTemplates.filter(template => {
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    const matchesSearch = template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const popularTemplates = allTemplates.filter(t => t.popular);

  const handleSelectTemplate = (template: PromptTemplate) => {
    onSelectTemplate(template.template);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center"
        onClick={onClose}
      >
        {/* Modal */}
        <div
          className="bg-white rounded-xl shadow-2xl max-w-4xl w-full mx-4 max-h-[85vh] overflow-hidden flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">📚 Prompt Templates</h2>
                  <p className="text-white/80 text-sm">Ready-to-use prompts for common tasks</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Search */}
            <div className="mt-4 relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search templates..."
                className="w-full px-4 py-3 pl-12 rounded-lg bg-white/20 backdrop-blur-sm border-2 border-white/30 text-white placeholder-white/60 focus:outline-none focus:border-white/50"
              />
              <svg className="w-5 h-5 absolute left-4 top-3.5 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* Categories */}
          <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
            <div className="flex gap-2 overflow-x-auto pb-2">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                    selectedCategory === category
                      ? 'bg-indigo-600 text-white'
                      : 'bg-white text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {category === 'all' ? '📋 All' : category}
                </button>
              ))}
            </div>
          </div>

          {/* Popular Templates (when all is selected) */}
          {selectedCategory === 'all' && !searchQuery && popularTemplates.length > 0 && (
            <div className="px-6 py-4 border-b border-slate-200">
              <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                <span>🔥</span> Popular Templates
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {popularTemplates.map(template => (
                  <button
                    key={template.id}
                    onClick={() => handleSelectTemplate(template)}
                    className="p-3 bg-gradient-to-br from-orange-50 to-red-50 hover:from-orange-100 hover:to-red-100 rounded-lg text-left transition-all border border-orange-200 hover:border-orange-300 group"
                  >
                    <div className="flex items-start gap-2">
                      <span className="text-2xl group-hover:scale-110 transition-transform">{template.icon}</span>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-slate-900 text-sm truncate">{template.title}</h4>
                        <p className="text-xs text-slate-600 line-clamp-2">{template.description}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Templates Grid */}
          <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
            <div className="grid grid-cols-2 gap-4">
              {filteredTemplates.map(template => (
                <button
                  key={template.id}
                  onClick={() => handleSelectTemplate(template)}
                  className="p-4 bg-white hover:bg-slate-50 rounded-lg border-2 border-slate-200 hover:border-indigo-300 text-left transition-all group"
                >
                  <div className="flex items-start gap-3">
                    <span className="text-3xl group-hover:scale-110 transition-transform">{template.icon}</span>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-slate-900 mb-1 flex items-center gap-2">
                        {template.title}
                        {template.popular && (
                          <span className="px-2 py-0.5 bg-orange-100 text-orange-700 text-xs rounded-full font-medium">
                            Popular
                          </span>
                        )}
                      </h4>
                      <p className="text-sm text-slate-600 mb-2">{template.description}</p>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded font-medium">
                          {template.category}
                        </span>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {filteredTemplates.length === 0 && (
              <div className="text-center py-12">
                <svg className="w-16 h-16 mx-auto text-slate-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-slate-600 font-medium">No templates found</p>
                <p className="text-sm text-slate-400">Try a different search or category</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
            <p className="text-xs text-slate-500">
              {filteredTemplates.length} template{filteredTemplates.length !== 1 ? 's' : ''} available
            </p>
            <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create Custom Template
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
