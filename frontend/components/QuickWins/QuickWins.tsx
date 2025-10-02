import React, { useState, useEffect } from 'react';

// Export Chat Component
export const ExportChat: React.FC<{ onExport: (format: string) => void }> = ({ onExport }) => {
  return (
    <div className="flex gap-2">
      <button
        onClick={() => onExport('pdf')}
        className="px-3 py-1.5 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 transition"
      >
        📄 PDF
      </button>
      <button
        onClick={() => onExport('markdown')}
        className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition"
      >
        📝 Markdown
      </button>
      <button
        onClick={() => onExport('json')}
        className="px-3 py-1.5 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700 transition"
      >
        💾 JSON
      </button>
    </div>
  );
};

// Agent Status Indicator
export const AgentStatus: React.FC<{ status: 'idle' | 'thinking' | 'typing' | 'busy' }> = ({ status }) => {
  const statusConfig = {
    idle: { color: 'bg-gray-400', text: 'Idle', icon: '💤' },
    thinking: { color: 'bg-yellow-400 animate-pulse', text: 'Thinking', icon: '🤔' },
    typing: { color: 'bg-blue-400 animate-pulse', text: 'Typing', icon: '⌨️' },
    busy: { color: 'bg-red-400', text: 'Busy', icon: '🔴' }
  };

  const config = statusConfig[status];

  return (
    <div className="flex items-center gap-2">
      <div className={`w-3 h-3 rounded-full ${config.color}`}></div>
      <span className="text-sm text-gray-600 dark:text-gray-400">
        {config.icon} {config.text}
      </span>
    </div>
  );
};

// Emoji Reactions Component
export const EmojiReactions: React.FC<{ onReact: (emoji: string) => void }> = ({ onReact }) => {
  const emojis = ['👍', '❤️', '🎉', '🚀', '💡', '🤔'];
  const [selectedReactions, setSelectedReactions] = useState<Record<string, number>>({});

  const handleReact = (emoji: string) => {
    setSelectedReactions(prev => ({
      ...prev,
      [emoji]: (prev[emoji] || 0) + 1
    }));
    onReact(emoji);
  };

  return (
    <div className="flex gap-2 items-center">
      {emojis.map(emoji => (
        <button
          key={emoji}
          onClick={() => handleReact(emoji)}
          className="hover:scale-125 transition-transform text-xl relative group"
        >
          {emoji}
          {selectedReactions[emoji] > 0 && (
            <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {selectedReactions[emoji]}
            </span>
          )}
        </button>
      ))}
    </div>
  );
};

// Copy Code Button
export const CopyCodeButton: React.FC<{ code: string }> = ({ code }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm transition flex items-center gap-2"
    >
      {copied ? '✅ Copied!' : '📋 Copy Code'}
    </button>
  );
};

// Typing Indicator
export const TypingIndicator: React.FC<{ agentName: string }> = ({ agentName }) => {
  return (
    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
      <span className="text-sm">{agentName} is typing</span>
      <div className="flex gap-1">
        <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
        <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
        <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
      </div>
    </div>
  );
};

// Conversation Pin Component
export const ConversationPin: React.FC<{ isPinned: boolean; onToggle: () => void }> = ({ isPinned, onToggle }) => {
  return (
    <button
      onClick={onToggle}
      className={`p-2 rounded-lg transition ${
        isPinned
          ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300'
          : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
      }`}
      title={isPinned ? 'Unpin conversation' : 'Pin conversation'}
    >
      {isPinned ? '📌' : '📍'}
    </button>
  );
};

// Dark Mode Auto-Switch
export const useDarkModeAutoSwitch = () => {
  useEffect(() => {
    const checkTime = () => {
      const hour = new Date().getHours();
      const isDarkTime = hour >= 18 || hour < 6; // 6 PM to 6 AM
      
      const currentTheme = document.documentElement.classList.contains('dark');
      if (isDarkTime && !currentTheme) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
      } else if (!isDarkTime && currentTheme) {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
      }
    };

    // Check immediately and then every hour
    checkTime();
    const interval = setInterval(checkTime, 60 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);
};

// Recent Projects Sidebar
export const RecentProjects: React.FC = () => {
  const recentProjects = [
    { id: 1, name: 'E-Commerce Platform', lastAccessed: '2 hours ago', color: 'bg-blue-500' },
    { id: 2, name: 'Mobile App Backend', lastAccessed: '1 day ago', color: 'bg-purple-500' },
    { id: 3, name: 'AI Dashboard', lastAccessed: '3 days ago', color: 'bg-green-500' },
    { id: 4, name: 'Analytics Engine', lastAccessed: '1 week ago', color: 'bg-orange-500' }
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
      <h3 className="font-semibold text-gray-900 dark:text-white mb-3">📂 Recent Projects</h3>
      <div className="space-y-2">
        {recentProjects.map(project => (
          <button
            key={project.id}
            className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition text-left"
          >
            <div className={`w-3 h-3 rounded-full ${project.color}`}></div>
            <div className="flex-1">
              <p className="font-medium text-gray-900 dark:text-white text-sm">{project.name}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{project.lastAccessed}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

// Conversation Search (within current chat)
export const ConversationSearch: React.FC<{ messages: any[]; onSelect: (messageId: string) => void }> = ({ messages, onSelect }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (query.trim()) {
      const filtered = messages.filter(msg =>
        msg.content.toLowerCase().includes(query.toLowerCase())
      );
      setResults(filtered);
    } else {
      setResults([]);
    }
  }, [query, messages]);

  return (
    <div className="relative">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="Search in conversation (Ctrl+F)"
          className="w-full px-4 py-2 pl-10 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        />
        <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
      </div>

      {isOpen && results.length > 0 && (
        <div className="absolute top-full mt-2 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-64 overflow-y-auto z-50">
          {results.map((msg, idx) => (
            <button
              key={idx}
              onClick={() => {
                onSelect(msg.id);
                setIsOpen(false);
              }}
              className="w-full p-3 text-left hover:bg-gray-100 dark:hover:bg-gray-700 border-b border-gray-200 dark:border-gray-700 last:border-0"
            >
              <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                {msg.agentName || 'User'}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                {msg.content}
              </p>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// Agent Avatars
export const AgentAvatar: React.FC<{ agentName: string; size?: 'sm' | 'md' | 'lg' }> = ({ agentName, size = 'md' }) => {
  const avatars: Record<string, string> = {
    'Marcus': '👨‍💼',
    'Sarah': '👩‍💻',
    'Alex': '🧑‍🔧',
    'Jordan': '👨‍🎨',
    'Riley': '👩‍🔬',
    'Taylor': '🧑‍💼',
    'Casey': '👨‍🚀'
  };

  const sizeClasses = {
    sm: 'w-8 h-8 text-xl',
    md: 'w-12 h-12 text-3xl',
    lg: 'w-16 h-16 text-4xl'
  };

  const colors = [
    'from-blue-500 to-purple-500',
    'from-green-500 to-teal-500',
    'from-orange-500 to-pink-500',
    'from-purple-500 to-indigo-500'
  ];

  const colorIndex = agentName.charCodeAt(0) % colors.length;

  return (
    <div className={`${sizeClasses[size]} rounded-full bg-gradient-to-br ${colors[colorIndex]} flex items-center justify-center shadow-lg`}>
      <span>{avatars[agentName] || '🤖'}</span>
    </div>
  );
};
