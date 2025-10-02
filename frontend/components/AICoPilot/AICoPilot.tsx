// AI Co-Pilot Assistant - Floating Chat Bubble with Context-Aware Suggestions
import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';

interface Message {
  id: string;
  type: 'user' | 'assistant' | 'suggestion';
  content: string;
  timestamp: string;
  actions?: {
    label: string;
    action: () => void;
  }[];
}

interface Suggestion {
  id: string;
  title: string;
  description: string;
  icon: string;
  priority: 'high' | 'medium' | 'low';
  action: () => void;
}

interface CoPilotProps {
  currentPage: string;
}

export default function AICoPilot({ currentPage }: CoPilotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [listeningForVoice, setListeningForVoice] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Context-aware suggestions based on current page
  useEffect(() => {
    const generateSuggestions = () => {
      const baseSuggestions: Record<string, Suggestion[]> = {
        dashboard: [
          {
            id: 'export-metrics',
            title: 'Export Metrics Report',
            description: 'Generate a comprehensive PDF report of your current metrics',
            icon: '📊',
            priority: 'medium',
            action: () => sendMessage('Export current dashboard metrics as PDF')
          },
          {
            id: 'performance-insights',
            title: 'Performance Insights',
            description: 'Get AI-powered analysis of your team performance trends',
            icon: '🔍',
            priority: 'high',
            action: () => sendMessage('Analyze team performance and suggest improvements')
          },
          {
            id: 'setup-alerts',
            title: 'Setup Smart Alerts',
            description: 'Configure intelligent notifications for critical metrics',
            icon: '🔔',
            priority: 'medium',
            action: () => sendMessage('Help me setup smart alerts for important metrics')
          }
        ],
        projects: [
          {
            id: 'create-epic',
            title: 'Create New Epic',
            description: 'Start a new project epic with AI-generated story breakdown',
            icon: '➕',
            priority: 'high',
            action: () => sendMessage('Help me create a new epic with story breakdown')
          },
          {
            id: 'sprint-planning',
            title: 'Sprint Planning Assistant',
            description: 'Get recommendations for upcoming sprint planning',
            icon: '📋',
            priority: 'high',
            action: () => sendMessage('Help me plan the next sprint based on current velocity')
          },
          {
            id: 'risk-analysis',
            title: 'Project Risk Analysis',
            description: 'Identify potential blockers and risks in current projects',
            icon: '⚠️',
            priority: 'medium',
            action: () => sendMessage('Analyze risks in current projects and suggest mitigation')
          }
        ],
        workspace: [
          {
            id: 'agent-recommendations',
            title: 'Agent Recommendations',
            description: 'Find the best agents for your current task',
            icon: '🤖',
            priority: 'high',
            action: () => sendMessage('Which agents would be best for my current task?')
          },
          {
            id: 'collaboration-tips',
            title: 'Collaboration Tips',
            description: 'Learn how to work more effectively with AI agents',
            icon: '💡',
            priority: 'medium',
            action: () => sendMessage('Give me tips for better AI agent collaboration')
          },
          {
            id: 'workflow-optimization',
            title: 'Optimize Workflow',
            description: 'Improve your current agent workflow setup',
            icon: '⚡',
            priority: 'medium',
            action: () => sendMessage('How can I optimize my current workflow?')
          }
        ],
        analytics: [
          {
            id: 'forecast-analysis',
            title: 'Forecast Analysis',
            description: 'Generate predictions based on current trends',
            icon: '📈',
            priority: 'high',
            action: () => sendMessage('Generate forecasts based on current analytics data')
          },
          {
            id: 'anomaly-detection',
            title: 'Anomaly Detection',
            description: 'Identify unusual patterns in your data',
            icon: '🔍',
            priority: 'medium',
            action: () => sendMessage('Check for anomalies in current analytics data')
          },
          {
            id: 'kpi-optimization',
            title: 'KPI Optimization',
            description: 'Suggestions to improve key performance indicators',
            icon: '🎯',
            priority: 'high',
            action: () => sendMessage('How can I improve my KPIs based on current data?')
          }
        ],
        integrations: [
          {
            id: 'health-check',
            title: 'Integration Health Check',
            description: 'Verify all integrations are working properly',
            icon: '🏥',
            priority: 'high',
            action: () => sendMessage('Run a health check on all integrations')
          },
          {
            id: 'new-integrations',
            title: 'Suggest Integrations',
            description: 'Recommend new tools to integrate with your workflow',
            icon: '🔌',
            priority: 'medium',
            action: () => sendMessage('What new integrations would benefit my workflow?')
          },
          {
            id: 'troubleshoot',
            title: 'Troubleshoot Issues',
            description: 'Help resolve integration problems',
            icon: '🔧',
            priority: 'medium',
            action: () => sendMessage('Help me troubleshoot integration issues')
          }
        ],
        settings: [
          {
            id: 'security-audit',
            title: 'Security Audit',
            description: 'Review and improve security settings',
            icon: '🛡️',
            priority: 'high',
            action: () => sendMessage('Audit my security settings and suggest improvements')
          },
          {
            id: 'performance-tuning',
            title: 'Performance Tuning',
            description: 'Optimize platform performance settings',
            icon: '⚡',
            priority: 'medium',
            action: () => sendMessage('Help me optimize platform performance settings')
          },
          {
            id: 'backup-setup',
            title: 'Backup Configuration',
            description: 'Ensure proper backup and recovery setup',
            icon: '💾',
            priority: 'medium',
            action: () => sendMessage('Help me configure backup and recovery settings')
          }
        ]
      };

      // Add universal suggestions
      const universalSuggestions: Suggestion[] = [
        {
          id: 'quick-help',
          title: 'Quick Help',
          description: 'Get help with current page features',
          icon: '❓',
          priority: 'low',
          action: () => sendMessage(`Help me understand the ${currentPage} page features`)
        },
        {
          id: 'keyboard-shortcuts',
          title: 'Keyboard Shortcuts',
          description: 'Learn useful keyboard shortcuts',
          icon: '⌨️',
          priority: 'low',
          action: () => sendMessage('Show me keyboard shortcuts for this page')
        }
      ];

      const pageSuggestions = baseSuggestions[currentPage] || [];
      setSuggestions([...pageSuggestions.slice(0, 3), ...universalSuggestions]);
    };

    generateSuggestions();
  }, [currentPage]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Initialize with welcome message based on page
  useEffect(() => {
    if (messages.length === 0) {
      const welcomeMessages: Record<string, string> = {
        dashboard: "Hi! I'm your AI Co-Pilot. I can help you analyze your metrics, create reports, and optimize your dashboard. What would you like to explore?",
        projects: "Hello! I'm here to help with project management. I can assist with epic creation, sprint planning, and project risk analysis. How can I help?",
        workspace: "Hey there! I can help you work more effectively with AI agents, optimize workflows, and improve collaboration. What's on your mind?",
        analytics: "Hi! I specialize in data analysis and forecasting. I can help you understand trends, detect anomalies, and optimize KPIs. What would you like to analyze?",
        integrations: "Hello! I can help you manage integrations, troubleshoot issues, and suggest new tools for your workflow. How can I assist?",
        settings: "Hi! I can help you optimize settings, improve security, and configure your platform. What would you like to adjust?",
        marketplace: "Welcome! I can help you find the perfect agents, understand their capabilities, and optimize your agent selection. What are you looking for?",
        timeline: "Hello! I can help you analyze your project timeline, understand patterns, and generate audit reports. What insights do you need?"
      };

      const welcomeMessage = welcomeMessages[currentPage] || "Hi! I'm your AI Co-Pilot assistant. How can I help you today?";
      
      setMessages([{
        id: '1',
        type: 'assistant',
        content: welcomeMessage,
        timestamp: new Date().toISOString()
      }]);
    }
  }, [currentPage, messages.length]);

  const sendMessage = (content: string) => {
    if (!content.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const responses = getContextualResponse(content, currentPage);
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: responses.content,
        timestamp: new Date().toISOString(),
        actions: responses.actions
      };

      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const getContextualResponse = (query: string, page: string) => {
    const responses: Record<string, any> = {
      dashboard: {
        content: "I can help you with dashboard analytics! Based on your current metrics, I notice your team velocity has increased by 15% this week. Would you like me to generate a detailed report or set up alerts for key metrics?",
        actions: [
          { label: "📊 Generate Report", action: () => alert("Generating dashboard report...") },
          { label: "🔔 Setup Alerts", action: () => router.push('/settings') }
        ]
      },
      projects: {
        content: "Great! For project management, I can help you create epics, plan sprints, or analyze project risks. Your current sprint completion rate is 87%. Would you like to optimize your next sprint planning?",
        actions: [
          { label: "➕ Create Epic", action: () => alert("Opening epic creation wizard...") },
          { label: "📋 Plan Sprint", action: () => alert("Starting sprint planning assistant...") }
        ]
      },
      workspace: {
        content: "I can enhance your agent collaboration! Based on your usage patterns, Sarah (Developer) and Marcus (PM) work great together. Would you like suggestions for optimizing your agent workflow?",
        actions: [
          { label: "🤖 Optimize Workflow", action: () => alert("Analyzing workflow optimization...") },
          { label: "💡 Agent Tips", action: () => alert("Showing collaboration tips...") }
        ]
      }
    };

    return responses[page] || {
      content: "I understand you're looking for help. Let me analyze your request and provide the best assistance for your current context. How can I make your workflow more efficient?",
      actions: [
        { label: "💡 Get Suggestions", action: () => setShowSuggestions(true) }
      ]
    };
  };

  const startVoiceRecognition = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setListeningForVoice(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputValue(transcript);
        setListeningForVoice(false);
      };

      recognition.onerror = () => {
        setListeningForVoice(false);
      };

      recognition.onend = () => {
        setListeningForVoice(false);
      };

      recognition.start();
    } else {
      alert('Speech recognition not supported in this browser');
    }
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsOpen(true)}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-full p-4 shadow-xl hover:shadow-2xl transition-all transform hover:scale-110 animate-pulse"
        >
          <div className="text-2xl">🤖</div>
        </button>
        {suggestions.length > 0 && (
          <div className="absolute bottom-16 right-0 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 p-3 max-w-xs">
            <div className="text-sm font-medium text-gray-900 dark:text-white mb-2">
              💡 Quick Suggestion
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">
              {suggestions[0]?.description}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`fixed bottom-6 right-6 z-50 transition-all duration-300 ${
      isMinimized ? 'w-80 h-16' : 'w-96 h-[600px]'
    }`}>
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 h-full flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="text-2xl">🤖</div>
            <div>
              <div className="text-white font-semibold">AI Co-Pilot</div>
              <div className="text-blue-100 text-xs">
                {isTyping ? 'Thinking...' : `Helping with ${currentPage}`}
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="text-white hover:text-blue-100 transition-colors"
            >
              {isMinimized ? '📖' : '📝'}
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-blue-100 transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        {!isMinimized && (
          <>
            {/* Suggestions */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    💡 Quick Actions
                  </div>
                  <button
                    onClick={() => setShowSuggestions(false)}
                    className="text-xs text-gray-500 hover:text-gray-700"
                  >
                    Hide
                  </button>
                </div>
                <div className="space-y-2">
                  {suggestions.slice(0, 2).map(suggestion => (
                    <button
                      key={suggestion.id}
                      onClick={suggestion.action}
                      className="w-full text-left p-2 bg-white dark:bg-gray-800 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border border-gray-200 dark:border-gray-600"
                    >
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">{suggestion.icon}</span>
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {suggestion.title}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {suggestion.description}
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map(message => (
                <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] rounded-lg p-3 ${
                    message.type === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white'
                  }`}>
                    <div className="text-sm">{message.content}</div>
                    {message.actions && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {message.actions.map((action, index) => (
                          <button
                            key={index}
                            onClick={action.action}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md text-xs font-medium transition-colors"
                          >
                            {action.label}
                          </button>
                        ))}
                      </div>
                    )}
                    <div className="text-xs opacity-70 mt-1">
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage(inputValue)}
                  placeholder="Ask me anything..."
                  className="flex-1 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  onClick={startVoiceRecognition}
                  className={`p-2 rounded-lg transition-colors ${
                    listeningForVoice 
                      ? 'bg-red-600 text-white animate-pulse' 
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                  }`}
                >
                  🎤
                </button>
                <button
                  onClick={() => sendMessage(inputValue)}
                  className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition-colors"
                >
                  📤
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// Hook to get current page name
export function useCurrentPage() {
  const router = useRouter();
  
  const getPageName = (path: string) => {
    if (path === '/') return 'dashboard';
    return path.split('/')[1] || 'dashboard';
  };

  return getPageName(router.pathname);
}