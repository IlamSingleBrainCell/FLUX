// pages/workspace.tsx - AI Agent Collaboration Workspace (REDESIGNED)
import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { AgentInfo, UploadedFile } from '../types/agents';
import { enterpriseAgents } from '../config/agents';
import { DocumentUpload } from '../components/DocumentUpload/DocumentUpload';

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

    // Detect which agent to call (simple keyword detection)
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

    const targetAgentId = detectAgent(inputMessage);
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

    const messageToSend = inputMessage;
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
          uploaded_files: uploadedFiles // Include uploaded files
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

  const getAgentStatus = (agentId: string) => {
    return agentStatuses.find(s => s.id === agentId)?.status || 'offline';
  };

  return (
    <>
      <Head>
        <title>AI Workspace - FLUX Enterprise</title>
        <meta name="description" content="Collaborate with AI agents on your SDLC tasks" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-xl border-b border-slate-200 sticky top-0 z-50 shadow-sm">
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
                  <h1 className="text-lg font-bold text-slate-900">AI Collaboration Workspace</h1>
                  <p className="text-xs text-slate-500">Real-time SDLC Agent Assistance</p>
                </div>
              </div>

              <nav className="flex space-x-2">
                <Link href="/dashboard" className="px-3 py-1.5 text-slate-600 rounded-lg text-sm hover:bg-slate-100 transition-colors">
                  Dashboard
                </Link>
                <Link href="/projects" className="px-3 py-1.5 text-slate-600 rounded-lg text-sm hover:bg-slate-100 transition-colors">
                  Projects
                </Link>
                <Link href="/workspace" className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm shadow-sm">
                  Workspace
                </Link>
              </nav>
            </div>
          </div>
        </div>

        {/* Main Workspace - 3 Column Layout */}
        <div className="max-w-[1800px] mx-auto px-6 py-6">
          <div className="grid grid-cols-12 gap-6 h-[calc(100vh-140px)]">
            
            {/* LEFT SIDEBAR - Team Members */}
            <div className="col-span-3 space-y-4">
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
                <h2 className="text-sm font-bold text-slate-900 mb-3 flex items-center">
                  <svg className="w-4 h-4 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  Team Members
                </h2>

                <div className="space-y-2">
                  {enterpriseAgents.map(agent => {
                    const status = getAgentStatus(agent.id);
                    return (
                      <div key={agent.id} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer">
                        <div className="relative">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center text-white font-bold text-lg shadow-md">
                            {agent.avatar}
                          </div>
                          <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                            status === 'online' ? 'bg-emerald-500' :
                            status === 'typing' ? 'bg-yellow-500 animate-pulse' :
                            status === 'thinking' ? 'bg-blue-500 animate-pulse' :
                            'bg-slate-400'
                          }`}></div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-semibold text-slate-900">{agent.name}</div>
                          <div className="text-xs text-slate-500 truncate">
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

                <div className="mt-4 pt-4 border-t border-slate-200">
                  <div className="text-xs text-slate-500 space-y-1">
                    <div className="flex items-center justify-between">
                      <span>Online</span>
                      <span className="font-semibold text-emerald-600">
                        {agentStatuses.filter(s => s.status !== 'offline').length}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Total</span>
                      <span className="font-semibold text-slate-900">{enterpriseAgents.length}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200 p-4">
                <h3 className="text-sm font-bold text-slate-900 mb-3">Quick Actions</h3>
                <div className="space-y-2">
                  <button className="w-full px-3 py-2 bg-white text-slate-700 rounded-lg text-sm hover:shadow-md transition-all text-left flex items-center space-x-2">
                    <span>📋</span>
                    <span>Create User Story</span>
                  </button>
                  <button className="w-full px-3 py-2 bg-white text-slate-700 rounded-lg text-sm hover:shadow-md transition-all text-left flex items-center space-x-2">
                    <span>🏗️</span>
                    <span>Design Architecture</span>
                  </button>
                  <button className="w-full px-3 py-2 bg-white text-slate-700 rounded-lg text-sm hover:shadow-md transition-all text-left flex items-center space-x-2">
                    <span>💻</span>
                    <span>Generate Code</span>
                  </button>
                  <button className="w-full px-3 py-2 bg-white text-slate-700 rounded-lg text-sm hover:shadow-md transition-all text-left flex items-center space-x-2">
                    <span>🔒</span>
                    <span>Security Audit</span>
                  </button>
                </div>
              </div>
            </div>

            {/* CENTER - Chat Interface */}
            <div className="col-span-6 flex flex-col">
              <div className="flex-1 bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col overflow-hidden">
                {/* Chat Header */}
                <div className="px-6 py-4 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-lg font-bold text-slate-900">Conversation</h2>
                      <p className="text-sm text-slate-500">{messages.length} messages</p>
                    </div>
                    <button 
                      onClick={() => setMessages([])}
                      className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded-lg text-sm transition-colors"
                    >
                      Clear Chat
                    </button>
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
                      <h3 className="text-2xl font-bold text-slate-900 mb-2">Welcome to AI Workspace</h3>
                      <p className="text-slate-600 mb-6 max-w-md mx-auto">
                        Start a conversation with our AI agents. They'll come online automatically when you need them.
                      </p>
                      <div className="grid grid-cols-2 gap-3 max-w-lg mx-auto">
                        <button 
                          onClick={() => setInputMessage("Help me create user stories for authentication")}
                          className="p-3 bg-blue-50 hover:bg-blue-100 rounded-lg text-left transition-colors border border-blue-200"
                        >
                          <div className="text-xs font-semibold text-blue-700 mb-1">Requirements</div>
                          <div className="text-xs text-slate-600">Create user stories</div>
                        </button>
                        <button 
                          onClick={() => setInputMessage("Design a microservices architecture")}
                          className="p-3 bg-purple-50 hover:bg-purple-100 rounded-lg text-left transition-colors border border-purple-200"
                        >
                          <div className="text-xs font-semibold text-purple-700 mb-1">Architecture</div>
                          <div className="text-xs text-slate-600">Design system</div>
                        </button>
                        <button 
                          onClick={() => setInputMessage("Write code for REST API authentication")}
                          className="p-3 bg-green-50 hover:bg-green-100 rounded-lg text-left transition-colors border border-green-200"
                        >
                          <div className="text-xs font-semibold text-green-700 mb-1">Development</div>
                          <div className="text-xs text-slate-600">Generate code</div>
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

                  {messages.map(msg => (
                    <div key={msg.id} className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[75%] ${msg.isUser ? 'order-2' : 'order-1'}`}>
                        <div className="flex items-start space-x-2 mb-1">
                          {!msg.isUser && (
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center text-white font-bold shadow-md flex-shrink-0">
                              {enterpriseAgents.find(a => a.id === msg.agentId)?.avatar || '🤖'}
                            </div>
                          )}
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <span className="text-xs font-semibold text-slate-900">{msg.agentName}</span>
                              <span className="text-xs text-slate-400">{new Date(msg.timestamp).toLocaleTimeString()}</span>
                            </div>
                            <div className={`px-4 py-3 rounded-2xl ${
                              msg.isUser 
                                ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white' 
                                : 'bg-slate-100 text-slate-900'
                            } shadow-sm`}>
                              <p className="text-sm leading-relaxed">{msg.content}</p>
                            </div>
                            {msg.artifact && (
                              <button 
                                onClick={() => setSelectedArtifact(msg.artifact!)}
                                className="mt-2 px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs hover:shadow-md transition-all flex items-center space-x-2"
                              >
                                <span>📄</span>
                                <span className="font-semibold text-slate-700">{msg.artifact.title}</span>
                                <span className="text-slate-400">→</span>
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Input Area */}
                <div className="px-6 py-4 border-t border-slate-200 bg-slate-50">
                  {/* Uploaded Files Preview */}
                  {uploadedFiles.length > 0 && (
                    <div className="mb-3 flex flex-wrap gap-2">
                      {uploadedFiles.map((file) => (
                        <div
                          key={file.id}
                          className="inline-flex items-center space-x-2 px-3 py-2 bg-blue-50 border border-blue-200 rounded-lg text-sm"
                        >
                          <span className="text-blue-600">📎</span>
                          <span className="text-blue-900 font-medium truncate max-w-[200px]">{file.name}</span>
                          <button
                            onClick={() => setUploadedFiles(prev => prev.filter(f => f.id !== file.id))}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <div className="flex items-end space-x-3">
                    {/* Upload Button */}
                    <button
                      onClick={() => setShowUploadModal(true)}
                      className="px-4 py-3 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors flex items-center space-x-2"
                      title="Upload documents"
                    >
                      <span className="text-xl">📎</span>
                      <span className="text-sm font-medium text-slate-700">Upload</span>
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
                      className="flex-1 px-4 py-3 border border-slate-300 rounded-xl resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
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
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 h-full">
                <h2 className="text-sm font-bold text-slate-900 mb-3 flex items-center">
                  <svg className="w-4 h-4 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Generated Artifacts
                </h2>

                {selectedArtifact ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-semibold text-slate-900">{selectedArtifact.title}</div>
                      <button 
                        onClick={() => setSelectedArtifact(null)}
                        className="p-1 hover:bg-slate-100 rounded"
                      >
                        <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                      <button className="flex-1 px-3 py-2 bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold hover:bg-slate-300 transition-colors">
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

                <div className="mt-6 pt-4 border-t border-slate-200">
                  <div className="text-xs font-semibold text-slate-700 mb-2">Recent Artifacts</div>
                  <div className="space-y-2">
                    {messages.filter(m => m.artifact).map((msg, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedArtifact(msg.artifact!)}
                        className="w-full p-2 bg-slate-50 hover:bg-slate-100 rounded-lg text-left transition-colors border border-slate-200"
                      >
                        <div className="text-xs font-semibold text-slate-900 truncate">{msg.artifact?.title}</div>
                        <div className="text-xs text-slate-500">{msg.agentName}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Document Upload Modal */}
        {showUploadModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6">
            <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900">Upload Project Documents</h2>
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
                <DocumentUpload
                  onFilesUploaded={(files) => {
                    setUploadedFiles(files);
                    if (files.length > 0) {
                      setShowUploadModal(false);
                      // Auto-populate message
                      setInputMessage(`I've uploaded ${files.length} document(s): ${files.map(f => f.name).join(', ')}. Please analyze and provide insights based on your role.`);
                    }
                  }}
                  maxFiles={10}
                  maxFileSize={30 * 1024 * 1024}
                />
              </div>
              
              <div className="p-6 border-t border-gray-200 bg-gray-50 flex justify-end space-x-3">
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
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
      </div>
    </>
  );
}
