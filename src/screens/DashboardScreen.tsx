import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { XPProgressBar } from '../components/XPProgressBar';
import { TimeBudgetMeter } from '../components/TimeBudgetMeter';
import { QuestCard } from '../components/QuestCard';
import { QuestDetailModal } from '../components/QuestDetailModal';
import { TaskCreateEditModal } from '../components/TaskCreateEditModal';
import { Quest } from '../types/quest';
import { soundFx } from '../utils/sound';
import {
  Flame,
  Coins,
  Heart,
  Sparkles,
  Swords,
  Dices,
  Plus,
  Wand2,
  Filter,
  CheckCircle2,
  Clock,
  Compass,
  Lock,
  ChevronRight,
  Map as MapIcon,
  Moon,
  User,
  Lightbulb,
  RotateCw,
  Edit3,
} from 'lucide-react';

interface DashboardScreenProps {
  onOpenQuestMaster: () => void;
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({ onOpenQuestMaster }) => {
  const {
    player,
    quests,
    dayTheme,
    combo,
    triggerRandomEvent,
    setCurrentScreen,
    finishDay,
    addUserQuest,
    editQuest,
    reorderQuest,
    regenerateSuggestions,
  } = useGame();

  const [activeTab, setActiveTab] = useState<'all' | 'user' | 'suggestions' | 'completed' | 'in_progress'>('all');
  const [selectedQuestForModal, setSelectedQuestForModal] = useState<Quest | null>(null);

  // Task creation / editing modal state
  const [isTaskModalOpen, setIsTaskModalOpen] = useState<boolean>(false);
  const [questToEdit, setQuestToEdit] = useState<Quest | null>(null);

  // Separate user quests from suggestions
  const userQuests = quests.filter((q) => !q.isSuggestion);
  const suggestedQuests = quests.filter((q) => q.isSuggestion);

  const completedCount = userQuests.filter((q) => q.status === 'completed').length;
  const totalCount = userQuests.length;
  const dayProgressPct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const handleOpenCreateModal = () => {
    soundFx.playClick(600);
    setQuestToEdit(null);
    setIsTaskModalOpen(true);
  };

  const handleOpenEditModal = (quest: Quest) => {
    soundFx.playClick(500);
    setQuestToEdit(quest);
    setIsTaskModalOpen(true);
  };

  const handleSaveQuest = (questData: Partial<Quest>) => {
    if (questToEdit) {
      editQuest(questToEdit.id, questData);
    } else {
      addUserQuest(questData);
    }
  };

  // Reorder handlers
  const handleMoveUp = (idx: number) => {
    if (idx > 0) reorderQuest(idx, idx - 1);
  };

  const handleMoveDown = (idx: number) => {
    if (idx < userQuests.length - 1) reorderQuest(idx, idx + 1);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 pb-24">
      {/* Top Banner / HUD Header */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-extrabold uppercase tracking-widest text-amber-400 flex items-center gap-1">
                <span>☀️ TODAY'S ADVENTURE</span>
              </span>
              <span className="text-slate-600">•</span>
              <span className="text-xs text-purple-300 font-semibold">{dayTheme}</span>
            </div>
            <h1 className="font-rpg font-black text-2xl sm:text-3xl md:text-4xl text-white">
              MY QUEST BOARD ⚔️
            </h1>
          </div>

          {/* Quick HUD Metrics */}
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            {/* Day Score */}
            <div className="px-3 py-2 rounded-2xl bg-[#111728] border border-[#222e49] flex items-center gap-2">
              <Heart className="w-4 h-4 text-rose-400 fill-rose-400" />
              <div>
                <div className="text-[10px] uppercase font-bold text-slate-400">Day Score</div>
                <div className="text-xs font-mono-stat font-extrabold text-rose-300">
                  {dayProgressPct}%
                </div>
              </div>
            </div>

            {/* Quests Done */}
            <div className="px-3 py-2 rounded-2xl bg-[#111728] border border-[#222e49] flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <div>
                <div className="text-[10px] uppercase font-bold text-slate-400">Conquered</div>
                <div className="text-xs font-mono-stat font-extrabold text-emerald-300">
                  {completedCount} / {totalCount}
                </div>
              </div>
            </div>

            {/* Streak */}
            <div className="px-3 py-2 rounded-2xl bg-orange-950/50 border border-orange-700/60 flex items-center gap-2">
              <Flame className="w-4 h-4 text-orange-400 fill-orange-400 animate-pulse" />
              <div>
                <div className="text-[10px] uppercase font-bold text-orange-300">Streak</div>
                <div className="text-xs font-mono-stat font-extrabold text-orange-200">
                  {player.streak} Days
                </div>
              </div>
            </div>

            {/* Coins */}
            <button
              onClick={() => setCurrentScreen('shop')}
              className="px-3 py-2 rounded-2xl bg-amber-950/50 hover:bg-amber-900/50 border border-amber-600/60 flex items-center gap-2 transition"
            >
              <Coins className="w-4 h-4 text-amber-400" />
              <div className="text-left">
                <div className="text-[10px] uppercase font-bold text-amber-300">Loot Coins</div>
                <div className="text-xs font-mono-stat font-extrabold text-amber-200">
                  {player.coins} 🪙
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Big XP Progress Bar HUD */}
        <XPProgressBar />
      </div>

      {/* Time Budget Meter (Requirement 7) */}
      <TimeBudgetMeter />

      {/* Combo Banner */}
      {combo.active && (
        <div className="mb-6 p-3 sm:p-4 rounded-2xl bg-gradient-to-r from-orange-950/60 via-purple-950/60 to-pink-950/60 border border-orange-500/60 flex items-center justify-between gap-3 shadow-glow-gold/20 animate-pulse">
          <div className="flex items-center gap-3">
            <div className="text-2xl animate-bounce">🔥</div>
            <div>
              <div className="font-rpg font-extrabold text-sm sm:text-base text-amber-300">
                {combo.label}
              </div>
              <div className="text-xs text-slate-300">
                You're on fire! Consecutive completions award bonus streak XP and loot.
              </div>
            </div>
          </div>
          <span className="text-xs font-mono-stat font-extrabold text-orange-300 bg-orange-950 px-2.5 py-1 rounded-lg border border-orange-600/50">
            +25% XP BONUS
          </span>
        </div>
      )}

      {/* Primary Action Header: ➕ Add Your Own Task & Quick Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        {/* Prominent "Add Your Own Task" CTA (Requirement 1) */}
        <button
          onClick={handleOpenCreateModal}
          className="px-5 py-3 rounded-2xl bg-gradient-to-r from-cyan-600 via-indigo-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white font-rpg font-extrabold text-sm shadow-glow-cyan flex items-center justify-center gap-2 hover:scale-105 active:scale-95 transition"
        >
          <Plus className="w-5 h-5 text-yellow-300" />
          <span>➕ ADD YOUR OWN TASK</span>
        </button>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Summon Quest Master AI */}
          <button
            onClick={() => {
              soundFx.playClick(600);
              onOpenQuestMaster();
            }}
            className="px-3 py-2 rounded-xl bg-gradient-to-r from-indigo-900 via-purple-900 to-indigo-950 hover:from-indigo-800 hover:to-purple-800 border border-purple-500/50 text-purple-200 text-xs font-bold flex items-center gap-1.5 shadow-sm transition hover:scale-105"
          >
            <Wand2 className="w-3.5 h-3.5 text-amber-300 animate-spin" />
            <span>Summon Quests (AI)</span>
          </button>

          {/* Trigger Surprise Event */}
          <button
            onClick={() => triggerRandomEvent()}
            className="px-3 py-2 rounded-xl bg-red-950/60 hover:bg-red-900/70 border border-red-700/60 text-red-300 text-xs font-bold flex items-center gap-1.5 shadow-sm transition hover:scale-105"
          >
            <Dices className="w-3.5 h-3.5" />
            <span>Surprise Event 🎲</span>
          </button>
        </div>
      </div>

      {/* SECTION 1: 👤 YOUR QUESTS (User Created & Active) (Requirement 4) */}
      <div className="mb-10">
        <div className="flex items-center justify-between gap-2 mb-4 pb-2 border-b border-[#1f2c48]">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-cyan-400" />
            <h2 className="font-rpg font-extrabold text-xl text-white">
              YOUR QUESTS ({userQuests.length})
            </h2>
          </div>
          <span className="text-xs text-slate-400 font-mono-stat">
            {userQuests.filter((q) => q.status === 'completed').length} / {userQuests.length} Completed
          </span>
        </div>

        {userQuests.length === 0 ? (
          <div className="p-8 text-center rounded-3xl bg-[#0f1424] border border-[#212d47] max-w-lg mx-auto my-4">
            <div className="text-3xl mb-2">🎯</div>
            <h3 className="font-rpg font-bold text-base text-white mb-1">
              You haven't added any personal tasks yet!
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Click below to enter anything you want to accomplish today.
            </p>
            <button
              onClick={handleOpenCreateModal}
              className="px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-rpg font-bold text-xs shadow-md transition"
            >
              ➕ ADD YOUR FIRST TASK
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {userQuests.map((quest, idx) => (
              <QuestCard
                key={quest.id}
                quest={quest}
                onOpenDetail={(q) => {
                  soundFx.playClick(500);
                  setSelectedQuestForModal(q);
                }}
                onEdit={(q) => handleOpenEditModal(q)}
                onMoveUp={() => handleMoveUp(idx)}
                onMoveDown={() => handleMoveDown(idx)}
                isFirst={idx === 0}
                isLast={idx === userQuests.length - 1}
              />
            ))}
          </div>
        )}
      </div>

      {/* SECTION 2: ✨ QUEST SUGGESTIONS (AI Generated) (Requirement 4, 5, 6) */}
      <div className="mb-10 p-5 sm:p-6 rounded-3xl bg-[#0f1222] border border-purple-800/40 relative">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-2 border-b border-[#212c47]">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-yellow-300 animate-spin" />
            <div>
              <h2 className="font-rpg font-extrabold text-lg sm:text-xl text-purple-200">
                QUEST SUGGESTIONS ({suggestedQuests.length})
              </h2>
              <p className="text-xs text-slate-400">
                AI suggests. <strong>YOU decide.</strong> Add suggestions or reject them as you wish.
              </p>
            </div>
          </div>

          {/* Regenerate Suggestions Button (Requirement 6) */}
          <button
            onClick={regenerateSuggestions}
            className="px-3.5 py-1.5 rounded-xl bg-purple-950/80 hover:bg-purple-900 border border-purple-600/60 text-purple-200 text-xs font-bold flex items-center gap-1.5 shadow-sm transition hover:scale-105 self-start sm:self-auto"
          >
            <RotateCw className="w-3.5 h-3.5 text-yellow-400" />
            <span>🎲 Give Me Different Ideas</span>
          </button>
        </div>

        {suggestedQuests.length === 0 ? (
          /* Edge case when all suggestions rejected (Requirement 11) */
          <div className="p-6 text-center rounded-2xl bg-[#090c17] border border-[#1b253b] max-w-md mx-auto my-2">
            <div className="text-3xl mb-2">😎</div>
            <h3 className="font-rpg font-bold text-sm text-white mb-1">
              Nothing feels right? Build your own quest!
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              You've cleared all suggestions. Add your own tasks or generate a fresh batch.
            </p>
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={handleOpenCreateModal}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 text-white font-bold text-xs shadow-md transition"
              >
                ➕ Add Your Own Task
              </button>
              <button
                onClick={regenerateSuggestions}
                className="px-3.5 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white font-bold text-xs transition"
              >
                🎲 New Suggestions
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {suggestedQuests.map((quest) => (
              <QuestCard
                key={quest.id}
                quest={quest}
                onOpenDetail={(q) => {
                  soundFx.playClick(500);
                  setSelectedQuestForModal(q);
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Adventure Map Teaser Banner */}
      <div
        onClick={() => {
          soundFx.playClick(500);
          setCurrentScreen('map');
        }}
        className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-[#12182b] via-[#161f36] to-[#111728] border border-[#243354] hover:border-cyan-500/60 cursor-pointer transition group shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4 mb-6"
      >
        <div className="flex items-center gap-4 text-center sm:text-left">
          <div className="w-12 h-12 rounded-2xl bg-cyan-950/80 border border-cyan-500/50 flex items-center justify-center text-2xl group-hover:scale-110 transition shadow-glow-cyan">
            🗺️
          </div>
          <div>
            <div className="flex items-center gap-2 justify-center sm:justify-start">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-800/50">
                DAY JOURNEY MAP
              </span>
              <span className="text-xs text-slate-400">Node Progression</span>
            </div>
            <h4 className="font-rpg font-bold text-base sm:text-lg text-white group-hover:text-cyan-300 transition">
              View Your Adventure World Map
            </h4>
            <p className="text-xs text-slate-400">
              Track your journey through today's territory.
            </p>
          </div>
        </div>

        <button className="px-4 py-2 rounded-xl bg-cyan-950/80 group-hover:bg-cyan-900 border border-cyan-600 text-cyan-300 font-bold text-xs flex items-center gap-1.5 transition shrink-0">
          <span>Explore Map</span>
          <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition" />
        </button>
      </div>

      {/* Bottom Finish Day Callout */}
      <div className="text-center pt-4">
        <button
          onClick={finishDay}
          className="px-6 py-3 rounded-2xl bg-[#141a2e] hover:bg-[#1c243e] border border-amber-500/40 text-amber-300 font-rpg font-bold text-sm hover:scale-105 transition shadow-md inline-flex items-center gap-2"
        >
          <Moon className="w-4 h-4 text-amber-400" />
          <span>CONCLUDE TODAY'S RUN & GET FINAL SCORE →</span>
        </button>
      </div>

      {/* Quest Detail Modal */}
      <QuestDetailModal
        quest={selectedQuestForModal}
        onClose={() => setSelectedQuestForModal(null)}
      />

      {/* Task Create / Edit Modal (Requirement 1, 2, 8) */}
      <TaskCreateEditModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        onSave={handleSaveQuest}
        initialQuest={questToEdit}
      />
    </div>
  );
};
