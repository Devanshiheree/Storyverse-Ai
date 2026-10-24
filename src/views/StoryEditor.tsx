
import { useState, useEffect } from "react";
import {
  Save,
  BookOpen,
  Sparkles,
  FileText,
  Tag,
  AlignLeft,
  Clock,
  Loader,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { continueManuscript } from "../services/ai";

export function StoryEditor() {
  const { activeProject, updateProject } = useApp();

  const [isSaving, setIsSaving] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiPreview, setAiPreview] = useState<string | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);
  const [saveFlash, setSaveFlash] = useState(false);

  const [title, setTitle] = useState(activeProject?.title ?? "");
  const [genre, setGenre] = useState(activeProject?.genre ?? "");
  const [plotSummary, setPlotSummary] = useState(
    activeProject?.plotSummary ?? ""
  );
  const [manuscript, setManuscript] = useState(
    activeProject?.manuscript ?? ""
  );

  useEffect(() => {
    setTitle(activeProject?.title ?? "");
    setGenre(activeProject?.genre ?? "");
    setPlotSummary(activeProject?.plotSummary ?? "");
    setManuscript(activeProject?.manuscript ?? "");
    setAiPreview(null);
    setAiError(null);
  }, [activeProject?.id]);

  if (!activeProject) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <BookOpen
            size={48}
            className="text-indigo-400/40 mx-auto mb-4"
          />
          <p className="text-gray-400">
            No project open. Return to the dashboard.
          </p>
        </div>
      </div>
    );
  }

  // Capture the ID after the null check so TypeScript knows it exists.
  const projectId = activeProject.id;

  const wordCount = manuscript.trim()
    ? manuscript.trim().split(/\s+/).length
    : 0;

  async function handleSave() {
    setIsSaving(true);

    try {
      updateProject(projectId, {
        title,
        genre,
        plotSummary,
        manuscript,
      });

      setSaveFlash(true);
      window.setTimeout(() => setSaveFlash(false), 2000);
    } finally {
      setIsSaving(false);
    }
  }

  async function handleAiContinue() {
    if (!manuscript.trim()) {
      setAiError(
        "Write a few sentences in your manuscript before asking AI to continue."
      );
      setAiPreview(null);
      return;
    }

    setIsAiLoading(true);
    setAiPreview(null);
    setAiError(null);

    try {
      const result = await continueManuscript(
        manuscript,
        genre,
        plotSummary
      );

      if (result.error) {
        setAiError(result.error);
      } else if (result.data) {
        setAiPreview(result.data);
      } else {
        setAiError("The AI returned no text. Please try again.");
      }
    } catch {
      setAiError("Something went wrong. Please try again.");
    } finally {
      setIsAiLoading(false);
    }
  }

  function appendContinuation() {
    if (!aiPreview) return;

    setManuscript((current) => {
      const separator = current.endsWith("\n") ? "\n" : "\n\n";
      return `${current}${separator}${aiPreview}`;
    });

    setAiPreview(null);
    setAiError(null);
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden animate-fade-in">
      <div className="flex items-center justify-between px-8 py-4 border-b border-white/5 bg-void-900/50">
        <div className="flex items-center gap-3">
          <BookOpen size={18} className="text-indigo-400" />
          <h2 className="font-serif font-bold text-white text-lg">
            Story Editor
          </h2>
          <span className="badge-indigo badge">
            {genre || "No genre"}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-500 flex items-center gap-1.5">
            <FileText size={12} />
            {wordCount.toLocaleString()} words
          </span>

          <button
            onClick={handleSave}
            disabled={isSaving}
            className={`btn-primary ${
              saveFlash ? "bg-emerald-600 hover:bg-emerald-600" : ""
            }`}
          >
            {isSaving ? (
              <Loader size={15} className="animate-spin" />
            ) : (
              <Save size={15} />
            )}
            {saveFlash ? "Saved!" : "Save"}
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto px-8 py-6 space-y-6">
        <div className="grid grid-cols-2 gap-5">
          <div>
            <label className="label flex items-center gap-1.5">
              <Tag size={11} />
              Story Title
            </label>
            <input
              type="text"
              className="input font-serif text-base"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Your story's title..."
            />
          </div>

          <div>
            <label className="label flex items-center gap-1.5">
              <Tag size={11} />
              Genre
            </label>
            <input
              type="text"
              className="input"
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              placeholder="e.g. Sci-Fi, Fantasy, Drama..."
            />
          </div>
        </div>

        <div>
          <label className="label flex items-center gap-1.5">
            <AlignLeft size={11} />
            Plot Summary
          </label>
          <textarea
            className="textarea"
            value={plotSummary}
            onChange={(e) => setPlotSummary(e.target.value)}
            placeholder="Briefly describe your story's premise, conflict, and stakes..."
            rows={3}
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: "0.875rem",
            }}
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="label flex items-center gap-1.5 mb-0">
              <BookOpen size={11} />
              Manuscript
            </label>

            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 flex items-center gap-1">
                <Clock size={11} />
                ~{Math.ceil(wordCount / 200)} min read
              </span>

              <button
                onClick={handleAiContinue}
                disabled={isAiLoading}
                className="btn-secondary text-xs py-1.5 px-3"
                title="Continue your manuscript using Google Gemini"
              >
                {isAiLoading ? (
                  <Loader size={12} className="animate-spin" />
                ) : (
                  <Sparkles size={12} />
                )}
                {isAiLoading ? "Generating..." : "AI Continue"}
              </button>
            </div>
          </div>

          <textarea
            className="textarea w-full"
            value={manuscript}
            onChange={(e) => setManuscript(e.target.value)}
            placeholder={`Begin writing your story here...

CHAPTER ONE

Your story starts with a single word.`}
            rows={22}
          />
        </div>

        {aiError && (
          <div
            role="alert"
            className="card p-4 border-red-500/30 text-red-300 text-sm"
          >
            <div className="flex items-start justify-between gap-3">
              <p>{aiError}</p>
              <button
                onClick={() => setAiError(null)}
                className="text-xs underline shrink-0"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}

        {(isAiLoading || aiPreview) && (
          <div className="card p-5 border-indigo-500/20 animate-slide-up">
            <div className="flex items-center gap-2 mb-3">
              <div className="ai-badge">
                <Sparkles size={11} />
                AI Continuation Preview
              </div>
              <span className="text-xs text-gray-500">
                Powered by Google Gemini
              </span>
            </div>

            {isAiLoading ? (
              <div className="flex items-center gap-3 py-4 text-gray-400">
                <Loader
                  size={16}
                  className="animate-spin text-indigo-400"
                />
                <span className="text-sm">
                  Generating your continuation...
                </span>
              </div>
            ) : (
              <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-wrap">
                {aiPreview}
              </p>
            )}

            {aiPreview && (
              <div className="flex flex-wrap gap-2 mt-4">
                <button
                  onClick={appendContinuation}
                  className="btn-primary text-xs"
                >
                  Append to Manuscript
                </button>

                <button
                  onClick={() => setAiPreview(null)}
                  className="btn-secondary text-xs"
                >
                  Dismiss
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
