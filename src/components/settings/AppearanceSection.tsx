import React from 'react';
import { Moon, Palette } from 'lucide-react';
import ToggleSwitch from '../common/ToggleSwitch';
import { useTheme } from '../../contexts/ThemeContext';

const AppearanceSection: React.FC = () => {
  const { isDarkMode, toggleDarkMode } = useTheme();

  return (
    <section className="bg-white rounded-xl shadow-sm">
      <div className="p-6">
        <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
          <Palette className="w-5 h-5 text-gray-500" />
          הגדרות תצוגה
        </h2>

        <div className="space-y-6">
          {/* מצב כהה */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Moon className="w-5 h-5 text-gray-500" />
              <div>
                <p className="font-medium">מצב כהה</p>
                <p className="text-sm text-gray-500">התאמת התצוגה לשימוש בלילה</p>
              </div>
            </div>
            <ToggleSwitch
              checked={isDarkMode}
              onChange={toggleDarkMode}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AppearanceSection;