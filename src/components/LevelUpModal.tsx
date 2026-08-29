import React from 'react';
import { useGame } from '../context/GameContext';
import { soundFx } from '../utils/sound';
import { Zap, Trophy, Sparkles, Coins, ArrowRight } from 'lucide-react';

export const LevelUpModal: React.FC = () => {
  const { levelUpModal, closeLevelUpModal, player } = useGame();

  if (!levelUpModal.show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-lg animate-fadeIn">
      <div className="bg-gradient-to-b from-[#1d1238] via-[#120f26] to-[#0a0914] border-2 border-yellow-400 rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-glow-gold text-center relative overflow-hidden animate-levelUp">
        {/* Background rays / particles */}
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-48 h-48 bg-yellow-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Level Icon Graphic */}
        <div className="mx-auto w-20 h-20 rounded-3xl bg-gradient-to-tr from-amber-400 via-yellow-300 to-amber-500 p-1 shadow-glow-gold mb-4 animate-bounce">
          <div className="w-full h-full bg-[#0d0f1a] rounded-[22px] flex flex-col items-center justify-center">
            <Zap className="w-8 h-8 text-yellow-400 fill-yellow-400" />
          </div>
        </div>

        <div className="inline-block px-3 py-1 rounded-full bg-yellow-950/80 border border-yellow-500/50 text-yellow-300 font-extrabold text-xs tracking-widest uppercase mb-2">
          ★ LEVEL ASCENSION ★
        </div>

        <h2 className="font-rpg font-black text-3xl sm:text-4xl bg-gradient-to-r from-yellow-300 via-amber-200 to-yellow-400 bg-clip-text text-transparent mb-2">
          LEVEL {levelUpModal.level}!
        </h2>

        <p className="text-sm text-slate-300 font-medium mb-5">
          Your power grows. The procrastination monster trembles before you!
        </p>

        {/* Rewards Box */}
        <div className="bg-[#141029] border border-purple-800/40 rounded-2xl p-4 mb-6 space-y-2">
          <div className="text-xs font-bold uppercase tracking-wider text-purple-300">
            Ascension Spoils
          </div>
          <div className="flex items-center justify-center gap-4 text-sm font-mono-stat font-bold">
            <span className="text-amber-400 flex items-center gap-1">
              <Coins className="w-4 h-4" /> +50 Bonus Coins
            </span>
            <span className="text-cyan-400 flex items-center gap-1">
              <Sparkles className="w-4 h-4" /> Rank Boost
            </span>
          </div>
          <p className="text-xs text-slate-400">{levelUpModal.rewardsText}</p>
        </div>

        {/* Action Button */}
        <button
          onClick={() => {
            soundFx.playClick(600);
            closeLevelUpModal();
          }}
          className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-yellow-500 via-amber-500 to-yellow-600 hover:from-yellow-400 hover:to-amber-400 text-slate-950 font-rpg font-black text-base shadow-glow-gold flex items-center justify-center gap-2 transition hover:scale-105"
        >
          <span>CONTINUE THE QUEST ⚔️</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
