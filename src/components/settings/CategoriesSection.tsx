import React, { useState, useEffect } from 'react';
import { Tag, Edit, Trash2 } from 'lucide-react';
import NewCategoryModal from '../categories/NewCategoryModal';
import type { Category, NewCategory, ColorType, CategoryFormData } from '../../backend/types/models';
import { categoriesApi } from '../../backend/api/categories';

interface CategoriesSectionProps {
  categories: Category[];
  setCategories: (categories: Category[]) => void;
  onAddCategory: (category: NewCategory) => void;
  onEditCategory: (id: string, updates: Partial<NewCategory>) => void;
  onDeleteCategory: (id: string) => void;
}

const CategoriesSection: React.FC<CategoriesSectionProps> = ({
  categories,
  setCategories,
  onAddCategory,
  onEditCategory,
  onDeleteCategory
}) => {
  const [showNewCategory, setShowNewCategory] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

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

  // טעינת הקטגוריות
  const loadCategories = async (userId: string) => {
    setLoading(true);
    const { data, error } = await categoriesApi.getAll(userId);
    
    if (error) {
      setError('שגיאה בטעינת הקטגוריות');
    } else {
      // המרה מפורשת של הצבע ל-ColorType
      const typedCategories = (data || []).map(cat => ({
        ...cat,
        color: cat.color as ColorType
      }));
      setCategories(typedCategories);
    }
    setLoading(false);
  };

  // מחיקת קטגוריה
  const handleDeleteCategory = async (categoryId: string) => {
    try {
      const { error } = await categoriesApi.delete(categoryId);
      
      if (error) {
        if (error.message.includes('משימות פעילות')) {
          setError('לא ניתן למחוק קטגוריה שיש בה משימות פעילות');
        } else {
          setError('שגיאה במחיקת הקטגוריה');
        }
        return;
      }

      setCategories(categories.filter(cat => cat.id !== categoryId));
    } catch (err) {
      setError('שגיאה לא צפויה במחיקת הקטגוריה');
    }
  };

  // הוספת קטגוריה חדשה
  const handleAddCategory = async (newCategoryData: NewCategory) => {
    try {
      const newCategory = {
        ...newCategoryData,
        user_id: 'current-user-id',
        count: 0,
        color: newCategoryData.color as ColorType
      };

      const { data, error } = await categoriesApi.create(newCategory);
      
      if (error) {
        setError('שגיאה ביצירת הקטגוריה');
        return;
      }

      if (data) {
        const typedCategory = {
          ...data,
          color: data.color as ColorType
        };
        setCategories([...categories, typedCategory]);
      }
    } catch (err) {
      setError('שגיאה לא צפויה ביצירת הקטגוריה');
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
                        alert('לא ניתן למחוק קטגוריה שיש בה משימות');
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
            className="w-full mt-2 px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-blue-500 hover:text-blue-500 transition-colors"
          >
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
          onSubmit={(formData: CategoryFormData) => {
            if (editingCategory) {
              onEditCategory(editingCategory.id, formData);
            } else {
              // הוספת השדות החסרים לפני שליחה ל-API
              const newCategory: NewCategory = {
                ...formData,
                user_id: 'current-user-id', // יוחלף ב-ID אמיתי מהאימות
                count: 0
              };
              handleAddCategory(newCategory);
            }
            setShowNewCategory(false);
            setEditingCategory(null);
          }}
          initialCategory={editingCategory || undefined}
        />
      )}
    </section>
  );
};

export default CategoriesSection;