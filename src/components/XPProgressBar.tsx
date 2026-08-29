import React from 'react';
import { useGame } from '../context/GameContext';
import { Sparkles, Zap } from 'lucide-react';

export const XPProgressBar: React.FC = () => {
  const { player } = useGame();
  const percentage = Math.min(100, Math.round((player.currentXp / Math.max(player.xpToNextLevel, 1)) * 100));

  return (
    <div className="w-full bg-[#101626] border border-[#222e47] rounded-2xl p-3.5 sm:p-4 shadow-xl relative overflow-hidden">
      {/* Background glow ambient */}
      <div className="absolute -top-10 -right-10 w-36 h-36 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-36 h-36 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex items-center justify-between gap-3 mb-2">
        <div className="flex items-center gap-2">
          {/* Level Badge */}
          <div className="relative">
            <div className="px-3 py-1 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-800 text-white font-rpg font-extrabold text-sm sm:text-base tracking-wider shadow-glow-purple border border-purple-400/40 flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-yellow-300 fill-yellow-300" />
              <span>LEVEL {player.level}</span>
            </div>
          </div>
          <span className="text-xs sm:text-sm text-slate-300 font-semibold tracking-wide hidden sm:inline">
            {player.title}
          </span>
        </div>

        {/* Numeric XP Ratio */}
        <div className="flex items-center gap-2">
          <div className="text-right">
            <span className="font-mono-stat font-bold text-sm sm:text-base text-purple-300">
              {player.currentXp}
            </span>
            <span className="text-xs text-slate-400 font-mono-stat"> / {player.xpToNextLevel} XP</span>
          </div>
          <span className="text-xs font-bold text-amber-400 bg-amber-950/60 border border-amber-800/40 px-2 py-0.5 rounded-lg">
            {percentage}%
          </span>
        </div>
      </div>

      {/* Animated XP Track */}
      <div className="w-full h-3.5 sm:h-4 bg-[#0a0d18] rounded-full p-0.5 border border-[#232f4a] relative overflow-hidden shadow-inner">
        <div
          className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400 transition-all duration-700 ease-out relative"
          style={{ width: `${percentage}%` }}
        >
          {/* Shimmer effect overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
        </div>
      </div>

      <div className="flex justify-between items-center mt-2 text-[11px] text-slate-400">
        <span className="flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-purple-400" />
          <span>Complete quests to earn XP and level up</span>
        </span>
        <span className="font-medium text-slate-300">
          {player.xpToNextLevel - player.currentXp} XP to Level {player.level + 1}
        </span>
      </div>
    </div>
  );
};
