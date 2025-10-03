// components/Workspace/MessageReactions.tsx - Message Reactions & Feedback System
import React, { useState } from 'react';

interface Reaction {
  emoji: string;
  count: number;
  users: string[];
}

interface MessageReactionsProps {
  messageId: string;
  reactions?: Reaction[];
  onReact?: (emoji: string) => void;
  onCopy?: () => void;
  onRegenerate?: () => void;
  onPin?: () => void;
  onRate?: (rating: number) => void;
  isPinned?: boolean;
  rating?: number;
}

export const MessageReactions: React.FC<MessageReactionsProps> = ({
  messageId,
  reactions = [],
  onReact,
  onCopy,
  onRegenerate,
  onPin,
  onRate,
  isPinned = false,
  rating
}) => {
  const [showRating, setShowRating] = useState(false);
  const [showAllEmojis, setShowAllEmojis] = useState(false);
  const [copied, setCopied] = useState(false);

  const commonEmojis = ['👍', '❤️', '🎉', '🚀', '💡', '🔥'];
  
  const handleReact = (emoji: string) => {
    onReact?.(emoji);
  };

  const handleCopy = () => {
    onCopy?.();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRate = (stars: number) => {
    onRate?.(stars);
    setShowRating(false);
  };

  return (
    <div className="mt-2 space-y-2">
      {/* Existing Reactions */}
      {reactions.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {reactions.map((reaction, idx) => (
            <button
              key={idx}
              onClick={() => handleReact(reaction.emoji)}
              className="px-2 py-1 bg-slate-100 hover:bg-slate-200 rounded-full text-sm transition-colors flex items-center gap-1"
              title={`${reaction.users.join(', ')} reacted`}
            >
              <span>{reaction.emoji}</span>
              <span className="text-xs font-medium text-slate-600">{reaction.count}</span>
            </button>
          ))}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Quick Reactions */}
        <div className="flex items-center gap-1 border-r border-slate-200 pr-2">
          {commonEmojis.slice(0, 4).map(emoji => (
            <button
              key={emoji}
              onClick={() => handleReact(emoji)}
              className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors text-lg"
              title={`React with ${emoji}`}
            >
              {emoji}
            </button>
          ))}
          <button
            onClick={() => setShowAllEmojis(!showAllEmojis)}
            className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors text-sm text-slate-600"
            title="More reactions"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
            </svg>
          </button>
        </div>

        {/* Copy Button */}
        <button
          onClick={handleCopy}
          className="px-2.5 py-1.5 hover:bg-slate-100 rounded-lg transition-colors flex items-center gap-1.5 text-sm text-slate-600 hover:text-slate-900"
          title="Copy message"
        >
          {copied ? (
            <>
              <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-green-600 font-medium">Copied!</span>
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <span>Copy</span>
            </>
          )}
        </button>

        {/* Regenerate Button */}
        {onRegenerate && (
          <button
            onClick={onRegenerate}
            className="px-2.5 py-1.5 hover:bg-slate-100 rounded-lg transition-colors flex items-center gap-1.5 text-sm text-slate-600 hover:text-slate-900"
            title="Regenerate response"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span>Regenerate</span>
          </button>
        )}

        {/* Pin Button */}
        <button
          onClick={onPin}
          className={`px-2.5 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 text-sm ${
            isPinned 
              ? 'bg-blue-50 text-blue-600 hover:bg-blue-100' 
              : 'hover:bg-slate-100 text-slate-600 hover:text-slate-900'
          }`}
          title={isPinned ? "Unpin message" : "Pin message"}
        >
          <svg className="w-4 h-4" fill={isPinned ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
          </svg>
          <span>{isPinned ? 'Pinned' : 'Pin'}</span>
        </button>

        {/* Rating Button */}
        <button
          onClick={() => setShowRating(!showRating)}
          className="px-2.5 py-1.5 hover:bg-slate-100 rounded-lg transition-colors flex items-center gap-1.5 text-sm text-slate-600 hover:text-slate-900"
          title="Rate response"
        >
          <svg className="w-4 h-4" fill={rating ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
          </svg>
          <span>Rate</span>
          {rating && <span className="text-yellow-600 font-semibold">({rating})</span>}
        </button>
      </div>

      {/* All Emojis Panel */}
      {showAllEmojis && (
        <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
          <div className="flex flex-wrap gap-2">
            {['👍', '👎', '❤️', '🎉', '🚀', '💡', '🔥', '✅', '⭐', '💯', '🙌', '👏', '🤔', '😊', '😂', '😍'].map(emoji => (
              <button
                key={emoji}
                onClick={() => {
                  handleReact(emoji);
                  setShowAllEmojis(false);
                }}
                className="p-2 hover:bg-white rounded-lg transition-colors text-xl"
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Rating Panel */}
      {showRating && (
        <div className="p-3 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
          <div className="text-sm font-medium text-slate-700 mb-2">Rate this response:</div>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map(stars => (
              <button
                key={stars}
                onClick={() => handleRate(stars)}
                className="group"
                title={`${stars} star${stars > 1 ? 's' : ''}`}
              >
                {Array.from({ length: stars }).map((_, i) => (
                  <svg
                    key={i}
                    className="w-6 h-6 inline text-yellow-400 group-hover:text-yellow-500 transition-colors"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
