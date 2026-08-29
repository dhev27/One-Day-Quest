import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { AvatarId, DaySetup, VibeType } from '../types/quest';
import { AVATAR_OPTIONS } from '../utils/demoData';
import { extractGoalsFromText, parseFreeTimeToMinutes } from '../utils/questGenerator';
import { soundFx } from '../utils/sound';
import {
  Swords,
  Zap,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Flame,
  Check,
  User,
  Clock,
  Heart,
  Edit3,
} from 'lucide-react';

export const PlayerSetupScreen: React.FC = () => {
  const { player, updatePlayer, setCurrentScreen, setDaySetup } = useGame();

  const [step, setStep] = useState<number>(1);
  const totalSteps = 3;

  // Form State
  const [heroName, setHeroName] = useState<string>(player.name || 'Hero');
  const [selectedAvatar, setSelectedAvatar] = useState<AvatarId>(player.avatar || 'cyber_mage');

  const [freeTime, setFreeTime] = useState<DaySetup['freeTime']>('2h');
  const [isCustomTime, setIsCustomTime] = useState<boolean>(false);
  const [customTimeMinutes, setCustomTimeMinutes] = useState<string>('90');
  const [energy, setEnergy] = useState<'low' | 'normal' | 'high'>('normal');
  const [vibe, setVibe] = useState<VibeType>('productive');

  const [customTasksInput, setCustomTasksInput] = useState<string>(
    'I need to finish my DBMS assignment and I also want to play volleyball.'
  );
  const [chaosMode, setChaosMode] = useState<boolean>(false);

  const vibeOptions: Array<{ id: VibeType; label: string; icon: string; desc: string; color: string }> = [
    { id: 'productive', label: 'Productive 🔥', icon: '🔥', desc: 'Focus sprint, deep work, slaying deadlines', color: 'border-amber-500/70 bg-amber-950/40 text-amber-300' },
    { id: 'chill', label: 'Chill 😌', icon: '😌', desc: 'Low stress, relaxing pace, balanced wins', color: 'border-blue-600/70 bg-blue-950/40 text-blue-300' },
    { id: 'energetic', label: 'Energetic ⚡', icon: '⚡', desc: 'Active momentum, fitness, outdoor movement', color: 'border-cyan-500/70 bg-cyan-950/40 text-cyan-300' },
    { id: 'low_energy', label: 'Low Energy 🥱', icon: '🥱', desc: 'Gentle micro-tasks, restorative healing', color: 'border-purple-600/70 bg-purple-950/40 text-purple-300' },
    { id: 'surprise', label: 'Surprise Me 🎲', icon: '🎲', desc: 'Unpredictable mix of challenges & fun', color: 'border-rose-500/70 bg-rose-950/40 text-rose-300' },
  ];

  const timePresets = [
    { label: '15 min', val: '15m' as const, mins: 15 },
    { label: '30 min', val: '30m' as const, mins: 30 },
    { label: '45 min', val: '45m' as const, mins: 45 },
    { label: '1 hour', val: '1h' as const, mins: 60 },
    { label: '1.5 hours', val: '1h 30m' as const, mins: 90 },
    { label: '2 hours', val: '2h' as const, mins: 120 },
    { label: '3+ hours', val: '3h' as const, mins: 180 },
  ];

  const calculatedTotalMinutes = isCustomTime
    ? parseInt(customTimeMinutes, 10) || 60
    : parseFreeTimeToMinutes(freeTime);

  const handleNext = () => {
    soundFx.playClick(550);
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      const setupData: DaySetup = {
        energy: energy,
        vibe,
        goals: extractGoalsFromText(customTasksInput),
        userCustomTasksInput: customTasksInput,
        freeTime: isCustomTime ? 'custom' : freeTime,
        customMinutes: isCustomTime ? calculatedTotalMinutes : undefined,
        totalAvailableMinutes: calculatedTotalMinutes,
        budget: '100',
        location: 'campus',
        party: 'solo',
        chaosMode,
        dayThemeName: '',
      };
      setDaySetup(setupData);
      updatePlayer({
        name: heroName.trim() || 'Hero',
        avatar: selectedAvatar,
        chaosMode,
      });
      soundFx.playQuestAccept();
      setCurrentScreen('generating');
    }
  };

  const handleBack = () => {
    soundFx.playClick(350);
    if (step > 1) {
      setStep(step - 1);
    } else {
      setCurrentScreen('landing');
    }
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 py-10 px-4 sm:px-6 relative overflow-hidden flex flex-col justify-center items-center">
      {/* Glow Ambient */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-purple-900/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-2xl w-full mx-auto relative z-10">
        {/* Progress Bar & Navigation */}
        <div className="flex items-center justify-between mb-6 px-2">
          <button
            onClick={handleBack}
            className="flex items-center gap-1 text-xs text-slate-400 hover:text-white transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{step === 1 ? 'Home' : 'Back'}</span>
          </button>

          <div className="flex items-center gap-2">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-2 rounded-full transition-all duration-300 ${
                  s === step
                    ? 'w-8 bg-gradient-to-r from-purple-500 to-amber-400'
                    : s < step
                    ? 'w-3 bg-purple-600'
                    : 'w-2 bg-slate-800'
                }`}
              />
            ))}
          </div>

          <div className="text-xs font-mono-stat text-purple-300 font-bold">
            STEP {step} OF {totalSteps}
          </div>
        </div>

        {/* Card Body */}
        <div className="bg-[#0f1424] border border-[#212d47] rounded-3xl p-6 sm:p-8 shadow-2xl relative">
          {/* STEP 1: Hero Identity */}
          {step === 1 && (
            <div className="animate-fadeIn">
              <div className="text-center mb-6">
                <div className="inline-block px-3 py-1 rounded-full bg-purple-950/80 border border-purple-600/50 text-purple-300 font-extrabold text-xs tracking-widest uppercase mb-2">
                  CHARACTER CREATION
                </div>
                <h2 className="font-rpg font-black text-2xl sm:text-3xl text-white">
                  BUILD YOUR QUEST 🎮
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 mt-1">
                  Choose your hero archetype and title for today's run.
                </p>
              </div>

              {/* Name Input */}
              <div className="mb-6">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Hero Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={heroName}
                    onChange={(e) => setHeroName(e.target.value)}
                    placeholder="Enter hero name..."
                    className="w-full bg-[#0a0d18] border border-[#232f4a] focus:border-purple-500 rounded-2xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none transition"
                  />
                </div>
              </div>

              {/* Avatar Selection */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5">
                  Choose Your Class Archetype
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {AVATAR_OPTIONS.map((av) => (
                    <button
                      key={av.id}
                      onClick={() => {
                        soundFx.playClick(500);
                        setSelectedAvatar(av.id);
                      }}
                      className={`p-3.5 rounded-2xl border text-left transition flex flex-col justify-between relative group ${
                        selectedAvatar === av.id
                          ? 'border-purple-500 bg-[#171b30] shadow-glow-purple'
                          : 'border-[#1e283f] bg-[#0a0d18] hover:border-slate-700'
                      }`}
                    >
                      {selectedAvatar === av.id && (
                        <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-purple-600 text-white flex items-center justify-center text-[10px]">
                          <Check className="w-3 h-3" />
                        </div>
                      )}
                      <div className="text-3xl mb-1.5">{av.emoji}</div>
                      <div>
                        <div className="font-rpg font-bold text-xs sm:text-sm text-white">
                          {av.name}
                        </div>
                        <div className="text-[10px] text-purple-300 font-medium line-clamp-1">
                          {av.title}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Time Budget & Vibe (Requirement 3) */}
          {step === 2 && (
            <div className="animate-fadeIn">
              <div className="text-center mb-6">
                <div className="inline-block px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-600/50 text-cyan-300 font-extrabold text-xs tracking-widest uppercase mb-2">
                  TIME & ENERGY
                </div>
                <h2 className="font-rpg font-black text-2xl sm:text-3xl text-white">
                  ⚔️ BUILD YOUR QUEST
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 mt-1">
                  Tell us what you've got. We&apos;ll help turn it into an adventure.
                </p>
              </div>

              <div className="mb-6">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-cyan-400" />
                  <span>⏱️ Available Free Time</span>
                </label>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-2">
                  {timePresets.map((t) => (
                    <button
                      key={t.val}
                      onClick={() => {
                        soundFx.playClick(450);
                        setFreeTime(t.val);
                        setIsCustomTime(false);
                      }}
                      className={`py-2.5 rounded-xl border text-xs font-bold transition ${
                        freeTime === t.val && !isCustomTime
                          ? 'border-cyan-400 bg-cyan-950/80 text-cyan-200 shadow-sm'
                          : 'border-[#1e283f] bg-[#0a0d18] text-slate-400 hover:text-white'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                  <button
                    onClick={() => {
                      soundFx.playClick(450);
                      setIsCustomTime(true);
                    }}
                    className={`py-2.5 rounded-xl border text-xs font-bold transition ${
                      isCustomTime
                        ? 'border-purple-400 bg-purple-950/80 text-purple-200 shadow-sm'
                        : 'border-[#1e283f] bg-[#0a0d18] text-slate-400 hover:text-white'
                    }`}
                  >
                    Custom
                  </button>
                </div>

                {isCustomTime && (
                  <div className="mt-2 bg-[#090d18] p-3 rounded-2xl border border-purple-800/40">
                    <label className="block text-[11px] text-slate-400 mb-2">Custom duration (minutes or like 1h 13m)</label>
                    <input
                      type="text"
                      value={customTimeMinutes}
                      onChange={(e) => setCustomTimeMinutes(e.target.value)}
                      placeholder="17 minutes / 1h 13m / 2h 25m"
                      className="w-full bg-[#121728] border border-[#232f4b] rounded-xl px-3 py-2 text-xs text-white font-mono-stat focus:outline-none focus:border-purple-500"
                    />
                  </div>
                )}
              </div>

              <div className="mb-6">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2.5">
                  🧠 What&apos;s your energy like?
                </label>
                <div className="grid grid-cols-3 gap-2.5">
                  {[
                    { id: 'low', label: '🥱 Low', text: 'Light studying, organizing, stretching, walking' },
                    { id: 'normal', label: '😐 Normal', text: 'Balanced focus with room for a few tasks' },
                    { id: 'high', label: '⚡ High', text: 'Workouts, hard study, focused output' },
                  ].map((option) => (
                    <button
                      key={option.id}
                      onClick={() => setEnergy(option.id as 'low' | 'normal' | 'high')}
                      className={`p-3 rounded-2xl border text-left transition ${
                        energy === option.id
                          ? 'border-cyan-400 bg-cyan-950/80 text-cyan-100'
                          : 'border-[#1e283f] bg-[#0a0d18] text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <div className="font-rpg font-bold text-xs sm:text-sm">{option.label}</div>
                      <div className="text-[11px] mt-1 text-slate-300">{option.text}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2.5">
                  ✨ What&apos;s your vibe today?
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {vibeOptions.map((v) => (
                    <button
                      key={v.id}
                      onClick={() => {
                        soundFx.playClick(450);
                        setVibe(v.id);
                      }}
                      className={`p-3.5 rounded-2xl border text-left transition flex items-start gap-3 ${
                        vibe === v.id
                          ? `${v.color} border-2 shadow-md`
                          : 'border-[#1e283f] bg-[#0a0d18] hover:border-slate-700 text-slate-400'
                      }`}
                    >
                      <span className="text-2xl">{v.icon}</span>
                      <div>
                        <div className="font-rpg font-bold text-xs sm:text-sm text-white">
                          {v.label}
                        </div>
                        <div className="text-[11px] text-slate-300 mt-0.5">{v.desc}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: What do YOU want to accomplish? (Requirement 3 & 4) */}
          {step === 3 && (
            <div className="animate-fadeIn">
              <div className="text-center mb-6">
                <div className="inline-block px-3 py-1 rounded-full bg-purple-950/80 border border-purple-600/50 text-purple-300 font-extrabold text-xs tracking-widest uppercase mb-2">
                  YOUR OBJECTIVES
                </div>
                <h2 className="font-rpg font-black text-2xl sm:text-3xl text-white">
                  🎯 What do YOU want to accomplish?
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 mt-1">
                  Tell us the tasks and goals you actually care about today. We&apos;ll shape the plan around your real priorities.
                </p>
              </div>

              <div className="mb-5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  Your goals & tasks
                </label>
                <textarea
                  rows={4}
                  value={customTasksInput}
                  onChange={(e) => setCustomTasksInput(e.target.value)}
                  placeholder="I want to finish my assignment, practice volleyball and have some me-time..."
                  className="w-full bg-[#0a0d18] border border-[#232f4a] focus:border-purple-500 rounded-2xl p-4 text-sm text-white placeholder-slate-500 focus:outline-none transition leading-relaxed"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  We&apos;ll pull out likely tasks like DBMS assignment or volleyball and keep them visible in your quest board.
                </p>
              </div>

              {/* Chaos Mode Toggle Card */}
              <div
                onClick={() => {
                  soundFx.playClick(600);
                  setChaosMode(!chaosMode);
                }}
                className={`p-4 rounded-2xl border cursor-pointer transition-all duration-200 mb-4 ${
                  chaosMode
                    ? 'border-rose-500 bg-rose-950/40 text-white shadow-glow-ruby'
                    : 'border-[#1e283f] bg-[#0a0d18] text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">😈</span>
                    <div>
                      <h4 className="font-rpg font-bold text-sm text-white">Chaos Mode (Optional)</h4>
                      <p className="text-xs text-rose-300">
                        Sprinkles in surprise random side-challenges.
                      </p>
                    </div>
                  </div>
                  <div
                    className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                      chaosMode ? 'bg-rose-600 border-rose-400 text-white' : 'border-slate-600'
                    }`}
                  >
                    {chaosMode && <Check className="w-3 h-3" />}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Bottom Navigation */}
          <div className="mt-8 pt-4 border-t border-[#1e2a44] flex items-center justify-between gap-3">
            <button
              onClick={handleBack}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition"
            >
              {step === 1 ? 'Cancel' : 'Back'}
            </button>

            <button
              onClick={handleNext}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-amber-500 hover:from-purple-500 hover:to-indigo-500 text-white font-rpg font-extrabold text-sm shadow-glow-xp flex items-center gap-2 hover:scale-105 transition"
            >
              <span>{step === totalSteps ? 'LAUNCH MY QUEST ⚔️' : 'NEXT STEP'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
