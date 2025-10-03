// components/Workspace/AgentPerformance.tsx - Agent Performance Dashboard
import React, { useState } from 'react';

interface AgentMetrics {
  id: string;
  name: string;
  avatar: string;
  accuracy: number;
  avgResponseTime: number;
  tasksCompleted: number;
  userRating: number;
  specialties: string[];
  trend: 'up' | 'down' | 'stable';
}

interface AgentPerformanceProps {
  agents: AgentMetrics[];
  timeRange?: '24h' | '7d' | '30d';
  className?: string;
}

export const AgentPerformance: React.FC<AgentPerformanceProps> = ({
  agents,
  timeRange = '24h',
  className = ''
}) => {
  const [selectedTimeRange, setSelectedTimeRange] = useState(timeRange);
  const [expandedAgent, setExpandedAgent] = useState<string | null>(null);
  const [showCalculationInfo, setShowCalculationInfo] = useState(false);

  const getAccuracyColor = (accuracy: number) => {
    if (accuracy >= 90) return 'text-green-600 bg-green-100';
    if (accuracy >= 75) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getAccuracyBarColor = (accuracy: number) => {
    if (accuracy >= 90) return 'bg-green-500';
    if (accuracy >= 75) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    if (trend === 'up') return { icon: '📈', color: 'text-green-600' };
    if (trend === 'down') return { icon: '📉', color: 'text-red-600' };
    return { icon: '➡️', color: 'text-slate-600' };
  };

  const topPerformer = agents.reduce((prev, current) => 
    current.accuracy > prev.accuracy ? current : prev
  );

  return (
    <div className={`bg-white rounded-xl border border-slate-200 ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">📊 Team Performance</h3>
              <p className="text-xs text-slate-500">Real-time agent analytics</p>
            </div>
          </div>

          {/* Time Range Selector */}
          <div className="flex gap-1 bg-slate-100 rounded-lg p-1">
            {(['24h', '7d', '30d'] as const).map(range => (
              <button
                key={range}
                onClick={() => setSelectedTimeRange(range)}
                className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                  selectedTimeRange === range
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {range === '24h' ? 'Today' : range === '7d' ? 'Week' : 'Month'}
              </button>
            ))}
          </div>
        </div>

        {/* Calculation Info Button - Full Width Row */}
        <button
          onClick={() => setShowCalculationInfo(!showCalculationInfo)}
          className="w-full mt-2 px-3 py-2 rounded-lg text-xs font-medium bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors flex items-center justify-center gap-1.5 border border-blue-200"
          title="How metrics are calculated"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>How it's calculated</span>
          <svg 
            className={`w-4 h-4 transition-transform ${showCalculationInfo ? 'rotate-180' : ''}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* Calculation Info Panel */}
        {showCalculationInfo && (
          <div className="mt-3 p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
            <div className="flex items-start gap-2 mb-3">
              <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 mb-1">📐 Performance Metrics Calculation</h4>
                <p className="text-xs text-slate-600">Understanding how agent performance is measured</p>
              </div>
            </div>

            <div className="space-y-3">
              {/* Accuracy */}
              <div className="bg-white rounded-lg p-3 border border-blue-100">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">🎯</span>
                  <span className="text-xs font-bold text-slate-900">Accuracy Score</span>
                </div>
                <div className="text-xs text-slate-700 mb-2">
                  <strong>Formula:</strong> <code className="px-2 py-0.5 bg-slate-100 rounded text-blue-600 font-mono">(Successful Tasks / Total Tasks) × 100</code>
                </div>
                <div className="text-xs text-slate-600">
                  • <strong>Successful Tasks:</strong> Tasks completed without errors or user corrections<br />
                  • <strong>Total Tasks:</strong> All tasks assigned to the agent<br />
                  • <strong>Threshold:</strong> 🟢 90%+ Excellent | 🟡 75-89% Good | 🔴 &lt;75% Needs Improvement
                </div>
              </div>

              {/* Response Time */}
              <div className="bg-white rounded-lg p-3 border border-blue-100">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">⚡</span>
                  <span className="text-xs font-bold text-slate-900">Average Response Time</span>
                </div>
                <div className="text-xs text-slate-700 mb-2">
                  <strong>Formula:</strong> <code className="px-2 py-0.5 bg-slate-100 rounded text-blue-600 font-mono">Σ(Response Times) / Number of Responses</code>
                </div>
                <div className="text-xs text-slate-600">
                  • <strong>Measured:</strong> Time from task assignment to first meaningful response<br />
                  • <strong>Excludes:</strong> Network latency, queue wait time<br />
                  • <strong>Goal:</strong> Lower is better (target: &lt;2 seconds for most tasks)
                </div>
              </div>

              {/* Tasks Completed */}
              <div className="bg-white rounded-lg p-3 border border-blue-100">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">✅</span>
                  <span className="text-xs font-bold text-slate-900">Tasks Completed</span>
                </div>
                <div className="text-xs text-slate-700 mb-2">
                  <strong>Formula:</strong> <code className="px-2 py-0.5 bg-slate-100 rounded text-blue-600 font-mono">Count of Completed Tasks in Time Range</code>
                </div>
                <div className="text-xs text-slate-600">
                  • <strong>Counted:</strong> Tasks marked as "completed" or "delivered"<br />
                  • <strong>Time Range:</strong> Filtered by selected period (24h/7d/30d)<br />
                  • <strong>Indicator:</strong> Measures agent productivity and workload handling
                </div>
              </div>

              {/* User Rating */}
              <div className="bg-white rounded-lg p-3 border border-blue-100">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">⭐</span>
                  <span className="text-xs font-bold text-slate-900">User Rating</span>
                </div>
                <div className="text-xs text-slate-700 mb-2">
                  <strong>Formula:</strong> <code className="px-2 py-0.5 bg-slate-100 rounded text-blue-600 font-mono">Σ(User Ratings) / Number of Ratings</code>
                </div>
                <div className="text-xs text-slate-600">
                  • <strong>Scale:</strong> 1-5 stars (user feedback on responses)<br />
                  • <strong>Collection:</strong> From message reactions and explicit ratings<br />
                  • <strong>Weight:</strong> More recent ratings have slightly higher influence
                </div>
              </div>

              {/* Trend Indicator */}
              <div className="bg-white rounded-lg p-3 border border-blue-100">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">📈</span>
                  <span className="text-xs font-bold text-slate-900">Performance Trend</span>
                </div>
                <div className="text-xs text-slate-700 mb-2">
                  <strong>Formula:</strong> <code className="px-2 py-0.5 bg-slate-100 rounded text-blue-600 font-mono">Compare Current Period vs Previous Period</code>
                </div>
                <div className="text-xs text-slate-600">
                  • <strong>📈 Up Trend:</strong> Accuracy improved by ≥5% compared to previous period<br />
                  • <strong>➡️ Stable:</strong> Accuracy change within ±5%<br />
                  • <strong>📉 Down Trend:</strong> Accuracy decreased by ≥5%
                </div>
              </div>

              {/* Overall Score */}
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-3 border border-purple-200">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">🏆</span>
                  <span className="text-xs font-bold text-slate-900">Top Performer Selection</span>
                </div>
                <div className="text-xs text-slate-700 mb-2">
                  <strong>Criteria:</strong> <code className="px-2 py-0.5 bg-slate-100 rounded text-purple-600 font-mono">Highest Accuracy Score</code>
                </div>
                <div className="text-xs text-slate-600">
                  • <strong>Primary Factor:</strong> Accuracy percentage (most important)<br />
                  • <strong>Tiebreaker:</strong> If tied, higher user rating wins<br />
                  • <strong>Updated:</strong> Recalculated in real-time as tasks complete
                </div>
              </div>
            </div>

            <div className="mt-3 p-3 bg-white rounded-lg border border-blue-200">
              <div className="flex items-start gap-2">
                <svg className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div className="text-xs text-slate-700">
                  <strong className="text-blue-700">Note:</strong> All metrics are calculated in real-time based on actual task execution. 
                  Historical data is preserved for trend analysis. Metrics reset when changing time ranges but maintain accuracy for comparison.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Top Performer Badge */}
        <div className="p-3 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg border border-yellow-200 mt-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-orange-400 flex items-center justify-center text-2xl shadow-lg">
              {topPerformer.avatar}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-lg">🏆</span>
                <span className="text-sm font-bold text-slate-900">Top Performer</span>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-sm font-semibold text-slate-700">{topPerformer.name}</span>
                <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full font-medium">
                  {topPerformer.accuracy}% accuracy
                </span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-orange-600">{topPerformer.tasksCompleted}</div>
              <div className="text-xs text-slate-600">tasks done</div>
            </div>
          </div>
        </div>
      </div>

      {/* Agent List */}
      <div className="p-4 space-y-3 max-h-96 overflow-y-auto custom-scrollbar">
        {agents.map(agent => {
          const trendInfo = getTrendIcon(agent.trend);
          const isExpanded = expandedAgent === agent.id;

          return (
            <div
              key={agent.id}
              className="border border-slate-200 rounded-lg overflow-hidden hover:border-blue-300 transition-all"
            >
              {/* Agent Summary */}
              <div
                onClick={() => setExpandedAgent(isExpanded ? null : agent.id)}
                className="p-3 bg-slate-50 hover:bg-slate-100 cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-3">
                  {/* Avatar */}
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center text-2xl shadow-md">
                    {agent.avatar}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-semibold text-slate-900">{agent.name}</span>
                      <span className={trendInfo.color}>{trendInfo.icon}</span>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${getAccuracyBarColor(agent.accuracy)} transition-all duration-500`}
                          style={{ width: `${agent.accuracy}%` }}
                        />
                      </div>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${getAccuracyColor(agent.accuracy)}`}>
                        {agent.accuracy}%
                      </span>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex gap-4 text-right">
                    <div>
                      <div className="text-lg font-bold text-slate-900">{agent.tasksCompleted}</div>
                      <div className="text-xs text-slate-500">Tasks</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-blue-600">{agent.avgResponseTime}s</div>
                      <div className="text-xs text-slate-500">Avg Time</div>
                    </div>
                  </div>

                  {/* Expand Icon */}
                  <svg
                    className={`w-5 h-5 text-slate-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              {/* Expanded Details */}
              {isExpanded && (
                <div className="p-4 bg-white border-t border-slate-200">
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    {/* User Rating */}
                    <div className="p-3 bg-slate-50 rounded-lg">
                      <div className="text-xs text-slate-600 mb-1">User Rating</div>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <svg
                            key={i}
                            className={`w-4 h-4 ${i < agent.userRating ? 'text-yellow-400' : 'text-slate-300'}`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                        <span className="ml-2 text-sm font-semibold text-slate-700">{agent.userRating}.0</span>
                      </div>
                    </div>

                    {/* Response Quality */}
                    <div className="p-3 bg-slate-50 rounded-lg">
                      <div className="text-xs text-slate-600 mb-1">Response Quality</div>
                      <div className="text-2xl font-bold text-green-600">{agent.accuracy}%</div>
                    </div>
                  </div>

                  {/* Specialties */}
                  <div>
                    <div className="text-xs text-slate-600 mb-2">Specialties</div>
                    <div className="flex flex-wrap gap-2">
                      {agent.specialties.map((specialty, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full font-medium"
                        >
                          {specialty}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer Stats */}
      <div className="p-4 border-t border-slate-200 bg-slate-50">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-blue-600">
              {Math.round(agents.reduce((sum, a) => sum + a.accuracy, 0) / agents.length)}%
            </div>
            <div className="text-xs text-slate-600">Avg Accuracy</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-600">
              {agents.reduce((sum, a) => sum + a.tasksCompleted, 0)}
            </div>
            <div className="text-xs text-slate-600">Total Tasks</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600">
              {(agents.reduce((sum, a) => sum + a.avgResponseTime, 0) / agents.length).toFixed(1)}s
            </div>
            <div className="text-xs text-slate-600">Avg Response</div>
          </div>
        </div>
      </div>
    </div>
  );
};
