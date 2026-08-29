import React from 'react';
import { useGame } from '../context/GameContext';
import { Sparkles, Unlock, ArrowRight } from 'lucide-react';

export const SecretUnlockedModal: React.FC = () => {
  const { secretUnlockedQuest, clearSecretUnlockedQuest } = useGame();

  if (!secretUnlockedQuest) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="bg-gradient-to-b from-[#22103d] via-[#150d26] to-[#0a0614] border-2 border-purple-400 rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-glow-purple text-center relative">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-600 via-pink-600 to-amber-400 p-0.5 mx-auto mb-3 shadow-glow-xp animate-pulse">
          <div className="w-full h-full bg-[#0d091a] rounded-[14px] flex items-center justify-center text-3xl">
            ✨
          </div>
        </div>

        <div className="inline-block px-3 py-1 rounded-full bg-purple-950 border border-purple-500/50 text-purple-300 font-extrabold text-xs tracking-widest uppercase mb-2">
          <Unlock className="w-3 h-3 inline mr-1" />
          SECRET UNLOCKED!
        </div>

        <h2 className="font-rpg font-extrabold text-2xl text-yellow-300 mb-2">
          {secretUnlockedQuest.title}
        </h2>

        <p className="text-xs sm:text-sm text-slate-200 leading-relaxed mb-4">
          {secretUnlockedQuest.description}
        </p>

        <div className="bg-[#120a22] border border-purple-900/60 rounded-2xl p-3 mb-5">
          <div className="text-xs text-purple-300 font-mono-stat font-bold">
            BOUNTY: +{secretUnlockedQuest.xpReward} XP & +{secretUnlockedQuest.coinReward} Coins
          </div>
        </div>

        <button
          onClick={clearSecretUnlockedQuest}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-rpg font-bold text-sm shadow-glow-xp flex items-center justify-center gap-2 transition hover:scale-105"
        >
          <span>CLAIM & VIEW QUEST BOARD</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
