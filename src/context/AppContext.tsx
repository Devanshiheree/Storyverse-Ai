
import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from 'react';

import type {
  StoryProject,
  Character,
  Scene,
  StoryFork,
  AppView,
} from '../types';

import {
  SAMPLE_PROJECTS,
  DEMO_CHARACTERS,
  DEMO_SCENE,
  DEMO_FORK,
} from '../data/sampleData';

// Storage keys
const PROJECTS_KEY = 'storyverse_projects';
const CHARACTERS_KEY = 'storyverse_characters';

// Read saved data safely from localStorage
function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const saved = localStorage.getItem(key);

    if (saved !== null) {
      return JSON.parse(saved) as T;
    }
  } catch (error) {
    console.error(`Could not load ${key}:`, error);
  }

  return fallback;
}

// Convert stored date strings back into Date objects
function restoreProjectDates(projects: StoryProject[]): StoryProject[] {
  return projects.map((project) => ({
    ...project,
    createdAt: new Date(project.createdAt),
    updatedAt: new Date(project.updatedAt),
  }));
}

interface AppContextType {
  currentView: AppView;
  setCurrentView: (view: AppView) => void;

  activeProjectId: string | null;
  setActiveProjectId: (id: string | null) => void;

  projects: StoryProject[];
  activeProject: StoryProject | null;

  createProject: (
    project: Omit<
      StoryProject,
      'id' | 'createdAt' | 'updatedAt' | 'wordCount'
    >
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

const genId = () => Math.random().toString(36).slice(2, 10);

export function AppProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [currentView, setCurrentView] =
    useState<AppView>('dashboard');

  const [activeProjectId, setActiveProjectId] =
    useState<string | null>(null);

  const [activeCharacterId, setActiveCharacterId] =
    useState<string | null>(null);

  // Load saved projects and characters when the app starts
  const [projects, setProjects] = useState<StoryProject[]>(() =>
    restoreProjectDates(
      loadFromStorage<StoryProject[]>(
        PROJECTS_KEY,
        SAMPLE_PROJECTS
      )
    )
  );

  const [characters, setCharacters] = useState<Character[]>(() =>
    loadFromStorage<Character[]>(
      CHARACTERS_KEY,
      DEMO_CHARACTERS
    )
  );

  const [scenes] = useState<Scene[]>([DEMO_SCENE]);
  const [forks] = useState<StoryFork[]>([DEMO_FORK]);

  // Save projects and characters whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));
    } catch (error) {
      console.error('Could not save StoryVerse projects:', error);
    }
  }, [projects]);

  useEffect(() => {
    try {
      localStorage.setItem(CHARACTERS_KEY, JSON.stringify(characters));
    } catch (error) {
      console.error('Could not save StoryVerse characters:', error);
    }
  }, [characters]);

  const activeProject =
    projects.find((project) => project.id === activeProjectId) ?? null;

  const activeScene =
    scenes.find((scene) => scene.storyId === activeProjectId) ?? null;

  // Create a new story
  const createProject = useCallback(
    (
      project: Omit<
        StoryProject,
        'id' | 'createdAt' | 'updatedAt' | 'wordCount'
      >
    ) => {
      const now = new Date();

      const newProject: StoryProject = {
        ...project,
        id: genId(),
        createdAt: now,
        updatedAt: now,
        wordCount: project.manuscript
          ? project.manuscript.trim().split(/\s+/).filter(Boolean).length
          : 0,
      };

      setProjects((previous) => [newProject, ...previous]);
      setActiveProjectId(newProject.id);
      setCurrentView('editor');
    },
    []
  );

  // Update a story and save its latest version
  const updateProject = useCallback(
    (id: string, updates: Partial<StoryProject>) => {
      setProjects((previous) =>
        previous.map((project) => {
          if (project.id !== id) return project;

          const updatedProject = {
            ...project,
            ...updates,
            updatedAt: new Date(),
          };

          if (updates.manuscript !== undefined) {
            updatedProject.wordCount = updates.manuscript
              .trim()
              .split(/\s+/)
              .filter(Boolean).length;
          }

          return updatedProject;
        })
      );
    },
    []
  );

  // Delete a story from state and browser storage
  const deleteProject = useCallback((id: string) => {
    setProjects((previous) =>
      previous.filter((project) => project.id !== id)
    );

    setActiveProjectId((currentId) =>
      currentId === id ? null : currentId
    );

    setCurrentView('dashboard');
  }, []);

  // Create a character
  const createCharacter = useCallback(
    (character: Omit<Character, 'id'>) => {
      const newCharacter: Character = {
        ...character,
        id: genId(),
      };

      setCharacters((previous) => [...previous, newCharacter]);
      setActiveCharacterId(newCharacter.id);
    },
    []
  );

  // Update a character
  const updateCharacter = useCallback(
    (id: string, updates: Partial<Character>) => {
      setCharacters((previous) =>
        previous.map((character) =>
          character.id === id
            ? { ...character, ...updates }
            : character
        )
      );
    },
    []
  );

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
