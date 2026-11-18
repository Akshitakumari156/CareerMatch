import React, { useState } from 'react';
import { Briefcase, MessageSquareText, FileText, Settings, Sparkles, User, LogOut, ChevronDown } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenHowItWorks: () => void;
  onOpenAuth: () => void;
  currentUser: { name?: string; email: string } | null;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenHowItWorks,
  onOpenAuth,
  currentUser,
  onLogout,
}) => {
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div
            className="flex items-center space-x-3 cursor-pointer select-none"
            onClick={() => setActiveTab('matches')}
          >
            <div className="w-9 h-9 rounded-xl bg-slate-900 text-sky-400 flex items-center justify-center shadow-sm">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-lg font-black tracking-tight text-slate-900">CareerMatch</span>
              </div>
              <p className="text-[11px] text-slate-500 hidden md:block">Smart Career Matching &amp; Recommendations</p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center space-x-1 sm:space-x-2">
            <button
              onClick={() => setActiveTab('matches')}
              className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'matches'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Briefcase className="w-4 h-4" />
              <span>Jobs &amp; Matches</span>
            </button>

            <button
              onClick={() => setActiveTab('onboarding')}
              className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'onboarding'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Resume &amp; Profile</span>
            </button>

            <button
              onClick={() => setActiveTab('chat')}
              className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'chat'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <MessageSquareText className="w-4 h-4" />
              <span>Career Assistant</span>
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all ${
                activeTab === 'settings' ? 'bg-slate-900 text-white' : ''
              }`}
              title="Settings"
            >
              <Settings className="w-4 h-4" />
            </button>
          </nav>

          {/* Right Action: Clean User Account / Sign In */}
          <div className="flex items-center space-x-3">
            <button
              onClick={onOpenHowItWorks}
              className="text-xs font-semibold text-slate-500 hover:text-slate-800 hidden sm:block px-2 py-1"
            >
              How it works
            </button>

            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserDropdown(!showUserDropdown)}
                  className="flex items-center space-x-2 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-800 transition-colors"
                >
                  <div className="w-6 h-6 rounded-lg bg-slate-900 text-white flex items-center justify-center text-[11px] font-bold">
                    {(currentUser.name || currentUser.email)[0].toUpperCase()}
                  </div>
                  <span className="hidden sm:inline max-w-[120px] truncate">{currentUser.name || currentUser.email.split('@')[0]}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                </button>

                {showUserDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-slate-200 py-1 z-50 text-xs">
                    <div className="px-4 py-2 border-b border-slate-100 text-slate-500 truncate">
                      {currentUser.email}
                    </div>
                    <button
                      onClick={() => {
                        setShowUserDropdown(false);
                        onLogout();
                      }}
                      className="w-full text-left px-4 py-2 text-rose-600 hover:bg-rose-50 flex items-center space-x-2 font-medium"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Log Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-900 text-white hover:bg-slate-800 transition-colors shadow-sm flex items-center space-x-1.5"
              >
                <User className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
