import React from 'react';
import { Type, ZoomIn } from 'lucide-react';
import { useAccessibility } from '../../contexts/AccessibilityContext';

const AccessibilitySection: React.FC = () => {
  const { settings, updateSettings } = useAccessibility();

  const fontSizeOptions = [
    { value: 'small', label: 'קטן' },
    { value: 'medium', label: 'בינוני' },
    { value: 'large', label: 'גדול' }
  ] as const;

  const handleFontSizeChange = (size: 'small' | 'medium' | 'large') => {
    console.log('Button clicked with size:', size);
    console.log('Current settings:', settings);
    updateSettings({ fontSize: size });
  };

  return (
    <section className="bg-white rounded-xl shadow-sm">
      <div className="p-6">
        <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
          <ZoomIn className="w-5 h-5 text-gray-500" />
          הגדרות נגישות
        </h2>

        <div className="space-y-6">
          {/* גודל טקסט */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Type className="w-5 h-5 text-gray-500" />
              <p className="font-medium">גודל טקסט</p>
            </div>
            <div className="flex gap-2">
              {fontSizeOptions.map(option => (
                <button
                  key={option.value}
                  onClick={() => handleFontSizeChange(option.value)}
                  className={`px-6 py-2.5 rounded-lg font-medium transition-all ${
                    settings.fontSize === option.value
                      ? 'bg-blue-500 text-white shadow-md scale-105'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
            {/* תצוגה מקדימה */}
            <div className="mt-3 p-4 bg-gray-50 rounded-lg">
              <p>דוגמה לגודל הטקסט הנבחר</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AccessibilitySection; 