// Real-Time Collaboration - Live Cursors, Presence, Video/Voice Integration
import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';

interface User {
  id: string;
  name: string;
  avatar: string;
  color: string;
  cursor?: {
    x: number;
    y: number;
    lastSeen: number;
  };
  presence: {
    status: 'active' | 'idle' | 'away';
    currentPage: string;
    activity: string;
    lastActive: string;
  };
  voice?: {
    speaking: boolean;
    muted: boolean;
    videoEnabled: boolean;
  };
}

interface CollaborationProps {
  roomId: string;
  currentUserId: string;
}

export default function RealTimeCollaboration({ roomId, currentUserId }: CollaborationProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [showPresencePanel, setShowPresencePanel] = useState(false);
  const [showVideoCall, setShowVideoCall] = useState(false);
  const [screenSharing, setScreenSharing] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isCollaborativeMode, setIsCollaborativeMode] = useState(false);
  const cursorsRef = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const router = useRouter();

  // Sample users for demonstration
  useEffect(() => {
    const sampleUsers: User[] = [
      {
        id: 'user-1',
        name: 'Sarah Chen',
        avatar: '👩‍💻',
        color: '#3B82F6',
        cursor: { x: 450, y: 200, lastSeen: Date.now() },
        presence: {
          status: 'active',
          currentPage: router.pathname,
          activity: 'Editing project epic',
          lastActive: '2 minutes ago'
        },
        voice: { speaking: false, muted: false, videoEnabled: true }
      },
      {
        id: 'user-2',
        name: 'Marcus Rodriguez',
        avatar: '👨‍💼',
        color: '#10B981',
        cursor: { x: 780, y: 350, lastSeen: Date.now() - 5000 },
        presence: {
          status: 'active',
          currentPage: '/analytics',
          activity: 'Reviewing sprint metrics',
          lastActive: '1 minute ago'
        },
        voice: { speaking: true, muted: false, videoEnabled: false }
      },
      {
        id: 'user-3',
        name: 'Alex Thompson',
        avatar: '👨‍🔧',
        color: '#F59E0B',
        cursor: { x: 320, y: 480, lastSeen: Date.now() - 15000 },
        presence: {
          status: 'idle',
          currentPage: '/integrations',
          activity: 'Configuring CI/CD pipeline',
          lastActive: '5 minutes ago'
        },
        voice: { speaking: false, muted: true, videoEnabled: false }
      },
      {
        id: 'user-4',
        name: 'Jamie Park',
        avatar: '👩‍🎨',
        color: '#8B5CF6',
        presence: {
          status: 'away',
          currentPage: '/workspace',
          activity: 'In meeting',
          lastActive: '15 minutes ago'
        },
        voice: { speaking: false, muted: true, videoEnabled: false }
      }
    ];

    setUsers(sampleUsers);
  }, [router.pathname]);

  // Track mouse movement for collaborative cursor
  useEffect(() => {
    let animationFrame: number;
    
    const handleMouseMove = (e: MouseEvent) => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
      
      animationFrame = requestAnimationFrame(() => {
        setMousePosition({ x: e.clientX, y: e.clientY });
        
        // In real implementation, send cursor position to other users
        // broadcastCursorPosition(currentUserId, e.clientX, e.clientY);
      });
    };

    if (isCollaborativeMode) {
      document.addEventListener('mousemove', handleMouseMove);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [isCollaborativeMode, currentUserId]);

  // Update cursor positions for other users
  useEffect(() => {
    users.forEach(user => {
      if (user.cursor && cursorsRef.current[user.id]) {
        const cursorElement = cursorsRef.current[user.id];
        if (cursorElement) {
          cursorElement.style.transform = `translate(${user.cursor.x}px, ${user.cursor.y}px)`;
        }
      }
    });
  }, [users]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'idle': return 'bg-yellow-500';
      case 'away': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const startVideoCall = () => {
    setShowVideoCall(true);
    // In real implementation, initialize WebRTC connection
    console.log('Starting video call...');
  };

  const toggleScreenShare = () => {
    if (!screenSharing) {
      // Request screen sharing
      if (navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia) {
        navigator.mediaDevices.getDisplayMedia({ video: true })
          .then(stream => {
            setScreenSharing(true);
            // Handle screen sharing stream
            console.log('Screen sharing started');
          })
          .catch(err => {
            console.error('Screen sharing failed:', err);
          });
      }
    } else {
      setScreenSharing(false);
      console.log('Screen sharing stopped');
    }
  };

  const activeUsers = users.filter(u => u.presence.status === 'active');
  const totalUsers = users.length;

  return (
    <>
      {/* Live Cursors */}
      {isCollaborativeMode && users.map(user => 
        user.cursor && user.id !== currentUserId && (
          <div
            key={`cursor-${user.id}`}
            ref={(el) => { cursorsRef.current[user.id] = el; }}
            className="fixed pointer-events-none z-50 transition-transform duration-75"
            style={{
              transform: `translate(${user.cursor.x}px, ${user.cursor.y}px)`,
              opacity: Date.now() - user.cursor.lastSeen < 10000 ? 1 : 0
            }}
          >
            {/* Cursor SVG */}
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              className="drop-shadow-lg"
            >
              <path
                d="M5.65376 12.3673H14.6749C15.0735 12.3673 15.2716 12.7965 15.0081 13.1325L12.3621 16.8141C12.0226 17.2654 11.3647 17.2654 11.0251 16.8141L8.37913 13.1325C8.11564 12.7965 8.31374 12.3673 8.71227 12.3673H5.65376Z"
                fill={user.color}
                stroke="white"
                strokeWidth="1.5"
              />
              <path
                d="m13.972 4.077l6.26 17.07a.5.5 0 0 1-.912.417L13.972 4.077Z"
                fill={user.color}
                stroke="white"
                strokeWidth="1.5"
              />
            </svg>
            
            {/* User name tag */}
            <div
              className="absolute top-6 left-2 px-2 py-1 text-xs text-white rounded shadow-lg whitespace-nowrap"
              style={{ backgroundColor: user.color }}
            >
              {user.avatar} {user.name}
            </div>
          </div>
        )
      )}

      {/* Collaboration Controls - Fixed bottom left */}
      <div className="fixed bottom-6 left-6 z-40 flex flex-col space-y-3">
        {/* Presence Indicator */}
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {activeUsers.length} Active
                </span>
              </div>
              <button
                onClick={() => setShowPresencePanel(!showPresencePanel)}
                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                {showPresencePanel ? '▼' : '▶'}
              </button>
            </div>

            {/* User Avatars */}
            <div className="flex -space-x-2">
              {users.slice(0, 4).map(user => (
                <div
                  key={user.id}
                  className="relative w-8 h-8 rounded-full border-2 border-white dark:border-gray-900 overflow-hidden"
                  title={`${user.name} - ${user.presence.activity}`}
                >
                  <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm">
                    {user.avatar}
                  </div>
                  <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 ${getStatusColor(user.presence.status)} rounded-full border border-white dark:border-gray-900`}></div>
                </div>
              ))}
              {totalUsers > 4 && (
                <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 border-2 border-white dark:border-gray-900 flex items-center justify-center">
                  <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
                    +{totalUsers - 4}
                  </span>
                </div>
              )}
            </div>

            {/* Expanded Presence Panel */}
            {showPresencePanel && (
              <div className="mt-4 space-y-2 max-h-64 overflow-y-auto">
                {users.map(user => (
                  <div key={user.id} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
                    <div className="relative">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs">
                        {user.avatar}
                      </div>
                      <div className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 ${getStatusColor(user.presence.status)} rounded-full border border-white dark:border-gray-900`}></div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {user.name}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {user.presence.activity}
                      </div>
                    </div>
                    <div className="text-xs text-gray-400">
                      {user.presence.lastActive}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Collaboration Mode Toggle */}
        <button
          onClick={() => setIsCollaborativeMode(!isCollaborativeMode)}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            isCollaborativeMode
              ? 'bg-blue-600 text-white shadow-lg'
              : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600'
          }`}
        >
          {isCollaborativeMode ? '👥 Live Mode' : '👤 Solo Mode'}
        </button>

        {/* Video Call Controls */}
        <div className="flex space-x-2">
          <button
            onClick={startVideoCall}
            className="bg-green-600 hover:bg-green-700 text-white p-3 rounded-lg transition-colors shadow-lg"
            title="Start video call"
          >
            📹
          </button>
          <button
            onClick={toggleScreenShare}
            className={`p-3 rounded-lg transition-colors shadow-lg ${
              screenSharing
                ? 'bg-red-600 hover:bg-red-700 text-white'
                : 'bg-gray-600 hover:bg-gray-700 text-white'
            }`}
            title={screenSharing ? 'Stop screen sharing' : 'Share screen'}
          >
            🖥️
          </button>
        </div>
      </div>

      {/* Video Call Modal */}
      {showVideoCall && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl max-w-4xl w-full max-h-[80vh] overflow-hidden">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Team Video Call
              </h3>
              <button
                onClick={() => setShowVideoCall(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                ✕
              </button>
            </div>
            
            <div className="p-6">
              {/* Video Grid */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                {users.filter(u => u.voice?.videoEnabled).map(user => (
                  <div key={user.id} className="relative bg-gray-900 rounded-lg overflow-hidden aspect-video">
                    <div className="absolute inset-0 flex items-center justify-center text-white text-6xl">
                      {user.avatar}
                    </div>
                    <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 px-2 py-1 rounded text-white text-sm">
                      {user.name}
                    </div>
                    {user.voice?.speaking && (
                      <div className="absolute top-2 right-2 w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    )}
                    {user.voice?.muted && (
                      <div className="absolute top-2 left-2 text-red-500">🔇</div>
                    )}
                  </div>
                ))}
              </div>

              {/* Call Controls */}
              <div className="flex items-center justify-center space-x-4">
                <button className="bg-gray-600 hover:bg-gray-700 text-white p-3 rounded-full transition-colors">
                  🎤
                </button>
                <button className="bg-gray-600 hover:bg-gray-700 text-white p-3 rounded-full transition-colors">
                  📹
                </button>
                <button className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full transition-colors">
                  🖥️
                </button>
                <button 
                  onClick={() => setShowVideoCall(false)}
                  className="bg-red-600 hover:bg-red-700 text-white p-3 rounded-full transition-colors"
                >
                  📞
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Screen Sharing Indicator */}
      {screenSharing && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-red-600 text-white px-4 py-2 rounded-lg shadow-lg z-50">
          🖥️ You are sharing your screen
        </div>
      )}
    </>
  );
}

// Hook to provide collaboration functionality to any component
export function useCollaboration(roomId: string, userId: string) {
  const [isCollaborating, setIsCollaborating] = useState(false);
  const [collaborators, setCollaborators] = useState<User[]>([]);

  return {
    isCollaborating,
    collaborators,
    startCollaboration: () => setIsCollaborating(true),
    stopCollaboration: () => setIsCollaborating(false),
  };
}