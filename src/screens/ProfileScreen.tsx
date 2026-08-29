import React from 'react';
import { useGame } from '../context/GameContext';
import { AVATAR_OPTIONS, INITIAL_SHOP_ITEMS } from '../utils/demoData';
import { XPProgressBar } from '../components/XPProgressBar';
import { soundFx } from '../utils/sound';
import {
  User,
  Shield,
  Flame,
  Coins,
  Trophy,
  Swords,
  Sparkles,
  Zap,
  RotateCcw,
  Tag,
  Star,
  CheckCircle2,
} from 'lucide-react';

export const ProfileScreen: React.FC = () => {
  const { player, updatePlayer, resetAllProgress, achievements, quests } = useGame();

  const avatar = AVATAR_OPTIONS.find((a) => a.id === player.avatar) || AVATAR_OPTIONS[0];

  const equippedHead = INITIAL_SHOP_ITEMS.find(
    (i) => i.id === player.equippedCosmetics.head
  );
  const equippedAura = INITIAL_SHOP_ITEMS.find(
    (i) => i.id === player.equippedCosmetics.aura
  );
  const equippedCompanion = INITIAL_SHOP_ITEMS.find(
    (i) => i.id === player.equippedCosmetics.companion
  );
  const equippedWeapon = INITIAL_SHOP_ITEMS.find(
    (i) => i.id === player.equippedCosmetics.weapon
  );

  const titleOptions = [
    'The Chaos Tamer',
    'Main Character Energy',
    'The Procrastination Slayer',
    'The Comeback Hero',
    'Arcane Scholar',
    'Weekend Warrior',
  ];

  const handleTitleChange = (newTitle: string) => {
    soundFx.playClick(500);
    updatePlayer({ title: newTitle });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 pb-24">
      {/* Header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <User className="w-4 h-4 text-purple-400" />
            <span className="text-xs font-extrabold uppercase tracking-widest text-purple-400">
              CHARACTER SHEET
            </span>
          </div>
          <h1 className="font-rpg font-black text-2xl sm:text-3xl md:text-4xl text-white">
            HERO PROFILE 👤
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Your persistent stats, level progression, equipped artifacts, and lore titles.
          </p>
        </div>

        <button
          onClick={() => {
            if (confirm('Reset your adventure data back to initial state?')) {
              resetAllProgress();
            }
          }}
          className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-rose-950 border border-slate-800 hover:border-rose-700 text-slate-400 hover:text-rose-300 text-xs font-semibold flex items-center gap-1.5 transition self-start sm:self-auto"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Run</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Hero Avatar Card & Gear (1 col) */}
        <div className="bg-[#0f1424] border border-[#212d47] rounded-3xl p-6 shadow-2xl flex flex-col items-center text-center relative overflow-hidden">
          {/* Aura effect if equipped */}
          {equippedAura && (
            <div className="absolute inset-0 bg-gradient-to-t from-orange-600/10 via-purple-600/10 to-transparent pointer-events-none animate-pulseGlow" />
          )}

          {/* Avatar Character Badge */}
          <div className="relative mb-4">
            <div className="w-28 h-28 rounded-3xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-amber-400 p-[3px] shadow-glow-xp">
              <div className="w-full h-full bg-[#0a0d18] rounded-[22px] flex items-center justify-center text-5xl relative">
                {avatar.emoji}
                {equippedHead && (
                  <span className="absolute -top-3 -right-2 text-2xl animate-bounce">
                    {equippedHead.icon}
                  </span>
                )}
                {equippedCompanion && (
                  <span className="absolute -bottom-2 -left-2 text-2xl">
                    {equippedCompanion.icon}
                  </span>
                )}
              </div>
            </div>
          </div>

          <h2 className="font-rpg font-extrabold text-2xl text-white mb-0.5">{player.name}</h2>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-950/80 border border-purple-500/50 text-purple-300 font-extrabold text-xs mb-4">
            <Sparkles className="w-3 h-3 text-amber-300" />
            <span>{player.title}</span>
          </div>

          <p className="text-xs text-slate-300 italic mb-6">"{avatar.description}"</p>

          {/* Quick Stat Blocks */}
          <div className="grid grid-cols-2 gap-2.5 w-full mb-6">
            <div className="p-3 rounded-2xl bg-[#090d18] border border-[#1d273f] text-left">
              <div className="text-[10px] font-bold text-slate-500 uppercase">Level</div>
              <div className="font-mono-stat font-extrabold text-lg text-purple-300">
                LVL {player.level}
              </div>
            </div>
            <div className="p-3 rounded-2xl bg-[#090d18] border border-[#1d273f] text-left">
              <div className="text-[10px] font-bold text-slate-500 uppercase">Streak</div>
              <div className="font-mono-stat font-extrabold text-lg text-orange-400 flex items-center gap-1">
                <Flame className="w-4 h-4 fill-orange-500" />
                {player.streak} Days
              </div>
            </div>
            <div className="p-3 rounded-2xl bg-[#090d18] border border-[#1d273f] text-left">
              <div className="text-[10px] font-bold text-slate-500 uppercase">Quests Conquered</div>
              <div className="font-mono-stat font-extrabold text-lg text-emerald-400">
                {player.totalQuestsCompleted}
              </div>
            </div>
            <div className="p-3 rounded-2xl bg-[#090d18] border border-[#1d273f] text-left">
              <div className="text-[10px] font-bold text-slate-500 uppercase">Treasury</div>
              <div className="font-mono-stat font-extrabold text-lg text-amber-400">
                {player.coins} 🪙
              </div>
            </div>
          </div>

          {/* Equipped Gear Loadout */}
          <div className="w-full text-left pt-4 border-t border-[#1e273f]">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5">
              Active Loadout
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2 rounded-xl bg-[#090d18] border border-[#1b253b]">
                <span className="text-slate-400">Headgear:</span>
                <span className="font-bold text-white flex items-center gap-1">
                  {equippedHead ? `${equippedHead.icon} ${equippedHead.name}` : 'None equipped'}
                </span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-xl bg-[#090d18] border border-[#1b253b]">
                <span className="text-slate-400">Companion:</span>
                <span className="font-bold text-white flex items-center gap-1">
                  {equippedCompanion ? `${equippedCompanion.icon} ${equippedCompanion.name}` : 'None equipped'}
                </span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-xl bg-[#090d18] border border-[#1b253b]">
                <span className="text-slate-400">Aura:</span>
                <span className="font-bold text-white flex items-center gap-1">
                  {equippedAura ? `${equippedAura.icon} ${equippedAura.name}` : 'None equipped'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Hero Stats, Titles & Category Mastery (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* XP Bar Component */}
          <XPProgressBar />

          {/* Attribute Attributes / Stats Meters */}
          <div className="bg-[#0f1424] border border-[#212d47] rounded-3xl p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-rpg font-bold text-lg text-white">HERO ATTRIBUTES</h3>
                <p className="text-xs text-slate-400">
                  Calculated from your completed real-world quests.
                </p>
              </div>
              <span className="text-xs font-mono-stat font-bold text-amber-400 bg-amber-950/80 px-2.5 py-1 rounded-lg border border-amber-800/50">
                CLASS S RANK
              </span>
            </div>

            <div className="space-y-3.5">
              {[
                { label: 'Productivity & Focus', val: player.stats.productivity, icon: '⚡', color: 'from-purple-500 to-indigo-500' },
                { label: 'Exploration & Discovery', val: player.stats.exploration, icon: '🧭', color: 'from-cyan-500 to-teal-500' },
                { label: 'Wellness & Energy', val: player.stats.wellness, icon: '💧', color: 'from-emerald-500 to-green-500' },
                { label: 'Social & Co-op Synergy', val: player.stats.social, icon: '🤝', color: 'from-pink-500 to-rose-500' },
                { label: 'Creativity & Chaos Resilience', val: player.stats.creativity, icon: '🎨', color: 'from-amber-500 to-orange-500' },
              ].map((stat, idx) => (
                <div key={idx}>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-slate-300 flex items-center gap-1.5">
                      <span>{stat.icon}</span>
                      <span>{stat.label}</span>
                    </span>
                    <span className="font-mono-stat text-purple-300">{stat.val} / 100</span>
                  </div>
                  <div className="w-full h-2.5 bg-[#090d18] rounded-full overflow-hidden border border-[#202b44]">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${stat.color} transition-all duration-500`}
                      style={{ width: `${stat.val}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Equippable Titles Selector */}
          <div className="bg-[#0f1424] border border-[#212d47] rounded-3xl p-6 shadow-2xl">
            <div className="flex items-center gap-2 mb-2">
              <Tag className="w-4 h-4 text-amber-400" />
              <h3 className="font-rpg font-bold text-lg text-white">EQUIPPABLE HERO TITLES</h3>
            </div>
            <p className="text-xs text-slate-400 mb-4">
              Select the title displayed beside your avatar across the realm.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {titleOptions.map((t) => (
                <button
                  key={t}
                  onClick={() => handleTitleChange(t)}
                  className={`p-3 rounded-2xl border text-left text-xs font-bold transition flex items-center justify-between ${
                    player.title === t
                      ? 'border-purple-500 bg-purple-950/60 text-purple-200 shadow-sm'
                      : 'border-[#1e273f] bg-[#090d18] text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <span>{t}</span>
                  {player.title === t && <CheckCircle2 className="w-4 h-4 text-purple-400" />}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
