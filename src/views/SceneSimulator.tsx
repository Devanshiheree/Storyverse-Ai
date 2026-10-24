// ============================================================
// SCENE SIMULATOR VIEW
// ============================================================

import { useState } from 'react';
import { Clapperboard, MapPin, Sparkles, Loader, Plus, ChevronDown, ChevronUp, Play } from 'lucide-react';
import { useApp } from '../context/AppContext';
import type { SceneLine } from '../types';
import { generateDialogue } from '../services/ai';
import { clsx } from 'clsx';

// ——— Emotion pill colours ————————————————————————————————————
const EMOTION_COLORS: Record<string, string> = {
  'controlled tension': 'bg-indigo-500/20 text-indigo-300',
  'analytical curiosity': 'bg-cyan-500/20 text-cyan-300',
  'frightened disbelief': 'bg-red-500/20 text-red-300',
  'dry, deliberate': 'bg-slate-500/20 text-slate-300',
  'commanding': 'bg-amber-500/20 text-amber-300',
};

function emotionClass(emotion?: string) {
  if (!emotion) return 'bg-gray-500/20 text-gray-400';
  return EMOTION_COLORS[emotion] ?? 'bg-violet-500/20 text-violet-300';
}

// ——— Single dialogue line ————————————————————————————————————
function DialogueLine({ line, index }: { line: SceneLine; index: number }) {
  const [expanded, setExpanded] = useState(true);
  const isEven = index % 2 === 0;

  return (
    <div className={clsx(
      'flex gap-4 animate-slide-up',
      isEven ? 'flex-row' : 'flex-row-reverse'
    )}>
      {/* Avatar */}
      <div className="shrink-0 flex flex-col items-center gap-1">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-700 to-violet-800 flex items-center justify-center text-xs font-bold text-white shadow-glow-sm">
          {line.characterName.split(' ').map((w) => w[0]).join('').slice(0, 2)}
        </div>
      </div>

      {/* Bubble */}
      <div className={clsx(
        'flex-1 max-w-[75%] group cursor-pointer',
        isEven ? 'mr-auto' : 'ml-auto'
      )}>
        <div className="flex items-center gap-2 mb-1.5">
          <span className={clsx(
            'text-xs font-semibold',
            isEven ? 'text-indigo-300' : 'text-violet-300'
          )}>
            {line.characterName}
          </span>
          {line.emotion && (
            <span className={clsx('badge text-xs', emotionClass(line.emotion))}>
              {line.emotion}
            </span>
          )}
          <button
            onClick={() => setExpanded((e) => !e)}
            className="opacity-0 group-hover:opacity-100 text-gray-500 hover:text-gray-300 transition-all"
          >
            {expanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
          </button>
        </div>

        {expanded && (
          <div className={clsx(
            'rounded-xl px-4 py-3',
            isEven
              ? 'bg-void-800 border border-white/5 rounded-tl-none'
              : 'bg-indigo-600/10 border border-indigo-500/15 rounded-tr-none'
          )}>
            {line.action && (
              <p className="text-xs text-gray-500 italic mb-2">{line.action}</p>
            )}
            <p className="text-sm text-gray-200 leading-relaxed">"{line.dialogue}"</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ——— Scene Simulator main view ————————————————————————————
export function SceneSimulator() {
  const { activeProject, activeScene, characters } = useApp();
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState<string | null>(null);
  const [selectedCharId, setSelectedCharId] = useState('');
  const [customPrompt, setCustomPrompt] = useState('');

  if (!activeProject || !activeScene) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center empty-state">
          <Clapperboard size={48} className="text-indigo-400/40 mx-auto mb-4" />
          <h3 className="text-white font-semibold text-lg mb-2">No scene loaded</h3>
          <p className="text-gray-500">Open a project with a scene to use the simulator.</p>
        </div>
      </div>
    );
  }

  const projectChars = characters.filter((c) => c.storyId === activeProject.id);
  const selectedChar = projectChars.find((c) => c.id === selectedCharId);

  async function handleGenerateDialogue() {
    if (!selectedChar) return;
    setIsAiLoading(true);
    setAiResult(null);
    const result = await generateDialogue({
      characterName: selectedChar.name,
      characterPersonality: selectedChar.personality,
      sceneContext: activeScene?.description ?? '',
      previousDialogue: activeScene?.lines.map((l) => `${l.characterName}: "${l.dialogue}"`).join('\n') ?? '',
    });
    setAiResult(result.data);
    setIsAiLoading(false);
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between px-8 py-4 border-b border-white/5 bg-void-900/50">
        <div className="flex items-center gap-3">
          <Clapperboard size={18} className="text-indigo-400" />
          <div>
            <h2 className="font-serif font-bold text-white text-lg">{activeScene.title}</h2>
            <div className="flex items-center gap-1.5 mt-0.5">
              <MapPin size={11} className="text-gray-500" />
              <span className="text-xs text-gray-500 truncate max-w-sm">{activeScene.setting}</span>
            </div>
          </div>
        </div>
        <div className="badge-indigo badge">
          <Play size={11} className="mr-1" />
          Scene Active
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Main dialogue area */}
        <div className="flex-1 overflow-auto px-8 py-6">
          {/* Scene description */}
          <div className="card p-4 mb-6 border-l-4 border-indigo-500/50">
            <p className="text-xs text-gray-400 uppercase tracking-wider font-medium mb-1.5">Scene Setup</p>
            <p className="text-sm text-gray-300 leading-relaxed">{activeScene.description}</p>
          </div>

          {/* Dialogue lines */}
          <div className="space-y-5">
            {activeScene.lines.map((line, i) => (
              <DialogueLine key={line.id} line={line} index={i} />
            ))}
          </div>

          {/* AI generated line */}
          {(isAiLoading || aiResult) && (
            <div className="mt-6 card p-5 border-violet-500/20 animate-slide-up">
              <div className="flex items-center gap-2 mb-3">
                <div className="ai-badge">
                  <Sparkles size={11} />
                  AI Dialogue — {selectedChar?.name ?? 'Character'}
                </div>
                <span className="text-xs text-gray-500">(Stage 2 Placeholder)</span>
              </div>
              {isAiLoading ? (
                <div className="flex items-center gap-3 py-3">
                  <Loader size={15} className="animate-spin text-indigo-400" />
                  <span className="text-sm text-gray-400">Generating dialogue...</span>
                </div>
              ) : (
                <p className="text-sm text-gray-300 leading-relaxed italic">"{aiResult}"</p>
              )}
            </div>
          )}
        </div>

        {/* Right control panel */}
        <div className="w-72 border-l border-white/5 bg-void-900/30 p-5 overflow-auto shrink-0">
          <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <Sparkles size={14} className="text-violet-400" />
            AI Controls
            <span className="badge-violet badge text-xs ml-auto">Stage 2</span>
          </h3>

          <div className="space-y-4">
            {/* Character selector */}
            <div>
              <label className="label">Speak as character</label>
              <select
                className="input"
                value={selectedCharId}
                onChange={(e) => setSelectedCharId(e.target.value)}
              >
                <option value="">Select character...</option>
                {projectChars.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            {/* Custom prompt */}
            <div>
              <label className="label">Scene direction (optional)</label>
              <textarea
                className="textarea text-xs"
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                placeholder="e.g. 'React with suspicion but try to hide it'"
                rows={3}
              />
            </div>

            {/* Generate button */}
            <button
              onClick={handleGenerateDialogue}
              disabled={!selectedCharId || isAiLoading}
              className="btn-primary w-full"
            >
              {isAiLoading
                ? <><Loader size={14} className="animate-spin" /> Generating...</>
                : <><Sparkles size={14} /> Generate Dialogue</>
              }
            </button>

            <div className="divider" />

            {/* Scene characters list */}
            <div>
              <p className="label mb-3">Characters in scene</p>
              <div className="space-y-2">
                {projectChars.map((char) => (
                  <div key={char.id} className="flex items-center gap-3 py-2 px-3 rounded-lg bg-white/3 border border-white/5">
                    <div className={`w-7 h-7 rounded-full bg-gradient-to-br ${char.avatarColor} flex items-center justify-center text-xs font-bold text-white`}>
                      {char.avatarInitials}
                    </div>
                    <div>
                      <p className="text-xs font-medium text-white">{char.name}</p>
                      <p className="text-xs text-gray-500 capitalize">{char.role}</p>
                    </div>
                  </div>
                ))}
                <button className="btn-ghost text-xs w-full justify-center border border-dashed border-white/10 mt-1 rounded-lg py-1.5">
                  <Plus size={12} /> Add to scene
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
