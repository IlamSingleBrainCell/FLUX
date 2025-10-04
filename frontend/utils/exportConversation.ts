// utils/exportConversation.ts - Conversation Export Utilities

interface Message {
  id: string;
  agentId: string;
  agentName: string;
  content: string;
  timestamp: string;
  isUser?: boolean;
  artifact?: {
    type: 'code' | 'design' | 'document' | 'diagram';
    title: string;
    content: string;
    language?: string;
  };
}

/**
 * Export conversation as Markdown
 */
export function exportAsMarkdown(messages: Message[], title: string = 'Conversation'): string {
  let markdown = `# ${title}\n\n`;
  markdown += `*Exported on ${new Date().toLocaleString()}*\n\n`;
  markdown += `---\n\n`;

  messages.forEach((msg, index) => {
    const time = new Date(msg.timestamp).toLocaleTimeString();
    const role = msg.isUser ? '**You**' : `**${msg.agentName}**`;
    
    markdown += `### Message ${index + 1} - ${role} (${time})\n\n`;
    markdown += `${msg.content}\n\n`;

    if (msg.artifact) {
      markdown += `**Artifact: ${msg.artifact.title}**\n\n`;
      if (msg.artifact.type === 'code') {
        markdown += `\`\`\`${msg.artifact.language || ''}\n${msg.artifact.content}\n\`\`\`\n\n`;
      } else {
        markdown += `${msg.artifact.content}\n\n`;
      }
    }

    markdown += `---\n\n`;
  });

  return markdown;
}

/**
 * Export conversation as JSON
 */
export function exportAsJSON(messages: Message[], metadata?: any): string {
  const exportData = {
    exportedAt: new Date().toISOString(),
    version: '1.0',
    messageCount: messages.length,
    metadata: metadata || {},
    messages: messages.map(msg => ({
      ...msg,
      exportedTimestamp: new Date(msg.timestamp).toISOString()
    }))
  };

  return JSON.stringify(exportData, null, 2);
}

/**
 * Export conversation as HTML
 */
export function exportAsHTML(messages: Message[], title: string = 'Conversation'): string {
  const css = `
    <style>
      body {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        max-width: 900px;
        margin: 0 auto;
        padding: 2rem;
        background: #f8fafc;
      }
      h1 {
        color: #1e293b;
        border-bottom: 3px solid #3b82f6;
        padding-bottom: 0.5rem;
      }
      .message {
        background: white;
        border-radius: 12px;
        padding: 1.5rem;
        margin: 1rem 0;
        box-shadow: 0 1px 3px rgba(0,0,0,0.1);
      }
      .message-header {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        margin-bottom: 1rem;
        padding-bottom: 0.75rem;
        border-bottom: 1px solid #e2e8f0;
      }
      .avatar {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: bold;
      }
      .user-avatar {
        background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
      }
      .message-info {
        flex: 1;
      }
      .agent-name {
        font-weight: 600;
        color: #1e293b;
      }
      .timestamp {
        font-size: 0.875rem;
        color: #64748b;
      }
      .message-content {
        color: #334155;
        line-height: 1.6;
        white-space: pre-wrap;
      }
      .artifact {
        margin-top: 1rem;
        padding: 1rem;
        background: #f1f5f9;
        border-radius: 8px;
        border-left: 4px solid #3b82f6;
      }
      .artifact-title {
        font-weight: 600;
        color: #1e293b;
        margin-bottom: 0.5rem;
      }
      pre {
        background: #1e293b;
        color: #e2e8f0;
        padding: 1rem;
        border-radius: 6px;
        overflow-x: auto;
      }
      code {
        font-family: 'Monaco', 'Menlo', monospace;
        font-size: 0.875rem;
      }
      .metadata {
        color: #64748b;
        font-size: 0.875rem;
        margin-bottom: 2rem;
      }
    </style>
  `;

  let html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  ${css}
</head>
<body>
  <h1>${title}</h1>
  <div class="metadata">
    Exported on ${new Date().toLocaleString()} • ${messages.length} messages
  </div>
`;

  messages.forEach((msg, index) => {
    const time = new Date(msg.timestamp).toLocaleString();
    const isUser = msg.isUser;
    const avatarClass = isUser ? 'user-avatar' : '';
    const avatarText = isUser ? 'U' : msg.agentName.charAt(0);

    html += `
  <div class="message">
    <div class="message-header">
      <div class="avatar ${avatarClass}">${avatarText}</div>
      <div class="message-info">
        <div class="agent-name">${isUser ? 'You' : msg.agentName}</div>
        <div class="timestamp">${time}</div>
      </div>
    </div>
    <div class="message-content">${escapeHtml(msg.content)}</div>`;

    if (msg.artifact) {
      html += `
    <div class="artifact">
      <div class="artifact-title">${escapeHtml(msg.artifact.title)}</div>`;
      
      if (msg.artifact.type === 'code') {
        html += `<pre><code>${escapeHtml(msg.artifact.content)}</code></pre>`;
      } else {
        html += `<div>${escapeHtml(msg.artifact.content)}</div>`;
      }
      
      html += `
    </div>`;
    }

    html += `
  </div>`;
  });

  html += `
</body>
</html>`;

  return html;
}

/**
 * Download file to user's system
 */
export function downloadFile(content: string, filename: string, contentType: string = 'text/plain') {
  const blob = new Blob([content], { type: contentType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Export conversation in specified format
 */
export function exportConversation(
  messages: Message[],
  format: 'markdown' | 'json' | 'html',
  title?: string
) {
  const timestamp = new Date().toISOString().split('T')[0];
  const conversationTitle = title || `Conversation ${timestamp}`;

  switch (format) {
    case 'markdown': {
      const content = exportAsMarkdown(messages, conversationTitle);
      downloadFile(content, `${conversationTitle}.md`, 'text/markdown');
      break;
    }
    case 'json': {
      const content = exportAsJSON(messages, { title: conversationTitle });
      downloadFile(content, `${conversationTitle}.json`, 'application/json');
      break;
    }
    case 'html': {
      const content = exportAsHTML(messages, conversationTitle);
      downloadFile(content, `${conversationTitle}.html`, 'text/html');
      break;
    }
  }
}

/**
 * Copy conversation to clipboard
 */
export async function copyToClipboard(messages: Message[], format: 'markdown' | 'text' = 'text'): Promise<boolean> {
  try {
    let content: string;
    
    if (format === 'markdown') {
      content = exportAsMarkdown(messages);
    } else {
      content = messages.map(msg => {
        const role = msg.isUser ? 'You' : msg.agentName;
        return `${role}: ${msg.content}`;
      }).join('\n\n');
    }

    await navigator.clipboard.writeText(content);
    return true;
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    return false;
  }
}

/**
 * Share conversation via Web Share API (mobile)
 */
export async function shareConversation(messages: Message[], title?: string): Promise<boolean> {
  if (!navigator.share) {
    console.warn('Web Share API not supported');
    return false;
  }

  try {
    const content = exportAsMarkdown(messages, title);
    const blob = new Blob([content], { type: 'text/markdown' });
    const file = new File([blob], `conversation-${Date.now()}.md`, { type: 'text/markdown' });

    await navigator.share({
      title: title || 'AI Conversation',
      text: 'Check out this AI conversation',
      files: [file]
    });

    return true;
  } catch (error) {
    console.error('Failed to share:', error);
    return false;
  }
}

// Helper function to escape HTML
function escapeHtml(text: string): string {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
