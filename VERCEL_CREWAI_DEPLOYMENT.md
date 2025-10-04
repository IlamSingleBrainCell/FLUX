# 🚀 FLUX CrewAI - Vercel Deployment Guide

## 🎯 Deployment Architecture

### Current Setup (Old):
```
Vercel Frontend (Next.js)
    ↓
Backend API (Serverless Functions)
    ↓
Simple Agent Router (main_minimal.py)
```

### New Setup (CrewAI):
```
Vercel Frontend (Next.js)
    ↓
Backend API (Serverless Functions)
    ↓
CrewAI Agent System (main_crewai.py)
```

---

## 🔧 Vercel Configuration Options

### **Option 1: Serverless Functions (Recommended)**

Vercel supports Python serverless functions. We'll adapt the CrewAI system to work in this environment.

#### File Structure:
```
FLUX/
├── frontend/               # Next.js app
│   ├── pages/
│   ├── components/
│   └── package.json
│
├── api/                   # Vercel Serverless Functions
│   ├── index.py          # Main WebSocket handler
│   ├── chat.py           # Chat endpoint
│   ├── agents.py         # Agent info endpoint
│   └── requirements.txt  # Python dependencies
│
└── vercel.json           # Deployment config
```

#### Updated `vercel.json`:
```json
{
  "version": 2,
  "builds": [
    {
      "src": "frontend/package.json",
      "use": "@vercel/next"
    },
    {
      "src": "api/**/*.py",
      "use": "@vercel/python"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/api/$1"
    },
    {
      "src": "/(.*)",
      "dest": "/frontend/$1"
    }
  ],
  "env": {
    "GROQ_API_KEY": "@groq-api-key"
  }
}
```

---

## 📝 Serverless Adaptation

### Challenge: WebSockets in Serverless

**Problem:** Vercel serverless functions are stateless (no persistent WebSocket connections).

**Solution:** Use Vercel's Edge Runtime + polling OR switch to REST API.

### **Approach A: REST API (Simplest)**

Convert WebSocket to REST endpoints:

#### `api/chat.py`:
```python
from http.server import BaseHTTPRequestHandler
import json
import os
import sys

# Add backend to path
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'backend'))

from agents.crewai_agents import get_crewai_system

# Initialize CrewAI once (cached across invocations)
crewai_system = None

def get_crewai():
    global crewai_system
    if crewai_system is None:
        crewai_system = get_crewai_system()
    return crewai_system

class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        """Handle chat requests"""
        try:
            # Read request body
            content_length = int(self.headers['Content-Length'])
            body = self.rfile.read(content_length)
            data = json.loads(body.decode('utf-8'))
            
            message = data.get('message', '')
            agent = data.get('agent')  # Optional: specific agent
            
            crewai = get_crewai()
            
            # Execute based on request type
            if agent:
                # Direct agent call
                import asyncio
                result = asyncio.run(crewai.execute_single_agent(agent, message))
                response = {
                    "type": "single",
                    "agent": agent,
                    "response": result
                }
            else:
                # Smart routing
                import asyncio
                result = asyncio.run(crewai.smart_route(message))
                response = {
                    "type": "smart",
                    "responses": result
                }
            
            # Send response
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps(response).encode())
            
        except Exception as e:
            self.send_response(500)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({
                "error": str(e)
            }).encode())
```

#### `api/requirements.txt`:
```txt
crewai>=0.201.1
crewai-tools>=0.75.0
langchain>=0.3.27
langchain-community>=0.3.30
langchain-groq>=0.2.0
duckduckgo-search>=8.1.1
groq>=0.4.1
pydantic>=2.11.10
```

---

### **Approach B: Pusher/Ably for Real-time (Advanced)**

Use a third-party WebSocket service:

```typescript
// frontend/hooks/useCrewAI.ts
import Pusher from 'pusher-js';

export const useCrewAI = () => {
  const [messages, setMessages] = useState([]);
  
  useEffect(() => {
    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY, {
      cluster: 'us2'
    });
    
    const channel = pusher.subscribe('crewai-chat');
    
    channel.bind('agent-response', (data) => {
      setMessages(prev => [...prev, data]);
    });
    
    return () => pusher.disconnect();
  }, []);
  
  const sendMessage = async (message: string) => {
    // Call Vercel serverless function
    const response = await fetch('/api/chat', {
      method: 'POST',
      body: JSON.stringify({ message }),
      headers: { 'Content-Type': 'application/json' }
    });
    
    // Serverless function triggers Pusher
    // Pusher sends to frontend
  };
};
```

---

## 🚀 Deployment Steps

### **Step 1: Prepare Files**

Create `api/` directory structure:

```bash
cd C:\YOKA\FLUX
mkdir api
```

Copy and adapt backend files:
```bash
# Create serverless-compatible versions
cp backend/agents/crewai_agents.py api/
cp backend/requirements_crewai.txt api/requirements.txt
```

### **Step 2: Update `vercel.json`**

```json
{
  "version": 2,
  "builds": [
    {
      "src": "frontend/package.json",
      "use": "@vercel/next"
    },
    {
      "src": "api/**/*.py",
      "use": "@vercel/python",
      "config": {
        "maxDuration": 30
      }
    }
  ],
  "routes": [
    {
      "src": "/api/chat",
      "dest": "/api/chat.py"
    },
    {
      "src": "/api/agents",
      "dest": "/api/agents.py"
    },
    {
      "src": "/(.*)",
      "dest": "/frontend/$1"
    }
  ],
  "env": {
    "GROQ_API_KEY": "@groq-api-key",
    "PYTHON_VERSION": "3.9"
  }
}
```

### **Step 3: Environment Variables**

In Vercel Dashboard:
1. Go to Project Settings → Environment Variables
2. Add:
   - `GROQ_API_KEY` = your_groq_api_key
   - `PYTHON_VERSION` = 3.9

### **Step 4: Deploy**

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

---

## ⚠️ Serverless Limitations

### 1. **Cold Starts**
- First request takes 3-5 seconds
- **Solution:** Use Vercel Pro (keeps functions warm)

### 2. **Execution Time Limit**
- Free: 10 seconds
- Pro: 60 seconds
- **Solution:** 
  - Use streaming responses
  - Set `max_iter=1` for agents (faster)

### 3. **Memory Limits**
- Default: 1024 MB
- **Solution:** Increase in `vercel.json`:
  ```json
  {
    "functions": {
      "api/**/*.py": {
        "memory": 3008
      }
    }
  }
  ```

### 4. **Package Size**
- Limit: 50 MB compressed
- **Solution:** Use minimal dependencies
  ```txt
  # api/requirements.txt (minimal)
  crewai>=0.201.1
  langchain-groq>=0.2.0
  groq>=0.4.1
  ```

---

## 🎯 Recommended Architecture

### **Hybrid Approach:**

1. **Frontend:** Vercel (Next.js)
2. **Simple Queries:** Vercel Serverless Functions
3. **Complex CrewAI:** External Service (Railway/Render)

```
┌─────────────────────────────────────────┐
│  Vercel Frontend (Next.js)              │
│  - Beautiful UI                         │
│  - Fast static pages                    │
└─────────────┬───────────────────────────┘
              │
              ├──→ Simple queries: Vercel Serverless
              │    (single agent, fast responses)
              │
              └──→ Complex tasks: Railway/Render
                   (CrewAI orchestration, team mode)
```

### Implementation:

```typescript
// frontend/lib/api.ts
const API_ENDPOINT = 
  process.env.NEXT_PUBLIC_CREWAI_ENDPOINT || 
  '/api/chat';

export const sendMessage = async (message: string) => {
  // Detect complexity
  const isComplex = 
    message.toLowerCase().includes('everyone') ||
    message.toLowerCase().includes('team');
  
  const endpoint = isComplex
    ? process.env.NEXT_PUBLIC_CREWAI_URL  // Railway
    : '/api/chat';                         // Vercel
  
  return fetch(endpoint, {
    method: 'POST',
    body: JSON.stringify({ message })
  });
};
```

---

## 🚂 Alternative: Deploy to Railway (Recommended for CrewAI)

**Why Railway?**
- ✅ Full Python environment
- ✅ Persistent WebSocket connections
- ✅ No cold starts
- ✅ No execution time limits
- ✅ Perfect for CrewAI

### Railway Setup:

1. **Create `railway.json`:**
```json
{
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "pip install -r backend/requirements_crewai.txt"
  },
  "deploy": {
    "startCommand": "cd backend && python main_crewai.py",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

2. **Deploy:**
```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Link project
railway link

# Deploy
railway up
```

3. **Get URL:**
```
Your CrewAI backend: https://flux-backend.railway.app
```

4. **Update Frontend:**
```typescript
// frontend/.env.production
NEXT_PUBLIC_WEBSOCKET_URL=wss://flux-backend.railway.app
```

---

## 📊 Cost Comparison

### Vercel Only:
- **Free Tier:** 
  - ✅ Frontend hosting
  - ⚠️ Serverless (10s limit)
  - ❌ WebSockets
  
- **Pro ($20/month):**
  - ✅ Faster functions
  - ✅ 60s execution
  - ❌ Still no WebSockets

### Vercel + Railway:
- **Vercel Free:** Frontend
- **Railway ($5/month):** 
  - ✅ Full Python backend
  - ✅ WebSockets
  - ✅ CrewAI orchestration
  - ✅ No limits

**Recommended:** Vercel + Railway ($5/month total)

---

## 🎯 Final Recommendation

### **Best Setup for Production:**

```
┌──────────────────────────────────────────────┐
│  VERCEL (Frontend)                           │
│  - Next.js app                               │
│  - Static pages                              │
│  - Fast CDN delivery                         │
│  - FREE                                      │
└──────────────┬───────────────────────────────┘
               │
               │ WebSocket Connection
               ▼
┌──────────────────────────────────────────────┐
│  RAILWAY (Backend)                           │
│  - Python + FastAPI                          │
│  - CrewAI orchestration                      │
│  - WebSocket support                         │
│  - $5/month                                  │
└──────────────────────────────────────────────┘
```

### Why This Works Best:

1. **Vercel** - What it's great at:
   - ✅ Fast static frontend
   - ✅ Global CDN
   - ✅ Free tier is enough

2. **Railway** - What Vercel can't do:
   - ✅ Persistent connections
   - ✅ Long-running processes
   - ✅ Full CrewAI support

---

## 🚀 Quick Deploy (Vercel + Railway)

### 1. Deploy Frontend to Vercel:
```bash
cd frontend
vercel --prod
```

### 2. Deploy Backend to Railway:
```bash
cd backend
railway up
```

### 3. Connect Them:
```typescript
// frontend/.env.production
NEXT_PUBLIC_WEBSOCKET_URL=wss://your-railway-app.railway.app
```

### 4. Done! 🎉

---

## 📝 Summary

| Feature | Vercel Only | Vercel + Railway |
|---------|-------------|------------------|
| Frontend | ✅ Excellent | ✅ Excellent |
| Backend | ⚠️ Limited | ✅ Full Support |
| WebSockets | ❌ No | ✅ Yes |
| CrewAI | ⚠️ Basic | ✅ Full |
| Cost | Free | $5/month |
| Cold Starts | ❌ Yes | ✅ No |
| Time Limits | ❌ 10-60s | ✅ None |

**Best Choice:** Vercel (Frontend) + Railway (Backend) = $5/month

---

## 🆘 Need Help?

- **Vercel Deployment:** [vercel.com/docs](https://vercel.com/docs)
- **Railway Deployment:** [docs.railway.app](https://docs.railway.app)
- **CrewAI Issues:** Check `CREWAI_INTEGRATION_GUIDE.md`

---

**Ready to deploy?** Start with Railway for backend, it's the easiest path for CrewAI! 🚀
