import React, { createContext, useContext, useState, useEffect } from 'react';

interface AccessibilitySettings {
  fontSize: 'small' | 'medium' | 'large';
  highContrast: boolean;
  animationReduced: boolean;
}

interface AccessibilityContextType {
  settings: AccessibilitySettings;
  updateSettings: (newSettings: Partial<AccessibilitySettings>) => void;
}

const defaultSettings: AccessibilitySettings = {
  fontSize: 'medium',
  highContrast: false,
  animationReduced: false
};

const AccessibilityContext = createContext<AccessibilityContextType>({
  settings: defaultSettings,
  updateSettings: () => {}
});

export const AccessibilityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<AccessibilitySettings>(() => {
    const savedSettings = localStorage.getItem('accessibilitySettings');
    const initialSettings = savedSettings ? JSON.parse(savedSettings) : defaultSettings;
    console.log('Initial settings:', initialSettings);
    return initialSettings;
  });

  useEffect(() => {
    console.log('Settings updated:', settings);
    localStorage.setItem('accessibilitySettings', JSON.stringify(settings));
    
    // עדכון data attributes על תגית ה-html
    const htmlElement = document.documentElement;
    
    // גודל טקסט
    htmlElement.setAttribute('data-textsize', settings.fontSize);
    
    // ניגודיות גבוהה
    htmlElement.classList.toggle('high-contrast', settings.highContrast);
    
    // הפחתת אנימציות
    htmlElement.classList.toggle('reduce-animations', settings.animationReduced);
    
  }, [settings]);

  const updateSettings = (newSettings: Partial<AccessibilitySettings>) => {
    console.log('Updating settings with:', newSettings);
    setSettings(prev => {
      const updated = { ...prev, ...newSettings };
      console.log('New settings will be:', updated);
      return updated;
    });
  };

  return (
    <AccessibilityContext.Provider value={{ settings, updateSettings }}>
      {children}
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
}; 