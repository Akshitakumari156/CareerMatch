import { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { MatchesPage } from './pages/MatchesPage';
import { OnboardingPage } from './pages/OnboardingPage';
import { ChatPage } from './pages/ChatPage';
import { SettingsPage } from './pages/SettingsPage';
import { HowItWorksModal } from './components/HowItWorksModal';
import { AuthModal } from './components/AuthModal';
import { UserProfile } from './types';
import { ApiClient } from './api/client';

export function App() {
  const [activeTab, setActiveTab] = useState<'matches' | 'onboarding' | 'chat' | 'settings'>('matches');
  const [isHowItWorksOpen, setIsHowItWorksOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  // Authenticated user state
  const [currentUser, setCurrentUser] = useState<{ name?: string; email: string } | null>(null);

  // Active candidate profile (loaded from backend or uploaded by user)
  const [activeProfile, setActiveProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    // 1. Try to fetch logged-in user if token exists
    if (ApiClient.getToken()) {
      ApiClient.request<{ name?: string; email: string }>('/api/auth/me')
        .then((user) => setCurrentUser(user))
        .catch(() => ApiClient.clearToken());
    }

    // 2. Try to fetch current active profile if available on backend
    ApiClient.getProfile()
      .then((profile) => {
        if (profile && profile.skills && profile.skills.length > 0) {
          setActiveProfile(profile);
        }
      })
      .catch(() => {
        // No profile uploaded yet, that's fine
      });
  }, []);

  const handleLogout = () => {
    ApiClient.clearToken();
    setCurrentUser(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 font-sans selection:bg-slate-900 selection:text-white">
      <Navbar
        activeTab={activeTab}
        setActiveTab={(tab) => setActiveTab(tab as any)}
        onOpenHowItWorks={() => setIsHowItWorksOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        currentUser={currentUser}
        onLogout={handleLogout}
      />

      <main className="flex-1">
        {activeTab === 'matches' && (
          <MatchesPage
            activeProfile={activeProfile}
            onNavigateToOnboarding={() => setActiveTab('onboarding')}
          />
        )}
        {activeTab === 'onboarding' && (
          <OnboardingPage
            onProfileLoaded={(profile) => setActiveProfile(profile)}
          />
        )}
        {activeTab === 'chat' && <ChatPage activeProfile={activeProfile} />}
        {activeTab === 'settings' && <SettingsPage currentUser={currentUser} />}
      </main>

      <Footer onOpenHowItWorks={() => setIsHowItWorksOpen(true)} />

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onAuthSuccess={(user) => {
          setCurrentUser(user);
          // Refresh profile after login
          ApiClient.getProfile()
            .then((p) => setActiveProfile(p))
            .catch(() => {});
        }}
      />

      {/* System Design & Architecture Walkthrough Modal */}
      <HowItWorksModal
        isOpen={isHowItWorksOpen}
        onClose={() => setIsHowItWorksOpen(false)}
      />
    </div>
  );
}

export default App;
