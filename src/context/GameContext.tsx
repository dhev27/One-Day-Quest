import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Achievement,
  DaySetup,
  DaySummary,
  MapNode,
  PlayerProfile,
  Quest,
  RandomEvent,
  ShopItem,
  VibeType,
} from '../types/quest';
import {
  DEMO_MAP_NODES,
  DEMO_PLAYER_PROFILE,
  DEMO_QUESTS,
  INITIAL_ACHIEVEMENTS,
  INITIAL_SHOP_ITEMS,
  RANDOM_SURPRISE_EVENTS,
} from '../utils/demoData';
import { generateQuestsForDay, generateSmartSuggestions } from '../utils/questGenerator';
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

  // Quests & User Driven Tasks
  quests: Quest[];
  setQuests: React.Dispatch<React.SetStateAction<Quest[]>>;
  activeQuestDetail: Quest | null;
  setActiveQuestDetail: (quest: Quest | null) => void;
  acceptQuest: (questId: string) => void;
  completeQuest: (questId: string) => void;
  abandonQuest: (questId: string) => void;
  addUserQuest: (questData: Partial<Quest>) => void;
  editQuest: (questId: string, updatedData: Partial<Quest>) => void;
  deleteQuest: (questId: string) => void;
  reorderQuest: (fromIndex: number, toIndex: number) => void;
  convertSuggestionToActive: (suggestionId: string) => void;
  rejectSuggestion: (suggestionId: string) => void;
  regenerateSuggestions: () => void;
  trimQuestsToFitTime: () => void;

  // Time & Budget Management
  totalAvailableTimeMinutes: number;
  setTotalAvailableTimeMinutes: (mins: number) => void;
  userVibe: VibeType;
  setUserVibe: (vibe: VibeType) => void;
  allowOvertime: boolean;
  setAllowOvertime: (allow: boolean) => void;

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

const STORAGE_KEY = 'one_day_quest_state_v2';

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentScreen, setCurrentScreen] = useState<GameContextType['currentScreen']>('landing');
  const [player, setPlayer] = useState<PlayerProfile>(DEMO_PLAYER_PROFILE);
  const [quests, setQuests] = useState<Quest[]>(DEMO_QUESTS);
  const [mapNodes, setMapNodes] = useState<MapNode[]>(DEMO_MAP_NODES);
  const [dayTheme, setDayTheme] = useState<string>('The Main Character Day');
  const [daySetup, setDaySetup] = useState<DaySetup | null>(null);

  // Time budget & vibe
  const [totalAvailableTimeMinutes, setTotalAvailableTimeMinutes] = useState<number>(120);
  const [userVibe, setUserVibe] = useState<VibeType>('productive');
  const [allowOvertime, setAllowOvertime] = useState<boolean>(false);
  const [rejectedSuggestionIds, setRejectedSuggestionIds] = useState<string[]>([]);

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

  // Sync sound settings
  useEffect(() => {
    soundFx.setSoundEnabled(player.soundEnabled);
  }, [player.soundEnabled]);

  // Load from local storage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.player) setPlayer(parsed.player);
        if (parsed.quests) setQuests(parsed.quests);
        if (parsed.mapNodes) setMapNodes(parsed.mapNodes);
        if (parsed.dayTheme) setDayTheme(parsed.dayTheme);
        if (parsed.totalAvailableTimeMinutes) setTotalAvailableTimeMinutes(parsed.totalAvailableTimeMinutes);
        if (parsed.userVibe) setUserVibe(parsed.userVibe);
      } catch (e) {
        console.error('Failed to parse local storage', e);
      }
    }
  }, []);

  // Save to local storage
  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          player,
          quests,
          mapNodes,
          dayTheme,
          totalAvailableTimeMinutes,
          userVibe,
        })
      );
    } catch {}
  }, [player, quests, mapNodes, dayTheme, totalAvailableTimeMinutes, userVibe]);

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
    if (newComboCount >= 2) {
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

    // Check secret unlock
    const completedCount = updatedQuests.filter((q) => q.status === 'completed' && !q.isSuggestion).length;
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
  };

  const abandonQuest = (questId: string) => {
    soundFx.playClick(350);
    setQuests((prev) =>
      prev.map((q) => (q.id === questId ? { ...q, status: 'available' } : q))
    );
  };

  // Add User-Created Task (Requirement 1 & 2)
  const addUserQuest = (questData: Partial<Quest>) => {
    const duration = questData.timeEstimateMinutes || 45;
    const xp = questData.xpReward || Math.min(300, duration * 2 + 30);
    const coins = questData.coinReward || Math.round(xp * 0.3);

    const newQuest: Quest = {
      id: `user-quest-${Date.now()}`,
      title: questData.title || 'CUSTOM TASK',
      subtitle: questData.subtitle || 'Your Personal Objective',
      description: questData.description || `Complete custom mission: ${questData.title}`,
      flavorText: 'Victory is sweeter when you choose your own battles.',
      category: questData.category || 'personal',
      difficulty: questData.difficulty || (duration >= 60 ? 'hard' : duration >= 45 ? 'medium' : 'easy'),
      priority: questData.priority || 'important',
      energyRequired: questData.energyRequired || 'medium',
      xpReward: xp,
      coinReward: coins,
      status: 'available',
      timeEstimateMinutes: duration,
      icon: questData.icon || '🎯',
      isUserCreated: true,
      customReward: questData.customReward,
      comboType: 'productivity',
    };

    setQuests((prev) => [newQuest, ...prev]);
  };

  // Edit Quest (Requirement 8)
  const editQuest = (questId: string, updatedData: Partial<Quest>) => {
    soundFx.playClick(500);
    setQuests((prev) =>
      prev.map((q) => (q.id === questId ? { ...q, ...updatedData } : q))
    );
  };

  // Delete Quest (Requirement 8)
  const deleteQuest = (questId: string) => {
    soundFx.playClick(350);
    setQuests((prev) => prev.filter((q) => q.id !== questId));
  };

  // Reorder Quests (Requirement 8)
  const reorderQuest = (fromIndex: number, toIndex: number) => {
    soundFx.playClick(400);
    setQuests((prev) => {
      const result = Array.from(prev);
      const [removed] = result.splice(fromIndex, 1);
      result.splice(toIndex, 0, removed);
      return result;
    });
  };

  // Convert Suggestion to Active Quest (Requirement 4 & 5)
  const convertSuggestionToActive = (suggestionId: string) => {
    setQuests((prev) =>
      prev.map((q) =>
        q.id === suggestionId ? { ...q, isSuggestion: false, isUserCreated: false } : q
      )
    );
  };

  // Reject Suggestion (Requirement 5)
  const rejectSuggestion = (suggestionId: string) => {
    setRejectedSuggestionIds((prev) => [...prev, suggestionId]);
    setQuests((prev) => prev.filter((q) => q.id !== suggestionId));
  };

  // Regenerate Suggestions (Requirement 6)
  const regenerateSuggestions = () => {
    soundFx.playClick(600);
    // Remove existing suggestions
    const nonSuggestions = quests.filter((q) => !q.isSuggestion);

    // Calculate remaining time
    const usedTime = nonSuggestions.reduce((sum, q) => sum + (q.timeEstimateMinutes || 30), 0);
    const remaining = Math.max(0, totalAvailableTimeMinutes - usedTime);

    // Generate fresh suggestions
    const fresh = generateSmartSuggestions(remaining, userVibe, rejectedSuggestionIds);
    setQuests([...nonSuggestions, ...fresh]);
  };

  // Trim Quests to fit time (Requirement 11)
  const trimQuestsToFitTime = () => {
    soundFx.playClick(400);
    let currentTotal = 0;
    const trimmed: Quest[] = [];

    for (const q of quests) {
      const dur = q.timeEstimateMinutes || 30;
      if (currentTotal + dur <= totalAvailableTimeMinutes || trimmed.length === 0) {
        trimmed.push(q);
        currentTotal += dur;
      }
    }
    setQuests(trimmed);
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
          timeEstimateMinutes: 30,
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
    setTotalAvailableTimeMinutes(setup.totalAvailableMinutes);
    setUserVibe(setup.vibe);

    const { userQuests, suggestedQuests, mapNodes: genNodes, theme } = generateQuestsForDay(setup);
    
    // Combine user quests + initial suggestions
    setQuests([...userQuests, ...suggestedQuests]);
    setMapNodes(genNodes);
    setDayTheme(theme);
    updatePlayer({
      chaosMode: setup.chaosMode,
      stats: {
        productivity: 75,
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

    const activeQuests = quests.filter((q) => !q.isSuggestion);
    const total = activeQuests.length;
    const completed = activeQuests.filter((q) => q.status === 'completed').length;
    const pct = Math.round((completed / Math.max(total, 1)) * 100);
    const xpTotal = activeQuests
      .filter((q) => q.status === 'completed')
      .reduce((sum, q) => sum + q.xpReward, 0);
    const coinsTotal = activeQuests
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
      summaryText: `You conquered ${completed} out of ${total} missions, took full ownership of your day, and forged your own adventure.`,
      highlights: [
        '🎯 Took charge of your personal task objectives with custom time budgets',
        '⚡ Maintained strong momentum and focused execution',
        '✨ Concluded the day with high scores and earned loot',
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
    setTotalAvailableTimeMinutes(180);
    setUserVibe('productive');
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
        addUserQuest,
        editQuest,
        deleteQuest,
        reorderQuest,
        convertSuggestionToActive,
        rejectSuggestion,
        regenerateSuggestions,
        trimQuestsToFitTime,
        totalAvailableTimeMinutes,
        setTotalAvailableTimeMinutes,
        userVibe,
        setUserVibe,
        allowOvertime,
        setAllowOvertime,
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
