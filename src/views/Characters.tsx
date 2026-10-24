
import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import {
  Users,
  Plus,
  ChevronRight,
  X,
  Save,
  Sparkles,
  User,
  Copy,
  Image as ImageIcon,
  RefreshCw,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import type { Character } from '../types';
import { clsx } from 'clsx';
import { visualizeCharacter } from '../services/ai';
import type { CharacterVisualizationResult } from '../services/ai';

function CharacterAvatar({
  char,
  size = 'md',
}: {
  char: Character;
  size?: 'sm' | 'md' | 'lg';
}) {
  const sizeClass = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-12 h-12 text-sm',
    lg: 'w-16 h-16 text-lg',
  }[size];

  return (
    <div
      className={clsx(
        'avatar font-bold text-white shrink-0',
        `bg-gradient-to-br ${char.avatarColor}`,
        sizeClass
      )}
    >
      {char.avatarInitials}
    </div>
  );
}

const ROLE_BADGE: Record<Character['role'], string> = {
  protagonist: 'badge-indigo',
  antagonist: 'bg-red-500/20 text-red-300 border border-red-500/20',
  supporting: 'badge-violet',
  mentor: 'bg-amber-500/20 text-amber-300 border border-amber-500/20',
  'love-interest': 'bg-rose-500/20 text-rose-300 border border-rose-500/20',
  other: 'bg-gray-500/20 text-gray-300 border border-gray-500/20',
};

function CharacterEditor({
  character,
  onClose,
}: {
  character: Character;
  onClose: () => void;
}) {
  const { updateCharacter } = useApp();
  const [form, setForm] = useState({ ...character });
  const [visualLoading, setVisualLoading] = useState(false);
  const [visualError, setVisualError] = useState('');
  const [visualResult, setVisualResult] =
    useState<CharacterVisualizationResult | null>(null);
  const [copyMessage, setCopyMessage] = useState('');

  const ROLES: Character['role'][] = [
    'protagonist',
    'antagonist',
    'supporting',
    'mentor',
    'love-interest',
    'other',
  ];

  const AVATAR_COLORS = [
    'from-indigo-700 to-violet-800',
    'from-rose-700 to-pink-800',
    'from-amber-700 to-orange-800',
    'from-emerald-700 to-teal-800',
    'from-slate-600 to-slate-800',
    'from-cyan-700 to-sky-800',
    'from-red-700 to-rose-900',
    'from-purple-700 to-indigo-900',
  ];

  function handleSave() {
    updateCharacter(character.id, form);
    onClose();
  }

  function set(field: keyof Character) {
    return (
      e: ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >
    ) => {
      setForm((f) => ({ ...f, [field]: e.target.value }));
    };
  }

  async function handleVisualize() {
    if (!form.name.trim()) {
      setVisualError('Please enter a character name first.');
      return;
    }

    setVisualLoading(true);
    setVisualError('');
    setVisualResult(null);
    setCopyMessage('');

    try {
      const result = await visualizeCharacter({
        name: form.name,
        age: form.age,
        role: form.role,
        appearance: form.appearance,
        personality: form.personality,
        backstory: form.backstory,
        motivation: form.motivation,
        quirks: form.quirks,
      });

      if (result.error || !result.data) {
        throw new Error(
          result.error || 'Could not create the character concept.'
        );
      }

      setVisualResult(result.data);
    } catch (error) {
      setVisualError(
        error instanceof Error
          ? error.message
          : 'Could not generate the character concept. Please try again.'
      );
    } finally {
      setVisualLoading(false);
    }
  }

  async function handleCopyPrompt() {
    if (!visualResult?.imagePrompt) return;

    try {
      await navigator.clipboard.writeText(visualResult.imagePrompt);
      setCopyMessage('Image prompt copied!');
    } catch {
      setCopyMessage(
        'Copy was blocked. Select and copy the prompt manually.'
      );
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end p-4 pt-16 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="card w-full max-w-lg h-full max-h-[85vh] flex flex-col animate-slide-up overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-white/5 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <CharacterAvatar char={form} size="sm" />
            <div className="min-w-0">
              <h3 className="font-serif font-bold text-white truncate">
                {form.name || 'New Character'}
              </h3>
              <span
                className={clsx(
                  'badge text-xs mt-0.5',
                  ROLE_BADGE[form.role]
                )}
              >
                {form.role}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="btn-ghost p-2"
            aria-label="Close character editor"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-auto p-5 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Full Name</label>
              <input
                className="input"
                value={form.name}
                onChange={set('name')}
                placeholder="Character name"
              />
            </div>

            <div>
              <label className="label">Role</label>
              <select
                className="input"
                value={form.role}
                onChange={set('role')}
              >
                {ROLES.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Avatar Initials</label>
              <input
                className="input uppercase"
                value={form.avatarInitials}
                onChange={set('avatarInitials')}
                placeholder="e.g. YO"
                maxLength={3}
              />
            </div>

            <div>
              <label className="label">Age</label>
              <input
                className="input"
                type="number"
                min="0"
                value={form.age ?? ''}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    age: e.target.value
                      ? Number.parseInt(e.target.value, 10)
                      : null,
                  }))
                }
                placeholder="Optional"
              />
            </div>
          </div>

          <div>
            <label className="label">Avatar Colour</label>
            <div className="flex gap-2 flex-wrap">
              {AVATAR_COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() =>
                    setForm((f) => ({ ...f, avatarColor: color }))
                  }
                  aria-label={`Choose ${color} avatar colour`}
                  className={clsx(
                    'w-8 h-8 rounded-full bg-gradient-to-br border-2 transition-all',
                    color,
                    form.avatarColor === color
                      ? 'border-white scale-110 shadow-glow-sm'
                      : 'border-white/20 hover:border-white/50'
                  )}
                />
              ))}
            </div>
          </div>

          {[
            {
              field: 'appearance' as const,
              label: 'Appearance',
              placeholder: 'Physical description, hair, eyes, clothing...',
            },
            {
              field: 'personality' as const,
              label: 'Personality',
              placeholder: 'How do they think, feel, and behave?',
            },
            {
              field: 'backstory' as const,
              label: 'Backstory',
              placeholder: 'Their history before the story begins...',
            },
            {
              field: 'motivation' as const,
              label: 'Motivation',
              placeholder: 'What do they want most? What drives them?',
            },
            {
              field: 'quirks' as const,
              label: 'Quirks & Habits',
              placeholder: 'Distinctive behaviours, phrases, mannerisms...',
            },
          ].map(({ field, label, placeholder }) => (
            <div key={field}>
              <label className="label">{label}</label>
              <textarea
                className="textarea"
                value={form[field] as string}
                onChange={set(field)}
                placeholder={placeholder}
                rows={3}
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '0.8125rem',
                }}
              />
            </div>
          ))}

          <div className="border border-violet-500/20 rounded-xl p-4 bg-violet-500/5 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-lg bg-violet-500/15 flex items-center justify-center shrink-0">
                <Sparkles size={17} className="text-violet-400" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">
                  AI Character Studio
                </h4>
                <p className="text-xs text-gray-400 mt-1">
                  Create a visual description and an image prompt from your
                  character details.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleVisualize}
              disabled={visualLoading || !form.name.trim()}
              className="btn-primary w-full justify-center disabled:opacity-50"
            >
              {visualLoading ? (
                <RefreshCw size={14} className="animate-spin" />
              ) : (
                <ImageIcon size={14} />
              )}
              {visualLoading
                ? 'Creating visual concept...'
                : visualResult
                  ? 'Regenerate Visual Concept'
                  : 'Visualize Character'}
            </button>

            {visualLoading && (
              <p className="text-xs text-violet-300 animate-pulse">
                Building your character's appearance and image prompt...
              </p>
            )}

            {visualError && (
              <div
                role="alert"
                className="rounded-lg border border-red-500/20 bg-red-500/10 p-3"
              >
                <p className="text-xs text-red-300">{visualError}</p>
              </div>
            )}

            {visualResult && (
              <div className="space-y-4 border-t border-white/10 pt-4">
                <div>
                  <h5 className="text-xs font-semibold text-violet-300 mb-2">
                    Visual Description
                  </h5>
                  <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-wrap">
                    {visualResult.visualDescription}
                  </p>
                </div>

                <div>
                  <h5 className="text-xs font-semibold text-violet-300 mb-2">
                    Image Prompt
                  </h5>
                  <p className="text-xs text-gray-400 leading-relaxed whitespace-pre-wrap">
                    {visualResult.imagePrompt}
                  </p>

                  <button
                    type="button"
                    className="btn-secondary mt-3 w-full justify-center"
                    onClick={handleCopyPrompt}
                  >
                    <Copy size={14} />
                    Copy Image Prompt
                  </button>

                  {copyMessage && (
                    <p className="text-xs text-gray-400 mt-2">
                      {copyMessage}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="p-4 border-t border-white/5 flex gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="btn-secondary flex-1"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="btn-primary flex-1"
          >
            <Save size={14} />
            Save Character
          </button>
        </div>
      </div>
    </div>
  );
}

function CharacterCard({
  char,
  onClick,
}: {
  char: Character;
  onClick: () => void;
}) {
  return (
    <div
      className="card-hover cursor-pointer p-5 group"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
    >
      <div className="flex items-start gap-4 mb-4">
        <CharacterAvatar char={char} />
        <div className="flex-1 min-w-0">
          <h3 className="font-serif font-bold text-white text-base leading-tight group-hover:text-indigo-300 transition-colors truncate">
            {char.name}
          </h3>
          {char.age !== null && char.age !== undefined && (
            <p className="text-xs text-gray-500 mt-0.5">Age {char.age}</p>
          )}
          <span className={clsx('badge text-xs mt-2', ROLE_BADGE[char.role])}>
            {char.role}
          </span>
        </div>
        <ChevronRight
          size={16}
          className="text-gray-600 group-hover:text-indigo-400 transition-colors shrink-0 mt-1"
        />
      </div>

      {char.personality && (
        <p className="text-xs text-gray-400 leading-relaxed line-clamp-2 border-t border-white/5 pt-3">
          {char.personality}
        </p>
      )}
    </div>
  );
}

function NewCharacterForm({
  storyId,
  onDone,
}: {
  storyId: string;
  onDone: () => void;
}) {
  const { createCharacter } = useApp();
  const [name, setName] = useState('');
  const [role, setRole] = useState<Character['role']>('supporting');

  function handleCreate(e: FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;

    const initials = name
      .trim()
      .split(/\s+/)
      .map((word) => word[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();

    createCharacter({
      storyId,
      name: name.trim(),
      role,
      age: null,
      appearance: '',
      personality: '',
      backstory: '',
      motivation: '',
      quirks: '',
      avatarColor: 'from-indigo-700 to-violet-800',
      avatarInitials: initials,
    });

    onDone();
  }

  return (
    <form onSubmit={handleCreate} className="card p-5 border-indigo-500/20">
      <h4 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
        <User size={14} className="text-indigo-400" />
        New Character
      </h4>

      <div className="grid grid-cols-2 gap-3 mb-3">
        <div>
          <label className="label">Name *</label>
          <input
            className="input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Character name"
            autoFocus
            required
          />
        </div>

        <div>
          <label className="label">Role</label>
          <select
            className="input"
            value={role}
            onChange={(e) => setRole(e.target.value as Character['role'])}
          >
            {[
              'protagonist',
              'antagonist',
              'supporting',
              'mentor',
              'love-interest',
              'other',
            ].map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={onDone}
          className="btn-secondary text-xs"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="btn-primary text-xs"
          disabled={!name.trim()}
        >
          <Plus size={13} />
          Create & Edit
        </button>
      </div>
    </form>
  );
}

export function Characters() {
  const {
    activeProject,
    characters,
    activeCharacterId,
    setActiveCharacterId,
  } = useApp();

  const [showNewForm, setShowNewForm] = useState(false);

  if (!activeProject) return null;

  const projectChars = characters.filter(
    (character) => character.storyId === activeProject.id
  );

  const editingChar = activeCharacterId
    ? characters.find((character) => character.id === activeCharacterId) ?? null
    : null;

  return (
    <div className="flex-1 overflow-auto animate-fade-in">
      <div className="flex items-center justify-between px-8 py-5 border-b border-white/5">
        <div className="flex items-center gap-3">
          <Users size={18} className="text-indigo-400" />
          <div>
            <h2 className="font-serif font-bold text-white text-lg">
              Characters
            </h2>
            <p className="text-xs text-gray-500">
              {projectChars.length} character
              {projectChars.length !== 1 ? 's' : ''} in {activeProject.title}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowNewForm(true)}
          className="btn-primary"
        >
          <Plus size={15} />
          New Character
        </button>
      </div>

      <div className="px-8 py-6">
        <div className="flex items-center gap-2 p-3 rounded-lg bg-violet-500/10 border border-violet-500/15 mb-6 text-sm">
          <Sparkles size={13} className="text-violet-400 shrink-0" />
          <span className="text-violet-300 text-xs">
            <strong>Character Studio:</strong> Build your cast and create
            detailed visual descriptions and image prompts from their profiles.
          </span>
        </div>

        {showNewForm && (
          <div className="mb-6 animate-slide-up">
            <NewCharacterForm
              storyId={activeProject.id}
              onDone={() => setShowNewForm(false)}
            />
          </div>
        )}

        {projectChars.length === 0 ? (
          <div className="empty-state">
            <div className="w-16 h-16 rounded-2xl bg-violet-600/20 flex items-center justify-center mb-4">
              <Users size={28} className="text-violet-400" />
            </div>
            <h3 className="text-white font-semibold text-lg mb-2">
              No characters yet
            </h3>
            <p className="text-gray-500 mb-6">
              Every story needs its cast. Create your first character.
            </p>
            <button
              type="button"
              onClick={() => setShowNewForm(true)}
              className="btn-primary"
            >
              <Plus size={16} />
              Create Character
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {projectChars.map((character) => (
              <CharacterCard
                key={character.id}
                char={character}
                onClick={() => setActiveCharacterId(character.id)}
              />
            ))}
          </div>
        )}
      </div>

      {editingChar && (
        <CharacterEditor
          character={editingChar}
          onClose={() => setActiveCharacterId(null)}
        />
      )}
    </div>
  );
}
