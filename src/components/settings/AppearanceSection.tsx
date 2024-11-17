import React, { useState } from 'react';
import { Palette } from 'lucide-react';
import ToggleSwitch from './ToggleSwitch';

const AppearanceSection: React.FC = () => {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <section className="bg-white rounded-xl shadow-sm">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Palette className="w-5 h-5 text-gray-500" />
          <h2 className="text-lg font-semibold">תצוגה</h2>
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">מצב כהה</p>
            <p className="text-sm text-gray-500">הפעל מצב כהה לשימוש בלילה</p>
          </div>
          <ToggleSwitch
            checked={darkMode}
            onChange={setDarkMode}
          />
        </div>
      </div>
    </section>
  );
};

export default AppearanceSection;