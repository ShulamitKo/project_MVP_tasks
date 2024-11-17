import React from 'react';
import { Tag, ChevronLeft } from 'lucide-react';

const CategoriesSection: React.FC = () => {
  return (
    <section className="bg-white rounded-xl shadow-sm">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Tag className="w-5 h-5 text-gray-500" />
          <h2 className="text-lg font-semibold">ניהול קטגוריות</h2>
        </div>
        
        <div className="space-y-2">
          {['עבודה', 'אישי', 'משפחה'].map((category) => (
            <div key={category} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span>{category}</span>
              <ChevronLeft className="w-5 h-5 text-gray-400" />
            </div>
          ))}
          <button className="w-full mt-2 px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-blue-500 hover:text-blue-500 transition-colors">
            הוספת קטגוריה חדשה
          </button>
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;