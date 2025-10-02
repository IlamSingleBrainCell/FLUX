# ⚽ FLUX Agent Keyboard Shortcuts Guide

## 🎮 Quick Access to Your Football Team Agents

Your FLUX platform uses **football legends** as your AI agents! Access them instantly with keyboard shortcuts.

---

## 🎯 Agent Roster & Shortcuts

### **Messi** ⚽ - Requirements Analyst
- **Shortcut:** `Ctrl+Shift+M`
- **Role:** Requirements analysis, user story creation
- **Expertise:** Gathering requirements, defining scope
- **When to call:** Starting new projects, defining features

### **Ronaldo** ⚽ - Software Architect
- **Shortcut:** `Ctrl+Shift+R`
- **Role:** System architecture and design
- **Expertise:** Architecture patterns, system design
- **When to call:** Designing systems, architecture reviews

### **Neymar** ⚽ - Developer
- **Shortcut:** `Ctrl+Shift+N`
- **Role:** Software development and coding
- **Expertise:** Writing code, implementing features
- **When to call:** Development tasks, code implementation

### **Mbappé** ⚽ - QA Tester
- **Shortcut:** `Ctrl+Shift+Q`
- **Role:** Quality assurance and testing
- **Expertise:** Test creation, quality checks
- **When to call:** Testing, quality assurance, bug verification

### **Benzema** ⚽ - DevOps Engineer
- **Shortcut:** `Ctrl+Shift+B`
- **Role:** Infrastructure and deployment
- **Expertise:** CI/CD, deployment, infrastructure
- **When to call:** Deployment issues, infrastructure setup

---

## ⌨️ All Keyboard Shortcuts

### **Navigation Shortcuts**
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
| `9` | Help/Onboarding |

### **Agent Shortcuts**
| Key | Agent | Role |
|-----|-------|------|
| `Ctrl+Shift+M` | Messi ⚽ | Requirements Analyst |
| `Ctrl+Shift+R` | Ronaldo ⚽ | Software Architect |
| `Ctrl+Shift+N` | Neymar ⚽ | Developer |
| `Ctrl+Shift+Q` | Mbappé ⚽ | QA Tester |
| `Ctrl+Shift+B` | Benzema ⚽ | DevOps Engineer |

### **System Shortcuts**
| Key | Action |
|-----|--------|
| `Ctrl+K` | Open Command Palette |
| `?` | Show all shortcuts |
| `Ctrl+F` | Search conversation |
| `ESC` | Close dialog/modal |

---

## 🚀 Usage Examples

### **Scenario 1: Start New Feature Development**
```
1. Press Ctrl+Shift+M to call Messi
2. Discuss requirements with Messi
3. Press Ctrl+Shift+R to call Ronaldo
4. Get architecture guidance from Ronaldo
5. Press Ctrl+Shift+N to call Neymar
6. Start coding with Neymar
```

### **Scenario 2: Deploy New Version**
```
1. Press Ctrl+Shift+Q to call Mbappé
2. Run tests with Mbappé
3. Press Ctrl+Shift+B to call Benzema
4. Deploy with Benzema's help
```

### **Scenario 3: Quick Navigation**
```
Press 3 → Go to AI Workspace
Press 4 → View Analytics
Press 2 → Check Projects
Press 1 → Return to Dashboard
```

---

## 💡 Pro Tips

### **Multiple Agent Collaboration**
You can call multiple agents in sequence:
1. `Ctrl+Shift+M` (Messi for requirements)
2. `Ctrl+Shift+R` (Ronaldo for architecture)
3. `Ctrl+Shift+N` (Neymar for implementation)

All agents can see the conversation history!

### **Command Palette Power User**
Press `Ctrl+K` and type:
- `"messi"` → Quick search for Messi
- `"ronaldo"` → Quick search for Ronaldo
- `"deploy"` → Find deployment commands
- `"test"` → Find testing commands

### **Voice Commands Alternative**
Can't use keyboard? Try voice:
- "Hey FLUX, call Messi"
- "Hey FLUX, call Neymar"
- "Hey FLUX, show analytics"

---

## 🎯 Agent Mapping Reference

| Agent ID | Football Player | Role | Department |
|----------|----------------|------|------------|
| `requirements_analyst` | Messi | Requirements Analyst | Planning |
| `software_architect` | Ronaldo | Software Architect | Architecture |
| `developer` | Neymar | Developer | Development |
| `qa_tester` | Mbappé | QA Tester | Quality |
| `devops_engineer` | Benzema | DevOps Engineer | Operations |

---

## 🔧 Technical Implementation

### **How Shortcuts Work**

The shortcuts are handled globally in `CommandPalette.tsx`:

```typescript
// Agent shortcuts - Ctrl+Shift+[Key]
if (e.ctrlKey && e.shiftKey) {
  switch (e.key.toLowerCase()) {
    case 'm': router.push('/workspace?agent=messi'); break;
    case 'r': router.push('/workspace?agent=ronaldo'); break;
    case 'n': router.push('/workspace?agent=neymar'); break;
    case 'q': router.push('/workspace?agent=mbappe'); break;
    case 'b': router.push('/workspace?agent=benzema'); break;
  }
}
```

### **Customizing Shortcuts**

To change a shortcut:
1. Edit `frontend/components/CommandPalette/CommandPalette.tsx`
2. Find the `useCommandPalette` hook
3. Modify the key mapping in the switch statement
4. Update this documentation

---

## 📱 Mobile Alternative

On mobile devices without keyboards:
1. **Tap** on agent avatars in workspace
2. **Use** the floating action button (⚽)
3. **Voice** commands: "Hey FLUX, call [agent name]"
4. **Command Menu** → Three dots → Select agent

---

## 🎓 Learning Path

### **Day 1: Basic Navigation**
- Learn number shortcuts (1-9)
- Practice `Ctrl+K` command palette

### **Day 2: Agent Shortcuts**
- Memorize your most-used agent (e.g., `Ctrl+Shift+N` for Neymar)
- Practice switching between agents

### **Day 3: Power User**
- Combine navigation + agent shortcuts
- Use command palette for everything
- Enable voice commands

---

## 🏆 Shortcut Mastery Checklist

- [ ] Can navigate all pages with number keys
- [ ] Can call all 5 agents without looking
- [ ] Can use `Ctrl+K` command palette fluently
- [ ] Know when to use each agent
- [ ] Can chain multiple agents in workflow
- [ ] Use shortcuts more than mouse clicks

---

**Made with ❤️ for FLUX Enterprise**  
**Version:** 3.2.0  
**Last Updated:** October 3, 2025
