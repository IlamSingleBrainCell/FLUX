// components/Artifacts/CodeEditor.tsx
import React, { useState, useEffect } from 'react';
import { Artifact } from '../../pages/artifacts';

interface CodeEditorProps {
  artifact: Artifact;
  onUpdate: (artifact: Artifact) => void;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({ artifact, onUpdate }) => {
  const [content, setContent] = useState(artifact.content);
  const [lineCount, setLineCount] = useState(1);

  useEffect(() => {
    setContent(artifact.content);
    setLineCount(artifact.content.split('\n').length);
  }, [artifact]);

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setContent(newContent);
    setLineCount(newContent.split('\n').length);
    onUpdate({ ...artifact, content: newContent });
  };

  const handleDownload = () => {
    const extension = artifact.language === 'python' ? 'py' :
                     artifact.language === 'java' ? 'java' :
                     artifact.language === 'csharp' ? 'cs' :
                     artifact.language === 'typescript' ? 'ts' :
                     artifact.language === 'javascript' ? 'js' :
                     artifact.language === 'html' ? 'html' :
                     artifact.language === 'css' ? 'css' :
                     artifact.language === 'json' ? 'json' :
                     artifact.language === 'markdown' ? 'md' : 'txt';
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${artifact.title.replace(/\s+/g, '_')}.${extension}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    // Show toast notification
    const toast = document.createElement('div');
    toast.className = 'fixed bottom-4 right-4 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg z-50';
    toast.textContent = '✓ Copied to clipboard';
    document.body.appendChild(toast);
    setTimeout(() => document.body.removeChild(toast), 2000);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* Editor Toolbar */}
      <div className="bg-gray-50 border-b border-gray-200 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span>{lineCount} lines</span>
          <span className="text-gray-400">•</span>
          <span>{content.length} characters</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="px-3 py-1 text-sm text-gray-700 hover:bg-gray-200 rounded transition-colors flex items-center gap-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            Copy
          </button>
          <button
            onClick={handleDownload}
            className="px-3 py-1 text-sm text-gray-700 hover:bg-gray-200 rounded transition-colors flex items-center gap-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download
          </button>
        </div>
      </div>

      {/* Code Editor */}
      <div className="relative">
        {/* Line Numbers */}
        <div className="absolute left-0 top-0 bottom-0 w-12 bg-gray-50 border-r border-gray-200 overflow-hidden">
          <div className="py-4 px-2 text-right text-xs text-gray-500 font-mono leading-6">
            {Array.from({ length: lineCount }, (_, i) => (
              <div key={i + 1}>{i + 1}</div>
            ))}
          </div>
        </div>

        {/* Editor Textarea */}
        <textarea
          value={content}
          onChange={handleContentChange}
          className="w-full h-[600px] pl-14 pr-4 py-4 font-mono text-sm leading-6 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset"
          placeholder="Start typing your code here..."
          spellCheck={false}
        />
      </div>
    </div>
  );
};
