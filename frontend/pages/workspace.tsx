// pages/workspace.tsx - AI Agent Collaboration Workspace
import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { EnhancedChatInterface } from '../components/EnhancedChat';

export default function Workspace() {
  const [sessionId] = useState(() => `session_${Date.now()}`);

  return (
    <>
      <Head>
        <title>AI Workspace - FLUX Enterprise</title>
        <meta name="description" content="Collaborate with AI agents on your SDLC tasks" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Professional Header */}
      <div className="bg-slate-900/95 backdrop-blur-xl border-b border-slate-700/50 sticky top-0 z-50 shadow-xl">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard">
                <div className="bg-gradient-to-r from-blue-600 to-cyan-500 p-3 rounded-xl cursor-pointer hover:shadow-lg transition-all transform hover:scale-105">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
              </Link>
              <div>
                <h1 className="text-xl font-bold text-white">FLUX Enterprise</h1>
                <p className="text-sm text-slate-400">AI Agent Workspace</p>
              </div>
            </div>

            <nav className="flex space-x-2">
              <Link href="/dashboard" className="px-4 py-2 bg-slate-700 text-slate-300 rounded-lg text-sm font-medium hover:bg-slate-600 transition-colors">
                Dashboard
              </Link>
              <Link href="/workspace" className="px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-lg text-sm font-medium hover:from-blue-700 hover:to-cyan-600 transition-colors shadow-lg">
                AI Workspace
              </Link>
            </nav>
          </div>
        </div>
      </div>

      <EnhancedChatInterface sessionId={sessionId} />
    </>
  );
}
