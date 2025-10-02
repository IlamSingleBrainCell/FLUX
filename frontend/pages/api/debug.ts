// Debug endpoint to check environment variables
import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  // Debug environment variables
  const envDebug = {
    NODE_ENV: process.env.NODE_ENV,
    GROQ_API_KEY_exists: !!process.env.GROQ_API_KEY,
    GROQ_API_KEY_length: process.env.GROQ_API_KEY?.length || 0,
    GROQ_API_KEY_prefix: process.env.GROQ_API_KEY?.substring(0, 10) || 'not_found',
    groq_api_key_exists: !!process.env.groq_api_key,
    all_groq_keys: Object.keys(process.env).filter(key => key.toLowerCase().includes('groq')),
    all_env_count: Object.keys(process.env).length,
    vercel_env: process.env.VERCEL_ENV,
    deployment_env: {
      VERCEL: process.env.VERCEL,
      VERCEL_ENV: process.env.VERCEL_ENV,
      VERCEL_URL: process.env.VERCEL_URL
    }
  };

  res.status(200).json({
    message: 'Environment Debug Information',
    debug: envDebug,
    timestamp: new Date().toISOString()
  });
}