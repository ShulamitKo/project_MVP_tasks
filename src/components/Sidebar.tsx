import React from 'react';
import { Link } from 'react-router-dom';
import { Category } from '../types/category';

interface SidebarProps {
  activeCategory: string;
  categories: Category[];
}

const Sidebar: React.FC<SidebarProps> = ({ activeCategory, categories }) => {
  return (
    <nav className="w-64 bg-white border-l">
      <div className="p-4">
        {categories.map((category: Category) => (
          <Link
            key={category.id}
            to={`/category/${category.id}`}
            className={`nav-item block mb-2 px-4 py-2 rounded-lg ${
              activeCategory === category.id ? 'active' : ''
            }`}
          >
            <span className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full bg-${category.color}-500`} />
              {category.name}
            </span>
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default Sidebar; 