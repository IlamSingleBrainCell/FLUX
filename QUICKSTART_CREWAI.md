# 🚀 Quick Start - FLUX CrewAI Integration

## ⚡ 3-Step Setup

### 1️⃣ Install Dependencies (2 minutes)
```bash
cd backend
pip install -r requirements_crewai.txt
```

### 2️⃣ Start CrewAI Backend (1 minute)
```bash
python main_crewai.py
```

Wait for:
```
✅ CrewAI agents initialized
✅ WebSocket handler ready
✅ All systems operational
```

### 3️⃣ Start Frontend (30 seconds)
```bash
cd frontend
npm run dev
```

Visit: **http://localhost:3002**

---

## 🧪 Test It Now!

### Try These Commands:

1. **"Hi Messi, analyze requirements for a chat app"**
   - Watch Messi use the `estimate_tasks` tool
   - Get real story point estimates

2. **"Hey everyone, design a secure authentication system"**
   - See ALL agents collaborate
   - Modric coordinates the team
   - Each agent contributes their expertise

3. **"How do I implement JWT in Python?"**
   - CrewAI automatically routes to Neymar + Ramos
   - No need to specify agents!

---

## 🎯 What's Different?

| Action | Old System | CrewAI System |
|--------|-----------|---------------|
| "Hi Messi" | Keyword match → Response | ✅ Task created → Tool used → Smart response |
| "Everyone, help" | Parallel responses | ✅ Hierarchical coordination by Modric |
| Complex query | Random agent | ✅ AI analyzes → Routes to best agents |

---

## 📊 See the Magic

Open browser console (F12) and watch:

```
[CrewAI] 🧠 Smart routing message...
[CrewAI] 🎯 Routed to: ['neymar', 'ramos']
[CrewAI] 🚀 Executing crew with 2 agents
[CrewAI] ✅ Team collaboration complete
```

**That's REAL orchestration!** 🎉

---

## 🔥 Rollback (if needed)

```bash
# Stop main_crewai.py (Ctrl+C)
# Start old backend:
python main_minimal.py
```

Your UI still works! Zero changes needed.

---

## 💡 Next Steps

1. ✅ Test all 7 agents
2. ✅ Try complex multi-agent tasks
3. ✅ Check `CREWAI_INTEGRATION_GUIDE.md` for advanced features
4. ✅ Add custom tools (web search, etc.)

---

**You're now running real autonomous agents!** 🚀

Questions? Check the full guide: `CREWAI_INTEGRATION_GUIDE.md`
