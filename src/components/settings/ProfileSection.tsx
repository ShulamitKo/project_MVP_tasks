import React, { useState, useRef, DragEvent, useEffect } from 'react';
import { User, Mail, Camera, Edit2, X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../backend/supabase/config';
import { UserProfile } from '../../types/user';

const ProfileSection: React.FC = () => {
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [originalProfile, setOriginalProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();

      if (error) throw error;
      setProfile(data);
      setOriginalProfile(data);
    } catch (error) {
      console.error('שגיאה בטעינת פרופיל:', error);
    }
  };

  const uploadAvatar = async (file: File): Promise<string | null> => {
    try {
      if (!user) return null;

      // מחיקת תמונה קיימת אם יש
      if (profile?.avatar_url) {
        const oldFileName = profile.avatar_url.split('/').pop();
        if (oldFileName) {
          const { error: deleteError } = await supabase.storage
            .from('avatars')
            .remove([`${user.id}/${oldFileName}`]);
          
          if (deleteError) {
            console.error('שגיאה במחיקת תמונה קיימת:', deleteError);
          }
        }
      }

      // העלאת התמונה החדשה
      const fileExt = file.name.split('.').pop();
      const fileName = `avatar-${Date.now()}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { 
          upsert: true,
          contentType: file.type 
        });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (error) {
      console.error('שגיאה בהעלאת תמונה:', error);
      return null;
    }
  };

  const processFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('נא להעלות קובץ תמונה בלבד');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('גודל הקובץ חייב להיות קטן מ-5MB');
      return;
    }

    setIsLoading(true);
    try {
      const avatarUrl = await uploadAvatar(file);
      if (avatarUrl && profile) {
        // רק שומר בזיכרון המקומי
        setProfile({
          ...profile,
          avatar_url: avatarUrl
        });
      }
    } catch (error) {
      console.error('שגיאה בהעלאת תמונה:', error);
      alert('שגיאה בהעלאת תמונת הפרופיל');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
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

  const handleRemoveAvatar = async () => {
    if (confirm('האם אתה בטוח שברצונך להסיר את תמונת הפרופיל?') && profile) {
      setProfile({
        ...profile,
        avatar_url: null
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!profile || !user) return;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(user.email || '')) {
      alert('נא להזין כתובת אימייל תקינה');
      return;
    }

    if (profile.name && profile.name.length < 2) {
      alert('שם חייב להכיל לפחות 2 תווים');
      return;
    }

    setIsLoading(true);
    try {
      // מחיקת תמונה ישנה אם השתנתה
      if (profile.avatar_url !== originalProfile?.avatar_url && originalProfile?.avatar_url) {
        const oldFileName = originalProfile.avatar_url.split('/').pop();
        if (oldFileName) {
          const { error: deleteError } = await supabase.storage
            .from('avatars')
            .remove([`${user.id}/${oldFileName}`]);
          
          if (deleteError) {
            console.error('שגיאה במחיקת תמונה קיימת:', deleteError);
          }
        }
      }

      // שמירת כל השינויים בבת אחת
      const { error } = await supabase
        .from('profiles')
        .update({ 
          name: profile.name,
          avatar_url: profile.avatar_url,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) throw error;
      setIsEditing(false);
      await fetchProfile();
    } catch (error) {
      console.error('שגיאה בעדכון פרופיל:', error);
      alert('שגיאה בעדכון הפרופיל');
    } finally {
      setIsLoading(false);
    }
  };

  if (!user || !profile) {
    return <div className="p-6">טוען...</div>;
  }

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
                    ${profile.avatar_url ? '' : 'border-2 border-dashed border-gray-300'}`}
                  onClick={handleAvatarClick}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  {isLoading ? (
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900" />
                  ) : profile.avatar_url ? (
                    <>
                      <img
                        src={profile.avatar_url}
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
                value={profile.name || ''}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* אימייל - לקריאה בלבד */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                כתובת אימייל
              </label>
              <input
                type="email"
                value={user.email || ''}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                disabled
              />
            </div>

            {/* כפתורי פעולה */}
            <div className="flex gap-2 pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
              >
                {isLoading ? 'שומר...' : 'שמירת שינויים'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setProfile(originalProfile);
                  setIsEditing(false);
                }}
                disabled={isLoading}
                className="flex-1 px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 disabled:opacity-50"
              >
                ביטול
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
                {profile.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt="תמונת פרופיל"
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <span className="text-3xl font-semibold text-blue-600">
                    {profile.name?.charAt(0) || user.email?.charAt(0)}
                  </span>
                )}
              </div>
              <div>
                <h3 className="text-xl font-semibold">{profile.name || 'לא הוגדר שם'}</h3>
                <p className="text-gray-500 flex items-center gap-1">
                  <Mail className="w-4 h-4" />
                  {user.email}
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsEditing(true)}
              className="w-full px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 flex items-center justify-center gap-2"
            >
              <Edit2 className="w-4 h-4" />
עריכת פרטים            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProfileSection;