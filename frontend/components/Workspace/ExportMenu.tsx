// components/Workspace/ExportMenu.tsx - Export Conversation Menu
import React, { useState } from 'react';
import { exportConversation, copyToClipboard, shareConversation } from '../../utils/exportConversation';

interface Message {
  id: string;
  agentId: string;
  agentName: string;
  content: string;
  timestamp: string;
  isUser?: boolean;
}

interface ExportMenuProps {
  messages: Message[];
  conversationTitle?: string;
  className?: string;
}

export const ExportMenu: React.FC<ExportMenuProps> = ({
  messages,
  conversationTitle,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const showSuccessToast = (message: string) => {
    setSuccessMessage(message);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleExport = (format: 'markdown' | 'json' | 'html') => {
    exportConversation(messages, format, conversationTitle);
    showSuccessToast(`Exported as ${format.toUpperCase()}`);
    setIsOpen(false);
  };

  const handleCopy = async () => {
    const success = await copyToClipboard(messages, 'markdown');
    if (success) {
      showSuccessToast('Copied to clipboard');
      setIsOpen(false);
    }
  };

  const handleShare = async () => {
    const success = await shareConversation(messages, conversationTitle);
    if (success) {
      showSuccessToast('Shared successfully');
      setIsOpen(false);
    }
  };

  if (messages.length === 0) {
    return null;
  }

  return (
    <div className={`relative ${className}`}>
      {/* Export Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors shadow-sm"
        title="Export conversation"
      >
        <svg className="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <span className="text-sm font-medium text-slate-700">Export</span>
        <svg className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Menu */}
          <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-20">
            <div className="px-4 py-2 border-b border-slate-200">
              <p className="text-xs font-semibold text-slate-500 uppercase">Export Options</p>
            </div>

            {/* Export as Markdown */}
            <button
              onClick={() => handleExport('markdown')}
              className="w-full px-4 py-2.5 flex items-center gap-3 hover:bg-slate-50 transition-colors text-left"
            >
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <span className="text-lg">📝</span>
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium text-slate-900">Markdown</div>
                <div className="text-xs text-slate-500">Plain text format</div>
              </div>
            </button>

            {/* Export as HTML */}
            <button
              onClick={() => handleExport('html')}
              className="w-full px-4 py-2.5 flex items-center gap-3 hover:bg-slate-50 transition-colors text-left"
            >
              <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
                <span className="text-lg">🌐</span>
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium text-slate-900">HTML</div>
                <div className="text-xs text-slate-500">Styled webpage</div>
              </div>
            </button>

            {/* Export as JSON */}
            <button
              onClick={() => handleExport('json')}
              className="w-full px-4 py-2.5 flex items-center gap-3 hover:bg-slate-50 transition-colors text-left"
            >
              <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                <span className="text-lg">💾</span>
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium text-slate-900">JSON</div>
                <div className="text-xs text-slate-500">Data format</div>
              </div>
            </button>

            <div className="border-t border-slate-200 my-2"></div>

            {/* Copy to Clipboard */}
            <button
              onClick={handleCopy}
              className="w-full px-4 py-2.5 flex items-center gap-3 hover:bg-slate-50 transition-colors text-left"
            >
              <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium text-slate-900">Copy to Clipboard</div>
                <div className="text-xs text-slate-500">Copy as markdown</div>
              </div>
            </button>

            {/* Share (if supported) */}
            {typeof window !== 'undefined' && 'share' in navigator && (
              <button
                onClick={handleShare}
                className="w-full px-4 py-2.5 flex items-center gap-3 hover:bg-slate-50 transition-colors text-left"
              >
                <div className="w-10 h-10 rounded-lg bg-pink-100 flex items-center justify-center">
                  <svg className="w-5 h-5 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-slate-900">Share</div>
                  <div className="text-xs text-slate-500">Share conversation</div>
                </div>
              </button>
            )}

            <div className="px-4 py-2 border-t border-slate-200 mt-2">
              <p className="text-xs text-slate-500">
                {messages.length} message{messages.length !== 1 ? 's' : ''} to export
              </p>
            </div>
          </div>
        </>
      )}

      {/* Success Toast */}
      {showSuccess && (
        <div className="fixed bottom-4 right-4 z-50 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3 animate-slide-up">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span className="font-medium">{successMessage}</span>
        </div>
      )}
    </div>
  );
};
