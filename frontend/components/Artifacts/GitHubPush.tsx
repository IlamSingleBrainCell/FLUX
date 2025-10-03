// components/Artifacts/GitHubPush.tsx
import React, { useState, useEffect } from 'react';
import { Artifact } from '../../pages/artifacts';

interface GitHubPushProps {
  artifact: Artifact;
  onClose: () => void;
  onSuccess: () => void;
}

interface Repository {
  id: number;
  name: string;
  full_name: string;
  default_branch: string;
}

export const GitHubPush: React.FC<GitHubPushProps> = ({ artifact, onClose, onSuccess }) => {
  const [step, setStep] = useState<'setup' | 'branch' | 'commit' | 'pushing' | 'success'>('setup');
  const [token, setToken] = useState('');
  const [repos, setRepos] = useState<Repository[]>([]);
  const [selectedRepo, setSelectedRepo] = useState<Repository | null>(null);
  const [branchMode, setBranchMode] = useState<'main' | 'new'>('new');
  const [branchName, setBranchName] = useState('');
  const [filePath, setFilePath] = useState('');
  const [commitMessage, setCommitMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Load saved token
    const savedToken = localStorage.getItem('github_token');
    if (savedToken) {
      setToken(savedToken);
      loadRepositories(savedToken);
    }

    // Set default values
    const extension = getFileExtension(artifact.language || '');
    setFilePath(`${artifact.title.replace(/\s+/g, '_')}.${extension}`);
    setCommitMessage(`Add ${artifact.title}`);
    setBranchName(`feature/${artifact.title.replace(/\s+/g, '-').toLowerCase()}`);
  }, [artifact]);

  const getFileExtension = (language: string): string => {
    const extensions: { [key: string]: string } = {
      'javascript': 'js',
      'typescript': 'ts',
      'python': 'py',
      'java': 'java',
      'csharp': 'cs',
      'html': 'html',
      'css': 'css',
      'json': 'json',
      'markdown': 'md',
      'sql': 'sql'
    };
    return extensions[language] || 'txt';
  };

  const loadRepositories = async (authToken: string) => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch('https://api.github.com/user/repos?per_page=100&sort=updated', {
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      });

      if (!response.ok) throw new Error('Failed to load repositories');

      const data = await response.json();
      setRepos(data);
      setStep('branch');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePushToGitHub = async () => {
    if (!selectedRepo || !filePath || !commitMessage) {
      setError('Please fill in all required fields');
      return;
    }

    setStep('pushing');
    setError('');

    try {
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json'
      };

      // Step 1: Get default branch SHA
      const defaultBranchRef = await fetch(
        `https://api.github.com/repos/${selectedRepo.full_name}/git/refs/heads/${selectedRepo.default_branch}`,
        { headers }
      );
      const defaultBranchData = await defaultBranchRef.json();
      const baseSha = defaultBranchData.object.sha;

      // Step 2: Create new branch if needed
      let targetBranch = selectedRepo.default_branch;
      if (branchMode === 'new') {
        try {
          await fetch(
            `https://api.github.com/repos/${selectedRepo.full_name}/git/refs`,
            {
              method: 'POST',
              headers,
              body: JSON.stringify({
                ref: `refs/heads/${branchName}`,
                sha: baseSha
              })
            }
          );
          targetBranch = branchName;
        } catch (err) {
          // Branch might already exist, continue
        }
      }

      // Step 3: Get current commit of target branch
      const branchRef = await fetch(
        `https://api.github.com/repos/${selectedRepo.full_name}/git/refs/heads/${targetBranch}`,
        { headers }
      );
      const branchData = await branchRef.json();
      const commitSha = branchData.object.sha;

      // Step 4: Get commit to get tree SHA
      const commitResponse = await fetch(
        `https://api.github.com/repos/${selectedRepo.full_name}/git/commits/${commitSha}`,
        { headers }
      );
      const commitData = await commitResponse.json();
      const treeSha = commitData.tree.sha;

      // Step 5: Create blob with file content
      const blobResponse = await fetch(
        `https://api.github.com/repos/${selectedRepo.full_name}/git/blobs`,
        {
          method: 'POST',
          headers,
          body: JSON.stringify({
            content: artifact.content,
            encoding: 'utf-8'
          })
        }
      );
      const blobData = await blobResponse.json();

      // Step 6: Create new tree
      const treeResponse = await fetch(
        `https://api.github.com/repos/${selectedRepo.full_name}/git/trees`,
        {
          method: 'POST',
          headers,
          body: JSON.stringify({
            base_tree: treeSha,
            tree: [{
              path: filePath,
              mode: '100644',
              type: 'blob',
              sha: blobData.sha
            }]
          })
        }
      );
      const treeData = await treeResponse.json();

      // Step 7: Create new commit
      const newCommitResponse = await fetch(
        `https://api.github.com/repos/${selectedRepo.full_name}/git/commits`,
        {
          method: 'POST',
          headers,
          body: JSON.stringify({
            message: commitMessage,
            tree: treeData.sha,
            parents: [commitSha]
          })
        }
      );
      const newCommitData = await newCommitResponse.json();

      // Step 8: Update branch reference
      await fetch(
        `https://api.github.com/repos/${selectedRepo.full_name}/git/refs/heads/${targetBranch}`,
        {
          method: 'PATCH',
          headers,
          body: JSON.stringify({
            sha: newCommitData.sha,
            force: false
          })
        }
      );

      setStep('success');
      setTimeout(() => {
        onSuccess();
      }, 2000);
    } catch (err: any) {
      setError(`Failed to push: ${err.message}`);
      setStep('commit');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
            <div>
              <h2 className="text-xl font-bold text-white">Push to GitHub</h2>
              <p className="text-sm text-gray-300">{artifact.title}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-100px)]">
          {/* Step Indicator */}
          <div className="flex items-center justify-between mb-6">
            {['Repository', 'Branch', 'Commit', 'Push'].map((label, index) => (
              <div key={label} className="flex items-center">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full font-semibold ${
                  index === 0 && step === 'setup' ? 'bg-blue-600 text-white' :
                  index === 1 && step === 'branch' ? 'bg-blue-600 text-white' :
                  index === 2 && step === 'commit' ? 'bg-blue-600 text-white' :
                  index === 3 && (step === 'pushing' || step === 'success') ? 'bg-blue-600 text-white' :
                  'bg-gray-200 text-gray-600'
                }`}>
                  {index + 1}
                </div>
                <span className={`ml-2 text-sm ${
                  (index === 0 && step === 'setup') ||
                  (index === 1 && step === 'branch') ||
                  (index === 2 && step === 'commit') ||
                  (index === 3 && (step === 'pushing' || step === 'success'))
                    ? 'text-gray-900 font-medium'
                    : 'text-gray-500'
                }`}>
                  {label}
                </span>
                {index < 3 && <div className="w-12 h-0.5 bg-gray-300 mx-2"></div>}
              </div>
            ))}
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          {/* Step 1: Repository Selection */}
          {step === 'setup' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Repository
                </label>
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                ) : repos.length === 0 ? (
                  <p className="text-sm text-gray-500">No repositories found. Please connect GitHub first.</p>
                ) : (
                  <select
                    value={selectedRepo?.id || ''}
                    onChange={(e) => {
                      const repo = repos.find(r => r.id === Number(e.target.value));
                      setSelectedRepo(repo || null);
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Choose a repository...</option>
                    {repos.map(repo => (
                      <option key={repo.id} value={repo.id}>{repo.full_name}</option>
                    ))}
                  </select>
                )}
              </div>

              <button
                onClick={() => setStep('branch')}
                disabled={!selectedRepo}
                className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
              >
                Continue
              </button>
            </div>
          )}

          {/* Step 2: Branch Selection */}
          {step === 'branch' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Choose Branch Strategy
                </label>
                <div className="space-y-3">
                  <label className="flex items-start p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-blue-300 transition-colors">
                    <input
                      type="radio"
                      name="branch"
                      value="new"
                      checked={branchMode === 'new'}
                      onChange={() => setBranchMode('new')}
                      className="mt-1 mr-3"
                    />
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">Create New Branch</div>
                      <p className="text-sm text-gray-600 mt-1">
                        Recommended: Create a feature branch for review via Pull Request
                      </p>
                      {branchMode === 'new' && (
                        <input
                          type="text"
                          value={branchName}
                          onChange={(e) => setBranchName(e.target.value)}
                          placeholder="feature/my-branch"
                          className="mt-3 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      )}
                    </div>
                  </label>

                  <label className="flex items-start p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-blue-300 transition-colors">
                    <input
                      type="radio"
                      name="branch"
                      value="main"
                      checked={branchMode === 'main'}
                      onChange={() => setBranchMode('main')}
                      className="mt-1 mr-3"
                    />
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">Push to Main Branch</div>
                      <p className="text-sm text-gray-600 mt-1">
                        Direct push to {selectedRepo?.default_branch || 'main'} (use with caution)
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep('setup')}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep('commit')}
                  disabled={branchMode === 'new' && !branchName}
                  className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Commit Details */}
          {step === 'commit' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  File Path
                </label>
                <input
                  type="text"
                  value={filePath}
                  onChange={(e) => setFilePath(e.target.value)}
                  placeholder="src/components/MyComponent.tsx"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Path where the file will be created in the repository
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Commit Message
                </label>
                <textarea
                  value={commitMessage}
                  onChange={(e) => setCommitMessage(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Add new feature..."
                />
              </div>

              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="text-sm text-blue-900">
                  <p className="font-medium mb-2">📝 Summary:</p>
                  <ul className="space-y-1 ml-4 list-disc">
                    <li>Repository: <strong>{selectedRepo?.full_name}</strong></li>
                    <li>Branch: <strong>{branchMode === 'new' ? branchName : selectedRepo?.default_branch}</strong></li>
                    <li>File: <strong>{filePath}</strong></li>
                  </ul>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep('branch')}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Back
                </button>
                <button
                  onClick={handlePushToGitHub}
                  disabled={!filePath || !commitMessage}
                  className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  Push to GitHub
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Pushing */}
          {step === 'pushing' && (
            <div className="py-12 text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Pushing to GitHub...</h3>
              <p className="text-sm text-gray-600">Please wait while we push your changes</p>
            </div>
          )}

          {/* Step 5: Success */}
          {step === 'success' && (
            <div className="py-12 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Successfully Pushed!</h3>
              <p className="text-sm text-gray-600 mb-6">
                Your changes have been pushed to {selectedRepo?.full_name}
              </p>
              <a
                href={`https://github.com/${selectedRepo?.full_name}/blob/${branchMode === 'new' ? branchName : selectedRepo?.default_branch}/${filePath}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
              >
                View on GitHub
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
