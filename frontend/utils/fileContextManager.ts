// utils/fileContextManager.ts - File Context Management for AI

import { UploadedFile } from '../types/agents';

export interface FileContext {
  files: UploadedFile[];
  contextString: string;
  totalSize: number;
  fileCount: number;
}

/**
 * Get programming language from file extension
 */
export function getFileLanguage(filename: string): string {
  const ext = filename.split('.').pop()?.toLowerCase() || '';
  
  const languageMap: Record<string, string> = {
    'ts': 'typescript',
    'tsx': 'typescript',
    'js': 'javascript',
    'jsx': 'javascript',
    'py': 'python',
    'java': 'java',
    'cpp': 'cpp',
    'c': 'c',
    'cs': 'csharp',
    'go': 'go',
    'rs': 'rust',
    'rb': 'ruby',
    'php': 'php',
    'swift': 'swift',
    'kt': 'kotlin',
    'md': 'markdown',
    'json': 'json',
    'yaml': 'yaml',
    'yml': 'yaml',
    'xml': 'xml',
    'html': 'html',
    'css': 'css',
    'scss': 'scss',
    'sql': 'sql',
    'sh': 'bash',
    'bash': 'bash',
  };

  return languageMap[ext] || 'text';
}

/**
 * Generate context string from uploaded files
 */
export function generateFileContext(files: UploadedFile[]): FileContext {
  if (files.length === 0) {
    return {
      files: [],
      contextString: '',
      totalSize: 0,
      fileCount: 0
    };
  }

  let contextString = '## 📁 Uploaded Files Context\n\n';
  let totalSize = 0;

  files.forEach((file, index) => {
    totalSize += file.size;
    const language = getFileLanguage(file.name);
    
    contextString += `### File ${index + 1}: ${file.name}\n`;
    contextString += `**Type:** ${file.type} | **Size:** ${formatFileSize(file.size)}\n\n`;
    
    if (file.content) {
      contextString += '```' + language + '\n';
      contextString += file.content;
      contextString += '\n```\n\n';
    }
  });

  contextString += `---\n**Total Files:** ${files.length} | **Total Size:** ${formatFileSize(totalSize)}\n\n`;

  return {
    files,
    contextString,
    totalSize,
    fileCount: files.length
  };
}

/**
 * Create AI-optimized prompt with file context
 */
export function createPromptWithFileContext(
  userMessage: string,
  files: UploadedFile[],
  options: {
    includeFilenames?: boolean;
    includeFileContent?: boolean;
    maxContextLength?: number;
  } = {}
): string {
  const {
    includeFilenames = true,
    includeFileContent = true,
    maxContextLength = 50000 // ~12k tokens
  } = options;

  if (files.length === 0) {
    return userMessage;
  }

  let prompt = '';

  // Add file list
  if (includeFilenames) {
    prompt += '**Context Files:**\n';
    files.forEach((file, i) => {
      prompt += `${i + 1}. ${file.name} (${formatFileSize(file.size)})\n`;
    });
    prompt += '\n';
  }

  // Add file contents
  if (includeFileContent) {
    const fileContext = generateFileContext(files);
    prompt += fileContext.contextString;
  }

  // Add user message
  prompt += `## 💬 User Question\n\n${userMessage}\n`;

  // Truncate if too long
  if (prompt.length > maxContextLength) {
    const truncated = prompt.substring(0, maxContextLength);
    prompt = truncated + '\n\n[... context truncated due to length ...]';
  }

  return prompt;
}

/**
 * Analyze uploaded files for AI understanding
 */
export function analyzeFiles(files: UploadedFile[]): {
  languages: string[];
  hasCode: boolean;
  hasDocuments: boolean;
  summary: string;
} {
  const languages = new Set<string>();
  let hasCode = false;
  let hasDocuments = false;

  const codeExtensions = ['ts', 'tsx', 'js', 'jsx', 'py', 'java', 'cpp', 'c', 'cs', 'go', 'rs', 'rb', 'php'];
  const docExtensions = ['md', 'txt', 'pdf', 'doc', 'docx'];

  files.forEach(file => {
    const ext = file.name.split('.').pop()?.toLowerCase() || '';
    const language = getFileLanguage(file.name);
    
    if (language !== 'text') {
      languages.add(language);
    }

    if (codeExtensions.includes(ext)) {
      hasCode = true;
    }

    if (docExtensions.includes(ext)) {
      hasDocuments = true;
    }
  });

  let summary = `Uploaded ${files.length} file${files.length > 1 ? 's' : ''}`;
  
  if (languages.size > 0) {
    summary += ` (${Array.from(languages).join(', ')})`;
  }

  if (hasCode) {
    summary += ' - includes source code';
  }

  if (hasDocuments) {
    summary += ' - includes documentation';
  }

  return {
    languages: Array.from(languages),
    hasCode,
    hasDocuments,
    summary
  };
}

/**
 * Extract code snippets from files
 */
export function extractCodeSnippets(files: UploadedFile[], maxSnippets: number = 10): Array<{
  file: string;
  language: string;
  snippet: string;
  lineCount: number;
}> {
  const snippets: Array<{
    file: string;
    language: string;
    snippet: string;
    lineCount: number;
  }> = [];

  files.forEach(file => {
    if (!file.content) return;

    const language = getFileLanguage(file.name);
    const lines = file.content.split('\n');
    
    snippets.push({
      file: file.name,
      language,
      snippet: file.content,
      lineCount: lines.length
    });
  });

  return snippets.slice(0, maxSnippets);
}

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Validate file for AI context
 */
export function validateFile(file: File): {
  valid: boolean;
  error?: string;
} {
  const maxSize = 10 * 1024 * 1024; // 10MB
  const allowedTypes = [
    'text/',
    'application/json',
    'application/javascript',
    'application/typescript',
    'application/x-python',
  ];

  if (file.size > maxSize) {
    return {
      valid: false,
      error: `File size exceeds 10MB limit (${formatFileSize(file.size)})`
    };
  }

  const isAllowedType = allowedTypes.some(type => file.type.startsWith(type)) ||
                        file.name.match(/\.(ts|tsx|js|jsx|py|java|cpp|c|cs|go|rs|rb|php|md|txt|json|yaml|yml)$/i);

  if (!isAllowedType) {
    return {
      valid: false,
      error: `File type not supported: ${file.type}`
    };
  }

  return { valid: true };
}
