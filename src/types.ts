export interface PlayerStats {
  str: number;
  agi: number;
  vit: number;
  int: number;
}

export interface PlayerEquipped {
  weapon: string | null;
  accessory: string | null;
  skill: string | null;
}

export interface PlayerPotions {
  hp: number;
  mp: number;
}

export interface PlayerUpgrades {
  dropChance: number;
  autoclickSpeed: number;
  goldBonus: number;
  crystalBonus: number;
  dailyReforco: number;
}

export interface PlayerDailyProgress {
  pushups: number;
  situps: number;
  squats: number;
  runs: number;
  completedToday: number;
}

export interface Invocation {
  name: string;
  rank: string;
  type: string;
  statBonus: {
    str: number;
    vit: number;
    agi: number;
    int: number;
  };
}

export interface InventoryItem {
  id: string;
  category: string;
  qty: number;
}

export interface Player {
  level: number;
  xp: number;
  gold: number;
  crystals: number;
  gachaPoints: number;
  stats: PlayerStats;
  statPoints: number;
  class: string | null;
  hp: number;
  mp: number;
  equipped: PlayerEquipped;
  potions: PlayerPotions;
  upgrades: PlayerUpgrades;
  dailyProgress: PlayerDailyProgress;
  unlockedClasses: string[];
  invocations: Invocation[];
  shadowPoder: number;
  inventory: InventoryItem[];
  godPath: 'Monarca' | 'Estelar' | null;
}

export interface ClassBonus {
  hpMax?: number;
  mpMax?: number;
  str?: number;
  agi?: number;
  vit?: number;
  int?: number;
}

export interface ClassData {
  rank: string;
  bonus: ClassBonus;
  summoner: boolean;
  type?: string;
}

export interface Portal {
  id: string;
  name: string;
  rank: string;
  minLevel: number;
  baseHp: number;
  dmg: number;
  xp: number;
  gold: number;
  crystals: number;
  secretChance: number;
}

export interface ShopItem {
  id: string;
  name: string;
  rank: string;
  cost: number;
  stat?: 'str' | 'agi' | 'vit' | 'int';
  val?: number;
  type?: string; // for consumables e.g., hp_fill, mp_fill
  desc?: string;
  mpCost?: number; // for skills
  dmgMult?: number; // for skills
}

export interface ActiveCombat {
  portal: Portal;
  isSecret: boolean;
  monsterRank: string;
  name: string;
  hpMax: number;
  hp: number;
  dmg: number;
  completed?: boolean;
}

export interface NotificationMsg {
  id: string;
  title: string;
  message: string;
  type: 'blue' | 'red' | 'purple' | 'gold';
}

export interface CombatLogEntry {
  id: string;
  timestamp: string;
  text: string;
  type: 'player_hit' | 'player_crit' | 'player_skill' | 'monster_hit' | 'victory' | 'info';
  damage?: number;
}

