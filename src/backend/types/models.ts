export interface User {
  id: string;
  email: string;
  created_at: string;
  updated_at?: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  due_date?: string;
  due_time?: string;
  priority: 'high' | 'medium' | 'low';
  category_id: string;
  is_completed: boolean;
  user_id: string;
  created_at: string;
  updated_at?: string;
}

export type ColorType = 'blue' | 'green' | 'yellow' | 'red' | 'purple' | 'pink' | 'indigo' | 'teal' | 'orange' | 'cyan';

export interface Category {
  id: string;
  name: string;
  color: ColorType;
  user_id: string;
  count: number;
  created_at: string;
  updated_at?: string;
}

export interface NewCategory {
  name: string;
  color: ColorType;
  user_id: string;
  count: number;
}

// טיפוס חדש לטופס
export interface CategoryFormData {
  name: string;
  color: ColorType;
}

// טיפוסים לתשובות מהשרת
export type DBResponse<T> = {
  data: T | null;
  error: Error | null;
}; 