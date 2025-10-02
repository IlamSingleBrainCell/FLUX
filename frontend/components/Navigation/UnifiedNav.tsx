// components/Navigation/UnifiedNav.tsx - Beautiful, consistent navigation
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

interface Notification {
  id: string;
  type: 'success' | 'warning' | 'error' | 'info';
  title: string;
  message: string;
  time: string;
  read: boolean;
}

interface UnifiedNavProps {
  currentPage?: string;
  showNotifications?: boolean;
}

export default function UnifiedNav({ currentPage, showNotifications = true }: UnifiedNavProps) {
  const router = useRouter();
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  
  const [notifications] = useState<Notification[]>([
    { id: '1', type: 'error', title: 'Build Failed', message: 'Production build failed on staging', time: '2 min ago', read: false },
    { id: '2', type: 'success', title: 'Deployment Success', message: 'v2.3.1 deployed to production', time: '12 min ago', read: false },
    { id: '3', type: 'warning', title: 'Security Alert', message: 'CVE-2024-001 detected', time: '32 min ago', read: true },
  ]);

  React.useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;
  const activePage = currentPage || router.pathname.split('/')[1] || 'dashboard';

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊', href: '/dashboard' },
    { id: 'projects', label: 'Projects', icon: '📋', href: '/projects' },
    { id: 'workspace', label: 'AI Workspace', icon: '💬', href: '/workspace' },
    { id: 'analytics', label: 'Analytics', icon: '📈', href: '/analytics' },
    { id: 'integrations', label: 'Integrations', icon: '🔌', href: '/integrations' },
    { id: 'settings', label: 'Settings', icon: '⚙️', href: '/settings' },
  ];

  const getGradient = () => {
    switch (activePage) {
      case 'dashboard': return 'from-blue-600 to-cyan-500';
      case 'projects': return 'from-emerald-600 to-teal-500';
      case 'workspace': return 'from-purple-600 to-pink-500';
      case 'analytics': return 'from-orange-600 to-red-500';
      case 'integrations': return 'from-cyan-600 to-blue-500';
      case 'settings': return 'from-indigo-600 to-purple-500';
      default: return 'from-blue-600 to-cyan-500';
    }
  };

  return (
    <div className="bg-slate-900/95 backdrop-blur-xl border-b border-slate-700/50 sticky top-0 z-50 shadow-2xl">
      <div className="max-w-[1800px] mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo & Brand */}
          <div className="flex items-center space-x-4">
            <Link href="/dashboard">
              <div className={`bg-gradient-to-r ${getGradient()} p-3 rounded-xl shadow-lg cursor-pointer hover:scale-105 transition-transform`}>
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </Link>
            <div>
              <h1 className="text-xl font-bold text-white">FLUX Enterprise</h1>
              <p className="text-sm text-slate-400">Multi-Agent SDLC Platform</p>
            </div>
          </div>

          {/* Center - Navigation */}
          <nav className="flex items-center space-x-2">
            {navItems.map(item => {
              const isActive = activePage === item.id;
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  className={`group relative px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? `bg-gradient-to-r ${getGradient()} text-white shadow-lg`
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <span className="flex items-center space-x-2">
                    <span>{item.icon}</span>
                    <span>{item.label}</span>
                  </span>
                  {isActive && (
                    <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-white rounded-full"></div>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right - Status & Notifications */}
          <div className="flex items-center space-x-4">
            {/* Live Clock */}
            <div className="flex items-center space-x-2 text-slate-300">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm font-mono">
                {currentTime.toLocaleTimeString('en-US', { hour12: true, hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>

            {/* System Status */}
            <div className="flex items-center space-x-2 px-3 py-1.5 bg-emerald-500/20 rounded-lg border border-emerald-500/30">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              <span className="text-xs font-semibold text-emerald-400">System Online</span>
            </div>

            {/* Notifications */}
            {showNotifications && (
              <div className="relative">
                <button
                  onClick={() => setShowNotifDropdown(!showNotifDropdown)}
                  className="relative p-2.5 hover:bg-slate-800 rounded-lg transition-colors"
                >
                  <svg className="w-6 h-6 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {showNotifDropdown && (
                  <div className="absolute right-0 mt-2 w-96 bg-slate-800 rounded-xl shadow-2xl border border-slate-700 overflow-hidden">
                    <div className="p-4 border-b border-slate-700 flex items-center justify-between">
                      <h3 className="font-bold text-white">Notifications</h3>
                      <button className="text-xs text-blue-400 hover:text-blue-300">Mark all read</button>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.map(notif => (
                        <div
                          key={notif.id}
                          className={`p-4 border-b border-slate-700 hover:bg-slate-750 transition-colors ${
                            !notif.read ? 'bg-blue-500/5' : ''
                          }`}
                        >
                          <div className="flex items-start space-x-3">
                            <div className={`w-2 h-2 rounded-full mt-2 ${
                              notif.type === 'error' ? 'bg-red-500' :
                              notif.type === 'warning' ? 'bg-yellow-500' :
                              notif.type === 'success' ? 'bg-green-500' :
                              'bg-blue-500'
                            }`}></div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <span className="font-semibold text-white text-sm">{notif.title}</span>
                                {!notif.read && (
                                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                                )}
                              </div>
                              <p className="text-xs text-slate-400 mt-1">{notif.message}</p>
                              <span className="text-xs text-slate-500 mt-1 block">{notif.time}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
