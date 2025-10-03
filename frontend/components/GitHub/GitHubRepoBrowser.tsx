// components/GitHub/GitHubRepoBrowser.tsx
import React, { useState, useEffect } from 'react';
import { UploadedFile } from '../../types/agents';

interface Repository {
  id: number;
  name: string;
  full_name: string;
  private: boolean;
  default_branch: string;
  description: string;
  updated_at: string;
}

interface FileTreeItem {
  name: string;
  path: string;
  type: 'file' | 'dir';
  size?: number;
  sha: string;
}

interface GitHubRepoBrowserProps {
  token: string;
  onFilesSelected: (files: UploadedFile[]) => void;
  onClose: () => void;
}

export const GitHubRepoBrowser: React.FC<GitHubRepoBrowserProps> = ({
  token,
  onFilesSelected,
  onClose
}) => {
  const [repos, setRepos] = useState<Repository[]>([]);
  const [selectedRepo, setSelectedRepo] = useState<Repository | null>(null);
  const [currentPath, setCurrentPath] = useState('');
  const [fileTree, setFileTree] = useState<FileTreeItem[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [pathHistory, setPathHistory] = useState<string[]>([]);

  useEffect(() => {
    loadRepositories();
  }, []);

  useEffect(() => {
    if (selectedRepo) {
      loadFileTree(currentPath);
    }
  }, [selectedRepo, currentPath]);

  const loadRepositories = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('https://api.github.com/user/repos?per_page=100&sort=updated', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      });

      if (!response.ok) throw new Error('Failed to load repositories');

      const data = await response.json();
      setRepos(data);
    } catch (err) {
      setError('Failed to load repositories. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const loadFileTree = async (path: string = '') => {
    if (!selectedRepo) return;
    
    setLoading(true);
    setError('');

    try {
      const url = `https://api.github.com/repos/${selectedRepo.full_name}/contents/${path}`;
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      });

      if (!response.ok) throw new Error('Failed to load files');

      const data = await response.json();
      setFileTree(Array.isArray(data) ? data : []);
    } catch (err) {
      setError('Failed to load file tree.');
    } finally {
      setLoading(false);
    }
  };

  const downloadFile = async (item: FileTreeItem): Promise<UploadedFile | null> => {
    try {
      const response = await fetch(`https://api.github.com/repos/${selectedRepo!.full_name}/contents/${item.path}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      });

      if (!response.ok) throw new Error('Failed to download file');

      const data = await response.json();
      
      // Decode base64 content
      const content = atob(data.content.replace(/\n/g, ''));
      
      // Determine file type
      const extension = item.name.split('.').pop()?.toLowerCase() || '';
      const typeMap: { [key: string]: string } = {
        'js': 'text/javascript',
        'ts': 'text/typescript',
        'jsx': 'text/javascript',
        'tsx': 'text/typescript',
        'py': 'text/x-python',
        'java': 'text/x-java',
        'json': 'application/json',
        'md': 'text/markdown',
        'txt': 'text/plain',
        'html': 'text/html',
        'css': 'text/css',
        'yml': 'text/yaml',
        'yaml': 'text/yaml',
        'xml': 'text/xml',
        'sh': 'text/x-sh',
        'sql': 'text/x-sql'
      };

      return {
        id: `github-${item.sha}`,
        name: item.name,
        type: typeMap[extension] || 'text/plain',
        size: item.size || content.length,
        content: content,
        uploadedAt: new Date().toISOString(),
        source: 'github',
        repo: selectedRepo!.full_name,
        path: item.path
      };
    } catch (err) {
      console.error('Failed to download file:', err);
      return null;
    }
  };

  const handleFileToggle = (path: string) => {
    const newSelected = new Set(selectedFiles);
    if (newSelected.has(path)) {
      newSelected.delete(path);
    } else {
      newSelected.add(path);
    }
    setSelectedFiles(newSelected);
  };

  const handleDirectoryClick = (item: FileTreeItem) => {
    if (item.type === 'dir') {
      setPathHistory(prev => [...prev, currentPath]);
      setCurrentPath(item.path);
      setSelectedFiles(new Set()); // Clear selections when navigating
    }
  };

  const handleUploadSelected = async () => {
    setLoading(true);
    const filesToUpload: UploadedFile[] = [];

    for (const path of Array.from(selectedFiles)) {
      const item = fileTree.find(f => f.path === path);
      if (item && item.type === 'file') {
        const file = await downloadFile(item);
        if (file) filesToUpload.push(file);
      }
    }

    onFilesSelected(filesToUpload);
    setLoading(false);
    onClose();
  };

  const navigateUp = () => {
    if (pathHistory.length > 0) {
      const previousPath = pathHistory[pathHistory.length - 1];
      setPathHistory(prev => prev.slice(0, -1));
      setCurrentPath(previousPath);
    } else {
      setCurrentPath('');
    }
  };

  const filteredRepos = repos.filter(repo => 
    repo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    repo.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getFileIcon = (item: FileTreeItem) => {
    if (item.type === 'dir') return '📁';
    
    const ext = item.name.split('.').pop()?.toLowerCase();
    const iconMap: { [key: string]: string } = {
      'js': '📜', 'ts': '📘', 'jsx': '⚛️', 'tsx': '⚛️',
      'py': '🐍', 'java': '☕', 'json': '🔧', 'md': '📝',
      'html': '🌐', 'css': '🎨', 'yml': '⚙️', 'yaml': '⚙️',
      'xml': '📋', 'sql': '🗄️', 'sh': '🔨', 'bat': '🔨',
      'go': '🐹', 'rs': '🦀', 'c': '©️', 'cpp': '©️', 'h': '📑',
      'rb': '💎', 'php': '🐘', 'swift': '🦅', 'kt': '🟣',
      'vue': '💚', 'svelte': '🧡', 'scss': '🎨', 'sass': '🎨',
      'less': '🎨', 'dockerfile': '🐳', 'lock': '🔒',
      'txt': '📄', 'pdf': '📕', 'zip': '🗜️', 'tar': '🗜️',
      'gz': '🗜️', 'png': '🖼️', 'jpg': '🖼️', 'jpeg': '🖼️',
      'gif': '🎞️', 'svg': '🎨', 'env': '🔐', 'example': '📝'
    };
    
    // Check for special filenames
    const lowerName = item.name.toLowerCase();
    if (lowerName === 'dockerfile') return '🐳';
    if (lowerName === 'makefile') return '🔨';
    if (lowerName.includes('readme')) return '📖';
    if (lowerName.includes('license')) return '📜';
    if (lowerName.includes('package.json')) return '📦';
    if (lowerName.includes('tsconfig')) return '⚙️';
    if (lowerName.includes('.gitignore')) return '🙈';
    if (lowerName.includes('.env')) return '🔐';
    
    return iconMap[ext || ''] || '📄';
  };

  if (!selectedRepo) {
    return (
      <div className="flex flex-col h-full">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-gray-900">Select Repository</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <input
            type="text"
            placeholder="Search repositories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          />
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : error ? (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
              {error}
            </div>
          ) : (
            <div className="space-y-2">
              {filteredRepos.map(repo => (
                <button
                  key={repo.id}
                  onClick={() => setSelectedRepo(repo)}
                  className="w-full p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-blue-300 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900 truncate">{repo.name}</span>
                        {repo.private && (
                          <span className="px-2 py-0.5 text-xs bg-yellow-100 text-yellow-800 rounded">Private</span>
                        )}
                      </div>
                      {repo.description && (
                        <p className="text-xs text-gray-600 mt-1 line-clamp-2">{repo.description}</p>
                      )}
                    </div>
                    <svg className="w-5 h-5 text-gray-400 flex-shrink-0 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setSelectedRepo(null);
                setCurrentPath('');
                setSelectedFiles(new Set());
              }}
              className="text-gray-600 hover:text-gray-900"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div>
              <h2 className="text-sm font-semibold text-gray-900">{selectedRepo.name}</h2>
              <p className="text-xs text-gray-600">/{currentPath || 'root'}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {currentPath && (
          <button
            onClick={navigateUp}
            className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Go up
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {loading ? (
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : error ? (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
            {error}
          </div>
        ) : fileTree.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <svg className="w-16 h-16 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
            </svg>
            <p className="text-sm">This folder is empty</p>
          </div>
        ) : (
          <div className="space-y-1">
            {/* Sort: directories first, then files */}
            {fileTree
              .sort((a, b) => {
                if (a.type === b.type) return a.name.localeCompare(b.name);
                return a.type === 'dir' ? -1 : 1;
              })
              .map(item => (
                <div
                  key={item.path}
                  className="flex items-center gap-2 p-2 rounded hover:bg-gray-50 group"
                >
                  {item.type === 'file' && (
                    <input
                      type="checkbox"
                      checked={selectedFiles.has(item.path)}
                      onChange={() => handleFileToggle(item.path)}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                    />
                  )}
                  {item.type === 'dir' && (
                    <div className="w-4 h-4"></div>
                  )}
                  <button
                    onClick={() => handleDirectoryClick(item)}
                    className={`flex items-center gap-2 flex-1 text-left ${
                      item.type === 'dir' ? 'cursor-pointer' : 'cursor-default'
                    }`}
                    disabled={item.type === 'file'}
                  >
                    <span className="text-xl">{getFileIcon(item)}</span>
                    <span className={`text-sm flex-1 ${
                      item.type === 'dir' 
                        ? 'text-blue-600 font-medium group-hover:text-blue-700' 
                        : 'text-gray-900'
                    }`}>
                      {item.name}
                    </span>
                    {item.type === 'dir' && (
                      <svg className="w-4 h-4 text-gray-400 group-hover:text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    )}
                    {item.size && item.type === 'file' && (
                      <span className="text-xs text-gray-500 ml-auto">
                        {(item.size / 1024).toFixed(1)} KB
                      </span>
                    )}
                  </button>
                </div>
              ))}
          </div>
        )}
      </div>

      {selectedFiles.size > 0 && (
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">
              {selectedFiles.size} file{selectedFiles.size !== 1 ? 's' : ''} selected
            </span>
            <button
              onClick={handleUploadSelected}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
            >
              {loading ? 'Loading...' : 'Upload Selected'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
