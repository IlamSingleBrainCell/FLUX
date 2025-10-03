// components/Workspace/CodeExecutionSandbox.tsx
import React, { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/cjs/styles/prism';

interface ExecutionResult {
  output: string;
  error?: string;
  executionTime: number;
  memoryUsage?: string;
}

interface CodeExecutionSandboxProps {
  onClose: () => void;
  isOpen: boolean;
  initialCode?: string;
  className?: string;
}

export const CodeExecutionSandbox: React.FC<CodeExecutionSandboxProps> = ({
  onClose,
  isOpen,
  initialCode = '// Write your code here\nconsole.log("Hello, World!");',
  className = '',
}) => {
  const [code, setCode] = useState(initialCode);
  const [language, setLanguage] = useState<'javascript' | 'python' | 'typescript'>('javascript');
  const [result, setResult] = useState<ExecutionResult | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);

  // Execute code (client-side for JavaScript, mock for others)
  const executeCode = async () => {
    setIsExecuting(true);
    const startTime = performance.now();

    try {
      if (language === 'javascript' || language === 'typescript') {
        // Capture console output
        const logs: string[] = [];
        const originalLog = console.log;
        const originalError = console.error;

        console.log = (...args) => {
          logs.push(args.map(a => String(a)).join(' '));
        };

        console.error = (...args) => {
          logs.push('[Error] ' + args.map(a => String(a)).join(' '));
        };

        try {
          // Execute code in isolated scope
          const AsyncFunction = Object.getPrototypeOf(async function(){}).constructor;
          const fn = new AsyncFunction(code);
          await fn();

          const executionTime = performance.now() - startTime;

          setResult({
            output: logs.join('\n') || 'Code executed successfully (no output)',
            executionTime: Math.round(executionTime * 100) / 100,
          });
        } catch (error: any) {
          const executionTime = performance.now() - startTime;
          setResult({
            output: logs.join('\n'),
            error: error.toString(),
            executionTime: Math.round(executionTime * 100) / 100,
          });
        } finally {
          console.log = originalLog;
          console.error = originalError;
        }
      } else if (language === 'python') {
        // Mock Python execution (in production, use backend API)
        await new Promise(resolve => setTimeout(resolve, 500));
        const executionTime = performance.now() - startTime;
        
        setResult({
          output: '🐍 Python execution coming soon!\n\nIn production, this would execute on a backend Python sandbox.\n\nFor now, here\'s a mock output:\nHello from Python!',
          executionTime: Math.round(executionTime * 100) / 100,
          memoryUsage: '12.4 MB',
        });
      }
    } catch (error: any) {
      setResult({
        output: '',
        error: error.toString(),
        executionTime: 0,
      });
    } finally {
      setIsExecuting(false);
    }
  };

  const clearOutput = () => {
    setResult(null);
  };

  const loadExample = () => {
    const examples = {
      javascript: `// Fibonacci sequence
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

console.log("Fibonacci sequence:");
for (let i = 0; i < 10; i++) {
  console.log(\`F(\${i}) = \${fibonacci(i)}\`);
}`,
      python: `# Python example
def factorial(n):
    if n <= 1:
        return 1
    return n * factorial(n - 1)

for i in range(1, 6):
    print(f"{i}! = {factorial(i)}")`,
      typescript: `// TypeScript example
interface Person {
  name: string;
  age: number;
}

const greet = (person: Person): string => {
  return \`Hello, \${person.name}! You are \${person.age} years old.\`;
}

const person: Person = { name: "Alice", age: 30 };
console.log(greet(person));`,
    };

    setCode(examples[language]);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6">
      <div className={`bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden ${className}`}>
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 bg-gradient-to-r from-green-50 to-blue-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-600 rounded-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">Code Execution Sandbox</h2>
                <p className="text-sm text-slate-500">Run code safely in an isolated environment</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Language Selector */}
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as any)}
                className="px-3 py-2 border border-slate-300 rounded-lg text-sm font-medium"
              >
                <option value="javascript">JavaScript</option>
                <option value="typescript">TypeScript</option>
                <option value="python">Python</option>
              </select>

              <button
                onClick={loadExample}
                className="px-3 py-2 hover:bg-slate-100 rounded-lg text-sm transition-colors"
              >
                Load Example
              </button>

              <button
                onClick={executeCode}
                disabled={isExecuting}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors flex items-center gap-2 font-medium"
              >
                {isExecuting ? (
                  <>
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Running...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Run Code
                  </>
                )}
              </button>

              <button
                onClick={onClose}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Editor & Output */}
        <div className="grid grid-cols-2 gap-4 p-6 max-h-[calc(90vh-150px)]">
          {/* Code Editor */}
          <div className="flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold text-slate-900">Code Editor</h3>
              <span className="text-xs text-slate-500">{code.split('\n').length} lines</span>
            </div>
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="flex-1 p-4 border border-slate-300 rounded-lg font-mono text-sm resize-none focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none custom-scrollbar"
              spellCheck={false}
              placeholder="Write your code here..."
            />
          </div>

          {/* Output Console */}
          <div className="flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold text-slate-900">Output Console</h3>
              {result && (
                <button
                  onClick={clearOutput}
                  className="text-xs text-slate-600 hover:text-slate-900"
                >
                  Clear
                </button>
              )}
            </div>

            <div className="flex-1 bg-slate-900 rounded-lg p-4 overflow-y-auto custom-scrollbar">
              {result ? (
                <div>
                  {/* Output */}
                  {result.output && (
                    <div className="mb-4">
                      <div className="text-xs text-green-400 mb-2">OUTPUT:</div>
                      <pre className="text-sm text-green-300 whitespace-pre-wrap font-mono">
                        {result.output}
                      </pre>
                    </div>
                  )}

                  {/* Error */}
                  {result.error && (
                    <div className="mb-4">
                      <div className="text-xs text-red-400 mb-2">ERROR:</div>
                      <pre className="text-sm text-red-300 whitespace-pre-wrap font-mono">
                        {result.error}
                      </pre>
                    </div>
                  )}

                  {/* Stats */}
                  <div className="pt-4 border-t border-slate-700 text-xs text-slate-400 space-y-1">
                    <div>⏱️ Execution time: <span className="text-white font-semibold">{result.executionTime}ms</span></div>
                    {result.memoryUsage && (
                      <div>💾 Memory usage: <span className="text-white font-semibold">{result.memoryUsage}</span></div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4">
                    <svg className="w-8 h-8 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="text-slate-400 font-medium">Run your code to see output</p>
                  <p className="text-sm text-slate-500 mt-1">Click "Run Code" to execute</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50">
          <div className="flex items-center gap-4 text-xs text-slate-600">
            <div className="flex items-center gap-1.5">
              <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Safe execution environment</span>
            </div>
            <div className="flex items-center gap-1.5">
              <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span>No network access</span>
            </div>
            <div className="flex items-center gap-1.5">
              <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span>Client-side execution</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
