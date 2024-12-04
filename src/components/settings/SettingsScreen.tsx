import React from 'react';
import { Category, NewCategory } from '../../types/category';
import ProfileSection from './ProfileSection';
import NotificationsSection from './NotificationsSection';
import AppearanceSection from './AppearanceSection';
import AccessibilitySection from './AccessibilitySection';
import CategoriesSection from './CategoriesSection';
import AboutSection from './AboutSection';

interface SettingsScreenProps {
  categories: Category[];
  onAddCategory: (category: NewCategory) => void;
  onEditCategory: (id: string, updates: Partial<NewCategory>) => void;
  onDeleteCategory: (id: string) => void;
}

const SettingsScreen: React.FC<SettingsScreenProps> = ({ 
  categories, 
  onAddCategory, 
  onEditCategory, 
  onDeleteCategory 
}) => {
  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <div className="bg-white border-b px-6 py-4 shadow-sm">
        <h1 className="text-2xl font-bold">הגדרות</h1>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto p-6 space-y-6">
          <ProfileSection />
          <NotificationsSection />
          <AppearanceSection />
          <AccessibilitySection />
          <CategoriesSection 
            categories={categories} 
            onAddCategory={onAddCategory} 
            onEditCategory={onEditCategory} 
            onDeleteCategory={onDeleteCategory} 
          />
          <AboutSection />

          <button className="w-full p-4 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition-colors mb-6 settings-option">
            התנתקות
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsScreen; 