-- מחיקת האילוץ הקיים
ALTER TABLE public.tasks 
DROP CONSTRAINT IF EXISTS tasks_category_id_fkey;

-- הוספת האילוץ החדש שמונע מחיקת קטגוריה עם משימות
ALTER TABLE public.tasks 
ADD CONSTRAINT tasks_category_id_fkey 
FOREIGN KEY (category_id) 
REFERENCES public.categories(id) 
ON DELETE RESTRICT; 