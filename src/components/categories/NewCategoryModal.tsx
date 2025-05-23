import React, { useState } from 'react';
import { X } from 'lucide-react';
import { ColorType, Category, CategoryFormData } from '../../types/category';

interface NewCategoryModalProps {
  onClose: () => void;
  onSubmit: (formData: CategoryFormData) => Promise<void>;
  initialCategory?: Category;
  isLoading?: boolean;
}

const NewCategoryModal: React.FC<NewCategoryModalProps> = ({ onClose, onSubmit, initialCategory, isLoading }) => {
  const [name, setName] = useState(initialCategory?.name || '');
  const [selectedColor, setSelectedColor] = useState<ColorType>(initialCategory?.color || 'blue');
  const [error] = useState<string | null>(null);

  const colors: { id: ColorType; label: string; class: string }[] = [
    { id: 'blue', label: 'כחול', class: 'bg-blue-500' },
    { id: 'green', label: 'ירוק', class: 'bg-green-500' },
    { id: 'yellow', label: 'צהוב', class: 'bg-yellow-500' },
    { id: 'red', label: 'אדום', class: 'bg-red-500' },
    { id: 'purple', label: 'סגול', class: 'bg-purple-500' },
    { id: 'pink', label: 'ורוד', class: 'bg-pink-500' },
    { id: 'indigo', label: 'אינדיגו', class: 'bg-indigo-500' },
    { id: 'teal', label: 'טורקיז', class: 'bg-teal-500' },
    { id: 'orange', label: 'כתום', class: 'bg-orange-500' },
    { id: 'cyan', label: 'תכלת', class: 'bg-cyan-500' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isLoading) return;
    
    try {
      onClose();
      
      await onSubmit({
        name,
        color: selectedColor
      });
    } catch (error) {
      console.error('Failed to create category:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-md">
        <div className="p-4 border-b flex items-center justify-between">
          <h2 className="text-lg font-semibold">
            {initialCategory ? 'עריכת קטגוריה' : 'קטגוריה חדשה'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              שם הקטגוריה
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="הכנס שם קטגוריה"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              צבע
            </label>
            <div className="grid grid-cols-5 gap-2">
              {colors.map((color) => (
                <button
                  key={color.id}
                  type="button"
                  onClick={() => setSelectedColor(color.id)}
                  className={`w-8 h-8 rounded-full ${color.class} ${
                    selectedColor === color.id ? 'ring-2 ring-offset-2 ring-blue-500' : ''
                  }`}
                  title={color.label}
                />
              ))}
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <button
              type="submit"
              className={`flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600
                flex items-center justify-center gap-2`}
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>מעבד...</span>
                </>
              ) : (
                initialCategory ? 'שמור שינויים' : 'הוספה'
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200"
            >
              ביטול
            </button>
          </div>
        </form>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default NewCategoryModal; 