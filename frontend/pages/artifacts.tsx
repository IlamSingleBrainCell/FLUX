// pages/artifacts.tsx - Artifacts Management Page
import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { CodeEditor } from '../components/Artifacts/CodeEditor';
import { ArtifactList } from '../components/Artifacts/ArtifactList';
import { DebugConsole } from '../components/Artifacts/DebugConsole';
import { GitHubPush } from '../components/Artifacts/GitHubPush';

export interface Artifact {
  id: string;
  title: string;
  type: 'code' | 'document' | 'diagram' | 'data';
  language?: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  tags?: string[];
  agentCreator?: string;
  description?: string;
}

export default function ArtifactsPage() {
  const [artifacts, setArtifacts] = useState<Artifact[]>([]);
  const [selectedArtifact, setSelectedArtifact] = useState<Artifact | null>(null);
  const [showEditor, setShowEditor] = useState(false);
  const [showDebugConsole, setShowDebugConsole] = useState(false);
  const [showGitHubPush, setShowGitHubPush] = useState(false);
  const [filter, setFilter] = useState<'all' | 'code' | 'document' | 'diagram' | 'data'>('all');

  // Load artifacts from localStorage
  useEffect(() => {
    const savedArtifacts = localStorage.getItem('artifacts');
    if (savedArtifacts) {
      setArtifacts(JSON.parse(savedArtifacts));
    }
  }, []);

  // Save artifacts to localStorage
  useEffect(() => {
    if (artifacts.length > 0) {
      localStorage.setItem('artifacts', JSON.stringify(artifacts));
    }
  }, [artifacts]);

  const handleCreateArtifact = () => {
    const newArtifact: Artifact = {
      id: `artifact-${Date.now()}`,
      title: 'New Artifact',
      type: 'code',
      language: 'javascript',
      content: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tags: []
    };
    setArtifacts(prev => [newArtifact, ...prev]);
    setSelectedArtifact(newArtifact);
    setShowEditor(true);
  };

  const handleUpdateArtifact = (updated: Artifact) => {
    setArtifacts(prev => prev.map(a => a.id === updated.id ? { ...updated, updatedAt: new Date().toISOString() } : a));
    setSelectedArtifact(updated);
  };

  const handleDeleteArtifact = (id: string) => {
    setArtifacts(prev => prev.filter(a => a.id !== id));
    if (selectedArtifact?.id === id) {
      setSelectedArtifact(null);
      setShowEditor(false);
    }
  };

  const filteredArtifacts = artifacts.filter(a => filter === 'all' || a.type === filter);

  return (
    <>
      <Head>
        <title>Artifacts - AI Collaboration Workspace</title>
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Link href="/workspace" className="text-gray-600 hover:text-gray-900">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </Link>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Artifacts</h1>
                  <p className="text-sm text-gray-600">Manage your generated files and documents</p>
                </div>
              </div>

              <button
                onClick={handleCreateArtifact}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                New Artifact
              </button>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="grid grid-cols-12 gap-6">
            {/* Sidebar - Artifact List */}
            <div className="col-span-3">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                {/* Filter Tabs */}
                <div className="border-b border-gray-200 p-3">
                  <div className="flex flex-wrap gap-2">
                    {['all', 'code', 'document', 'data'].map(f => (
                      <button
                        key={f}
                        onClick={() => setFilter(f as any)}
                        className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                          filter === f
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {f.charAt(0).toUpperCase() + f.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                <ArtifactList
                  artifacts={filteredArtifacts}
                  selectedId={selectedArtifact?.id}
                  onSelect={(artifact) => {
                    setSelectedArtifact(artifact);
                    setShowEditor(true);
                  }}
                  onDelete={handleDeleteArtifact}
                />
              </div>
            </div>

            {/* Main Content */}
            <div className="col-span-9">
              {!selectedArtifact ? (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                  <svg className="w-24 h-24 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No Artifact Selected</h3>
                  <p className="text-gray-600 mb-6">Select an artifact from the list or create a new one</p>
                  <button
                    onClick={handleCreateArtifact}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Create Your First Artifact
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Artifact Header */}
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <input
                          type="text"
                          value={selectedArtifact.title}
                          onChange={(e) => handleUpdateArtifact({ ...selectedArtifact, title: e.target.value })}
                          className="text-2xl font-bold text-gray-900 bg-transparent border-none focus:outline-none focus:ring-0 w-full"
                          placeholder="Artifact Title"
                        />
                        <div className="flex items-center gap-3 mt-2">
                          <select
                            value={selectedArtifact.type}
                            onChange={(e) => handleUpdateArtifact({ ...selectedArtifact, type: e.target.value as any })}
                            className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="code">Code</option>
                            <option value="document">Document</option>
                            <option value="data">Data</option>
                          </select>
                          {selectedArtifact.type === 'code' && (
                            <select
                              value={selectedArtifact.language}
                              onChange={(e) => handleUpdateArtifact({ ...selectedArtifact, language: e.target.value })}
                              className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                            >
                              <option value="javascript">JavaScript</option>
                              <option value="typescript">TypeScript</option>
                              <option value="python">Python</option>
                              <option value="java">Java</option>
                              <option value="csharp">C#</option>
                              <option value="html">HTML</option>
                              <option value="css">CSS</option>
                              <option value="json">JSON</option>
                              <option value="markdown">Markdown</option>
                              <option value="sql">SQL</option>
                            </select>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setShowDebugConsole(!showDebugConsole)}
                          className={`px-4 py-2 rounded-lg transition-colors ${
                            showDebugConsole
                              ? 'bg-green-600 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          🐛 Debug
                        </button>
                        <button
                          onClick={() => setShowGitHubPush(true)}
                          className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2"
                        >
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                          </svg>
                          Push to GitHub
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Code Editor */}
                  <CodeEditor
                    artifact={selectedArtifact}
                    onUpdate={handleUpdateArtifact}
                  />

                  {/* Debug Console (Collapsible) */}
                  {showDebugConsole && (
                    <DebugConsole
                      artifact={selectedArtifact}
                      onClose={() => setShowDebugConsole(false)}
                    />
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* GitHub Push Modal */}
        {showGitHubPush && selectedArtifact && (
          <GitHubPush
            artifact={selectedArtifact}
            onClose={() => setShowGitHubPush(false)}
            onSuccess={() => {
              setShowGitHubPush(false);
              // Show success notification
            }}
          />
        )}
      </div>
    </>
  );
}
