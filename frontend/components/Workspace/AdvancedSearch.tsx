// components/Workspace/AdvancedSearch.tsx
import React, { useState, useEffect } from 'react';

interface Message {
  id: string;
  agentId: string;
  agentName: string;
  content: string;
  timestamp: string;
  isUser?: boolean;
}

interface SearchResult {
  message: Message;
  matchedText: string;
  context: string;
  relevanceScore: number;
}

interface AdvancedSearchProps {
  messages: Message[];
  onSelectMessage: (messageId: string) => void;
  onClose: () => void;
  isOpen: boolean;
  className?: string;
}

export const AdvancedSearch: React.FC<AdvancedSearchProps> = ({
  messages,
  onSelectMessage,
  onClose,
  isOpen,
  className = '',
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [filters, setFilters] = useState({
    agent: 'all',
    dateRange: 'all',
    type: 'all', // all, user, agent
    codeOnly: false,
    useRegex: false,
  });
  const [isSearching, setIsSearching] = useState(false);

  // Extract agent names for filter dropdown
  const agents = Array.from(new Set(messages.map(m => m.agentName)));

  // Search function
  const performSearch = () => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    setIsSearching(true);

    setTimeout(() => {
      const searchResults: SearchResult[] = [];

      messages.forEach(message => {
        // Apply filters
        if (filters.agent !== 'all' && message.agentName !== filters.agent) return;
        if (filters.type === 'user' && !message.isUser) return;
        if (filters.type === 'agent' && message.isUser) return;
        if (filters.codeOnly && !message.content.includes('```')) return;

        // Date range filter
        const messageDate = new Date(message.timestamp);
        const now = new Date();
        if (filters.dateRange === 'today') {
          const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          if (messageDate < today) return;
        } else if (filters.dateRange === 'week') {
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          if (messageDate < weekAgo) return;
        } else if (filters.dateRange === 'month') {
          const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          if (messageDate < monthAgo) return;
        }

        // Search in content
        let matches = false;
        let matchedText = '';
        
        try {
          if (filters.useRegex) {
            const regex = new RegExp(searchQuery, 'gi');
            matches = regex.test(message.content);
            if (matches) {
              matchedText = message.content.match(regex)?.[0] || '';
            }
          } else {
            const lowerContent = message.content.toLowerCase();
            const lowerQuery = searchQuery.toLowerCase();
            matches = lowerContent.includes(lowerQuery);
            if (matches) {
              matchedText = searchQuery;
            }
          }
        } catch (error) {
          // Invalid regex
          console.error('Invalid regex:', error);
          matches = false;
        }

        if (matches) {
          // Calculate relevance score
          const queryWords = searchQuery.toLowerCase().split(/\s+/);
          const contentWords = message.content.toLowerCase().split(/\s+/);
          const matchCount = queryWords.filter(word => 
            contentWords.some(cw => cw.includes(word))
          ).length;
          const relevanceScore = (matchCount / queryWords.length) * 100;

          // Extract context (50 chars before and after match)
          const matchIndex = message.content.toLowerCase().indexOf(matchedText.toLowerCase());
          const start = Math.max(0, matchIndex - 50);
          const end = Math.min(message.content.length, matchIndex + matchedText.length + 50);
          const context = (start > 0 ? '...' : '') + 
                         message.content.substring(start, end) + 
                         (end < message.content.length ? '...' : '');

          searchResults.push({
            message,
            matchedText,
            context,
            relevanceScore,
          });
        }
      });

      // Sort by relevance
      searchResults.sort((a, b) => b.relevanceScore - a.relevanceScore);

      setResults(searchResults);
      setIsSearching(false);
    }, 300);
  };

  // Auto-search on query change
  useEffect(() => {
    performSearch();
  }, [searchQuery, filters]);

  // Highlight matched text
  const highlightText = (text: string, query: string) => {
    if (!query) return text;
    
    try {
      const regex = new RegExp(`(${query})`, 'gi');
      const parts = text.split(regex);
      
      return parts.map((part, idx) => 
        regex.test(part) ? (
          <mark key={idx} className="bg-yellow-300 text-slate-900 px-0.5 rounded">
            {part}
          </mark>
        ) : (
          part
        )
      );
    } catch {
      return text;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6">
      <div className={`bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden ${className}`}>
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 bg-gradient-to-r from-blue-50 to-purple-50">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-600 rounded-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">Advanced Search</h2>
                <p className="text-sm text-slate-500">Search across all conversations</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Search Input */}
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search messages, code, agents..."
              className="w-full px-4 py-3 pl-12 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              autoFocus
            />
            <svg className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-5 gap-3 mt-4">
            {/* Agent Filter */}
            <select
              value={filters.agent}
              onChange={(e) => setFilters({ ...filters, agent: e.target.value })}
              className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="all">All Agents</option>
              {agents.map(agent => (
                <option key={agent} value={agent}>{agent}</option>
              ))}
            </select>

            {/* Date Range */}
            <select
              value={filters.dateRange}
              onChange={(e) => setFilters({ ...filters, dateRange: e.target.value })}
              className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">Last 7 Days</option>
              <option value="month">Last 30 Days</option>
            </select>

            {/* Message Type */}
            <select
              value={filters.type}
              onChange={(e) => setFilters({ ...filters, type: e.target.value })}
              className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="all">All Messages</option>
              <option value="user">User Only</option>
              <option value="agent">Agent Only</option>
            </select>

            {/* Code Only Toggle */}
            <label className="flex items-center gap-2 px-3 py-2 border border-slate-300 rounded-lg text-sm cursor-pointer hover:bg-slate-50">
              <input
                type="checkbox"
                checked={filters.codeOnly}
                onChange={(e) => setFilters({ ...filters, codeOnly: e.target.checked })}
                className="w-4 h-4 text-blue-600 rounded"
              />
              <span className="text-slate-700">Code Only</span>
            </label>

            {/* Regex Toggle */}
            <label className="flex items-center gap-2 px-3 py-2 border border-slate-300 rounded-lg text-sm cursor-pointer hover:bg-slate-50">
              <input
                type="checkbox"
                checked={filters.useRegex}
                onChange={(e) => setFilters({ ...filters, useRegex: e.target.checked })}
                className="w-4 h-4 text-blue-600 rounded"
              />
              <span className="text-slate-700">Use Regex</span>
            </label>
          </div>

          {/* Results Count */}
          <div className="mt-3 text-sm text-slate-600">
            {isSearching ? (
              <span>Searching...</span>
            ) : results.length > 0 ? (
              <span>Found <strong>{results.length}</strong> result{results.length !== 1 ? 's' : ''}</span>
            ) : searchQuery ? (
              <span className="text-slate-400">No results found</span>
            ) : null}
          </div>
        </div>

        {/* Results */}
        <div className="overflow-y-auto max-h-[calc(90vh-300px)] custom-scrollbar">
          {results.length > 0 ? (
            <div className="divide-y divide-slate-200">
              {results.map((result, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    onSelectMessage(result.message.id);
                    onClose();
                  }}
                  className="p-4 hover:bg-slate-50 cursor-pointer transition-colors"
                >
                  <div className="flex items-start gap-3">
                    {/* Agent Avatar */}
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center text-white font-bold flex-shrink-0">
                      {result.message.isUser ? '👤' : '🤖'}
                    </div>

                    <div className="flex-1 min-w-0">
                      {/* Message Info */}
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-semibold text-slate-900">
                          {result.message.agentName}
                        </span>
                        <span className="text-xs text-slate-400">
                          {new Date(result.message.timestamp).toLocaleString()}
                        </span>
                        <span className="ml-auto text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                          {result.relevanceScore.toFixed(0)}% match
                        </span>
                      </div>

                      {/* Context with Highlights */}
                      <div className="text-sm text-slate-700 leading-relaxed">
                        {highlightText(result.context, result.matchedText)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : searchQuery && !isSearching ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <p className="text-slate-600 font-medium">No results found</p>
              <p className="text-sm text-slate-400 mt-1">Try adjusting your search or filters</p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <p className="text-slate-600 font-medium">Start searching</p>
              <p className="text-sm text-slate-400 mt-1">Enter a query to search across all conversations</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
