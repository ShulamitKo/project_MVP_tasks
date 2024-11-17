import React from 'react';
import { Shield } from 'lucide-react';

const AboutSection: React.FC = () => {
  return (
    <section className="bg-white rounded-xl shadow-sm">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="w-5 h-5 text-gray-500" />
          <h2 className="text-lg font-semibold">אודות</h2>
        </div>
        
        <div className="space-y-2">
          <p className="text-gray-500">גרסה 1.0.0</p>
          <div className="flex gap-2">
            <a href="#" className="text-blue-500 hover:underline">תנאי שימוש</a>
            <span className="text-gray-300">|</span>
            <a href="#" className="text-blue-500 hover:underline">מדיניות פרטיות</a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;