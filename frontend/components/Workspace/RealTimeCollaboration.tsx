// components/Workspace/RealTimeCollaboration.tsx
import React, { useState, useEffect } from 'react';

interface CollaboratorCursor {
  id: string;
  name: string;
  x: number;
  y: number;
  color: string;
}

interface Collaborator {
  id: string;
  name: string;
  avatar: string;
  status: 'active' | 'idle' | 'away';
  lastSeen: string;
  currentAction?: string;
}

interface RealTimeCollaborationProps {
  className?: string;
}

export const RealTimeCollaboration: React.FC<RealTimeCollaborationProps> = ({
  className = '',
}) => {
  const [collaborators, setCollaborators] = useState<Collaborator[]>([
    {
      id: '1',
      name: 'Sarah Chen',
      avatar: '👩‍💻',
      status: 'active',
      lastSeen: new Date().toISOString(),
      currentAction: 'Typing in chat...',
    },
    {
      id: '2',
      name: 'Alex Kumar',
      avatar: '👨‍💼',
      status: 'active',
      lastSeen: new Date().toISOString(),
      currentAction: 'Viewing code diff',
    },
    {
      id: '3',
      name: 'Emma Wilson',
      avatar: '👩‍🔬',
      status: 'idle',
      lastSeen: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    },
  ]);

  const [cursors, setCursors] = useState<CollaboratorCursor[]>([]);
  const [showCursors, setShowCursors] = useState(true);
  const [showPresence, setShowPresence] = useState(true);

  // Simulate cursor movement
  useEffect(() => {
    if (!showCursors) return;

    const interval = setInterval(() => {
      setCursors(prev => 
        prev.map(cursor => ({
          ...cursor,
          x: cursor.x + (Math.random() - 0.5) * 20,
          y: cursor.y + (Math.random() - 0.5) * 20,
        }))
      );
    }, 100);

    return () => clearInterval(interval);
  }, [showCursors]);

  // Track mouse movement
  useEffect(() => {
    if (!showCursors) return;

    const handleMouseMove = (e: MouseEvent) => {
      // In real implementation, broadcast cursor position via WebSocket
      console.log('Cursor position:', e.clientX, e.clientY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [showCursors]);

  const getStatusColor = (status: Collaborator['status']) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'idle': return 'bg-yellow-500';
      case 'away': return 'bg-slate-400';
      default: return 'bg-slate-400';
    }
  };

  const getRelativeTime = (timestamp: string) => {
    const diff = Date.now() - new Date(timestamp).getTime();
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'Just now';
    if (minutes === 1) return '1 minute ago';
    if (minutes < 60) return `${minutes} minutes ago`;
    
    const hours = Math.floor(minutes / 60);
    if (hours === 1) return '1 hour ago';
    return `${hours} hours ago`;
  };

  return (
    <div className={className}>
      {/* Presence Panel */}
      {showPresence && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Active Collaborators
            </h3>
            <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
              {collaborators.filter(c => c.status === 'active').length} online
            </span>
          </div>

          <div className="space-y-2">
            {collaborators.map(collaborator => (
              <div
                key={collaborator.id}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 transition-colors"
              >
                {/* Avatar */}
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center text-xl">
                    {collaborator.avatar}
                  </div>
                  <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${getStatusColor(collaborator.status)}`}></div>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-slate-900">{collaborator.name}</div>
                  {collaborator.currentAction ? (
                    <div className="text-xs text-blue-600 flex items-center gap-1">
                      <span className="inline-block w-1.5 h-1.5 bg-blue-600 rounded-full animate-pulse"></span>
                      {collaborator.currentAction}
                    </div>
                  ) : (
                    <div className="text-xs text-slate-500">
                      {collaborator.status === 'active' ? 'Online' : getRelativeTime(collaborator.lastSeen)}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <button
                  className="p-1 hover:bg-slate-200 rounded transition-colors"
                  title="Start chat"
                >
                  <svg className="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                </button>
              </div>
            ))}
          </div>

          {/* Settings */}
          <div className="mt-4 pt-4 border-t border-slate-200 space-y-2">
            <label className="flex items-center justify-between text-sm cursor-pointer">
              <span className="text-slate-700">Show cursors</span>
              <input
                type="checkbox"
                checked={showCursors}
                onChange={(e) => setShowCursors(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded"
              />
            </label>
            <label className="flex items-center justify-between text-sm cursor-pointer">
              <span className="text-slate-700">Show presence</span>
              <input
                type="checkbox"
                checked={showPresence}
                onChange={(e) => setShowPresence(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded"
              />
            </label>
          </div>
        </div>
      )}

      {/* Collaborative Cursors */}
      {showCursors && cursors.map(cursor => (
        <div
          key={cursor.id}
          className="fixed pointer-events-none z-50 transition-all duration-100"
          style={{
            left: cursor.x,
            top: cursor.y,
            transform: 'translate(-50%, -50%)',
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill={cursor.color}>
            <path d="M5 3l3.057 12.528L13.5 12.5l3.028-5.443L5 3z" />
          </svg>
          <span
            className="ml-4 px-2 py-1 rounded text-white text-xs font-medium whitespace-nowrap shadow-lg"
            style={{ backgroundColor: cursor.color }}
          >
            {cursor.name}
          </span>
        </div>
      ))}

      {/* Activity Feed */}
      <div className="mt-4 bg-white rounded-xl shadow-sm border border-slate-200 p-4">
        <h3 className="text-sm font-bold text-slate-900 mb-3">Recent Activity</h3>
        <div className="space-y-2 text-xs">
          <div className="flex items-start gap-2 text-slate-600">
            <span className="text-lg">👩‍💻</span>
            <div>
              <strong className="text-slate-900">Sarah Chen</strong> edited <strong>workspace.tsx</strong>
              <span className="text-slate-400 ml-1">2 min ago</span>
            </div>
          </div>
          <div className="flex items-start gap-2 text-slate-600">
            <span className="text-lg">👨‍💼</span>
            <div>
              <strong className="text-slate-900">Alex Kumar</strong> commented on code review
              <span className="text-slate-400 ml-1">5 min ago</span>
            </div>
          </div>
          <div className="flex items-start gap-2 text-slate-600">
            <span className="text-lg">👩‍🔬</span>
            <div>
              <strong className="text-slate-900">Emma Wilson</strong> committed changes
              <span className="text-slate-400 ml-1">12 min ago</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
