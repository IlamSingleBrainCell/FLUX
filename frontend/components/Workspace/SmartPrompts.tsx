// components/Workspace/SmartPrompts.tsx - Smart Suggested Prompts
import React, { useState, useEffect } from 'react';

interface SmartPromptsProps {
  lastMessage?: string;
  context?: string;
  onSelectPrompt: (prompt: string) => void;
  className?: string;
}

interface Suggestion {
  icon: string;
  text: string;
  category: 'optimize' | 'test' | 'explain' | 'debug' | 'extend';
}

export const SmartPrompts: React.FC<SmartPromptsProps> = ({
  lastMessage = '',
  context = '',
  onSelectPrompt,
  className = ''
}) => {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    // Generate context-aware suggestions
    const newSuggestions = generateSuggestions(lastMessage, context);
    setSuggestions(newSuggestions);
  }, [lastMessage, context]);

  const generateSuggestions = (lastMsg: string, ctx: string): Suggestion[] => {
    const baseSuggestions: Suggestion[] = [];
    
    // Code-related suggestions
    if (lastMsg.includes('```') || ctx.includes('code')) {
      baseSuggestions.push(
        { icon: '⚡', text: 'Optimize this code for performance', category: 'optimize' },
        { icon: '🧪', text: 'Write unit tests for this', category: 'test' },
        { icon: '🔍', text: 'Explain this code line by line', category: 'explain' },
        { icon: '🛡️', text: 'Add error handling and validation', category: 'extend' },
        { icon: '📚', text: 'Add comprehensive documentation', category: 'extend' }
      );
    }

    // Error/Bug related
    if (lastMsg.toLowerCase().includes('error') || lastMsg.toLowerCase().includes('bug')) {
      baseSuggestions.push(
        { icon: '🐛', text: 'Debug this issue step by step', category: 'debug' },
        { icon: '🔧', text: 'Suggest alternative approaches', category: 'optimize' },
        { icon: '📊', text: 'Show common causes of this error', category: 'explain' }
      );
    }

    // Architecture/Design
    if (lastMsg.toLowerCase().includes('architecture') || lastMsg.toLowerCase().includes('design')) {
      baseSuggestions.push(
        { icon: '🏗️', text: 'Review architecture for scalability', category: 'optimize' },
        { icon: '📐', text: 'Suggest design patterns', category: 'extend' },
        { icon: '🔐', text: 'Add security considerations', category: 'extend' }
      );
    }

    // Database related
    if (lastMsg.toLowerCase().includes('database') || lastMsg.toLowerCase().includes('sql')) {
      baseSuggestions.push(
        { icon: '⚡', text: 'Optimize database queries', category: 'optimize' },
        { icon: '🔒', text: 'Add SQL injection protection', category: 'extend' },
        { icon: '📈', text: 'Suggest indexing strategy', category: 'optimize' }
      );
    }

    // API related
    if (lastMsg.toLowerCase().includes('api') || lastMsg.toLowerCase().includes('endpoint')) {
      baseSuggestions.push(
        { icon: '🔑', text: 'Add authentication & authorization', category: 'extend' },
        { icon: '📝', text: 'Generate API documentation', category: 'extend' },
        { icon: '✅', text: 'Add input validation', category: 'extend' }
      );
    }

    // Generic suggestions (always available)
    const genericSuggestions: Suggestion[] = [
      { icon: '💡', text: 'Explain in simpler terms', category: 'explain' },
      { icon: '🚀', text: 'Show best practices for this', category: 'optimize' },
      { icon: '📚', text: 'Provide examples and use cases', category: 'explain' },
      { icon: '🎯', text: 'What are the next steps?', category: 'extend' },
      { icon: '⚠️', text: 'What could go wrong?', category: 'debug' }
    ];

    // Combine and deduplicate
    const allSuggestions = [...baseSuggestions, ...genericSuggestions];
    const uniqueSuggestions = allSuggestions.filter((sug, idx, self) => 
      idx === self.findIndex(s => s.text === sug.text)
    );

    return uniqueSuggestions.slice(0, 10);
  };

  const displayedSuggestions = showAll ? suggestions : suggestions.slice(0, 4);

  if (suggestions.length === 0) return null;

  return (
    <div className={`bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-200 p-4 ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <h3 className="text-sm font-bold text-slate-900">💡 Suggested Next Steps</h3>
        </div>
        {suggestions.length > 4 && (
          <button
            onClick={() => setShowAll(!showAll)}
            className="text-xs text-blue-600 hover:text-blue-700 font-medium"
          >
            {showAll ? 'Show Less' : `+${suggestions.length - 4} More`}
          </button>
        )}
      </div>

      <div className="space-y-2">
        {displayedSuggestions.map((suggestion, idx) => (
          <button
            key={idx}
            onClick={() => onSelectPrompt(suggestion.text)}
            className="w-full px-3 py-2.5 bg-white hover:bg-blue-50 rounded-lg text-left transition-all hover:shadow-md border border-blue-100 hover:border-blue-300 group"
          >
            <div className="flex items-center gap-2">
              <span className="text-lg group-hover:scale-110 transition-transform">{suggestion.icon}</span>
              <span className="text-sm text-slate-700 group-hover:text-blue-700 font-medium">{suggestion.text}</span>
              <svg className="w-4 h-4 ml-auto text-slate-400 group-hover:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </div>
          </button>
        ))}
      </div>

      <div className="mt-3 pt-3 border-t border-blue-200">
        <div className="text-xs text-slate-500 flex items-center gap-1">
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          Click any suggestion to continue the conversation
        </div>
      </div>
    </div>
  );
};
