// Keyboard Shortcuts System - Global shortcuts overlay and management
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

interface Shortcut {
  id: string;
  key: string;
  description: string;
  category: 'navigation' | 'actions' | 'agents' | 'global';
  action: () => void;
  global?: boolean;
}

interface KeyboardShortcutsProps {
  onAgentCall?: (agentId: string) => void;
  onCommandPalette?: () => void;
}

export default function KeyboardShortcuts({ onAgentCall, onCommandPalette }: KeyboardShortcutsProps) {
  const [showOverlay, setShowOverlay] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  // Define all keyboard shortcuts
  const shortcuts: Shortcut[] = [
    // Navigation Shortcuts
    {
      id: 'nav-dashboard',
      key: '1',
      description: 'Go to Dashboard',
      category: 'navigation',
      action: () => router.push('/dashboard')
    },
    {
      id: 'nav-projects',
      key: '2',
      description: 'Go to Projects',
      category: 'navigation',
      action: () => router.push('/projects')
    },
    {
      id: 'nav-workspace',
      key: '3',
      description: 'Go to AI Workspace',
      category: 'navigation',
      action: () => router.push('/workspace')
    },
    {
      id: 'nav-analytics',
      key: '4',
      description: 'Go to Analytics',
      category: 'navigation',
      action: () => router.push('/analytics')
    },
    {
      id: 'nav-integrations',
      key: '5',
      description: 'Go to Integrations',
      category: 'navigation',
      action: () => router.push('/integrations')
    },
    {
      id: 'nav-marketplace',
      key: '6',
      description: 'Go to Marketplace',
      category: 'navigation',
      action: () => router.push('/marketplace')
    },
    {
      id: 'nav-timeline',
      key: '7',
      description: 'Go to Timeline',
      category: 'navigation',
      action: () => router.push('/timeline')
    },
    {
      id: 'nav-settings',
      key: '8',
      description: 'Go to Settings',
      category: 'navigation',
      action: () => router.push('/settings')
    },

    // Global Actions
    {
      id: 'command-palette',
      key: 'Ctrl+K',
      description: 'Open Command Palette',
      category: 'global',
      action: () => onCommandPalette?.(),
      global: true
    },
    {
      id: 'shortcuts-help',
      key: '?',
      description: 'Show this shortcuts help',
      category: 'global',
      action: () => setShowOverlay(true),
      global: true
    },
    {
      id: 'escape',
      key: 'Escape',
      description: 'Close modals/overlays',
      category: 'global',
      action: () => setShowOverlay(false),
      global: true
    },

    // Agent Shortcuts
    {
      id: 'agent-marcus',
      key: 'Ctrl+Shift+M',
      description: 'Call Marcus (Project Manager)',
      category: 'agents',
      action: () => {
        router.push('/workspace');
        onAgentCall?.('marcus');
      }
    },
    {
      id: 'agent-sarah',
      key: 'Ctrl+Shift+S',
      description: 'Call Sarah (Developer)',
      category: 'agents',
      action: () => {
        router.push('/workspace');
        onAgentCall?.('sarah');
      }
    },
    {
      id: 'agent-alex',
      key: 'Ctrl+Shift+A',
      description: 'Call Alex (DevOps)',
      category: 'agents',
      action: () => {
        router.push('/workspace');
        onAgentCall?.('alex');
      }
    },
    {
      id: 'agent-emma',
      key: 'Ctrl+Shift+E',
      description: 'Call Emma (QA Tester)',
      category: 'agents',
      action: () => {
        router.push('/workspace');
        onAgentCall?.('emma');
      }
    },

    // Quick Actions
    {
      id: 'new-epic',
      key: 'Ctrl+N',
      description: 'Create New Epic',
      category: 'actions',
      action: () => {
        router.push('/projects');
        // Trigger new epic modal
      }
    },
    {
      id: 'export-data',
      key: 'Ctrl+E',
      description: 'Export Current Data',
      category: 'actions',
      action: () => alert('Export functionality triggered')
    },
    {
      id: 'refresh-data',
      key: 'F5',
      description: 'Refresh Current Page Data',
      category: 'actions',
      action: () => window.location.reload()
    },
    {
      id: 'focus-search',
      key: '/',
      description: 'Focus Search Input',
      category: 'actions',
      action: () => {
        const searchInput = document.querySelector('input[type="search"], input[placeholder*="search" i]') as HTMLInputElement;
        searchInput?.focus();
      }
    }
  ];

  // Global keyboard event handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent shortcuts when typing in inputs
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        // Allow ESC and ? even in inputs
        if (e.key !== 'Escape' && e.key !== '?') return;
      }

      // Check for shortcuts
      shortcuts.forEach(shortcut => {
        if (matchesShortcut(e, shortcut.key)) {
          e.preventDefault();
          shortcut.action();
        }
      });
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts, onAgentCall, onCommandPalette]);

  // Check if key event matches shortcut
  const matchesShortcut = (e: KeyboardEvent, shortcut: string): boolean => {
    const parts = shortcut.split('+');
    const key = parts[parts.length - 1].toLowerCase();
    const needsCtrl = parts.includes('Ctrl');
    const needsShift = parts.includes('Shift');
    const needsAlt = parts.includes('Alt');

    return (
      e.key.toLowerCase() === key &&
      e.ctrlKey === needsCtrl &&
      e.shiftKey === needsShift &&
      e.altKey === needsAlt
    );
  };

  // Filter shortcuts based on search
  const filteredShortcuts = shortcuts.filter(shortcut =>
    shortcut.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    shortcut.key.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const groupedShortcuts = filteredShortcuts.reduce((groups, shortcut) => {
    const category = shortcut.category;
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(shortcut);
    return groups;
  }, {} as Record<string, Shortcut[]>);

  const categoryIcons = {
    navigation: '🧭',
    actions: '⚡',
    agents: '🤖',
    global: '🌐'
  };

  const categoryNames = {
    navigation: 'Navigation',
    actions: 'Quick Actions',
    agents: 'AI Agents',
    global: 'Global'
  };

  if (!showOverlay) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden border border-gray-200 dark:border-gray-700">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-600 to-purple-600">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white flex items-center">
                ⌨️ Keyboard Shortcuts
              </h2>
              <p className="text-blue-100 mt-1">
                Master these shortcuts to boost your productivity
              </p>
            </div>
            <button
              onClick={() => setShowOverlay(false)}
              className="text-white hover:text-blue-100 text-2xl transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-400 text-xl">🔍</span>
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search shortcuts..."
              className="block w-full pl-12 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Shortcuts List */}
        <div className="p-6 max-h-96 overflow-y-auto">
          {Object.entries(groupedShortcuts).map(([category, categoryShortcuts]) => (
            <div key={category} className="mb-8 last:mb-0">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <span className="mr-2">{categoryIcons[category as keyof typeof categoryIcons]}</span>
                {categoryNames[category as keyof typeof categoryNames]}
                <span className="ml-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 px-2 py-1 rounded-full text-sm">
                  {categoryShortcuts.length}
                </span>
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {categoryShortcuts.map(shortcut => (
                  <div
                    key={shortcut.id}
                    className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                    onClick={shortcut.action}
                  >
                    <div className="flex-1">
                      <div className="font-medium text-gray-900 dark:text-white">
                        {shortcut.description}
                      </div>
                      {shortcut.global && (
                        <div className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                          Global shortcut
                        </div>
                      )}
                    </div>
                    <div className="ml-4">
                      <ShortcutKey shortcut={shortcut.key} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {filteredShortcuts.length === 0 && (
            <div className="text-center py-12">
              <div className="text-4xl mb-4">🤔</div>
              <div className="text-gray-500 dark:text-gray-400">
                No shortcuts found for "{searchQuery}"
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center space-x-4">
              <span>Press <kbd className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded">?</kbd> anytime to show this help</span>
            </div>
            <div>
              {filteredShortcuts.length} shortcuts available
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Component to display shortcut keys nicely
function ShortcutKey({ shortcut }: { shortcut: string }) {
  const parts = shortcut.split('+');
  
  return (
    <div className="flex items-center space-x-1">
      {parts.map((part, index) => (
        <React.Fragment key={part}>
          <kbd className="px-2 py-1 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded text-xs font-mono">
            {part === 'Ctrl' ? '⌘' : part === 'Shift' ? '⇧' : part === 'Alt' ? '⌥' : part}
          </kbd>
          {index < parts.length - 1 && (
            <span className="text-gray-400">+</span>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

// Hook to use keyboard shortcuts in any component
export function useKeyboardShortcuts(shortcuts: { [key: string]: () => void }) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      Object.entries(shortcuts).forEach(([key, action]) => {
        if (e.key === key || e.code === key) {
          e.preventDefault();
          action();
        }
      });
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts]);
}

// Context for managing shortcuts globally
export const KeyboardShortcutsContext = React.createContext<{
  registerShortcut: (shortcut: Shortcut) => void;
  unregisterShortcut: (id: string) => void;
}>({
  registerShortcut: () => {},
  unregisterShortcut: () => {}
});