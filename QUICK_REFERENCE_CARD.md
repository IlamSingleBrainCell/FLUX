# 🚀 FLUX - Quick Reference Card

## 📱 **Page Navigation**

| Page | URL | Purpose | Key Features |
|------|-----|---------|--------------|
| **Dashboard** | `/dashboard` | Command Center | Metrics, Tools, Sprints, Activity Feed |
| **Projects** | `/projects` | Epic/Story Management | JIRA-like, Kanban Board, Task Tracking |
| **AI Workspace** | `/workspace` | Agent Collaboration | Chat with 7 AI agents |

---

## 🤖 **AI Agents**

| Agent | Role | Icon | Use When... |
|-------|------|------|-------------|
| **Messi** | Requirements Analyst | 🏆 | Defining features, user stories |
| **Ronaldo** | Software Architect | ⚡ | Designing systems, architecture |
| **Neymar** | Developer | 🎯 | Writing code, implementing features |
| **Mbappé** | QA Tester | 🧪 | Testing, quality assurance |
| **Benzema** | DevOps Engineer | 🚀 | Deployment, CI/CD, infrastructure |
| **Modric** | Project Manager | 📊 | Planning, coordination, reporting |
| **Ramos** | Security Expert | 🛡️ | Security audits, vulnerability fixes |

---

## 🔗 **Integrated Tools**

| Tool | Type | Metrics Tracked |
|------|------|-----------------|
| 🔵 **JIRA** | Project Management | Epics, Stories, Bugs, Velocity |
| ⚫ **GitHub** | Version Control | Commits, PRs, Branches, Reviews |
| 🔴 **Jenkins** | CI/CD | Builds, Success Rate, Duration |
| 🐳 **Docker** | Containers | Images, Tags, Size, Pulls |
| ☸️ **Kubernetes** | Orchestration | Pods, Services, CPU, Memory |
| 📊 **SonarQube** | Code Quality | Quality Gate, Bugs, Coverage |
| 📈 **Grafana** | Monitoring | Dashboards, Alerts, Uptime |
| 💬 **Slack** | Communication | Channels, Messages, Users |

---

## 📋 **Epic/Story Workflow**

```
1. Create Epic (Critical/High/Medium/Low)
   ↓
2. Break into Stories (with story points)
   ↓
3. Add Tasks to Stories
   ↓
4. Assign to Agents
   ↓
5. Track Status:
   Planning → In Progress → Code Review → Testing → Done
```

---

## ⚡ **Quick Actions**

### From Dashboard:
- Click **"Projects"** → Manage Epics/Stories
- Click **"AI Workspace"** → Chat with agents
- Click **JIRA card** → Jump to project management
- Click any **tool card** → View detailed metrics

### From Projects:
- **List View** → See detailed epic breakdown
- **Kanban View** → Drag-and-drop board
- Click **epic card** → Open detail modal
- **"Create Epic"** → Add new epic

### From AI Workspace:
- **Select agent** → Start conversation
- **Type request** → Get AI assistance
- **Example prompts** → Quick start templates

---

## 🎯 **Common Prompts**

### For Messi (Requirements):
- "Write user stories for authentication system"
- "What requirements are needed for payment gateway?"
- "Break down this feature into tasks"

### For Ronaldo (Architecture):
- "Design microservices for e-commerce platform"
- "Recommend database schema for user management"
- "Create API contract for inventory service"

### For Neymar (Development):
- "Implement REST API for user registration"
- "Write React component for dashboard"
- "Refactor this code to improve performance"

### For Mbappé (Testing):
- "Generate unit tests for authentication module"
- "Create integration tests for payment flow"
- "Review test coverage and suggest improvements"

### For Benzema (DevOps):
- "Set up CI/CD pipeline for Next.js app"
- "Create Kubernetes deployment manifests"
- "Configure Docker multi-stage build"

### For Modric (Project Management):
- "Create sprint plan for next 2 weeks"
- "Generate velocity report for last 3 sprints"
- "Estimate timeline for microservices migration"

### For Ramos (Security):
- "Audit code for security vulnerabilities"
- "Review authentication implementation"
- "Suggest security best practices for API"

---

## 📊 **Key Metrics**

### Dashboard Metrics:
- **Active Sprints**: Current number of active sprints
- **Team Velocity**: Story points per sprint
- **Story Points**: Total points in current sprint
- **Code Quality**: Overall quality score
- **Test Coverage**: Percentage of code covered by tests
- **Deployments**: Number of deployments this week

### Project Metrics:
- **Total Epics**: All epics in the system
- **Active Stories**: Stories currently in progress
- **In Progress**: Items being worked on
- **Overall Progress**: Completion percentage

---

## 🎨 **Status Color Guide**

### Priority:
- 🔴 **Red** = Critical
- 🟠 **Orange** = High
- 🟡 **Yellow** = Medium
- 🔵 **Blue** = Low

### Status:
- ⚪ **Slate** = Planning / Todo
- 🔵 **Blue** = In Progress
- 🟣 **Purple** = Code Review
- 🟡 **Yellow** = Testing
- 🟢 **Green** = Done

### Connection:
- 🟢 **Green Pulse** = Connected
- 🔴 **Red** = Disconnected
- 🟡 **Yellow** = Warning

---

## ⌨️ **Keyboard Shortcuts** (Planned)

| Shortcut | Action |
|----------|--------|
| `Ctrl + K` | Open AI Workspace |
| `Ctrl + P` | Go to Projects |
| `Ctrl + D` | Go to Dashboard |
| `Ctrl + N` | Create New Epic |
| `Ctrl + /` | Search |
| `Esc` | Close Modal |

---

## 🔧 **Troubleshooting**

### Tools showing "Disconnected":
- Check internet connection
- Verify API keys in environment variables
- Check tool-specific configuration

### AI Agents not responding:
- Check Groq API key (backend/.env)
- Verify backend server is running (port 8000)
- Check browser console for errors

### Projects page empty:
- Sample data is hardcoded (see projects.tsx)
- To add real data, integrate with JIRA API
- Use "Create Epic" button (when implemented)

### Real-time updates not working:
- Check `/api/tools-status` endpoint
- Verify 30-second refresh interval
- Clear browser cache and reload

---

## 📦 **Environment Setup**

### Required:
```bash
# Frontend (port 3002)
cd frontend
npm install
npm run dev

# Backend (port 8000)
cd backend
pip install -r requirements.txt
python main.py
```

### Environment Variables:
```
# backend/.env
GROQ_API_KEY=your_groq_api_key
GITHUB_TOKEN=your_github_token (optional)
JIRA_API_TOKEN=your_jira_token (optional)
```

---

## 🎓 **Learning Path**

### Day 1: Explore
1. Open Dashboard
2. Click through all tool cards
3. View sprint cards and activity feed

### Day 2: Projects
1. Go to Projects page
2. Review sample epics
3. Click epic cards to see details
4. Toggle between List/Kanban views

### Day 3: AI Agents
1. Open AI Workspace
2. Try each agent
3. Use example prompts
4. Experiment with custom requests

### Day 4: Integration
1. Set up GitHub token
2. Configure JIRA connection
3. Test real-time tool updates
4. Monitor live metrics

### Day 5: Advanced
1. Create custom epics
2. Set up sprint planning
3. Configure CI/CD pipelines
4. Customize dashboard metrics

---

## 📞 **Support**

### Documentation:
- 📖 Complete Guide: `SDLC_PLATFORM_GUIDE.md`
- 🎯 This Quick Reference: `QUICK_REFERENCE_CARD.md`

### Links:
- 🌐 Live Demo: https://flux-six-drab.vercel.app
- 📂 GitHub: https://github.com/IlamSingleBrainCell/FLUX
- 🐛 Report Issues: GitHub Issues tab

---

## ✨ **Pro Tips**

1. **Use specific prompts**: Instead of "help me code", say "implement JWT authentication with refresh tokens"

2. **Leverage agent specialization**: Match tasks to agent expertise for best results

3. **Monitor tools dashboard**: Check tool status before starting work

4. **Use Kanban for sprints**: Visual boards help track progress better

5. **Set realistic story points**: Use Fibonacci sequence (1, 2, 3, 5, 8, 13...)

6. **Review velocity regularly**: Track team performance trends

7. **Automate where possible**: Let agents handle repetitive tasks

8. **Keep epics focused**: One epic = one major feature/initiative

---

*Print this card and keep it handy for quick reference!*

**FLUX - Your Complete SDLC Platform** 🚀
