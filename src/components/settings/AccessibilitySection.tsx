import React from 'react';
import { Type, ZoomIn, Timer } from 'lucide-react';
import ToggleSwitch from '../common/ToggleSwitch';
import { useAccessibility } from '../../contexts/AccessibilityContext';

const AccessibilitySection: React.FC = () => {
  const { settings, updateSettings } = useAccessibility();

  const fontSizeOptions = [
    { value: 'small', label: 'קטן' },
    { value: 'medium', label: 'בינוני' },
    { value: 'large', label: 'גדול' }
  ] as const;

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
                  onClick={() => updateSettings({ fontSize: option.value })}
                  className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                    settings.fontSize === option.value
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
            {/* תצוגה מקדימה */}
            <div className={`mt-3 p-4 bg-gray-50 rounded-lg ${
              settings.fontSize === 'small' ? 'text-sm' :
              settings.fontSize === 'large' ? 'text-lg' : 'text-base'
            }`}>
              <p>דוגמה לגודל הטקסט הנבחר</p>
            </div>
          </div>

          {/* ניגודיות גבוהה */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div>
                <p className="font-medium">ניגודיות גבוהה</p>
                <p className="text-sm text-gray-500">הגברת הניגודיות בין צבעים</p>
              </div>
            </div>
            <ToggleSwitch
              checked={settings.highContrast}
              onChange={(checked: boolean) => updateSettings({ highContrast: checked })}
            />
          </div>

          {/* הפחתת אנימציות */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Timer className="w-5 h-5 text-gray-500" />
              <div>
                <p className="font-medium">הפחתת אנימציות</p>
                <p className="text-sm text-gray-500">הפחתת אנימציות ומעברים</p>
              </div>
            </div>
            <ToggleSwitch
              checked={settings.animationReduced}
              onChange={(checked: boolean) => updateSettings({ animationReduced: checked })}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AccessibilitySection; 