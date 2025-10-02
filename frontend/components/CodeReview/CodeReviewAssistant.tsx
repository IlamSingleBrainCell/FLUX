import React, { useState } from 'react';

interface CodeIssue {
  id: string;
  type: 'security' | 'performance' | 'code-smell' | 'compliance' | 'style';
  severity: 'critical' | 'high' | 'medium' | 'low';
  line: number;
  file: string;
  message: string;
  suggestion: string;
  autoFixable: boolean;
}

export const CodeReviewAssistant: React.FC = () => {
  const [analyzing, setAnalyzing] = useState(false);
  const [issues, setIssues] = useState<CodeIssue[]>([
    {
      id: '1',
      type: 'security',
      severity: 'critical',
      line: 42,
      file: 'backend/auth/login.py',
      message: 'SQL Injection vulnerability detected',
      suggestion: 'Use parameterized queries instead of string concatenation',
      autoFixable: true
    },
    {
      id: '2',
      type: 'performance',
      severity: 'high',
      line: 156,
      file: 'frontend/components/Dashboard.tsx',
      message: 'Inefficient re-rendering detected',
      suggestion: 'Wrap component in React.memo() or use useMemo for expensive calculations',
      autoFixable: false
    },
    {
      id: '3',
      type: 'code-smell',
      severity: 'medium',
      line: 89,
      file: 'backend/services/data_processor.py',
      message: 'Function complexity exceeds 10 (current: 15)',
      suggestion: 'Extract logic into smaller, testable functions',
      autoFixable: false
    },
    {
      id: '4',
      type: 'compliance',
      severity: 'high',
      line: 23,
      file: 'backend/models/user.py',
      message: 'Missing GDPR compliance: PII data not encrypted',
      suggestion: 'Add encryption for email, phone, and address fields',
      autoFixable: false
    },
    {
      id: '5',
      type: 'style',
      severity: 'low',
      line: 67,
      file: 'frontend/pages/projects.tsx',
      message: 'Inconsistent naming convention',
      suggestion: 'Use camelCase for variable names (found: snake_case)',
      autoFixable: true
    }
  ]);

  const [filter, setFilter] = useState<'all' | CodeIssue['type']>('all');
  const [sortBy, setSortBy] = useState<'severity' | 'file' | 'type'>('severity');

  const severityColors = {
    critical: 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 border-red-300 dark:border-red-700',
    high: 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300 border-orange-300 dark:border-orange-700',
    medium: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 border-yellow-300 dark:border-yellow-700',
    low: 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 border-blue-300 dark:border-blue-700'
  };

  const typeIcons = {
    security: '🔒',
    performance: '⚡',
    'code-smell': '👃',
    compliance: '📋',
    style: '🎨'
  };

  const runAnalysis = () => {
    setAnalyzing(true);
    setTimeout(() => {
      setAnalyzing(false);
      alert('Code analysis complete! 5 issues found.');
    }, 2000);
  };

  const autoFix = (issueId: string) => {
    alert(`Auto-fixing issue ${issueId}...`);
    setIssues(prev => prev.filter(i => i.id !== issueId));
  };

  const filteredIssues = issues.filter(issue => filter === 'all' || issue.type === filter);

  const sortedIssues = [...filteredIssues].sort((a, b) => {
    if (sortBy === 'severity') {
      const severityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
      return severityOrder[a.severity] - severityOrder[b.severity];
    } else if (sortBy === 'file') {
      return a.file.localeCompare(b.file);
    } else {
      return a.type.localeCompare(b.type);
    }
  });

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">🔍 AI Code Review Assistant</h2>
        <p className="text-blue-100">Automated code analysis with security scanning and compliance checks</p>
      </div>

      {/* Controls */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="flex gap-3">
            <button
              onClick={runAnalysis}
              disabled={analyzing}
              className={`px-6 py-2 rounded-lg font-medium transition ${
                analyzing
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              {analyzing ? '🔄 Analyzing...' : '▶️ Run Analysis'}
            </button>
            <button className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition">
              ✅ Auto-Fix All
            </button>
            <button className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition">
              📊 Generate Report
            </button>
          </div>

          <div className="flex gap-3">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="all">All Issues</option>
              <option value="security">Security</option>
              <option value="performance">Performance</option>
              <option value="code-smell">Code Smells</option>
              <option value="compliance">Compliance</option>
              <option value="style">Style</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="severity">Sort by Severity</option>
              <option value="file">Sort by File</option>
              <option value="type">Sort by Type</option>
            </select>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-5 gap-4 p-6 bg-gray-50 dark:bg-gray-900/50">
        <div className="text-center">
          <p className="text-2xl font-bold text-red-600 dark:text-red-400">
            {issues.filter(i => i.severity === 'critical').length}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Critical</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
            {issues.filter(i => i.severity === 'high').length}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">High</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
            {issues.filter(i => i.severity === 'medium').length}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Medium</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {issues.filter(i => i.severity === 'low').length}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Low</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">
            {issues.filter(i => i.autoFixable).length}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Auto-fixable</p>
        </div>
      </div>

      {/* Issues List */}
      <div className="p-6 space-y-4 max-h-[600px] overflow-y-auto">
        {sortedIssues.map(issue => (
          <div
            key={issue.id}
            className={`border-l-4 rounded-lg p-4 ${severityColors[issue.severity]}`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">{typeIcons[issue.type]}</span>
                  <div>
                    <h3 className="font-semibold text-lg">{issue.message}</h3>
                    <p className="text-sm opacity-80">
                      {issue.file}:{issue.line}
                    </p>
                  </div>
                </div>
                <div className="mt-3 bg-white/50 dark:bg-black/20 rounded-lg p-3">
                  <p className="text-sm font-medium mb-1">💡 Suggestion:</p>
                  <p className="text-sm">{issue.suggestion}</p>
                </div>
              </div>
              <div className="flex flex-col gap-2 ml-4">
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${severityColors[issue.severity]}`}>
                  {issue.severity}
                </span>
                {issue.autoFixable && (
                  <button
                    onClick={() => autoFix(issue.id)}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 transition"
                  >
                    🔧 Auto-Fix
                  </button>
                )}
                <button className="px-4 py-2 bg-gray-600 text-white rounded-lg text-sm hover:bg-gray-700 transition">
                  👁️ View Code
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
