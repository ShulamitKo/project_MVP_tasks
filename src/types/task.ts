export type TaskPriority = 'high' | 'medium' | 'low';
export type TaskRepeat = 'none' | 'daily' | 'weekly' | 'monthly';
export type TaskCategory = string;

export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  dueTime: string;
  category: TaskCategory;
  priority: TaskPriority;
  location: string;
  reminder: string;
  repeat: TaskRepeat;
  isCompleted: boolean;
  isFavorite: boolean;
}

export type NewTask = Omit<Task, 'id'>; 