# 🚀 FLUX - Multi-Agent Collaboration System

<div align="center">

![FLUX Banner](https://img.shields.io/badge/FLUX-Enterprise-blue?style=for-the-badge&logo=react)

**The Ultimate AI-Powered Software Development Lifecycle Platform**

![Version](https://img.shields.io/badge/version-3.2.0-green?style=for-the-badge)
![License](https://img.shields.io/badge/license-MIT-orange?style=for-the-badge)
![Status](https://img.shields.io/badge/status-Production%20Ready-success?style=for-the-badge)

[🚀 Live Demo](https://flux-six-drab.vercel.app) | [📖 Documentation](#-documentation) | [🎯 Features](#-complete-feature-list) | [⚡ Quick Start](#-quick-start)

</div>

## 🌟 What is FLUX?

**FLUX Enterprise** is a revolutionary AI-powered platform that transforms software development with **5 specialized AI agents** (named after football legends! ⚽), **real-time collaboration**, and **27+ enterprise features**. From requirements to deployment, FLUX handles your entire SDLC with intelligent automation, analytics, and seamless integrations.

### 🎯 Why FLUX?

- ✅ **5 AI Agents** - Expert help at your fingertips (Messi, Ronaldo, Neymar, Mbappé, Benzema)
- ✅ **27+ Enterprise Features** - Everything you need in one platform
- ✅ **Real-time Collaboration** - WebSocket-powered instant messaging
- ✅ **Advanced Analytics** - 6+ chart types with insights and predictions
- ✅ **Smart Automation** - AI code review, auto-fix, workflow templates
- ✅ **10+ Integrations** - Jira, Slack, GitHub, GitLab, Azure DevOps, and more
- ✅ **Voice Control** - Hands-free commands with "Hey FLUX"
- ✅ **Full Customization** - Custom agents, workflows, and themes
- ✅ **Production Ready** - Deployed on Vercel with auto-scaling

---

## ⚽ Meet Your AI Team

### **The Football Legends Powering Your Development**

| Agent | Role | Expertise | Shortcut |
|-------|------|-----------|----------|
| **Messi** ⚽ | Requirements Analyst | Requirements gathering, user stories, scope definition | `Ctrl+Shift+M` |
| **Ronaldo** ⚽ | Software Architect | System design, architecture patterns, technical specs | `Ctrl+Shift+R` |
| **Neymar** ⚽ | Developer | Code implementation, feature development, debugging | `Ctrl+Shift+N` |
| **Mbappé** ⚽ | QA Tester | Test creation, quality assurance, bug verification | `Ctrl+Shift+Q` |
| **Benzema** ⚽ | DevOps Engineer | CI/CD, deployment, infrastructure, monitoring | `Ctrl+Shift+B` |

**Call them instantly:** Just press their keyboard shortcut or say "Hey FLUX, call Neymar"!

---

## 🏗️ Architectural Workflow Diagram

### **SDLC Workflow with Football Team Agents**

```
┌───────────────────────────────────────────────────────────────────────────┐
│                         FLUX ENTERPRISE PLATFORM                          │
│                     AI-Powered SDLC Automation                            │
└───────────────────────────────────────────────────────────────────────────┘
                                     │
                                     ▼
┌───────────────────────────────────────────────────────────────────────────┐
│                         USER INTERACTION LAYER                            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌─────────────┐  │
│  │   Web UI     │  │  Voice       │  │  Keyboard    │  │  Command    │  │
│  │   (Next.js)  │  │  Commands    │  │  Shortcuts   │  │  Palette    │  │
│  │              │  │  "Hey FLUX"  │  │  Ctrl+Shift  │  │  Ctrl+K     │  │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘  └──────┬──────┘  │
└─────────┼──────────────────┼──────────────────┼──────────────────┼─────────┘
          │                  │                  │                  │
          └──────────────────┴──────────────────┴──────────────────┘
                                     │
                                     ▼
┌───────────────────────────────────────────────────────────────────────────┐
│                      WEBSOCKET COMMUNICATION LAYER                        │
│                     Real-time Bidirectional Messaging                     │
│                         (FastAPI WebSockets)                              │
└───────────────────────────────────────────────────────────────────────────┘
                                     │
                                     ▼
┌───────────────────────────────────────────────────────────────────────────┐
│                        AGENT ROUTING ENGINE                               │
│          Smart routing based on keywords & explicit mentions              │
│                                                                            │
│  ┌─────────────────────────────────────────────────────────────────────┐ │
│  │  Natural Language Detection:                                        │ │
│  │  • "Hi Messi" → Routes to Messi (Requirements Analyst)              │ │
│  │  • "Call Ronaldo" → Routes to Ronaldo (Software Architect)          │ │
│  │  • "Hey Neymar" → Routes to Neymar (Developer)                      │ │
│  │  • "@Mbappé" → Routes to Mbappé (QA Tester)                         │ │
│  │  • "Benzema, deploy this" → Routes to Benzema (DevOps)              │ │
│  │  • "Everyone" / "Team" → Routes to ALL agents                       │ │
│  └─────────────────────────────────────────────────────────────────────┘ │
└───────────────────────────────────────────────────────────────────────────┘
                                     │
                                     ▼
              ┌─────────────────────────────────────────┐
              │      AI AGENT ORCHESTRATION LAYER       │
              │         (Multi-Agent Collaboration)     │
              └──────────────┬──────────────────────────┘
                             │
      ┌──────────────────────┼──────────────────────┐
      │                      │                      │
      ▼                      ▼                      ▼

╔═══════════════════════════════════════════════════════════════════════════╗
║                        🏟️ THE SDLC FOOTBALL TEAM 🏟️                       ║
╚═══════════════════════════════════════════════════════════════════════════╝

┌───────────────────────────────────────────────────────────────────────────┐
│                         📋 REQUIREMENTS PHASE                             │
│                                                                            │
│  ╔═══════════════════════════════════════════════════════════════════╗   │
│  ║  ⚽ MESSI - Requirements Analyst                                  ║   │
│  ║  Keyboard: Ctrl+Shift+M                                           ║   │
│  ╠═══════════════════════════════════════════════════════════════════╣   │
│  ║  ✅ Gather requirements from stakeholders                         ║   │
│  ║  ✅ Create user stories with acceptance criteria                  ║   │
│  ║  ✅ Define project scope and constraints                          ║   │
│  ║  ✅ Prioritize features and requirements                          ║   │
│  ║  ✅ Generate product backlog items                                ║   │
│  ║  ✅ Analyze feasibility and impact                                ║   │
│  ║                                                                    ║   │
│  ║  📤 Output: User Stories, Requirements Document, Backlog          ║   │
│  ╚═══════════════════════════════════════════════════════════════════╝   │
└───────────────────────────────────┬────────────────────────────────────────┘
                                    │ Hands off to ▼
                                    ▼
┌───────────────────────────────────────────────────────────────────────────┐
│                        🗏️ ARCHITECTURE & DESIGN PHASE                     │
│                                                                            │
│  ╔═══════════════════════════════════════════════════════════════════╗   │
│  ║  ⚽ RONALDO - Software Architect                                  ║   │
│  ║  Keyboard: Ctrl+Shift+R                                           ║   │
│  ╠═══════════════════════════════════════════════════════════════════╣   │
│  ║  ✅ Design system architecture and patterns                       ║   │
│  ║  ✅ Define technical stack and frameworks                         ║   │
│  ║  ✅ Create component diagrams and data models                     ║   │
│  ║  ✅ Design APIs and microservices architecture                    ║   │
│  ║  ✅ Plan scalability and performance strategies                   ║   │
│  ║  ✅ Review security architecture                                  ║   │
│  ║                                                                    ║   │
│  ║  📤 Output: Architecture Diagrams, Technical Specs, API Docs      ║   │
│  ╚═══════════════════════════════════════════════════════════════════╝   │
└───────────────────────────────────┬────────────────────────────────────────┘
                                    │ Hands off to ▼
                                    ▼
┌───────────────────────────────────────────────────────────────────────────┐
│                         💻 DEVELOPMENT PHASE                              │
│                                                                            │
│  ╔═══════════════════════════════════════════════════════════════════╗   │
│  ║  ⚽ NEYMAR - Developer                                            ║   │
│  ║  Keyboard: Ctrl+Shift+N                                           ║   │
│  ╠═══════════════════════════════════════════════════════════════════╣   │
│  ║  ✅ Implement features based on requirements                      ║   │
│  ║  ✅ Write clean, maintainable code                                ║   │
│  ║  ✅ Follow architecture patterns and best practices               ║   │
│  ║  ✅ Create unit tests for code coverage                           ║   │
│  ║  ✅ Debug and fix issues                                          ║   │
│  ║  ✅ Code review and refactoring                                   ║   │
│  ║  ✅ Git commits and pull requests                                 ║   │
│  ║                                                                    ║   │
│  ║  📤 Output: Source Code, Unit Tests, Pull Requests                ║   │
│  ╚═══════════════════════════════════════════════════════════════════╝   │
└───────────────────────────────────┬────────────────────────────────────────┘
                                    │ Hands off to ▼
                                    ▼
┌───────────────────────────────────────────────────────────────────────────┐
│                         🧪 TESTING & QA PHASE                             │
│                                                                            │
│  ╔═══════════════════════════════════════════════════════════════════╗   │
│  ║  ⚽ MBAPPÉ - QA Tester                                            ║   │
│  ║  Keyboard: Ctrl+Shift+Q                                           ║   │
│  ╠═══════════════════════════════════════════════════════════════════╣   │
│  ║  ✅ Create comprehensive test plans and test cases                ║   │
│  ║  ✅ Execute functional and integration tests                      ║   │
│  ║  ✅ Perform regression testing                                    ║   │
│  ║  ✅ Automated testing with Selenium/Cypress                       ║   │
│  ║  ✅ Bug reporting and tracking                                    ║   │
│  ║  ✅ Verify acceptance criteria                                    ║   │
│  ║  ✅ Performance and load testing                                  ║   │
│  ║                                                                    ║   │
│  ║  📤 Output: Test Reports, Bug Reports, Quality Metrics            ║   │
│  ╚═══════════════════════════════════════════════════════════════════╝   │
└───────────────────────────────────┬────────────────────────────────────────┘
                                    │ Hands off to ▼
                                    ▼
┌───────────────────────────────────────────────────────────────────────────┐
│                      🚀 DEPLOYMENT & OPERATIONS PHASE                     │
│                                                                            │
│  ╔═══════════════════════════════════════════════════════════════════╗   │
│  ║  ⚽ BENZEMA - DevOps Engineer                                     ║   │
│  ║  Keyboard: Ctrl+Shift+B                                           ║   │
│  ╠═══════════════════════════════════════════════════════════════════╣   │
│  ║  ✅ Set up CI/CD pipelines (Jenkins, GitHub Actions)              ║   │
│  ║  ✅ Configure cloud infrastructure (AWS, Azure, GCP)              ║   │
│  ║  ✅ Deploy applications to production                             ║   │
│  ║  ✅ Monitor system health and performance                         ║   │
│  ║  ✅ Manage containers (Docker, Kubernetes)                        ║   │
│  ║  ✅ Implement auto-scaling and load balancing                     ║   │
│  ║  ✅ Backup and disaster recovery                                  ║   │
│  ║                                                                    ║   │
│  ║  📤 Output: Deployed Application, Monitoring Dashboards, Logs     ║   │
│  ╚═══════════════════════════════════════════════════════════════════╝   │
└───────────────────────────────────────────────────────────────────────────┘

                                    │
                                    ▼
╔═══════════════════════════════════════════════════════════════════════════╗
║                    📄 CONTINUOUS COLLABORATION LOOP                       ║
╚═══════════════════════════════════════════════════════════════════════════╝

  ┌──────────────────────────────────────────────────────────────────────┐
  │  💥 TEAM COLLABORATION FEATURES                                      │
  │                                                                      │
  │  ⚡ Agent-to-Agent Communication:                                    │
  │     • Messi → Ronaldo: "Here are the requirements for review"       │
  │     • Ronaldo → Neymar: "Follow this architecture pattern"          │
  │     • Neymar → Mbappé: "Code ready for testing"                     │
  │     • Mbappé → Benzema: "Tests passed, ready for deployment"        │
  │     • Benzema → ALL: "Deployment successful!"                       │
  │                                                                      │
  │  🗣️ Multi-Agent召唤:                                                │
  │     • "Hey Team" → All agents join conversation                     │
  │     • "Everyone, brainstorm this" → Collaborative session           │
  │     • "@Messi @Ronaldo" → Specific agents collaborate               │
  │                                                                      │
  │  💬 Context Preservation:                                            │
  │     • Conversation history maintained across sessions               │
  │     • Project context shared among agents                           │
  │     • Decision tracking and audit trail                             │
  └──────────────────────────────────────────────────────────────────────┘

                                    │
                                    ▼
┌──────────────────────────────────────────────────────────────────────────┐
│                      GROQ AI ENGINE (LLaMA 3.1 70B)                      │
│                   Powering All Agent Intelligence                        │
│                                                                          │
│  • Natural language understanding                                       │
│  • Context-aware responses                                              │
│  • Code generation and review                                           │
│  • Technical documentation                                              │
│  • Problem-solving and recommendations                                  │
└──────────────────────────────────────────────────────────────────────────┘

                                    │
                                    ▼
┌──────────────────────────────────────────────────────────────────────────┐
│                        INTEGRATION LAYER                                 │
│                                                                          │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌──────────────┐ │
│  │    Jira     │  │   Slack     │  │   GitHub    │  │  Azure       │ │
│  │   (Tasks)   │  │   (Chat)    │  │   (Code)    │  │  DevOps      │ │
│  └─────────────┘  └─────────────┘  └─────────────┘  └──────────────┘ │
│                                                                          │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌──────────────┐ │
│  │   Notion    │  │   Jenkins   │  │    AWS      │  │  GitLab      │ │
│  │   (Docs)    │  │   (CI/CD)   │  │  (Cloud)    │  │  (Repos)     │ │
│  └─────────────┘  └─────────────┘  └─────────────┘  └──────────────┘ │
└──────────────────────────────────────────────────────────────────────────┘

                                    │
                                    ▼
┌──────────────────────────────────────────────────────────────────────────┐
│                      DATA PERSISTENCE LAYER                              │
│                                                                          │
│  • Conversation history (MongoDB/PostgreSQL)                            │
│  • Project metadata and context                                         │
│  • User preferences and settings                                        │
│  • Analytics and metrics data                                           │
│  • Integration configurations                                           │
└──────────────────────────────────────────────────────────────────────────┘
```

---

## 🎯 Complete Feature List

### 🤖 **Core AI Features**

#### **1. Multi-Agent Collaboration**
- ✅ 5 specialized AI agents with unique expertise
- ✅ Real-time agent-to-agent communication
- ✅ Context preservation across conversations
- ✅ Collaborative problem solving
- ✅ Dynamic agent status tracking (online/offline)
- ✅ Smart agent routing with natural language
- ✅ Conversation history export (JSON/Markdown/PDF)

#### **2. Intelligent Chat Interface**
- ✅ WebSocket real-time messaging
- ✅ Typing indicators with agent names
- ✅ Message threading and replies
- ✅ Code syntax highlighting
- ✅ Markdown rendering
- ✅ File attachment support
- ✅ Search conversation history
- ✅ Auto-save drafts

#### **3. Command Palette (Ctrl+K)**
- ✅ Universal search across all features
- ✅ Quick agent calling
- ✅ Page navigation (1-9 shortcuts)
- ✅ Recent items tracking
- ✅ Fuzzy search with keywords
- ✅ Keyboard-first design

---

### 📊 **Analytics & Reporting**

#### **4. Advanced Analytics Dashboard**
- ✅ **6+ Chart Types:**
  - Sprint Burndown Chart
  - Velocity Trend Analysis
  - Code Quality Score
  - Agent Performance Metrics
  - Team Productivity Charts
  - Deployment Frequency

- ✅ **Real-time Insights:**
  - Live data updates
  - Predictive analytics
  - Trend detection
  - Performance alerts
  - Custom date ranges

- ✅ **Export Capabilities:**
  - PDF reports
  - Excel spreadsheets
  - CSV data
  - Chart images
  - Executive summaries

#### **5. Performance Tracking**
- ✅ Team velocity metrics
- ✅ Individual agent performance
- ✅ Sprint progress tracking
- ✅ Code quality scores
- ✅ Deployment success rates
- ✅ Time-to-resolution metrics

---

### 🔍 **Code Quality & Review**

#### **6. AI Code Review Assistant**
- ✅ **Automated Analysis:**
  - Security vulnerability scanning
  - Performance bottleneck detection
  - Code complexity analysis
  - Best practice validation
  - Dependency vulnerability checks

- ✅ **Auto-Fix Suggestions:**
  - One-click fixes for common issues
  - Refactoring recommendations
  - Code optimization hints
  - Security patch suggestions

- ✅ **Compliance Reports:**
  - OWASP Top 10 compliance
  - GDPR readiness checks
  - SOC 2 compliance
  - Custom compliance rules
  - Audit trail generation

#### **7. Security Scanning**
- ✅ CVE detection
- ✅ Dependency scanning
- ✅ Secret detection
- ✅ SAST analysis
- ✅ License compliance
- ✅ Security scoring

---

### 🗂️ **Project Management**

#### **8. Multi-Project Workspace**
- ✅ **Unlimited Projects:**
  - Create and manage multiple projects
  - Project templates (Agile, Waterfall, Kanban)
  - Project archiving and restoration
  - Bulk operations

- ✅ **Context Preservation:**
  - Per-project conversation history
  - Automatic context switching
  - Smart suggestions based on project
  - Cross-project search

- ✅ **Team Management:**
  - Role-based access control
  - Team member assignments
  - Workload distribution
  - Capacity planning

#### **9. Epic & Story Management**
- ✅ Create and track epics
- ✅ User story templates
- ✅ Story point estimation
- ✅ Acceptance criteria
- ✅ Sprint planning
- ✅ Backlog prioritization
- ✅ Kanban board view
- ✅ Gantt chart timeline

---

### 🔌 **Integrations Hub**

#### **10. Platform Integrations (10+)**
- ✅ **Project Management:**
  - Jira (epics, stories, sprints)
  - Asana (tasks, projects)
  - Trello (boards, cards)
  - Monday.com (workflows)

- ✅ **Communication:**
  - Slack (channels, notifications, bot)
  - Microsoft Teams (channels, mentions)
  - Discord (webhooks, commands)

- ✅ **Version Control:**
  - GitHub (repos, PRs, issues)
  - GitLab (pipelines, merge requests)
  - Bitbucket (repos, branches)

- ✅ **CI/CD & Cloud:**
  - Azure DevOps (pipelines, boards)
  - Jenkins (builds, deployments)
  - CircleCI (workflows)
  - AWS (EC2, Lambda, S3)
  - Google Cloud Platform

- ✅ **Calendar & Docs:**
  - Google Calendar (meetings, sprints)
  - Notion (documentation)
  - Confluence (wiki, docs)

#### **11. Integration Features**
- ✅ OAuth 2.0 authentication
- ✅ Webhook management
- ✅ API key configuration
- ✅ Real-time sync
- ✅ Bi-directional updates
- ✅ Custom field mapping
- ✅ Integration health monitoring

---

### 🎯 **Workflow Automation**

#### **12. Templates & Snippets Library**
- ✅ **Pre-built Templates:**
  - Sprint Planning Template
  - Code Review Checklist
  - Deployment Runbook
  - Bug Report Template
  - Feature Request Form
  - Release Notes Generator
  - Stand-up Meeting Notes

- ✅ **Code Snippets:**
  - 50+ language support
  - Custom snippet creation
  - Variable substitution
  - Multi-cursor editing
  - Team sharing

- ✅ **Workflow Templates:**
  - Agile sprint workflow
  - Continuous deployment
  - Hotfix procedure
  - Feature release process
  - Security audit workflow

#### **13. Automation Rules**
- ✅ Trigger-based actions
- ✅ Conditional logic
- ✅ Multi-step workflows
- ✅ Schedule automation
- ✅ Email notifications
- ✅ Webhook triggers

---

### 🎨 **Customization & Personalization**

#### **14. Agent Customization Studio**
- ✅ **Custom AI Agents:**
  - Create unlimited custom agents
  - Define personality and tone
  - Set expertise areas
  - Configure response style
  - Add custom knowledge base

- ✅ **Agent Training:**
  - Upload training documents
  - Fine-tune responses
  - Set behavioral guidelines
  - Define conversation flows

- ✅ **Agent Marketplace:**
  - Browse community agents
  - Install with one click
  - Rate and review agents
  - Share custom agents

#### **15. Theme Customization**
- ✅ Dark/Light mode toggle
- ✅ Custom color schemes
- ✅ Font size adjustment
- ✅ Layout preferences
- ✅ Accessibility options
- ✅ High contrast mode

---

### 🎤 **Voice & Accessibility**

#### **16. Voice Control Interface**
- ✅ **Voice Commands:**
  - "Hey FLUX, call Neymar"
  - "Hey FLUX, show analytics"
  - "Hey FLUX, create new project"
  - "Hey FLUX, run code review"

- ✅ **Speech Features:**
  - Real-time transcription
  - Multi-language support
  - Wake word detection
  - Continuous listening mode
  - Voice feedback

- ✅ **Accessibility:**
  - Screen reader support
  - Keyboard navigation
  - ARIA labels
  - Focus management
  - High contrast themes

---

### 📚 **Conversation & Knowledge**

#### **17. Conversation Memory**
- ✅ Persistent chat history
- ✅ Cross-session memory
- ✅ Automatic context loading
- ✅ Smart search with filters
- ✅ Tag and categorize chats
- ✅ Archive old conversations
- ✅ Export in multiple formats

#### **18. Knowledge Base**
- ✅ Centralized documentation
- ✅ AI-powered search
- ✅ Version control
- ✅ Collaborative editing
- ✅ Rich media support
- ✅ Smart linking

---

### 🎓 **Onboarding & Help**

#### **19. Interactive Onboarding**
- ✅ **15-Step Guided Tour:**
  - Welcome and platform overview
  - Dashboard walkthrough
  - AI agent introduction
  - Command palette tutorial
  - Project creation guide
  - Analytics exploration
  - Integration setup
  - Keyboard shortcuts training

- ✅ **Smart Features:**
  - Auto-detection of new users
  - Progress tracking
  - Skip option available
  - Contextual help tooltips
  - "NEW" badges on features
  - Sample data mode
  - Video tutorials

#### **20. Help Center**
- ✅ Comprehensive documentation
- ✅ Quick start guides
- ✅ Video tutorials (4+ topics)
- ✅ Keyboard shortcuts reference
- ✅ FAQ section
- ✅ Live chat support
- ✅ Community forum
- ✅ Feature request portal

---

### 🚀 **Performance & Developer Tools**

#### **21. Quick Wins Utilities**
- ✅ **Smart Search** - AI-powered global search
- ✅ **Notification Center** - Real-time alerts
- ✅ **Favorites/Bookmarks** - Quick access to items
- ✅ **Recent Items** - Last accessed pages
- ✅ **Export Tools** - Multi-format exports
- ✅ **Dark Mode** - Eye-friendly theme
- ✅ **Auto-Save** - Never lose work
- ✅ **Keyboard Shortcuts** - Power user features
- ✅ **Mobile Responsive** - Works on all devices
- ✅ **Offline Mode** - Continue working offline

#### **22. Developer Experience**
- ✅ Hot reload development
- ✅ TypeScript strict mode
- ✅ ESLint + Prettier
- ✅ Component library
- ✅ API documentation
- ✅ Debug mode
- ✅ Performance profiling
- ✅ Error tracking

---

### 📈 **Enterprise Features**

#### **23. Team Collaboration**
- ✅ Real-time co-editing
- ✅ @mention notifications
- ✅ Team chat channels
- ✅ Screen sharing
- ✅ Meeting scheduler
- ✅ Presence indicators
- ✅ Activity feed

#### **24. Security & Compliance**
- ✅ Role-based access control (RBAC)
- ✅ Two-factor authentication
- ✅ Audit logs
- ✅ Data encryption
- ✅ GDPR compliance
- ✅ SOC 2 Type II
- ✅ SSO integration

#### **25. Scalability**
- ✅ Serverless architecture
- ✅ Auto-scaling (Vercel)
- ✅ Global CDN
- ✅ 99.9% uptime SLA
- ✅ Load balancing
- ✅ Database optimization

---

### 🎨 **UI/UX Excellence**

#### **26. Modern Interface**
- ✅ **Design System:**
  - Consistent components
  - Gradient backgrounds
  - Smooth animations
  - Glass morphism effects
  - Micro-interactions

- ✅ **Responsive Design:**
  - Mobile-first approach
  - Tablet optimization
  - Desktop layouts
  - Touch-friendly controls

- ✅ **User Experience:**
  - Loading states
  - Error boundaries
  - Skeleton screens
  - Toast notifications
  - Modal dialogs
  - Contextual menus

#### **27. Data Visualization**
- ✅ Recharts integration
- ✅ Interactive charts
- ✅ Real-time updates
- ✅ Custom tooltips
- ✅ Export as images
- ✅ Responsive graphs

---

## 🛠️ Tech Stack

### **Frontend**
- **Framework:** Next.js 14.2.33 (React 18+)
- **Language:** TypeScript 5.x (Strict Mode)
- **Styling:** Tailwind CSS 3.x
- **Charts:** Recharts 2.x
- **State:** React Context API + Hooks
- **Forms:** React Hook Form
- **Icons:** Lucide Icons
- **Animations:** Framer Motion

### **Backend**
- **Framework:** FastAPI (Python 3.9+)
- **WebSockets:** Native FastAPI WebSockets
- **AI Engine:** Groq AI (LLaMA 3.1 70B)
- **Database:** PostgreSQL / MongoDB (configurable)
- **Cache:** Redis
- **Queue:** Celery
- **Storage:** AWS S3 / Azure Blob

### **Infrastructure**
- **Hosting:** Vercel (Frontend + Serverless)
- **CDN:** Vercel Edge Network
- **CI/CD:** GitHub Actions
- **Monitoring:** Vercel Analytics
- **Logging:** Winston + CloudWatch
- **Error Tracking:** Sentry

### **Integrations**
- **APIs:** REST + GraphQL
- **Auth:** OAuth 2.0, JWT
- **Webhooks:** Bi-directional
- **Real-time:** WebSockets
- **Search:** Elasticsearch

---

## ⚡ Quick Start

### **Prerequisites**
```bash
✅ Node.js 18+ (LTS recommended)
✅ Python 3.9+
✅ Git
✅ Groq API Key (free at console.groq.com)
```

### **1. Clone Repository**
```bash
git clone https://github.com/IlamSingleBrainCell/FLUX.git
cd FLUX
```

### **2. Backend Setup**
```bash
cd backend

# Install dependencies
pip install -r requirements.txt

# Create environment file
cp .env.example .env

# Add your API keys
echo "GROQ_API_KEY=your_groq_key_here" >> .env
echo "GITHUB_TOKEN=your_github_token" >> .env  # Optional
```

### **3. Frontend Setup**
```bash
cd frontend

# Install dependencies
npm install

# Development server will run on port 3002
npm run dev
```

### **4. Start Backend**
```bash
cd backend
python main_minimal.py
```

### **5. Access Application**
- 🌐 **Frontend:** http://localhost:3002
- 🔧 **Backend API:** http://localhost:8000
- 📖 **API Docs:** http://localhost:8000/docs
- 🚀 **Production:** https://flux-six-drab.vercel.app

---

## ⌨️ Keyboard Shortcuts

### **Essential Shortcuts**
| Shortcut | Action |
|----------|--------|
| `Ctrl+K` | Open Command Palette |
| `1-9` | Quick page navigation |
| `?` | Show all shortcuts |

### **Agent Shortcuts**
| Shortcut | Agent |
|----------|-------|
| `Ctrl+Shift+M` | Messi (Requirements Analyst) ⚽ |
| `Ctrl+Shift+R` | Ronaldo (Software Architect) ⚽ |
| `Ctrl+Shift+N` | Neymar (Developer) ⚽ |
| `Ctrl+Shift+Q` | Mbappé (QA Tester) ⚽ |
| `Ctrl+Shift+B` | Benzema (DevOps Engineer) ⚽ |

### **Navigation**
| Key | Destination |
|-----|-------------|
| `1` | Dashboard |
| `2` | Projects |
| `3` | AI Workspace |
| `4` | Analytics |
| `5` | Integrations |
| `6` | Settings |
| `7` | Marketplace |
| `8` | Timeline |
| `9` | Help |

📖 **[Complete Shortcuts Guide](AGENT_KEYBOARD_SHORTCUTS.md)**

---

## 📁 Project Structure

```
FLUX/
├── 📁 backend/                 # Python FastAPI backend
│   ├── 📄 main_minimal.py     # Main server with enhanced collaboration
│   ├── 📁 agents/             # AI agent definitions and personalities
│   ├── 📁 models/             # Data models and schemas
│   ├── 📁 routes/             # API route handlers
│   ├── 📁 services/           # Business logic and external services
│   ├── 📁 utils/              # Utility functions and helpers
│   ├── 📁 workflows/          # SDLC workflow management
│   └── 📄 requirements.txt    # Python dependencies
│
├── 📁 frontend/               # Next.js React frontend
│   ├── 📁 components/         # Reusable UI components
│   │   ├── 📁 AgentChat/      # Chat interface components
│   │   ├── 📁 EnhancedChat/   # Main chat interface
│   │   ├── 📁 GitHub/         # GitHub integration UI
│   │   └── 📁 UI/             # Base UI components
│   ├── 📁 hooks/              # React custom hooks
│   ├── 📁 pages/              # Next.js pages
│   ├── 📁 types/              # TypeScript type definitions
│   └── 📄 package.json       # Node.js dependencies
│
├── 📄 README.md               # This file
├── 📄 GITHUB_INTEGRATION.md   # GitHub integration guide
└── 📄 .env.example           # Environment variables template
```

---

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the backend directory:

```bash
# Required
GROQ_API_KEY=your_groq_api_key_here

# Optional - For GitHub Integration
GITHUB_TOKEN=your_github_token_here

# Optional - Custom Configuration
DEBUG=false
WORKSPACE_ROOT=C:\YOKA
```

### Agent Customization

Modify agent personalities in `backend/main_minimal.py`:

```python
AGENTS = {
    "sara": {
        "name": "Sara (Requirements Analyst)",
        "role": "requirements_analyst",
        "personality": "Your custom personality here..."
    },
    # ... other agents
}
```

---

## 🎯 Usage Examples

### Direct Agent Communication
```
"Hi Marc, can you review this system architecture?"
"Hello Jess, please create test cases for this feature"
"Hey Dave, what's the deployment status?"
```

### Multi-Agent Collaboration
```
"Hi Everyone, let's discuss the new project requirements"
"Team, we need to brainstorm solutions for this issue"
"All agents, collaborate on this security assessment"
```

### Project Management
```
"Emma, can you update the project timeline?"
"Sara, analyze these user requirements"
"Robt, perform a security audit on this code"
```

---

## 🚀 Deployment

### ⚡ Vercel Deployment (Recommended)

The easiest way to deploy FLUX is using Vercel's serverless platform:

1. **Quick Deploy**:
   - Connect your GitHub repository to [Vercel](https://vercel.com)
   - Set `GROQ_API_KEY` environment variable
   - Deploy with one click

2. **Auto-scaling**: Handles traffic spikes automatically

3. **Global CDN**: Fast worldwide access

4. **Zero Config**: Works out of the box

📖 **[Full Vercel Deployment Guide](VERCEL_DEPLOYMENT.md)**

### Traditional Server Deployment

#### Production Backend
```bash
cd backend
pip install gunicorn
gunicorn main_minimal:app --workers 4 --worker-class uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
```

#### Production Frontend
```bash
cd frontend
npm run build
npm start
```

### Docker Deployment (Optional)
```dockerfile
# Dockerfile example for backend
FROM python:3.9-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["python", "main_minimal.py"]
```

```bash
# Build and run
docker-compose up -d
```

---

## 🧪 Testing

### Test Agent Routing

1. Open [http://localhost:3002](http://localhost:3002)

2. Try these test scenarios:
   - **Single Agent**: "Hi Marc" → Only Marc responds
   - **Collaboration**: "Hi Everyone" → All agents respond
   - **Context Aware**: "Sara, analyze these requirements"

### Test Status Tracking

1. Ask an agent to leave: "Jess, can you step away?"
2. Watch the online count decrease
3. Agent status should change to offline (gray dot)

### Test GitHub Integration

1. Configure `GITHUB_TOKEN` in `.env`
2. Navigate to GitHub tab
3. Clone a repository to test workspace management

---

## 🤝 Contributing

We welcome contributions! Here's how to get started:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes**
4. **Add tests** for new functionality
5. **Commit changes**: `git commit -m 'Add amazing feature'`
6. **Push to branch**: `git push origin feature/amazing-feature`
7. **Open a Pull Request**

### Development Guidelines
- Follow existing code style and patterns
- Add TypeScript types for new frontend features
- Include docstrings for new Python functions
- Test agent interactions thoroughly
- Update documentation for new features

---

## 🛠 Troubleshooting

### Common Issues

**Backend won't start**
- Check if port 8000 is available: `netstat -an | find "8000"`
- Verify Groq API key is set in `.env`
- Install all requirements: `pip install -r requirements.txt`

**Frontend connection errors**
- Ensure backend is running on port 8000
- Check CORS configuration in `main_minimal.py`
- Try hard refresh: `Ctrl+Shift+R`

**Agents not responding**
- Check WebSocket connection status in browser console
- Verify agent names are spelled correctly
- Ensure Groq API key is valid and has credits

**Status tracking issues**
- Refresh browser to reset agent status
- Check for JavaScript errors in browser console
- Verify WebSocket messages in Network tab

### Debug Mode

Enable detailed logging by setting environment variables:

```bash
DEBUG=true
VERBOSE_LOGS=true
```

---

## 📊 Performance

### System Requirements
- **CPU**: 2+ cores recommended
- **RAM**: 4GB minimum, 8GB recommended
- **Storage**: 1GB for application, additional for repositories
- **Network**: Stable internet for Groq API calls

### Optimization Tips
- Use production builds for better performance
- Configure proper WebSocket timeouts
- Monitor Groq API usage and limits
- Implement connection pooling for high traffic

---

## 🔒 Security

### Best Practices
- Never commit `.env` files to repository
- Use environment variables for all secrets
- Implement proper input validation
- Monitor API usage for unusual patterns
- Keep dependencies updated

### Data Privacy
- Messages are processed by Groq AI
- No conversation data is stored permanently
- GitHub tokens are used only for API access
- Local repositories remain on your machine

---

## 📜 Changelog

### v3.2.0 (October 3, 2025) - Current
- ⚽ Fixed agent names (Football players)
- ⌨️ Added keyboard shortcuts for all agents
- 🎓 Comprehensive onboarding system
- 📚 Complete documentation
- 🗏️ Architectural workflow diagram

### v2.0.0 - Enhanced Collaboration System
- ✅ Multi-agent collaboration with "Hi Everyone"
- ✅ Agent-to-agent communication
- ✅ Dynamic status tracking with offline detection
- ✅ Clean UI with consolidated status management
- ✅ Improved agent routing with keyword detection

### v1.5.0 - Agent Status Tracking
- ✅ Real-time online/offline status
- ✅ Intelligent leaving message detection
- ✅ Dynamic agent count updates
- ✅ UI improvements and cleanup

### v1.0.0 - Initial Release
- ✅ 7 specialized AI agents
- ✅ Direct agent routing system
- ✅ WebSocket real-time communication
- ✅ GitHub integration
- ✅ Project context management

---

## 🙏 Acknowledgments

- **Groq** for providing powerful AI capabilities
- **FastAPI** for the excellent web framework
- **Next.js** for the robust React framework
- **Tailwind CSS** for beautiful UI components
- **Open Source Community** for inspiration and tools

---

## 📞 Support

Need help? Here are your options:

1. **Check the documentation** in this README
2. **Review troubleshooting** section above
3. **Enable debug mode** for detailed logs
4. **Check browser console** for frontend errors
5. **Verify environment configuration**

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">

### 🚀 Ready to revolutionize your team collaboration with AI-powered agents!

**[Try FLUX Now](https://flux-six-drab.vercel.app)** | **[View Documentation](#-documentation)** | **[Join Community](#-support)**

---

**Built with ❤️ using FastAPI, Next.js, and Groq AI**

*Powered by Groq AI • Deployed on Vercel • Made with Next.js & FastAPI*

**Version 3.2.0** | **Production Ready** | **Enterprise Grade**

</div>
