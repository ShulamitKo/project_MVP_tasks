import React from 'react';
import ProfileSection from './settings/ProfileSection';
import NotificationsSection from './settings/NotificationsSection';
import AppearanceSection from './settings/AppearanceSection';
import AccessibilitySection from './settings/AccessibilitySection';
import CategoriesSection from './settings/CategoriesSection';
import AboutSection from './settings/AboutSection';
import { useData } from '../contexts/DataContext';

const SettingsScreen: React.FC = () => {
  const { categories } = useData();

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <header className="bg-white border-b px-6 py-4 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-800">הגדרות</h1>
      </header>

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto p-6 space-y-6">
          <ProfileSection />
          <NotificationsSection />
          <AppearanceSection />
          <AccessibilitySection />
          <CategoriesSection categories={categories} />
          <AboutSection />
        </div>
      </div>
    </div>
  );
};

export default SettingsScreen;