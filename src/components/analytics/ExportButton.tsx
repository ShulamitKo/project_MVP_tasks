import React from 'react';
import { Download, FileDown } from 'lucide-react';
import { Task } from '../../types/task';
import { Category } from '../../types/category';

interface ExportButtonProps {
  type: 'categories' | 'priority' | 'all';
  tasks: Task[];
  categories: Category[];
  startDate: Date;
  endDate: Date;
  variant?: 'icon' | 'full';
}

const ExportButton: React.FC<ExportButtonProps> = ({ 
  type, 
  tasks, 
  categories, 
  startDate, 
  endDate,
  variant = 'icon'
}) => {
  const handleExport = () => {
    const filteredTasks = tasks.filter(task => {
      const taskDate = new Date(task.dueDate);
      return taskDate >= startDate && taskDate <= endDate;
    });

    // רשימת המשימות המפורטת - ממוינת לפי תאריך
    const tasksDetails = filteredTasks
      .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
      .map(task => ({
        'תאריך': new Date(task.dueDate).toLocaleDateString('he-IL'),
        'כותרת': task.title,
        'קטגוריה': categories.find(cat => cat.id === task.category)?.name || '',
        'עדיפות': task.priority === 'high' ? 'גבוהה' : task.priority === 'medium' ? 'בינונית' : 'נמוכה',
        'סטטוס': task.isCompleted ? 'הושלם' : 'ממתין'
      }));

    let csvContent: string[] = [];
    let filename = '';

    switch (type) {
      case 'categories': {
        const categoriesStats = categories
          .filter(cat => cat.id !== 'all')
          .map(category => {
            const categoryTasks = filteredTasks.filter(task => task.category === category.id);
            const completedTasks = categoryTasks.filter(task => task.isCompleted);
            return {
              קטגוריה: category.name,
              'סה"כ משימות': categoryTasks.length,
              הושלמו: completedTasks.length,
              ממתינות: categoryTasks.length - completedTasks.length,
              'אחוז השלמה': categoryTasks.length ? 
                `${Math.round((completedTasks.length / categoryTasks.length) * 100)}%` : 
                '0%'
            };
          });

        csvContent = [
          ['פילוח לפי קטגוריות'],
          Object.keys(categoriesStats[0] || {}),
          ...categoriesStats.map(stat => Object.values(stat)),
          [''],
          ['רשימת משימות מפורטת'],
          Object.keys(tasksDetails[0] || {}),
          ...tasksDetails.map(task => Object.values(task))
        ].map(row => row.join(','));
        
        filename = 'פילוח_לפי_קטגוריות';
        break;
      }

      case 'priority': {
        const priorityStats = ['high', 'medium', 'low'].map(priority => {
          const priorityTasks = filteredTasks.filter(task => task.priority === priority);
          const completedTasks = priorityTasks.filter(task => task.isCompleted);
          return {
            עדיפות: priority === 'high' ? 'גבוהה' : priority === 'medium' ? 'בינונית' : 'נמוכה',
            'סה"כ משימות': priorityTasks.length,
            הושלמו: completedTasks.length,
            ממתינות: priorityTasks.length - completedTasks.length,
            'אחוז השלמה': priorityTasks.length ? 
              `${Math.round((completedTasks.length / priorityTasks.length) * 100)}%` : 
              '0%'
          };
        });

        csvContent = [
          ['פילוח לפי עדיפויות'],
          Object.keys(priorityStats[0] || {}),
          ...priorityStats.map(stat => Object.values(stat)),
          [''],
          ['רשימת משימות מפורטת'],
          Object.keys(tasksDetails[0] || {}),
          ...tasksDetails.map(task => Object.values(task))
        ].map(row => row.join(','));

        filename = 'פילוח_לפי_עדיפויות';
        break;
      }

      case 'all': {
        // מכין את הנתונים לייצוא
        const generalStats = {
          'טווח תאריכים': `${startDate.toLocaleDateString('he-IL')} - ${endDate.toLocaleDateString('he-IL')}`,
          'סה"כ משימות': filteredTasks.length,
          'הושלמו': filteredTasks.filter(task => task.isCompleted).length,
          'ממתינות': filteredTasks.filter(task => !task.isCompleted).length,
          'אחוז השלמה': `${Math.round((filteredTasks.filter(task => task.isCompleted).length / filteredTasks.length) * 100)}%`
        };

        const categoriesStats = categories
          .filter(cat => cat.id !== 'all')
          .map(category => {
            const categoryTasks = filteredTasks.filter(task => task.category === category.id);
            const completedTasks = categoryTasks.filter(task => task.isCompleted);
            return {
              'קטגוריה': category.name,
              'סה"כ משימות': categoryTasks.length,
              'הושלמו': completedTasks.length,
              'ממתינות': categoryTasks.length - completedTasks.length,
              'אחוז השלמה': categoryTasks.length ? 
                `${Math.round((completedTasks.length / categoryTasks.length) * 100)}%` : 
                '0%'
            };
          });

        const priorityStats = ['high', 'medium', 'low'].map(priority => {
          const priorityTasks = filteredTasks.filter(task => task.priority === priority);
          const completedTasks = priorityTasks.filter(task => task.isCompleted);
          return {
            'עדיפות': priority === 'high' ? 'גבוהה' : priority === 'medium' ? 'בינונית' : 'נמוכה',
            'סה"כ משימות': priorityTasks.length,
            'הושלמו': completedTasks.length,
            'ממתינות': priorityTasks.length - completedTasks.length,
            'אחוז השלמה': priorityTasks.length ? 
              `${Math.round((completedTasks.length / priorityTasks.length) * 100)}%` : 
              '0%'
          };
        });

        csvContent = [
          ['סיכום כללי'],
          ...Object.entries(generalStats).map(([key, value]) => [key, value]),
          [''],
          ['פילוח לפי קטגוריות'],
          Object.keys(categoriesStats[0] || {}),
          ...categoriesStats.map(stat => Object.values(stat)),
          [''],
          ['פילוח לפי עדיפויות'],
          Object.keys(priorityStats[0] || {}),
          ...priorityStats.map(stat => Object.values(stat)),
          [''],
          ['רשימת משימות מפורטת'],
          Object.keys(tasksDetails[0] || {}),
          ...tasksDetails.map(task => Object.values(task))
        ].map(row => row.join(','));

        filename = 'דוח_סטטיסטיקות_מלא';
        break;
      }
    }

    // בדיקה שיש נתונים לייצוא
    if (filteredTasks.length === 0) {
      alert('אין נתונים לייצוא בטווח התאריכים הנבחר');
      return;
    }

    const blob = new Blob(['\ufeff' + csvContent.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}_${startDate.toLocaleDateString('he-IL')}_${endDate.toLocaleDateString('he-IL')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getButtonTitle = () => {
    switch (type) {
      case 'categories':
        return 'ייצא נתוני פילוח לפי קטגוריות לקובץ CSV';
      case 'priority':
        return 'ייצא נתוני פילוח לפי עדיפויות לקובץ CSV';
      case 'all':
        return 'ייצא את כל נתוני הסטטיסטיקות לקובץ CSV';
      default:
        return 'ייצא נתונים לקובץ CSV';
    }
  };

  if (variant === 'full') {
    return (
      <button
        onClick={handleExport}
        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors"
        aria-label={getButtonTitle()}
        title={getButtonTitle()}
        role="button"
      >
        <FileDown className="w-4 h-4" aria-hidden="true" />
        <span>ייצוא כל הנתונים</span>
      </button>
    );
  }

  return (
    <button
      onClick={handleExport}
      className="flex items-center gap-2 px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
      aria-label={getButtonTitle()}
      title={getButtonTitle()}
      role="button"
    >
      <Download className="w-4 h-4" aria-hidden="true" />
      <span>ייצוא</span>
    </button>
  );
};

export default ExportButton; 