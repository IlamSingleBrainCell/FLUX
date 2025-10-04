// pages/workspace.tsx - AI Agent Collaboration Workspace (REDESIGNED)
import React, { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { AgentInfo, UploadedFile } from '../types/agents';
import { enterpriseAgents } from '../config/agents';
import { DocumentUpload } from '../components/DocumentUpload/DocumentUpload';
import { GitHubAuth } from '../components/GitHub/GitHubAuth';
import { GitHubRepoBrowser } from '../components/GitHub/GitHubRepoBrowser';
import { AgentDropdown, getDefaultAgent, getAllAgents } from '../components/AgentChat/AgentDropdown';
import { MarkdownRenderer } from '../components/AgentChat/MarkdownRenderer';
import { ConversationSidebar } from '../components/AgentChat/ConversationSidebar';
import {
  saveConversation,
  loadConversation,
  getCurrentConversationId,
  createNewConversation,
  generateConversationTitle,
  Conversation,
} from '../utils/conversationStorage';

// New workspace enhancement components
import { MessageReactions } from '../components/Workspace/MessageReactions';
import { SmartPrompts } from '../components/Workspace/SmartPrompts';
import { PinnedMessages } from '../components/Workspace/PinnedMessages';
import { MultiFileUpload } from '../components/Workspace/MultiFileUpload';
import { AgentPerformance } from '../components/Workspace/AgentPerformance';
import { KeyboardShortcutsPanel, useKeyboardShortcuts } from '../components/Workspace/KeyboardShortcuts';
import { TemplateLibrary } from '../components/Workspace/TemplateLibrary';
import { ExportMenu } from '../components/Workspace/ExportMenu';
import { AgentOrchestrator } from '../components/Workspace/AgentOrchestrator';

// Utilities for new features
import { streamChatResponse, StreamController } from '../utils/streamingResponse';
import { createPromptWithFileContext, analyzeFiles } from '../utils/fileContextManager';

interface Message {
  id: string;
  agentId: string;
  agentName: string;
  content: string;
  timestamp: string;
  isUser?: boolean;
  typing?: boolean;
  artifact?: {
    type: 'code' | 'design' | 'document' | 'diagram';
    title: string;
    content: string;
    language?: string;
  };
}

interface AgentStatus {
  id: string;
  status: 'offline' | 'online' | 'typing' | 'thinking';
  lastSeen?: string;
}

export default function Workspace() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [agentStatuses, setAgentStatuses] = useState<AgentStatus[]>(
    enterpriseAgents.map(agent => ({
      id: agent.id,
      status: 'offline' as const,
      lastSeen: new Date().toISOString()
    }))
  );
  const [selectedArtifact, setSelectedArtifact] = useState<Message['artifact'] | null>(null);
  const [showWelcome, setShowWelcome] = useState(true);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  
  // GitHub integration state
  const [githubToken, setGithubToken] = useState<string>('');
  const [isGitHubConnected, setIsGitHubConnected] = useState(false);
  const [showGitHubBrowser, setShowGitHubBrowser] = useState(false);
  
  // Agent selection state (GitHub Copilot style)
  const [selectedAgent, setSelectedAgent] = useState(getDefaultAgent());
  const [chatMode, setChatMode] = useState<'single' | 'team'>('team'); // single agent or team collaboration

  // Message persistence state
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [showConversationSidebar, setShowConversationSidebar] = useState(false);
  
  // Streaming state
  const [streamingMessage, setStreamingMessage] = useState<{
    agentId: string;
    agentName: string;
    content: string;
  } | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const streamControllerRef = useRef<StreamController>(new StreamController());
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Orchestrator state
  const [showOrchestrator, setShowOrchestrator] = useState(false);
  const [orchestratorTasks, setOrchestratorTasks] = useState<any[]>([]);

  // New feature states
  const [messageReactions, setMessageReactions] = useState<Record<string, any[]>>({});
  const [messageRatings, setMessageRatings] = useState<Record<string, number>>({});
  const [pinnedMessages, setPinnedMessages] = useState<any[]>([]);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [agentMetrics] = useState([
    { id: 'requirements_analyst', name: 'Messi', avatar: '⚽', accuracy: 96, avgResponseTime: 1.1, tasksCompleted: 34, userRating: 4.9, specialties: ['Requirements', 'User Stories'], trend: 'up' as const },
    { id: 'software_architect', name: 'Ronaldo', avatar: '🏗️', accuracy: 94, avgResponseTime: 1.3, tasksCompleted: 28, userRating: 4.8, specialties: ['Architecture', 'Design Patterns'], trend: 'up' as const },
    { id: 'developer', name: 'Neymar', avatar: '💻', accuracy: 95, avgResponseTime: 1.2, tasksCompleted: 45, userRating: 4.9, specialties: ['Full-Stack', 'Code Generation'], trend: 'up' as const },
    { id: 'qa_tester', name: 'Mbappé', avatar: '🧪', accuracy: 97, avgResponseTime: 0.9, tasksCompleted: 52, userRating: 5.0, specialties: ['Testing', 'Quality Assurance'], trend: 'up' as const },
    { id: 'devops_engineer', name: 'Benzema', avatar: '🚀', accuracy: 93, avgResponseTime: 1.4, tasksCompleted: 31, userRating: 4.7, specialties: ['CI/CD', 'Infrastructure'], trend: 'stable' as const },
    { id: 'project_manager', name: 'Modrić', avatar: '📊', accuracy: 92, avgResponseTime: 1.5, tasksCompleted: 26, userRating: 4.6, specialties: ['Planning', 'Coordination'], trend: 'stable' as const },
    { id: 'security_expert', name: 'Ramos', avatar: '🔒', accuracy: 98, avgResponseTime: 1.0, tasksCompleted: 19, userRating: 5.0, specialties: ['Security', 'Compliance'], trend: 'up' as const },
  ]);

  // Load conversation on mount
  useEffect(() => {
    const loadInitialConversation = async () => {
      const savedId = getCurrentConversationId();
      if (savedId) {
        const conversation = await loadConversation(savedId);
        if (conversation) {
          setCurrentConversationId(conversation.id);
          setMessages(conversation.messages);
          setChatMode(conversation.mode);
          if (conversation.selectedAgent) {
            const agent = getAllAgents().find(a => a.id === conversation.selectedAgent);
            if (agent) setSelectedAgent(agent);
          }
          setShowWelcome(conversation.messages.length === 0);
        }
      }
    };
    loadInitialConversation();
  }, []);

  // Auto-save conversation when messages change
  useEffect(() => {
    if (messages.length > 0) {
      const saveCurrentConversation = async () => {
        const conversation: Conversation = {
          id: currentConversationId || createNewConversation(chatMode, selectedAgent.id).id,
          title: generateConversationTitle(messages),
          messages,
          createdAt: currentConversationId ? (await loadConversation(currentConversationId))?.createdAt || new Date().toISOString() : new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          mode: chatMode,
          selectedAgent: selectedAgent.id,
        };
        await saveConversation(conversation);
        if (!currentConversationId) {
          setCurrentConversationId(conversation.id);
        }
      };
      saveCurrentConversation();
    }
  }, [messages, chatMode, selectedAgent, currentConversationId]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamingMessage]);

  // Conversation management functions
  const handleNewConversation = () => {
    const newConv = createNewConversation(chatMode, selectedAgent.id);
    setCurrentConversationId(newConv.id);
    setMessages([]);
    setShowWelcome(true);
    setUploadedFiles([]);
  };

  const handleSelectConversation = async (conversation: Conversation) => {
    setCurrentConversationId(conversation.id);
    setMessages(conversation.messages);
    setChatMode(conversation.mode);
    if (conversation.selectedAgent) {
      const agent = getAllAgents().find(a => a.id === conversation.selectedAgent);
      if (agent) setSelectedAgent(agent);
    }
    setShowWelcome(conversation.messages.length === 0);
  };

  // New feature handlers
  const handleReact = (messageId: string, emoji: string) => {
    setMessageReactions(prev => ({
      ...prev,
      [messageId]: [...(prev[messageId] || []), { emoji, user: 'You' }]
    }));
  };

  const handleRateMessage = (messageId: string, rating: number) => {
    setMessageRatings(prev => ({ ...prev, [messageId]: rating }));
  };

  const togglePin = (messageId: string) => {
    const message = messages.find(m => m.id === messageId);
    if (!message) return;
    
    setPinnedMessages(prev => {
      const isPinned = prev.some(p => p.id === messageId);
      if (isPinned) {
        return prev.filter(p => p.id !== messageId);
      } else {
        return [...prev, {
          id: messageId,
          agentName: message.agentName,
          content: message.content,
          timestamp: message.timestamp,
          messageIndex: messages.indexOf(message)
        }];
      }
    });
  };

  const jumpToMessage = (index: number) => {
    const messageElements = document.querySelectorAll('[data-message-index]');
    messageElements[index]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const handleSelectTemplate = (template: string) => {
    setInputMessage(template);
    setShowTemplates(false);
  };

  // Regenerate message function
  const handleRegenerateMessage = async (messageId: string) => {
    const messageIndex = messages.findIndex(m => m.id === messageId);
    if (messageIndex < 0) return;

    const message = messages[messageIndex];
    
    // Find the original user message (should be right before this one)
    const userMessage = messages[messageIndex - 1];
    if (!userMessage || !userMessage.isUser) {
      console.error('Could not find user message to regenerate');
      return;
    }

    // Remove the old agent response
    setMessages(prev => prev.filter(m => m.id !== messageId));

    // Resend the user's message
    const targetAgentId = message.agentId;
    const targetAgent = enterpriseAgents.find(a => a.id === targetAgentId);
    
    if (!targetAgent) return;

    // Bring agent online and show typing
    bringAgentOnline(targetAgentId);
    setAgentStatuses(prev => 
      prev.map(status => 
        status.id === targetAgentId 
          ? { ...status, status: 'typing' as const }
          : status
      )
    );

    try {
      const apiUrl = getApiUrl();
      const response = await fetch(`${apiUrl}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          message: userMessage.content,
          chat_mode: chatMode
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      
      // Add new response
      if (data.responses && Array.isArray(data.responses)) {
        data.responses.forEach((resp: any) => {
          const agentMsg: Message = {
            id: `msg_${Date.now()}_${resp.agent}_regen`,
            agentId: resp.agent || targetAgentId,
            agentName: resp.agent_name || targetAgent.name,
            content: resp.message,
            timestamp: new Date().toISOString(),
            artifact: resp.artifact || undefined
          };

          setMessages(prev => [...prev, agentMsg]);
        });
      }

      setAgentStatuses(prev => 
        prev.map(status => 
          status.id === targetAgentId 
            ? { ...status, status: 'online' as const }
            : status
        )
      );
    } catch (error) {
      console.error('Regeneration error:', error);
      setAgentStatuses(prev => 
        prev.map(status => 
          status.id === targetAgentId 
            ? { ...status, status: 'offline' as const }
            : status
        )
      );
    }
  };

  // Stop streaming function
  const handleStopStreaming = () => {
    streamControllerRef.current.abort();
    setIsStreaming(false);
    
    // Add incomplete streaming message to messages
    if (streamingMessage) {
      const msg: Message = {
        id: `msg_${Date.now()}_stream`,
        agentId: streamingMessage.agentId,
        agentName: streamingMessage.agentName,
        content: streamingMessage.content + '\n\n[Response stopped by user]',
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, msg]);
      setStreamingMessage(null);
    }
  };

  // Simulate agent coming online when called
  const bringAgentOnline = (agentId: string) => {
    setAgentStatuses(prev => 
      prev.map(status => 
        status.id === agentId 
          ? { ...status, status: 'online' as const }
          : status
      )
    );
  };

  // Simulate agent going offline
  const sendAgentOffline = (agentId: string) => {
    setAgentStatuses(prev => 
      prev.map(status => 
        status.id === agentId 
          ? { ...status, status: 'offline' as const, lastSeen: new Date().toISOString() }
          : status
      )
    );
  };

  const getApiUrl = () => {
    // Production: use Vercel API
    if (typeof window !== 'undefined' && window.location.hostname.includes('vercel.app')) {
      return `${window.location.origin}/api`;
    }
    // Development: use local backend or configured API
    if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_API_URL) {
      return process.env.NEXT_PUBLIC_API_URL;
    }
    return process.env.NODE_ENV === 'production' 
      ? '/api' 
      : 'http://localhost:8000';
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    setShowWelcome(false);

    // Prepare message with file context if files are uploaded
    let finalMessage = inputMessage;
    if (uploadedFiles.length > 0) {
      const fileAnalysis = analyzeFiles(uploadedFiles);
      console.log('File analysis:', fileAnalysis);
      finalMessage = createPromptWithFileContext(inputMessage, uploadedFiles);
    }

    // Add user message
    const userMsg: Message = {
      id: `msg_${Date.now()}`,
      agentId: 'user',
      agentName: 'You',
      content: inputMessage,
      timestamp: new Date().toISOString(),
      isUser: true
    };

    setMessages(prev => [...prev, userMsg]);

    // Prepare message based on chat mode
    let messageToSend = finalMessage;
    let targetAgentId: string;
    
    if (chatMode === 'single') {
      // Single agent mode - target the selected agent directly
      targetAgentId = selectedAgent.id;
      // Prepend agent name to message to ensure backend routes to correct agent
      messageToSend = `${selectedAgent.name} ${finalMessage}`;
    } else {
      // Team mode - detect which agent(s) to call
      const detectAgent = (msg: string): string => {
        const lower = msg.toLowerCase();
        if (lower.includes('requirement') || lower.includes('story') || lower.includes('messi')) return 'requirements_analyst';
        if (lower.includes('architect') || lower.includes('design') || lower.includes('ronaldo')) return 'software_architect';
        if (lower.includes('code') || lower.includes('develop') || lower.includes('neymar')) return 'developer';
        if (lower.includes('test') || lower.includes('qa') || lower.includes('mbappé')) return 'qa_tester';
        if (lower.includes('deploy') || lower.includes('devops') || lower.includes('benzema')) return 'devops_engineer';
        if (lower.includes('project') || lower.includes('manage') || lower.includes('modric')) return 'project_manager';
        if (lower.includes('security') || lower.includes('audit') || lower.includes('ramos')) return 'security_expert';
        return 'project_manager'; // default
      };
      targetAgentId = detectAgent(inputMessage);
    }

    const targetAgent = enterpriseAgents.find(a => a.id === targetAgentId);

    // Bring agent online
    bringAgentOnline(targetAgentId);

    // Show typing indicator
    setAgentStatuses(prev => 
      prev.map(status => 
        status.id === targetAgentId 
          ? { ...status, status: 'typing' as const }
          : status
      )
    );

    setInputMessage('');

    try {
      // Call real backend API
      const apiUrl = getApiUrl();
      const response = await fetch(`${apiUrl}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          message: messageToSend,
          uploaded_files: uploadedFiles, // Include uploaded files
          chat_mode: chatMode // Send chat mode to backend
        }),
      });

      // Handle HTTP 413 Payload Too Large
      if (response.status === 413) {
        setMessages(prev => [...prev, {
          id: Date.now().toString(),
          agentId: 'system',
          agentName: 'System Error',
          agent: 'system',
          content: '❌ Upload failed: Files are too large. Please reduce file size or upload fewer files. Maximum: 2MB per file, 5 files total.',
          timestamp: new Date().toISOString()
        }]);
        return;
      }

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      
      // Process responses from backend
      if (data.responses && Array.isArray(data.responses)) {
        data.responses.forEach((resp: any) => {
          const agentMsg: Message = {
            id: `msg_${Date.now()}_${resp.agent}`,
            agentId: resp.agent || targetAgentId,
            agentName: resp.agent_name || targetAgent?.name || 'Agent',
            content: resp.message,
            timestamp: resp.timestamp || new Date().toISOString(),
            artifact: resp.artifact || undefined
          };

          setMessages(prev => [...prev, agentMsg]);
          setAgentStatuses(prev => 
            prev.map(status => 
              status.id === (resp.agent || targetAgentId)
                ? { ...status, status: 'online' as const }
                : status
            )
          );
        });
      } else if (data.error) {
        // Show error message
        const errorMsg: Message = {
          id: `msg_${Date.now()}_error`,
          agentId: 'system',
          agentName: 'System',
          content: `Error: ${data.error}. ${data.message || 'Please check if GROQ_API_KEY is configured in Vercel.'}`,
          timestamp: new Date().toISOString(),
        };
        setMessages(prev => [...prev, errorMsg]);
        setAgentStatuses(prev => 
          prev.map(status => 
            status.id === targetAgentId 
              ? { ...status, status: 'offline' as const }
              : status
          )
        );
      }
    } catch (error) {
      console.error('API Error:', error);
      
      // Show error message to user
      const errorMsg: Message = {
        id: `msg_${Date.now()}_error`,
        agentId: 'system',
        agentName: 'System',
        content: `Failed to connect to backend API: ${error}. Please ensure the API is running or GROQ_API_KEY is configured in Vercel.`,
        timestamp: new Date().toISOString(),
      };
      
      setMessages(prev => [...prev, errorMsg]);
      setAgentStatuses(prev => 
        prev.map(status => 
          status.id === targetAgentId 
            ? { ...status, status: 'offline' as const }
            : status
        )
      );
    }
  };

  // Setup keyboard shortcuts (after handleSendMessage is defined)
  const shortcuts = [
    { key: 'Ctrl+N', description: 'New conversation', action: handleNewConversation, category: 'chat' as const },
    { key: 'Ctrl+H', description: 'Toggle history', action: () => setShowConversationSidebar(!showConversationSidebar), category: 'navigation' as const },
    { key: 'Ctrl+/', description: 'Show shortcuts', action: () => setShowShortcuts(true), category: 'navigation' as const },
    { key: 'Ctrl+T', description: 'Template library', action: () => setShowTemplates(true), category: 'chat' as const },
    { key: 'Ctrl+Enter', description: 'Send message', action: handleSendMessage, category: 'chat' as const },
    { key: 'Escape', description: 'Close modals', action: () => { setShowShortcuts(false); setShowTemplates(false); }, category: 'navigation' as const },
  ];

  useKeyboardShortcuts(shortcuts);

  const getAgentStatus = (agentId: string) => {
    return agentStatuses.find(s => s.id === agentId)?.status || 'offline';
  };

  return (
    <>
      <Head>
        <title>AI Workspace - FLUX Enterprise</title>
        <meta name="description" content="Collaborate with AI agents on your SDLC tasks" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        {/* Header */}
        <div className="bg-slate-900/95 backdrop-blur-xl border-b border-slate-700/50 sticky top-0 z-50 shadow-lg">
          <div className="max-w-[1800px] mx-auto px-6 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Link href="/dashboard">
                  <div className="bg-gradient-to-r from-blue-600 to-cyan-500 p-2 rounded-lg cursor-pointer hover:shadow-lg transition-all">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                </Link>
                <div>
                  <h1 className="text-lg font-bold text-white">AI Collaboration Workspace</h1>
                  <p className="text-xs text-slate-400">Real-time SDLC Agent Assistance</p>
                </div>
              </div>

              <nav className="flex space-x-2">
                <Link href="/dashboard" className="px-3 py-1.5 text-slate-300 rounded-lg text-sm hover:bg-slate-800 hover:text-white transition-colors">
                  Dashboard
                </Link>
                <Link href="/projects" className="px-3 py-1.5 text-slate-300 rounded-lg text-sm hover:bg-slate-800 hover:text-white transition-colors">
                  Projects
                </Link>
                <Link href="/workspace" className="px-3 py-1.5 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-lg text-sm shadow-lg shadow-blue-500/30">
                  Workspace
                </Link>
                <Link href="/artifacts" className="px-3 py-1.5 text-slate-300 rounded-lg text-sm hover:bg-slate-800 hover:text-white transition-colors flex items-center gap-1">
                  <span>📦</span>
                  Artifacts
                </Link>
              </nav>
            </div>
          </div>
        </div>

        {/* Main Workspace - 3 Column Layout */}
        <div className="max-w-[1800px] mx-auto px-6 py-6">
          <div className="relative h-[calc(100vh-140px)]">
            
            {/* Conversation Sidebar - Overlay on all screens */}
            {showConversationSidebar && (
              <ConversationSidebar
                currentConversationId={currentConversationId}
                onSelectConversation={handleSelectConversation}
                onNewConversation={handleNewConversation}
                isOpen={showConversationSidebar}
                onClose={() => setShowConversationSidebar(false)}
              />
            )}

            {/* Main Grid - Full width */}
            <div className="grid grid-cols-12 gap-6 h-full">
            
            {/* LEFT SIDEBAR - Team Members */}
            <div className="col-span-3 space-y-4">
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl shadow-lg border border-slate-700/50 p-4">
                <h2 className="text-sm font-bold text-white mb-3 flex items-center">
                  <svg className="w-4 h-4 mr-2 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  Team Members
                </h2>

                <div className="space-y-2">
                  {enterpriseAgents.map(agent => {
                    const status = getAgentStatus(agent.id);
                    return (
                      <div key={agent.id} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-slate-700/50 transition-colors cursor-pointer">
                        <div className="relative">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center text-white font-bold text-lg shadow-md">
                            {agent.avatar}
                          </div>
                          <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-slate-800 ${
                            status === 'online' ? 'bg-emerald-500' :
                            status === 'typing' ? 'bg-yellow-500 animate-pulse' :
                            status === 'thinking' ? 'bg-blue-500 animate-pulse' :
                            'bg-slate-400'
                          }`}></div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-semibold text-white">{agent.name}</div>
                          <div className="text-xs text-slate-400 truncate">
                            {status === 'online' ? 'Active now' :
                             status === 'typing' ? 'Typing...' :
                             status === 'thinking' ? 'Thinking...' :
                             'Offline'}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-4 pt-4 border-t border-slate-700">
                  <div className="text-xs text-slate-400 space-y-1">
                    <div className="flex items-center justify-between">
                      <span>Online</span>
                      <span className="font-semibold text-emerald-400">
                        {agentStatuses.filter(s => s.status !== 'offline').length}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Total</span>
                      <span className="font-semibold text-white">{enterpriseAgents.length}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Agent Performance Dashboard */}
              <AgentPerformance
                agents={agentMetrics}
                timeRange="24h"
              />

              {/* Pinned Messages */}
              {pinnedMessages.length > 0 && (
                <PinnedMessages
                  pinnedMessages={pinnedMessages}
                  onJumpToMessage={jumpToMessage}
                  onUnpin={(id) => setPinnedMessages(prev => prev.filter(p => p.id !== id))}
                />
              )}

              {/* Quick Actions */}
              <div className="bg-gradient-to-br from-blue-900/30 to-indigo-900/30 rounded-xl border border-blue-700/30 p-4 backdrop-blur-sm">
                <h3 className="text-sm font-bold text-white mb-3">Quick Actions</h3>
                <div className="space-y-2">
                  <button className="w-full px-3 py-2 bg-slate-800/50 border border-slate-700/50 text-slate-200 rounded-lg text-sm hover:bg-slate-700/50 hover:shadow-md transition-all text-left flex items-center space-x-2">
                    <span>📋</span>
                    <span>Create User Story</span>
                  </button>
                  <button className="w-full px-3 py-2 bg-slate-800/50 border border-slate-700/50 text-slate-200 rounded-lg text-sm hover:bg-slate-700/50 hover:shadow-md transition-all text-left flex items-center space-x-2">
                    <span>🏗️</span>
                    <span>Design Architecture</span>
                  </button>
                  <button className="w-full px-3 py-2 bg-slate-800/50 border border-slate-700/50 text-slate-200 rounded-lg text-sm hover:bg-slate-700/50 hover:shadow-md transition-all text-left flex items-center space-x-2">
                    <span>💻</span>
                    <span>Generate Code</span>
                  </button>
                  <button className="w-full px-3 py-2 bg-slate-800/50 border border-slate-700/50 text-slate-200 rounded-lg text-sm hover:bg-slate-700/50 hover:shadow-md transition-all text-left flex items-center space-x-2">
                    <span>🔒</span>
                    <span>Security Audit</span>
                  </button>
                </div>
              </div>
            </div>

            {/* CENTER - Chat Interface */}
            <div className="col-span-6 flex flex-col">
              <div className="flex-1 bg-slate-800/50 backdrop-blur-sm rounded-xl shadow-lg border border-slate-700/50 flex flex-col overflow-visible">
                {/* Chat Header */}
                <div className="px-6 py-4 border-b border-slate-700/50 bg-gradient-to-r from-slate-800/80 to-slate-700/80 backdrop-blur-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setShowConversationSidebar(true)}
                        className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors"
                        title="Show conversations"
                      >
                        <svg className="w-5 h-5 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                      </button>
                      <div>
                        <h2 className="text-lg font-bold text-white">Conversation</h2>
                        <p className="text-sm text-slate-400">{messages.length} messages</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <ExportMenu 
                        messages={messages}
                        conversationTitle={currentConversationId ? `Conversation ${currentConversationId.slice(0, 8)}` : 'AI Workspace Chat'}
                      />
                      <button
                        onClick={() => setShowShortcuts(true)}
                        className="px-3 py-1.5 hover:bg-slate-700/50 rounded-lg text-sm text-slate-300 hover:text-white transition-colors flex items-center gap-1.5"
                        title="Keyboard shortcuts (Ctrl+/)"
                      >
                        <span>⌨️</span>
                        <span className="hidden lg:inline">Shortcuts</span>
                      </button>
                      <button
                        onClick={() => setShowTemplates(true)}
                        className="px-3 py-1.5 hover:bg-slate-700/50 rounded-lg text-sm text-slate-300 hover:text-white transition-colors flex items-center gap-1.5"
                        title="Prompt templates (Ctrl+T)"
                      >
                        <span>📚</span>
                        <span className="hidden lg:inline">Templates</span>
                      </button>
                      <button 
                        onClick={handleNewConversation}
                        className="px-3 py-1.5 bg-blue-600 text-white hover:bg-blue-700 rounded-lg text-sm transition-colors flex items-center gap-1.5"
                        title="New chat (Ctrl+N)"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        New
                      </button>
                      <button 
                        onClick={() => setMessages([])}
                        className="px-3 py-1.5 text-slate-300 hover:bg-slate-700/50 rounded-lg text-sm transition-colors"
                      >
                        Clear
                      </button>
                    </div>
                  </div>
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
                  {showWelcome && messages.length === 0 && (
                    <div className="text-center py-12">
                      <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-2xl">
                        <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                        </svg>
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-2">Welcome to AI Workspace</h3>
                      <p className="text-slate-400 mb-6 max-w-md mx-auto">
                        Start a conversation with our AI agents. They'll come online automatically when you need them.
                      </p>
                      <div className="grid grid-cols-2 gap-3 max-w-lg mx-auto">
                        <button 
                          onClick={() => setInputMessage("Help me create user stories for authentication")}
                          className="p-3 bg-blue-900/30 hover:bg-blue-900/40 rounded-lg text-left transition-colors border border-blue-700/30 backdrop-blur-sm"
                        >
                          <div className="text-xs font-semibold text-blue-300 mb-1">Requirements</div>
                          <div className="text-xs text-slate-400">Create user stories</div>
                        </button>
                        <button 
                          onClick={() => setInputMessage("Design a microservices architecture")}
                          className="p-3 bg-purple-900/30 hover:bg-purple-900/40 rounded-lg text-left transition-colors border border-purple-700/30 backdrop-blur-sm"
                        >
                          <div className="text-xs font-semibold text-purple-300 mb-1">Architecture</div>
                          <div className="text-xs text-slate-400">Design system</div>
                        </button>
                        <button 
                          onClick={() => setInputMessage("Write code for REST API authentication")}
                          className="p-3 bg-green-900/30 hover:bg-green-900/40 rounded-lg text-left transition-colors border border-green-700/30 backdrop-blur-sm"
                        >
                          <div className="text-xs font-semibold text-green-300 mb-1">Development</div>
                          <div className="text-xs text-slate-400">Generate code</div>
                        </button>
                        <button 
                          onClick={() => setInputMessage("Perform security audit on the codebase")}
                          className="p-3 bg-red-50 hover:bg-red-100 rounded-lg text-left transition-colors border border-red-200"
                        >
                          <div className="text-xs font-semibold text-red-700 mb-1">Security</div>
                          <div className="text-xs text-slate-600">Security audit</div>
                        </button>
                      </div>
                    </div>
                  )}

                  {messages.map((msg, idx) => (
                    <div key={msg.id} data-message-index={idx} className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[75%] ${msg.isUser ? 'order-2' : 'order-1'}`}>
                        <div className="flex items-start space-x-2 mb-1">
                          {!msg.isUser && (
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center text-white font-bold shadow-md flex-shrink-0">
                              {enterpriseAgents.find(a => a.id === msg.agentId)?.avatar || '🤖'}
                            </div>
                          )}
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <span className="text-xs font-semibold text-white">{msg.agentName}</span>
                              <span className="text-xs text-slate-400">{new Date(msg.timestamp).toLocaleTimeString()}</span>
                            </div>
                            <div className={`px-4 py-3 rounded-2xl ${
                              msg.isUser 
                                ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white' 
                                : 'bg-slate-700/50 text-slate-100 border border-slate-600/30 backdrop-blur-sm'
                            } shadow-sm`}>
                              {msg.isUser ? (
                                <p className="text-sm leading-relaxed">{msg.content}</p>
                              ) : (
                                <MarkdownRenderer content={msg.content} />
                              )}
                            </div>
                            {msg.artifact && (
                              <button 
                                onClick={() => setSelectedArtifact(msg.artifact!)}
                                className="mt-2 px-3 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-xs hover:bg-slate-600/50 hover:shadow-md transition-all flex items-center space-x-2"
                              >
                                <span>📄</span>
                                <span className="font-semibold text-slate-200">{msg.artifact.title}</span>
                                <span className="text-slate-400">→</span>
                              </button>
                            )}
                            {/* Message Reactions - Only for agent messages */}
                            {!msg.isUser && (
                              <MessageReactions
                                messageId={msg.id}
                                reactions={messageReactions[msg.id]}
                                onReact={(emoji) => handleReact(msg.id, emoji)}
                                onCopy={() => navigator.clipboard.writeText(msg.content)}
                                onRegenerate={() => handleRegenerateMessage(msg.id)}
                                onPin={() => togglePin(msg.id)}
                                onRate={(rating) => handleRateMessage(msg.id, rating)}
                                isPinned={pinnedMessages.some(p => p.id === msg.id)}
                                rating={messageRatings[msg.id]}
                              />
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Streaming Message */}
                  {streamingMessage && (
                    <div className="flex justify-start">
                      <div className="max-w-[75%]">
                        <div className="flex items-start space-x-2 mb-1">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center text-white font-bold shadow-md flex-shrink-0">
                            {enterpriseAgents.find(a => a.id === streamingMessage.agentId)?.avatar || '🤖'}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <span className="text-xs font-semibold text-white">{streamingMessage.agentName}</span>
                              <span className="text-xs text-slate-400">Typing...</span>
                            </div>
                            <div className="px-4 py-3 rounded-2xl bg-slate-700/50 text-slate-100 border border-slate-600/30 backdrop-blur-sm shadow-sm">
                              <MarkdownRenderer content={streamingMessage.content} />
                              <div className="flex gap-1 mt-2">
                                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Scroll anchor */}
                  <div ref={messagesEndRef} />
                </div>

                {/* Smart Prompts - Shows after agent response */}
                {messages.length > 0 && messages[messages.length - 1]?.isUser === false && (
                  <div className="px-6 py-3 border-t border-slate-700/50 bg-gradient-to-r from-blue-900/20 to-purple-900/20 backdrop-blur-sm">
                    <SmartPrompts
                      lastMessage={messages[messages.length - 1]?.content}
                      context="code"
                      onSelectPrompt={(prompt) => setInputMessage(prompt)}
                    />
                  </div>
                )}

                {/* Input Area */}
                <div className="px-6 py-4 border-t border-slate-700/50 bg-slate-800/50 backdrop-blur-sm relative">
                  {/* Agent Selector & Mode Toggle - GitHub Copilot Style */}
                  <div className="mb-4 space-y-3 relative z-10">
                    <div className="flex items-center justify-between">
                      <AgentDropdown
                        selectedAgent={selectedAgent}
                        onAgentChange={(agent) => {
                          setSelectedAgent(agent);
                          setChatMode('single'); // Switch to single agent mode when selecting
                        }}
                      />
                      
                      {/* Mode Toggle */}
                      <div className="flex items-center space-x-2 bg-slate-900/50 backdrop-blur-sm border border-slate-700/30 rounded-lg p-1">
                        <button
                          onClick={() => setChatMode('single')}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                            chatMode === 'single'
                              ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-500/30'
                              : 'text-slate-300 hover:text-white hover:bg-slate-700/30'
                          }`}
                        >
                          Single Agent
                        </button>
                        <button
                          onClick={() => setChatMode('team')}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                            chatMode === 'team'
                              ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-500/30'
                              : 'text-slate-300 hover:text-white hover:bg-slate-700/30'
                          }`}
                        >
                          Team Mode
                        </button>
                      </div>
                    </div>
                    
                    {/* Mode Info */}
                    {chatMode === 'single' ? (
                      <div className="flex items-start space-x-2 px-4 py-3 bg-blue-900/30 border border-blue-700/30 rounded-lg backdrop-blur-sm">
                        <svg className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div>
                          <p className="text-sm text-blue-300 font-medium">
                            Single Agent Mode Active
                          </p>
                          <p className="text-xs text-blue-400 mt-1">
                            Chatting with <strong>{selectedAgent.name}</strong> ({selectedAgent.role}) using <span className="font-mono bg-blue-900/50 px-1.5 py-0.5 rounded">{selectedAgent.modelName}</span>
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-start space-x-2 px-4 py-3 bg-purple-900/30 border border-purple-700/30 rounded-lg backdrop-blur-sm">
                        <svg className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <div>
                          <p className="text-sm text-purple-300 font-medium">
                            Team Collaboration Mode Active
                          </p>
                          <p className="text-xs text-purple-400 mt-1">
                            All 7 agents will collaborate with multi-round A2A discussions
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Multi-File Upload Context */}
                  {uploadedFiles.length > 0 && (
                    <div className="mb-3">
                      <MultiFileUpload
                        files={uploadedFiles}
                        onFilesChange={setUploadedFiles}
                      />
                    </div>
                  )}
                  
                  <div className="flex items-end space-x-3">
                    {/* Upload Button */}
                    <button
                      onClick={() => setShowUploadModal(true)}
                      className="px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl hover:bg-slate-600/50 transition-colors flex items-center space-x-2"
                      title="Upload documents"
                    >
                      <span className="text-xl">📎</span>
                      <span className="text-sm font-medium text-slate-200">Upload</span>
                    </button>
                    
                    <textarea
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                      placeholder="Type your message... (Press Enter to send)"
                      className="flex-1 px-4 py-3 bg-slate-700/50 border border-slate-600/50 text-slate-100 placeholder-slate-400 rounded-xl resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm backdrop-blur-sm"
                      rows={3}
                    />
                    <button
                      onClick={handleSendMessage}
                      disabled={!inputMessage.trim()}
                      className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                    >
                      <span>Send</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT SIDEBAR - Artifacts Preview */}
            <div className="col-span-3 space-y-4">
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl shadow-lg border border-slate-700/50 p-4 h-full">
                <h2 className="text-sm font-bold text-white mb-3 flex items-center">
                  <svg className="w-4 h-4 mr-2 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Generated Artifacts
                </h2>

                {selectedArtifact ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-semibold text-white">{selectedArtifact.title}</div>
                      <button 
                        onClick={() => setSelectedArtifact(null)}
                        className="p-1 hover:bg-slate-700/50 rounded transition-colors"
                      >
                        <svg className="w-4 h-4 text-slate-400 hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    <div className="bg-slate-900 rounded-lg p-4 overflow-x-auto">
                      <pre className="text-xs text-emerald-400 font-mono">{selectedArtifact.content}</pre>
                    </div>
                    <div className="flex space-x-2">
                      <button className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700 transition-colors">
                        Copy Code
                      </button>
                      <button className="flex-1 px-3 py-2 bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold hover:bg-slate-600 transition-colors border border-slate-600">
                        Download
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 text-slate-400">
                    <svg className="w-12 h-12 mx-auto mb-3 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                    <p className="text-xs">No artifact selected</p>
                    <p className="text-xs mt-1">Generated artifacts will appear here</p>
                  </div>
                )}

                <div className="mt-6 pt-4 border-t border-slate-700/50">
                  <div className="text-xs font-semibold text-white mb-2">Recent Artifacts</div>
                  <div className="space-y-2">
                    {messages.filter(m => m.artifact).map((msg, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedArtifact(msg.artifact!)}
                        className="w-full p-2 bg-slate-700/30 hover:bg-slate-700/50 rounded-lg text-left transition-colors border border-slate-600/30"
                      >
                        <div className="text-xs font-semibold text-white truncate">{msg.artifact?.title}</div>
                        <div className="text-xs text-slate-400">{msg.agentName}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            </div> {/* Close Main Grid grid-cols-12 */}
          </div> {/* Close Flex Container */}
        </div> {/* Close Max-Width Container */}

        {/* Document Upload Modal */}
        {showUploadModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6">
            <div className="bg-slate-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden border border-slate-700">
              <div className="flex items-center justify-between p-6 border-b border-slate-700/50">
                <h2 className="text-2xl font-bold text-white">Upload Documents</h2>
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors"
                >
                  <svg className="w-6 h-6 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
                {/* GitHub Integration Section */}
                <div className="mb-6">
                  <GitHubAuth
                    isConnected={isGitHubConnected}
                    onTokenSet={(token) => {
                      setGithubToken(token);
                      setIsGitHubConnected(true);
                    }}
                    onDisconnect={() => {
                      setGithubToken('');
                      setIsGitHubConnected(false);
                    }}
                  />
                  
                  {isGitHubConnected && (
                    <button
                      onClick={() => setShowGitHubBrowser(true)}
                      className="mt-3 w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all flex items-center justify-center gap-2 font-medium shadow-lg"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                      </svg>
                      Browse GitHub Repositories
                    </button>
                  )}
                </div>

                {/* Divider */}
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-700"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-slate-800 text-slate-400">Or upload from device</span>
                  </div>
                </div>

                {/* Local File Upload */}
                <DocumentUpload
                  onFilesUploaded={(files) => {
                    setUploadedFiles(prev => [...prev, ...files]);
                    if (files.length > 0) {
                      setShowUploadModal(false);
                      // Auto-populate message
                      setInputMessage(`I've uploaded ${files.length} document(s): ${files.map(f => f.name).join(', ')}. Please analyze and provide insights based on your role.`);
                    }
                  }}
                  maxFiles={5}
                  maxFileSize={2 * 1024 * 1024}
                />
              </div>
              
              <div className="p-6 border-t border-slate-700 bg-slate-800/50 flex justify-end space-x-3">
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="px-6 py-2 bg-slate-700 text-slate-200 rounded-lg hover:bg-slate-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setShowUploadModal(false);
                    if (uploadedFiles.length > 0) {
                      setInputMessage(`I've uploaded ${uploadedFiles.length} document(s). Please analyze and provide insights.`);
                    }
                  }}
                  disabled={uploadedFiles.length === 0}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        )}

        {/* GitHub Repository Browser Modal */}
        {showGitHubBrowser && githubToken && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6">
            <div className="bg-slate-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden border border-slate-700">
              <GitHubRepoBrowser
                token={githubToken}
                onFilesSelected={(files) => {
                  setUploadedFiles(prev => [...prev, ...files]);
                  setShowGitHubBrowser(false);
                  setShowUploadModal(false);
                  if (files.length > 0) {
                    setInputMessage(`I've uploaded ${files.length} file(s) from GitHub: ${files.map(f => f.name).join(', ')}. Please analyze and provide insights based on your role.`);
                  }
                }}
                onClose={() => setShowGitHubBrowser(false)}
              />
            </div>
          </div>
        )}

        {/* Keyboard Shortcuts Modal */}
        <KeyboardShortcutsPanel
          shortcuts={shortcuts}
          onClose={() => setShowShortcuts(false)}
          isOpen={showShortcuts}
        />

        {/* Template Library Modal */}
        <TemplateLibrary
          onSelectTemplate={handleSelectTemplate}
          onClose={() => setShowTemplates(false)}
          isOpen={showTemplates}
        />

        {/* Agent Orchestrator - Shows multi-agent workflow */}
        <AgentOrchestrator
          agents={enterpriseAgents.map(a => ({
            id: a.id,
            name: a.name,
            avatar: a.avatar,
            role: a.role
          }))}
          onWorkflowComplete={(tasks) => {
            console.log('Workflow completed:', tasks);
          }}
        />
      </div> {/* Close min-h-screen Div */}
    </>
  );
}
