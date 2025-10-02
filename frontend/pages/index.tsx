// pages/index.tsx
import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { EnhancedChatInterface } from '../components/EnhancedChat';

export default function SDLCAssistant() {
  const [sessionId] = useState(() => `session_${Date.now()}`);

  return (
    <>
      <Head>
        <title>FLUX Enterprise - Multi-Agent SDLC Workspace</title>
        <meta name="description" content="Professional enterprise multi-agent SDLC platform with GitHub/JIRA integration" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Professional Header */}
      <div className="bg-slate-900/95 backdrop-blur-xl border-b border-slate-700/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Link href="/dashboard">
                <div className="bg-gradient-to-r from-blue-600 to-cyan-500 p-2 rounded-lg cursor-pointer hover:shadow-lg transition-all">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
              </Link>
              <div>
                <h1 className="text-lg font-bold text-white">FLUX Enterprise</h1>
                <p className="text-xs text-slate-400">Agent Workspace</p>
              </div>
            </div>

            <nav className="flex space-x-2">
              <Link href="/dashboard" className="px-3 py-1.5 bg-slate-700 text-slate-300 rounded-lg text-sm font-medium hover:bg-slate-600 transition-colors">
                Dashboard
              </Link>
              <Link href="/" className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                Workspace
              </Link>
            </nav>
          </div>
        </div>
      </div>

      <EnhancedChatInterface sessionId={sessionId} />
    </>
  );
}