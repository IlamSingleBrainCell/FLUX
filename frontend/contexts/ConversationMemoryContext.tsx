import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface Message {
  id: string;
  agentId: string;
  agentName: string;
  content: string;
  timestamp: Date;
  conversationId: string;
}

interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  participants: string[];
  bookmarked: boolean;
  lastActivity: Date;
  tags: string[];
  context: Record<string, any>;
}

interface ConversationMemoryContextType {
  conversations: Conversation[];
  currentConversation: Conversation | null;
  createConversation: (title: string, agentId: string) => string;
  addMessage: (conversationId: string, message: Omit<Message, 'id' | 'timestamp'>) => void;
  bookmarkConversation: (conversationId: string) => void;
  getAgentContext: (agentId: string) => any;
  setAgentContext: (agentId: string, context: any) => void;
  searchConversations: (query: string) => Conversation[];
  continueConversation: (conversationId: string) => void;
  exportConversation: (conversationId: string, format: 'pdf' | 'markdown' | 'json') => void;
}

const ConversationMemoryContext = createContext<ConversationMemoryContextType | undefined>(undefined);

export const useConversationMemory = () => {
  const context = useContext(ConversationMemoryContext);
  if (!context) {
    throw new Error('useConversationMemory must be used within ConversationMemoryProvider');
  }
  return context;
};

export const ConversationMemoryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('flux_conversations');
    if (stored) {
      const parsed = JSON.parse(stored);
      setConversations(parsed.map((c: any) => ({
        ...c,
        lastActivity: new Date(c.lastActivity),
        messages: c.messages.map((m: any) => ({
          ...m,
          timestamp: new Date(m.timestamp)
        }))
      })));
    }
  }, []);

  // Save to localStorage whenever conversations change
  useEffect(() => {
    if (conversations.length > 0) {
      localStorage.setItem('flux_conversations', JSON.stringify(conversations));
    }
  }, [conversations]);

  const createConversation = (title: string, agentId: string): string => {
    const newConversation: Conversation = {
      id: `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      title,
      messages: [],
      participants: [agentId],
      bookmarked: false,
      lastActivity: new Date(),
      tags: [],
      context: {}
    };
    setConversations(prev => [newConversation, ...prev]);
    setCurrentConversation(newConversation);
    return newConversation.id;
  };

  const addMessage = (conversationId: string, message: Omit<Message, 'id' | 'timestamp'>) => {
    setConversations(prev => prev.map(conv => {
      if (conv.id === conversationId) {
        const newMessage: Message = {
          ...message,
          id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          timestamp: new Date(),
          conversationId
        };
        
        const updatedConv = {
          ...conv,
          messages: [...conv.messages, newMessage],
          lastActivity: new Date(),
          participants: conv.participants.includes(message.agentId) 
            ? conv.participants 
            : [...conv.participants, message.agentId]
        };
        
        if (currentConversation?.id === conversationId) {
          setCurrentConversation(updatedConv);
        }
        
        return updatedConv;
      }
      return conv;
    }));
  };

  const bookmarkConversation = (conversationId: string) => {
    setConversations(prev => prev.map(conv => 
      conv.id === conversationId ? { ...conv, bookmarked: !conv.bookmarked } : conv
    ));
  };

  const getAgentContext = (agentId: string) => {
    if (!currentConversation) return {};
    return currentConversation.context[agentId] || {};
  };

  const setAgentContext = (agentId: string, context: any) => {
    if (!currentConversation) return;
    
    setConversations(prev => prev.map(conv => {
      if (conv.id === currentConversation.id) {
        const updatedConv = {
          ...conv,
          context: {
            ...conv.context,
            [agentId]: { ...conv.context[agentId], ...context }
          }
        };
        setCurrentConversation(updatedConv);
        return updatedConv;
      }
      return conv;
    }));
  };

  const searchConversations = (query: string): Conversation[] => {
    const lowerQuery = query.toLowerCase();
    return conversations.filter(conv => 
      conv.title.toLowerCase().includes(lowerQuery) ||
      conv.messages.some(msg => msg.content.toLowerCase().includes(lowerQuery)) ||
      conv.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    );
  };

  const continueConversation = (conversationId: string) => {
    const conv = conversations.find(c => c.id === conversationId);
    if (conv) {
      setCurrentConversation(conv);
    }
  };

  const exportConversation = (conversationId: string, format: 'pdf' | 'markdown' | 'json') => {
    const conv = conversations.find(c => c.id === conversationId);
    if (!conv) return;

    if (format === 'json') {
      const blob = new Blob([JSON.stringify(conv, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${conv.title.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.json`;
      a.click();
    } else if (format === 'markdown') {
      let markdown = `# ${conv.title}\n\n`;
      markdown += `**Date:** ${conv.lastActivity.toLocaleString()}\n`;
      markdown += `**Participants:** ${conv.participants.join(', ')}\n\n`;
      markdown += `---\n\n`;
      
      conv.messages.forEach(msg => {
        markdown += `### ${msg.agentName} - ${msg.timestamp.toLocaleTimeString()}\n\n`;
        markdown += `${msg.content}\n\n`;
      });

      const blob = new Blob([markdown], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${conv.title.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.md`;
      a.click();
    }
  };

  const value: ConversationMemoryContextType = {
    conversations,
    currentConversation,
    createConversation,
    addMessage,
    bookmarkConversation,
    getAgentContext,
    setAgentContext,
    searchConversations,
    continueConversation,
    exportConversation
  };

  return (
    <ConversationMemoryContext.Provider value={value}>
      {children}
    </ConversationMemoryContext.Provider>
  );
};
