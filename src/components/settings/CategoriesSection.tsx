import React, { useState } from 'react';
import { Tag, Edit, Trash2, Plus } from 'lucide-react';
import NewCategoryModal from '../categories/NewCategoryModal';
import { Category, ColorType } from '../../types/category';
import { useData } from '../../contexts/DataContext';

interface CategoriesSectionProps {
  categories: Category[];
}

type CategoryFormData = {
  name: string;
  color: ColorType;
};

interface NotificationType {
  type: 'success' | 'error';
  message: string;
}

const CategoriesSection: React.FC<CategoriesSectionProps> = ({ categories }) => {
  const { createCategory, updateCategory, deleteCategory, refreshData } = useData();
  const [showNewCategory, setShowNewCategory] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const getColorClass = (color: ColorType) => {
    const colors: Record<ColorType, string> = {
      blue: 'bg-blue-500',
      green: 'bg-green-500',
      yellow: 'bg-yellow-500',
      red: 'bg-red-500',
      purple: 'bg-purple-500',
      pink: 'bg-pink-500',
      indigo: 'bg-indigo-500',
      teal: 'bg-teal-500',
      orange: 'bg-orange-500',
      cyan: 'bg-cyan-500'
    };
    return colors[color];
  };

  // הוספת קטגוריה חדשה
  const handleAddCategory = async (formData: CategoryFormData) => {
    try {
      await createCategory(formData);
      setShowNewCategory(false);
    } catch (error) {
      console.error('Failed to add category:', error);
    }
  };

  // עדכון קטגוריה
  const handleEditCategory = async (id: string, formData: CategoryFormData) => {
    try {
      await updateCategory(id, formData);
      setEditingCategory(null);
    } catch (error) {
      console.error('Failed to update category:', error);
    }
  };

  // מחיקת קטגוריה
  const handleDeleteCategory = async (categoryId: string) => {
    try {
      await deleteCategory(categoryId);
    } catch (error) {
      console.error('Failed to delete category:', error);
    }
  };

  return (
    <section className="bg-white rounded-xl shadow-sm">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Tag className="w-5 h-5 text-gray-500" />
          <h2 className="text-lg font-semibold">ניהול קטגוריות</h2>
        </div>
        
        <div className="space-y-2">
          {categories
            .filter(cat => cat.id !== 'all')
            .map((category) => (
              <div 
                key={category.id} 
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <span className={`w-3 h-3 rounded-full ${getColorClass(category.color)}`} />
                  <span>{category.name}</span>
                  <span className="text-sm text-gray-500">({category.count} משימות)</span>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setEditingCategory(category)}
                    className="p-2 hover:bg-gray-200 rounded-lg text-gray-600"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => {
                      if (category.count === 0 && confirm('האם אתה בטוח שברצונך למחוק קטגוריה זו?')) {
                        handleDeleteCategory(category.id);
                      } else if (category.count > 0) {
                        console.error('לא ניתן למחוק קטגוריה שיש בה משימות');
                      }
                    }}
                    className="p-2 hover:bg-red-100 rounded-lg text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}

          <button
            onClick={() => setShowNewCategory(true)}
            className="w-full mt-2 px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-blue-500 hover:text-blue-500 transition-colors flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            הוספת קטגוריה חדשה
          </button>
        </div>
      </div>

      {/* מודאל הוספת/עריכת קטגוריה */}
      {(showNewCategory || editingCategory) && (
        <NewCategoryModal
          onClose={() => {
            setShowNewCategory(false);
            setEditingCategory(null);
          }}
          onSubmit={async (formData) => {
            if (editingCategory) {
              await handleEditCategory(editingCategory.id, formData);
            } else {
              await handleAddCategory(formData);
            }
          }}
          initialCategory={editingCategory || undefined}
        />
      )}
    </section>
  );
};

export default CategoriesSection;