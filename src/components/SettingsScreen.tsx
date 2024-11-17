import React from 'react';
import ProfileSection from './settings/ProfileSection';
import NotificationsSection from './settings/NotificationsSection';
import AppearanceSection from './settings/AppearanceSection';
import CategoriesSection from './settings/CategoriesSection';
import AboutSection from './settings/AboutSection';
import { Category, NewCategory } from '../types/category';

interface SettingsScreenProps {
  categories: Category[];
  onAddCategory: (category: NewCategory) => void;
  onEditCategory: (id: string, updates: Partial<NewCategory>) => void;
  onDeleteCategory: (id: string) => void;
}

const SettingsScreen: React.FC<SettingsScreenProps> = ({ categories, onAddCategory, onEditCategory, onDeleteCategory }) => {
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
        <CategoriesSection categories={categories} onAddCategory={onAddCategory} onEditCategory={onEditCategory} onDeleteCategory={onDeleteCategory} />
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