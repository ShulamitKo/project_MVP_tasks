import React, { useState } from 'react';
import { Bell, Mail, Clock, Calendar, AlertTriangle } from 'lucide-react';
import ToggleSwitch from '../common/ToggleSwitch';

interface NotificationSettings {
  pushEnabled: boolean;
  emailEnabled: boolean;
  emailDigest: 'none' | 'daily' | 'weekly';
  remindersBefore: number[];
  urgentOnly: boolean;
  quietHours: {
    enabled: boolean;
    start: string;
    end: string;
  };
}

const NotificationsSection: React.FC = () => {
  const [settings, setSettings] = useState<NotificationSettings>({
    pushEnabled: true,
    emailEnabled: true,
    emailDigest: 'daily',
    remindersBefore: [15, 60],
    urgentOnly: false,
    quietHours: {
      enabled: false,
      start: '22:00',
      end: '08:00'
    }
  });

  const handleReminderToggle = (minutes: number) => {
    setSettings(prev => ({
      ...prev,
      remindersBefore: prev.remindersBefore.includes(minutes)
        ? prev.remindersBefore.filter(m => m !== minutes)
        : [...prev.remindersBefore, minutes].sort((a, b) => a - b)
    }));
  };

  return (
    <section className="bg-white rounded-xl shadow-sm">
      <div className="p-6">
        <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
          <Bell className="w-5 h-5 text-gray-500" />
          הגדרות התראות
        </h2>

        <div className="space-y-6">
          {/* התראות פוש */}
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">התראות פוש</p>
              <p className="text-sm text-gray-500">קבל התראות בזמן אמת</p>
            </div>
            <ToggleSwitch
              checked={settings.pushEnabled}
              onChange={(checked: boolean) => setSettings(prev => ({ ...prev, pushEnabled: checked }))}
            />
          </div>

          {/* התראות במייל */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">התראות במייל</p>
                <p className="text-sm text-gray-500">קבל עדכונים למייל</p>
              </div>
              <ToggleSwitch
                checked={settings.emailEnabled}
                onChange={(checked: boolean) => setSettings(prev => ({ ...prev, emailEnabled: checked }))}
              />
            </div>

            {settings.emailEnabled && (
              <div className="pr-6 border-r border-gray-100">
                <p className="text-sm font-medium mb-2">תדירות סיכום במייל</p>
                <div className="space-y-2">
                  {[
                    { value: 'none', label: 'ללא סיכום' },
                    { value: 'daily', label: 'סיכום יומי' },
                    { value: 'weekly', label: 'סיכום שבועי' }
                  ].map(option => (
                    <label key={option.value} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="emailDigest"
                        value={option.value}
                        checked={settings.emailDigest === option.value}
                        onChange={(e) => setSettings(prev => ({
                          ...prev,
                          emailDigest: e.target.value as typeof settings.emailDigest
                        }))}
                        className="text-blue-500 focus:ring-blue-500"
                      />
                      <span className="text-sm">{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* תזכורות */}
          <div className="space-y-3">
            <p className="font-medium">תזכורות לפני משימה</p>
            <div className="flex flex-wrap gap-2">
              {[
                { minutes: 15, label: '15 דקות' },
                { minutes: 30, label: '30 דקות' },
                { minutes: 60, label: 'שעה' },
                { minutes: 1440, label: 'יום' }
              ].map(({ minutes, label }) => (
                <button
                  key={minutes}
                  onClick={() => handleReminderToggle(minutes)}
                  className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                    settings.remindersBefore.includes(minutes)
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* שעות שקטות */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">שעות שקטות</p>
                <p className="text-sm text-gray-500">השתק התראות בשעות מסוימות</p>
              </div>
              <ToggleSwitch
                checked={settings.quietHours.enabled}
                onChange={(checked: boolean) => setSettings(prev => ({
                  ...prev,
                  quietHours: { ...prev.quietHours, enabled: checked }
                }))}
              />
            </div>

            {settings.quietHours.enabled && (
              <div className="flex gap-4 items-center pr-6 border-r border-gray-100">
                <div>
                  <label className="block text-sm mb-1">משעה</label>
                  <input
                    type="time"
                    value={settings.quietHours.start}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      quietHours: { ...prev.quietHours, start: e.target.value }
                    }))}
                    className="px-2 py-1 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">עד שעה</label>
                  <input
                    type="time"
                    value={settings.quietHours.end}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      quietHours: { ...prev.quietHours, end: e.target.value }
                    }))}
                    className="px-2 py-1 border rounded-lg"
                  />
                </div>
              </div>
            )}
          </div>

          {/* התראות דחופות בלבד */}
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">התראות דחופות בלבד</p>
              <p className="text-sm text-gray-500">קבל התראות רק עבור משימות דחופות</p>
            </div>
            <ToggleSwitch
              checked={settings.urgentOnly}
              onChange={(checked: boolean) => setSettings(prev => ({ ...prev, urgentOnly: checked }))}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default NotificationsSection;