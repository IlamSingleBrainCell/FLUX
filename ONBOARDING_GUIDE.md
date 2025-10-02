# 🎓 FLUX Enterprise - User Onboarding Guide

## 📋 Table of Contents
1. [New User Onboarding Flow](#new-user-onboarding-flow)
2. [Interactive Tutorial System](#interactive-tutorial-system)
3. [Feature Discovery](#feature-discovery)
4. [Quick Start Guides](#quick-start-guides)
5. [Sample Data Mode](#sample-data-mode)
6. [Help & Support](#help--support)

---

## 🚀 New User Onboarding Flow

### **Automatic Onboarding Detection**

When a user first accesses FLUX, the system automatically:

1. **Detects New User** - Checks `localStorage` for `flux_onboarding_completed`
2. **Enables Sample Data** - Automatically activates sample projects, conversations, and analytics
3. **Shows Welcome Banner** - Displays "🎉 New User" badge
4. **Auto-Starts Tutorial** - Launches interactive tour after 1 second delay

### **First-Time User Experience**

```
User visits FLUX
    ↓
System detects no onboarding completion
    ↓
Sample data enabled automatically
    ↓
Welcome screen appears
    ↓
Interactive tour starts (15 steps)
    ↓
User completes or skips tour
    ↓
Onboarding marked complete
    ↓
User can access all features
```

---

## 🎯 Interactive Tutorial System

### **15-Step Guided Tour**

The interactive tutorial covers:

1. **Welcome** - Platform introduction
2. **Dashboard** - Command center overview
3. **AI Workspace** - Agent introduction
4. **Agent Selection** - How to choose agents
5. **Command Palette** - Ctrl+K shortcuts
6. **Projects** - Project management
7. **Analytics** - Performance insights
8. **Code Review** - Automated analysis
9. **Templates** - Workflow automation
10. **Integrations** - Platform connections
11. **Customization** - Agent tuning
12. **Voice Control** - Voice commands
13. **Conversations** - History & export
14. **Keyboard Shortcuts** - Power user tips
15. **Completion** - Ready to start!

### **Tutorial Features**

- ✅ **Progress Indicator** - Visual progress bar showing step X of 15
- ✅ **Navigation Controls** - Previous/Next buttons
- ✅ **Skip Option** - "Skip Tour" button always visible
- ✅ **Contextual Content** - Special tips for specific steps
- ✅ **Keyboard Shortcuts Guide** - Essential shortcuts displayed
- ✅ **Spotlight Effect** - Visual focus on current element
- ✅ **Auto-Save Progress** - Remembers completion state

---

## 🔍 Feature Discovery

### **Feature Tooltips**

New features show contextual tooltips using `FeatureTooltip` component:

```tsx
<FeatureTooltip
  featureId="voice-control"
  title="🎤 Voice Commands Available"
  description="Try saying 'Hey FLUX, call Marcus' for hands-free control"
>
  <VoiceButton />
</FeatureTooltip>
```

**Features:**
- Auto-appears for new users (500ms delay)
- Dismissible with X button
- Marked as "seen" after dismissal
- Never shows again once dismissed

### **"NEW" Badges**

Unseen features display a blue "NEW" badge:
- Tracks per-user feature discovery
- Stored in `localStorage` as `flux_seen_features`
- Removed after first interaction

---

## 📚 Quick Start Guides

### **Built-in Guides Available**

The onboarding page (`/onboarding`) includes 4 step-by-step guides:

#### 1. **🚀 Create Your First Project**
```
1. Go to Projects page
2. Click "New Project" button
3. Fill in project details
4. Assign team members
5. Start chatting with AI agents
```

#### 2. **💬 Start a Conversation with Neymar**
```
1. Navigate to AI Workspace
2. Click on Neymar (Developer) ⚽
3. Type your question or use voice
4. Neymar will help with coding tasks
5. He can collaborate with other agents like Messi and Ronaldo
```

#### 3. **🔍 Run Your First Code Review**
```
1. Go to Code Review page
2. Click "Run Analysis"
3. Review detected issues
4. Use "Auto-Fix" for simple issues
5. Generate compliance report
```

#### 4. **📊 Explore Analytics Dashboard**
```
1. Navigate to Analytics page
2. View team performance metrics
3. Check sprint burndown charts
4. Analyze code quality scores
5. Export reports (PDF/Excel)
```

---

## 🎮 Sample Data Mode

### **What is Sample Data?**

Sample Data Mode pre-populates the platform with:
- **3 Example Projects** - E-commerce, Mobile App, Analytics
- **Sample Conversations** - Pre-written agent interactions
- **Mock Analytics** - Realistic performance charts
- **Template Workflows** - Pre-configured automation
- **Integration Examples** - Connected services (Jira, Slack)

### **How to Enable/Disable**

**Via Onboarding Page:**
```
/onboarding → Sample Data Mode → Toggle Switch
```

**Programmatically:**
```tsx
import { useOnboarding } from '@/contexts/OnboardingContext';

const { showSampleData, toggleSampleData } = useOnboarding();

// Enable
toggleSampleData(); // Sets to opposite of current state

// Check status
if (showSampleData) {
  // Show sample data
}
```

**Storage:**
```javascript
localStorage.getItem('flux_sample_data_enabled') // 'true' or 'false'
```

### **Benefits for New Users**

- ✅ **Immediate Exploration** - No setup required
- ✅ **Feature Discovery** - See all capabilities in action
- ✅ **Risk-Free Testing** - No real data affected
- ✅ **Learning Tool** - Understand workflows with examples
- ✅ **Demo Mode** - Perfect for presentations

---

## ⌨️ Keyboard Shortcuts

### **Essential Shortcuts**

| Shortcut | Action |
|----------|--------|
| `Ctrl+K` | Open Command Palette |
| `1-9` | Navigate to pages (1=Dashboard, 2=Projects, etc.) |
| `?` | Show all keyboard shortcuts |
| `Ctrl+Shift+M` | Call Messi (Requirements Analyst) ⚽ |
| `Ctrl+Shift+R` | Call Ronaldo (Software Architect) ⚽ |
| `Ctrl+Shift+N` | Call Neymar (Developer) ⚽ |
| `Ctrl+Shift+Q` | Call Mbappé (QA Tester) ⚽ |
| `Ctrl+Shift+B` | Call Benzema (DevOps Engineer) ⚽ |
| `Ctrl+F` | Search within conversation |

---

## 🎬 Video Tutorials

### **Available Tutorials**

1. **Getting Started with FLUX** (5:30)
   - Platform Overview
   - Navigation
   - First Project

2. **AI Agents Deep Dive** (8:15)
   - Agent Capabilities
   - Collaboration
   - Customization

3. **Advanced Analytics Tutorial** (6:45)
   - Chart Types
   - Insights
   - Reporting

4. **Integration Setup Guide** (7:20)
   - Jira Setup
   - Slack Integration
   - GitHub Connection
   - Calendar Sync

---

## 💡 Help & Support

### **Multiple Support Channels**

#### **1. Live Chat Support**
- Instant help from AI agents
- Escalation to human support
- Available 24/7

#### **2. Documentation**
- Comprehensive guides
- API documentation
- Best practices
- Troubleshooting

#### **3. Community Forum**
- Connect with other users
- Share experiences
- Feature requests
- Knowledge base

---

## 🔧 Implementation Details

### **Context Provider Setup**

The OnboardingContext wraps the entire app:

```tsx
// pages/_app.tsx
import { OnboardingProvider } from '@/contexts/OnboardingContext';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <OnboardingProvider>
      <ConversationMemoryProvider>
        <Component {...pageProps} />
      </ConversationMemoryProvider>
    </OnboardingProvider>
  );
}
```

### **Using Onboarding in Components**

```tsx
import { useOnboarding } from '@/contexts/OnboardingContext';

function MyComponent() {
  const {
    isOnboarding,        // Is tour active?
    currentStep,         // Current step number
    totalSteps,          // Total steps (15)
    startOnboarding,     // Start the tour
    skipOnboarding,      // Skip/dismiss tour
    nextStep,            // Go to next step
    previousStep,        // Go to previous step
    isNewUser,           // Is this a new user?
    hasSeenFeature,      // Has user seen this feature?
    markFeatureAsSeen,   // Mark feature as seen
    showSampleData,      // Is sample data enabled?
    toggleSampleData     // Toggle sample data
  } = useOnboarding();

  return (
    <div>
      {isNewUser && <NewUserBadge />}
      {!hasSeenFeature('voice-control') && <VoiceControlTooltip />}
    </div>
  );
}
```

### **Storage Keys**

```javascript
// LocalStorage keys used
localStorage.getItem('flux_onboarding_completed')  // 'true' when complete
localStorage.getItem('flux_seen_features')         // JSON array of seen feature IDs
localStorage.getItem('flux_sample_data_enabled')   // 'true' or 'false'
```

---

## 📊 Onboarding Analytics

### **Tracked Metrics**

The system tracks:
- ✅ Onboarding completion rate
- ✅ Steps completed before skip
- ✅ Feature discovery rate
- ✅ Time to complete tour
- ✅ Sample data usage
- ✅ Help resource access

---

## 🎨 Customization Options

### **Modify Onboarding Steps**

Edit the `onboardingSteps` array in `OnboardingContext.tsx`:

```tsx
const onboardingSteps: OnboardingStep[] = [
  {
    id: 'custom-step',
    title: 'Your Custom Title',
    description: 'Your description here',
    target: '/your-route',
    position: 'bottom'
  }
];
```

### **Add Custom Feature Tooltips**

```tsx
<FeatureTooltip
  featureId="my-new-feature"
  title="New Feature Title"
  description="What this feature does"
>
  <YourComponent />
</FeatureTooltip>
```

---

## 🚀 Best Practices

### **For New User Experience**

1. ✅ **Keep tour concise** - 15 steps max
2. ✅ **Allow skipping** - Never force completion
3. ✅ **Use sample data** - Let users explore safely
4. ✅ **Provide context** - Explain "why" not just "how"
5. ✅ **Show shortcuts** - Teach power-user features early
6. ✅ **Offer help** - Multiple support channels
7. ✅ **Track progress** - Visual indicators always visible
8. ✅ **Enable replay** - Let users restart tour anytime

### **For Returning Users**

1. ✅ **Feature tooltips** - Highlight new features
2. ✅ **"What's New" section** - Changelog and updates
3. ✅ **Keyboard shortcuts** - Quick reference available
4. ✅ **Help page** - Always accessible at `/onboarding`

---

## 📱 Mobile Onboarding

The onboarding system is fully responsive:
- ✅ Touch-friendly controls
- ✅ Adaptive layout for tablets
- ✅ Mobile-optimized tooltips
- ✅ Swipe gestures for navigation

---

## 🎉 Success Metrics

**Goal: 80% onboarding completion rate**

**Tracking:**
- New user registrations
- Tutorial completion
- Feature adoption rate
- Time to first action
- Support ticket reduction

---

**Built with ❤️ for FLUX Enterprise**  
**Version:** 3.1.0  
**Last Updated:** October 3, 2025
