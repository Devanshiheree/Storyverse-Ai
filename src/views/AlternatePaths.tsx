// ============================================================
// ALTERNATE PATHS VIEW — Story forking / "What if?" explorer
// ============================================================

import { useState } from 'react';
import { GitBranch, Plus, Sparkles, ArrowRight, ChevronDown, ChevronUp, Loader } from 'lucide-react';
import { useApp } from '../context/AppContext';
import type { AltDecision } from '../types';
import { suggestAlternatives } from '../services/ai';
import { clsx } from 'clsx';

// ——— Tone styling ————————————————————————————————————————————
const TONE_STYLES: Record<AltDecision['tone'], { badge: string; accent: string; dot: string }> = {
  dark:     { badge: 'bg-red-500/20 text-red-300 border-red-500/20',     accent: 'border-l-red-500/60',     dot: 'bg-red-400' },
  hopeful:  { badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/20', accent: 'border-l-emerald-500/60', dot: 'bg-emerald-400' },
  neutral:  { badge: 'bg-gray-500/20 text-gray-300 border-gray-500/20',   accent: 'border-l-gray-500/60',   dot: 'bg-gray-400' },
  tragic:   { badge: 'bg-violet-500/20 text-violet-300 border-violet-500/20', accent: 'border-l-violet-500/60', dot: 'bg-violet-400' },
  comedic:  { badge: 'bg-amber-500/20 text-amber-300 border-amber-500/20', accent: 'border-l-amber-500/60', dot: 'bg-amber-400' },
};

// ——— Single alternative card ————————————————————————————————
function AlternativeCard({ alt }: { alt: AltDecision }) {
  const [expanded, setExpanded] = useState(false);
  const style = TONE_STYLES[alt.tone];

  return (
    <div className={clsx(
      'card border-l-4 hover:bg-void-700/50 transition-all duration-200',
      style.accent
    )}>
      <div
        className="p-4 cursor-pointer"
        onClick={() => setExpanded((e) => !e)}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3 flex-1">
            <div className={clsx('w-2 h-2 rounded-full mt-1.5 shrink-0', style.dot)} />
            <div>
              <h4 className="font-semibold text-white text-sm mb-1 leading-snug">
                {alt.label}
              </h4>
              <span className={clsx('badge text-xs border', style.badge)}>
                {alt.tone}
              </span>
            </div>
          </div>
          <button className="text-gray-500 hover:text-gray-300 transition-colors shrink-0 mt-0.5">
            {expanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
          </button>
        </div>
      </div>

      {expanded && (
        <div className="px-4 pb-4 space-y-3 animate-slide-up">
          <div className="border-t border-white/5 pt-3">
            <p className="text-xs text-gray-400 uppercase tracking-wider font-medium mb-1.5">The Change</p>
            <p className="text-sm text-gray-300 leading-relaxed">{alt.description}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wider font-medium mb-1.5">
              <ArrowRight size={10} className="inline mr-1" />
              Downstream Effects
            </p>
            <p className="text-sm text-gray-300 leading-relaxed">{alt.outcome}</p>
          </div>
          <div className="flex gap-2 pt-1">
            <button className="btn-primary text-xs" disabled title="Stage 2: Branch this path as a new project variant">
              <GitBranch size={12} />
              Branch Story (Stage 2)
            </button>
            <button className="btn-secondary text-xs" disabled title="Stage 2: AI expands this branch further">
              <Sparkles size={12} />
              Expand with AI (Stage 2)
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ——— Alternate Paths main view ————————————————————————————
export function AlternatePaths() {
  const { activeProject, forks } = useApp();
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<string[] | null>(null);
  const [branchPrompt, setBranchPrompt] = useState('');

  if (!activeProject) return null;

  const projectForks = forks.filter((f) => f.storyId === activeProject.id);
  const activeFork = projectForks[0] ?? null;

  async function handleAiSuggest() {
    if (!activeProject) return;
    setIsAiLoading(true);
    setAiSuggestions(null);
    const result = await suggestAlternatives({
      storyTitle: activeProject.title,
      plotSummary: activeProject.plotSummary,
      currentBranchPoint: branchPrompt || activeFork?.branchPoint || 'the pivotal decision',
    });
    setAiSuggestions(result.data);
    setIsAiLoading(false);
  }

  return (
    <div className="flex-1 overflow-auto animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between px-8 py-5 border-b border-white/5">
        <div className="flex items-center gap-3">
          <GitBranch size={18} className="text-indigo-400" />
          <div>
            <h2 className="font-serif font-bold text-white text-lg">Alternate Paths</h2>
            <p className="text-xs text-gray-500">Explore "what if" branches without changing your original story</p>
          </div>
        </div>
      </div>

      <div className="px-8 py-6 space-y-8">
        {/* How it works */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { icon: '✦', title: 'Preserve the Original', desc: 'Your main story is never touched. Branches exist in a separate sandbox.' },
            { icon: '⟁', title: 'Choose a Fork Point', desc: 'Pick any moment in your story — a decision, a conversation, a revelation.' },
            { icon: '◈', title: 'Explore Outcomes', desc: 'See how different choices cascade through the rest of your narrative.' },
          ].map((item) => (
            <div key={item.title} className="card p-4 text-center">
              <div className="text-2xl mb-2 text-indigo-400">{item.icon}</div>
              <h4 className="text-sm font-semibold text-white mb-1">{item.title}</h4>
              <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Active fork */}
        {activeFork && (
          <div>
            {/* Branch point */}
            <div className="card p-5 mb-5 border-indigo-500/20">
              <div className="flex items-center gap-2 mb-3">
                <GitBranch size={14} className="text-indigo-400" />
                <span className="text-xs font-medium text-indigo-300 uppercase tracking-wider">Branch Point</span>
              </div>
              <h3 className="font-serif font-bold text-white text-xl mb-3">{activeFork.branchPoint}</h3>
              <div className="flex items-start gap-3 p-3 rounded-lg bg-indigo-500/5 border border-indigo-500/10">
                <div className="w-2 h-2 rounded-full bg-indigo-400 mt-1.5 shrink-0" />
                <div>
                  <p className="text-xs text-gray-400 uppercase font-medium mb-1">Original path</p>
                  <p className="text-sm text-gray-300">{activeFork.originalPath}</p>
                </div>
              </div>
            </div>

            {/* Alternatives */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-white">
                Alternative Paths
                <span className="ml-2 text-xs text-gray-500 font-normal">({activeFork.alternatives.length} branches)</span>
              </h3>
              <button className="btn-ghost text-xs">
                <Plus size={13} />
                Add path manually
              </button>
            </div>

            <div className="space-y-3">
              {activeFork.alternatives.map((alt) => (
                <AlternativeCard key={alt.id} alt={alt} />
              ))}
            </div>
          </div>
        )}

        {/* AI suggestions panel */}
        <div className="card p-6 border-violet-500/15">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles size={16} className="text-violet-400" />
            <h3 className="font-semibold text-white">AI Path Suggestions</h3>
            <span className="badge-violet badge ml-auto">Stage 2</span>
          </div>
          <p className="text-sm text-gray-400 mb-4 leading-relaxed">
            In Stage 2, AI will analyse your plot and characters to suggest meaningful alternate paths 
            you might not have considered — each with downstream story consequences.
          </p>
          <div className="mb-4">
            <label className="label">What decision or moment to branch from?</label>
            <input
              className="input"
              value={branchPrompt}
              onChange={(e) => setBranchPrompt(e.target.value)}
              placeholder={activeFork?.branchPoint ?? 'e.g. "Chapter 3 — when Yara hears the second signal"'}
            />
          </div>
          <button
            onClick={handleAiSuggest}
            disabled={isAiLoading}
            className="btn-primary"
          >
            {isAiLoading
              ? <><Loader size={14} className="animate-spin" /> Generating...</>
              : <><Sparkles size={14} /> Suggest Alternatives</>
            }
          </button>

          {/* AI result preview */}
          {(isAiLoading || aiSuggestions) && (
            <div className="mt-5 space-y-3 animate-slide-up">
              <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">AI Suggestions (Placeholder)</p>
              {isAiLoading ? (
                <div className="flex items-center gap-3 py-3 text-gray-400">
                  <Loader size={14} className="animate-spin text-violet-400" />
                  <span className="text-sm">Analysing your story...</span>
                </div>
              ) : aiSuggestions?.map((s, i) => (
                <div key={i} className="p-3 rounded-lg bg-violet-500/10 border border-violet-500/15">
                  <p className="text-sm text-violet-200">{s}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {!activeFork && projectForks.length === 0 && (
          <div className="empty-state">
            <div className="w-16 h-16 rounded-2xl bg-indigo-600/20 flex items-center justify-center mb-4">
              <GitBranch size={28} className="text-indigo-400" />
            </div>
            <h3 className="text-white font-semibold text-lg mb-2">No branches yet</h3>
            <p className="text-gray-500 max-w-sm">
              Open the demo project to see sample alternate paths, or create a fork point for your story above.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
