import React, { useState } from 'react';
import { Compass, Sparkles, Shield, Lock, CheckCircle2, ChevronRight, HelpCircle, Bot, Zap, Brain, Swords, Lightbulb } from 'lucide-react';
import { Roadmap, Phase, Level, Lesson } from '../types';
import { XPBadge } from './Badges';

interface RoadmapTreeProps {
  roadmap: Roadmap;
  onLessonSelect: (phaseId: string, levelId: string, lessonId: string) => void;
  onAiAction: (actionType: 'explain' | 'quiz' | 'study_plan' | 'projects', phaseName: string) => void;
}

export function RoadmapTree({ roadmap, onLessonSelect, onAiAction }: RoadmapTreeProps) {
  const [selectedPhaseId, setSelectedPhaseId] = useState<string>(roadmap.phases[0]?.id || '');
  const [selectedLevelId, setSelectedLevelId] = useState<string | null>(null);

  const activePhase = roadmap.phases.find(p => p.id === selectedPhaseId) || roadmap.phases[0];

  // Alternating margins for Duolingo layout
  const levelOffsets = ['col-start-1 md:col-start-2', 'col-start-2 md:col-start-3', 'col-start-3 md:col-start-4', 'col-start-2 md:col-start-3', 'col-start-1 md:col-start-2'];

  const getLevelStyle = (status: 'locked' | 'current' | 'completed') => {
    switch (status) {
      case 'completed':
        return 'bg-emerald-500 hover:bg-emerald-400 border-emerald-400/30 text-white shadow-[0_0_20px_rgba(16,185,129,0.5)]';
      case 'current':
        return 'bg-gradient-to-br from-purple-500 to-blue-600 animate-pulse-glow text-white border-purple-400/40 shadow-[0_0_25px_rgba(168,85,247,0.5)]';
      default:
        return 'bg-white/5 text-zinc-500 border-white/5 pointer-events-auto opacity-60';
    }
  };

  const getLevelIcon = (type: string, status: 'locked' | 'current' | 'completed') => {
    if (status === 'locked') return <Lock className="w-5 h-5 text-zinc-500" />;
    if (status === 'completed') return <CheckCircle2 className="w-6 h-6 text-white" />;

    // Custom icons for gameplay level types
    switch (type.toLowerCase()) {
      case 'basics':
        return <Compass className="w-5 h-5 text-white animate-spin-slow" />;
      case 'boss challenge':
        return <Swords className="w-5 h-5 text-white animate-bounce" />;
      default:
        return <Sparkles className="w-5 h-5 text-white animate-pulse" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Horizontal Phase Selector (8 phases list) */}
      <div className="bg-[#111111] border border-white/5 rounded-3xl p-4 shadow-md">
        <label className="block text-[10px] font-bold text-zinc-400 tracking-widest uppercase mb-2 px-1">SELECT ROADMAP PHASE</label>
        <div className="flex gap-2 overflow-x-auto pb-1.5 scrollbar-thin scrollbar-thumb-zinc-800">
          {roadmap.phases.map((ph, idx) => {
            const isSelected = ph.id === selectedPhaseId;
            const isCompleted = ph.status === 'completed';
            const isCurrent = ph.status === 'current';

            return (
              <button
                key={ph.id}
                onClick={() => {
                  setSelectedPhaseId(ph.id);
                  setSelectedLevelId(null);
                }}
                className={`px-3.5 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap border gap-2 flex items-center transition-all duration-305 cursor-pointer ${
                  isSelected
                    ? 'bg-gradient-to-br from-purple-500 to-blue-600 text-white border-purple-500 shadow-md'
                    : isCompleted
                      ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/15'
                      : isCurrent
                        ? 'bg-purple-500/10 border-purple-500/20 text-purple-300 animate-pulse-slow'
                        : 'bg-zinc-900 border-transparent text-zinc-400 hover:text-zinc-250 hover:bg-zinc-850'
                }`}
              >
                <span className="font-mono text-[10px] bg-white/5 px-1.5 py-0.5 border border-white/5 rounded text-zinc-400 font-bold">{idx + 1}</span>
                <span>{ph.name}</span>
                {isCompleted && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Active Phase Card Summary View & Interactive Actions */}
      <div className="bg-[#111111] border border-white/5 rounded-3xl p-6 shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-purple-600 rounded-full pointer-events-none blur-[100px] opacity-10" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-5 mb-5">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 rounded border ${
                activePhase.status === 'completed'
                  ? 'text-emerald-450 bg-emerald-500/15 border-emerald-500/30'
                  : activePhase.status === 'current'
                    ? 'text-purple-400 bg-purple-500/15 border-purple-500/30'
                    : 'text-zinc-400 bg-white/5 border-white/5'
              }`}>
                {activePhase.status} Phase
              </span>
              <span className="text-xs font-mono text-zinc-400">
                Est. Duration: {activePhase.estimatedHours} Hours
              </span>
            </div>
            <h2 className="font-display font-bold text-xl text-white mt-1.5">{activePhase.name}</h2>
            <p className="text-xs text-zinc-400 mt-1 max-w-xl leading-relaxed">{activePhase.description}</p>
          </div>

          <div className="flex-shrink-0 flex items-center gap-3">
            <div className="bg-white/[0.02] px-4 py-2 rounded-2xl border border-white/5 text-center">
              <span className="block text-[8px] text-zinc-500 tracking-wider">Earned XP</span>
              <span className="text-base font-extrabold text-purple-400">{activePhase.xpEarned} XP</span>
            </div>
          </div>
        </div>

        {/* Phase Skills Cover */}
        <div className="mb-5">
          <span className="text-[10px] font-bold text-zinc-500 tracking-wider uppercase block mb-1.5">SKILLS COVERED</span>
          <div className="flex gap-1.5 flex-wrap">
            {activePhase.skillsCovered.map(sk => (
              <span key={sk} className="text-[10px] font-semibold text-zinc-350 bg-white/5 px-2.5 py-1 rounded-md border border-white/5">
                {sk}
              </span>
            ))}
          </div>
        </div>

        {/* AI Action prompts */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 border-t border-white/5 pt-4">
          <button
            onClick={() => onAiAction('explain', activePhase.name)}
            className="flex items-center gap-2 px-3 py-2.5 text-xs font-semibold text-purple-300 hover:text-white bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/20 hover:border-purple-500/40 rounded-xl transition-all cursor-pointer text-left"
          >
            <Bot className="w-3.5 h-3.5 flex-shrink-0 text-purple-400" />
            <span>Explain Syllabus</span>
          </button>
          
          <button
            onClick={() => onAiAction('quiz', activePhase.name)}
            className="flex items-center gap-2 px-3 py-2.5 text-xs font-semibold text-blue-300 hover:text-white bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 hover:border-blue-500/40 rounded-xl transition-all cursor-pointer text-left"
          >
            <Zap className="w-3.5 h-3.5 flex-shrink-0 text-blue-400" />
            <span>Generate Quiz</span>
          </button>

          <button
            onClick={() => onAiAction('study_plan', activePhase.name)}
            className="flex items-center gap-2 px-3 py-2.5 text-xs font-semibold text-emerald-300 hover:text-white bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 hover:border-emerald-500/40 rounded-xl transition-all cursor-pointer text-left"
          >
            <Brain className="w-3.5 h-3.5 flex-shrink-0 text-emerald-400" />
            <span>Study Planner</span>
          </button>

          <button
            onClick={() => onAiAction('projects', activePhase.name)}
            className="flex items-center gap-2 px-3 py-2.5 text-xs font-semibold text-amber-300 hover:text-white bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 hover:border-amber-500/40 rounded-xl transition-all cursor-pointer text-left"
          >
            <Lightbulb className="w-3.5 h-3.5 flex-shrink-0 text-amber-400" />
            <span>Project Ideas</span>
          </button>
        </div>
      </div>

      {/* 3. Alternating Duolingo-style tree timeline */}
      <div className="relative flex flex-col items-center py-8 gap-6 bg-[#111111] rounded-3xl border border-white/5 p-6">
        {/* Curved central visual background link line */}
        <div className="absolute top-12 bottom-12 w-1.5 bg-gradient-to-b from-purple-500/20 via-blue-600/20 to-transparent pointer-events-none rounded-full" />

        <div className="w-full max-w-sm flex flex-col items-center gap-8 relative z-10">
          {activePhase.levels.map((lvl, index) => {
            const offsetStyle = index % 2 === 0 ? 'translate-x-4' : '-translate-x-4';
            const isSelected = selectedLevelId === lvl.id;
            
            return (
              <div key={lvl.id} className="flex flex-col items-center w-full">
                {/* Level node circle wrapper */}
                <div className={`transform transition-all duration-300 ${offsetStyle} select-none`}>
                  <button
                    onClick={() => {
                      if (lvl.status !== 'locked' || true) { // Permit clicks to see outline details
                        setSelectedLevelId(isSelected ? null : lvl.id);
                      }
                    }}
                    className={`w-16 h-16 rounded-full flex items-center justify-center border-4 border-[#0A0A0A] transition-transform duration-350 cursor-pointer ${getLevelStyle(lvl.status)} hover:scale-110 active:scale-95`}
                    id={`node-lvl-${lvl.id}`}
                  >
                    {getLevelIcon(lvl.type, lvl.status)}
                  </button>

                  {/* Micro Title Tag text below nodes */}
                  <div className="text-center mt-2 max-w-[110px] mx-auto">
                    <p className="text-[10px] font-extrabold text-zinc-500 uppercase tracking-wider">{lvl.type}</p>
                    <p className="text-xs font-bold text-zinc-300 truncate">{lvl.name}</p>
                  </div>
                </div>

                {/* Level expander popup overlay detailing Chapter contents */}
                {isSelected && (
                  <div className="w-full mt-4 bg-[#0A0A0A] border border-white/10 rounded-2xl p-5 shadow-[0_10px_30px_rgba(0,0,0,0.5)] z-20">
                    <div className="flex items-center justify-between border-b border-white/5 pb-3 mb-4">
                      <div>
                        <span className="text-[9px] font-bold text-purple-400 tracking-wider font-mono">CONCURRENT SYLLABUS: {lvl.type.toUpperCase()}</span>
                        <h4 className="text-sm font-semibold text-white mt-0.5">{lvl.name}</h4>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase ${
                        lvl.status === 'completed'
                          ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
                          : lvl.status === 'current'
                            ? 'text-purple-400 bg-purple-500/10 border-purple-500/30'
                            : 'text-zinc-500 bg-white/5 border-white/5'
                      }`}>
                        {lvl.status}
                      </span>
                    </div>

                    {/* Lesson interactive rows list */}
                    <div className="space-y-2">
                      {lvl.lessons.map((les) => {
                        const isLessonInteractive = les.status !== 'locked';
                        let typeIcon = "📖";
                        if (les.type === 'quiz') typeIcon = "🧠";
                        if (les.type === 'coding') typeIcon = "💻";
                        if (les.type === 'boss_challenge') typeIcon = "🏆";

                        return (
                          <div
                            key={les.id}
                            onClick={() => {
                              if (isLessonInteractive) {
                                onLessonSelect(activePhase.id, lvl.id, les.id);
                              }
                            }}
                            className={`flex items-center justify-between p-3 rounded-xl border text-xs font-medium cursor-pointer transition-all duration-200 ${
                              isLessonInteractive
                                ? les.status === 'completed'
                                  ? 'bg-emerald-500/5 hover:bg-emerald-500/10 border-emerald-500/10 text-emerald-400'
                                  : 'bg-white/5 hover:bg-white/10 hover:border-white/20 border-white/5 text-zinc-200'
                                : 'bg-white/[0.01] border-white/[0.02] text-zinc-650 cursor-not-allowed opacity-40'
                            }`}
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <span className="text-sm flex-shrink-0">{typeIcon}</span>
                              <div className="truncate">
                                <span className="block font-bold text-xs">{les.name}</span>
                                <span className="text-[10px] text-zinc-500 capitalize">{les.type} assessment</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-1.5 flex-shrink-0">
                              <XPBadge amount={les.xpReward} size="sm" />
                              {les.status === 'completed' ? (
                                <CheckCircle2 className="w-4 h-4 text-emerald-505" />
                              ) : (
                                <ChevronRight className="w-3.5 h-3.5 text-zinc-500" />
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
