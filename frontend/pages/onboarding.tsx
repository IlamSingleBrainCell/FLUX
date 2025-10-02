import React from 'react';
import Head from 'next/head';
import { useOnboarding } from '../contexts/OnboardingContext';
import { useCommandPalette } from '../components/CommandPalette/CommandPalette';

export default function OnboardingPage() {
  useCommandPalette();
  const {
    startOnboarding,
    isNewUser,
    showSampleData,
    toggleSampleData,
    hasSeenFeature,
    markFeatureAsSeen
  } = useOnboarding();

  const features = [
    {
      id: 'ai-agents',
      icon: '🤖',
      title: 'AI Agent Workspace',
      description: 'Chat with 7 specialized AI agents for every role in your team',
      link: '/workspace',
      color: 'from-purple-500 to-pink-500'
    },
    {
      id: 'analytics',
      icon: '📊',
      title: 'Advanced Analytics',
      description: 'Real-time insights with 6 chart types for complete visibility',
      link: '/analytics',
      color: 'from-orange-500 to-red-500'
    },
    {
      id: 'code-review',
      icon: '🔍',
      title: 'AI Code Review',
      description: 'Automated security scanning, performance checks, and auto-fix',
      link: '/code-review',
      color: 'from-blue-500 to-purple-500'
    },
    {
      id: 'multi-project',
      icon: '🗂️',
      title: 'Multi-Project Workspace',
      description: 'Manage multiple projects with context preservation',
      link: '/multi-project',
      color: 'from-green-500 to-emerald-500'
    },
    {
      id: 'integrations',
      icon: '🔌',
      title: 'Integration Hub',
      description: 'Connect with Jira, Slack, GitHub, and 10+ platforms',
      link: '/integrations',
      color: 'from-cyan-500 to-blue-500'
    },
    {
      id: 'templates',
      icon: '🎯',
      title: 'Workflow Templates',
      description: 'Pre-built templates for sprint planning, deployments, and more',
      link: '/templates',
      color: 'from-indigo-500 to-blue-500'
    },
    {
      id: 'voice-control',
      icon: '🎤',
      title: 'Voice Commands',
      description: 'Hands-free control with "Hey FLUX" voice commands',
      link: '#voice',
      color: 'from-pink-500 to-purple-500'
    },
    {
      id: 'conversations',
      icon: '💭',
      title: 'Conversation History',
      description: 'Never lose context - all chats saved and exportable',
      link: '/conversations',
      color: 'from-blue-400 to-indigo-500'
    }
  ];

  const quickStartGuides = [
    {
      title: '🚀 Create Your First Project',
      steps: [
        'Go to Projects page',
        'Click "New Project" button',
        'Fill in project details',
        'Assign team members',
        'Start chatting with AI agents'
      ]
    },
    {
      title: '💬 Start a Conversation with Neymar',
      steps: [
        'Navigate to AI Workspace',
        'Click on Neymar (Developer) ⚽',
        'Type your question or use voice',
        'Neymar will help with coding tasks',
        'He can collaborate with other agents like Messi and Ronaldo'
      ]
    },
    {
      title: '🔍 Run Your First Code Review',
      steps: [
        'Go to Code Review page',
        'Click "Run Analysis"',
        'Review detected issues',
        'Use "Auto-Fix" for simple issues',
        'Generate compliance report'
      ]
    },
    {
      title: '📊 Explore Analytics Dashboard',
      steps: [
        'Navigate to Analytics page',
        'View team performance metrics',
        'Check sprint burndown charts',
        'Analyze code quality scores',
        'Export reports (PDF/Excel)'
      ]
    }
  ];

  const keyboardShortcuts = [
    { keys: ['Ctrl', 'K'], description: 'Open Command Palette' },
    { keys: ['1-9'], description: 'Navigate to pages' },
    { keys: ['?'], description: 'Show all shortcuts' },
    { keys: ['Ctrl', 'Shift', 'M'], description: 'Call Messi (Requirements Analyst)' },
    { keys: ['Ctrl', 'Shift', 'R'], description: 'Call Ronaldo (Software Architect)' },
    { keys: ['Ctrl', 'Shift', 'N'], description: 'Call Neymar (Developer)' },
    { keys: ['Ctrl', 'Shift', 'Q'], description: 'Call Mbappé (QA Tester)' },
    { keys: ['Ctrl', 'Shift', 'B'], description: 'Call Benzema (DevOps Engineer)' },
    { keys: ['Ctrl', 'F'], description: 'Search conversation' }
  ];

  const videoTutorials = [
    {
      title: 'Getting Started with FLUX',
      duration: '5:30',
      thumbnail: '🎬',
      topics: ['Platform Overview', 'Navigation', 'First Project']
    },
    {
      title: 'AI Agents Deep Dive',
      duration: '8:15',
      thumbnail: '🤖',
      topics: ['Agent Capabilities', 'Collaboration', 'Customization']
    },
    {
      title: 'Advanced Analytics Tutorial',
      duration: '6:45',
      thumbnail: '📊',
      topics: ['Chart Types', 'Insights', 'Reporting']
    },
    {
      title: 'Integration Setup Guide',
      duration: '7:20',
      thumbnail: '🔌',
      topics: ['Jira', 'Slack', 'GitHub', 'Calendar']
    }
  ];

  return (
    <>
      <Head>
        <title>Onboarding - FLUX Enterprise</title>
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-950 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-8 mb-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-3">
                  👋 Welcome to FLUX Enterprise!
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-400">
                  Your AI-powered software development lifecycle platform
                </p>
              </div>
              {isNewUser && (
                <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-full text-sm font-semibold animate-pulse">
                  🎉 New User
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={startOnboarding}
                className="px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold text-lg hover:shadow-lg transition flex items-center justify-center gap-2"
              >
                🚀 Start Interactive Tour
              </button>
              <button className="px-6 py-4 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold text-lg transition flex items-center justify-center gap-2">
                📹 Watch Video Tutorials
              </button>
              <button className="px-6 py-4 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-semibold text-lg transition flex items-center justify-center gap-2">
                📚 Read Documentation
              </button>
            </div>
          </div>

          {/* Sample Data Toggle */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                  🎮 Sample Data Mode
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Enable sample data to explore features with pre-populated projects, conversations, and analytics
                </p>
              </div>
              <button
                onClick={toggleSampleData}
                className={`relative inline-flex h-8 w-16 items-center rounded-full transition ${
                  showSampleData ? 'bg-green-600' : 'bg-gray-300 dark:bg-gray-600'
                }`}
              >
                <span
                  className={`inline-block h-6 w-6 transform rounded-full bg-white transition ${
                    showSampleData ? 'translate-x-9' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Feature Cards */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              ✨ Platform Features
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {features.map(feature => (
                <a
                  key={feature.id}
                  href={feature.link}
                  onClick={() => markFeatureAsSeen(feature.id)}
                  className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-xl transition group"
                >
                  <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition`}>
                    {feature.icon}
                  </div>
                  <h3 className="font-bold text-gray-900 dark:text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {feature.description}
                  </p>
                  {!hasSeenFeature(feature.id) && (
                    <span className="inline-block mt-3 px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-semibold rounded">
                      NEW
                    </span>
                  )}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Start Guides */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                🚀 Quick Start Guides
              </h2>
              <div className="space-y-4">
                {quickStartGuides.map((guide, idx) => (
                  <div key={idx} className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                    <h3 className="font-bold text-gray-900 dark:text-white mb-3">
                      {guide.title}
                    </h3>
                    <ol className="space-y-2">
                      {guide.steps.map((step, stepIdx) => (
                        <li key={stepIdx} className="flex items-start gap-3 text-sm text-gray-700 dark:text-gray-300">
                          <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                            {stepIdx + 1}
                          </span>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              {/* Keyboard Shortcuts */}
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  ⌨️ Keyboard Shortcuts
                </h2>
                <div className="space-y-3">
                  {keyboardShortcuts.map((shortcut, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                      <span className="text-gray-700 dark:text-gray-300">
                        {shortcut.description}
                      </span>
                      <div className="flex gap-1">
                        {shortcut.keys.map((key, keyIdx) => (
                          <kbd
                            key={keyIdx}
                            className="px-3 py-1.5 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded font-mono text-sm font-semibold"
                          >
                            {key}
                          </kbd>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                <button className="w-full mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition">
                  View All Shortcuts (Press ?)
                </button>
              </div>

              {/* Video Tutorials */}
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  📹 Video Tutorials
                </h2>
                <div className="space-y-3">
                  {videoTutorials.map((video, idx) => (
                    <button
                      key={idx}
                      className="w-full bg-gray-50 dark:bg-gray-900 rounded-lg p-4 hover:bg-gray-100 dark:hover:bg-gray-800 transition text-left"
                    >
                      <div className="flex items-start gap-4">
                        <div className="text-4xl">{video.thumbnail}</div>
                        <div className="flex-1">
                          <h3 className="font-bold text-gray-900 dark:text-white mb-1">
                            {video.title}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                            Duration: {video.duration}
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {video.topics.map((topic, topicIdx) => (
                              <span
                                key={topicIdx}
                                className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs rounded"
                              >
                                {topic}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Help & Support */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 text-white">
            <h2 className="text-3xl font-bold mb-4">🤝 Need Help?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h3 className="font-bold mb-2">💬 Live Chat Support</h3>
                <p className="text-blue-100 text-sm mb-3">
                  Get instant help from our AI agents or human support team
                </p>
                <button className="px-4 py-2 bg-white text-blue-600 rounded-lg font-semibold hover:shadow-lg transition">
                  Start Chat
                </button>
              </div>
              <div>
                <h3 className="font-bold mb-2">📚 Documentation</h3>
                <p className="text-blue-100 text-sm mb-3">
                  Comprehensive guides, API docs, and best practices
                </p>
                <button className="px-4 py-2 bg-white text-blue-600 rounded-lg font-semibold hover:shadow-lg transition">
                  View Docs
                </button>
              </div>
              <div>
                <h3 className="font-bold mb-2">👥 Community Forum</h3>
                <p className="text-blue-100 text-sm mb-3">
                  Connect with other users and share experiences
                </p>
                <button className="px-4 py-2 bg-white text-blue-600 rounded-lg font-semibold hover:shadow-lg transition">
                  Join Forum
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
