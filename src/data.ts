import { ClassData, Portal, ShopItem } from "./types";

export const RANKS = ['E', 'D', 'C', 'B', 'A', 'S', 'SS', 'SSS', 'N', 'N+', 'FE', 'FE+', 'M', 'M+', 'Deus'];

export const RANK_COLORS: Record<string, string> = {
  'E': 'text-slate-400 border-slate-600 bg-slate-950/50',
  'D': 'text-emerald-400 border-emerald-800 bg-emerald-950/30',
  'C': 'text-blue-400 border-blue-800 bg-blue-950/30',
  'B': 'text-indigo-400 border-indigo-800 bg-indigo-950/30',
  'A': 'text-yellow-500 border-yellow-700 bg-yellow-950/30',
  'S': 'text-red-500 border-red-700 bg-red-950/30',
  'SS': 'text-purple-400 border-purple-700 bg-purple-950/30 font-bold',
  'SSS': 'text-fuchsia-400 border-fuchsia-700 bg-fuchsia-950/30 font-bold neon-shadow-purple',
  'N': 'text-cyan-400 border-cyan-700 bg-cyan-950/30 neon-shadow-blue font-bold tracking-widest',
  'N+': 'text-cyan-300 border-cyan-500 bg-cyan-900/40 neon-shadow-blue font-black tracking-widest',
  'FE': 'text-orange-400 border-orange-700 bg-orange-950/30 font-bold tracking-widest',
  'FE+': 'text-orange-300 border-orange-500 bg-orange-900/40 font-black tracking-widest',
  'M': 'text-rose-500 border-rose-800 bg-rose-950/30 font-bold tracking-widest',
  'M+': 'text-rose-400 border-rose-600 bg-rose-900/40 neon-shadow-red font-black tracking-widest',
  'Deus': 'text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-400 to-orange-500 border-yellow-500 bg-yellow-950/50 font-black tracking-widest neon-shadow-gold'
};

export const CLASSES_DATA: Record<string, ClassData> = {
  'Soldado': { rank: 'E', bonus: { hpMax: 20, str: 2 }, summoner: false },
  'Mago': { rank: 'D', bonus: { mpMax: 50, int: 5 }, summoner: false },
  'Lutador': { rank: 'C', bonus: { hpMax: 50, str: 8, vit: 3 }, summoner: false },
  'Guerreiro': { rank: 'B', bonus: { hpMax: 80, str: 15, vit: 8 }, summoner: false },
  'Espadachim': { rank: 'A', bonus: { str: 30, agi: 20 }, summoner: false },
  'Invocador': { rank: 'S', bonus: { mpMax: 200, int: 40 }, summoner: true, type: 'normal' },
  'Formiga das Sombras': { rank: 'SS', bonus: { str: 60, agi: 50, vit: 20 }, summoner: true, type: 'shadow_hive' },
  'Cavalheiro das Sombras': { rank: 'SS', bonus: { str: 50, vit: 70, agi: 20 }, summoner: true, type: 'shadow_knight' },
  'Monarca dos Dragões': { rank: 'SSS', bonus: { hpMax: 1000, mpMax: 500, str: 100, int: 100 }, summoner: true, type: 'dragon' },
  'Monarca das Sombras': { rank: 'SSS', bonus: { hpMax: 1200, mpMax: 600, str: 120, int: 120, agi: 80 }, summoner: true, type: 'shadow' },
  
  // Novas Classes Transcendentes
  'Caçador Nacional': { rank: 'N', bonus: { str: 250, agi: 250, vit: 250, int: 250 }, summoner: false },
  'Herói Nacional (Top 1)': { rank: 'N+', bonus: { str: 450, agi: 450, vit: 450, int: 450 }, summoner: false },
  'Manipulador de Interação Forte': { rank: 'FE', bonus: { str: 1200, vit: 1200, agi: 500, int: 500 }, summoner: false },
  'Executor de Entropia': { rank: 'FE+', bonus: { str: 2000, vit: 1500, agi: 1500, int: 2000 }, summoner: false },
  'Invocador Cósmico': { rank: 'M', bonus: { mpMax: 10000, int: 4500, vit: 3000, str: 1000, agi: 1000 }, summoner: true, type: 'cosmic' },
  'Lorde do Vazio Absoluto': { rank: 'M+', bonus: { hpMax: 50000, mpMax: 50000, str: 8000, int: 8000, vit: 8000, agi: 8000 }, summoner: true, type: 'void' },
  
  // Classes Divinas (Só por escolha no LVL 200)
  'Soberano da Vontade Divina': { rank: 'Deus', bonus: { str: 20000, agi: 20000, vit: 20000, int: 20000 }, summoner: true, type: 'god_monarca' },
  'Forjador de Sóis': { rank: 'Deus', bonus: { str: 20000, agi: 20000, vit: 20000, int: 20000 }, summoner: true, type: 'god_estelar' }
};

export const PORTALS_DB: Portal[] = [
  { id: 'p_e', name: 'Masmorra Inicial de Insetos', rank: 'E', minLevel: 1, baseHp: 80, dmg: 4, xp: 20, gold: 50, crystals: 1, secretChance: 0.10 },
  { id: 'p_d', name: 'Fenda dos Goblins', rank: 'D', minLevel: 5, baseHp: 250, dmg: 15, xp: 60, gold: 150, crystals: 3, secretChance: 0.12 },
  { id: 'p_c', name: 'Ninho dos Golens de Pedra', rank: 'C', minLevel: 10, baseHp: 650, dmg: 40, xp: 180, gold: 400, crystals: 7, secretChance: 0.15 },
  { id: 'p_b', name: 'Templo dos Elfos Sombrios', rank: 'B', minLevel: 15, baseHp: 1800, dmg: 100, xp: 500, gold: 1000, crystals: 15, secretChance: 0.18 },
  { id: 'p_a', name: 'Covil dos Orcs Vermelhos', rank: 'A', minLevel: 22, baseHp: 5000, dmg: 250, xp: 1500, gold: 3000, crystals: 35, secretChance: 0.20 },
  { id: 'p_s', name: 'Reino dos Gigantes Brancos', rank: 'S', minLevel: 30, baseHp: 15000, dmg: 800, xp: 5000, gold: 10000, crystals: 100, secretChance: 0.25 },
  { id: 'p_ss', name: 'Ruínas do Castelo Demônio', rank: 'SS', minLevel: 35, baseHp: 50000, dmg: 2500, xp: 18000, gold: 30000, crystals: 250, secretChance: 0.30 },
  { id: 'p_sss', name: 'Fenda Dimensional do Monarca', rank: 'SSS', minLevel: 40, baseHp: 150000, dmg: 6000, xp: 60000, gold: 100000, crystals: 1000, secretChance: 0.35 },
  
  // Novos Portais
  { id: 'p_n', name: 'Fenda Cinzenta do Vazio', rank: 'N', minLevel: 50, baseHp: 500000, dmg: 15000, xp: 200000, gold: 350000, crystals: 4000, secretChance: 0.40 },
  { id: 'p_n_plus', name: 'Colapso de Supernova', rank: 'N+', minLevel: 65, baseHp: 1500000, dmg: 40000, xp: 750000, gold: 1200000, crystals: 15000, secretChance: 0.45 },
  { id: 'p_fe', name: 'Singularidade Elemental', rank: 'FE', minLevel: 80, baseHp: 5000000, dmg: 120000, xp: 2500000, gold: 4500000, crystals: 60000, secretChance: 0.50 },
  { id: 'p_fe_plus', name: 'Realidade Partida Infinita', rank: 'FE+', minLevel: 100, baseHp: 18000000, dmg: 350000, xp: 8000000, gold: 15000000, crystals: 250000, secretChance: 0.55 },
  { id: 'p_m', name: 'Eco Astral do Abismo', rank: 'M', minLevel: 125, baseHp: 65000000, dmg: 1000000, xp: 30000000, gold: 50000000, crystals: 1000000, secretChance: 0.60 },
  { id: 'p_m_plus', name: 'Gênese Sombria Estelar', rank: 'M+', minLevel: 150, baseHp: 200000000, dmg: 3000000, xp: 100000000, gold: 200000000, crystals: 5000000, secretChance: 0.65 },
  { id: 'p_deus', name: 'Trono do Cosmos Infinito', rank: 'Deus', minLevel: 200, baseHp: 800000000, dmg: 10000000, xp: 500000000, gold: 1000000000, crystals: 25000000, secretChance: 0.75 }
];

export const SHOP_DB: Record<string, ShopItem[]> = {
  equip: [
    { id: 'eq_e', name: 'Adaga de Ferro', rank: 'E', cost: 200, stat: 'str', val: 5 },
    { id: 'eq_c', name: 'Garra de Kasaka', rank: 'C', cost: 4000, stat: 'str', val: 40 },
    { id: 'eq_a', name: 'Adaga Matadora de Dragões', rank: 'A', cost: 50000, stat: 'str', val: 250 },
    { id: 'eq_sss', name: 'Espada do Deus Criador da Fenda', rank: 'SSS', cost: 3000000, stat: 'str', val: 6000 },
    { id: 'eq_n', name: 'Lâmina de Singularidade', rank: 'N', cost: 15000000, stat: 'str', val: 18000 },
    { id: 'eq_fe', name: 'Manopla da Força Fraca', rank: 'FE', cost: 150000000, stat: 'str', val: 80000 },
    { id: 'eq_m', name: 'Foice do Destino Tecido', rank: 'M', cost: 2000000000, stat: 'str', val: 400000 },
    { id: 'eq_deus', name: 'Lança da Aniquilação Divina', rank: 'Deus', cost: 50000000000, stat: 'str', val: 2000000 }
  ],
  accessory: [
    { id: 'ac_e', name: 'Anel do Caçador', rank: 'E', cost: 150, stat: 'agi', val: 3 },
    { id: 'ac_b', name: 'Anel de Mana Reforçada', rank: 'B', cost: 12000, stat: 'int', val: 50 },
    { id: 'ac_ss', name: 'Gema Estelar da Fenda', rank: 'SS', cost: 750000, stat: 'int', val: 1100 },
    { id: 'ac_n', name: 'Manto Nebuloso', rank: 'N', cost: 12000000, stat: 'vit', val: 15000 },
    { id: 'ac_fe', name: 'Cetro do Paradoxo', rank: 'FE', cost: 120000000, stat: 'int', val: 75000 },
    { id: 'ac_m', name: 'Armadura de Égide Estelar', rank: 'M', cost: 1500000000, stat: 'vit', val: 350000 },
    { id: 'ac_deus', name: 'Manto da Constelação Eterna', rank: 'Deus', cost: 40000000000, stat: 'vit', val: 1800000 }
  ],
  consumable: [
    { id: 'p_hp_standard', name: 'Poção de HP Completa', rank: 'E', cost: 50, type: 'hp_fill', desc: 'Restaura 100% do HP Máximo instantaneamente.' },
    { id: 'p_mp_standard', name: 'Poção de MP Completa', rank: 'E', cost: 50, type: 'mp_fill', desc: 'Restaura 100% de Mana instantaneamente.' },
    { id: 'p_core_quasar', name: 'Core de Quasar', rank: 'N+', cost: 5000000, type: 'stat_boost', desc: 'Consumível que sobrecarrega as células permanentemente. (Venda ou persistência)' }
  ],
  skill: [
    { id: 'sk_e', name: 'Ataque Duplo Rápido', rank: 'E', cost: 300, mpCost: 10, dmgMult: 1.5, desc: 'Dois golpes rápidos baseados em agilidade.' },
    { id: 'sk_a', name: 'Fúria do Caçador', rank: 'A', cost: 75000, mpCost: 150, dmgMult: 7.5, desc: 'Aumenta imensamente sua fúria combativa.' },
    { id: 'sk_sss', name: 'Autoridade do Monarca', rank: 'SSS', cost: 4000000, mpCost: 1200, dmgMult: 45.0, desc: 'Aniquilação sônica através das sombras finais.' },
    { id: 'sk_n', name: 'Dobrar o Espaço', rank: 'N', cost: 20000000, mpCost: 5000, dmgMult: 120.0, desc: 'Ignora armadura temporalmente quebrando barreiras.' },
    { id: 'sk_fe', name: 'Colapso Atômico', rank: 'FE', cost: 300000000, mpCost: 25000, dmgMult: 450.0, desc: 'Causa desintegração total em escala subatômica.' },
    { id: 'sk_m', name: 'Chuva de Meteoros Negros', rank: 'M', cost: 4000000000, mpCost: 150000, dmgMult: 2000.0, desc: 'Invocações massivas de dejetos cósmicos e fogo celestial.' },
    { id: 'sk_deus', name: 'Deleção Universal', rank: 'Deus', cost: 100000000000, mpCost: 1000000, dmgMult: 10000.0, desc: 'Apaga inteiramente o código-fonte da existência do alvo.' }
  ]
};

export const MONSTER_NAMES: Record<string, string[]> = {
  'E': ['Zumbi Rank E'],
  'D': ['Mago Duende', 'Lobo de Presas Azuis', 'Gargula das Runas'],
  'C': ['Cão Infernal', 'Golem Silencioso', 'Guerreiro de Pedra'],
  'B': ['Elfo Sombrio Assassino', 'Xamã de Fogo', 'Gárgula Gigante'],
  'A': ['Guerreiro Orc Vermelho', 'Feiticeiro das Cinzas', 'Cavalheiro Sem Cabeça'],
  'S': ['Cérbero do Abismo', 'Gigante de Gelo', 'General Demônio'],
  'SS': ['Lorde Demônio Baran', 'Aranha Gigante das Sombras'],
  'SSS': ['Sombra do Monarca Antigo', 'Dragão Kamish'],
  'N': ['Gárgula de Antimatéria', 'Devorador de Éter'],
  'N+': ['Colosso de Gravidade', 'Serpente Solar'],
  'FE': ['Espectro da Radiação', 'Titã de Matéria Escura'],
  'FE+': ['Quimera Entrópica', 'Anjo do Caos Vetorial'],
  'M': ['Leviatã de Asteroide', 'Sentinela de Cronos'],
  'M+': ['Dragão de Nebulosa', 'Devorador de Galáxias'],
  'Deus': ['Divindade Caída', 'Eco do Criador Original', 'Verme do Tempo Cósmico', 'Monarca do Abismo Original']
};

export const UPGRADES_DB = [
  { id: 'dropChance', name: 'Lente de Caos (Drop)', desc: 'Expande radicalmente a chance de itens raros.', baseCost: 150, mult: 2.2, format: (lvl: number) => `Chance: +${(lvl * 5)}%` },
  { id: 'autoclickSpeed', name: 'Frequência de Assalto', desc: 'Acelera a conexão neural. Treinos e ataques automáticos mais rápidos.', baseCost: 200, mult: 2.5, format: (lvl: number) => `Inércia: ${Math.max(30, Math.floor(1000 * Math.pow(0.80, lvl)))}ms` },
  { id: 'goldBonus', name: 'Alquimia Dourada', desc: 'Sintetiza Ouro a partir dos resquícios das fendas.', baseCost: 100, mult: 2.0, format: (lvl: number) => `Ouro: +${(lvl * 20)}%` },
  { id: 'crystalBonus', name: 'Absorção de Éter', desc: 'Multiplica a obtenção de Cristais em portais.', baseCost: 100, mult: 2.1, format: (lvl: number) => `Cristais: +${(lvl * 20)}%` },
  { id: 'dailyReforco', name: 'Hipertrofia Dimensional', desc: 'Eleva absurdamente os ganhos das missões diárias.', baseCost: 120, mult: 2.3, format: (lvl: number) => `Diária: +${(lvl * 50)}%` }
];
