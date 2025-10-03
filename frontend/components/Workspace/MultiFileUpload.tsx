// components/Workspace/MultiFileUpload.tsx - Multi-File Code Context
import React, { useState } from 'react';
import { UploadedFile } from '../../types/agents';

interface FileNode {
  name: string;
  type: 'file' | 'folder';
  path: string;
  size?: number;
  children?: FileNode[];
  content?: string;
}

interface MultiFileUploadProps {
  files: UploadedFile[];
  onFilesChange: (files: UploadedFile[]) => void;
  className?: string;
}

export const MultiFileUpload: React.FC<MultiFileUploadProps> = ({
  files,
  onFilesChange,
  className = ''
}) => {
  const [fileTree, setFileTree] = useState<FileNode[]>([]);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());
  const [dragOver, setDragOver] = useState(false);

  const buildFileTree = (uploadedFiles: UploadedFile[]): FileNode[] => {
    const tree: FileNode[] = [];
    
    uploadedFiles.forEach(file => {
      const parts = file.name.split('/');
      let currentLevel = tree;
      
      parts.forEach((part, idx) => {
        const isFile = idx === parts.length - 1;
        const path = parts.slice(0, idx + 1).join('/');
        
        let existing = currentLevel.find(node => node.name === part);
        
        if (!existing) {
          existing = {
            name: part,
            type: isFile ? 'file' : 'folder',
            path: path,
            size: isFile ? file.size : undefined,
            content: isFile ? file.content : undefined,
            children: isFile ? undefined : []
          };
          currentLevel.push(existing);
        }
        
        if (!isFile && existing.children) {
          currentLevel = existing.children;
        }
      });
    });
    
    return tree;
  };

  React.useEffect(() => {
    setFileTree(buildFileTree(files));
  }, [files]);

  const handleFileUpload = async (uploadedFiles: FileList) => {
    const newFiles: UploadedFile[] = [];
    
    for (let i = 0; i < uploadedFiles.length; i++) {
      const file = uploadedFiles[i];
      const content = await file.text();
      
      newFiles.push({
        id: `file-${Date.now()}-${i}`,
        name: file.name,
        type: file.type || 'text/plain',
        size: file.size,
        content: content,
        uploadedAt: new Date().toISOString()
      });
    }
    
    onFilesChange([...files, ...newFiles]);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    if (e.dataTransfer.files) {
      handleFileUpload(e.dataTransfer.files);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const removeFile = (fileName: string) => {
    onFilesChange(files.filter(f => f.name !== fileName));
  };

  const toggleFolder = (path: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(path)) {
      newExpanded.delete(path);
    } else {
      newExpanded.add(path);
    }
    setExpandedFolders(newExpanded);
  };

  const getFileIcon = (fileName: string) => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    const iconMap: { [key: string]: string } = {
      'js': '📄', 'jsx': '⚛️', 'ts': '📘', 'tsx': '⚛️',
      'py': '🐍', 'java': '☕', 'go': '🔷',
      'html': '🌐', 'css': '🎨', 'json': '📋',
      'md': '📝', 'txt': '📄', 'xml': '📰',
      'sql': '🗄️', 'yaml': '⚙️', 'yml': '⚙️'
    };
    return iconMap[ext || ''] || '📄';
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1048576).toFixed(1) + ' MB';
  };

  const renderFileTree = (nodes: FileNode[], level: number = 0) => {
    return nodes.map(node => (
      <div key={node.path} style={{ marginLeft: `${level * 16}px` }}>
        {node.type === 'folder' ? (
          <>
            <div
              onClick={() => toggleFolder(node.path)}
              className="flex items-center gap-2 px-2 py-1.5 hover:bg-slate-100 rounded cursor-pointer group"
            >
              <svg
                className={`w-4 h-4 text-slate-400 transition-transform ${expandedFolders.has(node.path) ? 'rotate-90' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              <span className="text-sm">📁 {node.name}</span>
              <span className="ml-auto text-xs text-slate-400 opacity-0 group-hover:opacity-100">
                {node.children?.length || 0} items
              </span>
            </div>
            {expandedFolders.has(node.path) && node.children && (
              <div>{renderFileTree(node.children, level + 1)}</div>
            )}
          </>
        ) : (
          <div className="flex items-center gap-2 px-2 py-1.5 hover:bg-slate-50 rounded group">
            <span className="text-sm">{getFileIcon(node.name)}</span>
            <span className="text-sm text-slate-700 flex-1 truncate">{node.name}</span>
            <span className="text-xs text-slate-400">{node.size ? formatFileSize(node.size) : ''}</span>
            <button
              onClick={() => removeFile(node.path)}
              className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-100 rounded transition-all"
              title="Remove file"
            >
              <svg className="w-3 h-3 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}
      </div>
    ));
  };

  return (
    <div className={`bg-white rounded-lg border border-slate-200 ${className}`}>
      <div className="p-3 border-b border-slate-200 bg-slate-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
            </svg>
            <h3 className="text-sm font-semibold text-slate-900">Project Context</h3>
            <span className="text-xs text-slate-500">({files.length} files)</span>
          </div>
          
          <div className="flex gap-2">
            <label className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium cursor-pointer transition-colors flex items-center gap-1.5">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Files
              <input
                type="file"
                multiple
                onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
                className="hidden"
              />
            </label>
            
            {files.length > 0 && (
              <button
                onClick={() => onFilesChange([])}
                className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-sm font-medium transition-colors"
              >
                Clear All
              </button>
            )}
          </div>
        </div>
      </div>

      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`p-3 ${dragOver ? 'bg-blue-50 border-2 border-blue-300 border-dashed' : ''}`}
      >
        {files.length === 0 ? (
          <div className="text-center py-8">
            <svg className="w-16 h-16 mx-auto text-slate-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <p className="text-slate-600 font-medium mb-1">Drop files here or click to upload</p>
            <p className="text-sm text-slate-400">Support for multiple files and folders</p>
          </div>
        ) : (
          <div className="max-h-64 overflow-y-auto custom-scrollbar">
            {renderFileTree(fileTree)}
          </div>
        )}
      </div>

      {files.length > 0 && (
        <div className="p-3 border-t border-slate-200 bg-slate-50">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Total: {formatFileSize(files.reduce((sum, f) => sum + (f.size || 0), 0))}</span>
            <span>{files.length} file{files.length !== 1 ? 's' : ''} loaded</span>
          </div>
        </div>
      )}
    </div>
  );
};
