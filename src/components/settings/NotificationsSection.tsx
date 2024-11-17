import React, { useState } from 'react';
import { Bell } from 'lucide-react';
import ToggleSwitch from './ToggleSwitch';

const NotificationsSection: React.FC = () => {
  const [notifications, setNotifications] = useState({
    urgent: true,
    daily: false,
    email: true
  });

  return (
    <section className="bg-white rounded-xl shadow-sm">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Bell className="w-5 h-5 text-gray-500" />
          <h2 className="text-lg font-semibold">התראות</h2>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">התראות דחופות</p>
              <p className="text-sm text-gray-500">קבל התראות על משימות דחופות</p>
            </div>
            <ToggleSwitch
              checked={notifications.urgent}
              onChange={(checked) => setNotifications(prev => ({ ...prev, urgent: checked }))}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">תזכורות יומיות</p>
              <p className="text-sm text-gray-500">קבל סיכום יומי של המשימות שלך</p>
            </div>
            <ToggleSwitch
              checked={notifications.daily}
              onChange={(checked) => setNotifications(prev => ({ ...prev, daily: checked }))}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">התראות במייל</p>
              <p className="text-sm text-gray-500">קבל עדכונים חשובים למייל</p>
            </div>
            <ToggleSwitch
              checked={notifications.email}
              onChange={(checked) => setNotifications(prev => ({ ...prev, email: checked }))}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default NotificationsSection;