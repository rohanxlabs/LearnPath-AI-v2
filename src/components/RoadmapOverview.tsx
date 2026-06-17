import React, { useState } from 'react';
import { Compass, Sparkles, AlertTriangle, Play, Flame, BarChart3, Clock, CheckSquare, Plus, PlusCircle, Laptop, GraduationCap, ChevronRight, Check } from 'lucide-react';
import { Roadmap, Phase } from '../types';
import { XPBadge, StreakBadge } from './Badges';

interface RoadmapOverviewProps {
  roadmaps: Roadmap[];
  activeId: string;
  onSetActive: (id: string) => void;
  onGenerateRoadmap: (params: {
    goal: string;
    experienceLevel: string;
    weeklyHours: number;
    preferredStyle: string;
  }) => Promise<void>;
  isGenerating: boolean;
  onContinueActive: () => void;
}

export function RoadmapOverview({
  roadmaps,
  activeId,
  onSetActive,
  onGenerateRoadmap,
  isGenerating,
  onContinueActive
}: RoadmapOverviewProps) {
  const [showGenerator, setShowGenerator] = useState(false);
  const [goal, setGoal] = useState('');
  const [experienceLevel, setExperienceLevel] = useState('Beginner');
  const [weeklyHours, setWeeklyHours] = useState(10);
  const [preferredStyle, setPreferredStyle] = useState('Hands-on');

  const activeRoadmap = roadmaps.find(r => r.id === activeId) || roadmaps[0];

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!goal.trim()) return;
    await onGenerateRoadmap({ goal, experienceLevel, weeklyHours: Number(weeklyHours), preferredStyle });
    setShowGenerator(false);
    setGoal('');
  };

  // Loading quotes for dynamic feel
  const loadingQuotes = [
    "Orchestrating adaptive phases...",
    "Calibrating multiple-choice quizzes...",
    "Synthesizing coding environment parameters...",
    "Structuring foundational neural definitions with Gemini...",
    "Completing Duolingo-styleRPG node linkages..."
  ];

  const [quoteIdx, setQuoteIdx] = useState(0);
  React.useEffect(() => {
    if (isGenerating) {
      const interval = setInterval(() => {
        setQuoteIdx((prev) => (prev + 1) % loadingQuotes.length);
      }, 2500);
      return () => clearInterval(interval);
    }
  }, [isGenerating]);

  return (
    <div className="space-y-6">
      {/* Upper header action list */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="font-display font-bold text-2xl text-white">Your Roadmaps</h2>
          <p className="text-xs text-zinc-400">Select or architect a personalized learning syllabus.</p>
        </div>

        <button
          onClick={() => setShowGenerator(!showGenerator)}
          className="inline-flex items-center gap-2 px-3.5 py-2 font-bold text-xs text-white bg-[#111111] hover:bg-zinc-850 border border-white/5 rounded-xl transition-all cursor-pointer shadow-sm"
          id="btn-trigger-roadmap-gen"
        >
          {showGenerator ? 'Close Dashboard' : 'Create Roadmap'}
          {!showGenerator && <Plus className="w-4 h-4 text-purple-400" />}
        </button>
      </div>

      {/* Generator Form panel widget */}
      {showGenerator && (
        <form onSubmit={handleCreate} className="p-5 rounded-2xl bg-[#111111] border border-white/5 shadow-xl space-y-4 relative">
          <div className="flex items-center gap-2 border-b border-white/5 pb-3 mb-1">
            <GraduationCap className="w-5 h-5 text-purple-400" />
            <div>
              <h3 className="font-display font-semibold text-sm text-white">AI Roadmap Architect</h3>
              <p className="text-[10px] text-zinc-500">Provide study params and let GenAI synthesize your tree.</p>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-[10px] uppercase font-mono font-bold text-zinc-400 tracking-wider">Goal / Project Intent</label>
            <input
              type="text"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              placeholder="e.g. Master LangChain, build Stable Diffusion models..."
              className="w-full px-3.5 py-2.5 bg-[#0A0A0A] border border-white/5 rounded-xl text-xs text-white focus:outline-hidden focus:border-purple-500"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="block text-[10px] uppercase font-mono font-bold text-zinc-400 tracking-wider">Experience Level</label>
              <select
                value={experienceLevel}
                onChange={(e) => setExperienceLevel(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#0A0A0A] border border-white/5 rounded-xl text-xs text-zinc-200"
              >
                <option value="Beginner">Beginner (Slow walkthroughs)</option>
                <option value="Intermediate">Intermediate (Normal speed)</option>
                <option value="Advanced">Advanced (High-density terms)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-[10px] uppercase font-mono font-bold text-zinc-400 tracking-wider">Study Hours Per Week</label>
              <select
                value={weeklyHours}
                onChange={(e) => setWeeklyHours(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-[#0A0A0A] border border-white/5 rounded-xl text-xs text-zinc-200"
              >
                <option value={5}>5 Hours (Casual study)</option>
                <option value={10}>10 Hours (Steady builder)</option>
                <option value={15}>15 Hours (Career transition)</option>
                <option value={20}>20 Hours (Ultimate sandbox)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-[10px] uppercase font-mono font-bold text-zinc-400 tracking-wider">Learning Style Preference</label>
              <select
                value={preferredStyle}
                onChange={(e) => setPreferredStyle(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#0A0A0A] border border-white/5 rounded-xl text-xs text-zinc-200"
              >
                <option value="Hands-on">Hands-on (Code exercises & puzzles)</option>
                <option value="Visual">Visual (Mind maps & diagrams)</option>
                <option value="Theoretical">Theoretical (Math formulas & calculus)</option>
              </select>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isGenerating || !goal.trim()}
              className="w-full py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-br from-purple-500 to-blue-600 hover:brightness-110 disabled:opacity-50 transition-all cursor-pointer shadow-[0_0_15px_rgba(168,85,247,0.3)] flex items-center justify-center gap-2"
              id="btn-submit-roadmap-gen"
            >
              <Sparkles className="w-4 h-4 animate-spin-slow" />
              <span>{isGenerating ? 'Synthesizing Roadmap Tree...' : 'Generate Personalized Curriculum'}</span>
            </button>
          </div>
        </form>
      )}

      {/* AI Loader overlay panel inside component context */}
      {isGenerating && (
        <div className="p-8 rounded-2xl bg-zinc-950 border border-zinc-800 text-center space-y-4 shadow-2xl relative overflow-hidden flex flex-col items-center">
          <div className="w-12 h-12 rounded-2xl bg-linear-to-tr from-violet-600 to-blue-600 flex items-center justify-center animate-spin text-white">
            <Sparkles className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="font-display font-semibold text-white">Personalizing Syllabus</h3>
            <p className="text-xs text-zinc-400">Our server-side Gemini intelligence is tailoring chapters, practice metrics, and assessments.</p>
          </div>
          <div className="px-4 py-1.5 rounded-md bg-zinc-900 border border-zinc-800 text-[10px] text-violet-400 font-mono animate-pulse">
            Active Hook: {loadingQuotes[quoteIdx]}
          </div>
        </div>
      )}

      {/* 3. Roadmaps list display */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {roadmaps.map((r) => {
          const isActive = r.id === activeId;
          const totalPhases = r.phases.length;
          const completedPhases = r.phases.filter(p => p.status === 'completed').length;

          return (
            <div
              key={r.id}
              onClick={() => onSetActive(r.id)}
              className={`p-5 rounded-3xl border transition-all duration-300 cursor-pointer flex flex-col justify-between h-48 relative overflow-hidden ${
                isActive
                  ? 'bg-[#111111] border-purple-500/30 shadow-[0_4px_20px_rgba(168,85,247,0.1)]'
                  : 'bg-[#111111]/45 border-white/5 opacity-80 hover:opacity-100 hover:border-white/10'
              }`}
            >
              {isActive && (
                <div className="absolute top-0 right-0 w-3 h-3 bg-gradient-to-bl from-purple-500 to-blue-600 rounded-bl-xl shadow-md" />
              )}

              <div>
                <div className="flex items-center justify-between gap-2 text-[10px] font-mono mb-2">
                  <span className="text-zinc-500 font-semibold">{new Date(r.createdAt).toLocaleDateString()}</span>
                  <span className="text-purple-400 font-extrabold uppercase">Goal: {r.experienceLevel}</span>
                </div>
                <h3 className="font-display font-bold text-base text-white leading-snug line-clamp-2">
                  {r.goal}
                </h3>
              </div>

              <div>
                {/* Micro progress status */}
                <div className="flex justify-between items-center text-[10px] mb-1 text-zinc-400">
                  <span className="font-mono">Completed: {completedPhases}/{totalPhases} Chapters</span>
                  <span className="font-bold text-white">{r.progressPercent}%</span>
                </div>
                
                {/* Solid bar line */}
                <div className="w-full h-1.5 rounded-full bg-[#0A0A0A] overflow-hidden border border-white/5">
                  <div
                    className="h-full bg-gradient-to-r from-purple-500 to-blue-600 rounded-full transition-all duration-350"
                    style={{ width: `${r.progressPercent}%` }}
                  />
                </div>

                <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
                  <span className="text-[10px] text-zinc-500 font-medium">Style: {r.preferredStyle} ({r.weeklyHours}h/wk)</span>
                  {isActive ? (
                    <span className="inline-flex items-center gap-1 text-[10px] text-purple-400 font-bold">
                      <span>ACTIVE VIEW</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  ) : (
                    <span className="text-[10px] text-zinc-400 font-semibold hover:text-white transition-colors">
                      Switch Active
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
