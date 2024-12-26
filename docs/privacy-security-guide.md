# מדריך אבטחת פרטיות משתמשים

## מטרת המסמך
מסמך זה מפרט את הצעדים הנדרשים להגנה על פרטיות המשתמשים בסביבת הייצור, תוך שמירה על יכולת תחזוקה ופיתוח.

## הגדרת Row Level Security (RLS)

### 1. הפעלת RLS על טבלאות
```sql
-- הפעלת RLS על טבלת משימות
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- הפעלת RLS על טבלת קטגוריות
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- הפעלת RLS על טבלת פרופילים
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
```

### 2. הגדרת מדיניות גישה בסיסית
```sql
-- מדיניות צפייה במשימות
CREATE POLICY "Users can view own tasks" ON tasks
FOR SELECT USING (auth.uid() = user_id);

-- מדיניות עריכת משימות
CREATE POLICY "Users can edit own tasks" ON tasks
FOR UPDATE USING (auth.uid() = user_id);

-- מדיניות מחיקת משימות
CREATE POLICY "Users can delete own tasks" ON tasks
FOR DELETE USING (auth.uid() = user_id);
```

## חשבון ב��יקות למפתחים

### 1. הגדרת חשבון בדיקות
- יצירת שדה `is_test_account` בטבלת `profiles`
- סימון חשבונות בדיקות ספציפיים

### 2. מדיניות גישה לחשבונות בדיקה
```sql
-- מדיניות המאפשרת למפתחים לראות רק חשבונות בדיקה
CREATE POLICY "View test accounts only" ON tasks
FOR SELECT
USING (
  auth.uid() = user_id 
  OR 
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE user_id = auth.uid() 
    AND is_test_account = true
  )
);
```

## אמצעי אבטחה נוספים

### 1. הצפנת מידע רגיש
- שימוש בהצפנה לנתונים רגישים
- שמירת סיסמאות בצורה מוצפנת
- הצפנת קבצים מועלים

### 2. הגבלת גישה לבסיס הנתונים
- הגדרת הרשאות מינימליות הנדרשות
- הגבלת גישה ישירה לבסיס הנתונים
- שימוש ב-API מאובטח בלבד

### 3. תיעוד ובקרה
- תיעוד כל פעולות הגישה לנתונים
- מעקב אחר שינויים בהרשאות
- התראות על פעילות חשודה

## תחזוקה ופתרון בעיות

### 1. כלי ניטור
- הגדרת לוגים מפורטים
- מערכת ניטור ביצועים
- התראות על תקלות

### 2. תמיכה במשתמשים
- מערכת דיווח תקלות
- תהליך מוגדר לטיפול בבעיות
- אפשרות לשיתוף מידע ספציפי על ידי המשתמש

## רשימת משימות לפני העלייה לאוויר
- [ ] הפעלת RLS על כל הטבלאות
- [ ] הגדרת מדיניות גישה מתאימה
- [ ] יצירת חשבון בדיקות למפתחים
- [ ] הגדרת מערכת לוגים ותיעוד
- [ ] בדיקת אבטחה מקיפה
- [ ] וידוא שכל המידע הרגיש מוצפן
- [ ] הגדרת גיבויים אוטומטיים
- [ ] הכנת נוהל לטיפול בתקלות

## הערות חשובות
1. יש לבדוק את כל הגדרות האבטחה לפני העלייה לאוויר
2. יש לתעד כל שינוי בהרשאות
3. יש לבצע בדיקות אבטחה תקופתיות
4. יש לשמור על עדכניות המערכת והתלויות

## קישורים שימושיים
- [תיעוד Supabase RLS](https://supabase.com/docs/guides/auth/row-level-security)
- [מדריך אבטחה של Supabase](https://supabase.com/docs/guides/auth/overview)
- [דוגמאות למדיניות RLS](https://supabase.com/docs/guides/auth/row-level-security#policies) 