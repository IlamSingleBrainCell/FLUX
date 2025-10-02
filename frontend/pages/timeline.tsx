// Timeline & Audit Trail - Visual Project History & Compliance
import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useCommandPalette } from '../components/CommandPalette/CommandPalette';
import CommandPalette from '../components/CommandPalette/CommandPalette';

interface TimelineEvent {
  id: string;
  timestamp: string;
  type: 'commit' | 'deploy' | 'test' | 'review' | 'issue' | 'security' | 'user' | 'system';
  title: string;
  description: string;
  actor: {
    type: 'user' | 'agent' | 'system';
    name: string;
    avatar: string;
  };
  metadata: {
    project?: string;
    branch?: string;
    environment?: string;
    severity?: 'low' | 'medium' | 'high' | 'critical';
    impact?: string[];
    relatedEvents?: string[];
  };
  changes?: {
    files?: string[];
    linesAdded?: number;
    linesDeleted?: number;
  };
  status: 'success' | 'failed' | 'warning' | 'info';
}

interface Filter {
  dateRange: 'today' | 'week' | 'month' | 'quarter' | 'custom';
  eventTypes: string[];
  projects: string[];
  actors: string[];
  severity: string[];
}

export default function Timeline() {
  const { isOpen, setIsOpen } = useCommandPalette();
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<TimelineEvent[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<TimelineEvent | null>(null);
  const [filters, setFilters] = useState<Filter>({
    dateRange: 'week',
    eventTypes: [],
    projects: [],
    actors: [],
    severity: []
  });
  const [playbackMode, setPlaybackMode] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [playbackIndex, setPlaybackIndex] = useState(0);
  const [showExportModal, setShowExportModal] = useState(false);

  // Sample timeline events
  useEffect(() => {
    const sampleEvents: TimelineEvent[] = [
      {
        id: 'event-1',
        timestamp: '2024-10-03T14:30:00Z',
        type: 'commit',
        title: 'Feature: Enhanced Navigation System',
        description: 'Added UnifiedNav component with dynamic gradients and live clock functionality',
        actor: {
          type: 'user',
          name: 'Sarah Chen',
          avatar: '👩‍💻'
        },
        metadata: {
          project: 'FLUX Platform',
          branch: 'main',
          impact: ['UI/UX', 'Navigation']
        },
        changes: {
          files: ['frontend/components/Navigation/UnifiedNav.tsx', 'frontend/pages/_app.tsx'],
          linesAdded: 400,
          linesDeleted: 15
        },
        status: 'success'
      },
      {
        id: 'event-2',
        timestamp: '2024-10-03T13:45:00Z',
        type: 'security',
        title: 'Security Scan Completed',
        description: 'Automated security scan found 0 critical vulnerabilities, 2 medium severity issues resolved',
        actor: {
          type: 'agent',
          name: 'DevSecOps Guardian',
          avatar: '🛡️'
        },
        metadata: {
          project: 'FLUX Platform',
          severity: 'medium',
          impact: ['Security', 'Dependencies']
        },
        status: 'success'
      },
      {
        id: 'event-3',
        timestamp: '2024-10-03T13:15:00Z',
        type: 'deploy',
        title: 'Production Deployment',
        description: 'Successfully deployed Projects page and navigation fixes to production environment',
        actor: {
          type: 'system',
          name: 'Vercel CD',
          avatar: '🚀'
        },
        metadata: {
          project: 'FLUX Platform',
          environment: 'production',
          impact: ['Frontend', 'User Experience']
        },
        status: 'success'
      },
      {
        id: 'event-4',
        timestamp: '2024-10-03T12:20:00Z',
        type: 'test',
        title: 'Test Suite Execution',
        description: 'All 147 tests passed successfully with 94% code coverage',
        actor: {
          type: 'agent',
          name: 'Test Automation Master',
          avatar: '🧪'
        },
        metadata: {
          project: 'FLUX Platform',
          impact: ['Quality Assurance', 'Code Coverage']
        },
        status: 'success'
      },
      {
        id: 'event-5',
        timestamp: '2024-10-03T11:30:00Z',
        type: 'review',
        title: 'Code Review Completed',
        description: 'Marcus reviewed and approved the navigation enhancement PR with 3 suggestions implemented',
        actor: {
          type: 'agent',
          name: 'Marcus Rodriguez',
          avatar: '👨‍💼'
        },
        metadata: {
          project: 'FLUX Platform',
          branch: 'feature/navigation-upgrade',
          impact: ['Code Quality', 'Best Practices']
        },
        status: 'success'
      },
      {
        id: 'event-6',
        timestamp: '2024-10-02T16:45:00Z',
        type: 'issue',
        title: 'Critical: Projects Page 404 Error',
        description: 'Users reported 404 error when accessing /projects route, investigation started',
        actor: {
          type: 'user',
          name: 'User Feedback',
          avatar: '👥'
        },
        metadata: {
          project: 'FLUX Platform',
          severity: 'critical',
          impact: ['User Experience', 'Core Functionality']
        },
        status: 'failed'
      },
      {
        id: 'event-7',
        timestamp: '2024-10-02T15:20:00Z',
        type: 'commit',
        title: 'Feature: AI Agent Collaboration',
        description: 'Implemented 3-column workspace layout with offline-by-default agents',
        actor: {
          type: 'user',
          name: 'Sarah Chen',
          avatar: '👩‍💻'
        },
        metadata: {
          project: 'FLUX Platform',
          branch: 'main',
          impact: ['Workspace', 'Agent System']
        },
        changes: {
          files: ['frontend/pages/workspace.tsx', 'frontend/components/AgentChat/'],
          linesAdded: 450,
          linesDeleted: 120
        },
        status: 'success'
      },
      {
        id: 'event-8',
        timestamp: '2024-10-02T14:10:00Z',
        type: 'deploy',
        title: 'Staging Deployment',
        description: 'Deployed workspace improvements to staging environment for testing',
        actor: {
          type: 'system',
          name: 'GitHub Actions',
          avatar: '⚙️'
        },
        metadata: {
          project: 'FLUX Platform',
          environment: 'staging',
          impact: ['Testing Environment']
        },
        status: 'success'
      }
    ];

    setEvents(sampleEvents);
    setFilteredEvents(sampleEvents);
  }, []);

  // Filter events based on current filters
  useEffect(() => {
    let filtered = [...events];

    // Date range filter
    const now = new Date();
    const startDate = new Date();
    switch (filters.dateRange) {
      case 'today':
        startDate.setHours(0, 0, 0, 0);
        break;
      case 'week':
        startDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(now.getMonth() - 1);
        break;
      case 'quarter':
        startDate.setMonth(now.getMonth() - 3);
        break;
    }

    filtered = filtered.filter(event => new Date(event.timestamp) >= startDate);

    // Event type filter
    if (filters.eventTypes.length > 0) {
      filtered = filtered.filter(event => filters.eventTypes.includes(event.type));
    }

    // Severity filter
    if (filters.severity.length > 0) {
      filtered = filtered.filter(event => 
        event.metadata.severity && filters.severity.includes(event.metadata.severity)
      );
    }

    setFilteredEvents(filtered);
  }, [events, filters]);

  // Playback functionality
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (playbackMode) {
      interval = setInterval(() => {
        setPlaybackIndex(prev => {
          if (prev >= filteredEvents.length - 1) {
            setPlaybackMode(false);
            return 0;
          }
          return prev + 1;
        });
      }, 2000 / playbackSpeed);
    }
    return () => clearInterval(interval);
  }, [playbackMode, playbackSpeed, filteredEvents.length]);

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'commit': return '📝';
      case 'deploy': return '🚀';
      case 'test': return '🧪';
      case 'review': return '👀';
      case 'issue': return '🐛';
      case 'security': return '🛡️';
      case 'user': return '👤';
      case 'system': return '⚙️';
      default: return '📋';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'bg-green-100 text-green-700 border-green-200';
      case 'failed': return 'bg-red-100 text-red-700 border-red-200';
      case 'warning': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'info': return 'bg-blue-100 text-blue-700 border-blue-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getSeverityColor = (severity?: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500 text-white';
      case 'high': return 'bg-orange-500 text-white';
      case 'medium': return 'bg-yellow-500 text-white';
      case 'low': return 'bg-green-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const exportAuditReport = (format: 'pdf' | 'csv' | 'json') => {
    // Simulate export
    console.log(`Exporting audit report as ${format.toUpperCase()}`);
    const data = filteredEvents.map(event => ({
      timestamp: event.timestamp,
      type: event.type,
      title: event.title,
      actor: event.actor.name,
      project: event.metadata.project,
      status: event.status
    }));
    
    if (format === 'json') {
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `audit-trail-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
    }
    
    setShowExportModal(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-50 dark:from-gray-900 dark:to-purple-900">
      <Head>
        <title>Timeline & Audit Trail - FLUX Platform</title>
        <meta name="description" content="Visual project history and compliance audit trail" />
      </Head>

      <CommandPalette isOpen={isOpen} onClose={() => setIsOpen(false)} />

      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
                ⏰ Timeline & Audit Trail
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Visual project history, compliance tracking, and change impact analysis
              </p>
            </div>
            <div className="flex items-center space-x-4">
              {/* Playback Controls */}
              <div className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-700 rounded-lg p-2">
                <button
                  onClick={() => setPlaybackMode(!playbackMode)}
                  className={`px-3 py-1 rounded text-sm font-medium transition-all ${
                    playbackMode 
                      ? 'bg-red-500 text-white' 
                      : 'bg-blue-500 text-white hover:bg-blue-600'
                  }`}
                >
                  {playbackMode ? '⏸️ Pause' : '▶️ Playback'}
                </button>
                <select
                  value={playbackSpeed}
                  onChange={(e) => setPlaybackSpeed(Number(e.target.value))}
                  className="text-sm bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded px-2 py-1"
                >
                  <option value={0.5}>0.5x</option>
                  <option value={1}>1x</option>
                  <option value={2}>2x</option>
                  <option value={4}>4x</option>
                </select>
              </div>
              
              <button
                onClick={() => setShowExportModal(true)}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                📤 Export Report
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 sticky top-8">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Filters</h3>
              
              {/* Date Range */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Date Range
                </label>
                <select
                  value={filters.dateRange}
                  onChange={(e) => setFilters(prev => ({ ...prev, dateRange: e.target.value as any }))}
                  className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm"
                >
                  <option value="today">Today</option>
                  <option value="week">Last Week</option>
                  <option value="month">Last Month</option>
                  <option value="quarter">Last Quarter</option>
                </select>
              </div>

              {/* Event Types */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Event Types
                </label>
                <div className="space-y-2">
                  {['commit', 'deploy', 'test', 'review', 'issue', 'security'].map(type => (
                    <label key={type} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={filters.eventTypes.includes(type)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFilters(prev => ({ ...prev, eventTypes: [...prev.eventTypes, type] }));
                          } else {
                            setFilters(prev => ({ ...prev, eventTypes: prev.eventTypes.filter(t => t !== type) }));
                          }
                        }}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700 dark:text-gray-300 capitalize flex items-center">
                        {getEventIcon(type)} {type}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Severity */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Severity
                </label>
                <div className="space-y-2">
                  {['critical', 'high', 'medium', 'low'].map(severity => (
                    <label key={severity} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={filters.severity.includes(severity)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFilters(prev => ({ ...prev, severity: [...prev.severity, severity] }));
                          } else {
                            setFilters(prev => ({ ...prev, severity: prev.severity.filter(s => s !== severity) }));
                          }
                        }}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className={`ml-2 px-2 py-1 rounded text-xs font-medium ${getSeverityColor(severity)}`}>
                        {severity.toUpperCase()}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Stats */}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex justify-between mb-1">
                    <span>Total Events:</span>
                    <span className="font-medium">{filteredEvents.length}</span>
                  </div>
                  <div className="flex justify-between mb-1">
                    <span>Success Rate:</span>
                    <span className="font-medium text-green-600">
                      {Math.round((filteredEvents.filter(e => e.status === 'success').length / filteredEvents.length) * 100)}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="lg:col-span-3">
            <div className="relative">
              {/* Timeline Line */}
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-300 dark:bg-gray-600"></div>
              
              {/* Events */}
              <div className="space-y-6">
                {filteredEvents.map((event, index) => (
                  <div
                    key={event.id}
                    className={`relative transition-all duration-300 ${
                      playbackMode && index > playbackIndex ? 'opacity-30' : 'opacity-100'
                    } ${playbackMode && index === playbackIndex ? 'scale-105 ring-2 ring-blue-500' : ''}`}
                  >
                    {/* Timeline Dot */}
                    <div className={`absolute left-6 w-4 h-4 rounded-full border-2 bg-white dark:bg-gray-800 ${
                      event.status === 'success' ? 'border-green-500' :
                      event.status === 'failed' ? 'border-red-500' :
                      event.status === 'warning' ? 'border-yellow-500' :
                      'border-blue-500'
                    } flex items-center justify-center text-xs`}>
                      {getEventIcon(event.type)}
                    </div>

                    {/* Event Card */}
                    <div className="ml-16 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-xl transition-all cursor-pointer"
                         onClick={() => setSelectedEvent(event)}>
                      
                      <div className="p-6">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <div className="text-2xl">{event.actor.avatar}</div>
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{event.title}</h3>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                by {event.actor.name} • {new Date(event.timestamp).toLocaleString()}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            {event.metadata.severity && (
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(event.metadata.severity)}`}>
                                {event.metadata.severity.toUpperCase()}
                              </span>
                            )}
                            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(event.status)}`}>
                              {event.status.toUpperCase()}
                            </span>
                          </div>
                        </div>

                        <p className="text-gray-700 dark:text-gray-300 mb-4">{event.description}</p>

                        {/* Metadata */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          {event.metadata.project && (
                            <div>
                              <span className="text-gray-500 dark:text-gray-400">Project:</span>
                              <span className="ml-2 font-medium text-gray-900 dark:text-white">{event.metadata.project}</span>
                            </div>
                          )}
                          {event.metadata.branch && (
                            <div>
                              <span className="text-gray-500 dark:text-gray-400">Branch:</span>
                              <span className="ml-2 font-medium text-gray-900 dark:text-white">{event.metadata.branch}</span>
                            </div>
                          )}
                          {event.metadata.environment && (
                            <div>
                              <span className="text-gray-500 dark:text-gray-400">Environment:</span>
                              <span className="ml-2 font-medium text-gray-900 dark:text-white">{event.metadata.environment}</span>
                            </div>
                          )}
                          {event.changes && (
                            <div>
                              <span className="text-gray-500 dark:text-gray-400">Changes:</span>
                              <span className="ml-2 font-medium text-green-600">+{event.changes.linesAdded}</span>
                              <span className="ml-1 font-medium text-red-600">-{event.changes.linesDeleted}</span>
                            </div>
                          )}
                        </div>

                        {/* Impact Tags */}
                        {event.metadata.impact && (
                          <div className="flex flex-wrap gap-2 mt-4">
                            {event.metadata.impact.map(impact => (
                              <span key={impact} className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-md text-xs">
                                {impact}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Event Detail Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-4">
                  <div className="text-4xl">{selectedEvent.actor.avatar}</div>
                  <div>
                    <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">{selectedEvent.title}</h2>
                    <p className="text-gray-600 dark:text-gray-400">
                      {selectedEvent.actor.name} • {new Date(selectedEvent.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-2xl"
                >
                  ✕
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Event Details</h3>
                  <p className="text-gray-700 dark:text-gray-300 mb-6">{selectedEvent.description}</p>
                  
                  {selectedEvent.changes && (
                    <div className="mb-6">
                      <h4 className="font-medium text-gray-900 dark:text-white mb-2">Code Changes</h4>
                      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-gray-600 dark:text-gray-400">Lines Changed:</span>
                          <div>
                            <span className="text-green-600 font-medium">+{selectedEvent.changes.linesAdded}</span>
                            <span className="text-red-600 font-medium ml-2">-{selectedEvent.changes.linesDeleted}</span>
                          </div>
                        </div>
                        {selectedEvent.changes.files && (
                          <div>
                            <span className="text-sm text-gray-600 dark:text-gray-400">Files Modified:</span>
                            <div className="mt-2 space-y-1">
                              {selectedEvent.changes.files.map(file => (
                                <div key={file} className="text-sm font-mono bg-white dark:bg-gray-700 px-2 py-1 rounded">
                                  {file}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Metadata</h3>
                  <div className="space-y-4">
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500 dark:text-gray-400">Type:</span>
                          <div className="font-medium text-gray-900 dark:text-white flex items-center mt-1">
                            {getEventIcon(selectedEvent.type)} {selectedEvent.type.toUpperCase()}
                          </div>
                        </div>
                        <div>
                          <span className="text-gray-500 dark:text-gray-400">Status:</span>
                          <div className="mt-1">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(selectedEvent.status)}`}>
                              {selectedEvent.status.toUpperCase()}
                            </span>
                          </div>
                        </div>
                        {selectedEvent.metadata.project && (
                          <div className="col-span-2">
                            <span className="text-gray-500 dark:text-gray-400">Project:</span>
                            <div className="font-medium text-gray-900 dark:text-white mt-1">{selectedEvent.metadata.project}</div>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {selectedEvent.metadata.impact && (
                      <div>
                        <span className="text-gray-500 dark:text-gray-400 text-sm">Impact Areas:</span>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {selectedEvent.metadata.impact.map(impact => (
                            <span key={impact} className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-md text-sm">
                              {impact}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Export Modal */}
      {showExportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl max-w-md w-full">
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Export Audit Report</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Choose format for exporting the current filtered audit trail
              </p>
              <div className="space-y-3">
                <button
                  onClick={() => exportAuditReport('pdf')}
                  className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center"
                >
                  📄 Export as PDF
                </button>
                <button
                  onClick={() => exportAuditReport('csv')}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center"
                >
                  📊 Export as CSV
                </button>
                <button
                  onClick={() => exportAuditReport('json')}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center"
                >
                  📋 Export as JSON
                </button>
              </div>
              <button
                onClick={() => setShowExportModal(false)}
                className="w-full mt-4 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-2 rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}