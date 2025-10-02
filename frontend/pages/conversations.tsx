import React from 'react';
import Head from 'next/head';
import { useConversationMemory } from '../contexts/ConversationMemoryContext';
import { ExportChat, EmojiReactions, ConversationPin, ConversationSearch } from '../components/QuickWins/QuickWins';

export default function ConversationsPage() {
  const {
    conversations,
    currentConversation,
    continueConversation,
    bookmarkConversation,
    exportConversation,
    searchConversations
  } = useConversationMemory();

  const [searchQuery, setSearchQuery] = React.useState('');
  const [filter, setFilter] = React.useState<'all' | 'bookmarked'>('all');

  const filteredConversations = React.useMemo(() => {
    let result = conversations;
    
    if (filter === 'bookmarked') {
      result = result.filter(c => c.bookmarked);
    }
    
    if (searchQuery) {
      result = searchConversations(searchQuery);
    }
    
    return result;
  }, [conversations, filter, searchQuery, searchConversations]);

  const handleExport = (conversationId: string, format: string) => {
    exportConversation(conversationId, format as 'pdf' | 'markdown' | 'json');
  };

  return (
    <>
      <Head>
        <title>Conversation History - FLUX Enterprise</title>
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50 dark:from-gray-900 dark:to-indigo-950 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  💬 Conversation History
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Access and manage all your agent conversations
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setFilter(filter === 'all' ? 'bookmarked' : 'all')}
                  className={`px-4 py-2 rounded-lg font-medium transition ${
                    filter === 'bookmarked'
                      ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  {filter === 'bookmarked' ? '📌 Showing Bookmarked' : '📋 Show All'}
                </button>
              </div>
            </div>

            {/* Search */}
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search conversations..."
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Conversations</p>
              <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{conversations.length}</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Bookmarked</p>
              <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">
                {conversations.filter(c => c.bookmarked).length}
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Messages</p>
              <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                {conversations.reduce((acc, c) => acc + c.messages.length, 0)}
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Active Today</p>
              <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                {conversations.filter(c => {
                  const today = new Date();
                  const lastActivity = new Date(c.lastActivity);
                  return today.toDateString() === lastActivity.toDateString();
                }).length}
              </p>
            </div>
          </div>

          {/* Conversations List */}
          <div className="space-y-4">
            {filteredConversations.length === 0 ? (
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-12 text-center">
                <p className="text-gray-500 dark:text-gray-400 text-lg mb-2">
                  {searchQuery ? 'No conversations found matching your search' : 'No conversations yet'}
                </p>
                <p className="text-gray-400 dark:text-gray-500 text-sm">
                  Start chatting with agents to see your conversation history here
                </p>
              </div>
            ) : (
              filteredConversations.map(conversation => (
                <div
                  key={conversation.id}
                  className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                          {conversation.title}
                        </h3>
                        {conversation.bookmarked && (
                          <span className="text-yellow-500 text-xl">📌</span>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                        <span>💬 {conversation.messages.length} messages</span>
                        <span>👥 {conversation.participants.length} agents</span>
                        <span>🕐 {new Date(conversation.lastActivity).toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <ConversationPin
                        isPinned={conversation.bookmarked}
                        onToggle={() => bookmarkConversation(conversation.id)}
                      />
                    </div>
                  </div>

                  {/* Participants */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {conversation.participants.map((participant, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium"
                      >
                        {participant}
                      </span>
                    ))}
                  </div>

                  {/* Last Message Preview */}
                  {conversation.messages.length > 0 && (
                    <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4 mb-4">
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Last message:</p>
                      <p className="text-gray-900 dark:text-white line-clamp-2">
                        {conversation.messages[conversation.messages.length - 1].content}
                      </p>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => continueConversation(conversation.id)}
                      className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition"
                    >
                      ▶️ Continue Conversation
                    </button>
                    <ExportChat onExport={(format) => handleExport(conversation.id, format)} />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
}
