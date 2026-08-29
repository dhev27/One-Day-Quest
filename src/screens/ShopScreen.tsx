import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { ShopItem } from '../types/quest';
import { soundFx } from '../utils/sound';
import {
  ShoppingBag,
  Coins,
  Sparkles,
  Check,
  Crown,
  Shield,
  Flame,
  Tag,
  ArrowRight,
} from 'lucide-react';

export const ShopScreen: React.FC = () => {
  const { player, shopItems, buyItem, equipItem } = useGame();
  const [filterType, setFilterType] = useState<string>('all');
  const [purchaseToast, setPurchaseToast] = useState<string | null>(null);

  const getRarityBadge = (rarity: ShopItem['rarity']) => {
    switch (rarity) {
      case 'common':
        return { label: 'COMMON', bg: 'bg-slate-800 text-slate-300 border-slate-600' };
      case 'rare':
        return { label: 'RARE', bg: 'bg-blue-950 text-blue-300 border-blue-600' };
      case 'epic':
        return { label: 'EPIC', bg: 'bg-purple-950 text-purple-300 border-purple-600' };
      case 'legendary':
        return { label: 'LEGENDARY', bg: 'bg-amber-950 text-amber-300 border-amber-500 shadow-glow-gold' };
    }
  };

  const filteredItems = shopItems.filter((item) => {
    if (filterType === 'all') return true;
    return item.type === filterType;
  });

  const handleBuy = (item: ShopItem) => {
    const success = buyItem(item);
    if (success) {
      setPurchaseToast(`Unlocked ${item.name}! Added to your inventory.`);
      setTimeout(() => setPurchaseToast(null), 3000);
    } else {
      setPurchaseToast(`Not enough coins! Complete more quests to earn 🪙`);
      setTimeout(() => setPurchaseToast(null), 3000);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 pb-24">
      {/* Header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <ShoppingBag className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-extrabold uppercase tracking-widest text-amber-400">
              BAZAAR OF GLORY
            </span>
          </div>
          <h1 className="font-rpg font-black text-2xl sm:text-3xl md:text-4xl text-white">
            QUEST SHOP 🪙
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Spend your hard-earned Quest Coins on cosmetic gear, familiars, and prestige titles.
          </p>
        </div>

        {/* Current Coin Vault */}
        <div className="px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-950/80 to-yellow-950/80 border border-amber-500/60 flex items-center gap-3 shadow-glow-gold">
          <Coins className="w-7 h-7 text-amber-400 animate-bounce" />
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-amber-300">
              YOUR TREASURY
            </div>
            <div className="text-xl font-mono-stat font-black text-white">{player.coins} Coins</div>
          </div>
        </div>
      </div>

      {/* Toast message */}
      {purchaseToast && (
        <div className="mb-4 p-3 rounded-xl bg-purple-950 border border-purple-500 text-purple-200 text-xs font-bold text-center animate-fadeIn shadow-md">
          {purchaseToast}
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-6">
        {[
          { id: 'all', label: 'All Artifacts' },
          { id: 'head', label: '🎩 Headgear' },
          { id: 'companion', label: '🐱 Familiars' },
          { id: 'aura', label: '🔥 Auras' },
          { id: 'weapon', label: '⚔️ Weapons' },
          { id: 'title', label: '🏷️ Titles' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              soundFx.playClick(450);
              setFilterType(tab.id);
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
              filterType === tab.id
                ? 'bg-amber-500 text-slate-950 shadow-glow-gold'
                : 'bg-[#121728] text-slate-400 hover:text-white border border-[#232f4a]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Items Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {filteredItems.map((item) => {
          const isOwned = player.inventory.includes(item.id);
          const isEquipped =
            player.equippedCosmetics[item.type] === item.id ||
            player.equippedCosmetics.title === item.name;
          const rarity = getRarityBadge(item.rarity);
          const canAfford = player.coins >= item.price;

          return (
            <div
              key={item.id}
              className={`p-5 rounded-3xl border flex flex-col justify-between transition-all duration-200 ${
                isEquipped
                  ? 'border-purple-500 bg-[#161c33] shadow-glow-purple'
                  : isOwned
                  ? 'border-emerald-700/60 bg-[#0e1622]'
                  : 'border-[#222d46] bg-[#101524] hover:border-slate-600'
              }`}
            >
              <div>
                {/* Header Badge */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded border ${rarity.bg}`}>
                    {rarity.label}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    {item.type}
                  </span>
                </div>

                {/* Item Icon & Title */}
                <div className="flex items-center gap-3.5 mb-3">
                  <div className="w-14 h-14 rounded-2xl bg-[#0a0d18] border border-[#212c47] flex items-center justify-center text-3xl shadow-inner shrink-0">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="font-rpg font-bold text-base text-white">{item.name}</h3>
                    {item.perkText && (
                      <p className="text-xs text-amber-300 font-semibold mt-0.5">{item.perkText}</p>
                    )}
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs text-slate-300 leading-relaxed mb-4">{item.description}</p>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-[#1e273f] flex items-center justify-between gap-2">
                {!isOwned ? (
                  <>
                    <div className="flex items-center gap-1 text-sm font-mono-stat font-extrabold text-amber-400">
                      <Coins className="w-4 h-4" />
                      <span>{item.price} 🪙</span>
                    </div>

                    <button
                      onClick={() => handleBuy(item)}
                      disabled={!canAfford}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                        canAfford
                          ? 'bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 shadow-glow-gold hover:scale-105'
                          : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                      }`}
                    >
                      <span>Buy Item</span>
                    </button>
                  </>
                ) : isEquipped ? (
                  <div className="w-full py-2 rounded-xl bg-purple-950/80 border border-purple-600 text-purple-300 text-xs font-bold text-center flex items-center justify-center gap-1.5">
                    <Check className="w-4 h-4 text-purple-400" />
                    <span>Currently Equipped</span>
                  </div>
                ) : (
                  <button
                    onClick={() => equipItem(item.type, item.id)}
                    className="w-full py-2 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-600 text-emerald-300 text-xs font-bold transition flex items-center justify-center gap-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Equip to Hero</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
