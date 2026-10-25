
import { useState } from 'react';
import {
  BookOpen,
  Users,
  Clapperboard,
  GitBranch,
  LayoutDashboard,
  Sparkles,
  ChevronRight,
  LogOut,
  Info,
  X,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
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

function UserAvatar({
  photoURL,
  displayName,
  email,
}: {
  photoURL?: string | null;
  displayName?: string | null;
  email?: string | null;
}) {
  const initials = displayName
    ? displayName
        .split(' ')
        .map((part) => part[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : (email?.[0] ?? '?').toUpperCase();

  if (photoURL) {
    return (
      <img
        src={photoURL}
        alt={displayName ?? 'User'}
        className="w-8 h-8 rounded-full object-cover ring-2 ring-indigo-500/40"
      />
    );
  }

  return (
    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-xs font-bold text-white ring-2 ring-indigo-500/40">
      {initials}
    </div>
  );
}

export function Sidebar() {
  const { currentView, setCurrentView, activeProject } = useApp();
  const { user, signOut } = useAuth();
  const [notice, setNotice] = useState<string | null>(null);

  function handleNav(item: NavItem) {
    if (item.view === 'dashboard') {
      setNotice(null);
      setCurrentView('dashboard');
      return;
    }

    if (item.requiresProject && !activeProject) {
      setNotice(
        `To use ${item.label}, first create a story or open one from your Dashboard.`
      );
      setCurrentView('dashboard');
      return;
    }

    setNotice(null);
    setCurrentView(item.view);
  }

  async function handleSignOut() {
    setNotice(null);
    await signOut();
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
        <div className="mx-3 mt-4 px-3 py-2 rounded-lg bg-indigo-600/10 border border-indigo-500/20">
          <p className="text-xs text-indigo-400 uppercase tracking-wider font-medium mb-0.5">
            Active Project
          </p>
          <p className="text-sm text-white font-medium truncate">
            {activeProject.title}
          </p>
        </div>
      )}

      {/* Helpful navigation message */}
      {notice && (
        <div
          role="status"
          aria-live="polite"
          className="mx-3 mt-4 rounded-xl border border-indigo-500/30 bg-indigo-500/10 p-3"
        >
          <div className="flex items-start gap-2">
            <Info
              size={16}
              className="text-indigo-400 shrink-0 mt-0.5"
            />

            <p className="text-xs leading-relaxed text-indigo-100 flex-1">
              {notice}
            </p>

            <button
              type="button"
              onClick={() => setNotice(null)}
              aria-label="Dismiss message"
              className="text-gray-400 hover:text-white"
            >
              <X size={14} />
            </button>
          </div>

          <button
            type="button"
            onClick={() => {
              setNotice(null);
              setCurrentView('dashboard');
            }}
            className="mt-3 w-full rounded-lg bg-indigo-500/20 hover:bg-indigo-500/30 px-3 py-2 text-xs font-medium text-indigo-200 transition-colors"
          >
            Go to Dashboard
          </button>
        </div>
      )}

      {/* Navigation */}
      <nav
        aria-label="Main navigation"
        className="flex-1 px-3 py-4 space-y-1"
      >
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.view;

          return (
            <button
              key={item.view}
              type="button"
              onClick={() => handleNav(item)}
              aria-current={isActive ? 'page' : undefined}
              className={clsx(
                'nav-item w-full group',
                isActive && 'active'
              )}
            >
              <Icon size={17} />

              <span className="flex-1 text-left">
                {item.label}
              </span>

              {isActive && (
                <ChevronRight
                  size={14}
                  className="text-indigo-400"
                />
              )}
            </button>
          );
        })}
      </nav>

      {/* User profile and sign out */}
      <div className="px-3 py-4 border-t border-white/5">
        <div className="glass rounded-xl p-3">
          <div className="flex items-center gap-2.5 mb-3">
            <UserAvatar
              photoURL={user?.photoURL}
              displayName={user?.displayName}
              email={user?.email}
            />

            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate leading-tight">
                {user?.displayName ?? 'Writer'}
              </p>

              <p className="text-xs text-gray-500 truncate">
                {user?.email ?? ''}
              </p>
            </div>
          </div>

          <button
            id="sign-out-btn"
            type="button"
            onClick={handleSignOut}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-gray-400 hover:text-red-400 bg-white/5 hover:bg-red-500/10 border border-white/10 hover:border-red-500/20 transition-all duration-200"
          >
            <LogOut size={13} />
            Sign Out
          </button>
        </div>
      </div>
    </aside>
  );
}
