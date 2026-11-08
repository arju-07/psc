import React, { useState } from 'react';
import {
  BookOpen,
  LayoutDashboard,
  FolderKanban,
  FileText,
  Sparkles,
  ShieldCheck,
  Moon,
  Sun,
  Search,
  Menu,
  X,
  UserCheck,
  ChevronDown,
  GraduationCap,
  Layers,
  Award,
  Bookmark,
  TrendingUp,
  Flame,
  History
} from 'lucide-react';

export default function Navbar({
  activeTab,
  setActiveTab,
  isDark,
  setIsDark,
  currentUser,
  onSwitchUser,
  onOpenAuth,
  searchQuery,
  setSearchQuery,
  onSearchSubmit,
  bookmarkCount = 0
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const desktopNavItems = [
    { id: 'dashboard', label: 'Home', malayalam: 'ഡാഷ്‌ബോർഡ്', icon: LayoutDashboard },
    { id: 'catalogue', label: 'PYQ Papers', malayalam: 'ചോദ്യക്കടലാസുകൾ', icon: FolderKanban },
    { id: 'practice', label: 'Practice', malayalam: 'വിഷയാധിഷ്ഠിതം', icon: Layers, badge: 'New' },
    { id: 'mock-tests', label: 'Mock Tests', malayalam: 'മാതൃകാ പരീക്ഷ', icon: Award },
    { id: 'daily-challenge', label: 'Daily Streak', malayalam: 'ഡെയ്‌ലി', icon: Flame, badge: 'Daily' },
    { id: 'bookmarks', label: 'Saved', malayalam: 'ബുക്ക്‌മാർക്ക്', icon: Bookmark },
    { id: 'performance', label: 'Performance', malayalam: 'പുരോഗതി', icon: TrendingUp },
    { id: 'analysis', label: 'PYQ Analysis', malayalam: 'വിശകലനം', icon: History },
    { id: 'admin', label: 'Admin', malayalam: 'അഡ്മിൻ', icon: ShieldCheck, adminOnly: true }
  ];

  // Mobile Bottom Navigation Bar items
  const mobileBottomItems = [
    { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
    { id: 'catalogue', label: 'Papers', icon: FolderKanban },
    { id: 'practice', label: 'Practice', icon: Layers },
    { id: 'mock-tests', label: 'Mocks', icon: Award },
    { id: 'bookmarks', label: 'Saved', icon: Bookmark },
    { id: 'performance', label: 'Analytics', icon: TrendingUp }
  ];

  const handleNavClick = (tabId) => {
    setActiveTab(tabId);
    setMobileMenuOpen(false);
  };

  const handleSearchKeyPress = (e) => {
    if (e.key === 'Enter') {
      setActiveTab('catalogue');
      if (onSearchSubmit) onSearchSubmit(searchQuery);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-3">

            {/* Logo & Branding */}
            <div
              className="flex items-center space-x-2.5 cursor-pointer shrink-0"
              onClick={() => handleNavClick('dashboard')}
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center space-x-1.5">
                  <span className="font-extrabold text-base sm:text-lg tracking-tight text-slate-900 dark:text-white">
                    Kerala<span className="text-emerald-600 dark:text-emerald-400">PYQ</span>Hub
                  </span>
                  <span className="hidden sm:inline text-[10px] bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold px-1.5 py-0.5 rounded">
                    2.0
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium ml-text hidden sm:block">
                  കേരള മത്സരപരീക്ഷാ ചോദ്യോത്തരങ്ങൾ
                </p>
              </div>
            </div>

            {/* Search Bar (Desktop) */}
            <div className="hidden md:flex flex-1 max-w-xs lg:max-w-sm relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search exam, year, topic..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearchKeyPress}
                className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-100 dark:bg-slate-800 border-none rounded-full text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
              />
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden xl:flex items-center space-x-0.5">
              {desktopNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                if (item.adminOnly && currentUser?.role !== 'ADMIN') return null;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`flex items-center space-x-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 shadow-sm font-bold'
                        : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                    {item.badge && (
                      <span className="text-[9px] bg-emerald-500 text-white px-1 rounded-full font-bold">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Right Actions: Theme, Role switcher, User */}
            <div className="flex items-center space-x-2">

              {/* Dark / Light Toggle */}
              <button
                onClick={() => setIsDark(!isDark)}
                className="p-2 rounded-lg text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
                aria-label="Toggle theme"
              >
                {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
              </button>

              {/* User Account / Role Switcher */}
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition text-xs"
                >
                  <img
                    src={currentUser?.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=Devika"}
                    alt={currentUser?.name}
                    className="w-5 h-5 rounded-full border border-emerald-500/50"
                  />
                  <span className="hidden sm:inline font-medium text-xs max-w-[100px] truncate text-slate-800 dark:text-slate-200">
                    {currentUser?.name?.split(' ')[0]}
                  </span>
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                    currentUser?.role === 'ADMIN'
                      ? 'bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-300'
                      : 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300'
                  }`}>
                    {currentUser?.role === 'ADMIN' ? 'Admin' : 'Aspirant'}
                  </span>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </button>

                {userDropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                    onClick={() => setUserDropdownOpen(false)}
                  >
                    <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-700">
                      <p className="text-[11px] text-slate-400">Signed in as</p>
                      <p className="text-xs font-semibold text-slate-800 dark:text-white truncate">{currentUser?.name}</p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{currentUser?.email}</p>
                    </div>

                    <div className="py-1">
                      <p className="px-4 py-1 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                        Switch Role Mode
                      </p>
                      <button
                        onClick={() => onSwitchUser('usr-student-01')}
                        className={`w-full text-left px-4 py-2 text-xs flex items-center justify-between hover:bg-slate-100 dark:hover:bg-slate-700/60 ${
                          currentUser?.role === 'STUDENT' ? 'text-emerald-600 font-bold' : 'text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <span className="flex items-center space-x-2">
                          <GraduationCap className="w-4 h-4 text-emerald-500" />
                          <span>Devika Nair (Student Aspirant)</span>
                        </span>
                        {currentUser?.role === 'STUDENT' && <span className="text-xs">✓</span>}
                      </button>

                      <button
                        onClick={() => onSwitchUser('usr-admin-01')}
                        className={`w-full text-left px-4 py-2 text-xs flex items-center justify-between hover:bg-slate-100 dark:hover:bg-slate-700/60 ${
                          currentUser?.role === 'ADMIN' ? 'text-purple-600 font-bold' : 'text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <span className="flex items-center space-x-2">
                          <ShieldCheck className="w-4 h-4 text-purple-500" />
                          <span>Arun Kumar (System Admin)</span>
                        </span>
                        {currentUser?.role === 'ADMIN' && <span className="text-xs">✓</span>}
                      </button>
                    </div>

                    <div className="pt-1 border-t border-slate-100 dark:border-slate-700">
                      <button
                        onClick={onOpenAuth}
                        className="w-full text-left px-4 py-2 text-xs text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-slate-50 dark:hover:bg-slate-700/50"
                      >
                        Log in with different email / Firebase...
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Mobile Drawer Toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="xl:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                aria-label="Open full menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Slide-down Drawer */}
        {mobileMenuOpen && (
          <div className="xl:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 py-3 space-y-1">
            {desktopNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              if (item.adminOnly && currentUser?.role !== 'ADMIN') return null;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold ${
                    isActive
                      ? 'bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 font-bold'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center space-x-2.5">
                    <Icon className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span>{item.label}</span>
                  </div>
                  <span className="text-[11px] text-slate-400 ml-text">{item.malayalam}</span>
                </button>
              );
            })}
          </div>
        )}
      </header>

      {/* MOBILE BOTTOM NAVIGATION BAR (FIXED) */}
      <nav className="xl:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 py-1.5 px-2 flex items-center justify-around">
        {mobileBottomItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition ${
                isActive
                  ? 'text-emerald-600 dark:text-emerald-400 font-bold'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] mt-0.5 tracking-tight">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
}
