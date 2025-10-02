// Global Command Palette - Ctrl+K Search Everything
import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';

interface Command {
  id: string;
  title: string;
  subtitle?: string;
  icon: string;
  category: 'navigation' | 'actions' | 'agents' | 'search' | 'recent';
  action: () => void;
  keywords: string[];
  shortcut?: string;
}

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [recentItems, setRecentItems] = useState<Command[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // All available commands
  const allCommands: Command[] = [
    // Navigation
    {
      id: 'nav-dashboard',
      title: 'Dashboard',
      subtitle: 'View metrics and analytics',
      icon: '📊',
      category: 'navigation',
      action: () => router.push('/dashboard'),
      keywords: ['dashboard', 'metrics', 'analytics', 'home'],
      shortcut: '1'
    },
    {
      id: 'nav-projects',
      title: 'Projects',
      subtitle: 'Manage epics and stories',
      icon: '📋',
      category: 'navigation',
      action: () => router.push('/projects'),
      keywords: ['projects', 'epics', 'stories', 'kanban'],
      shortcut: '2'
    },
    {
      id: 'nav-workspace',
      title: 'AI Workspace',
      subtitle: 'Collaborate with agents',
      icon: '💬',
      category: 'navigation',
      action: () => router.push('/workspace'),
      keywords: ['workspace', 'agents', 'chat', 'collaboration'],
      shortcut: '3'
    },
    {
      id: 'nav-analytics',
      title: 'Analytics',
      subtitle: 'Deep performance insights',
      icon: '📈',
      category: 'navigation',
      action: () => router.push('/analytics'),
      keywords: ['analytics', 'performance', 'insights', 'trends'],
      shortcut: '4'
    },
    {
      id: 'nav-integrations',
      title: 'Integrations',
      subtitle: 'Manage tool connections',
      icon: '🔌',
      category: 'navigation',
      action: () => router.push('/integrations'),
      keywords: ['integrations', 'tools', 'connections', 'apis'],
      shortcut: '5'
    },
    {
      id: 'nav-settings',
      title: 'Settings',
      subtitle: 'Configure platform',
      icon: '⚙️',
      category: 'navigation',
      action: () => router.push('/settings'),
      keywords: ['settings', 'configuration', 'preferences'],
      shortcut: '6'
    },
    {
      id: 'nav-marketplace',
      title: 'Agent Marketplace',
      subtitle: 'Browse and install agents',
      icon: '🛒',
      category: 'navigation',
      action: () => router.push('/marketplace'),
      keywords: ['marketplace', 'agents', 'install', 'browse'],
      shortcut: '7'
    },
    {
      id: 'nav-timeline',
      title: 'Timeline',
      subtitle: 'Audit trail and history',
      icon: '⏰',
      category: 'navigation',
      action: () => router.push('/timeline'),
      keywords: ['timeline', 'audit', 'history', 'logs'],
      shortcut: '8'
    },

    // Quick Actions
    {
      id: 'action-new-epic',
      title: 'Create New Epic',
      subtitle: 'Start a new project epic',
      icon: '➕',
      category: 'actions',
      action: () => {
        router.push('/projects');
        // Trigger new epic modal
      },
      keywords: ['create', 'new', 'epic', 'project']
    },
    {
      id: 'action-deploy-prod',
      title: 'Deploy to Production',
      subtitle: 'Start production deployment',
      icon: '🚀',
      category: 'actions',
      action: () => alert('Deploy to Production initiated!'),
      keywords: ['deploy', 'production', 'release']
    },
    {
      id: 'action-run-tests',
      title: 'Run All Tests',
      subtitle: 'Execute test suite',
      icon: '🧪',
      category: 'actions',
      action: () => alert('Running all tests...'),
      keywords: ['test', 'tests', 'run', 'execute']
    },
    {
      id: 'action-export-data',
      title: 'Export Dashboard Data',
      subtitle: 'Download CSV/PDF report',
      icon: '📤',
      category: 'actions',
      action: () => alert('Exporting dashboard data...'),
      keywords: ['export', 'download', 'data', 'report']
    },

    // Agent Actions
    {
      id: 'agent-marcus',
      title: 'Call Marcus (Project Manager)',
      subtitle: 'Start conversation with PM',
      icon: '👨‍💼',
      category: 'agents',
      action: () => {
        router.push('/workspace');
        // Activate Marcus agent
      },
      keywords: ['marcus', 'project manager', 'pm', 'agent'],
      shortcut: 'Ctrl+Shift+M'
    },
    {
      id: 'agent-sarah',
      title: 'Call Sarah (Developer)',
      subtitle: 'Get development help',
      icon: '👩‍💻',
      category: 'agents',
      action: () => {
        router.push('/workspace');
        // Activate Sarah agent
      },
      keywords: ['sarah', 'developer', 'dev', 'code', 'agent'],
      shortcut: 'Ctrl+Shift+S'
    },
    {
      id: 'agent-alex',
      title: 'Call Alex (DevOps)',
      subtitle: 'Infrastructure and deployment',
      icon: '👨‍🔧',
      category: 'agents',
      action: () => {
        router.push('/workspace');
        // Activate Alex agent
      },
      keywords: ['alex', 'devops', 'infrastructure', 'deployment', 'agent'],
      shortcut: 'Ctrl+Shift+A'
    },

    // Search Actions
    {
      id: 'search-projects',
      title: 'Search Projects',
      subtitle: 'Find specific epics or stories',
      icon: '🔍',
      category: 'search',
      action: () => router.push('/projects?search=' + encodeURIComponent(query)),
      keywords: ['search', 'find', 'projects', 'epics']
    },
    {
      id: 'search-messages',
      title: 'Search Chat History',
      subtitle: 'Find agent conversations',
      icon: '💬',
      category: 'search',
      action: () => router.push('/workspace?search=' + encodeURIComponent(query)),
      keywords: ['search', 'chat', 'messages', 'conversations']
    }
  ];

  // Filter commands based on query
  const filteredCommands = query.trim() === '' 
    ? [...recentItems.slice(0, 5), ...allCommands.slice(0, 8)]
    : allCommands.filter(cmd => 
        cmd.title.toLowerCase().includes(query.toLowerCase()) ||
        cmd.subtitle?.toLowerCase().includes(query.toLowerCase()) ||
        cmd.keywords.some(keyword => keyword.toLowerCase().includes(query.toLowerCase()))
      );

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex(prev => (prev + 1) % filteredCommands.length);
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex(prev => prev === 0 ? filteredCommands.length - 1 : prev - 1);
          break;
        case 'Enter':
          e.preventDefault();
          if (filteredCommands[selectedIndex]) {
            executeCommand(filteredCommands[selectedIndex]);
          }
          break;
        case 'Escape':
          e.preventDefault();
          onClose();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, selectedIndex, filteredCommands]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Execute command and add to recent
  const executeCommand = (command: Command) => {
    command.action();
    
    // Add to recent items
    setRecentItems(prev => {
      const filtered = prev.filter(item => item.id !== command.id);
      return [command, ...filtered].slice(0, 10);
    });
    
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-start justify-center pt-32">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl w-full max-w-2xl mx-4 overflow-hidden border border-gray-200 dark:border-gray-700">
        {/* Search Input */}
        <div className="flex items-center p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="text-2xl mr-3">🔍</div>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Search commands, pages, agents... (or type to search)"
            className="flex-1 bg-transparent text-lg outline-none placeholder-gray-500 dark:placeholder-gray-400"
          />
          <div className="text-sm text-gray-500 ml-4">
            <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-xs">ESC</kbd>
          </div>
        </div>

        {/* Command List */}
        <div className="max-h-96 overflow-y-auto">
          {filteredCommands.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <div className="text-4xl mb-2">🤔</div>
              <div>No commands found for "{query}"</div>
              <div className="text-sm mt-1">Try searching for pages, actions, or agents</div>
            </div>
          ) : (
            filteredCommands.map((command, index) => (
              <div
                key={command.id}
                className={`flex items-center p-3 cursor-pointer transition-all ${
                  index === selectedIndex
                    ? 'bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border-l-4 border-blue-500'
                    : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
                onClick={() => executeCommand(command)}
              >
                <div className="text-2xl mr-4">{command.icon}</div>
                <div className="flex-1">
                  <div className="font-medium text-gray-900 dark:text-white">
                    {command.title}
                  </div>
                  {command.subtitle && (
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {command.subtitle}
                    </div>
                  )}
                </div>
                {command.shortcut && (
                  <div className="text-xs text-gray-500 ml-4">
                    <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded">
                      {command.shortcut}
                    </kbd>
                  </div>
                )}
                <div className="text-xs text-gray-400 ml-2 capitalize">
                  {command.category}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center space-x-4">
              <span>
                <kbd className="px-1.5 py-0.5 bg-gray-200 dark:bg-gray-700 rounded">↑↓</kbd> navigate
              </span>
              <span>
                <kbd className="px-1.5 py-0.5 bg-gray-200 dark:bg-gray-700 rounded">↵</kbd> select
              </span>
              <span>
                <kbd className="px-1.5 py-0.5 bg-gray-200 dark:bg-gray-700 rounded">ESC</kbd> close
              </span>
            </div>
            <div>
              {filteredCommands.length} results
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Global keyboard shortcut hook
export function useCommandPalette() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+K or Cmd+K to open
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return { isOpen, setIsOpen };
}