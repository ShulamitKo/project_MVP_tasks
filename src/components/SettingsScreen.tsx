import React from 'react';
import ProfileSection from './settings/ProfileSection';
import NotificationsSection from './settings/NotificationsSection';
import AppearanceSection from './settings/AppearanceSection';
import CategoriesSection from './settings/CategoriesSection';
import AboutSection from './settings/AboutSection';

const SettingsScreen: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b px-6 py-4">
        <h1 className="text-2xl font-bold text-gray-800">הגדרות</h1>
      </header>

      <div className="max-w-2xl mx-auto p-6 space-y-6">
        <ProfileSection />
        <NotificationsSection />
        <AppearanceSection />
        <CategoriesSection />
        <AboutSection />

        {/* Logout Button */}
        <button className="w-full p-4 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition-colors">
          התנתקות
        </button>
      </div>
    </div>
  );
};

export default SettingsScreen;