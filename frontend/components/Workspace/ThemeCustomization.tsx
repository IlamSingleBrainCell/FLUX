// components/Workspace/ThemeCustomization.tsx
import React, { useState, useEffect } from 'react';

interface Theme {
  id: string;
  name: string;
  description: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
  };
  fontSize: 'small' | 'medium' | 'large';
  fontFamily: 'inter' | 'roboto' | 'jetbrains-mono';
  mode: 'light' | 'dark' | 'auto';
}

interface ThemeCustomizationProps {
  onClose: () => void;
  isOpen: boolean;
  className?: string;
}

const defaultThemes: Theme[] = [
  {
    id: 'light',
    name: 'Light Mode',
    description: 'Clean and bright interface',
    colors: {
      primary: '#3b82f6',
      secondary: '#8b5cf6',
      accent: '#06b6d4',
      background: '#ffffff',
      surface: '#f8fafc',
      text: '#0f172a',
      textSecondary: '#64748b',
    },
    fontSize: 'medium',
    fontFamily: 'inter',
    mode: 'light',
  },
  {
    id: 'dark',
    name: 'Dark Mode',
    description: 'Easy on the eyes, perfect for night coding',
    colors: {
      primary: '#60a5fa',
      secondary: '#a78bfa',
      accent: '#22d3ee',
      background: '#0f172a',
      surface: '#1e293b',
      text: '#f1f5f9',
      textSecondary: '#94a3b8',
    },
    fontSize: 'medium',
    fontFamily: 'inter',
    mode: 'dark',
  },
  {
    id: 'ocean',
    name: 'Ocean Blue',
    description: 'Calm and professional',
    colors: {
      primary: '#0ea5e9',
      secondary: '#06b6d4',
      accent: '#14b8a6',
      background: '#f0f9ff',
      surface: '#e0f2fe',
      text: '#0c4a6e',
      textSecondary: '#075985',
    },
    fontSize: 'medium',
    fontFamily: 'inter',
    mode: 'light',
  },
  {
    id: 'sunset',
    name: 'Sunset',
    description: 'Warm and energetic',
    colors: {
      primary: '#f59e0b',
      secondary: '#ef4444',
      accent: '#ec4899',
      background: '#fffbeb',
      surface: '#fef3c7',
      text: '#78350f',
      textSecondary: '#92400e',
    },
    fontSize: 'medium',
    fontFamily: 'inter',
    mode: 'light',
  },
  {
    id: 'forest',
    name: 'Forest Green',
    description: 'Natural and soothing',
    colors: {
      primary: '#10b981',
      secondary: '#059669',
      accent: '#34d399',
      background: '#f0fdf4',
      surface: '#dcfce7',
      text: '#064e3b',
      textSecondary: '#065f46',
    },
    fontSize: 'medium',
    fontFamily: 'inter',
    mode: 'light',
  },
  {
    id: 'midnight',
    name: 'Midnight',
    description: 'Ultra dark mode for late night sessions',
    colors: {
      primary: '#818cf8',
      secondary: '#a78bfa',
      accent: '#c084fc',
      background: '#020617',
      surface: '#0f172a',
      text: '#e2e8f0',
      textSecondary: '#94a3b8',
    },
    fontSize: 'medium',
    fontFamily: 'jetbrains-mono',
    mode: 'dark',
  },
];

export const ThemeCustomization: React.FC<ThemeCustomizationProps> = ({
  onClose,
  isOpen,
  className = '',
}) => {
  const [selectedTheme, setSelectedTheme] = useState<Theme>(defaultThemes[0]);
  const [customTheme, setCustomTheme] = useState<Theme | null>(null);
  const [fontSize, setFontSize] = useState<'small' | 'medium' | 'large'>('medium');
  const [fontFamily, setFontFamily] = useState<'inter' | 'roboto' | 'jetbrains-mono'>('inter');
  const [activeTab, setActiveTab] = useState<'presets' | 'customize'>('presets');

  // Load saved theme from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('app-theme');
    if (saved) {
      try {
        const theme = JSON.parse(saved);
        setSelectedTheme(theme);
        setFontSize(theme.fontSize);
        setFontFamily(theme.fontFamily);
      } catch (e) {
        console.error('Failed to load theme:', e);
      }
    }
  }, []);

  // Apply theme
  const applyTheme = (theme: Theme) => {
    const root = document.documentElement;
    
    // Apply CSS variables
    root.style.setProperty('--color-primary', theme.colors.primary);
    root.style.setProperty('--color-secondary', theme.colors.secondary);
    root.style.setProperty('--color-accent', theme.colors.accent);
    root.style.setProperty('--color-background', theme.colors.background);
    root.style.setProperty('--color-surface', theme.colors.surface);
    root.style.setProperty('--color-text', theme.colors.text);
    root.style.setProperty('--color-text-secondary', theme.colors.textSecondary);

    // Apply font size
    const fontSizeMap = {
      small: '14px',
      medium: '16px',
      large: '18px',
    };
    root.style.setProperty('--font-size-base', fontSizeMap[theme.fontSize]);

    // Apply font family
    const fontFamilyMap = {
      inter: "'Inter', sans-serif",
      roboto: "'Roboto', sans-serif",
      'jetbrains-mono': "'JetBrains Mono', monospace",
    };
    root.style.setProperty('--font-family-base', fontFamilyMap[theme.fontFamily]);

    // Save to localStorage
    localStorage.setItem('app-theme', JSON.stringify(theme));

    setSelectedTheme(theme);
  };

  // Handle theme selection
  const handleSelectTheme = (theme: Theme) => {
    const updatedTheme = { ...theme, fontSize, fontFamily };
    applyTheme(updatedTheme);
  };

  // Create custom theme
  const handleCreateCustomTheme = () => {
    const newCustomTheme: Theme = {
      ...selectedTheme,
      id: 'custom',
      name: 'Custom Theme',
      description: 'Your personalized theme',
    };
    setCustomTheme(newCustomTheme);
    setActiveTab('customize');
  };

  // Update custom theme color
  const updateCustomColor = (key: keyof Theme['colors'], value: string) => {
    if (!customTheme) return;
    const updated = {
      ...customTheme,
      colors: { ...customTheme.colors, [key]: value },
    };
    setCustomTheme(updated);
    applyTheme(updated);
  };

  // Reset to default
  const handleReset = () => {
    applyTheme(defaultThemes[0]);
    setCustomTheme(null);
    setActiveTab('presets');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6">
      <div className={`bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden ${className}`}>
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 bg-gradient-to-r from-purple-50 to-pink-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-600 rounded-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">Theme Customization</h2>
                <p className="text-sm text-slate-500">Personalize your workspace appearance</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mt-4">
            <button
              onClick={() => setActiveTab('presets')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                activeTab === 'presets'
                  ? 'bg-white text-purple-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Preset Themes
            </button>
            <button
              onClick={() => setActiveTab('customize')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                activeTab === 'customize'
                  ? 'bg-white text-purple-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Customize
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)] custom-scrollbar">
          {activeTab === 'presets' ? (
            <div className="space-y-6">
              {/* Theme Grid */}
              <div className="grid grid-cols-3 gap-4">
                {defaultThemes.map(theme => (
                  <div
                    key={theme.id}
                    onClick={() => handleSelectTheme(theme)}
                    className={`cursor-pointer rounded-xl border-2 p-4 transition-all hover:shadow-lg ${
                      selectedTheme.id === theme.id
                        ? 'border-purple-600 shadow-md'
                        : 'border-slate-200'
                    }`}
                  >
                    {/* Theme Preview */}
                    <div
                      className="h-24 rounded-lg mb-3 p-3 flex flex-col justify-between"
                      style={{ backgroundColor: theme.colors.background }}
                    >
                      <div className="flex gap-2">
                        <div className="w-12 h-3 rounded" style={{ backgroundColor: theme.colors.primary }}></div>
                        <div className="w-12 h-3 rounded" style={{ backgroundColor: theme.colors.secondary }}></div>
                        <div className="w-12 h-3 rounded" style={{ backgroundColor: theme.colors.accent }}></div>
                      </div>
                      <div className="space-y-1">
                        <div className="h-2 w-full rounded" style={{ backgroundColor: theme.colors.surface }}></div>
                        <div className="h-2 w-3/4 rounded" style={{ backgroundColor: theme.colors.surface }}></div>
                      </div>
                    </div>

                    {/* Theme Info */}
                    <h3 className="font-bold text-slate-900 mb-1">{theme.name}</h3>
                    <p className="text-xs text-slate-500">{theme.description}</p>

                    {/* Selected Badge */}
                    {selectedTheme.id === theme.id && (
                      <div className="mt-2 inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Active
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Custom Theme Button */}
              <button
                onClick={handleCreateCustomTheme}
                className="w-full px-4 py-3 border-2 border-dashed border-slate-300 rounded-xl text-slate-600 hover:border-purple-600 hover:text-purple-600 transition-all flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Create Custom Theme
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Color Customization */}
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-4">Colors</h3>
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(customTheme?.colors || selectedTheme.colors).map(([key, value]) => (
                    <div key={key}>
                      <label className="block text-sm font-medium text-slate-700 mb-2 capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="color"
                          value={value}
                          onChange={(e) => updateCustomColor(key as keyof Theme['colors'], e.target.value)}
                          className="w-12 h-10 rounded border border-slate-300 cursor-pointer"
                        />
                        <input
                          type="text"
                          value={value}
                          onChange={(e) => updateCustomColor(key as keyof Theme['colors'], e.target.value)}
                          className="flex-1 px-3 py-2 border border-slate-300 rounded-lg font-mono text-sm"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Typography */}
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-4">Typography</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Font Size</label>
                    <select
                      value={fontSize}
                      onChange={(e) => {
                        const size = e.target.value as 'small' | 'medium' | 'large';
                        setFontSize(size);
                        applyTheme({ ...selectedTheme, fontSize: size });
                      }}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                    >
                      <option value="small">Small (14px)</option>
                      <option value="medium">Medium (16px)</option>
                      <option value="large">Large (18px)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Font Family</label>
                    <select
                      value={fontFamily}
                      onChange={(e) => {
                        const family = e.target.value as 'inter' | 'roboto' | 'jetbrains-mono';
                        setFontFamily(family);
                        applyTheme({ ...selectedTheme, fontFamily: family });
                      }}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                    >
                      <option value="inter">Inter</option>
                      <option value="roboto">Roboto</option>
                      <option value="jetbrains-mono">JetBrains Mono</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Preview */}
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-4">Preview</h3>
                <div
                  className="rounded-xl p-6 border-2"
                  style={{
                    backgroundColor: customTheme?.colors.background || selectedTheme.colors.background,
                    borderColor: customTheme?.colors.primary || selectedTheme.colors.primary,
                  }}
                >
                  <h4
                    className="text-xl font-bold mb-2"
                    style={{ color: customTheme?.colors.text || selectedTheme.colors.text }}
                  >
                    Preview Text
                  </h4>
                  <p
                    className="mb-4"
                    style={{ color: customTheme?.colors.textSecondary || selectedTheme.colors.textSecondary }}
                  >
                    This is how your customized theme will look in the workspace.
                  </p>
                  <div className="flex gap-2">
                    <button
                      className="px-4 py-2 rounded-lg text-white font-medium"
                      style={{ backgroundColor: customTheme?.colors.primary || selectedTheme.colors.primary }}
                    >
                      Primary Button
                    </button>
                    <button
                      className="px-4 py-2 rounded-lg text-white font-medium"
                      style={{ backgroundColor: customTheme?.colors.secondary || selectedTheme.colors.secondary }}
                    >
                      Secondary
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex justify-between">
          <button
            onClick={handleReset}
            className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            Reset to Default
          </button>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
