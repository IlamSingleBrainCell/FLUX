// Mobile-optimized navigation component
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

interface MobileNavProps {
  currentPage?: string;
}

export default function MobileNav({ currentPage }: MobileNavProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();
  const activePage = currentPage || router.pathname.split('/')[1] || 'dashboard';

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊', href: '/dashboard' },
    { id: 'projects', label: 'Projects', icon: '📋', href: '/projects' },
    { id: 'workspace', label: 'Workspace', icon: '💬', href: '/workspace' },
    { id: 'analytics', label: 'Analytics', icon: '📈', href: '/analytics' },
    { id: 'integrations', label: 'Tools', icon: '🔌', href: '/integrations' },
    { id: 'marketplace', label: 'Store', icon: '🛒', href: '/marketplace' },
    { id: 'timeline', label: 'Timeline', icon: '⏰', href: '/timeline' },
    { id: 'settings', label: 'Settings', icon: '⚙️', href: '/settings' },
  ];

  const getGradient = () => {
    switch (activePage) {
      case 'dashboard': return 'from-blue-600 to-cyan-500';
      case 'projects': return 'from-emerald-600 to-teal-500';
      case 'workspace': return 'from-purple-600 to-pink-500';
      case 'analytics': return 'from-orange-600 to-red-500';
      case 'integrations': return 'from-cyan-600 to-blue-500';
      case 'marketplace': return 'from-rose-600 to-pink-500';
      case 'timeline': return 'from-violet-600 to-purple-500';
      case 'settings': return 'from-indigo-600 to-purple-500';
      default: return 'from-blue-600 to-cyan-500';
    }
  };

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/dashboard">
              <div className={`bg-gradient-to-r ${getGradient()} p-2 rounded-lg`}>
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </Link>

            {/* Page Title */}
            <div className="flex-1 text-center">
              <h1 className="text-lg font-semibold text-gray-900 dark:text-white capitalize">
                {activePage === 'workspace' ? 'AI Workspace' : activePage}
              </h1>
            </div>

            {/* Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              {isMenuOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {isMenuOpen && (
          <div className="absolute inset-x-0 top-full bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-lg">
            <div className="px-4 py-2 space-y-1">
              {navItems.map(item => {
                const isActive = activePage === item.id;
                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex items-center space-x-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}
                  >
                    <span className="text-xl">{item.icon}</span>
                    <span>{item.label}</span>
                    {isActive && (
                      <div className="ml-auto w-2 h-2 bg-blue-600 rounded-full"></div>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 z-50">
        <div className="grid grid-cols-4 gap-1 px-2 py-2">
          {navItems.slice(0, 4).map(item => {
            const isActive = activePage === item.id;
            return (
              <Link
                key={item.id}
                href={item.href}
                className={`flex flex-col items-center space-y-1 py-2 px-1 rounded-lg transition-colors ${
                  isActive
                    ? 'text-blue-600 dark:text-blue-400'
                    : 'text-gray-600 dark:text-gray-400'
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                <span className="text-xs font-medium">{item.label}</span>
                {isActive && (
                  <div className="w-1 h-1 bg-blue-600 rounded-full"></div>
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}

// Hook for PWA installation
export function usePWAInstall() {
  const [installPrompt, setInstallPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);

  React.useEffect(() => {
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setInstallPrompt(e);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setInstallPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const installPWA = async () => {
    if (installPrompt) {
      installPrompt.prompt();
      const result = await installPrompt.userChoice;
      if (result.outcome === 'accepted') {
        setInstallPrompt(null);
      }
    }
  };

  return {
    canInstall: !!installPrompt,
    isInstalled,
    installPWA
  };
}

// Component for PWA install banner
export function PWAInstallBanner() {
  const { canInstall, installPWA } = usePWAInstall();
  const [showBanner, setShowBanner] = useState(true);

  if (!canInstall || !showBanner) return null;

  return (
    <div className="fixed bottom-20 lg:bottom-6 left-4 right-4 lg:left-auto lg:right-6 lg:w-80 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl shadow-lg p-4 z-40">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="font-semibold mb-1">Install FLUX App</div>
          <div className="text-sm text-blue-100 mb-3">
            Get the full experience with offline access and notifications
          </div>
          <div className="flex space-x-2">
            <button
              onClick={installPWA}
              className="bg-white text-blue-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-50 transition-colors"
            >
              📱 Install
            </button>
            <button
              onClick={() => setShowBanner(false)}
              className="bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-800 transition-colors"
            >
              Later
            </button>
          </div>
        </div>
        <button
          onClick={() => setShowBanner(false)}
          className="text-blue-100 hover:text-white ml-2"
        >
          ✕
        </button>
      </div>
    </div>
  );
}