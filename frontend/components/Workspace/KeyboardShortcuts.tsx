// components/Workspace/KeyboardShortcuts.tsx - Keyboard Shortcuts Panel
import React, { useEffect, useState } from 'react';

interface ShortcutCommand {
  key: string;
  description: string;
  action: () => void;
  category: 'navigation' | 'chat' | 'edit' | 'view';
}

interface KeyboardShortcutsProps {
  shortcuts: ShortcutCommand[];
  onClose: () => void;
  isOpen: boolean;
}

export const KeyboardShortcutsPanel: React.FC<KeyboardShortcutsProps> = ({
  shortcuts,
  onClose,
  isOpen
}) => {
  if (!isOpen) return null;

  const categories = {
    navigation: 'Navigation',
    chat: 'Chat Actions',
    edit: 'Editing',
    view: 'View Control'
  };

  const groupedShortcuts = shortcuts.reduce((acc, shortcut) => {
    if (!acc[shortcut.category]) {
      acc[shortcut.category] = [];
    }
    acc[shortcut.category].push(shortcut);
    return acc;
  }, {} as Record<string, ShortcutCommand[]>);

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center"
        onClick={onClose}
      >
        {/* Modal */}
        <div
          className="bg-white rounded-xl shadow-2xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">⌨️ Keyboard Shortcuts</h2>
                  <p className="text-white/80 text-sm">Master your workflow with shortcuts</p>
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
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(80vh-120px)] custom-scrollbar">
            {Object.entries(groupedShortcuts).map(([category, shortcuts]) => (
              <div key={category} className="mb-6 last:mb-0">
                <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <div className="w-1 h-4 bg-gradient-to-b from-purple-500 to-blue-500 rounded-full"></div>
                  {categories[category as keyof typeof categories]}
                </h3>
                <div className="space-y-2">
                  {shortcuts.map((shortcut, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors group"
                    >
                      <span className="text-sm text-slate-700 group-hover:text-slate-900">
                        {shortcut.description}
                      </span>
                      <kbd className="px-3 py-1.5 bg-white border-2 border-slate-300 rounded-lg shadow-sm text-sm font-mono font-semibold text-slate-700 min-w-[80px] text-center">
                        {shortcut.key}
                      </kbd>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-slate-200 bg-slate-50">
            <p className="text-xs text-slate-500 text-center">
              Press <kbd className="px-2 py-1 bg-white border border-slate-300 rounded text-xs font-mono">Ctrl + /</kbd> or <kbd className="px-2 py-1 bg-white border border-slate-300 rounded text-xs font-mono">?</kbd> anytime to open this panel
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

// Hook to manage keyboard shortcuts
export const useKeyboardShortcuts = (shortcuts: ShortcutCommand[]) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Find matching shortcut
      for (const shortcut of shortcuts) {
        const keys = shortcut.key.split(' + ').map(k => k.toLowerCase());
        
        const ctrlPressed = e.ctrlKey || e.metaKey;
        const shiftPressed = e.shiftKey;
        const altPressed = e.altKey;
        
        const keyPressed = e.key.toLowerCase();
        
        let matches = true;
        
        if (keys.includes('ctrl') && !ctrlPressed) matches = false;
        if (keys.includes('shift') && !shiftPressed) matches = false;
        if (keys.includes('alt') && !altPressed) matches = false;
        
        const mainKey = keys[keys.length - 1];
        if (mainKey !== keyPressed && mainKey !== e.code.toLowerCase()) matches = false;
        
        if (matches) {
          e.preventDefault();
          shortcut.action();
          break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts]);
};
