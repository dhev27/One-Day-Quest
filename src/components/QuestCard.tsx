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
  Gift,
  Plus,
  X,
  Edit3,
  Trash2,
  ArrowUp,
  ArrowDown,
  User,
} from 'lucide-react';

interface QuestCardProps {
  quest: Quest;
  onOpenDetail?: (quest: Quest) => void;
  onEdit?: (quest: Quest) => void;
  onMoveUp?: (questId: string) => void;
  onMoveDown?: (questId: string) => void;
  isFirst?: boolean;
  isLast?: boolean;
}

export const QuestCard: React.FC<QuestCardProps> = ({
  quest,
  onOpenDetail,
  onEdit,
  onMoveUp,
  onMoveDown,
  isFirst,
  isLast,
}) => {
  const {
    acceptQuest,
    completeQuest,
    convertSuggestionToActive,
    rejectSuggestion,
    deleteQuest,
    abandonQuest,
    triggerCompanionReaction,
  } = useGame();

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

  const getPriorityBadge = (p?: Quest['priority']) => {
    switch (p) {
      case 'must_do':
        return { label: 'MUST DO 💀', color: 'bg-rose-950/80 text-rose-300 border-rose-600' };
      case 'important':
        return { label: 'IMPORTANT 🔥', color: 'bg-amber-950/80 text-amber-300 border-amber-600' };
      case 'normal':
        return { label: 'NORMAL 🙂', color: 'bg-emerald-950/80 text-emerald-300 border-emerald-600' };
      case 'chill':
        return { label: 'CHILL 😌', color: 'bg-blue-950/80 text-blue-300 border-blue-600' };
      default:
        return null;
    }
  };

  const diffStyle = getDifficultyColor(quest.difficulty);
  const priorityBadge = getPriorityBadge(quest.priority);

  const isCompleted = quest.status === 'completed';
  const isInProgress = quest.status === 'in_progress';
  const isLocked = quest.status === 'locked';
  const isSuggestion = quest.isSuggestion;

  // Card Outer Glow & Styling
  const cardBorderClass = isSuggestion
    ? 'border-dashed border-purple-500/50 bg-[#121124]/90 hover:border-purple-400'
    : isCompleted
    ? 'border-emerald-600/50 bg-[#0d171d]/90 shadow-glow-emerald/20 opacity-90'
    : quest.isUserCreated
    ? 'border-cyan-500/60 bg-[#10172b] shadow-glow-cyan/20 hover:border-cyan-400'
    : quest.isMainQuest
    ? 'border-amber-500/70 bg-[#151724] shadow-glow-gold/30 hover:border-amber-400'
    : isInProgress
    ? 'border-purple-500/70 bg-[#13172c] shadow-glow-xp/25'
    : isLocked
    ? 'border-slate-800 bg-[#0a0d16]/80 opacity-75'
    : 'border-[#222d46] bg-[#111728] hover:border-purple-500/50 hover:bg-[#141b30]';

  return (
    <div
      className={`quest-card-surface rounded-[26px] p-4 sm:p-5 border relative flex flex-col justify-between transition-all duration-200 ${cardBorderClass}`}
    >
      {/* Top Banner Tag for User Created / Suggestion / Boss */}
      {quest.isUserCreated && (
        <div className="absolute -top-3 left-4 px-2.5 py-0.5 rounded-md bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-extrabold text-[10px] uppercase tracking-wider flex items-center gap-1 shadow-md">
          <User className="w-3 h-3" />
          <span>YOUR TASK</span>
        </div>
      )}

      {isSuggestion && (
        <div className="absolute -top-3 left-4 px-2.5 py-0.5 rounded-md bg-gradient-to-r from-purple-600 to-pink-600 text-white font-extrabold text-[10px] uppercase tracking-wider flex items-center gap-1 shadow-md">
          <Sparkles className="w-3 h-3 text-yellow-300 animate-spin" />
          <span>SUGGESTION</span>
        </div>
      )}

      {quest.isMainQuest && !quest.isUserCreated && (
        <div className="absolute -top-3 left-4 px-2.5 py-0.5 rounded-md bg-gradient-to-r from-amber-500 to-yellow-600 text-slate-950 font-extrabold text-[10px] uppercase tracking-wider flex items-center gap-1 shadow-md">
          <Flame className="w-3 h-3 fill-slate-950" />
          <span>BOSS QUEST</span>
        </div>
      )}

      <div>
        {quest.reason && (
          <div className="mb-3 rounded-xl border border-cyan-700/50 bg-cyan-950/30 p-2 text-[11px] text-cyan-100">
            <span className="font-bold text-cyan-300">💡 Why this?</span> {quest.reason}
          </div>
        )}

        {/* Header Badges & Actions */}
        <div className="flex items-center justify-between gap-2 mb-3 mt-1">
          <div className="flex items-center gap-1.5 flex-wrap">
            {priorityBadge && (
              <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md border ${priorityBadge.color}`}>
                {priorityBadge.label}
              </span>
            )}
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-md border flex items-center gap-1 ${diffStyle.bg} ${diffStyle.border} ${diffStyle.text}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${diffStyle.dot}`} />
              {diffStyle.label}
            </span>
          </div>

          {/* Time & Edit/Delete Controls for active user quests */}
          <div className="flex items-center gap-1.5">
            <div className="flex items-center gap-1 text-[11px] text-cyan-300 font-mono-stat font-bold bg-[#090d18] px-2 py-0.5 rounded border border-[#1e283f]">
              <Clock className="w-3 h-3 text-cyan-400" />
              <span>{quest.timeEstimateMinutes}m</span>
            </div>

            {!isSuggestion && !isLocked && (
              <div className="flex items-center gap-0.5">
                {onEdit && (
                  <button
                    onClick={() => {
                      soundFx.playClick(450);
                      onEdit(quest);
                    }}
                    className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
                    title="Edit Task"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                )}

                <button
                  onClick={() => {
                    soundFx.playClick(300);
                    if (confirm(`Remove "${quest.title}" from your daily adventure?`)) {
                      deleteQuest(quest.id);
                    }
                  }}
                  className="p-1 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition"
                  title="Delete Task"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Quest Title & Icon */}
        <div className="flex items-start gap-3 mb-2">
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0 ${
              isCompleted
                ? 'bg-emerald-950/70 border border-emerald-700/60'
                : isInProgress
                ? 'bg-purple-950/70 border border-purple-600/60 animate-pulse'
                : isSuggestion
                ? 'bg-purple-950/80 border border-purple-500/50'
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
                isCompleted
                  ? 'text-emerald-300 line-through'
                  : isLocked
                  ? 'text-slate-500'
                  : 'text-slate-100'
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

        {/* Description */}
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-3">
          {isLocked
            ? quest.secretUnlockRequirement || 'Complete 2-3 quests today to unveil this mystery.'
            : quest.description}
        </p>

        {/* Optional Custom Real-Life Reward Pill */}
        {quest.customReward && !isLocked && (
          <div className="bg-pink-950/40 border border-pink-700/40 rounded-xl px-2.5 py-1.5 mb-3 flex items-center gap-1.5 text-xs text-pink-300">
            <Gift className="w-3.5 h-3.5 text-pink-400 shrink-0" />
            <span className="truncate">
              <strong>Reward:</strong> {quest.customReward}
            </span>
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

        {/* Actions */}
        <div className="flex items-center gap-1.5">
          {isSuggestion ? (
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => {
                  soundFx.playClick(350);
                  rejectSuggestion(quest.id);
                }}
                className="px-2.5 py-1.5 rounded-xl bg-slate-800/80 hover:bg-rose-950/80 border border-slate-700 hover:border-rose-600 text-slate-400 hover:text-rose-300 text-xs font-semibold flex items-center gap-1 transition"
                title="Reject Suggestion"
              >
                <X className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">✕ Not for me</span>
              </button>

              <button
                onClick={() => {
                  soundFx.playQuestAccept();
                  convertSuggestionToActive(quest.id);
                }}
                className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold shadow-glow-xp flex items-center gap-1 transition hover:scale-105"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>✓ Add to Quest</span>
              </button>
            </div>
          ) : isLocked ? (
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

              <button
                onClick={() => {
                  abandonQuest(quest.id);
                }}
                onMouseEnter={() => triggerCompanionReaction('quest-skip-hover')}
                onFocus={() => triggerCompanionReaction('quest-skip-hover')}
                aria-label={`Skip ${quest.title}`}
                className="px-2.5 py-1.5 rounded-lg border border-amber-200 bg-amber-50 text-[11px] font-semibold text-amber-700 transition hover:border-amber-300 hover:bg-amber-100"
              >
                Skip
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1.5">
              <button
                onMouseEnter={() => triggerCompanionReaction('quest-skip-hover')}
                onFocus={() => triggerCompanionReaction('quest-skip-hover')}
                onClick={() => {
                  abandonQuest(quest.id);
                }}
                aria-label={`Skip ${quest.title}`}
                className="px-2.5 py-1.5 rounded-xl border border-slate-200 bg-white text-[11px] font-semibold text-slate-600 transition hover:border-amber-200 hover:text-amber-700"
              >
                Skip
              </button>

              <button
                onClick={() => acceptQuest(quest.id)}
                className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-extrabold shadow-glow-xp flex items-center gap-1.5 transition hover:scale-105 active:scale-95"
              >
                <Swords className="w-3.5 h-3.5" />
                <span>Accept Quest ⚔️</span>
              </button>
            </div>
          )}

          {onOpenDetail && !isSuggestion && (
            <button
              onClick={() => onOpenDetail(quest)}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 transition"
              title="View Lore & Timer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
