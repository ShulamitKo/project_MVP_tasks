import React, { useState } from 'react';
import { X } from 'lucide-react';

type ColorType = 'blue' | 'green' | 'yellow' | 'red' | 'purple' | 'pink' | 'indigo' | 'teal' | 'orange' | 'cyan';

interface Category {
  id: string;
  name: string;
  count: number;
  color: ColorType;
}

interface NewCategoryModalProps {
  onClose: () => void;
  onSubmit: (category: { name: string; color: ColorType }) => void;
  initialCategory?: Category;
}

const NewCategoryModal: React.FC<NewCategoryModalProps> = ({ onClose, onSubmit, initialCategory }) => {
  const [categoryName, setCategoryName] = useState(initialCategory?.name || '');
  const [selectedColor, setSelectedColor] = useState<ColorType>(initialCategory?.color || 'blue');

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (categoryName.trim()) {
      onSubmit({ name: categoryName, color: selectedColor });
      onClose();
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
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
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
              className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              {initialCategory ? 'שמירת שינויים' : 'הוספה'}
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
      </div>
    </div>
  );
};

export default NewCategoryModal; 