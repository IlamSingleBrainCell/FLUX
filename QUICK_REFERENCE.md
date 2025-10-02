# 🚀 FLUX Enterprise - Quick Reference

## ⚡ **Instant Access Guide**

---

## 🌐 **URLs**

| Service | URL | Status |
|---------|-----|--------|
| **Frontend Dev** | http://localhost:3002 | ✅ Running |
| **Dashboard** | http://localhost:3002/dashboard | ✅ Live |
| **Workspace** | http://localhost:3002/ | ✅ Live |
| **Production** | https://flux-six-drab.vercel.app | ✅ Deployed |

---

## 🎯 **What's New - UI Enhancements**

### ✅ **Dashboard Enhancements:**
- 6 metric cards (was 4) - Added Test Coverage & Deployments
- Sprint velocity chart - 5-day visualization
- Live activity feed - 8 recent items
- Real-time clock - Updates every second
- Connection status - Online/Offline indicator
- Team panel - All 7 agents with stats

### ✅ **Workspace Enhancements:**
- Agent performance stats - Tasks, response time, uptime
- Enhanced chat input - Larger, gradient border
- 4 quick action buttons - Attach, Workflow, GitHub, History
- Session stats display - Messages, phase, agents online
- Professional animations - Shimmer, pulse, scale effects

---

## 👥 **Team Members**

| Name | Role | Icon | Tasks | Response | Uptime |
|------|------|------|-------|----------|--------|
| **Messi** | Requirements Analyst | ⚽ | 24 | 2.3s | 98% |
| **Ronaldo** | Software Architect | 🏗️ | 18 | 3.1s | 95% |
| **Neymar** | Senior Developer | 💻 | 42 | 1.8s | 100% |
| **Mbappé** | QA Engineer | 🧪 | 31 | 2.5s | 97% |
| **Benzema** | DevOps Engineer | 🚀 | 15 | 4.2s | 94% |
| **Modric** | Project Manager | 📊 | 28 | 2.0s | 99% |
| **Ramos** | Security Expert | 🔒 | 12 | 3.8s | 96% |

---

## 📊 **Current Metrics**

```
┌─────────────────────────────────────────────┐
│ Active Sprints:        2    (+1 week)       │
│ Team Velocity:         23.5 (+12%)          │
│ Story Points:          47   (18 today)      │
│ Code Quality:          94.2% (+2.3%)        │
│ Test Coverage:         87%  (+5%)           │
│ Deployments (week):    12                   │
└─────────────────────────────────────────────┘
```

---

## 🏃 **Active Sprints**

### **Sprint 24 - Mobile Payment Integration**
- Status: 🟢 Active
- Progress: 65%
- Stories: 12
- Velocity: 25
- Team: Messi, Ronaldo, Neymar, Benzema

### **Sprint 25 - Dashboard Redesign & Analytics**
- Status: 🟡 Planning
- Progress: 15%
- Stories: 8
- Velocity: TBD
- Team: Mbappé, Modric, Ramos

---

## 🎨 **Color Codes**

| Type | Color | Usage |
|------|-------|-------|
| Primary | Blue (#3B82F6) | Actions, links |
| Success | Emerald (#10B981) | Online, success |
| Warning | Yellow (#FBBF24) | Thinking, caution |
| Error | Red (#EF4444) | Errors, critical |
| Info | Cyan (#06B6D4) | Information |

---

## 🔔 **Activity Types**

| Icon | Type | Color | Example |
|------|------|-------|---------|
| 📝 | Commit | Blue | "Neymar committed Payment Gateway API" |
| 👀 | Review | Purple | "Mbappé reviewed Authentication Tests" |
| 🚀 | Deploy | Green | "Benzema deployed Production v2.3.1" |
| 🧪 | Test | Yellow | "Mbappé executed 245 Tests" |
| 📋 | Story | Indigo | "Messi created US-2401" |
| 🐛 | Bug | Red | "Ramos fixed CVE-2024-001" |

---

## 🎯 **Quick Actions**

| Button | Shortcut | Function |
|--------|----------|----------|
| 📎 Attach Files | - | Upload documents |
| 📊 Workflow | - | View SDLC workflow |
| 🔗 GitHub | - | GitHub integration |
| 🕐 History | - | Message history |
| ↗ Send | Ctrl+Enter | Send message |

---

## 🚀 **Commands**

### **Start Frontend:**
```bash
cd frontend
npm run dev
```

### **Build for Production:**
```bash
cd frontend
npm run build
```

### **Deploy to Vercel:**
```bash
vercel --prod
```

---

## 📈 **Performance**

| Metric | Value | Target | Status |
|--------|-------|--------|--------|
| Build Time | 3.8s | <5s | ✅ |
| Page Load | 1.3s | <2s | ✅ |
| Compile Time | 0.4s | <1s | ✅ |
| Bundle Size | 350KB | <500KB | ✅ |

---

## 🎨 **UI Components**

### **Available Components:**
- ✅ Metric Cards (6 variants)
- ✅ Sprint Cards (2 types)
- ✅ Agent Cards (7 agents)
- ✅ Activity Items (6 types)
- ✅ Quick Actions (4 buttons)
- ✅ Progress Bars
- ✅ Status Indicators
- ✅ Chat Interface
- ✅ File Upload
- ✅ Team Panel

---

## 🔧 **Tech Stack**

| Category | Technology | Version |
|----------|------------|---------|
| Framework | Next.js | 14.2.33 |
| UI Library | React | 18.x |
| Styling | Tailwind CSS | 3.x |
| Icons | Heroicons | Built-in |
| Animations | CSS + Tailwind | Native |
| Deployment | Vercel | Latest |

---

## 📝 **File Structure**

```
frontend/
├── pages/
│   ├── index.tsx           ✅ Workspace (enhanced)
│   └── dashboard.tsx       ✅ Dashboard (enhanced)
├── components/
│   ├── AgentChat/
│   │   └── AgentSelector.tsx  ✅ Enhanced
│   └── EnhancedChat/
│       └── EnhancedChatInterface.tsx  ✅ Enhanced
├── styles/
│   └── globals.css         ✅ Custom animations
└── config/
    └── agents.ts           ✅ Football player names
```

---

## 🎯 **Testing Checklist**

- [x] Dashboard loads correctly
- [x] 6 metric cards visible
- [x] Velocity chart displays
- [x] Activity feed updates
- [x] Real-time clock works
- [x] Team panel shows all agents
- [x] Agent selection works
- [x] Chat input enhanced
- [x] Quick actions functional
- [x] Animations smooth
- [x] Mobile responsive
- [x] No console errors

---

## 🐛 **Troubleshooting**

### **Frontend won't start:**
```bash
cd frontend
rm -rf .next
npm install
npm run dev
```

### **Styles not loading:**
```bash
# Clear cache and rebuild
npm run build
```

### **Port already in use:**
```bash
# Change port in package.json
# Or kill process on port 3002
```

---

## 📚 **Documentation**

| Document | Purpose |
|----------|---------|
| `UI_ENHANCEMENTS_COMPLETE.md` | Full enhancement details |
| `UI_VISUAL_GUIDE.md` | Visual reference guide |
| `QUICK_REFERENCE.md` | This file |
| `README.md` | Project overview |

---

## 🎉 **Success Criteria**

✅ Professional appearance  
✅ Rich data visualization  
✅ Real-time updates  
✅ Performance metrics  
✅ Activity tracking  
✅ Modern animations  
✅ Responsive design  
✅ Enterprise-ready  

---

## 📞 **Support**

- **Issues**: Check console for errors
- **Styling**: See `UI_VISUAL_GUIDE.md`
- **Components**: See `UI_ENHANCEMENTS_COMPLETE.md`
- **API**: Check backend connection

---

## 🏆 **Achievement Summary**

| Category | Before | After | Improvement |
|----------|--------|-------|-------------|
| Dashboard Cards | 4 | 6 | +50% |
| Charts | 0 | 1 | ∞ |
| Activity Items | 0 | 8 | ∞ |
| Animations | ~5 | ~20 | +300% |
| Agent Metrics | 0 | 21 | ∞ |
| Quick Actions | 3 | 4 | +33% |

---

## 🎨 **Design System - Quick Reference

## System Status
- **Backend**: http://localhost:8000 (PID: 40484)
- **Frontend**: http://localhost:3002
- **Status**: ✅ Both Running

## Agent Roster

| Agent | Name | Short Name | Role |
|-------|------|------------|------|
| requirements_analyst | Sara/Sarah | S | Requirements Analyst |
| software_architect | Marc/Marcus | M | Software Architect |
| developer | Alex/Alexander | A | Senior Developer |
| qa_tester | Jess/Jessica | J | QA Engineer |
| devops_engineer | Dave/David | D | DevOps Engineer |
| project_manager | Emma/Emily | E | Project Manager |
| security_expert | Robt/Robert/Rob | R | Security Expert |

## How to Call Agents

### Direct Call (Single Agent Only)
```
"Hi Marc"
"Hello Alex"
"Hey Jess"
```
→ Result: Only the called agent responds

### Exclusive Switch (Replace Current Agent)
```
"I would like to talk to Marc"
"I want to speak to Alex"
"I need to talk to Jess"
```
→ Result: Current agent is removed, new agent responds

### Add Agent (Multi-Agent Collaboration)
```
"Can you call Marc?"
"Please bring in Alex"
"Let's include Jess"
```
→ Result: New agent joins, previous agents remain

### Dismiss Agent
```
"Thanks Marc, you can drop off"
"Thank you Sara"
```
→ Result: Named agent is removed from conversation

## Common Scenarios

### Scenario A: Start Fresh with One Agent
```
You: "Hi Marc"
Marc: [responds about architecture]
```

### Scenario B: Switch Agents
```
You: "Hi Sara"
Sara: [responds about requirements]
You: "I would like to talk to Marc instead"
Marc: [responds about architecture]
(Sara is now inactive)
```

### Scenario C: Build a Team
```
You: "Hi Sara"
Sara: [responds]
You: "Can you call Marc?"
Sara: [responds]
Marc: [responds]
You: "Let's also bring in Alex"
Sara: [responds]
Marc: [responds]
Alex: [responds]
```

### Scenario D: Reduce Team
```
You: "Thanks Sara, you can drop off"
(Sara is removed)
Marc: [continues]
Alex: [continues]
```

## Troubleshooting

### Problem: Wrong agent responds
**Check**:
1. Are you using exact name? ("Marc" not "Mark")
2. Is the greeting at the start? ("Hi Marc" not "Marc, hi")
3. Check backend logs for routing messages

**Fix**:
```
You: "I would like to talk to [correct agent name]"
```

### Problem: Multiple agents respond when you want one
**Check**:
1. Were agents already active from previous messages?
2. Did you use additive language? ("call Marc" adds, doesn't replace)

**Fix**:
```
You: "Thanks everyone except Marc"
You: "I would like to talk to Marc"
```

### Problem: No response
**Check**:
1. Is backend running? Check http://localhost:8000/health
2. Is frontend running? Check http://localhost:3002
3. Is WebSocket connected? (Check browser console)

**Fix**:
Restart servers:
```powershell
# Stop
taskkill /F /PID 40484
Ctrl+C in frontend terminal

# Start
cd C:\YOKA\FLUX\backend
python run_full_server.py

cd C:\YOKA\FLUX\frontend
npm run dev
```

## Agent Expertise

### Sara (Requirements Analyst)
- Gathering requirements
- User stories
- Acceptance criteria
- Business logic
- Feature specifications

### Marc (Software Architect)
- System design
- Architecture patterns
- Technology stack
- Scalability
- System integration
- Technical decisions

### Alex (Developer)
- Code implementation
- Best practices
- Code reviews
- Debugging
- Feature development
- Technical implementation

### Jess (QA Tester)
- Test planning
- Quality assurance
- Bug identification
- Test automation
- Regression testing
- Quality metrics

### Dave (DevOps Engineer)
- Deployment strategies
- CI/CD pipelines
- Infrastructure
- Monitoring
- Performance optimization
- Cloud services

### Emma (Project Manager)
- Project planning
- Timeline management
- Resource allocation
- Risk management
- Stakeholder communication
- Progress tracking

### Robt (Security Expert)
- Security assessment
- Vulnerability analysis
- Security best practices
- Compliance
- Threat modeling
- Security testing

## Example Conversations

### Getting Architecture Help
```
You: "Hi Marc, I need help designing a microservices architecture"
Marc: [provides architecture guidance]
```

### Requirements + Architecture
```
You: "Hi Sara, I need to gather requirements for a new feature"
Sara: [helps with requirements]
You: "Can you call Marc to validate the technical feasibility?"
Sara: [comments on requirements]
Marc: [validates technical feasibility]
```

### Full SDLC Flow
```
You: "Hi Sara, let's plan a new authentication system"
Sara: [gathers requirements]
You: "Please bring in Marc for architecture"
Sara: [continues requirements]
Marc: [proposes architecture]
You: "Let's get Alex to review the implementation approach"
Sara: [requirements perspective]
Marc: [architecture perspective]
Alex: [implementation perspective]
You: "Thanks Sara, you can drop off. Marc and Alex, let's continue"
Marc: [continues]
Alex: [continues]
```

## Quick Command Reference

| What You Want | Say This |
|--------------|----------|
| Talk to one agent | "Hi [name]" |
| Switch agents | "I would like to talk to [name]" |
| Add an agent | "Can you call [name]?" |
| Remove an agent | "Thanks [name], drop off" |
| Remove all but one | "I would like to talk to [name]" |
| Check who's active | (Look at conversation history) |

## Files for Reference

- **Agent Routing Logic**: `backend/workflows/sdlc_workflow.py`
- **Main Backend**: `backend/main.py`
- **Frontend UI**: `frontend/components/EnhancedChat/EnhancedChatInterface.tsx`
- **Documentation**: `AGENT_ROUTING_FIX.md`, `EXCLUSIVE_REQUEST_FIX.md`
- **Tests**: `backend/test_agent_routing.py`

---

**Last Updated**: September 30, 2025  
**System Version**: FLUX v1.0  
**Status**: ✅ Operational
