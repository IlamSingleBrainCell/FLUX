// components/Artifacts/ArtifactList.tsx
import React from 'react';
import { Artifact } from '../../pages/artifacts';

interface ArtifactListProps {
  artifacts: Artifact[];
  selectedId?: string;
  onSelect: (artifact: Artifact) => void;
  onDelete: (id: string) => void;
}

export const ArtifactList: React.FC<ArtifactListProps> = ({
  artifacts,
  selectedId,
  onSelect,
  onDelete
}) => {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'code': return '📜';
      case 'document': return '📄';
      case 'diagram': return '📊';
      case 'data': return '🗃️';
      default: return '📝';
    }
  };

  const getLanguageColor = (language?: string) => {
    const colors: { [key: string]: string } = {
      'javascript': 'bg-yellow-100 text-yellow-800',
      'typescript': 'bg-blue-100 text-blue-800',
      'python': 'bg-green-100 text-green-800',
      'java': 'bg-red-100 text-red-800',
      'csharp': 'bg-purple-100 text-purple-800',
      'html': 'bg-orange-100 text-orange-800',
      'css': 'bg-pink-100 text-pink-800',
    };
    return colors[language || ''] || 'bg-gray-100 text-gray-800';
  };

  if (artifacts.length === 0) {
    return (
      <div className="p-6 text-center text-gray-500">
        <p className="text-sm">No artifacts yet</p>
      </div>
    );
  }

  return (
    <div className="overflow-y-auto max-h-[calc(100vh-250px)]">
      {artifacts.map(artifact => (
        <div
          key={artifact.id}
          className={`p-3 border-b border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors ${
            selectedId === artifact.id ? 'bg-blue-50 border-l-4 border-l-blue-600' : ''
          }`}
          onClick={() => onSelect(artifact)}
        >
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg">{getTypeIcon(artifact.type)}</span>
                <h3 className="font-medium text-gray-900 truncate text-sm">
                  {artifact.title}
                </h3>
              </div>
              {artifact.language && (
                <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${getLanguageColor(artifact.language)}`}>
                  {artifact.language}
                </span>
              )}
              <p className="text-xs text-gray-500 mt-1">
                {new Date(artifact.updatedAt).toLocaleDateString()}
              </p>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (confirm('Delete this artifact?')) {
                  onDelete(artifact.id);
                }
              }}
              className="text-gray-400 hover:text-red-600 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};
