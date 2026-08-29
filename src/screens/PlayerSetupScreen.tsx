import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { AvatarId, DaySetup } from '../types/quest';
import { AVATAR_OPTIONS } from '../utils/demoData';
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
  Heart,
} from 'lucide-react';

export const PlayerSetupScreen: React.FC = () => {
  const { player, updatePlayer, setCurrentScreen, setDaySetup } = useGame();

  const [step, setStep] = useState<number>(1);
  const totalSteps = 4;

  // Form State
  const [heroName, setHeroName] = useState<string>(player.name || 'Hero');
  const [selectedAvatar, setSelectedAvatar] = useState<AvatarId>(player.avatar || 'cyber_mage');
  const [energy, setEnergy] = useState<'low' | 'normal' | 'high' | 'chaotic'>('high');
  const [selectedGoals, setSelectedGoals] = useState<string[]>(['Study', 'Project']);
  const [freeTime, setFreeTime] = useState<'30m' | '1h' | '2h' | '4h+'>('2h');
  const [budget, setBudget] = useState<'0' | '100' | '300' | '500+'>('100');
  const [location, setLocation] = useState<'home' | 'campus' | 'city' | 'other'>('campus');
  const [party, setParty] = useState<'solo' | 'friends' | 'family' | 'random'>('friends');
  const [chaosMode, setChaosMode] = useState<boolean>(false);

  const goalOptions = [
    { id: 'Study', label: 'Study & Exams', icon: '📚', desc: 'Conquer flashcards, lectures & notes' },
    { id: 'Project', label: 'Code & Project', icon: '💻', desc: 'Ship milestones & build cool software' },
    { id: 'Fitness', label: 'Fitness & Health', icon: '🏃', desc: 'Workout, cardio, or outdoor movement' },
    { id: 'Social', label: 'Friends & Vibes', icon: '👥', desc: 'Hangouts, team raids & banter' },
    { id: 'Creative', label: 'Creative Craft', icon: '🎨', desc: 'Art, music, writing or design' },
    { id: 'Personal', label: 'Life Admin', icon: '🌱', desc: 'Errands, cleaning & organizing life' },
  ];

  const energyOptions: Array<{ id: 'low' | 'normal' | 'high' | 'chaotic'; label: string; icon: string; desc: string; color: string }> = [
    { id: 'low', label: 'Low HP', icon: '😴', desc: 'Gentle wins, low friction, recovery focus', color: 'border-blue-700/60 bg-blue-950/40' },
    { id: 'normal', label: 'Steady', icon: '🙂', desc: 'Solid pace, balanced challenges', color: 'border-emerald-700/60 bg-emerald-950/40' },
    { id: 'high', label: 'High Energy', icon: '⚡', desc: 'Ready to crush big boss objectives', color: 'border-amber-600/60 bg-amber-950/40' },
    { id: 'chaotic', label: 'CHAOTIC', icon: '😈', desc: 'Unleash spontaneous unpredictable glory', color: 'border-rose-600/60 bg-rose-950/40' },
  ];

  const toggleGoal = (id: string) => {
    soundFx.playClick(450);
    if (selectedGoals.includes(id)) {
      if (selectedGoals.length > 1) {
        setSelectedGoals(selectedGoals.filter((g) => g !== id));
      }
    } else {
      setSelectedGoals([...selectedGoals, id]);
    }
  };

  const handleNext = () => {
    soundFx.playClick(550);
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      // Complete setup and trigger dramatic generation transition
      const setupData: DaySetup = {
        energy,
        goals: selectedGoals,
        freeTime,
        budget,
        location,
        party,
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
      {/* Glow Effects */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-purple-900/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-2xl w-full mx-auto relative z-10">
        {/* Progress Dots */}
        <div className="flex items-center justify-between mb-6 px-2">
          <button
            onClick={handleBack}
            className="flex items-center gap-1 text-xs text-slate-400 hover:text-white transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{step === 1 ? 'Home' : 'Back'}</span>
          </button>

          <div className="flex items-center gap-2">
            {[1, 2, 3, 4].map((s) => (
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

        {/* Card Container */}
        <div className="bg-[#0f1424] border border-[#212d47] rounded-3xl p-6 sm:p-8 shadow-2xl relative">
          {/* STEP 1: Hero Identity & Avatar */}
          {step === 1 && (
            <div className="animate-fadeIn">
              <div className="text-center mb-6">
                <div className="inline-block px-3 py-1 rounded-full bg-purple-950/80 border border-purple-600/50 text-purple-300 font-extrabold text-xs tracking-widest uppercase mb-2">
                  CHARACTER CREATION
                </div>
                <h2 className="font-rpg font-black text-2xl sm:text-3xl text-white">
                  CREATE YOUR ADVENTURER
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 mt-1">
                  Choose your class archetype and hero name for today's run.
                </p>
              </div>

              {/* Hero Name Input */}
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
                    placeholder="Enter hero codename..."
                    className="w-full bg-[#0a0d18] border border-[#232f4a] focus:border-purple-500 rounded-2xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none transition"
                  />
                </div>
              </div>

              {/* Avatar Options */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5">
                  Choose Your Hero Class
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

          {/* STEP 2: Energy & Goals */}
          {step === 2 && (
            <div className="animate-fadeIn">
              <div className="text-center mb-6">
                <div className="inline-block px-3 py-1 rounded-full bg-amber-950/80 border border-amber-600/50 text-amber-300 font-extrabold text-xs tracking-widest uppercase mb-2">
                  DAILY PARAMETERS
                </div>
                <h2 className="font-rpg font-black text-2xl sm:text-3xl text-white">
                  WHAT'S YOUR ENERGY TODAY?
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 mt-1">
                  We balance quest difficulty and rewards according to your real energy state.
                </p>
              </div>

              {/* Energy Selection */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                {energyOptions.map((e) => (
                  <button
                    key={e.id}
                    onClick={() => {
                      soundFx.playClick(500);
                      setEnergy(e.id);
                    }}
                    className={`p-3.5 rounded-2xl border text-left transition flex items-start gap-3 ${
                      energy === e.id
                        ? `${e.color} border-2 shadow-md`
                        : 'border-[#1e283f] bg-[#0a0d18] hover:border-slate-700'
                    }`}
                  >
                    <span className="text-2xl">{e.icon}</span>
                    <div>
                      <div className="font-rpg font-bold text-xs sm:text-sm text-white">
                        {e.label}
                      </div>
                      <div className="text-[10px] text-slate-300 mt-0.5">{e.desc}</div>
                    </div>
                  </button>
                ))}
              </div>

              {/* Main Goals (Multi-select) */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  What are your main focuses today? (Select all that apply)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {goalOptions.map((g) => {
                    const isSelected = selectedGoals.includes(g.id);
                    return (
                      <button
                        key={g.id}
                        onClick={() => toggleGoal(g.id)}
                        className={`p-3 rounded-xl border text-left transition flex items-center gap-2.5 ${
                          isSelected
                            ? 'border-purple-500 bg-purple-950/50 text-white shadow-sm'
                            : 'border-[#1e283f] bg-[#0a0d18] text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        <span className="text-xl">{g.icon}</span>
                        <div className="min-w-0">
                          <div className="text-xs font-bold truncate">{g.label}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Context (Time, Budget, Location, Party) */}
          {step === 3 && (
            <div className="animate-fadeIn">
              <div className="text-center mb-6">
                <div className="inline-block px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-600/50 text-cyan-300 font-extrabold text-xs tracking-widest uppercase mb-2">
                  WORLD CONTEXT
                </div>
                <h2 className="font-rpg font-black text-2xl sm:text-3xl text-white">
                  SET THE STAGE
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 mt-1">
                  How much free time, budget, and who is joining your party?
                </p>
              </div>

              <div className="space-y-4">
                {/* Free Time */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                    How much free time do you have?
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {(['30m', '1h', '2h', '4h+'] as const).map((t) => (
                      <button
                        key={t}
                        onClick={() => setFreeTime(t)}
                        className={`py-2.5 rounded-xl border text-xs font-bold transition ${
                          freeTime === t
                            ? 'border-purple-500 bg-purple-950/70 text-purple-200'
                            : 'border-[#1e283f] bg-[#0a0d18] text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Budget */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                    What's your spending budget today?
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {(['0', '100', '300', '500+'] as const).map((b) => (
                      <button
                        key={b}
                        onClick={() => setBudget(b)}
                        className={`py-2.5 rounded-xl border text-xs font-bold transition ${
                          budget === b
                            ? 'border-amber-500 bg-amber-950/70 text-amber-200'
                            : 'border-[#1e283f] bg-[#0a0d18] text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        ₹{b}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Location & Party */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                      Where are you stationed?
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {(['home', 'campus', 'city', 'other'] as const).map((loc) => (
                        <button
                          key={loc}
                          onClick={() => setLocation(loc)}
                          className={`py-2 rounded-xl border text-xs font-bold capitalize transition ${
                            location === loc
                              ? 'border-cyan-500 bg-cyan-950/70 text-cyan-200'
                              : 'border-[#1e283f] bg-[#0a0d18] text-slate-400'
                          }`}
                        >
                          {loc === 'home' ? '🏠 Home' : loc === 'campus' ? '🏫 Campus' : loc === 'city' ? '🏙️ City' : '🌐 Other'}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                      Are you solo or in a party?
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {(['solo', 'friends', 'family', 'random'] as const).map((p) => (
                        <button
                          key={p}
                          onClick={() => setParty(p)}
                          className={`py-2 rounded-xl border text-xs font-bold capitalize transition ${
                            party === p
                              ? 'border-pink-500 bg-pink-950/70 text-pink-200'
                              : 'border-[#1e283f] bg-[#0a0d18] text-slate-400'
                          }`}
                        >
                          {p === 'solo' ? '🧍 Solo' : p === 'friends' ? '👥 Friends' : p === 'family' ? '👨‍👩‍👧 Family' : '🎲 Random'}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Chaos Mode & Confirmation */}
          {step === 4 && (
            <div className="animate-fadeIn">
              <div className="text-center mb-6">
                <div className="inline-block px-3 py-1 rounded-full bg-rose-950/80 border border-rose-600/50 text-rose-300 font-extrabold text-xs tracking-widest uppercase mb-2">
                  MODIFIERS & SUMMON
                </div>
                <h2 className="font-rpg font-black text-2xl sm:text-3xl text-white">
                  FINAL ADVENTURE MODIFIERS
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 mt-1">
                  Ready to weave your day into a legendary quest deck.
                </p>
              </div>

              {/* Chaos Mode Card */}
              <div
                onClick={() => {
                  soundFx.playClick(600);
                  setChaosMode(!chaosMode);
                }}
                className={`p-5 rounded-3xl border-2 cursor-pointer transition-all duration-200 mb-6 ${
                  chaosMode
                    ? 'border-rose-500 bg-gradient-to-br from-rose-950/60 via-purple-950/60 to-slate-900 shadow-glow-ruby'
                    : 'border-[#222d46] bg-[#0a0d18] hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">😈</span>
                    <div>
                      <h3 className="font-rpg font-extrabold text-base sm:text-lg text-white">
                        ENABLE CHAOS MODE
                      </h3>
                      <p className="text-xs text-rose-300 font-semibold">
                        For people who think normal days are overrated.
                      </p>
                    </div>
                  </div>

                  <div
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition ${
                      chaosMode ? 'bg-rose-600 border-rose-400 text-white' : 'border-slate-600'
                    }`}
                  >
                    {chaosMode && <Check className="w-4 h-4" />}
                  </div>
                </div>

                <p className="text-xs text-slate-400 mt-2">
                  When enabled, generates spontaneous mini-challenges like trying strange foods, asking funny questions, and hunting absurd anomalies.
                </p>
              </div>

              {/* Recap Box */}
              <div className="p-4 rounded-2xl bg-[#0a0d18] border border-[#1e2a44] space-y-1.5 text-xs text-slate-300">
                <div className="flex justify-between">
                  <span className="text-slate-500">Hero:</span>
                  <span className="font-bold text-white">{heroName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Energy State:</span>
                  <span className="font-bold text-amber-400 capitalize">{energy}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Focus Areas:</span>
                  <span className="font-bold text-purple-300">{selectedGoals.join(', ')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Location & Budget:</span>
                  <span className="font-bold text-cyan-300 capitalize">{location} · ₹{budget}</span>
                </div>
              </div>
            </div>
          )}

          {/* Bottom Action Controls */}
          <div className="mt-8 pt-4 border-t border-[#1e2a44] flex items-center justify-between gap-3">
            <button
              onClick={handleBack}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition"
            >
              {step === 1 ? 'Cancel' : 'Back'}
            </button>

            <button
              onClick={handleNext}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-amber-500 hover:from-purple-500 hover:to-indigo-500 text-white font-rpg font-extrabold text-sm shadow-glow-xp flex items-center gap-2 transition hover:scale-105"
            >
              <span>{step === totalSteps ? 'GENERATE ADVENTURE ⚔️' : 'NEXT STEP'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
