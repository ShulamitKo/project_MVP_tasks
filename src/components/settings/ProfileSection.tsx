import React from 'react';

const ProfileSection: React.FC = () => {
  return (
    <section className="bg-white rounded-xl shadow-sm">
      <div className="p-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
            <span className="text-2xl font-semibold text-blue-600">יי</span>
          </div>
          <div>
            <h2 className="text-xl font-semibold">ישראל ישראלי</h2>
            <p className="text-gray-500">israel@example.com</p>
          </div>
        </div>
        <button className="mt-4 w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
          עריכת פרופיל
        </button>
      </div>
    </section>
  );
};

export default ProfileSection;