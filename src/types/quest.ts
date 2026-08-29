export type QuestCategory =
  | 'main'
  | 'side'
  | 'exploration'
  | 'social'
  | 'creative'
  | 'recovery'
  | 'random'
  | 'secret';

export type Difficulty = 'easy' | 'medium' | 'hard' | 'epic';

export type QuestStatus = 'available' | 'in_progress' | 'completed' | 'locked';

export interface Quest {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  flavorText: string;
  category: QuestCategory;
  difficulty: Difficulty;
  xpReward: number;
  coinReward: number;
  status: QuestStatus;
  isSecret?: boolean;
  secretUnlockRequirement?: string;
  isMainQuest?: boolean;
  isChaos?: boolean;
  timeEstimateMinutes?: number;
  location?: string;
  icon: string;
  completedAt?: string;
  tags?: string[];
  comboType?: 'productivity' | 'social' | 'wellness' | 'exploration' | 'creative';
  steps?: string[];
  currentStepIndex?: number;
}

export type AvatarId =
  | 'cyber_mage'
  | 'shadow_rogue'
  | 'solar_paladin'
  | 'coffee_alchemist'
  | 'pixel_bard'
  | 'neon_ninja'
  | 'chaos_goblin'
  | 'star_wanderer';

export interface AvatarOption {
  id: AvatarId;
  name: string;
  title: string;
  emoji: string;
  description: string;
  color: string;
  bgGradient: string;
}

export interface PlayerStats {
  productivity: number;
  social: number;
  exploration: number;
  creativity: number;
  wellness: number;
}

export interface EquippedCosmetics {
  head?: string;
  aura?: string;
  companion?: string;
  weapon?: string;
  title?: string;
}

export interface PlayerProfile {
  name: string;
  avatar: AvatarId;
  title: string;
  level: number;
  currentXp: number;
  xpToNextLevel: number;
  coins: number;
  streak: number;
  totalQuestsCompleted: number;
  chaosMode: boolean;
  soundEnabled: boolean;
  stats: PlayerStats;
  inventory: string[]; // Item IDs
  equippedCosmetics: EquippedCosmetics;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'beginner' | 'mastery' | 'chaos' | 'social' | 'exploration' | 'legendary';
  unlocked: boolean;
  unlockedAt?: string;
  xpReward: number;
  coinReward: number;
  progress: number; // 0 to 100
  requirementText: string;
}

export interface ShopItem {
  id: string;
  name: string;
  type: 'head' | 'aura' | 'companion' | 'weapon' | 'title';
  icon: string;
  price: number;
  description: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  perkText?: string;
}

export interface RandomEventChoice {
  id: string;
  label: string;
  description: string;
  icon: string;
  xpBonus: number;
  coinBonus: number;
  spawnQuest?: Partial<Quest>;
}

export interface RandomEvent {
  id: string;
  title: string;
  type: 'free_time' | 'weather' | 'friend_alert' | 'energy_surge' | 'lucky_drop' | 'chaos_rift';
  description: string;
  flavorText: string;
  icon: string;
  choices: RandomEventChoice[];
}

export interface DaySetup {
  energy: 'low' | 'normal' | 'high' | 'chaotic';
  goals: string[];
  freeTime: '30m' | '1h' | '2h' | '4h+';
  budget: '0' | '100' | '300' | '500+';
  location: 'home' | 'campus' | 'city' | 'other';
  party: 'solo' | 'friends' | 'family' | 'random';
  chaosMode: boolean;
  dayThemeName: string;
}

export interface DaySummary {
  score: number;
  categoryScores: {
    goals: number;
    wellbeing: number;
    social: number;
    exploration: number;
    creativity: number;
  };
  questsCompleted: number;
  totalQuests: number;
  xpEarned: number;
  coinsEarned: number;
  streak: number;
  titleEarned: string;
  summaryText: string;
  highlights: string[];
}

export interface MapNode {
  id: string;
  name: string;
  subtitle: string;
  icon: string;
  type: 'gate' | 'dungeon' | 'camp' | 'forest' | 'mystery' | 'boss' | 'kingdom';
  status: 'locked' | 'current' | 'completed';
  connectedQuestId?: string;
  xpReward: number;
  lore: string;
}
