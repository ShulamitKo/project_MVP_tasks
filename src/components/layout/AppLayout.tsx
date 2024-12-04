import React from 'react';
import { Bell, ChevronLeft, ChevronRight, Moon, Plus, Search, Sun, X } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

interface AppLayoutProps {
  children: React.ReactNode;
  title?: string;
  showSearch?: boolean;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  onNewItem?: () => void;
  newItemText?: string;
  isSidebarOpen: boolean;
  onSidebarToggle: () => void;
  sidebarContent?: React.ReactNode;
  showMobileNav?: boolean;
  mobileNavContent?: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({
  children,
  title = 'דשבורד',
  showSearch = true,
  searchQuery = '',
  onSearchChange,
  onNewItem,
  newItemText = 'חדש',
  isSidebarOpen,
  onSidebarToggle,
  sidebarContent,
  showMobileNav = true,
  mobileNavContent
}) => {
  const { isDarkMode, toggleDarkMode } = useTheme();

  return (
    <div className="h-screen flex bg-gray-50 dark:bg-gray-900" dir="rtl">
      {/* Sidebar */}
      <aside 
        className={`bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 
          hidden md:flex flex-col transition-all duration-300 ${
          isSidebarOpen ? 'w-64' : 'w-20'
        }`}
      >
        {/* Sidebar Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          {isSidebarOpen && (
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">תפריט</h2>
          )}
          <button
            onClick={onSidebarToggle}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            aria-label={isSidebarOpen ? "כווץ תפריט" : "הרחב תפריט"}
          >
            {isSidebarOpen ? 
              <ChevronRight className="w-5 h-5 text-gray-500 dark:text-gray-400" /> :
              <ChevronLeft className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            }
          </button>
        </div>

        {/* Sidebar Content */}
        <div className="flex-1 overflow-y-auto">
          {sidebarContent}
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 shadow-sm relative">
          <div className="max-w-7xl mx-auto px-4 md:px-6">
            {/* Top Bar */}
            <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700 gap-3">
              {/* Title */}
              <h1 className="text-lg md:text-2xl font-bold text-gray-900 dark:text-white flex-shrink-0">
                {title}
              </h1>
              
              {/* Search */}
              {showSearch && (
                <div className="flex-1 max-w-xl relative group">
                  <div className="absolute inset-0 bg-blue-100/10 rounded-2xl -m-1 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity pointer-events-none"></div>
                  <Search className="w-5 h-5 text-gray-400 absolute right-4 top-3.5 group-focus-within:text-blue-500 transition-colors" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => onSearchChange?.(e.target.value)}
                    placeholder="חיפוש..."
                    className="w-full pr-12 pl-12 py-3 bg-white dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 rounded-2xl 
                      focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-500/20
                      hover:border-gray-200 dark:hover:border-gray-600 transition-all
                      text-sm font-medium placeholder:text-gray-400 dark:text-white"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => onSearchChange?.('')}
                      className="absolute left-4 top-3.5 text-gray-400 hover:text-gray-600 dark:text-gray-400 
                        dark:hover:text-gray-200 transition-colors rounded-full p-1"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>
              )}

              <div className="flex items-center gap-2">
                {/* Theme Toggle */}
                <button 
                  onClick={toggleDarkMode}
                  className="p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-full transition-colors"
                  title={isDarkMode ? "עבור למצב יום" : "עבור למצב לילה"}
                >
                  {isDarkMode ? (
                    <Sun className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                  ) : (
                    <Moon className="w-5 h-5 text-gray-500" />
                  )}
                </button>

                {/* New Item Button */}
                {onNewItem && (
                  <button 
                    onClick={onNewItem}
                    className="bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-all 
                      hover:shadow-xl group flex-shrink-0 dark:bg-blue-600 dark:hover:bg-blue-500"
                  >
                    <div className="relative p-2.5 md:px-5 md:py-2.5 flex items-center gap-2">
                      <Plus className="w-5 h-5" />
                      <span className="hidden md:inline whitespace-nowrap">{newItemText}</span>
                    </div>
                  </button>
                )}

                {/* Notifications */}
                <button 
                  className="p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-full relative flex-shrink-0 transition-colors"
                  aria-label="התראות"
                >
                  <Bell className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto bg-gray-50 dark:bg-gray-900">
          {children}
        </main>

        {/* Mobile Navigation */}
        {showMobileNav && (
          <nav className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-2 px-4 fixed bottom-0 left-0 right-0 block md:hidden">
            {mobileNavContent}
          </nav>
        )}
      </div>
    </div>
  );
};

export default AppLayout; 