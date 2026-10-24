// ============================================================
// DASHBOARD VIEW — Story project grid
// ============================================================

import { useState } from 'react';
import { Plus, BookOpen, Clock, FileText, Trash2, ExternalLink, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';
import type { StoryProject } from '../types';

// ——— New project modal ———————————————————————————————————————
function NewProjectModal({ onClose }: { onClose: () => void }) {
  const { createProject } = useApp();
  const [title, setTitle] = useState('');
  const [genre, setGenre] = useState('');
  const [plotSummary, setPlotSummary] = useState('');

  const GENRES = [
    'Literary Fiction', 'Sci-Fi', 'Fantasy', 'Mystery', 'Thriller',
    'Historical Fiction', 'Romance', 'Horror', 'Contemporary Drama',
    'Historical Fantasy', 'Magical Realism', 'Other',
  ];

  const COVER_COLORS = [
    { label: 'Cosmic', value: 'from-indigo-900 via-violet-900 to-slate-900' },
    { label: 'Ember',  value: 'from-amber-900 via-orange-900 to-red-900' },
    { label: 'Ocean',  value: 'from-teal-900 via-cyan-900 to-sky-900' },
    { label: 'Forest', value: 'from-emerald-900 via-green-900 to-teal-900' },
    { label: 'Dusk',   value: 'from-rose-900 via-pink-900 to-purple-900' },
    { label: 'Storm',  value: 'from-slate-800 via-gray-900 to-zinc-900' },
  ];

  const [selectedColor, setSelectedColor] = useState(COVER_COLORS[0].value);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    createProject({
      title: title.trim(),
      genre: genre || 'Fiction',
      plotSummary: plotSummary.trim(),
      manuscript: '',
      status: 'draft',
      coverColor: selectedColor,
    });
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="card w-full max-w-lg animate-slide-up">
        <div className="p-6 border-b border-white/5">
          <h2 className="font-serif text-xl font-bold text-white">New Story Project</h2>
          <p className="text-sm text-gray-400 mt-1">Give your story a home in the verse.</p>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Title */}
          <div>
            <label className="label">Story Title *</label>
            <input
              type="text"
              className="input"
              placeholder="e.g. The Forgotten Kingdom"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              autoFocus
            />
          </div>

          {/* Genre */}
          <div>
            <label className="label">Genre</label>
            <select
              className="input"
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
            >
              <option value="">Select a genre...</option>
              {GENRES.map((g) => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>

          {/* Plot summary */}
          <div>
            <label className="label">Plot Summary (optional)</label>
            <textarea
              className="textarea"
              placeholder="What's your story about? Just a sentence or two is fine — you can expand later."
              value={plotSummary}
              onChange={(e) => setPlotSummary(e.target.value)}
              rows={3}
            />
          </div>

          {/* Cover color */}
          <div>
            <label className="label">Cover Theme</label>
            <div className="flex gap-2 flex-wrap">
              {COVER_COLORS.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => setSelectedColor(c.value)}
                  className={`w-10 h-10 rounded-lg bg-gradient-to-br ${c.value} border-2 transition-all ${
                    selectedColor === c.value
                      ? 'border-indigo-400 scale-110 shadow-glow-sm'
                      : 'border-white/10 hover:border-white/30'
                  }`}
                  title={c.label}
                />
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary flex-1">
              Cancel
            </button>
            <button type="submit" className="btn-primary flex-1" disabled={!title.trim()}>
              <Plus size={16} />
              Create Project
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ——— Project card ————————————————————————————————————————————
function ProjectCard({ project }: { project: StoryProject }) {
  const { setActiveProjectId, setCurrentView, deleteProject } = useApp();

  const statusColors = {
    'draft': 'badge-amber',
    'in-progress': 'badge-indigo',
    'complete': 'badge-green',
  };

  const statusLabels = {
    'draft': 'Draft',
    'in-progress': 'In Progress',
    'complete': 'Complete',
  };

  function openProject() {
    setActiveProjectId(project.id);
    setCurrentView('editor');
  }

  return (
    <div className="card-hover group cursor-pointer overflow-hidden" onClick={openProject}>
      {/* Cover gradient */}
      <div className={`h-28 bg-gradient-to-br ${project.coverColor} relative`}>
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute bottom-3 left-4">
          <span className={statusColors[project.status] + ' badge text-xs'}>
            {statusLabels[project.status]}
          </span>
        </div>
        {/* Hover overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2 flex items-center gap-2 text-white text-sm font-medium">
            <ExternalLink size={14} />
            Open Project
          </div>
        </div>
      </div>

      {/* Card content */}
      <div className="p-4">
        <h3 className="font-serif font-bold text-white text-lg leading-tight mb-1 group-hover:text-indigo-300 transition-colors">
          {project.title}
        </h3>
        <p className="text-xs text-indigo-400 font-medium mb-3">{project.genre}</p>

        {project.plotSummary && (
          <p className="text-xs text-gray-400 leading-relaxed line-clamp-2 mb-3">
            {project.plotSummary}
          </p>
        )}

        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <FileText size={11} />
              {project.wordCount.toLocaleString()} words
            </span>
            <span className="flex items-center gap-1">
              <Clock size={11} />
              {project.updatedAt.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
            </span>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (confirm(`Delete "${project.title}"? This cannot be undone.`)) {
                deleteProject(project.id);
              }
            }}
            className="opacity-0 group-hover:opacity-100 text-red-400/60 hover:text-red-400 transition-all p-1 rounded"
            title="Delete project"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>
    </div>
  );
}

// ——— Dashboard main view ——————————————————————————————————————
export function Dashboard() {
  const { projects } = useApp();
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="flex-1 overflow-auto">
      {/* Hero header */}
      <div className="px-8 pt-10 pb-8 border-b border-white/5">
        <div className="max-w-4xl">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles size={18} className="text-indigo-400" />
            <span className="text-indigo-400 text-sm font-medium uppercase tracking-wider">StoryVerse AI</span>
          </div>
          <h1 className="font-serif text-4xl font-bold text-white mb-3">
            Your Creative <span className="text-gradient">Universe</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-xl leading-relaxed">
            Craft, simulate, and explore every dimension of your stories. 
            AI-powered writing assistance connects in Stage 2.
          </p>
        </div>
      </div>

      {/* Project grid */}
      <div className="px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="section-title text-xl">Your Projects</h2>
            <p className="text-sm text-gray-500">{projects.length} {projects.length === 1 ? 'story' : 'stories'} in the verse</p>
          </div>
          <button onClick={() => setShowModal(true)} className="btn-primary">
            <Plus size={16} />
            New Story
          </button>
        </div>

        {projects.length === 0 ? (
          <div className="empty-state">
            <div className="w-16 h-16 rounded-2xl bg-indigo-600/20 flex items-center justify-center mb-4">
              <BookOpen size={28} className="text-indigo-400" />
            </div>
            <h3 className="text-white font-semibold text-lg mb-2">No stories yet</h3>
            <p className="text-gray-500 mb-6">Create your first story to begin your universe.</p>
            <button onClick={() => setShowModal(true)} className="btn-primary">
              <Plus size={16} />
              Create Your First Story
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {/* Create new card */}
            <button
              onClick={() => setShowModal(true)}
              className="card border-dashed border-white/10 hover:border-indigo-500/40 hover:bg-indigo-600/5
                         flex flex-col items-center justify-center gap-3 py-10 transition-all duration-300 group"
            >
              <div className="w-12 h-12 rounded-xl bg-indigo-600/20 group-hover:bg-indigo-600/30 flex items-center justify-center transition-colors">
                <Plus size={22} className="text-indigo-400" />
              </div>
              <span className="text-sm text-gray-400 group-hover:text-indigo-300 font-medium transition-colors">
                New Story
              </span>
            </button>

            {/* Project cards */}
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </div>

      {/* Tips banner */}
      <div className="mx-8 mb-8 p-5 rounded-xl glass border border-indigo-500/10">
        <div className="flex gap-4 items-start">
          <div className="w-8 h-8 rounded-lg bg-indigo-600/20 flex items-center justify-center shrink-0 mt-0.5">
            <Sparkles size={15} className="text-indigo-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-white mb-1">Getting started</p>
            <p className="text-sm text-gray-400 leading-relaxed">
              Click <strong className="text-indigo-300">"The Last Signal"</strong> to open the demo project — 
              it has a full manuscript, three characters, a scene, and alternate story paths already loaded. 
              Try all the panels to explore the interface!
            </p>
          </div>
        </div>
      </div>

      {showModal && <NewProjectModal onClose={() => setShowModal(false)} />}
    </div>
  );
}
