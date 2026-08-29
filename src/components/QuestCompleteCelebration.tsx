import React, { useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { Sparkles, Coins, CheckCircle2, X } from 'lucide-react';

export const QuestCompleteCelebration: React.FC = () => {
  const { lastCompletedQuest, clearLastCompletedQuest } = useGame();

  useEffect(() => {
    if (lastCompletedQuest) {
      const timer = setTimeout(() => {
        clearLastCompletedQuest();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [lastCompletedQuest, clearLastCompletedQuest]);

  if (!lastCompletedQuest) return null;

  const { quest, xpGained, coinsGained } = lastCompletedQuest;

  return (
    <div className="fixed bottom-16 md:bottom-6 right-4 sm:right-6 z-50 animate-bounce">
      <div className="bg-gradient-to-r from-[#0d2218] via-[#122b20] to-[#0c1a17] border-2 border-emerald-500/80 rounded-2xl p-4 sm:p-5 shadow-glow-emerald max-w-sm w-full text-slate-100 flex items-start gap-3 relative">
        <button
          onClick={clearLastCompletedQuest}
          className="absolute top-2 right-2 text-slate-400 hover:text-white p-1"
        >
          <X className="w-3.5 h-3.5" />
        </button>

        <div className="w-10 h-10 rounded-xl bg-emerald-900/80 border border-emerald-400/60 flex items-center justify-center text-xl shrink-0">
          {quest.icon}
        </div>

        <div className="flex-1 pr-4">
          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 mb-0.5">
            <CheckCircle2 className="w-4 h-4" />
            <span>QUEST CONQUERED!</span>
          </div>

          <div className="text-sm font-rpg font-bold text-white truncate max-w-[200px]">
            {quest.title}
          </div>

          <div className="flex items-center gap-2.5 mt-2">
            <span className="text-xs font-mono-stat font-bold text-purple-300 bg-purple-950/70 border border-purple-800/40 px-2 py-0.5 rounded flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> +{xpGained} XP
            </span>
            <span className="text-xs font-mono-stat font-bold text-amber-300 bg-amber-950/70 border border-amber-800/40 px-2 py-0.5 rounded flex items-center gap-1">
              <Coins className="w-3 h-3" /> +{coinsGained} Coins
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
