import { DaySetup, MapNode, Quest } from '../types/quest';

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

export function generateQuestsForDay(setup: DaySetup): { quests: Quest[]; mapNodes: MapNode[]; theme: string } {
  const theme = setup.dayThemeName || getRandomDayTheme();
  const quests: Quest[] = [];

  // 1. Generate MAIN QUEST based on primary goal & energy
  let mainTitle = 'DEFEAT THE PROMETHEUS BOSS';
  let mainSubtitle = 'Ultimate Daily Victory';
  let mainDesc = 'Complete your primary objective for the day without surrender.';
  let mainSteps = ['Set up your focus battleground', 'Sprint for 50 minutes', 'Review and seal the achievement'];
  let mainIcon = '🐉';

  if (setup.goals.includes('Study')) {
    mainTitle = 'CONQUER THE EXAM CITADEL';
    mainSubtitle = 'High-Stakes Study Sprint';
    mainDesc = 'Tackle your heaviest subject or hardest homework set for at least 60 solid minutes.';
    mainSteps = ['Clear desk of distractions', 'Finish 3 hardest concept summaries', 'Run 1 practice problem set'];
    mainIcon = '📚';
  } else if (setup.goals.includes('Project')) {
    mainTitle = 'FORGE THE MASTERPIECE';
    mainSubtitle = 'Build & Deploy';
    mainDesc = 'Ship the core milestone of your project, write clean code, and test the key user path.';
    mainSteps = ['Code core functionality', 'Fix lingering bugs', 'Test demo flow'];
    mainIcon = '💻';
  } else if (setup.goals.includes('Fitness')) {
    mainTitle = 'TITAN TRAINING PROTOCOL';
    mainSubtitle = 'Physical Ascendance';
    mainDesc = 'Complete an intense workout, run 3-5 km, or hit PRs in the gym.';
    mainSteps = ['Dynamic warmup & stretch', 'Complete main exercise sets', 'Hydrate and cool down'];
    mainIcon = '⚡';
  } else if (setup.goals.includes('Social')) {
    mainTitle = 'THE TAVERN SUMMIT';
    mainSubtitle = 'Host or Lead the Party';
    mainDesc = 'Organize an unforgettable hangout, dinner, or game night with your squad.';
    mainSteps = ['Send out party invite', 'Pick legendary spot', 'Create lasting memories'];
    mainIcon = '🍻';
  } else if (setup.goals.includes('Creative')) {
    mainTitle = 'THE SPARK OF GENIUS';
    mainSubtitle = 'Unleash Original Art';
    mainDesc = 'Produce a finished piece of writing, illustration, design, or music track.';
    mainSteps = ['Draft messy outline', 'Refine core structure', 'Polish final deliverable'];
    mainIcon = '🎨';
  }

  // Calculate XP based on energy
  const mainXp = setup.energy === 'chaotic' ? 400 : setup.energy === 'high' ? 350 : setup.energy === 'normal' ? 300 : 250;

  quests.push({
    id: `quest-main-${Date.now()}`,
    title: mainTitle,
    subtitle: mainSubtitle,
    description: mainDesc,
    flavorText: 'The main storyline chapter that defines your legacy today.',
    category: 'main',
    difficulty: 'epic',
    xpReward: mainXp,
    coinReward: 80,
    status: 'available',
    isMainQuest: true,
    timeEstimateMinutes: setup.freeTime === '30m' ? 30 : setup.freeTime === '1h' ? 50 : 75,
    location: setup.location === 'home' ? 'Home Citadel' : 'Campus War Room',
    icon: mainIcon,
    comboType: 'productivity',
    steps: mainSteps,
    currentStepIndex: 0,
  });

  // 2. SIDE QUEST 1 - Focus / Productivity
  quests.push({
    id: `quest-side-1-${Date.now()}`,
    title: 'KNOWLEDGE DUNGEON SPRINT',
    subtitle: 'Deep Focus Chamber',
    description: 'Survive 35 minutes of uninterrupted work without switching to social media feeds.',
    flavorText: 'The doomscroll sirens will try to lure you. Stay on target.',
    category: 'side',
    difficulty: 'medium',
    xpReward: 100,
    coinReward: 30,
    status: 'available',
    timeEstimateMinutes: 35,
    location: 'Study Chamber',
    icon: '⚡',
    comboType: 'productivity',
  });

  // 3. RECOVERY QUEST - Wellness / Health
  quests.push({
    id: `quest-rec-1-${Date.now()}`,
    title: 'THE ALCHEMIST’S HYDRATION RITUAL',
    subtitle: 'Vitality Restoration',
    description: 'Down 500ml of water, step outside into fresh air, and take 10 deep belly breaths.',
    flavorText: 'Your stamina bar is recharging. Clean fuel restores maximum MP.',
    category: 'recovery',
    difficulty: 'easy',
    xpReward: 60,
    coinReward: 15,
    status: 'available',
    timeEstimateMinutes: 10,
    location: 'Water Oasis',
    icon: '💧',
    comboType: 'wellness',
  });

  // 4. EXPLORATION QUEST - Location/Budget contextual
  let expTitle = 'UNCHARTED TERRITORY';
  let expDesc = 'Walk down a hallway, street, or route you have never walked before.';
  let expLoc = 'Unknown Perimeter';

  if (setup.location === 'campus') {
    expTitle = 'CAMPUS FOG OF WAR';
    expDesc = 'Visit a building or floor on campus you have never stepped into and take a mental note.';
    expLoc = 'Hidden Campus Wing';
  } else if (setup.location === 'city') {
    expTitle = 'URBAN EXPEDITION';
    expDesc = 'Check out an unfamiliar alleyway, bookshop, or small café within walking distance.';
    expLoc = 'Downtown Grid';
  } else {
    expTitle = 'PERIMETER SCOUT';
    expDesc = 'Step outside and do a 15-minute reconnaissance walk around your neighborhood without your phone in hand.';
    expLoc = 'Outer Ring';
  }

  quests.push({
    id: `quest-exp-1-${Date.now()}`,
    title: expTitle,
    subtitle: 'Discovery & Map Reveal',
    description: expDesc,
    flavorText: '80% of the world remains unexplored until you look up from your screen.',
    category: 'exploration',
    difficulty: 'medium',
    xpReward: 120,
    coinReward: 35,
    status: 'available',
    timeEstimateMinutes: 20,
    location: expLoc,
    icon: '🧭',
    comboType: 'exploration',
  });

  // 5. SOCIAL QUEST - Party contextual
  if (setup.party === 'friends') {
    quests.push({
      id: `quest-soc-1-${Date.now()}`,
      title: 'CO-OP PARTY BUFF',
      subtitle: 'Comrade Synchrony',
      description: 'Exchange a compliment or collaborate on solving a problem with a teammate.',
      flavorText: 'Party synergy adds +25% luck to all upcoming rolls.',
      category: 'social',
      difficulty: 'easy',
      xpReward: 80,
      coinReward: 25,
      status: 'available',
      timeEstimateMinutes: 15,
      location: 'Guild Hall',
      icon: '🤝',
      comboType: 'social',
    });
  } else {
    quests.push({
      id: `quest-soc-1-${Date.now()}`,
      title: 'NPC INTERACTION PROTOCOL',
      subtitle: 'Social Radar Check',
      description: 'Text someone you haven’t spoken to this week or ask a barista/classmate how their day is going.',
      flavorText: 'Random NPCs often drop rare lore and unexpected smile buffs.',
      category: 'social',
      difficulty: 'easy',
      xpReward: 80,
      coinReward: 25,
      status: 'available',
      timeEstimateMinutes: 5,
      location: 'The Crossroads',
      icon: '💬',
      comboType: 'social',
    });
  }

  // 6. CHAOS QUEST (If chaos mode is enabled or chaotic energy)
  if (setup.chaosMode || setup.energy === 'chaotic') {
    const chaosPool = [
      {
        title: 'CHAOS CARD: THE STRANGE QUESTION',
        desc: 'Ask a friend or classmate the weirdest harmless question you can think of (e.g., "Would you fight 100 duck-sized horses?").',
        icon: '🎭',
      },
      {
        title: 'CHAOS CARD: MYSTERY SNACK TASTING',
        desc: 'Try a completely unfamiliar flavor of snack or drink today and rate it out of 10.',
        icon: '🍬',
      },
      {
        title: 'CHAOS CARD: RANDOM PHOTO CHALLENGE',
        desc: 'Take a photo of the most absurd or funny thing you notice in your surroundings today.',
        icon: '📸',
      },
    ];
    const pickedChaos = chaosPool[Math.floor(Math.random() * chaosPool.length)];

    quests.push({
      id: `quest-chaos-${Date.now()}`,
      title: pickedChaos.title,
      subtitle: 'Unhinged Adventure Element',
      description: pickedChaos.desc,
      flavorText: 'The Chaos Gods are watching and eagerly awaiting your move.',
      category: 'random',
      difficulty: 'medium',
      xpReward: 110,
      coinReward: 40,
      status: 'available',
      isChaos: true,
      timeEstimateMinutes: 15,
      location: 'Wild Wild Realm',
      icon: pickedChaos.icon,
      comboType: 'creative',
    });
  }

  // 7. SECRET QUEST (Starts locked, unlocks after 2 completed quests)
  quests.push({
    id: `quest-secret-${Date.now()}`,
    title: 'THE GOLDEN MOMENT OF LEGEND',
    subtitle: 'Mysterious Locked Scroll',
    description: 'Perform one act of spontaneous generosity or capture a snapshot you will cherish a year from now.',
    flavorText: 'An iridescent seal pulses with ancient magical runes...',
    category: 'secret',
    difficulty: 'hard',
    xpReward: 200,
    coinReward: 70,
    status: 'locked',
    isSecret: true,
    secretUnlockRequirement: 'Complete any 2 quests to crack the seal',
    timeEstimateMinutes: 20,
    location: 'Secret Chamber',
    icon: '🔒',
    comboType: 'wellness',
  });

  // Generate Map Nodes
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
      name: 'KNOWLEDGE TOWER',
      subtitle: 'Study & Mental Focus',
      icon: '📚',
      type: 'dungeon',
      status: 'current',
      xpReward: 100,
      lore: 'High towers of wisdom where distractions are banished.',
    },
    {
      id: 'node-3',
      name: 'ALCHEMIST’S REST',
      subtitle: 'HP & Stamina Refill',
      icon: '💧',
      type: 'camp',
      status: 'locked',
      xpReward: 60,
      lore: 'Clear spring waters and quiet moments beneath the pines.',
    },
    {
      id: 'node-4',
      name: 'WANDERER’S GROVE',
      subtitle: 'Territory Discovery',
      icon: '🌲',
      type: 'forest',
      status: 'locked',
      xpReward: 120,
      lore: 'Sunlight filters through uncharted branches.',
    },
    {
      id: 'node-5',
      name: 'THE CITADEL CLIMAX',
      subtitle: 'The Boss Encounter',
      icon: '🏰',
      type: 'boss',
      status: 'locked',
      xpReward: mainXp,
      lore: 'The ultimate climax of your day. Triumph and glory await.',
    },
    {
      id: 'node-6',
      name: 'NIGHT OF GLORY',
      subtitle: 'Tavern Celebration',
      icon: '🌙',
      type: 'kingdom',
      status: 'locked',
      xpReward: 100,
      lore: 'Raise your goblets. Another day conquered in style.',
    },
  ];

  return { quests, mapNodes, theme };
}
