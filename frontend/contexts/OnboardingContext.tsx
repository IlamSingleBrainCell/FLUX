import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  target: string; // CSS selector or route
  position: 'top' | 'bottom' | 'left' | 'right';
  action?: () => void;
}

interface OnboardingContextType {
  isOnboarding: boolean;
  currentStep: number;
  totalSteps: number;
  startOnboarding: () => void;
  skipOnboarding: () => void;
  nextStep: () => void;
  previousStep: () => void;
  completeOnboarding: () => void;
  isNewUser: boolean;
  hasSeenFeature: (featureId: string) => boolean;
  markFeatureAsSeen: (featureId: string) => void;
  showSampleData: boolean;
  toggleSampleData: () => void;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export const useOnboarding = () => {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error('useOnboarding must be used within OnboardingProvider');
  }
  return context;
};

const onboardingSteps: OnboardingStep[] = [
  {
    id: 'welcome',
    title: '👋 Welcome to FLUX Enterprise!',
    description: 'Your AI-powered SDLC platform. Let\'s take a quick tour to get you started!',
    target: 'body',
    position: 'bottom'
  },
  {
    id: 'dashboard',
    title: '📊 Dashboard Overview',
    description: 'This is your command center. See all active projects, team activity, and quick actions at a glance.',
    target: '/dashboard',
    position: 'bottom'
  },
  {
    id: 'ai-workspace',
    title: '💬 AI Agent Workspace',
    description: 'Chat with specialized AI agents like Messi (Requirements Analyst), Ronaldo (Software Architect), Neymar (Developer), Mbappé (QA Tester), and Benzema (DevOps Engineer). They can help with planning, coding, deployment, and testing.',
    target: '/workspace',
    position: 'right'
  },
  {
    id: 'agent-selector',
    title: '🤖 Select Your Agent',
    description: 'Click on any agent card to start a conversation. Each agent has unique expertise and can collaborate with others.',
    target: '.agent-card',
    position: 'top'
  },
  {
    id: 'command-palette',
    title: '⌨️ Command Palette (Ctrl+K)',
    description: 'Press Ctrl+K anytime to quickly search, navigate, or execute actions. It\'s your power-user shortcut!',
    target: 'body',
    position: 'bottom'
  },
  {
    id: 'projects',
    title: '📋 Project Management',
    description: 'Create and manage multiple projects. Track progress, assign teams, and monitor deliverables.',
    target: '/projects',
    position: 'bottom'
  },
  {
    id: 'analytics',
    title: '📈 Advanced Analytics',
    description: 'View real-time insights: agent performance, sprint velocity, code quality, and deployment metrics.',
    target: '/analytics',
    position: 'bottom'
  },
  {
    id: 'code-review',
    title: '🔍 AI Code Review',
    description: 'Automated code analysis with security scanning, performance checks, and auto-fix suggestions.',
    target: '/code-review',
    position: 'bottom'
  },
  {
    id: 'templates',
    title: '🎯 Workflow Templates',
    description: 'Use pre-built templates for common tasks: sprint planning, deployments, code reviews, and more.',
    target: '/templates',
    position: 'bottom'
  },
  {
    id: 'integrations',
    title: '🔌 Integrations Hub',
    description: 'Connect with Jira, Slack, GitHub, and 10+ other platforms to centralize your workflow.',
    target: '/integrations',
    position: 'bottom'
  },
  {
    id: 'customization',
    title: '🎨 Customize Agents',
    description: 'Fine-tune agent personalities, response styles, and train them on your company docs.',
    target: '/agent-customization',
    position: 'bottom'
  },
  {
    id: 'voice-control',
    title: '🎤 Voice Commands',
    description: 'Enable voice control to use hands-free commands like "Hey FLUX, call Marcus" for faster workflows.',
    target: 'body',
    position: 'bottom'
  },
  {
    id: 'conversations',
    title: '💭 Conversation History',
    description: 'Never lose context! All conversations are saved, searchable, and exportable (PDF/Markdown/JSON).',
    target: '/conversations',
    position: 'bottom'
  },
  {
    id: 'keyboard-shortcuts',
    title: '⌨️ Keyboard Shortcuts',
    description: 'Press "?" to see all shortcuts. Use 1-9 for page navigation, Ctrl+Shift+N for Neymar, Ctrl+Shift+M for Messi, Ctrl+Shift+R for Ronaldo, and more!',
    target: 'body',
    position: 'bottom'
  },
  {
    id: 'complete',
    title: '🎉 You\'re All Set!',
    description: 'You\'re ready to revolutionize your development workflow. Start by creating a project or chatting with an agent. Need help? Press Ctrl+K and search!',
    target: 'body',
    position: 'bottom'
  }
];

export const OnboardingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isOnboarding, setIsOnboarding] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [isNewUser, setIsNewUser] = useState(false);
  const [seenFeatures, setSeenFeatures] = useState<Set<string>>(new Set());
  const [showSampleData, setShowSampleData] = useState(false);

  // Check if user is new on mount
  useEffect(() => {
    const hasCompletedOnboarding = localStorage.getItem('flux_onboarding_completed');
    const seenFeaturesStr = localStorage.getItem('flux_seen_features');
    const sampleDataEnabled = localStorage.getItem('flux_sample_data_enabled');

    if (!hasCompletedOnboarding) {
      setIsNewUser(true);
      setShowSampleData(true); // Enable sample data for new users
      // Auto-start onboarding after 1 second
      setTimeout(() => setIsOnboarding(true), 1000);
    }

    if (seenFeaturesStr) {
      setSeenFeatures(new Set(JSON.parse(seenFeaturesStr)));
    }

    if (sampleDataEnabled === 'true') {
      setShowSampleData(true);
    }
  }, []);

  const startOnboarding = () => {
    setIsOnboarding(true);
    setCurrentStep(0);
  };

  const skipOnboarding = () => {
    setIsOnboarding(false);
    localStorage.setItem('flux_onboarding_completed', 'true');
  };

  const nextStep = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      completeOnboarding();
    }
  };

  const previousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const completeOnboarding = () => {
    setIsOnboarding(false);
    setIsNewUser(false);
    localStorage.setItem('flux_onboarding_completed', 'true');
  };

  const hasSeenFeature = (featureId: string) => {
    return seenFeatures.has(featureId);
  };

  const markFeatureAsSeen = (featureId: string) => {
    const updated = new Set(seenFeatures);
    updated.add(featureId);
    setSeenFeatures(updated);
    localStorage.setItem('flux_seen_features', JSON.stringify(Array.from(updated)));
  };

  const toggleSampleData = () => {
    const newValue = !showSampleData;
    setShowSampleData(newValue);
    localStorage.setItem('flux_sample_data_enabled', String(newValue));
  };

  const value: OnboardingContextType = {
    isOnboarding,
    currentStep,
    totalSteps: onboardingSteps.length,
    startOnboarding,
    skipOnboarding,
    nextStep,
    previousStep,
    completeOnboarding,
    isNewUser,
    hasSeenFeature,
    markFeatureAsSeen,
    showSampleData,
    toggleSampleData
  };

  return (
    <OnboardingContext.Provider value={value}>
      {children}
      {isOnboarding && <OnboardingOverlay step={onboardingSteps[currentStep]} />}
    </OnboardingContext.Provider>
  );
};

// Onboarding Overlay Component
const OnboardingOverlay: React.FC<{ step: OnboardingStep }> = ({ step }) => {
  const { currentStep, totalSteps, nextStep, previousStep, skipOnboarding } = useOnboarding();

  return (
    <div className="fixed inset-0 z-[9999]">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm"></div>

      {/* Spotlight effect */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
      </div>

      {/* Tooltip */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl px-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border-4 border-blue-500 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold opacity-90">
                Step {currentStep + 1} of {totalSteps}
              </span>
              <button
                onClick={skipOnboarding}
                className="text-white/80 hover:text-white text-sm font-medium"
              >
                Skip Tour
              </button>
            </div>
            <h2 className="text-3xl font-bold mb-2">{step.title}</h2>
            <div className="w-full bg-white/20 rounded-full h-2">
              <div
                className="bg-white h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Content */}
          <div className="p-8">
            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
              {step.description}
            </p>

            {/* Special content for specific steps */}
            {step.id === 'welcome' && (
              <div className="bg-blue-50 dark:bg-blue-900/30 rounded-xl p-6 mb-6">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                  🚀 What makes FLUX special?
                </h3>
                <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                  <li>✅ <strong>7 specialized AI agents</strong> for every role</li>
                  <li>✅ <strong>Real-time collaboration</strong> with live cursors & video</li>
                  <li>✅ <strong>Voice control</strong> for hands-free workflows</li>
                  <li>✅ <strong>10+ integrations</strong> with your favorite tools</li>
                  <li>✅ <strong>Advanced analytics</strong> with 6 chart types</li>
                  <li>✅ <strong>Never lose context</strong> - all conversations saved</li>
                </ul>
              </div>
            )}

            {step.id === 'keyboard-shortcuts' && (
              <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6 mb-6">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                  ⚡ Essential Shortcuts
                </h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2">
                    <kbd className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded">Ctrl+K</kbd>
                    <span className="text-gray-700 dark:text-gray-300">Command Palette</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <kbd className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded">1-9</kbd>
                    <span className="text-gray-700 dark:text-gray-300">Navigate Pages</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <kbd className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded">?</kbd>
                    <span className="text-gray-700 dark:text-gray-300">Show Shortcuts</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <kbd className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded text-xs">Ctrl+Shift+M</kbd>
                    <span className="text-gray-700 dark:text-gray-300">Call Messi ⚽</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <kbd className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded text-xs">Ctrl+Shift+R</kbd>
                    <span className="text-gray-700 dark:text-gray-300">Call Ronaldo ⚽</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <kbd className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded text-xs">Ctrl+Shift+N</kbd>
                    <span className="text-gray-700 dark:text-gray-300">Call Neymar ⚽</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="bg-gray-50 dark:bg-gray-900 px-8 py-6 flex items-center justify-between">
            <button
              onClick={previousStep}
              disabled={currentStep === 0}
              className={`px-6 py-3 rounded-lg font-semibold transition ${
                currentStep === 0
                  ? 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                  : 'bg-gray-300 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-400 dark:hover:bg-gray-600'
              }`}
            >
              ← Previous
            </button>

            <div className="flex gap-2">
              {Array.from({ length: totalSteps }).map((_, idx) => (
                <div
                  key={idx}
                  className={`w-2 h-2 rounded-full transition-all ${
                    idx === currentStep
                      ? 'bg-blue-600 w-8'
                      : idx < currentStep
                      ? 'bg-blue-400'
                      : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                ></div>
              ))}
            </div>

            <button
              onClick={nextStep}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition"
            >
              {currentStep === totalSteps - 1 ? '🎉 Get Started!' : 'Next →'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Feature Tooltip Component (for contextual help)
export const FeatureTooltip: React.FC<{
  featureId: string;
  title: string;
  description: string;
  children: ReactNode;
}> = ({ featureId, title, description, children }) => {
  const { hasSeenFeature, markFeatureAsSeen, isNewUser } = useOnboarding();
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    if (isNewUser && !hasSeenFeature(featureId)) {
      // Show tooltip after 500ms delay
      const timer = setTimeout(() => setShowTooltip(true), 500);
      return () => clearTimeout(timer);
    }
  }, [isNewUser, hasSeenFeature, featureId]);

  const handleDismiss = () => {
    setShowTooltip(false);
    markFeatureAsSeen(featureId);
  };

  return (
    <div className="relative">
      {children}
      {showTooltip && (
        <div className="absolute z-50 top-full mt-2 left-0 w-80 bg-blue-600 text-white rounded-xl shadow-2xl p-4 animate-bounce">
          <button
            onClick={handleDismiss}
            className="absolute top-2 right-2 text-white/80 hover:text-white"
          >
            ✕
          </button>
          <h4 className="font-bold mb-1">{title}</h4>
          <p className="text-sm opacity-90">{description}</p>
          <div className="absolute -top-2 left-4 w-4 h-4 bg-blue-600 transform rotate-45"></div>
        </div>
      )}
    </div>
  );
};
