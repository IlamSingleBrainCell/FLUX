# Environment Configuration Guide

## Overview
This project uses environment variables for configuration across different environments (local development, production/Vercel).

## Frontend Environment Variables

### Local Development (.env.local)
Create `frontend/.env.local` for local development:
```bash
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_WS_URL=ws://localhost:8000
NODE_ENV=development
```

### Production (Vercel)
Vercel automatically uses `frontend/.env.production`:
```bash
NEXT_PUBLIC_API_URL=/api
NEXT_PUBLIC_WS_URL=
NODE_ENV=production
```

**Note:** In production, WebSocket connections are not available in Vercel's serverless environment. The frontend automatically falls back to REST API calls.

## Backend Environment Variables

### Local Development (.env)
Create `backend/.env` for local backend server:
```bash
GROQ_API_KEY=your_actual_groq_api_key
PORT=8000
ENVIRONMENT=development
```

## Vercel Environment Variables Setup

For production deployment on Vercel, you need to set the following environment variable in the Vercel dashboard:

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add the following variable:
   - **Name:** `GROQ_API_KEY`
   - **Value:** Your actual Groq API key from https://console.groq.com
   - **Environment:** Production (and optionally Preview/Development)

## Getting Your Groq API Key

1. Visit https://console.groq.com
2. Sign up or log in with your account
3. Navigate to API Keys section
4. Create a new API key
5. Copy the key and add it to:
   - `backend/.env` for local development
   - Vercel Environment Variables for production

## How It Works

### Local Development
- Frontend connects to `http://localhost:8000` (your local Python backend)
- Backend uses GROQ API key from `backend/.env`
- WebSocket connections work normally

### Production (Vercel)
- Frontend connects to `/api` (Vercel serverless functions)
- Backend serverless function uses GROQ API key from Vercel environment variables
- WebSocket connections automatically fall back to REST API
- All requests are served via HTTPS

## Security Notes

⚠️ **NEVER commit `.env` or `.env.local` files to Git!**
- These files are already in `.gitignore`
- Only commit `.env.example` and `.env.production` files
- Always use Vercel's environment variable management for production secrets

## Troubleshooting

### "Failed to load resource: 404" on /api/health
- Make sure GROQ_API_KEY is set in Vercel environment variables
- Redeploy after adding environment variables

### "Cannot connect to backend" in local development
1. Check if backend server is running: `cd backend && python main_minimal.py`
2. Verify `frontend/.env.local` has correct URLs
3. Ensure `backend/.env` exists with valid GROQ_API_KEY

### Frontend always shows "Connecting" in production
- This is expected if the API endpoints are not responding
- Check Vercel deployment logs for errors
- Verify GROQ_API_KEY is properly set in Vercel
