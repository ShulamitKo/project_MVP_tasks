import React, { useState, useRef, DragEvent } from 'react';
import { User, Mail, Camera, Edit2, X } from 'lucide-react';

interface ProfileData {
  name: string;
  email: string;
  avatar?: string;
}

const ProfileSection: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [profile, setProfile] = useState<ProfileData>({
    name: 'ישראל ישראלי',
    email: 'israel@example.com'
  });

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const processFile = (file: File) => {
    // בדיקת סוג הקובץ
    if (!file.type.startsWith('image/')) {
      alert('נא להעלות קובץ תמונה בלבד');
      return;
    }

    // בדיקת גודל הקובץ (מקסימום 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('גודל הקובץ חייב להיות קטן מ-5MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      // בדיקת מימדי התמונה
      const img = new Image();
      img.onload = () => {
        // אם התמונה קטנה מדי, נציג אזהרה
        if (img.width < 400 || img.height < 400) {
          if (!confirm('התמונה קטנה מהמומלץ (400x400). להמשיך בכל זאת?')) {
            return;
          }
        }
        setProfile(prev => ({
          ...prev,
          avatar: e.target?.result as string
        }));
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      processFile(file);
    }
  };

  const handleRemoveAvatar = () => {
    if (confirm('האם אתה בטוח שברצונך להסיר את תמונת הפרופיל?')) {
      setProfile(prev => ({ ...prev, avatar: undefined }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // בדיקת תקינות האימייל
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(profile.email)) {
      alert('נא להזין כתובת אימייל תקינה');
      return;
    }

    // בדיקת אורך השם
    if (profile.name.length < 2) {
      alert('שם חייב להכיל לפחות 2 תווים');
      return;
    }

    setIsEditing(false);
    // כאן יתווסף בהמשך הלוגיקה לשמירת הנתונים
  };

  return (
    <section className="bg-white rounded-xl shadow-sm">
      <div className="p-6">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <User className="w-5 h-5 text-gray-500" />
          פרטי משתמש
        </h2>

        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* תמונת פרופיל */}
            <div className="flex items-center gap-4">
              <div className="relative">
                <div 
                  className={`w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center cursor-pointer transition-all
                    ${isDragging ? 'ring-2 ring-blue-500 ring-offset-2' : 'hover:opacity-90'}
                    ${profile.avatar ? '' : 'border-2 border-dashed border-gray-300'}`}
                  onClick={handleAvatarClick}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  {profile.avatar ? (
                    <>
                      <img
                        src={profile.avatar}
                        alt="תמונת פרופיל"
                        className="w-full h-full rounded-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveAvatar();
                        }}
                        className="absolute -top-1 -right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </>
                  ) : (
                    <div className="text-center">
                      <Camera className="w-6 h-6 text-gray-400 mx-auto mb-1" />
                      <span className="text-xs text-gray-500">גרור או לחץ</span>
                    </div>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                  aria-label="העלאת תמונת פרופיל"
                />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-500 mb-1">העלה תמונת פרופיל</p>
                <p className="text-xs text-gray-400">
                  מומלץ להעלות תמונה בגודל 400x400 פיקסלים
                </p>
              </div>
            </div>

            {/* שם מלא */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                שם מלא
              </label>
              <input
                type="text"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* אימייל */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                כתובת אימייל
              </label>
              <input
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* כפתורי פעולה */}
            <div className="flex gap-2 pt-2">
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                שמירת שינויים
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="flex-1 px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200"
              >
                ביטול
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            {/* תצוגת פרטים */}
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
                {profile.avatar ? (
                  <img
                    src={profile.avatar}
                    alt="תמונת פרופיל"
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <span className="text-3xl font-semibold text-blue-600">
                    {profile.name.charAt(0)}
                  </span>
                )}
              </div>
              <div>
                <h3 className="text-xl font-semibold">{profile.name}</h3>
                <p className="text-gray-500 flex items-center gap-1">
                  <Mail className="w-4 h-4" />
                  {profile.email}
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsEditing(true)}
              className="w-full px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 flex items-center justify-center gap-2"
            >
              <Edit2 className="w-4 h-4" />
              עריכת פרטים
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProfileSection;