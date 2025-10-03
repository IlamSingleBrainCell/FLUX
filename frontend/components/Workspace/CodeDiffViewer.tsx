// components/Workspace/CodeDiffViewer.tsx
import React, { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/cjs/styles/prism';

interface DiffLine {
  type: 'added' | 'removed' | 'unchanged';
  lineNumber: number;
  content: string;
}

interface CodeDiffViewerProps {
  originalCode: string;
  modifiedCode: string;
  language?: string;
  fileName?: string;
  onAccept?: () => void;
  onReject?: () => void;
  className?: string;
}

export const CodeDiffViewer: React.FC<CodeDiffViewerProps> = ({
  originalCode,
  modifiedCode,
  language = 'typescript',
  fileName = 'file.tsx',
  onAccept,
  onReject,
  className = '',
}) => {
  const [viewMode, setViewMode] = useState<'split' | 'unified'>('split');
  const [showOnlyChanges, setShowOnlyChanges] = useState(false);

  // Simple diff algorithm (for production, use a library like diff-match-patch)
  const generateDiff = (): DiffLine[] => {
    const originalLines = originalCode.split('\n');
    const modifiedLines = modifiedCode.split('\n');
    const diff: DiffLine[] = [];

    const maxLength = Math.max(originalLines.length, modifiedLines.length);

    for (let i = 0; i < maxLength; i++) {
      const origLine = originalLines[i];
      const modLine = modifiedLines[i];

      if (origLine === modLine) {
        if (!showOnlyChanges) {
          diff.push({ type: 'unchanged', lineNumber: i + 1, content: origLine || '' });
        }
      } else {
        if (origLine !== undefined) {
          diff.push({ type: 'removed', lineNumber: i + 1, content: origLine });
        }
        if (modLine !== undefined) {
          diff.push({ type: 'added', lineNumber: i + 1, content: modLine });
        }
      }
    }

    return diff;
  };

  const diff = generateDiff();
  const stats = {
    added: diff.filter(d => d.type === 'added').length,
    removed: diff.filter(d => d.type === 'removed').length,
    unchanged: diff.filter(d => d.type === 'unchanged').length,
  };

  return (
    <div className={`bg-white rounded-xl shadow-lg border border-slate-200 ${className}`}>
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Code Diff Viewer</h3>
              <p className="text-sm text-slate-500">{fileName}</p>
            </div>
          </div>
          
          {/* View Mode Toggle */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('split')}
                className={`px-3 py-1.5 rounded text-sm font-medium transition-all ${
                  viewMode === 'split'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Split View
              </button>
              <button
                onClick={() => setViewMode('unified')}
                className={`px-3 py-1.5 rounded text-sm font-medium transition-all ${
                  viewMode === 'unified'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Unified View
              </button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 bg-green-500 rounded-full"></span>
              <span className="text-green-700 font-semibold">{stats.added} additions</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 bg-red-500 rounded-full"></span>
              <span className="text-red-700 font-semibold">{stats.removed} deletions</span>
            </div>
          </div>

          {/* Show Only Changes Toggle */}
          <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
            <input
              type="checkbox"
              checked={showOnlyChanges}
              onChange={(e) => setShowOnlyChanges(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
            />
            Show only changes
          </label>
        </div>
      </div>

      {/* Diff Content */}
      <div className="p-6">
        {viewMode === 'split' ? (
          // Split View
          <div className="grid grid-cols-2 gap-4">
            {/* Original Code */}
            <div className="border border-slate-200 rounded-lg overflow-hidden">
              <div className="px-4 py-2 bg-red-50 border-b border-red-200 flex items-center gap-2">
                <span className="text-sm font-semibold text-red-700">Original</span>
              </div>
              <div className="overflow-x-auto max-h-[500px] custom-scrollbar">
                <SyntaxHighlighter
                  language={language}
                  style={vscDarkPlus}
                  customStyle={{ margin: 0, fontSize: '13px', background: '#1e293b' }}
                  showLineNumbers
                  wrapLines
                >
                  {originalCode}
                </SyntaxHighlighter>
              </div>
            </div>

            {/* Modified Code */}
            <div className="border border-slate-200 rounded-lg overflow-hidden">
              <div className="px-4 py-2 bg-green-50 border-b border-green-200 flex items-center gap-2">
                <span className="text-sm font-semibold text-green-700">Modified</span>
              </div>
              <div className="overflow-x-auto max-h-[500px] custom-scrollbar">
                <SyntaxHighlighter
                  language={language}
                  style={vscDarkPlus}
                  customStyle={{ margin: 0, fontSize: '13px', background: '#1e293b' }}
                  showLineNumbers
                  wrapLines
                >
                  {modifiedCode}
                </SyntaxHighlighter>
              </div>
            </div>
          </div>
        ) : (
          // Unified View
          <div className="border border-slate-200 rounded-lg overflow-hidden">
            <div className="overflow-x-auto max-h-[500px] custom-scrollbar">
              <div className="font-mono text-sm">
                {diff.map((line, idx) => (
                  <div
                    key={idx}
                    className={`flex items-start px-4 py-1 ${
                      line.type === 'added'
                        ? 'bg-green-50 text-green-900'
                        : line.type === 'removed'
                        ? 'bg-red-50 text-red-900'
                        : 'bg-white text-slate-900'
                    }`}
                  >
                    <span
                      className={`inline-block w-12 text-right mr-4 select-none ${
                        line.type === 'added'
                          ? 'text-green-600'
                          : line.type === 'removed'
                          ? 'text-red-600'
                          : 'text-slate-400'
                      }`}
                    >
                      {line.lineNumber}
                    </span>
                    <span
                      className={`inline-block w-6 mr-2 font-bold ${
                        line.type === 'added'
                          ? 'text-green-600'
                          : line.type === 'removed'
                          ? 'text-red-600'
                          : 'text-slate-300'
                      }`}
                    >
                      {line.type === 'added' ? '+' : line.type === 'removed' ? '-' : ' '}
                    </span>
                    <span className="flex-1 whitespace-pre-wrap break-all">{line.content}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      {(onAccept || onReject) && (
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="text-sm text-slate-600">
            Review the changes and decide to accept or reject
          </div>
          <div className="flex gap-3">
            {onReject && (
              <button
                onClick={onReject}
                className="px-4 py-2 bg-white border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-all flex items-center gap-2 font-medium"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Reject
              </button>
            )}
            {onAccept && (
              <button
                onClick={onAccept}
                className="px-4 py-2 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-lg hover:shadow-lg transition-all flex items-center gap-2 font-medium"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Accept Changes
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
