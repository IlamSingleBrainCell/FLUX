// Configuration for FLUX frontend
export const config = {
  // Get backend API URL
  getApiUrl: () => {
    // Priority: Vercel environment variable > fallback URLs
    if (typeof window !== 'undefined') {
      const vercelBackendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
      if (vercelBackendUrl) return vercelBackendUrl;
    }
    
    // Development vs Production fallbacks
    return process.env.NODE_ENV === 'production'
      ? 'https://flux-six-drab.vercel.app/api'
      : 'http://localhost:8000';
  },

  // Get WebSocket URL (null for serverless)
  getWebSocketUrl: (sessionId: string) => {
    if (process.env.NODE_ENV === 'production') {
      return null; // Serverless doesn't support WebSocket
    }
    
    const wsUrl = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8000';
    return `${wsUrl}/ws/${sessionId}`;
  },

  // Check if we're in serverless mode
  isServerless: () => process.env.NODE_ENV === 'production',

  // Get environment info for debugging
  getEnvironmentInfo: () => ({
    nodeEnv: process.env.NODE_ENV,
    backendUrl: process.env.NEXT_PUBLIC_BACKEND_URL,
    wsUrl: process.env.NEXT_PUBLIC_WS_URL,
    isServerless: process.env.NODE_ENV === 'production'
  })
};