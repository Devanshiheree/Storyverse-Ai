
import {
  BookOpen,
  Users,
  Clapperboard,
  GitBranch,
  LayoutDashboard,
  Sparkles,
  ChevronRight,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

import { useApp } from '../context/AppContext';
import type { AppView } from '../types';
import { clsx } from 'clsx';

interface NavItem {
  view: AppView;
  label: string;
  icon: LucideIcon;
  requiresProject: boolean;
}

const NAV_ITEMS: NavItem[] = [
  {
    view: 'dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    requiresProject: false,
  },
  {
    view: 'editor',
    label: 'Story Editor',
    icon: BookOpen,
    requiresProject: true,
  },
  {
    view: 'characters',
    label: 'Characters',
    icon: Users,
    requiresProject: true,
  },
  {
    view: 'scene-sim',
    label: 'Scene Simulator',
    icon: Clapperboard,
    requiresProject: true,
  },
  {
    view: 'alt-paths',
    label: 'Alternate Paths',
    icon: GitBranch,
    requiresProject: true,
  },
];

export function Sidebar() {
  const { currentView, setCurrentView, activeProject } = useApp();

  function handleNav(item: NavItem) {
    if (item.requiresProject && !activeProject) return;
    setCurrentView(item.view);
  }

  return (
    <aside className="w-64 min-h-screen flex flex-col bg-void-900 border-r border-white/5 shrink-0">
      {/* Logo */}
      <div className="px-5 py-6 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-glow-sm">
            <Sparkles size={18} className="text-white" />
          </div>

          <div>
            <h1 className="font-serif font-bold text-white text-lg leading-none">
              StoryVerse
            </h1>
            <span className="text-indigo-400 text-xs font-medium">
              AI ✦
            </span>
          </div>
        </div>
      </div>

      {/* Active project */}
      {activeProject && (
        <div className="mx-3 mt-4 px-3 py-2 rounded-lg bg-indigo-600/10 border border-indigo-500/20 animate-fade-in">
          <p className="text-xs text-indigo-400 uppercase tracking-wider font-medium mb-0.5">
            Active Project
          </p>
          <p className="text-sm text-white font-medium truncate">
            {activeProject.title}
          </p>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.view;
          const isDisabled = item.requiresProject && !activeProject;

          return (
            <button
              key={item.view}
              onClick={() => handleNav(item)}
              disabled={isDisabled}
              className={clsx(
                'nav-item w-full group',
                isActive && 'active',
                isDisabled && 'opacity-30 cursor-not-allowed'
              )}
              title={isDisabled ? 'Open a project first' : undefined}
            >
              <Icon size={17} />
              <span className="flex-1 text-left">{item.label}</span>

              {isActive && (
                <ChevronRight size={14} className="text-indigo-400" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer — AI status */}
      <div className="px-4 py-5 border-t border-white/5">
        <div className="glass rounded-lg p-3 text-center">
          <div className="ai-badge mx-auto mb-1.5">
            <Sparkles size={11} />
            Stage 1 — UI Only
          </div>

          <p className="text-xs text-gray-500 leading-relaxed">
            AI features connect in Stage 2 via secure backend
          </p>
        </div>
      </div>
    </aside>
  );
}
