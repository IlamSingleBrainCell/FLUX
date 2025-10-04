# 🚂 Railway Deployment - Quick Start

## Why Railway for CrewAI Backend?

✅ **Full Python environment** (no serverless limits)  
✅ **Persistent WebSocket connections** (real-time)  
✅ **No cold starts** (always warm)  
✅ **No execution time limits** (perfect for CrewAI)  
✅ **Easy deployment** (git push to deploy)  
✅ **Only $5/month** (hobby plan)

---

## 🚀 5-Minute Setup

### Step 1: Install Railway CLI

```powershell
npm install -g @railway/cli
```

### Step 2: Login

```powershell
railway login
```

### Step 3: Initialize Project

```powershell
cd C:\YOKA\FLUX\backend
railway init
```

**Select:**
- Create new project
- Name: `flux-crewai-backend`

### Step 4: Add Environment Variables

```powershell
railway variables set GROQ_API_KEY=your_groq_api_key_here
```

### Step 5: Deploy!

```powershell
railway up
```

That's it! ✨

---

## 📋 Railway Configuration

Create `railway.toml` in backend directory:

```toml
[build]
builder = "NIXPACKS"
buildCommand = "pip install -r requirements_crewai.txt"

[deploy]
startCommand = "python main_crewai.py"
restartPolicyType = "ON_FAILURE"
restartPolicyMaxRetries = 10
healthcheckPath = "/health"
healthcheckTimeout = 300

[env]
PYTHON_VERSION = "3.11"
```

---

## 🔗 Connect Frontend to Railway

### Step 1: Get Railway URL

After deployment, Railway gives you a URL like:
```
https://flux-backend-production.up.railway.app
```

### Step 2: Update Frontend

Create `frontend/.env.production`:

```bash
NEXT_PUBLIC_WEBSOCKET_URL=wss://flux-backend-production.up.railway.app
NEXT_PUBLIC_API_URL=https://flux-backend-production.up.railway.app
```

### Step 3: Update WebSocket Connection

Edit `frontend/pages/workspace.tsx` (or wherever WebSocket connects):

```typescript
const WS_URL = process.env.NEXT_PUBLIC_WEBSOCKET_URL || 'ws://localhost:8000';

// Connect
const ws = new WebSocket(`${WS_URL}/ws/${clientId}`);
```

---

## 🎯 Complete Deployment Flow

### 1. Deploy Backend to Railway:

```powershell
cd C:\YOKA\FLUX\backend
railway up
```

**Output:**
```
✓ Building...
✓ Deploying...
✓ Success! https://flux-backend-production.up.railway.app
```

### 2. Deploy Frontend to Vercel:

```powershell
cd C:\YOKA\FLUX\frontend

# Set environment variable
vercel env add NEXT_PUBLIC_WEBSOCKET_URL production
# Paste: wss://flux-backend-production.up.railway.app

# Deploy
vercel --prod
```

### 3. Test It:

Visit: `https://your-flux-app.vercel.app`

Try: `"Hi Messi, analyze requirements for a chat app"`

---

## 💰 Pricing

### Free Tier ($0):
- $5 credit/month
- Good for testing
- ~20 hours/month runtime

### Hobby Plan ($5/month):
- **Recommended for production**
- Unlimited hours
- Better performance
- Custom domains

### Pro Plan ($20/month):
- Priority support
- Higher resources
- Team features

---

## 🔧 Advanced Configuration

### Auto-Deploy from GitHub:

1. **Connect Repository:**
```powershell
railway link
```

2. **Enable Auto-Deploy:**
   - Railway Dashboard → Settings
   - Connect GitHub repo
   - Select branch: `main`
   - Enable "Auto-deploy"

Now every `git push` auto-deploys! 🚀

### Custom Domain:

1. Railway Dashboard → Settings → Domains
2. Add custom domain: `api.yourapp.com`
3. Update DNS (Railway provides instructions)
4. Update frontend `.env.production`

### Monitoring:

Railway provides:
- ✅ Real-time logs
- ✅ CPU/Memory metrics
- ✅ Deployment history
- ✅ Health checks

---

## 🐛 Troubleshooting

### Build Fails:

**Check logs:**
```powershell
railway logs
```

**Common issues:**
- Missing dependencies → Update `requirements_crewai.txt`
- Python version → Set in `railway.toml`
- Build timeout → Reduce dependencies

### App Crashes:

**Check runtime logs:**
```powershell
railway logs --tail
```

**Common fixes:**
- Missing env vars → `railway variables set KEY=value`
- Port binding → Railway auto-assigns PORT
- Memory limit → Upgrade plan

### Connection Issues:

**Test WebSocket:**
```bash
wscat -c wss://your-app.railway.app/ws/test
```

**Frontend can't connect:**
- Check CORS in `main_crewai.py`
- Verify WebSocket URL in `.env.production`
- Check Railway logs for errors

---

## 📊 Monitoring & Logs

### View Logs:

```powershell
# Real-time logs
railway logs --tail

# Last 100 lines
railway logs

# Filter by service
railway logs --service backend
```

### Metrics:

Railway Dashboard shows:
- CPU usage
- Memory usage
- Network traffic
- Request count

---

## 🎯 Production Checklist

- [ ] Environment variables set (GROQ_API_KEY)
- [ ] Custom domain configured (optional)
- [ ] Auto-deploy from GitHub enabled
- [ ] Health check endpoint working (`/health`)
- [ ] Frontend connected to Railway URL
- [ ] Test all agent types (single, team, smart)
- [ ] Monitor logs for errors
- [ ] Set up alerting (Railway Pro)

---

## 🔒 Security Best Practices

### 1. Environment Variables:

```powershell
# Never commit .env files
# Always use Railway variables

railway variables set GROQ_API_KEY=xxx
railway variables set SECRET_KEY=xxx
```

### 2. CORS Configuration:

In `main_crewai.py`:
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://your-frontend.vercel.app",
        "http://localhost:3002"  # Development
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### 3. Rate Limiting:

```python
from slowapi import Limiter
from slowapi.util import get_remote_address

limiter = Limiter(key_func=get_remote_address)

@app.post("/api/chat")
@limiter.limit("10/minute")
async def chat():
    # ...
```

---

## 🚀 Deploy Now!

```powershell
# One-line deploy
cd C:\YOKA\FLUX\backend && railway up
```

**That's it!** Your CrewAI backend is live! 🎉

---

## 📚 Resources

- **Railway Docs:** https://docs.railway.app
- **Railway CLI:** https://docs.railway.app/develop/cli
- **Pricing:** https://railway.app/pricing
- **Support:** https://railway.app/help

---

**Next:** Deploy frontend to Vercel and connect them! 
See: `VERCEL_CREWAI_DEPLOYMENT.md`
