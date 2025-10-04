// utils/streamingResponse.ts - Streaming Response Handler

export interface StreamingOptions {
  onToken?: (token: string) => void;
  onComplete?: (fullText: string) => void;
  onError?: (error: Error) => void;
  signal?: AbortSignal;
}

/**
 * Handle streaming response from API
 */
export async function handleStreamingResponse(
  url: string,
  requestBody: any,
  options: StreamingOptions = {}
): Promise<string> {
  const { onToken, onComplete, onError, signal } = options;
  
  let fullText = '';
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
      signal,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('Response body is not readable');
    }

    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      
      if (done) {
        break;
      }

      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split('\n');

      for (const line of lines) {
        if (line.trim() === '') continue;
        
        // Handle SSE format
        if (line.startsWith('data: ')) {
          const data = line.slice(6);
          
          if (data === '[DONE]') {
            continue;
          }

          try {
            const parsed = JSON.parse(data);
            const token = parsed.choices?.[0]?.delta?.content || parsed.token || '';
            
            if (token) {
              fullText += token;
              onToken?.(token);
            }
          } catch (e) {
            // If not JSON, treat as raw text
            fullText += data;
            onToken?.(data);
          }
        } else {
          // Handle raw streaming
          fullText += chunk;
          onToken?.(chunk);
        }
      }
    }

    onComplete?.(fullText);
    return fullText;

  } catch (error) {
    const err = error instanceof Error ? error : new Error('Unknown error');
    onError?.(err);
    throw err;
  }
}

/**
 * Create a streaming chat request
 */
export async function streamChatResponse(
  message: string,
  agentId: string,
  conversationHistory: any[] = [],
  options: StreamingOptions = {}
): Promise<string> {
  const apiUrl = getApiUrl();
  
  return handleStreamingResponse(
    `${apiUrl}/chat/stream`,
    {
      message,
      agentId,
      conversationHistory,
      stream: true
    },
    options
  );
}

/**
 * Get API URL based on environment
 */
function getApiUrl(): string {
  if (typeof window !== 'undefined' && window.location.hostname.includes('vercel.app')) {
    return `${window.location.origin}/api`;
  }
  
  if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  
  return process.env.NODE_ENV === 'production' 
    ? '/api' 
    : 'http://localhost:8000';
}

/**
 * Abort controller for cancelling streaming
 */
export class StreamController {
  private controller: AbortController | null = null;

  start(): AbortSignal {
    this.controller = new AbortController();
    return this.controller.signal;
  }

  abort(): void {
    this.controller?.abort();
    this.controller = null;
  }

  isActive(): boolean {
    return this.controller !== null;
  }
}
