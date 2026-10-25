// ============================================================
// APP ROOT — Assembles everything together
// Shows the LandingPage for unauthenticated users,
// and the main app layout for authenticated users.
// ============================================================

import { Sidebar } from './components/Sidebar';
import { Dashboard } from './views/Dashboard';
import { StoryEditor } from './views/StoryEditor';
import { Characters } from './views/Characters';
import { SceneSimulator } from './views/SceneSimulator';
import { AlternatePaths } from './views/AlternatePaths';
import { LandingPage } from './views/LandingPage';
import { useApp } from './context/AppContext';
import { useAuth } from './context/AuthContext';

// ——— Loading spinner shown while Firebase resolves auth ——————

function AuthLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center animate-pulse">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
          </svg>
        </div>
        <p className="text-gray-500 text-sm">Loading StoryVerse…</p>
      </div>
    </div>
  );
}

// ——— Main content switcher ———————————————————————————————————

function MainContent() {
  const { currentView } = useApp();

  switch (currentView) {
    case 'dashboard':  return <Dashboard />;
    case 'editor':     return <StoryEditor />;
    case 'characters': return <Characters />;
    case 'scene-sim':  return <SceneSimulator />;
    case 'alt-paths':  return <AlternatePaths />;
    default:           return <Dashboard />;
  }
}

// ——— App root ————————————————————————————————————————————————

export default function App() {
  const { user, loading } = useAuth();

  // While Firebase is figuring out the auth state, show a spinner
  if (loading) return <AuthLoader />;

  // Not logged in → show the landing / sign-in page
  if (!user) return <LandingPage />;

  // Logged in → show the full app
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 flex overflow-hidden min-h-screen">
        <MainContent />
      </main>
    </div>
  );
}
