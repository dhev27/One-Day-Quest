import React, { useEffect, useState } from 'react';
import { useGame } from '../context/GameContext';
import { Sparkles, Coins, CheckCircle2, X, Gift } from 'lucide-react';

export const QuestCompleteCelebration: React.FC = () => {
  const { lastCompletedQuest, clearLastCompletedQuest, triggerCompanionReaction } = useGame();
  const [rewardOpened, setRewardOpened] = useState(false);

  useEffect(() => {
    if (lastCompletedQuest) {
      setRewardOpened(false);
      const timer = setTimeout(() => {
        clearLastCompletedQuest();
      }, 6000);
      return () => clearTimeout(timer);
    }
  }, [lastCompletedQuest, clearLastCompletedQuest]);

  if (!lastCompletedQuest) return null;

  const { quest, xpGained, coinsGained } = lastCompletedQuest;
  const mysteryReward = quest.customReward || 'Mystery reward';

  const handleOpenReward = () => {
    setRewardOpened(true);
    triggerCompanionReaction('reward-open');
  };

  return (
    <div className="fixed bottom-16 right-4 z-50 w-[min(360px,calc(100vw-1.25rem))] md:bottom-6 md:right-6">
      <div className="animate-bounce rounded-[28px] border border-emerald-200 bg-white p-4 shadow-[0_18px_50px_rgba(16,185,129,0.18)]">
        <button
          onClick={clearLastCompletedQuest}
          className="absolute right-3 top-3 rounded-full p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
        >
          <X className="h-3.5 w-3.5" />
        </button>

        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-100 text-2xl">
            {quest.icon}
          </div>

          <div className="min-w-0 flex-1 pr-4">
            <div className="mb-1 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-700">
              <CheckCircle2 className="h-4 w-4" />
              Quest complete
            </div>
            <div className="text-sm font-bold text-slate-900">{quest.title}</div>

            <div className="mt-2 flex items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-full border border-violet-200 bg-violet-50 px-2 py-1 text-[11px] font-bold text-violet-700">
                <Sparkles className="h-3 w-3" /> +{xpGained} XP
              </span>
              <span className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2 py-1 text-[11px] font-bold text-amber-700">
                <Coins className="h-3 w-3" /> +{coinsGained}
              </span>
            </div>

            <div className="mt-3 rounded-2xl border border-dashed border-emerald-200 bg-emerald-50 p-3">
              <div className="mb-2 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-700">
                <Gift className="h-3.5 w-3.5" />
                Mystery reward
              </div>

              {!rewardOpened ? (
                <button
                  onClick={handleOpenReward}
                  className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-3 py-2 text-xs font-semibold text-white transition hover:-translate-y-0.5"
                >
                  <Gift className="h-3.5 w-3.5" />
                  Open
                </button>
              ) : (
                <div className="reward-reveal rounded-xl border border-emerald-300 bg-white p-2 text-sm font-semibold text-emerald-800">
                  ✨ {mysteryReward}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
