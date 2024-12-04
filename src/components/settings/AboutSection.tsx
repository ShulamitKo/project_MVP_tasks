import React, { useState } from 'react';
import { Info, Shield, X } from 'lucide-react';

const AboutSection: React.FC = () => {
  const [showAccessibilityStatement, setShowAccessibilityStatement] = useState(false);

  return (
    <section className="bg-white rounded-xl shadow-sm">
      <div className="p-6">
        <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
          <Info className="w-5 h-5 text-gray-500" />
          אודות
        </h2>

        <div className="space-y-4">
          {/* גרסה */}
          <div>
            <p className="text-sm text-gray-500">גרסת מערכת</p>
            <p className="font-medium">1.0.0</p>
          </div>

          {/* מידע משפטי */}
          <div className="flex gap-4 text-sm">
            <a href="#" className="text-blue-500 hover:text-blue-600">תנאי שימוש</a>
            <span className="text-gray-300">|</span>
            <a href="#" className="text-blue-500 hover:text-blue-600">מדיניות פרטיות</a>
            <span className="text-gray-300">|</span>
            <button 
              onClick={() => setShowAccessibilityStatement(true)}
              className="text-blue-500 hover:text-blue-600"
            >
              הצהרת נגישות
            </button>
          </div>

          {/* זכויות יוצרים */}
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} כל הזכויות שמורות
          </p>
        </div>
      </div>

      {/* מודאל הצהרת נגישות */}
      {showAccessibilityStatement && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-2xl">
            <div className="p-6 border-b flex items-center justify-between">
              <h3 className="text-xl font-semibold flex items-center gap-2">
                <Shield className="w-5 h-5" />
                הצהרת נגישות
              </h3>
              <button 
                onClick={() => setShowAccessibilityStatement(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <p>
                אנו מאמינים שהאינטרנט צריך להיות נגיש לכולם. אתר זה עומד בהנחיות הנגישות
                ברמה AA של תקן WCAG 2.1 ובתקנות שוויון זכויות לאנשים עם מוגבלות.
              </p>
              <div className="space-y-2">
                <h4 className="font-medium">אמצעי נגישות באתר:</h4>
                <ul className="list-disc list-inside space-y-1 text-gray-600">
                  <li>תמיכה בשינוי גודל טקסט</li>
                  <li>ניגודיות צבעים גבוהה</li>
                  <li>תמיכה בניווט מקלדת</li>
                  <li>תיאורי תמונות חלופיים</li>
                  <li>מבנה סמנטי ברור</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">יצירת קשר בנושא נגישות:</h4>
                <p className="text-gray-600">
                  נתקלתם בבעיית נגישות? נשמח לקבל משוב ולשפר.
                  ניתן לפנות לרכז הנגישות שלנו בדוא"ל: <a href="mailto:accessibility@example.com" className="text-blue-500 hover:text-blue-600">accessibility@example.com</a>
                </p>
              </div>
              <p className="text-sm text-gray-500">
                הצהרת הנגישות עודכנה לאחרונה בתאריך: {new Date().toLocaleDateString('he-IL')}
              </p>
            </div>
            <div className="p-6 border-t bg-gray-50">
              <button
                onClick={() => setShowAccessibilityStatement(false)}
                className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                סגירה
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default AboutSection;