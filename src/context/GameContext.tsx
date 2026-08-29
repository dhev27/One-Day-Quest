import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Achievement,
  AvatarId,
  DaySetup,
  DaySummary,
  MapNode,
  PlayerProfile,
  Quest,
  RandomEvent,
  ShopItem,
} from '../types/quest';
import {
  AVATAR_OPTIONS,
  DEMO_MAP_NODES,
  DEMO_PLAYER_PROFILE,
  DEMO_QUESTS,
  INITIAL_ACHIEVEMENTS,
  INITIAL_SHOP_ITEMS,
  RANDOM_SURPRISE_EVENTS,
} from '../utils/demoData';
import { generateQuestsForDay } from '../utils/questGenerator';
import { soundFx } from '../utils/sound';
import { triggerCelebration, triggerCoinShower, triggerComboBurst, triggerLevelUpFireworks } from '../utils/confetti';

interface ComboInfo {
  count: number;
  type: string;
  label: string;
  active: boolean;
}

interface GameContextType {
  // Screen routing
  currentScreen:
    | 'landing'
    | 'setup'
    | 'generating'
    | 'dashboard'
    | 'map'
    | 'shop'
    | 'achievements'
    | 'profile'
    | 'end_day';
  setCurrentScreen: (screen: GameContextType['currentScreen']) => void;

  // Player State
  player: PlayerProfile;
  updatePlayer: (partial: Partial<PlayerProfile>) => void;
  toggleSound: () => void;
  toggleChaosMode: () => void;

  // Quests
  quests: Quest[];
  setQuests: React.Dispatch<React.SetStateAction<Quest[]>>;
  activeQuestDetail: Quest | null;
  setActiveQuestDetail: (quest: Quest | null) => void;
  acceptQuest: (questId: string) => void;
  completeQuest: (questId: string) => void;
  abandonQuest: (questId: string) => void;
  addCustomQuest: (quest: Quest) => void;

  // Day Setup & Map
  daySetup: DaySetup | null;
  setDaySetup: (setup: DaySetup) => void;
  mapNodes: MapNode[];
  dayTheme: string;
  startNewDayWithSetup: (setup: DaySetup) => void;

  // Level Up Modal
  levelUpModal: { show: boolean; level: number; rewardsText: string };
  closeLevelUpModal: () => void;

  // Quest Completed Toast / Popup
  lastCompletedQuest: { quest: Quest; xpGained: number; coinsGained: number } | null;
  clearLastCompletedQuest: () => void;

  // Secret Unlocked Popup
  secretUnlockedQuest: Quest | null;
  clearSecretUnlockedQuest: () => void;

  // Random Events
  currentRandomEvent: RandomEvent | null;
  triggerRandomEvent: (event?: RandomEvent) => void;
  resolveRandomEventChoice: (choiceId: string) => void;
  closeRandomEvent: () => void;

  // Combos
  combo: ComboInfo;

  // Shop & Inventory
  shopItems: ShopItem[];
  achievements: Achievement[];
  buyItem: (item: ShopItem) => boolean;
  equipItem: (type: 'head' | 'aura' | 'companion' | 'weapon' | 'title', itemId: string) => void;

  // Day Summary
  daySummary: DaySummary | null;
  finishDay: () => void;

  // Demo Mode & Reset
  loadDemoMode: () => void;
  resetAllProgress: () => void;
}

const STORAGE_KEY = 'one_day_quest_state_v1';

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentScreen, setCurrentScreen] = useState<GameContextType['currentScreen']>('landing');
  const [player, setPlayer] = useState<PlayerProfile>(DEMO_PLAYER_PROFILE);
  const [quests, setQuests] = useState<Quest[]>(DEMO_QUESTS);
  const [mapNodes, setMapNodes] = useState<MapNode[]>(DEMO_MAP_NODES);
  const [dayTheme, setDayTheme] = useState<string>('Operation: Hackathon Glory');
  const [daySetup, setDaySetup] = useState<DaySetup | null>(null);

  const [shopItems] = useState<ShopItem[]>(INITIAL_SHOP_ITEMS);
  const [achievements, setAchievements] = useState<Achievement[]>(INITIAL_ACHIEVEMENTS);

  const [activeQuestDetail, setActiveQuestDetail] = useState<Quest | null>(null);
  const [levelUpModal, setLevelUpModal] = useState<{ show: boolean; level: number; rewardsText: string }>({
    show: false,
    level: 1,
    rewardsText: '',
  });

  const [lastCompletedQuest, setLastCompletedQuest] = useState<{ quest: Quest; xpGained: number; coinsGained: number } | null>(null);
  const [secretUnlockedQuest, setSecretUnlockedQuest] = useState<Quest | null>(null);
  const [currentRandomEvent, setCurrentRandomEvent] = useState<RandomEvent | null>(null);

  const [combo, setCombo] = useState<ComboInfo>({
    count: 3,
    type: 'productivity',
    label: '🔥 3× PRODUCTIVITY COMBO!',
    active: true,
  });

  const [daySummary, setDaySummary] = useState<DaySummary | null>(null);

  // Sync sound settings with audio engine
  useEffect(() => {
    soundFx.setSoundEnabled(player.soundEnabled);
  }, [player.soundEnabled]);

  // Load from local storage if available
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.player) setPlayer(parsed.player);
        if (parsed.quests) setQuests(parsed.quests);
        if (parsed.mapNodes) setMapNodes(parsed.mapNodes);
        if (parsed.dayTheme) setDayTheme(parsed.dayTheme);
        if (parsed.achievements) setAchievements(parsed.achievements);
      } catch (e) {
        console.error('Failed to parse local storage', e);
      }
    }
  }, []);

  // Save to local storage on change
  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          player,
          quests,
          mapNodes,
          dayTheme,
          achievements,
        })
      );
    } catch {}
  }, [player, quests, mapNodes, dayTheme, achievements]);

  const updatePlayer = (partial: Partial<PlayerProfile>) => {
    setPlayer((prev) => ({ ...prev, ...partial }));
  };

  const toggleSound = () => {
    const next = !player.soundEnabled;
    updatePlayer({ soundEnabled: next });
    soundFx.setSoundEnabled(next);
    if (next) soundFx.playClick(600);
  };

  const toggleChaosMode = () => {
    const next = !player.chaosMode;
    updatePlayer({ chaosMode: next });
    soundFx.playClick(next ? 700 : 400);
  };

  // Add XP and handle level up
  const addXpAndCoins = (xpGain: number, coinGain: number) => {
    setPlayer((prev) => {
      let newXp = prev.currentXp + xpGain;
      let newLevel = prev.level;
      let newXpToNext = prev.xpToNextLevel;
      let leveledUp = false;

      while (newXp >= newXpToNext) {
        newXp -= newXpToNext;
        newLevel += 1;
        newXpToNext = Math.round(newXpToNext * 1.25);
        leveledUp = true;
      }

      if (leveledUp) {
        setTimeout(() => {
          soundFx.playLevelUp();
          triggerLevelUpFireworks();
          setLevelUpModal({
            show: true,
            level: newLevel,
            rewardsText: `+50 Bonus Coins & unlocked Title Rank! You are now Level ${newLevel}!`,
          });
        }, 600);
      }

      return {
        ...prev,
        level: newLevel,
        currentXp: newXp,
        xpToNextLevel: newXpToNext,
        coins: prev.coins + coinGain + (leveledUp ? 50 : 0),
        totalQuestsCompleted: prev.totalQuestsCompleted + 1,
      };
    });
  };

  const acceptQuest = (questId: string) => {
    soundFx.playQuestAccept();
    setQuests((prev) =>
      prev.map((q) => (q.id === questId ? { ...q, status: 'in_progress' } : q))
    );
  };

  const completeQuest = (questId: string) => {
    const target = quests.find((q) => q.id === questId);
    if (!target || target.status === 'completed') return;

    soundFx.playQuestComplete();
    triggerCelebration();

    // Check combo
    const newComboCount = combo.active ? combo.count + 1 : 1;
    const isCombo = newComboCount >= 2;
    if (isCombo) {
      setTimeout(() => {
        soundFx.playCombo();
        triggerComboBurst();
      }, 300);
    }
    setCombo({
      count: newComboCount,
      type: target.comboType || 'productivity',
      label: `🔥 ${newComboCount}× ${target.comboType?.toUpperCase() || 'QUEST'} COMBO!`,
      active: true,
    });

    // Update quest status
    const updatedQuests = quests.map((q) =>
      q.id === questId ? { ...q, status: 'completed' as const, completedAt: 'Just now' } : q
    );
    setQuests(updatedQuests);

    // Give rewards
    addXpAndCoins(target.xpReward, target.coinReward);

    // Show complete toast / popup
    setLastCompletedQuest({
      quest: target,
      xpGained: target.xpReward,
      coinsGained: target.coinReward,
    });

    // Advance Map Nodes
    setMapNodes((prevNodes) => {
      let advanced = false;
      return prevNodes.map((node) => {
        if (!advanced && node.status === 'current') {
          advanced = true;
          return { ...node, status: 'completed' };
        }
        if (advanced && node.status === 'locked') {
          advanced = false;
          return { ...node, status: 'current' };
        }
        return node;
      });
    });

    // Check if secret quest can be unlocked!
    const completedCount = updatedQuests.filter((q) => q.status === 'completed').length;
    const lockedSecret = updatedQuests.find((q) => q.isSecret && q.status === 'locked');

    if (lockedSecret && completedCount >= 2) {
      setTimeout(() => {
        soundFx.playSecretUnlock();
        setQuests((prev) =>
          prev.map((q) =>
            q.id === lockedSecret.id ? { ...q, status: 'available', isSecret: false } : q
          )
        );
        setSecretUnlockedQuest(lockedSecret);
      }, 1200);
    }

    // Check random event trigger (30% chance or if specific threshold met)
    if (completedCount === 2 || Math.random() < 0.3) {
      setTimeout(() => {
        triggerRandomEvent();
      }, 2500);
    }
  };

  const abandonQuest = (questId: string) => {
    soundFx.playClick(350);
    setQuests((prev) =>
      prev.map((q) => (q.id === questId ? { ...q, status: 'available' } : q))
    );
  };

  const addCustomQuest = (quest: Quest) => {
    soundFx.playQuestAccept();
    setQuests((prev) => [quest, ...prev]);
  };

  const clearLastCompletedQuest = () => setLastCompletedQuest(null);
  const clearSecretUnlockedQuest = () => setSecretUnlockedQuest(null);
  const closeLevelUpModal = () => setLevelUpModal((prev) => ({ ...prev, show: false }));

  // Random Events
  const triggerRandomEvent = (event?: RandomEvent) => {
    const picked = event || RANDOM_SURPRISE_EVENTS[Math.floor(Math.random() * RANDOM_SURPRISE_EVENTS.length)];
    soundFx.playRandomEvent();
    setCurrentRandomEvent(picked);
  };

  const resolveRandomEventChoice = (choiceId: string) => {
    if (!currentRandomEvent) return;
    const choice = currentRandomEvent.choices.find((c) => c.id === choiceId);
    if (choice) {
      soundFx.playCoin();
      triggerCoinShower();
      addXpAndCoins(choice.xpBonus, choice.coinBonus);

      if (choice.spawnQuest) {
        const newQuest: Quest = {
          id: `spawned-${Date.now()}`,
          title: choice.spawnQuest.title || 'SPONTANEOUS CHALLENGE',
          subtitle: 'From Surprise Event',
          description: choice.spawnQuest.description || choice.description,
          flavorText: 'An unexpected branch in your day timeline.',
          category: 'random',
          difficulty: 'medium',
          xpReward: choice.xpBonus + 50,
          coinReward: choice.coinBonus + 15,
          status: 'available',
          icon: choice.icon,
        };
        setQuests((prev) => [newQuest, ...prev]);
      }
    }
    setCurrentRandomEvent(null);
  };

  const closeRandomEvent = () => setCurrentRandomEvent(null);

  // Start new day with procedural generator
  const startNewDayWithSetup = (setup: DaySetup) => {
    setDaySetup(setup);
    const { quests: genQuests, mapNodes: genNodes, theme } = generateQuestsForDay(setup);
    setQuests(genQuests);
    setMapNodes(genNodes);
    setDayTheme(theme);
    updatePlayer({
      chaosMode: setup.chaosMode,
      stats: {
        productivity: 70,
        social: setup.party === 'friends' ? 80 : 50,
        exploration: setup.location === 'city' ? 85 : 60,
        creativity: setup.goals.includes('Creative') ? 90 : 65,
        wellness: setup.energy === 'low' ? 50 : 75,
      },
    });
    setCurrentScreen('dashboard');
  };

  // Shop & Inventory
  const buyItem = (item: ShopItem): boolean => {
    if (player.coins < item.price) {
      soundFx.playClick(200);
      return false;
    }
    soundFx.playCoin();
    triggerCoinShower();
    setPlayer((prev) => ({
      ...prev,
      coins: prev.coins - item.price,
      inventory: [...prev.inventory, item.id],
    }));
    return true;
  };

  const equipItem = (type: 'head' | 'aura' | 'companion' | 'weapon' | 'title', itemId: string) => {
    soundFx.playClick(520);
    setPlayer((prev) => ({
      ...prev,
      equippedCosmetics: {
        ...prev.equippedCosmetics,
        [type]: itemId,
      },
    }));
  };

  // Calculate End-of-Day results
  const finishDay = () => {
    soundFx.playLevelUp();
    triggerLevelUpFireworks();

    const total = quests.length;
    const completed = quests.filter((q) => q.status === 'completed').length;
    const pct = Math.round((completed / Math.max(total, 1)) * 100);
    const xpTotal = quests
      .filter((q) => q.status === 'completed')
      .reduce((sum, q) => sum + q.xpReward, 0);
    const coinsTotal = quests
      .filter((q) => q.status === 'completed')
      .reduce((sum, q) => sum + q.coinReward, 0);

    const score = Math.min(100, Math.max(40, Math.round(pct * 0.9 + 10)));

    let titleEarned = 'MAIN CHARACTER ENERGY';
    if (score >= 90) titleEarned = 'UNSTOPPABLE OVERLORD OF TIME';
    else if (score >= 75) titleEarned = 'LEGENDARY ADVENTURE CONQUEROR';
    else if (score >= 60) titleEarned = 'THE PROCRASTINATION SLAYER';
    else titleEarned = 'THE COMEBACK HERO';

    const summary: DaySummary = {
      score,
      categoryScores: {
        goals: Math.min(100, Math.round(pct * 1.1)),
        wellbeing: 85,
        social: 75,
        exploration: 80,
        creativity: 90,
      },
      questsCompleted: completed,
      totalQuests: total,
      xpEarned: xpTotal,
      coinsEarned: coinsTotal,
      streak: player.streak + 1,
      titleEarned,
      summaryText: `You conquered ${completed} out of ${total} missions, defeated daily distractions, unlocked secret paths, and turned what could have been a mundane day into a legendary playthrough.`,
      highlights: [
        '🔥 Smashed deep focus session without getting trapped by notifications',
        '💧 Restored HP and refreshed your mental stamina',
        '🗺️ Explored uncharted territory and pushed past comfort zones',
        '✨ Maintained an unstoppable 5-day adventure streak',
      ],
    };

    setDaySummary(summary);
    updatePlayer({ streak: player.streak + 1 });
    setCurrentScreen('end_day');
  };

  // Load preset demo mode
  const loadDemoMode = () => {
    soundFx.playQuestComplete();
    setPlayer(DEMO_PLAYER_PROFILE);
    setQuests(DEMO_QUESTS);
    setMapNodes(DEMO_MAP_NODES);
    setDayTheme('The Main Character Odyssey');
    setAchievements(INITIAL_ACHIEVEMENTS);
    setCombo({
      count: 3,
      type: 'productivity',
      label: '🔥 3× PRODUCTIVITY COMBO!',
      active: true,
    });
    setCurrentScreen('dashboard');
  };

  const resetAllProgress = () => {
    localStorage.removeItem(STORAGE_KEY);
    setPlayer({
      name: 'Rookie Adventurer',
      avatar: 'cyber_mage',
      title: 'Novice Wanderer',
      level: 1,
      currentXp: 0,
      xpToNextLevel: 250,
      coins: 50,
      streak: 1,
      totalQuestsCompleted: 0,
      chaosMode: false,
      soundEnabled: true,
      stats: {
        productivity: 50,
        social: 50,
        exploration: 50,
        creativity: 50,
        wellness: 50,
      },
      inventory: [],
      equippedCosmetics: {},
    });
    setQuests([]);
    setMapNodes([]);
    setCurrentScreen('landing');
  };

  return (
    <GameContext.Provider
      value={{
        currentScreen,
        setCurrentScreen,
        player,
        updatePlayer,
        toggleSound,
        toggleChaosMode,
        quests,
        setQuests,
        activeQuestDetail,
        setActiveQuestDetail,
        acceptQuest,
        completeQuest,
        abandonQuest,
        addCustomQuest,
        daySetup,
        setDaySetup,
        mapNodes,
        dayTheme,
        startNewDayWithSetup,
        levelUpModal,
        closeLevelUpModal,
        lastCompletedQuest,
        clearLastCompletedQuest,
        secretUnlockedQuest,
        clearSecretUnlockedQuest,
        currentRandomEvent,
        triggerRandomEvent,
        resolveRandomEventChoice,
        closeRandomEvent,
        combo,
        shopItems,
        achievements,
        buyItem,
        equipItem,
        daySummary,
        finishDay,
        loadDemoMode,
        resetAllProgress,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
