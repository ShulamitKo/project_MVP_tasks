export type ColorType = 'blue' | 'green' | 'yellow' | 'red' | 'purple' | 'pink' | 'indigo' | 'teal' | 'orange' | 'cyan';

export interface Category {
  id: string;
  name: string;
  count: number;
  color: ColorType;
}

export interface NewCategory {
  name: string;
  color: ColorType;
} 