// components/AgentChat/MarkdownRenderer.tsx - Beautiful Markdown Rendering
import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import remarkGfm from 'remark-gfm';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content, className = '' }) => {
  return (
    <div className={`markdown-content ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // Code blocks with syntax highlighting
          code({ node, className, children, ...props }: any) {
            const match = /language-(\w+)/.exec(className || '');
            const codeString = String(children).replace(/\n$/, '');
            const inline = !match;
            
            return !inline ? (
              <CodeBlock language={match[1]} code={codeString} {...props} />
            ) : (
              <code 
                className="bg-slate-800 text-emerald-400 px-1.5 py-0.5 rounded text-xs font-mono" 
                {...props}
              >
                {children}
              </code>
            );
          },
          
          // Links - open in new tab with security
          a({ children, href }) {
            return (
              <a 
                href={href} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-blue-600 hover:text-blue-800 underline hover:no-underline transition-colors"
              >
                {children}
              </a>
            );
          },
          
          // Tables
          table({ children }) {
            return (
              <div className="overflow-x-auto my-4">
                <table className="min-w-full border-collapse border border-slate-300">
                  {children}
                </table>
              </div>
            );
          },
          
          thead({ children }) {
            return <thead className="bg-slate-100">{children}</thead>;
          },
          
          th({ children }) {
            return (
              <th className="border border-slate-300 px-4 py-2 text-left font-semibold text-slate-900">
                {children}
              </th>
            );
          },
          
          td({ children }) {
            return (
              <td className="border border-slate-300 px-4 py-2 text-slate-700">
                {children}
              </td>
            );
          },
          
          // Headings
          h1({ children }) {
            return <h1 className="text-2xl font-bold text-slate-900 mt-6 mb-3">{children}</h1>;
          },
          
          h2({ children }) {
            return <h2 className="text-xl font-bold text-slate-900 mt-5 mb-2">{children}</h2>;
          },
          
          h3({ children }) {
            return <h3 className="text-lg font-semibold text-slate-900 mt-4 mb-2">{children}</h3>;
          },
          
          // Lists
          ul({ children }) {
            return <ul className="list-disc list-inside my-2 space-y-1 text-slate-700">{children}</ul>;
          },
          
          ol({ children }) {
            return <ol className="list-decimal list-inside my-2 space-y-1 text-slate-700">{children}</ol>;
          },
          
          // Blockquotes
          blockquote({ children }) {
            return (
              <blockquote className="border-l-4 border-blue-500 pl-4 py-2 my-3 bg-blue-50 text-slate-700 italic">
                {children}
              </blockquote>
            );
          },
          
          // Paragraphs
          p({ children }) {
            return <p className="my-2 text-slate-700 leading-relaxed">{children}</p>;
          },
          
          // Horizontal rule
          hr() {
            return <hr className="my-4 border-t border-slate-300" />;
          },
          
          // Strong/Bold
          strong({ children }) {
            return <strong className="font-bold text-slate-900">{children}</strong>;
          },
          
          // Emphasis/Italic
          em({ children }) {
            return <em className="italic text-slate-700">{children}</em>;
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

// Code block component with copy button
const CodeBlock: React.FC<{ language: string; code: string }> = ({ language, code }) => {
  const [copied, setCopied] = useState(false);
  
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };
  
  return (
    <div className="relative group my-4">
      {/* Language label and copy button */}
      <div className="flex items-center justify-between bg-slate-800 px-4 py-2 rounded-t-lg">
        <span className="text-xs font-mono text-slate-400 uppercase">{language}</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-3 py-1 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded text-xs font-medium transition-colors"
          title="Copy code"
        >
          {copied ? (
            <>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Copied!
            </>
          ) : (
            <>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Copy
            </>
          )}
        </button>
      </div>
      
      {/* Code content */}
      <SyntaxHighlighter
        style={vscDarkPlus}
        language={language}
        PreTag="div"
        showLineNumbers
        customStyle={{
          margin: 0,
          borderTopLeftRadius: 0,
          borderTopRightRadius: 0,
          borderBottomLeftRadius: '0.5rem',
          borderBottomRightRadius: '0.5rem',
          fontSize: '0.875rem',
        }}
        codeTagProps={{
          style: {
            fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
          },
        }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
};
