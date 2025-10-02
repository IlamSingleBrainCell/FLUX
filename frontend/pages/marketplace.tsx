// AI Agent Marketplace - Browse, Install & Manage Specialized Agents
import React, { useState } from 'react';
import Head from 'next/head';
import { useCommandPalette } from '../components/CommandPalette/CommandPalette';
import CommandPalette from '../components/CommandPalette/CommandPalette';

interface MarketplaceAgent {
  id: string;
  name: string;
  description: string;
  longDescription: string;
  icon: string;
  category: 'Development' | 'DevOps' | 'Security' | 'Database' | 'Testing' | 'Design' | 'Analytics' | 'Management';
  rating: number;
  reviews: number;
  downloads: number;
  price: 'Free' | 'Premium' | 'Enterprise';
  tags: string[];
  capabilities: string[];
  version: string;
  publisher: string;
  lastUpdated: string;
  screenshots: string[];
  installed: boolean;
  featured: boolean;
  trending: boolean;
}

interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  agents: string[];
  steps: string[];
  icon: string;
  category: string;
  complexity: 'Simple' | 'Intermediate' | 'Advanced';
  estimatedTime: string;
}

export default function AgentMarketplace() {
  const { isOpen, setIsOpen } = useCommandPalette();
  const [selectedCategory, setSelectedCategory] = useState<'all' | MarketplaceAgent['category']>('all');
  const [selectedAgent, setSelectedAgent] = useState<MarketplaceAgent | null>(null);
  const [view, setView] = useState<'agents' | 'workflows' | 'custom-builder'>('agents');
  const [searchQuery, setSearchQuery] = useState('');

  // Sample marketplace agents
  const marketplaceAgents: MarketplaceAgent[] = [
    {
      id: 'code-reviewer-pro',
      name: 'Code Reviewer Pro',
      description: 'Advanced code review with security scanning and performance optimization',
      longDescription: 'Professional-grade code reviewer that analyzes your code for security vulnerabilities, performance bottlenecks, and best practices. Integrates with GitHub PRs and provides detailed feedback.',
      icon: '🔍',
      category: 'Development',
      rating: 4.9,
      reviews: 1247,
      downloads: 15420,
      price: 'Premium',
      tags: ['code-review', 'security', 'performance', 'github'],
      capabilities: [
        'Security vulnerability detection', 
        'Performance analysis', 
        'Code quality scoring',
        'Best practices enforcement',
        'Automated PR comments',
        'Custom rule configuration'
      ],
      version: '2.1.4',
      publisher: 'DevTools Inc',
      lastUpdated: '2024-09-28',
      screenshots: ['/api/placeholder/600/400'],
      installed: false,
      featured: true,
      trending: true
    },
    {
      id: 'database-expert',
      name: 'Database Expert',
      description: 'SQL optimization, schema design, and database performance tuning',
      longDescription: 'Specialized database agent that helps with query optimization, schema design, migration planning, and performance tuning across multiple database systems.',
      icon: '🗄️',
      category: 'Database',
      rating: 4.8,
      reviews: 892,
      downloads: 8750,
      price: 'Free',
      tags: ['sql', 'optimization', 'schema', 'migration'],
      capabilities: [
        'SQL query optimization',
        'Schema design review',
        'Migration planning',
        'Performance monitoring',
        'Index recommendations',
        'Multi-DB support (MySQL, PostgreSQL, MongoDB)'
      ],
      version: '1.8.2',
      publisher: 'DataCorp',
      lastUpdated: '2024-09-25',
      screenshots: ['/api/placeholder/600/400'],
      installed: true,
      featured: true,
      trending: false
    },
    {
      id: 'devsecops-guardian',
      name: 'DevSecOps Guardian',
      description: 'Integrated security scanning, compliance checking, and threat modeling',
      longDescription: 'Comprehensive security agent that integrates security practices into your development pipeline with real-time threat detection and compliance monitoring.',
      icon: '🛡️',
      category: 'Security',
      rating: 4.7,
      reviews: 634,
      downloads: 5420,
      price: 'Enterprise',
      tags: ['security', 'compliance', 'scanning', 'threats'],
      capabilities: [
        'Vulnerability scanning',
        'Compliance auditing',
        'Threat modeling',
        'Security policy enforcement',
        'OWASP integration',
        'Risk assessment reports'
      ],
      version: '3.0.1',
      publisher: 'SecureFlow',
      lastUpdated: '2024-09-30',
      screenshots: ['/api/placeholder/600/400'],
      installed: false,
      featured: false,
      trending: true
    },
    {
      id: 'test-automation-master',
      name: 'Test Automation Master',
      description: 'AI-powered test generation, execution, and coverage analysis',
      longDescription: 'Advanced testing agent that automatically generates test cases, executes comprehensive test suites, and provides detailed coverage analysis.',
      icon: '🧪',
      category: 'Testing',
      rating: 4.6,
      reviews: 445,
      downloads: 7230,
      price: 'Premium',
      tags: ['testing', 'automation', 'coverage', 'ai-generated'],
      capabilities: [
        'Automated test generation',
        'Cross-browser testing',
        'API testing suite',
        'Coverage analysis',
        'Performance testing',
        'Visual regression testing'
      ],
      version: '1.5.7',
      publisher: 'TestLab Pro',
      lastUpdated: '2024-09-22',
      screenshots: ['/api/placeholder/600/400'],
      installed: false,
      featured: false,
      trending: false
    },
    {
      id: 'ui-ux-designer',
      name: 'UI/UX Designer',
      description: 'Design system creation, accessibility audits, and user experience optimization',
      longDescription: 'Creative design agent that helps create consistent design systems, performs accessibility audits, and optimizes user experiences across platforms.',
      icon: '🎨',
      category: 'Design',
      rating: 4.5,
      reviews: 278,
      downloads: 3540,
      price: 'Free',
      tags: ['design', 'ui', 'ux', 'accessibility'],
      capabilities: [
        'Design system creation',
        'Accessibility auditing',
        'Color palette generation',
        'Component library building',
        'User flow optimization',
        'Figma integration'
      ],
      version: '1.2.3',
      publisher: 'DesignFlow',
      lastUpdated: '2024-09-20',
      screenshots: ['/api/placeholder/600/400'],
      installed: false,
      featured: false,
      trending: false
    },
    {
      id: 'kubernetes-ops',
      name: 'Kubernetes Ops',
      description: 'Container orchestration, scaling, and monitoring for K8s clusters',
      longDescription: 'Specialized Kubernetes agent for managing container orchestration, automated scaling, monitoring, and troubleshooting of K8s clusters.',
      icon: '☸️',
      category: 'DevOps',
      rating: 4.8,
      reviews: 756,
      downloads: 9180,
      price: 'Premium',
      tags: ['kubernetes', 'containers', 'orchestration', 'monitoring'],
      capabilities: [
        'Cluster management',
        'Auto-scaling configuration',
        'Resource monitoring',
        'Health check automation',
        'Deployment strategies',
        'Troubleshooting assistance'
      ],
      version: '2.3.1',
      publisher: 'CloudNative Co',
      lastUpdated: '2024-09-29',
      screenshots: ['/api/placeholder/600/400'],
      installed: false,
      featured: true,
      trending: true
    }
  ];

  // Workflow templates
  const workflowTemplates: WorkflowTemplate[] = [
    {
      id: 'full-deployment',
      name: 'Full Deployment Pipeline',
      description: 'End-to-end deployment with testing, security checks, and monitoring',
      agents: ['Code Reviewer Pro', 'DevSecOps Guardian', 'Test Automation Master', 'Kubernetes Ops'],
      steps: [
        'Code review and analysis',
        'Security vulnerability scanning',
        'Automated test execution',
        'Container build and registry push',
        'Kubernetes deployment',
        'Performance monitoring setup'
      ],
      icon: '🚀',
      category: 'DevOps',
      complexity: 'Advanced',
      estimatedTime: '45-60 minutes'
    },
    {
      id: 'code-quality-check',
      name: 'Code Quality Assurance',
      description: 'Comprehensive code quality analysis and improvement suggestions',
      agents: ['Code Reviewer Pro', 'Test Automation Master'],
      steps: [
        'Static code analysis',
        'Test coverage evaluation',
        'Performance bottleneck detection',
        'Best practices validation',
        'Improvement recommendations'
      ],
      icon: '✅',
      category: 'Development',
      complexity: 'Intermediate',
      estimatedTime: '15-30 minutes'
    },
    {
      id: 'database-migration',
      name: 'Database Migration',
      description: 'Safe and efficient database schema migration with rollback planning',
      agents: ['Database Expert', 'DevSecOps Guardian'],
      steps: [
        'Schema analysis',
        'Migration plan creation',
        'Backup strategy setup',
        'Security compliance check',
        'Migration execution',
        'Rollback plan preparation'
      ],
      icon: '🗃️',
      category: 'Database',
      complexity: 'Advanced',
      estimatedTime: '30-45 minutes'
    }
  ];

  const categories = ['all', 'Development', 'DevOps', 'Security', 'Database', 'Testing', 'Design', 'Analytics', 'Management'];

  const filteredAgents = marketplaceAgents.filter(agent => {
    const matchesCategory = selectedCategory === 'all' || agent.category === selectedCategory;
    const matchesSearch = searchQuery === '' || 
      agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agent.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agent.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const installAgent = (agentId: string) => {
    // Simulate installation
    console.log(`Installing agent: ${agentId}`);
    // In real implementation, this would trigger the installation process
  };

  const getPriceColor = (price: string) => {
    switch (price) {
      case 'Free': return 'text-green-600 bg-green-100';
      case 'Premium': return 'text-blue-600 bg-blue-100';
      case 'Enterprise': return 'text-purple-600 bg-purple-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-blue-900">
      <Head>
        <title>Agent Marketplace - FLUX Platform</title>
        <meta name="description" content="Browse and install specialized AI agents" />
      </Head>

      <CommandPalette isOpen={isOpen} onClose={() => setIsOpen(false)} />

      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
                🛒 Agent Marketplace
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Discover, install, and manage specialized AI agents for your workflow
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                <button
                  onClick={() => setView('agents')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    view === 'agents'
                      ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm'
                      : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  🤖 Agents
                </button>
                <button
                  onClick={() => setView('workflows')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    view === 'workflows'
                      ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm'
                      : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  ⚡ Workflows
                </button>
                <button
                  onClick={() => setView('custom-builder')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    view === 'custom-builder'
                      ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm'
                      : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  🛠️ Builder
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {view === 'agents' && (
          <>
            {/* Search and Filters */}
            <div className="flex flex-col lg:flex-row gap-6 mb-8">
              <div className="flex-1">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-400 text-xl">🔍</span>
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search agents by name, description, or tags..."
                    className="block w-full pl-12 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {categories.map(category => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category as any)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      selectedCategory === category
                        ? 'bg-blue-600 text-white shadow-lg'
                        : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    {category === 'all' ? 'All Categories' : category}
                  </button>
                ))}
              </div>
            </div>

            {/* Featured Agents */}
            {selectedCategory === 'all' && (
              <div className="mb-12">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
                  ⭐ Featured & Trending
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {marketplaceAgents.filter(agent => agent.featured || agent.trending).map(agent => (
                    <div key={agent.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-xl transition-all transform hover:-translate-y-1">
                      <div className="relative">
                        <div className="h-48 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                          <div className="text-6xl">{agent.icon}</div>
                        </div>
                        <div className="absolute top-4 right-4 flex gap-2">
                          {agent.featured && (
                            <span className="bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                              ⭐ Featured
                            </span>
                          )}
                          {agent.trending && (
                            <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                              🔥 Trending
                            </span>
                          )}
                        </div>
                        <div className="absolute bottom-4 right-4">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPriceColor(agent.price)}`}>
                            {agent.price}
                          </span>
                        </div>
                      </div>
                      <div className="p-6">
                        <div className="flex items-start justify-between mb-3">
                          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{agent.name}</h3>
                          <div className="flex items-center text-sm text-gray-500">
                            <span className="text-yellow-400 mr-1">⭐</span>
                            {agent.rating} ({agent.reviews})
                          </div>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">{agent.description}</p>
                        <div className="flex flex-wrap gap-1 mb-4">
                          {agent.tags.slice(0, 3).map(tag => (
                            <span key={tag} className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded-md text-xs">
                              #{tag}
                            </span>
                          ))}
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="text-sm text-gray-500">
                            📥 {agent.downloads.toLocaleString()} downloads
                          </div>
                          <button
                            onClick={() => setSelectedAgent(agent)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                          >
                            {agent.installed ? 'Manage' : 'Install'}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* All Agents */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
                🤖 All Agents ({filteredAgents.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredAgents.map(agent => (
                  <div key={agent.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-xl transition-all transform hover:-translate-y-1">
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <div className="text-3xl">{agent.icon}</div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriceColor(agent.price)}`}>
                          {agent.price}
                        </span>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{agent.name}</h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">{agent.description}</p>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center text-sm text-gray-500">
                          <span className="text-yellow-400 mr-1">⭐</span>
                          {agent.rating}
                        </div>
                        <div className="text-xs text-gray-500">
                          {agent.downloads.toLocaleString()} downloads
                        </div>
                      </div>
                      <button
                        onClick={() => setSelectedAgent(agent)}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-sm font-medium transition-colors"
                      >
                        {agent.installed ? '✅ Installed' : 'View Details'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {view === 'workflows' && (
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
              ⚡ Workflow Templates
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {workflowTemplates.map(workflow => (
                <div key={workflow.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-xl transition-all">
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="text-4xl">{workflow.icon}</div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        workflow.complexity === 'Simple' ? 'bg-green-100 text-green-700' :
                        workflow.complexity === 'Intermediate' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {workflow.complexity}
                      </span>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{workflow.name}</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">{workflow.description}</p>
                    <div className="mb-4">
                      <div className="text-sm text-gray-700 dark:text-gray-300 mb-2">Required Agents:</div>
                      <div className="flex flex-wrap gap-1">
                        {workflow.agents.map(agent => (
                          <span key={agent} className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-md text-xs">
                            {agent}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="text-sm text-gray-500 mb-4">
                      ⏱️ {workflow.estimatedTime}
                    </div>
                    <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 rounded-lg font-medium transition-all">
                      Use Template
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {view === 'custom-builder' && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-8">
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🛠️</div>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                Custom Agent Builder
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
                Create your own specialized AI agents with our visual workflow designer.
                Define capabilities, configure integrations, and train your agents for specific tasks.
              </p>
              <button className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all transform hover:scale-105">
                🚀 Start Building
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Agent Detail Modal */}
      {selectedAgent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-start justify-between">
                <div className="flex items-center">
                  <div className="text-4xl mr-4">{selectedAgent.icon}</div>
                  <div>
                    <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">{selectedAgent.name}</h2>
                    <p className="text-gray-600 dark:text-gray-400">by {selectedAgent.publisher}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedAgent(null)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-2xl"
                >
                  ✕
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <p className="text-gray-700 dark:text-gray-300 mb-6">{selectedAgent.longDescription}</p>
                  
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Capabilities</h3>
                  <ul className="space-y-2 mb-6">
                    {selectedAgent.capabilities.map(capability => (
                      <li key={capability} className="flex items-center text-gray-700 dark:text-gray-300">
                        <span className="text-green-500 mr-2">✓</span>
                        {capability}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-6">
                    <div className="flex items-center justify-between mb-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPriceColor(selectedAgent.price)}`}>
                        {selectedAgent.price}
                      </span>
                      <div className="flex items-center text-sm text-gray-500">
                        <span className="text-yellow-400 mr-1">⭐</span>
                        {selectedAgent.rating} ({selectedAgent.reviews} reviews)
                      </div>
                    </div>
                    
                    <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400 mb-4">
                      <div>Version: {selectedAgent.version}</div>
                      <div>Downloads: {selectedAgent.downloads.toLocaleString()}</div>
                      <div>Updated: {selectedAgent.lastUpdated}</div>
                    </div>
                    
                    <button
                      onClick={() => installAgent(selectedAgent.id)}
                      className={`w-full py-3 rounded-lg font-medium transition-all ${
                        selectedAgent.installed
                          ? 'bg-green-600 hover:bg-green-700 text-white'
                          : 'bg-blue-600 hover:bg-blue-700 text-white'
                      }`}
                    >
                      {selectedAgent.installed ? '✅ Installed - Manage' : '📦 Install Agent'}
                    </button>
                  </div>
                  
                  <div className="mb-4">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">Tags</h4>
                    <div className="flex flex-wrap gap-1">
                      {selectedAgent.tags.map(tag => (
                        <span key={tag} className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded text-xs">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}