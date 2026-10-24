// ============================================================
// APP ROOT — Assembles everything together
// ============================================================

import { Sidebar } from './components/Sidebar';
import { Dashboard } from './views/Dashboard';
import { StoryEditor } from './views/StoryEditor';
import { Characters } from './views/Characters';
import { SceneSimulator } from './views/SceneSimulator';
import { AlternatePaths } from './views/AlternatePaths';
import { useApp } from './context/AppContext';

function MainContent() {
  const { currentView } = useApp();

  // Render the correct view based on navigation state
  switch (currentView) {
    case 'dashboard':   return <Dashboard />;
    case 'editor':      return <StoryEditor />;
    case 'characters':  return <Characters />;
    case 'scene-sim':   return <SceneSimulator />;
    case 'alt-paths':   return <AlternatePaths />;
    default:            return <Dashboard />;
  }
}

export default function App() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 flex overflow-hidden min-h-screen">
        <MainContent />
      </main>
    </div>
  );
}
