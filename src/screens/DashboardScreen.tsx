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
    rebuildQuest,
    handlePlanChanged,
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
    <div className="mx-auto max-w-7xl px-4 pb-28 pt-6 sm:px-6">
      <div className="mb-6 rounded-[30px] border border-slate-200 bg-white/80 p-5 shadow-[0_18px_40px_rgba(15,23,42,0.06)] backdrop-blur-sm sm:p-6">
        <div className="mb-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.18em] text-violet-600">
              Good morning ☀️
            </p>
            <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl md:text-4xl">
              {dayTheme ? 'Today’s quests are ready.' : 'Let’s make today real.'}
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2">
              <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">Day score</div>
              <div className="text-base font-bold text-slate-900">{dayProgressPct}%</div>
            </div>
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-3 py-2">
              <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-emerald-700">Done</div>
              <div className="text-base font-bold text-emerald-800">{completedCount} / {totalCount}</div>
            </div>
            <button
              onClick={() => setCurrentScreen('shop')}
              className="rounded-2xl border border-amber-200 bg-amber-50 px-3 py-2 text-left transition hover:translate-y-[-1px]"
            >
              <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-amber-700">Coins</div>
              <div className="text-base font-bold text-amber-800">{player.coins} 🪙</div>
            </button>
          </div>
        </div>

        <XPProgressBar />
      </div>

      <div className="mb-6">
        <TimeBudgetMeter />
      </div>

      {combo.active && (
        <div className="mb-6 flex items-center justify-between gap-3 rounded-[24px] border border-violet-200 bg-violet-50 p-3 sm:p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-100 text-2xl">🔥</div>
            <div>
              <div className="text-sm font-bold text-violet-800">{combo.label}</div>
              <div className="text-xs text-violet-700">You’re on a nice little streak. Keep it rolling.</div>
            </div>
          </div>
          <span className="rounded-full bg-white px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-violet-700">
            +25% XP
          </span>
        </div>
      )}

      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <button
          onClick={handleOpenCreateModal}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-slate-800"
        >
          <Plus className="h-4 w-4" />
          Add a task
        </button>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => rebuildQuest()}
            className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:-translate-y-0.5 hover:border-violet-200 hover:text-violet-700"
          >
            <RotateCw className="h-3.5 w-3.5" />
            Refresh
          </button>
          <button
            onClick={() => handlePlanChanged('less_time')}
            className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:-translate-y-0.5 hover:border-cyan-200 hover:text-cyan-700"
          >
            <Clock className="h-3.5 w-3.5" />
            My plan changed
          </button>
          <button
            onClick={() => triggerRandomEvent()}
            className="inline-flex items-center gap-1.5 rounded-full border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-600 transition hover:-translate-y-0.5"
          >
            <Dices className="h-3.5 w-3.5" />
            Surprise
          </button>
        </div>
      </div>

      <div className="mb-10">
        <div className="mb-4 flex items-center justify-between gap-2 border-b border-slate-200 pb-3">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-violet-600" />
            <h2 className="text-xl font-bold text-slate-900">Your quests ({userQuests.length})</h2>
          </div>
          <span className="text-xs font-medium text-slate-500">
            {userQuests.filter((q) => q.status === 'completed').length} done
          </span>
        </div>

        {userQuests.length === 0 ? (
          <div className="mx-auto max-w-lg rounded-[28px] border border-dashed border-slate-200 bg-slate-50 p-8 text-center">
            <div className="mb-2 text-3xl">🎯</div>
            <h3 className="mb-1 text-lg font-bold text-slate-900">No tasks yet?</h3>
            <p className="mb-4 text-sm text-slate-500">Add one and make today feel a little more manageable.</p>
            <button
              onClick={handleOpenCreateModal}
              className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Add your first task
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
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

      <div className="mb-10 rounded-[30px] border border-violet-100 bg-violet-50/60 p-4 sm:p-5">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-violet-500" />
            <div>
              <h2 className="text-lg font-bold text-slate-900">Quest suggestions ({suggestedQuests.length})</h2>
              <p className="text-xs text-slate-500">Lightweight ideas. You stay in charge.</p>
            </div>
          </div>

          <button
            onClick={regenerateSuggestions}
            className="inline-flex items-center gap-1.5 rounded-full border border-violet-200 bg-white px-3 py-2 text-xs font-semibold text-violet-700 transition hover:-translate-y-0.5"
          >
            <RotateCw className="h-3.5 w-3.5" />
            Different ideas
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
