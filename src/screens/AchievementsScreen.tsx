import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { Achievement } from '../types/quest';
import { soundFx } from '../utils/sound';
import { Trophy, Sparkles, Coins, Lock, CheckCircle2, Star, Flame } from 'lucide-react';

export const AchievementsScreen: React.FC = () => {
  const { achievements } = useGame();
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const unlockedCount = achievements.filter((a) => a.unlocked).length;
  const totalCount = achievements.length;
  const completionPct = Math.round((unlockedCount / Math.max(totalCount, 1)) * 100);

  const filteredAchievements = achievements.filter((a) => {
    if (filterCategory === 'all') return true;
    if (filterCategory === 'unlocked') return a.unlocked;
    if (filterCategory === 'locked') return !a.unlocked;
    return a.category === filterCategory;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 pb-24">
      {/* Header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Trophy className="w-4 h-4 text-yellow-400" />
            <span className="text-xs font-extrabold uppercase tracking-widest text-yellow-400">
              HALL OF TRIUMPHS
            </span>
          </div>
          <h1 className="font-rpg font-black text-2xl sm:text-3xl md:text-4xl text-white">
            ACHIEVEMENTS 🏆
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Feats of discipline, spontaneity, and daily heroics.
          </p>
        </div>

        {/* Progress Card */}
        <div className="px-5 py-3 rounded-2xl bg-[#101628] border border-[#212e4d] flex items-center gap-4">
          <div className="text-right">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              MEDALS CLAIMED
            </div>
            <div className="text-xl font-mono-stat font-extrabold text-amber-400">
              {unlockedCount} / {totalCount}
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-950/80 border border-amber-500/50 flex items-center justify-center font-black text-xs text-amber-300 font-mono-stat">
            {completionPct}%
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-6">
        {[
          { id: 'all', label: 'All Medals' },
          { id: 'unlocked', label: '✓ Unlocked' },
          { id: 'locked', label: '🔒 Locked' },
          { id: 'beginner', label: 'Beginner' },
          { id: 'mastery', label: 'Mastery' },
          { id: 'exploration', label: 'Exploration' },
          { id: 'social', label: 'Social' },
          { id: 'chaos', label: 'Chaos' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              soundFx.playClick(450);
              setFilterCategory(tab.id);
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
              filterCategory === tab.id
                ? 'bg-gradient-to-r from-amber-500 to-yellow-600 text-slate-950 shadow-glow-gold'
                : 'bg-[#121828] text-slate-400 hover:text-white border border-[#232f4a]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {filteredAchievements.map((ach) => {
          return (
            <div
              key={ach.id}
              className={`p-5 rounded-3xl border flex flex-col justify-between transition-all duration-200 ${
                ach.unlocked
                  ? 'border-amber-500/60 bg-gradient-to-br from-[#1c1626] via-[#121528] to-[#0d101e] shadow-glow-gold/15'
                  : 'border-[#1e273f] bg-[#0c101c]/80 opacity-70'
              }`}
            >
              <div>
                {/* Header */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span
                    className={`text-[10px] font-extrabold px-2 py-0.5 rounded uppercase border ${
                      ach.unlocked
                        ? 'bg-amber-950/80 border-amber-600 text-amber-300'
                        : 'bg-slate-900 border-slate-800 text-slate-500'
                    }`}
                  >
                    {ach.category}
                  </span>

                  {ach.unlocked ? (
                    <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Unlocked {ach.unlockedAt}</span>
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold text-slate-500 flex items-center gap-1">
                      <Lock className="w-3 h-3" />
                      <span>Locked</span>
                    </span>
                  )}
                </div>

                {/* Icon & Title */}
                <div className="flex items-center gap-3.5 mb-3">
                  <div
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shrink-0 ${
                      ach.unlocked
                        ? 'bg-amber-950/90 border-2 border-amber-400 text-amber-300 shadow-glow-gold'
                        : 'bg-slate-900 border border-slate-800 text-slate-600'
                    }`}
                  >
                    {ach.icon}
                  </div>
                  <div>
                    <h3 className="font-rpg font-extrabold text-base text-white">{ach.title}</h3>
                    <p className="text-xs text-slate-400 mt-0.5">{ach.requirementText}</p>
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs text-slate-300 leading-relaxed mb-4">{ach.description}</p>
              </div>

              {/* Progress & Reward Footer */}
              <div>
                {!ach.unlocked && (
                  <div className="mb-3">
                    <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                      <span>Progress</span>
                      <span className="font-mono-stat">{ach.progress}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                      <div
                        className="h-full bg-gradient-to-r from-purple-500 to-amber-400 rounded-full"
                        style={{ width: `${ach.progress}%` }}
                      />
                    </div>
                  </div>
                )}

                <div className="pt-2.5 border-t border-[#1e273f] flex items-center justify-between">
                  <span className="text-[11px] text-slate-500 font-bold uppercase">Bounty</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono-stat font-bold text-purple-300 flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> +{ach.xpReward} XP
                    </span>
                    <span className="text-xs font-mono-stat font-bold text-amber-300 flex items-center gap-1">
                      <Coins className="w-3 h-3" /> +{ach.coinReward}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
