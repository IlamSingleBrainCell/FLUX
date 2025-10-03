// components/Artifacts/DebugConsole.tsx
import React, { useState } from 'react';
import { Artifact } from '../../pages/artifacts';

interface DebugConsoleProps {
  artifact: Artifact;
  onClose: () => void;
}

interface ConsoleMessage {
  type: 'log' | 'error' | 'warn' | 'info' | 'success';
  message: string;
  timestamp: string;
}

export const DebugConsole: React.FC<DebugConsoleProps> = ({ artifact, onClose }) => {
  const [messages, setMessages] = useState<ConsoleMessage[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const addMessage = (type: ConsoleMessage['type'], message: string) => {
    setMessages(prev => [...prev, {
      type,
      message,
      timestamp: new Date().toLocaleTimeString()
    }]);
  };

  const handleRun = async () => {
    setIsRunning(true);
    setMessages([]);
    addMessage('info', `Running ${artifact.language} code...`);

    try {
      if (artifact.language === 'javascript' || artifact.language === 'typescript') {
        // Execute JavaScript code
        try {
          // Create a safe execution context
          const consoleCapture: string[] = [];
          const safeConsole = {
            log: (...args: any[]) => consoleCapture.push(args.join(' ')),
            error: (...args: any[]) => consoleCapture.push(`ERROR: ${args.join(' ')}`),
            warn: (...args: any[]) => consoleCapture.push(`WARN: ${args.join(' ')}`),
            info: (...args: any[]) => consoleCapture.push(`INFO: ${args.join(' ')}`),
          };

          // Execute the code
          const fn = new Function('console', artifact.content);
          fn(safeConsole);

          // Display captured console output
          consoleCapture.forEach(msg => {
            if (msg.startsWith('ERROR:')) {
              addMessage('error', msg);
            } else if (msg.startsWith('WARN:')) {
              addMessage('warn', msg);
            } else if (msg.startsWith('INFO:')) {
              addMessage('info', msg);
            } else {
              addMessage('log', msg);
            }
          });

          addMessage('success', '✓ Execution completed successfully');
        } catch (err: any) {
          addMessage('error', `Runtime Error: ${err.message}`);
        }
      } else if (artifact.language === 'python') {
        addMessage('warn', 'Python execution requires a backend server. Use the API endpoint for execution.');
      } else if (artifact.language === 'java') {
        addMessage('warn', 'Java execution requires compilation. Use the API endpoint for execution.');
      } else if (artifact.language === 'csharp') {
        addMessage('warn', 'C# execution requires compilation. Use the API endpoint for execution.');
      } else {
        addMessage('info', `Preview mode for ${artifact.language}`);
        addMessage('log', artifact.content);
      }
    } catch (err: any) {
      addMessage('error', `Error: ${err.message}`);
    } finally {
      setIsRunning(false);
    }
  };

  const handleClear = () => {
    setMessages([]);
  };

  const getMessageStyle = (type: ConsoleMessage['type']) => {
    switch (type) {
      case 'error': return 'text-red-600 bg-red-50 border-l-4 border-red-600';
      case 'warn': return 'text-yellow-700 bg-yellow-50 border-l-4 border-yellow-600';
      case 'info': return 'text-blue-600 bg-blue-50 border-l-4 border-blue-600';
      case 'success': return 'text-green-600 bg-green-50 border-l-4 border-green-600';
      default: return 'text-gray-800 bg-gray-50';
    }
  };

  const getMessageIcon = (type: ConsoleMessage['type']) => {
    switch (type) {
      case 'error': return '❌';
      case 'warn': return '⚠️';
      case 'info': return 'ℹ️';
      case 'success': return '✅';
      default: return '▶️';
    }
  };

  return (
    <div className="bg-gray-900 rounded-lg shadow-lg border border-gray-700 overflow-hidden">
      {/* Console Header */}
      <div className="bg-gray-800 px-4 py-3 flex items-center justify-between border-b border-gray-700">
        <div className="flex items-center gap-3">
          <span className="text-white font-semibold">🐛 Debug Console</span>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isRunning ? 'bg-green-500 animate-pulse' : 'bg-gray-600'}`}></div>
            <span className="text-sm text-gray-400">
              {isRunning ? 'Running...' : 'Ready'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleRun}
            disabled={isRunning}
            className="px-4 py-1.5 bg-green-600 text-white rounded text-sm hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Run
          </button>
          <button
            onClick={handleClear}
            className="px-4 py-1.5 bg-gray-700 text-white rounded text-sm hover:bg-gray-600 transition-colors"
          >
            Clear
          </button>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-gray-700 text-white rounded text-sm hover:bg-gray-600 transition-colors"
          >
            Close
          </button>
        </div>
      </div>

      {/* Console Output */}
      <div className="h-80 overflow-y-auto p-4 font-mono text-sm">
        {messages.length === 0 ? (
          <div className="text-gray-500 text-center py-12">
            <p>Click "Run" to execute the code</p>
          </div>
        ) : (
          <div className="space-y-2">
            {messages.map((msg, index) => (
              <div key={index} className={`p-3 rounded ${getMessageStyle(msg.type)}`}>
                <div className="flex items-start gap-2">
                  <span>{getMessageIcon(msg.type)}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 text-xs opacity-75 mb-1">
                      <span>{msg.timestamp}</span>
                      <span>•</span>
                      <span>{msg.type.toUpperCase()}</span>
                    </div>
                    <pre className="whitespace-pre-wrap break-words">{msg.message}</pre>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
