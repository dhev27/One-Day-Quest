import React, { useState, useEffect } from 'react';
import { EnergyLevel, PriorityLevel, Quest, QuestCategory } from '../types/quest';
import { soundFx } from '../utils/sound';
import { triggerCelebration } from '../utils/confetti';
import {
  X,
  Sparkles,
  Plus,
  Clock,
  Flame,
  Zap,
  Gift,
  Tag,
  Check,
  CheckCircle2,
  Swords,
  Edit3,
} from 'lucide-react';

interface TaskCreateEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (questData: Partial<Quest>) => void;
  initialQuest?: Quest | null;
}

export const TaskCreateEditModal: React.FC<TaskCreateEditModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialQuest,
}) => {
  const isEditing = !!initialQuest;

  const [title, setTitle] = useState<string>('');
  const [duration, setDuration] = useState<number>(45);
  const [isCustomDuration, setIsCustomDuration] = useState<boolean>(false);
  const [customMinutesInput, setCustomMinutesInput] = useState<string>('45');
  const [priority, setPriority] = useState<PriorityLevel>('important');
  const [energy, setEnergy] = useState<EnergyLevel>('medium');
  const [category, setCategory] = useState<QuestCategory>('study');
  const [customReward, setCustomReward] = useState<string>('');
  const [showCelebration, setShowCelebration] = useState<boolean>(false);

  useEffect(() => {
    if (initialQuest) {
      setTitle(initialQuest.title);
      setDuration(initialQuest.timeEstimateMinutes || 45);
      setCustomMinutesInput(String(initialQuest.timeEstimateMinutes || 45));
      setIsCustomDuration(![30, 45, 60, 90, 120].includes(initialQuest.timeEstimateMinutes || 45));
      setPriority(initialQuest.priority || 'normal');
      setEnergy(initialQuest.energyRequired || 'medium');
      setCategory(initialQuest.category || 'personal');
      setCustomReward(initialQuest.customReward || '');
    } else {
      setTitle('');
      setDuration(45);
      setCustomMinutesInput('45');
      setIsCustomDuration(false);
      setPriority('important');
      setEnergy('medium');
      setCategory('study');
      setCustomReward('');
    }
    setShowCelebration(false);
  }, [initialQuest, isOpen]);

  if (!isOpen) return null;

  const categoryOptions: Array<{ id: QuestCategory; label: string; icon: string }> = [
    { id: 'study', label: 'Study & Exams', icon: '📚' },
    { id: 'fitness', label: 'Fitness & Sport', icon: '🏐' },
    { id: 'personal', label: 'Personal & Life', icon: '🌱' },
    { id: 'fun', label: 'Fun & Gaming', icon: '🎮' },
    { id: 'social', label: 'Social & Friends', icon: '💬' },
    { id: 'chores', label: 'Chores & Admin', icon: '🧹' },
    { id: 'other', label: 'Other Quest', icon: '✨' },
  ];

  const priorityOptions: Array<{ id: PriorityLevel; label: string; icon: string; color: string }> = [
    { id: 'chill', label: 'Chill 😌', icon: '😌', color: 'border-blue-600/60 bg-blue-950/40 text-blue-300' },
    { id: 'normal', label: 'Normal 🙂', icon: '🙂', color: 'border-emerald-600/60 bg-emerald-950/40 text-emerald-300' },
    { id: 'important', label: 'Important 🔥', icon: '🔥', color: 'border-amber-500/70 bg-amber-950/50 text-amber-300' },
    { id: 'must_do', label: 'MUST DO 💀', icon: '💀', color: 'border-rose-600/80 bg-rose-950/60 text-rose-300' },
  ];

  const energyOptions: Array<{ id: EnergyLevel; label: string; icon: string }> = [
    { id: 'low', label: 'Low 🧘', icon: '🧘' },
    { id: 'medium', label: 'Medium ⚡', icon: '⚡' },
    { id: 'high', label: 'High 🚀', icon: '🚀' },
  ];

  const durationPresets = [
    { label: '30 min', val: 30 },
    { label: '45 min', val: 45 },
    { label: '1 hour', val: 60 },
    { label: '1.5 hours', val: 90 },
    { label: '2 hours', val: 120 },
  ];

  const handleDurationSelect = (mins: number) => {
    soundFx.playClick(450);
    setDuration(mins);
    setIsCustomDuration(false);
  };

  const handleCustomDurationChange = (val: string) => {
    setCustomMinutesInput(val);
    const parsed = parseInt(val, 10);
    if (!isNaN(parsed) && parsed > 0) {
      setDuration(parsed);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    soundFx.playQuestAccept();
    triggerCelebration();

    const xpCalc = Math.min(300, Math.max(50, duration * 2 + (priority === 'must_do' ? 60 : priority === 'important' ? 40 : 20)));
    const coinCalc = Math.round(xpCalc * 0.3);

    const pickedCategory = categoryOptions.find((c) => c.id === category);

    const questData: Partial<Quest> = {
      title: title.trim().toUpperCase(),
      subtitle: isEditing ? initialQuest?.subtitle || 'Custom Quest' : 'Your Personal Objective',
      description: `Complete your custom task: "${title.trim()}".`,
      flavorText: 'Every step taken with intent forges a stronger hero.',
      category,
      difficulty: duration >= 60 ? 'hard' : duration >= 45 ? 'medium' : 'easy',
      priority,
      energyRequired: energy,
      timeEstimateMinutes: duration,
      xpReward: xpCalc,
      coinReward: coinCalc,
      icon: pickedCategory?.icon || '🎯',
      isUserCreated: true,
      customReward: customReward.trim() || undefined,
    };

    setShowCelebration(true);
    setTimeout(() => {
      onSave(questData);
      onClose();
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="bg-gradient-to-b from-[#151228] via-[#101426] to-[#0a0d18] border-2 border-purple-500/70 rounded-3xl max-w-xl w-full p-5 sm:p-7 shadow-glow-purple relative max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-800/60 hover:bg-slate-700 text-slate-400 hover:text-white transition"
        >
          <X className="w-5 h-5" />
        </button>

        {showCelebration ? (
          <div className="py-12 text-center animate-levelUp">
            <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-purple-600 via-pink-600 to-amber-400 p-[2px] shadow-glow-xp mb-4 animate-bounce">
              <div className="w-full h-full bg-[#0a0d18] rounded-[22px] flex items-center justify-center text-4xl">
                ⚔️
              </div>
            </div>
            <h3 className="font-rpg font-black text-2xl sm:text-3xl text-white mb-2">
              QUEST ADDED! 🎉
            </h3>
            <p className="text-sm text-purple-300 font-medium">
              Your mission has been added to today's adventure.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {/* Header */}
            <div className="flex items-center gap-2.5 mb-2">
              <div className="p-2 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-amber-300 shadow-glow-purple">
                {isEditing ? <Edit3 className="w-5 h-5" /> : <Swords className="w-5 h-5" />}
              </div>
              <div>
                <h2 className="font-rpg font-extrabold text-xl sm:text-2xl text-white">
                  {isEditing ? '✏️ EDIT YOUR QUEST' : '⚔️ FORGE YOUR OWN QUEST'}
                </h2>
                <p className="text-xs text-purple-300">
                  {isEditing
                    ? 'Adjust the parameters of your active mission.'
                    : 'What challenge are you taking on today?'}
                </p>
              </div>
            </div>

            <div className="space-y-4 my-5">
              {/* Field 1: Task Title */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5 flex items-center gap-1">
                  <span>🎯 What do you want to do?</span>
                  <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Finish DSA assignment, Practice volleyball, Call Mom, Clean desk..."
                  className="w-full bg-[#090c17] border border-[#232f4b] focus:border-purple-500 rounded-2xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none transition"
                />
              </div>

              {/* Field 2: Duration with Presets + Custom (Minimum 30m) */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-cyan-400" />
                    <span>⏱️ How much time do you have?</span>
                  </label>
                  <span className="text-[11px] text-cyan-300 font-mono-stat font-bold">
                    {duration} Minutes
                  </span>
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-2">
                  {durationPresets.map((preset) => (
                    <button
                      key={preset.val}
                      type="button"
                      onClick={() => handleDurationSelect(preset.val)}
                      className={`py-2 rounded-xl border text-xs font-bold transition ${
                        duration === preset.val && !isCustomDuration
                          ? 'border-cyan-400 bg-cyan-950/80 text-cyan-200 shadow-sm'
                          : 'border-[#1e283f] bg-[#090d18] text-slate-400 hover:text-white'
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => {
                      soundFx.playClick(450);
                      setIsCustomDuration(true);
                    }}
                    className={`py-2 rounded-xl border text-xs font-bold transition ${
                      isCustomDuration
                        ? 'border-purple-400 bg-purple-950/80 text-purple-200 shadow-sm'
                        : 'border-[#1e283f] bg-[#090d18] text-slate-400 hover:text-white'
                    }`}
                  >
                    Custom ⚙️
                  </button>
                </div>

                {isCustomDuration && (
                  <div className="flex items-center gap-2 mt-2 bg-[#090d18] p-2.5 rounded-2xl border border-purple-800/40">
                    <span className="text-xs text-slate-400">Custom Duration (Minutes):</span>
                    <input
                      type="number"
                      min={10}
                      max={480}
                      value={customMinutesInput}
                      onChange={(e) => handleCustomDurationChange(e.target.value)}
                      className="w-24 bg-[#121728] border border-[#232f4b] rounded-xl px-3 py-1.5 text-xs text-white font-mono-stat focus:outline-none focus:border-purple-500"
                    />
                  </div>
                )}
              </div>

              {/* Field 3: Importance / Priority */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5 flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 text-amber-400" />
                  <span>🔥 How important is it?</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {priorityOptions.map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => {
                        soundFx.playClick(450);
                        setPriority(opt.id);
                      }}
                      className={`p-2.5 rounded-2xl border text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                        priority === opt.id
                          ? `${opt.color} border-2 shadow-sm scale-[1.02]`
                          : 'border-[#1e283f] bg-[#090d18] text-slate-400 hover:text-white'
                      }`}
                    >
                      <span>{opt.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Field 4: Energy Required & Category (2 Columns) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Energy */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5 flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5 text-yellow-400" />
                    <span>⚡ Energy Required</span>
                  </label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {energyOptions.map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => {
                          soundFx.playClick(450);
                          setEnergy(opt.id);
                        }}
                        className={`py-2 rounded-xl border text-xs font-bold transition ${
                          energy === opt.id
                            ? 'border-yellow-500 bg-yellow-950/60 text-yellow-200'
                            : 'border-[#1e283f] bg-[#090d18] text-slate-400'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Category */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5 flex items-center gap-1">
                    <Tag className="w-3.5 h-3.5 text-purple-400" />
                    <span>🏷️ Category</span>
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as QuestCategory)}
                    className="w-full bg-[#090c17] border border-[#232f4b] focus:border-purple-500 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                  >
                    {categoryOptions.map((opt) => (
                      <option key={opt.id} value={opt.id} className="bg-[#0e1322]">
                        {opt.icon} {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Field 5: Optional Real-life Reward */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5 flex items-center gap-1">
                  <Gift className="w-3.5 h-3.5 text-pink-400" />
                  <span>🎁 Personal Reward upon Completion (Optional)</span>
                </label>
                <input
                  type="text"
                  value={customReward}
                  onChange={(e) => setCustomReward(e.target.value)}
                  placeholder="e.g. 30 min YouTube break, Boba tea, Game match, Guilt-free nap..."
                  className="w-full bg-[#090c17] border border-[#232f4b] focus:border-purple-500 rounded-2xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none transition"
                />
              </div>
            </div>

            {/* Estimated XP / Coin Reward Pill */}
            <div className="bg-[#0b0f1d] border border-purple-900/40 rounded-2xl p-3 mb-5 flex items-center justify-between">
              <div className="text-[11px] font-bold text-slate-400">QUEST BOUNTY</div>
              <div className="flex items-center gap-3 text-xs font-mono-stat font-bold">
                <span className="text-purple-300 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  +{Math.min(300, Math.max(50, duration * 2 + (priority === 'must_do' ? 60 : 30)))} XP
                </span>
                <span className="text-amber-300">
                  +{Math.round(Math.min(300, Math.max(50, duration * 2 + (priority === 'must_do' ? 60 : 30))) * 0.3)} 🪙
                </span>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex items-center justify-end gap-3 pt-2 border-t border-[#1e2a44]">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-amber-500 hover:from-purple-500 hover:to-indigo-500 text-white font-rpg font-extrabold text-xs sm:text-sm shadow-glow-xp flex items-center gap-2 hover:scale-105 transition"
              >
                {isEditing ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>SAVE CHANGES</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    <span>ADD TO MY QUEST ⚔️</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
