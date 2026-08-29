import React from 'react';
import { Quest } from '../types/quest';
import { useGame } from '../context/GameContext';
import { soundFx } from '../utils/sound';
import {
  CheckCircle2,
  Clock,
  Coins,
  Sparkles,
  Swords,
  Lock,
  ChevronRight,
  Flame,
  Zap,
} from 'lucide-react';

interface QuestCardProps {
  quest: Quest;
  onOpenDetail?: (quest: Quest) => void;
}

export const QuestCard: React.FC<QuestCardProps> = ({ quest, onOpenDetail }) => {
  const { acceptQuest, completeQuest } = useGame();

  const getDifficultyColor = (diff: Quest['difficulty']) => {
    switch (diff) {
      case 'easy':
        return {
          bg: 'bg-emerald-950/60',
          border: 'border-emerald-700/60',
          text: 'text-emerald-300',
          label: 'EASY',
          dot: 'bg-emerald-400',
        };
      case 'medium':
        return {
          bg: 'bg-blue-950/60',
          border: 'border-blue-700/60',
          text: 'text-blue-300',
          label: 'MEDIUM',
          dot: 'bg-blue-400',
        };
      case 'hard':
        return {
          bg: 'bg-purple-950/60',
          border: 'border-purple-700/60',
          text: 'text-purple-300',
          label: 'HARD',
          dot: 'bg-purple-400',
        };
      case 'epic':
        return {
          bg: 'bg-rose-950/60',
          border: 'border-rose-600/70',
          text: 'text-rose-300',
          label: 'EPIC BOSS',
          dot: 'bg-rose-400',
        };
    }
  };

  const getCategoryBadge = (cat: Quest['category']) => {
    switch (cat) {
      case 'main':
        return { label: 'MAIN QUEST', color: 'bg-amber-900/60 text-amber-300 border-amber-600/60' };
      case 'side':
        return { label: 'SIDE QUEST', color: 'bg-indigo-900/60 text-indigo-300 border-indigo-600/60' };
      case 'exploration':
        return { label: 'EXPLORATION', color: 'bg-teal-900/60 text-teal-300 border-teal-600/60' };
      case 'social':
        return { label: 'SOCIAL ENCOUNTER', color: 'bg-pink-900/60 text-pink-300 border-pink-600/60' };
      case 'creative':
        return { label: 'CREATIVE CRAFT', color: 'bg-cyan-900/60 text-cyan-300 border-cyan-600/60' };
      case 'recovery':
        return { label: 'HP RECOVERY', color: 'bg-emerald-900/60 text-emerald-300 border-emerald-600/60' };
      case 'random':
        return { label: 'CHAOS CARD', color: 'bg-red-900/60 text-red-300 border-red-600/60' };
      case 'secret':
        return { label: 'SECRET MYSTERY', color: 'bg-purple-900/60 text-purple-200 border-purple-500/60' };
    }
  };

  const diffStyle = getDifficultyColor(quest.difficulty);
  const catStyle = getCategoryBadge(quest.category);

  const isCompleted = quest.status === 'completed';
  const isInProgress = quest.status === 'in_progress';
  const isLocked = quest.status === 'locked';

  // Card Outer Glow & Styling based on status / main
  const cardBorderClass = isCompleted
    ? 'border-emerald-600/50 bg-[#0d171d]/90 shadow-glow-emerald/20 opacity-90'
    : quest.isMainQuest
    ? 'border-amber-500/70 bg-[#151724] shadow-glow-gold/30 hover:border-amber-400'
    : isInProgress
    ? 'border-purple-500/70 bg-[#13172c] shadow-glow-xp/25'
    : isLocked
    ? 'border-slate-800 bg-[#0a0d16]/80 opacity-75'
    : 'border-[#222d46] bg-[#111728] hover:border-purple-500/50 hover:bg-[#141b30]';

  return (
    <div
      className={`rounded-2xl p-4 sm:p-5 border quest-card-hover relative transition-all duration-200 flex flex-col justify-between ${cardBorderClass}`}
    >
      {/* Top Banner Tag for Main Quest */}
      {quest.isMainQuest && (
        <div className="absolute -top-3 left-4 px-2.5 py-0.5 rounded-md bg-gradient-to-r from-amber-500 to-yellow-600 text-slate-950 font-extrabold text-[10px] uppercase tracking-wider flex items-center gap-1 shadow-md">
          <Flame className="w-3 h-3 fill-slate-950" />
          <span>BOSS QUEST</span>
        </div>
      )}

      {/* Chaos Card Badge */}
      {quest.isChaos && (
        <div className="absolute -top-3 right-4 px-2.5 py-0.5 rounded-md bg-rose-600 text-white font-extrabold text-[10px] uppercase tracking-wider flex items-center gap-1 shadow-md">
          <span>😈 CHAOS MODE</span>
        </div>
      )}

      <div>
        {/* Header Badges */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${catStyle.color}`}>
              {catStyle.label}
            </span>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-md border flex items-center gap-1 ${diffStyle.bg} ${diffStyle.border} ${diffStyle.text}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${diffStyle.dot}`} />
              {diffStyle.label}
            </span>
          </div>

          {/* Time estimate */}
          {quest.timeEstimateMinutes && (
            <div className="flex items-center gap-1 text-[11px] text-slate-400">
              <Clock className="w-3 h-3 text-slate-500" />
              <span>{quest.timeEstimateMinutes}m</span>
            </div>
          )}
        </div>

        {/* Quest Title & Icon */}
        <div className="flex items-start gap-3 mb-2">
          <div
            className={`w-11 h-11 rounded-xl flex items-center justify-center text-2xl shrink-0 ${
              isCompleted
                ? 'bg-emerald-950/70 border border-emerald-700/60'
                : isInProgress
                ? 'bg-purple-950/70 border border-purple-600/60 animate-pulse'
                : isLocked
                ? 'bg-slate-900 border border-slate-800'
                : 'bg-slate-900/80 border border-slate-700/70'
            }`}
          >
            {isLocked ? '🔒' : quest.icon}
          </div>

          <div className="flex-1 min-w-0">
            <h3
              onClick={() => onOpenDetail && onOpenDetail(quest)}
              className={`font-rpg font-bold text-base sm:text-lg leading-tight cursor-pointer hover:text-purple-300 transition truncate ${
                isCompleted ? 'text-emerald-300 line-through' : isLocked ? 'text-slate-500' : 'text-slate-100'
              }`}
            >
              {isLocked ? '??? LOCKED SECRET QUEST' : quest.title}
            </h3>
            {quest.subtitle && (
              <p className="text-xs text-purple-300/80 font-medium truncate mt-0.5">
                {isLocked ? 'Unlock requirement below' : quest.subtitle}
              </p>
            )}
          </div>
        </div>

        {/* Description & Lore */}
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-3">
          {isLocked
            ? quest.secretUnlockRequirement || 'Complete 2-3 quests today to unveil this mystery.'
            : quest.description}
        </p>

        {quest.flavorText && !isLocked && (
          <div className="bg-[#0c101c]/70 border-l-2 border-purple-500/60 px-2.5 py-1.5 rounded-r-lg mb-3">
            <p className="text-[11px] text-slate-400 italic">"{quest.flavorText}"</p>
          </div>
        )}
      </div>

      {/* Rewards & Action Controls */}
      <div className="pt-3 border-t border-[#1e283f] flex items-center justify-between gap-2 flex-wrap">
        {/* XP & Coin Badges */}
        <div className="flex items-center gap-1.5">
          <span className="px-2 py-0.5 rounded-md bg-purple-950/60 border border-purple-700/50 text-purple-300 text-xs font-bold font-mono-stat flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-purple-400" />
            +{quest.xpReward} XP
          </span>
          <span className="px-2 py-0.5 rounded-md bg-amber-950/60 border border-amber-700/50 text-amber-300 text-xs font-bold font-mono-stat flex items-center gap-1">
            <Coins className="w-3 h-3 text-amber-400" />
            +{quest.coinReward}
          </span>
        </div>

        {/* Action Button */}
        <div className="flex items-center gap-1.5">
          {isLocked ? (
            <span className="text-[11px] text-slate-500 font-semibold flex items-center gap-1 px-2.5 py-1 rounded bg-slate-900 border border-slate-800">
              <Lock className="w-3 h-3" />
              Locked
            </span>
          ) : isCompleted ? (
            <span className="text-xs font-bold text-emerald-400 flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-950/80 border border-emerald-700">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Conquered ✓
            </span>
          ) : isInProgress ? (
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => onOpenDetail && onOpenDetail(quest)}
                className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1 transition"
                title="Focus Mode / Timer"
              >
                <Clock className="w-3 h-3 text-cyan-400" />
                <span>Timer</span>
              </button>

              <button
                onClick={() => completeQuest(quest.id)}
                className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-glow-emerald flex items-center gap-1 transition hover:scale-105 active:scale-95"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Complete</span>
              </button>
            </div>
          ) : (
            <button
              onClick={() => acceptQuest(quest.id)}
              className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-extrabold shadow-glow-xp flex items-center gap-1.5 transition hover:scale-105 active:scale-95"
            >
              <Swords className="w-3.5 h-3.5" />
              <span>Accept Quest ⚔️</span>
            </button>
          )}

          {onOpenDetail && (
            <button
              onClick={() => onOpenDetail(quest)}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 transition"
              title="View Lore & Details"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
