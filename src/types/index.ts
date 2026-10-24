// ============================================================
// CORE DATA TYPES FOR STORYVERSE AI
// 
// TypeScript "types" are like blueprints — they tell us
// exactly what shape our data must have. This prevents bugs!
// ============================================================

// ——— Story Project ———————————————————————————————————————————
export interface StoryProject {
  id: string;
  title: string;
  genre: string;
  plotSummary: string;
  manuscript: string;
  createdAt: Date;
  updatedAt: Date;
  coverColor: string;       // for the dashboard card gradient
  wordCount: number;
  status: 'draft' | 'in-progress' | 'complete';
}

// ——— Character ————————————————————————————————————————————————
export interface Character {
  id: string;
  storyId: string;
  name: string;
  role: 'protagonist' | 'antagonist' | 'supporting' | 'mentor' | 'love-interest' | 'other';
  age: number | null;
  appearance: string;
  personality: string;
  backstory: string;
  motivation: string;
  quirks: string;
  avatarColor: string;      // background color for the avatar icon
  avatarInitials: string;   // e.g. "AK" for "Alex Korev"
}

// ——— Scene Simulation ————————————————————————————————————————
export interface SceneLine {
  id: string;
  characterId: string;
  characterName: string;
  dialogue: string;
  action?: string;           // stage direction like "(looks away)"
  emotion?: string;          // "confident", "nervous", etc.
}

export interface Scene {
  id: string;
  storyId: string;
  title: string;
  setting: string;
  description: string;
  lines: SceneLine[];
  createdAt: Date;
}

// ——— Alternate Path / Story Fork ———————————————————————————
export interface AltDecision {
  id: string;
  label: string;             // the "what if?" question
  description: string;       // longer explanation
  outcome: string;           // what happens in this branch
  tone: 'dark' | 'hopeful' | 'neutral' | 'tragic' | 'comedic';
}

export interface StoryFork {
  id: string;
  storyId: string;
  branchPoint: string;       // e.g. "Chapter 3, Scene 2"
  originalPath: string;      // brief summary of original direction
  alternatives: AltDecision[];
  createdAt: Date;
}

// ——— App Navigation ——————————————————————————————————————————
export type AppView = 'dashboard' | 'editor' | 'characters' | 'scene-sim' | 'alt-paths';

export interface AppState {
  currentView: AppView;
  activeProjectId: string | null;
}
