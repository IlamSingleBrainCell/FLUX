// utils/streamingChat.ts - Streaming Response Handler
export interface StreamingMessage {
  agentId: string;
  agentName: string;
  content: string;
}

export const handleStreamingChat = (
  apiUrl: string,
  message: string,
  chatMode: 'single' | 'team',
  uploadedFiles: any[],
  onToken: (token: string, agentId: string, agentName: string) => void,
  onComplete: (fullMessage: string, agentId: string, agentName: string) => void,
  onError: (error: string) => void
): EventSource => {
  // URL encode the parameters
  const params = new URLSearchParams({
    message: message,
    chat_mode: chatMode,
    files: JSON.stringify(uploadedFiles)
  });

  const eventSource = new EventSource(`${apiUrl}/chat/stream?${params.toString()}`);
  
  let accumulatedContent = '';
  let currentAgentId = '';
  let currentAgentName = '';

  eventSource.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);

      if (data.type === 'start') {
        // Agent started responding
        currentAgentId = data.agent;
        currentAgentName = data.agent_name;
        accumulatedContent = '';
      } else if (data.type === 'token') {
        // New token received
        accumulatedContent += data.content;
        onToken(data.content, currentAgentId, currentAgentName);
      } else if (data.type === 'done') {
        // Response complete
        onComplete(accumulatedContent, currentAgentId, currentAgentName);
        accumulatedContent = '';
      } else if (data.type === 'error') {
        // Error occurred
        onError(data.message || 'Unknown error');
        eventSource.close();
      }
    } catch (error) {
      console.error('Error parsing stream data:', error);
    }
  };

  eventSource.onerror = (error) => {
    console.error('EventSource error:', error);
    onError('Connection to server lost');
    eventSource.close();
  };

  return eventSource;
};
