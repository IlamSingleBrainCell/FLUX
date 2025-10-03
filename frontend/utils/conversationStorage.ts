// utils/conversationStorage.ts - Message Persistence with IndexedDB
import { openDB, DBSchema, IDBPDatabase } from 'idb';

export interface Message {
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

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: string;
  updatedAt: string;
  mode: 'single' | 'team';
  selectedAgent?: string;
}

interface ConversationDB extends DBSchema {
  conversations: {
    key: string;
    value: Conversation;
    indexes: { 'by-date': string };
  };
}

const DB_NAME = 'flux-conversations';
const DB_VERSION = 1;
const STORE_NAME = 'conversations';

let dbPromise: Promise<IDBPDatabase<ConversationDB>> | null = null;

// Initialize IndexedDB
const getDB = async (): Promise<IDBPDatabase<ConversationDB>> => {
  if (!dbPromise) {
    dbPromise = openDB<ConversationDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
          store.createIndex('by-date', 'updatedAt');
        }
      },
    });
  }
  return dbPromise;
};

// Generate unique ID
export const generateId = (): string => {
  return `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Save conversation to IndexedDB
export const saveConversation = async (conversation: Conversation): Promise<void> => {
  try {
    const db = await getDB();
    await db.put(STORE_NAME, conversation);
    
    // Also save to localStorage for quick access
    localStorage.setItem('currentConversationId', conversation.id);
    localStorage.setItem(`conversation_${conversation.id}`, JSON.stringify(conversation));
  } catch (error) {
    console.error('Error saving conversation:', error);
  }
};

// Load conversation from IndexedDB
export const loadConversation = async (id: string): Promise<Conversation | null> => {
  try {
    // Try localStorage first (faster)
    const cached = localStorage.getItem(`conversation_${id}`);
    if (cached) {
      return JSON.parse(cached);
    }
    
    // Fallback to IndexedDB
    const db = await getDB();
    return (await db.get(STORE_NAME, id)) || null;
  } catch (error) {
    console.error('Error loading conversation:', error);
    return null;
  }
};

// Get all conversations
export const getAllConversations = async (): Promise<Conversation[]> => {
  try {
    const db = await getDB();
    const conversations = await db.getAllFromIndex(STORE_NAME, 'by-date');
    return conversations.reverse(); // Most recent first
  } catch (error) {
    console.error('Error loading conversations:', error);
    return [];
  }
};

// Delete conversation
export const deleteConversation = async (id: string): Promise<void> => {
  try {
    const db = await getDB();
    await db.delete(STORE_NAME, id);
    localStorage.removeItem(`conversation_${id}`);
  } catch (error) {
    console.error('Error deleting conversation:', error);
  }
};

// Get current conversation ID
export const getCurrentConversationId = (): string | null => {
  return localStorage.getItem('currentConversationId');
};

// Create new conversation
export const createNewConversation = (
  mode: 'single' | 'team' = 'team',
  selectedAgent?: string
): Conversation => {
  return {
    id: generateId(),
    title: 'New Chat',
    messages: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    mode,
    selectedAgent,
  };
};

// Auto-generate title from first message
export const generateConversationTitle = (messages: Message[]): string => {
  if (messages.length === 0) return 'New Chat';
  
  const firstUserMessage = messages.find(m => m.isUser);
  if (!firstUserMessage) return 'New Chat';
  
  const title = firstUserMessage.content.slice(0, 50);
  return title.length < firstUserMessage.content.length ? `${title}...` : title;
};

// Export conversation as JSON
export const exportConversationJSON = (conversation: Conversation): void => {
  const dataStr = JSON.stringify(conversation, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `conversation_${conversation.id}.json`;
  link.click();
  URL.revokeObjectURL(url);
};

// Export conversation as Markdown
export const exportConversationMarkdown = (conversation: Conversation): void => {
  let markdown = `# ${conversation.title}\n\n`;
  markdown += `**Created:** ${new Date(conversation.createdAt).toLocaleString()}\n`;
  markdown += `**Mode:** ${conversation.mode}\n\n`;
  markdown += `---\n\n`;
  
  conversation.messages.forEach(msg => {
    markdown += `### ${msg.agentName}\n`;
    markdown += `*${new Date(msg.timestamp).toLocaleTimeString()}*\n\n`;
    markdown += `${msg.content}\n\n`;
    
    if (msg.artifact) {
      markdown += `#### Artifact: ${msg.artifact.title}\n`;
      markdown += `\`\`\`${msg.artifact.language || ''}\n`;
      markdown += `${msg.artifact.content}\n`;
      markdown += `\`\`\`\n\n`;
    }
    
    markdown += `---\n\n`;
  });
  
  const dataBlob = new Blob([markdown], { type: 'text/markdown' });
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `conversation_${conversation.id}.md`;
  link.click();
  URL.revokeObjectURL(url);
};
