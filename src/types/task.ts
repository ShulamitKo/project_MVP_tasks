export type TaskPriority = 'high' | 'medium' | 'low';
export type TaskCategory = 'work' | 'personal' | 'study' | 'shopping' | 'family';
export type TaskRepeat = 'none' | 'daily' | 'weekly' | 'monthly';

export interface Task {
  id?: number;
  title: string;
  description: string;
  dueDate: string;
  dueTime: string;
  category: TaskCategory;
  priority: TaskPriority;
  location?: string;
  reminder: string;
  repeat: TaskRepeat;
  isCompleted: boolean;
  isFavorite: boolean;
} 