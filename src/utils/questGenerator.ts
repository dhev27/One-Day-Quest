import { DaySetup, MapNode, Quest, VibeType, EnergyLevel, PriorityLevel } from '../types/quest';

const THEME_NAMES = [
  'Operation: Get Your Life Together',
  'The Day of Small Wins',
  'The Main Character Day',
  'Campus Chaos & Glory',
  'The Productivity Rebellion',
  'The Coffee Alchemist Odyssey',
  'The Weekend Conquest',
  'The Procrastination Extinction Event',
  'Midnight Marauder Chronicles',
  'Urban Explorer: The Hidden Realm',
];

export function getRandomDayTheme(): string {
  return THEME_NAMES[Math.floor(Math.random() * THEME_NAMES.length)];
}

export function parseFreeTimeToMinutes(freeTime: DaySetup['freeTime'], customMinutes?: number): number {
  if (customMinutes && customMinutes > 0) return customMinutes;
  switch (freeTime) {
    case '30m': return 30;
    case '1h': return 60;
    case '2h': return 120;
    case '3h': return 180;
    case '4h+': return 240;
    case 'custom': return customMinutes || 60;
    default: return 120;
  }
}

// Parse free-form user task input into discrete quest objects
export function parseUserTasksInput(text: string): Quest[] {
  if (!text || !text.trim()) return [];

  // Split by newlines or commas or bullets
  const lines = text
    .split(/[\n,;•]+/)
    .map((line) => line.trim())
    .filter((line) => line.length > 2);

  return lines.map((line, idx) => {
    const cleanTitle = line.replace(/^[-\d.)\s]+/, '').trim();
    let category: Quest['category'] = 'personal';
    let icon = '🎯';
    let duration = 45;
    let priority: PriorityLevel = 'important';
    let energy: EnergyLevel = 'medium';

    const lower = cleanTitle.toLowerCase();
    if (lower.includes('study') || lower.includes('assign') || lower.includes('dsa') || lower.includes('exam') || lower.includes('read') || lower.includes('code')) {
      category = 'study';
      icon = '📚';
      duration = 45;
      priority = 'important';
      energy = 'medium';
    } else if (lower.includes('volleyball') || lower.includes('workout') || lower.includes('gym') || lower.includes('run') || lower.includes('walk') || lower.includes('fitness')) {
      category = 'fitness';
      icon = '🏐';
      duration = 45;
      priority = 'normal';
      energy = 'high';
    } else if (lower.includes('mom') || lower.includes('call') || lower.includes('friend') || lower.includes('meet') || lower.includes('text')) {
      category = 'social';
      icon = '💬';
      duration = 30;
      priority = 'important';
      energy = 'low';
    } else if (lower.includes('clean') || lower.includes('desk') || lower.includes('room') || lower.includes('wash') || lower.includes('laundry')) {
      category = 'chores';
      icon = '🧹';
      duration = 30;
      priority = 'normal';
      energy = 'low';
    } else if (lower.includes('episode') || lower.includes('watch') || lower.includes('game') || lower.includes('movie') || lower.includes('anime')) {
      category = 'fun';
      icon = '🎮';
      duration = 45;
      priority = 'chill';
      energy = 'low';
    }

    const xp = Math.min(250, Math.max(50, duration * 2 + (priority === 'must_do' ? 50 : 25)));
    const coins = Math.round(xp * 0.3);

    return {
      id: `user-task-${Date.now()}-${idx}`,
      title: cleanTitle.toUpperCase(),
      subtitle: 'Your Personal Objective',
      description: `Complete your self-assigned task: "${cleanTitle}".`,
      flavorText: 'A warrior defines their own battlefield.',
      category,
      difficulty: duration >= 60 ? 'hard' : duration >= 45 ? 'medium' : 'easy',
      priority,
      energyRequired: energy,
      xpReward: xp,
      coinReward: coins,
      status: 'available',
      isUserCreated: true,
      timeEstimateMinutes: duration,
      icon,
      comboType: category === 'study' ? 'productivity' : category === 'social' ? 'social' : 'wellness',
      customReward: 'Sense of glory & free time unlocked',
    };
  });
}

// Pool of smart suggestions categorized by vibe and duration
export interface SuggestionTemplate {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  flavorText: string;
  category: Quest['category'];
  duration: number; // in minutes
  energy: EnergyLevel;
  vibe: VibeType[];
  icon: string;
  priority: PriorityLevel;
}

const SUGGESTION_POOL: SuggestionTemplate[] = [
  {
    id: 'sug-walk-20',
    title: 'THE 20-MINUTE UNPLUGGED EXPEDITION',
    subtitle: 'Outdoor Vitality',
    description: 'Go for a 20-minute walk outside without checking phone notifications.',
    flavorText: 'Natural sunlight restores 40% of baseline mental mana.',
    category: 'fitness',
    duration: 30,
    energy: 'low',
    vibe: ['chill', 'low_energy', 'surprise', 'productive'],
    icon: '🚶',
    priority: 'normal',
  },
  {
    id: 'sug-focus-sprint',
    title: 'KNOWLEDGE DUNGEON FOCUS SPRINT',
    subtitle: 'High Velocity Deep Work',
    description: 'Conquer 45 minutes of pure uninterrupted deep focus on your hardest study/work item.',
    flavorText: 'The distraction monster is powerless against a ticking chrono.',
    category: 'study',
    duration: 45,
    energy: 'high',
    vibe: ['productive', 'energetic'],
    icon: '📚',
    priority: 'important',
  },
  {
    id: 'sug-room-reset',
    title: 'THE 15-MINUTE SANCTUARY RESET',
    subtitle: 'Environment Clarity',
    description: 'Clear desk clutter, make the bed, and organize your work arena.',
    flavorText: 'An orderly chamber grants +20% focus aura.',
    category: 'chores',
    duration: 30,
    energy: 'low',
    vibe: ['chill', 'low_energy', 'productive', 'surprise'],
    icon: '🧹',
    priority: 'normal',
  },
  {
    id: 'sug-stretch-meditate',
    title: 'HP POTION & 15-MIN MINDFUL REST',
    subtitle: 'Stamina Reboot',
    description: 'Drink a tall glass of cold water and do full-body stretches or breathing.',
    flavorText: 'Cooldown phases prevent hero burnouts.',
    category: 'recovery',
    duration: 30,
    energy: 'low',
    vibe: ['chill', 'low_energy', 'surprise'],
    icon: '🧘',
    priority: 'chill',
  },
  {
    id: 'sug-social-npc',
    title: 'NPC ENCOUNTER: SEND A WHOLESOME MEME',
    subtitle: 'Squad Synchrony',
    description: 'Text a friend or family member a meme or quick check-in.',
    flavorText: 'Party morale directly boosts daily luck stats.',
    category: 'social',
    duration: 30,
    energy: 'low',
    vibe: ['chill', 'energetic', 'surprise'],
    icon: '💬',
    priority: 'chill',
  },
  {
    id: 'sug-creative-doodle',
    title: 'THE 20-MINUTE CREATIVE SPARK',
    subtitle: 'Artistic Alchemy',
    description: 'Sketch, write, record, or create something original for 20 minutes without judging the result.',
    flavorText: 'Creation is magic cast into the physical realm.',
    category: 'creative',
    duration: 30,
    energy: 'medium',
    vibe: ['productive', 'energetic', 'surprise'],
    icon: '🎨',
    priority: 'normal',
  },
  {
    id: 'sug-campus-explore',
    title: 'CAMPUS FOG OF WAR: UNCHARTED ROUTE',
    subtitle: 'Exploration Discovery',
    description: 'Take a completely different path or enter a building you never visited.',
    flavorText: '80% of your surroundings remain undocumented in your memory.',
    category: 'exploration',
    duration: 30,
    energy: 'medium',
    vibe: ['energetic', 'surprise'],
    icon: '🧭',
    priority: 'normal',
  },
  {
    id: 'sug-power-workout',
    title: 'TITAN STRENGTH CHALLENGE',
    subtitle: 'Physical Ascendance',
    description: 'Hit a solid workout or 3 sets of pushups, squats & core.',
    flavorText: 'Physical training forges unbreakable resolve.',
    category: 'fitness',
    duration: 45,
    energy: 'high',
    vibe: ['energetic', 'productive'],
    icon: '⚡',
    priority: 'important',
  },
];

export function generateSmartSuggestions(
  remainingMinutes: number,
  vibe: VibeType = 'productive',
  rejectedIds: string[] = []
): Quest[] {
  // Filter out rejected suggestions
  let pool = SUGGESTION_POOL.filter((item) => !rejectedIds.includes(item.id));

  // If pool is empty, reset filter
  if (pool.length === 0) pool = SUGGESTION_POOL;

  // Filter based on remaining time if reasonable
  let candidates = pool.filter((item) => item.duration <= Math.max(remainingMinutes, 30));
  if (candidates.length < 2) candidates = pool;

  // Shuffle and pick 2-3 suggestions
  const shuffled = candidates.sort(() => 0.5 - Math.random());
  const selected = shuffled.slice(0, Math.min(3, shuffled.length));

  return selected.map((sug) => {
    const xp = sug.duration >= 45 ? 120 : 70;
    const coins = Math.round(xp * 0.3);

    return {
      id: `sug-${sug.id}-${Date.now()}`,
      title: sug.title,
      subtitle: sug.subtitle,
      description: sug.description,
      flavorText: sug.flavorText,
      category: sug.category,
      difficulty: sug.duration >= 45 ? 'medium' : 'easy',
      priority: sug.priority,
      energyRequired: sug.energy,
      xpReward: xp,
      coinReward: coins,
      status: 'available',
      isSuggestion: true,
      timeEstimateMinutes: sug.duration,
      icon: sug.icon,
      comboType: sug.category === 'fitness' ? 'wellness' : 'productivity',
    };
  });
}

export function generateQuestsForDay(setup: DaySetup): {
  userQuests: Quest[];
  suggestedQuests: Quest[];
  mapNodes: MapNode[];
  theme: string;
} {
  const theme = setup.dayThemeName || getRandomDayTheme();
  const totalMinutes = setup.totalAvailableMinutes || parseFreeTimeToMinutes(setup.freeTime, setup.customMinutes);

  // 1. Parse User's own tasks first
  const userQuests = parseUserTasksInput(setup.userCustomTasksInput);

  // Calculate used time by user quests
  const userMinutesUsed = userQuests.reduce((sum, q) => sum + (q.timeEstimateMinutes || 45), 0);
  const remainingMinutes = Math.max(0, totalMinutes - userMinutesUsed);

  // 2. Generate smart suggestions fitting the remaining time & vibe
  const suggestedQuests = generateSmartSuggestions(remainingMinutes, setup.vibe);

  // 3. Map Nodes
  const mapNodes: MapNode[] = [
    {
      id: 'node-1',
      name: 'MORNING THRESHOLD',
      subtitle: 'Rise & Prepare',
      icon: '🌅',
      type: 'gate',
      status: 'completed',
      xpReward: 40,
      lore: 'The gate to today has opened. Step into the arena.',
    },
    {
      id: 'node-2',
      name: 'HERO’S FOCUS TOWER',
      subtitle: 'Primary Task Chamber',
      icon: '📚',
      type: 'dungeon',
      status: 'current',
      xpReward: 100,
      lore: 'High towers of concentration where excuses are slain.',
    },
    {
      id: 'node-3',
      name: 'REST OASIS',
      subtitle: 'HP & Stamina Refill',
      icon: '💧',
      type: 'camp',
      status: 'locked',
      xpReward: 60,
      lore: 'Cool spring water and moment of recovery.',
    },
    {
      id: 'node-4',
      name: 'CITADEL CLIMAX',
      subtitle: 'Day Conquest',
      icon: '🏰',
      type: 'boss',
      status: 'locked',
      xpReward: 250,
      lore: 'The climax of your day. Victory and XP await.',
    },
    {
      id: 'node-5',
      name: 'NIGHT OF GLORY',
      subtitle: 'Tavern Celebration & Score',
      icon: '🌙',
      type: 'kingdom',
      status: 'locked',
      xpReward: 100,
      lore: 'Tally your coins, review your score, and rest well.',
    },
  ];

  return { userQuests, suggestedQuests, mapNodes, theme };
}
