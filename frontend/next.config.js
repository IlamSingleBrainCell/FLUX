/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  
  // Environment variables for production
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_BACKEND_URL || 
      (process.env.NODE_ENV === 'production' 
        ? 'https://flux-six-drab.vercel.app/api' 
        : 'http://localhost:8000'),
    NEXT_PUBLIC_WS_URL: process.env.NEXT_PUBLIC_WS_URL || 
      (process.env.NODE_ENV === 'production'
        ? ''
        : 'ws://localhost:8000'),
  },

  // Vercel deployment configuration
  async rewrites() {
    if (process.env.NODE_ENV === 'development') {
      return [
        {
          source: '/api/:path*',
          destination: 'http://localhost:8000/:path*',
        },
      ];
    }
    return [];
  },

  // Optimize for serverless deployment
  experimental: {
    outputFileTracingRoot: process.cwd(),
  },
}

module.exports = nextConfig