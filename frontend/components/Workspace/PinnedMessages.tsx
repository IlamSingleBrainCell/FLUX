// components/Workspace/PinnedMessages.tsx - Pinned Messages Panel
import React from 'react';

interface PinnedMessage {
  id: string;
  agentName: string;
  content: string;
  timestamp: string;
  messageIndex: number;
}

interface PinnedMessagesProps {
  pinnedMessages: PinnedMessage[];
  onJumpToMessage: (index: number) => void;
  onUnpin: (id: string) => void;
  className?: string;
}

export const PinnedMessages: React.FC<PinnedMessagesProps> = ({
  pinnedMessages,
  onJumpToMessage,
  onUnpin,
  className = ''
}) => {
  if (pinnedMessages.length === 0) return null;

  const truncateText = (text: string, maxLength: number = 80) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <div className={`bg-gradient-to-br from-amber-50 to-yellow-50 rounded-lg border border-amber-200 p-4 ${className}`}>
      <div className="flex items-center gap-2 mb-3">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-yellow-500 flex items-center justify-center">
          <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
          </svg>
        </div>
        <h3 className="text-sm font-bold text-slate-900">📌 Pinned Messages ({pinnedMessages.length})</h3>
      </div>

      <div className="space-y-2 max-h-64 overflow-y-auto custom-scrollbar">
        {pinnedMessages.map((msg) => (
          <div
            key={msg.id}
            className="bg-white rounded-lg p-3 border border-amber-200 hover:border-amber-300 transition-colors group"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-semibold text-slate-700">{msg.agentName}</span>
                  <span className="text-xs text-slate-400">
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {truncateText(msg.content)}
                </p>
              </div>

              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => onJumpToMessage(msg.messageIndex)}
                  className="p-1.5 hover:bg-amber-100 rounded-lg transition-colors"
                  title="Jump to message"
                >
                  <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </button>
                <button
                  onClick={() => onUnpin(msg.id)}
                  className="p-1.5 hover:bg-red-100 rounded-lg transition-colors"
                  title="Unpin message"
                >
                  <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-3 pt-3 border-t border-amber-200">
        <div className="text-xs text-slate-500 flex items-center gap-1">
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          Pin important messages for quick reference
        </div>
      </div>
    </div>
  );
};
