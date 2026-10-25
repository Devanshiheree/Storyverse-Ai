// ============================================================
// APP CONTEXT — Global story data backed by Cloud Firestore
// Each user's data is stored under: users/{uid}/projects
//                                   users/{uid}/characters
// Data is private — only the authenticated user can access it.
// ============================================================

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from 'react';

import {
  collection,
  doc,
  onSnapshot,
  setDoc,
  deleteDoc,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';

import { db } from '../firebase';
import { useAuth } from './AuthContext';

import type {
  StoryProject,
  Character,
  Scene,
  StoryFork,
  AppView,
} from '../types';

import { DEMO_SCENE, DEMO_FORK } from '../data/sampleData';

// ——— Helpers ————————————————————————————————————————————————

const genId = () => Math.random().toString(36).slice(2, 10);

/** Convert Firestore Timestamp or string → Date */
function toDate(value: unknown): Date {
  if (value instanceof Timestamp) return value.toDate();
  if (value instanceof Date) return value;
  if (typeof value === 'string') return new Date(value);
  return new Date();
}

/** Strip undefined fields so Firestore doesn't complain */
function clean<T extends object>(obj: T): T {
  return JSON.parse(JSON.stringify(obj)) as T;
}

// ——— Context type ————————————————————————————————————————————

interface AppContextType {
  currentView: AppView;
  setCurrentView: (view: AppView) => void;

  activeProjectId: string | null;
  setActiveProjectId: (id: string | null) => void;

  projects: StoryProject[];
  activeProject: StoryProject | null;

  createProject: (
    project: Omit<StoryProject, 'id' | 'createdAt' | 'updatedAt' | 'wordCount'>
  ) => void;

  updateProject: (id: string, updates: Partial<StoryProject>) => void;
  deleteProject: (id: string) => void;

  characters: Character[];
  activeCharacterId: string | null;
  setActiveCharacterId: (id: string | null) => void;

  createCharacter: (character: Omit<Character, 'id'>) => void;
  updateCharacter: (id: string, updates: Partial<Character>) => void;

  scenes: Scene[];
  activeScene: Scene | null;

  forks: StoryFork[];
}

const AppContext = createContext<AppContextType | null>(null);

// ——— Provider ————————————————————————————————————————————————

export function AppProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();

  const [currentView, setCurrentView]           = useState<AppView>('dashboard');
  const [activeProjectId, setActiveProjectId]   = useState<string | null>(null);
  const [activeCharacterId, setActiveCharacterId] = useState<string | null>(null);
  const [projects, setProjects]                 = useState<StoryProject[]>([]);
  const [characters, setCharacters]             = useState<Character[]>([]);

  // Static demo data (scene simulator and forks are still local)
  const [scenes]  = useState<Scene[]>([DEMO_SCENE]);
  const [forks]   = useState<StoryFork[]>([DEMO_FORK]);

  // ——— Real-time Firestore listeners ————————————————————————

  useEffect(() => {
    if (!user) {
      // Clear data when signed out
      setProjects([]);
      setCharacters([]);
      setActiveProjectId(null);
      setCurrentView('dashboard');
      return;
    }

    // Subscribe to this user's projects
    const projectsRef = collection(db, 'users', user.uid, 'projects');
    const unsubProjects = onSnapshot(projectsRef, (snapshot) => {
      const loaded: StoryProject[] = snapshot.docs.map((d) => {
        const data = d.data();
        return {
          id:          d.id,
          title:       data.title ?? 'Untitled',
          genre:       data.genre ?? 'Fiction',
          plotSummary: data.plotSummary ?? '',
          manuscript:  data.manuscript ?? '',
          coverColor:  data.coverColor ?? 'from-indigo-900 via-violet-900 to-slate-900',
          wordCount:   data.wordCount ?? 0,
          status:      data.status ?? 'draft',
          createdAt:   toDate(data.createdAt),
          updatedAt:   toDate(data.updatedAt),
        } as StoryProject;
      });

      // Sort by most recently updated
      loaded.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
      setProjects(loaded);
    });

    // Subscribe to this user's characters
    const charsRef = collection(db, 'users', user.uid, 'characters');
    const unsubChars = onSnapshot(charsRef, (snapshot) => {
      const loaded: Character[] = snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      })) as Character[];
      setCharacters(loaded);
    });

    return () => {
      unsubProjects();
      unsubChars();
    };
  }, [user]);

  // ——— Derived values ——————————————————————————————————————

  const activeProject =
    projects.find((p) => p.id === activeProjectId) ?? null;

  const activeScene =
    scenes.find((s) => s.storyId === activeProjectId) ?? null;

  // ——— Project mutations ———————————————————————————————————

  const createProject = useCallback(
    (project: Omit<StoryProject, 'id' | 'createdAt' | 'updatedAt' | 'wordCount'>) => {
      if (!user) return;

      const id  = genId();
      const now = serverTimestamp();
      const wordCount = project.manuscript
        ? project.manuscript.trim().split(/\s+/).filter(Boolean).length
        : 0;

      const docRef = doc(db, 'users', user.uid, 'projects', id);
      setDoc(docRef, clean({
        ...project,
        wordCount,
        createdAt: now,
        updatedAt: now,
      })).catch(console.error);

      setActiveProjectId(id);
      setCurrentView('editor');
    },
    [user]
  );

  const updateProject = useCallback(
    (id: string, updates: Partial<StoryProject>) => {
      if (!user) return;

      const extra: Partial<{ wordCount: number }> = {};
      if (updates.manuscript !== undefined) {
        extra.wordCount = updates.manuscript
          .trim()
          .split(/\s+/)
          .filter(Boolean).length;
      }

      const docRef = doc(db, 'users', user.uid, 'projects', id);
      setDoc(
        docRef,
        clean({ ...updates, ...extra, updatedAt: serverTimestamp() }),
        { merge: true }
      ).catch(console.error);
    },
    [user]
  );

  const deleteProject = useCallback(
    (id: string) => {
      if (!user) return;

      const docRef = doc(db, 'users', user.uid, 'projects', id);
      deleteDoc(docRef).catch(console.error);

      setActiveProjectId((curr) => (curr === id ? null : curr));
      setCurrentView('dashboard');
    },
    [user]
  );

  // ——— Character mutations ————————————————————————————————

  const createCharacter = useCallback(
    (character: Omit<Character, 'id'>) => {
      if (!user) return;

      const id = genId();
      const docRef = doc(db, 'users', user.uid, 'characters', id);
      setDoc(docRef, clean(character)).catch(console.error);

      setActiveCharacterId(id);
    },
    [user]
  );

  const updateCharacter = useCallback(
    (id: string, updates: Partial<Character>) => {
      if (!user) return;

      const docRef = doc(db, 'users', user.uid, 'characters', id);
      setDoc(docRef, clean(updates), { merge: true }).catch(console.error);
    },
    [user]
  );

  // ——— Render ——————————————————————————————————————————————

  return (
    <AppContext.Provider
      value={{
        currentView,
        setCurrentView,
        activeProjectId,
        setActiveProjectId,
        projects,
        activeProject,
        createProject,
        updateProject,
        deleteProject,
        characters,
        activeCharacterId,
        setActiveCharacterId,
        createCharacter,
        updateCharacter,
        scenes,
        activeScene,
        forks,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used inside <AppProvider>');
  }
  return context;
}
