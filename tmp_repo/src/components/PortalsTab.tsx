import React, { useRef, useEffect, useState } from "react";
import { Player, Portal, ActiveCombat, CombatLogEntry } from "../types";
import { PORTALS_DB, RANK_COLORS, CLASSES_DATA } from "../data";
import { Swords, Skull, Crosshair, ShieldAlert } from "lucide-react";

// HIGH-FIDELITY SPRITE DATABASE USING DATA-URI COMPATIBLE RETRO SCALED SVGs
// The user can easily replace these string values with standard PNG paths like "./monsters/rank_e.png"
export const SPRITE_DB: Record<string, string> = {
  'E': `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" shape-rendering="crispEdges"><rect width="32" height="32" fill="none"/><ellipse cx="16" cy="27" rx="10" ry="3.5" fill="rgba(0,0,0,0.5)"/><path d="M10 24h12 M8 22h16 M6 20h20 M6 18h20 M6 16h20 M8 14h16 M10 12h12" stroke="%2300f0ff" stroke-width="2"/><circle cx="12" cy="14" r="1.5" fill="%23ffffff"/><circle cx="20" cy="14" r="1.5" fill="%23ffffff"/><circle cx="12.5" cy="14.5" r="0.7" fill="%23000000"/><circle cx="20.5" cy="14.5" r="0.7" fill="%23000000"/><path d="M14 18h4" stroke="%23ffffff" stroke-width="1.2"/></svg>`,

  'D': `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" shape-rendering="crispEdges"><rect width="32" height="32" fill="none"/><ellipse cx="16" cy="27" rx="11" ry="4" fill="rgba(0,0,0,0.6)"/><path d="M8 24h16 M6 22h20 M5 20h22 M4 18h24 M4 16h24 M5 14h22 M6 12h20 M8 10h16" stroke="%2322c55e" stroke-width="2"/><path d="M11 12h3M18 12h3" stroke="%23facc15" stroke-width="2"/><circle cx="12.5" cy="13" r="1" fill="%23ef4444"/><circle cx="19.5" cy="13" r="1" fill="%23ef4444"/><path d="M12 18h8 M13 19h6" stroke="%2314532d" stroke-width="1.5"/></svg>`,

  'C': `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" shape-rendering="crispEdges"><rect width="32" height="32" fill="none"/><ellipse cx="16" cy="27" rx="12" ry="4.5" fill="rgba(0,0,0,0.65)"/><path d="M6 24h20 M4 22h24 M4 20h24 M4 18h24 M4 16h24 M4 14h24 M6 12h20 M8 10h16" stroke="%2364748b" stroke-width="2.5"/><path d="M12 17h8 M11 15h10 M12 13h8" stroke="%233b82f6" stroke-width="1.5"/><circle cx="11.5" cy="11.5" r="1.5" fill="%2338bdf8"/><circle cx="20.5" cy="11.5" r="1.5" fill="%2338bdf8"/></svg>`,

  'B': `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" shape-rendering="crispEdges"><rect width="32" height="32" fill="none"/><ellipse cx="16" cy="28" rx="11" ry="3.5" fill="rgba(0,0,0,0.7)"/><path d="M10 25h12 M8 23h16 M6 21h20 M6 19h20 M6 17h20 M8 15h16 M10 13h12 M12 11h8" stroke="%23a855f7" stroke-width="2"/><circle cx="12" cy="14" r="1.5" fill="%2322d3ee"/><circle cx="20" cy="14" r="1.5" fill="%2322d3ee"/><path d="M3 13l5 5 M29 13l-5 5" stroke="%2306b6d4" stroke-width="2.5"/></svg>`,

  'A': `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2500/svg" viewBox="0 0 32 32" shape-rendering="crispEdges"><rect width="32" height="32" fill="none"/><ellipse cx="16" cy="28" rx="12" ry="4" fill="rgba(0,0,0,0.75)"/><path d="M8 25h16 M6 23h20 M4 21h24 M4 19h24 M4 17h24 M4 15h24 M6 13h20 M8 11h16 M10 9h12" stroke="%23dc2626" stroke-width="2"/><circle cx="11" cy="13" r="2" fill="%23eab308"/><circle cx="21" cy="13" r="2" fill="%23eab308"/><path d="M2 19l4-4 M30 19l-4-4" stroke="%23fbbf24" stroke-width="3"/></svg>`,

  'S': `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" shape-rendering="crispEdges"><rect width="32" height="32" fill="none"/><ellipse cx="16" cy="28" rx="13" ry="4" fill="rgba(0,0,0,0.8)"/><path d="M8 26h16 M6 24h20 M4 22h24 M4 20h24 M4 18h24 M4 16h24 M6 14h20 M8 12h16 M10 10h12" stroke="%232563eb" stroke-width="2.5"/><circle cx="12" cy="14" r="2.5" fill="%2306b6d4"/><circle cx="20" cy="14" r="2.5" fill="%2306b6d4"/><path d="M12 6l2 4M20 6l-2 4" stroke="%2338bdf8" stroke-width="2"/></svg>`,

  'SS': `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" shape-rendering="crispEdges"><rect width="32" height="32" fill="none"/><ellipse cx="16" cy="28" rx="12" ry="4" fill="rgba(0,0,0,0.85)"/><path d="M8 26h16 M6 24h20 M4 22h24 M4 20h24 M4 18h24 M4 16h24 M6 14h20 M8 12h16 M10 10h12" stroke="%236d28d9" stroke-width="2.5"/><circle cx="11.5" cy="14.5" r="2" fill="%23ec4899"/><circle cx="20.5" cy="14.5" r="2" fill="%23ec4899"/><path d="M14 6l1 5M18 6l-1 5" stroke="%23a855f7" stroke-width="2"/><path d="M5 13L2 19 M27 13l3 6" stroke="%23c084fc" stroke-width="2"/></svg>`,

  'SSS': `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" shape-rendering="crispEdges"><rect width="32" height="32" fill="none"/><ellipse cx="16" cy="28" rx="14" ry="5" fill="rgba(0,0,0,0.9)"/><path d="M12 26h8 M10 24h12 M8 22h16 M6 20h20 M4 18h24 M2 16h28 M4 14h24 M6 12h20 M8 10h16 M10 8h12" stroke="%231e1b4b" stroke-width="2.5"/><path d="M12 17h8" stroke="%23ec4899" stroke-width="3"/><circle cx="11.5" cy="13.5" r="2.5" fill="%23f43f5e"/><circle cx="20.5" cy="13.5" r="2.5" fill="%23f43f5e"/><path d="M4 7l4 7M28 7l-4 7" stroke="%23ec4899" stroke-width="2.5"/></svg>`,

  'N': `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" shape-rendering="crispEdges"><rect width="32" height="32" fill="none"/><circle cx="16" cy="16" r="10" fill="%230f172a" stroke="%2306b6d2" stroke-width="3"/><circle cx="16" cy="16" r="6" fill="%2306b6d2" stroke="%23ffffff" stroke-width="1.5"/><circle cx="16" cy="16" r="2" fill="%23ffffff"/></svg>`,

  'N+': `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" shape-rendering="crispEdges"><rect width="32" height="32" fill="none"/><circle cx="16" cy="16" r="12" fill="%230f172a" stroke="%2306b6d2" stroke-width="4"/><circle cx="16" cy="16" r="8" fill="%230891b2" stroke="%2322d3ee" stroke-width="2.5"/><line x1="2" y1="16" x2="30" y2="16" stroke="%2322d3ee" stroke-width="3"/></svg>`,

  'FE': `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" shape-rendering="crispEdges"><rect width="32" height="32" fill="none"/><rect x="6" y="6" width="20" height="20" fill="%231e293b" stroke="%23ea580c" stroke-width="3"/><rect x="10" y="10" width="12" height="12" fill="%23ea580c" stroke="%23ffedd5" stroke-width="2.5"/><line x1="2" y1="2" x2="30" y2="30" stroke="%23ea580c" stroke-width="1.5"/></svg>`,

  'FE+': `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" shape-rendering="crispEdges"><rect width="32" height="32" fill="none"/><rect x="4" y="4" width="24" height="24" fill="%230f172a" stroke="%23ea580c" stroke-width="4"/><rect x="9" y="9" width="14" height="14" fill="%23ea580c" stroke="%23f97316" stroke-width="2.5"/><line x1="2" y1="30" x2="30" y2="2" stroke="%23ea580c" stroke-width="2"/></svg>`,

  'M': `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" shape-rendering="crispEdges"><rect width="32" height="32" fill="none"/><circle cx="16" cy="16" r="13" fill="%23020617" stroke="%23f43f5e" stroke-width="2.5" stroke-dasharray="4 2"/><circle cx="16" cy="16" r="8" fill="%23f43f5e"/><circle cx="16" cy="16" r="3" fill="%23ffffff"/></svg>`,

  'M+': `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" shape-rendering="crispEdges"><rect width="32" height="32" fill="none"/><circle cx="16" cy="16" r="14" fill="%23020617" stroke="%23f43f5e" stroke-width="4"/><circle cx="16" cy="16" r="9" fill="%23fda4af" stroke="%23ffffff" stroke-width="2.5"/></svg>`,

  'Deus': `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" shape-rendering="crispEdges"><rect width="32" height="32" fill="none"/><polygon points="16,2 30,16 16,30 2,16" fill="%2378350f" stroke="%23fbbf24" stroke-width="4"/><circle cx="16" cy="16" r="6" fill="%23fef08a" stroke="%23ffffff" stroke-width="2"/><line x1="16" y1="2" x2="16" y2="30" stroke="%23fbbf24" stroke-width="2.5"/><line x1="2" y1="16" x2="30" y2="16" stroke="%23fbbf24" stroke-width="2.5"/></svg>`
};

// MULTI-SCALE DYNAMIC HEIGHT FOR CLASSIFIED DUNGEONS
export const SPRITE_SIZES: Record<string, string> = {
  'E': 'w-24 h-24 lg:w-28 lg:h-28',
  'D': 'w-28 h-28 lg:w-32 lg:h-32',
  'C': 'w-32 h-32 lg:w-36 lg:h-36',
  'B': 'w-36 h-36 lg:w-40 lg:h-40',
  'A': 'w-40 h-40 lg:w-44 lg:h-44',
  'S': 'w-44 h-44 lg:w-48 lg:h-48',
  'SS': 'w-48 h-48 lg:w-52 lg:h-52',
  'SSS': 'w-52 h-52 lg:w-56 lg:h-56',
  'N': 'w-56 h-56 lg:w-60 lg:h-60',
  'N+': 'w-60 h-60 lg:w-64 lg:h-64',
  'FE': 'w-64 h-64 lg:w-68 lg:h-68',
  'FE+': 'w-68 h-68 lg:w-72 lg:h-72',
  'M': 'w-72 h-72 lg:w-80 lg:h-80',
  'M+': 'w-80 h-80 lg:w-96 lg:h-96',
  'Deus': 'w-96 h-96'
};

// HIGH-FIDELITY MAIN PLAYER & SHADOW JINN SPRITES
export const PLAYER_SPRITE = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" shape-rendering="crispEdges"><rect width="32" height="32" fill="none"/><ellipse cx="16" cy="27" rx="9" ry="3" fill="rgba(0,0,0,0.6)"/><path d="M12 25h8 M10 23h12 M8 21h16 M8 19h16 M8 17h16 M10 15h12 M11 13h10 M12 11h8 M13 9h6" stroke="%230f172a" stroke-width="2"/><circle cx="12" cy="12" r="1.5" fill="%2300f0ff"/><circle cx="20" cy="12" r="1.5" fill="%2300f0ff"/><path d="M4 21l6-4 M28 21l-6-4" stroke="%2300f0ff" stroke-width="2.5"/><path d="M13 14h6" stroke="%233b82f6" stroke-width="1.2"/></svg>`;

export const SHADOW_SUMMON_SPRITE = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" shape-rendering="crispEdges"><rect width="32" height="32" fill="none"/><ellipse cx="16" cy="27" rx="8" ry="2.5" fill="rgba(88,28,135,0.5)"/><path d="M13 24h6 M11 22h10 M10 20h12 M9 18h14 M10 16h12 M11 14h10 M12 12h8" stroke="%234c1d95" stroke-width="2"/><circle cx="12.5" cy="15" r="1" fill="%239b5de5"/><circle cx="19.5" cy="15" r="1" fill="%239b5de5"/><path d="M16 7l1 4M15 9h2" stroke="%23a855f7" stroke-width="1.2"/></svg>`;

interface PortalsTabProps {
  player: Player;
  activeCombat: ActiveCombat | null;
  combatLogs: CombatLogEntry[];
  onStartRaid: (portal: Portal) => void;
  onEscape: () => void;
  onExecuteAttack: () => void;
  getDmg: () => number;
  getCritChance: () => number;
  getSkillPower: () => number;
  getPlayerRank: () => string;
  compareRanks: (r1: string, r2: string) => boolean;
}

export function PortalsTab({
  player,
  activeCombat,
  combatLogs,
  onStartRaid,
  onEscape,
  onExecuteAttack,
  getDmg,
  getCritChance,
  getSkillPower,
  getPlayerRank,
  compareRanks,
}: PortalsTabProps) {
  const fN = (num: number) => Math.floor(num).toLocaleString("pt-BR");
  const attackIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const onExecuteAttackRef = useRef(onExecuteAttack);

  const [isHurt, setIsHurt] = useState(false);
  const [isHitting, setIsHitting] = useState(false);

  // Micro-HUD visual strike state linking keyframe motions
  const [isPlayerStriking, setIsPlayerStriking] = useState(false);
  const [isMonsterStriking, setIsMonsterStriking] = useState(false);
  const [isMonsterHit, setIsMonsterHit] = useState(false);

  useEffect(() => {
    onExecuteAttackRef.current = onExecuteAttack;
  }, [onExecuteAttack]);

  // Floating damage number particle states
  interface DamageParticle {
    id: string;
    text: string;
    type: 'player' | 'monster' | 'crit' | 'skill';
    x: number;
    y: number;
  }
  const [particles, setParticles] = useState<DamageParticle[]>([]);

  useEffect(() => {
    if (!combatLogs || combatLogs.length === 0) {
      setParticles([]);
      return;
    }
    const latest = combatLogs[0];
    if (latest.damage === undefined) return;

    // Trigger visual hit and shake effects on new combat logs
    if (latest.type === "monster_hit") {
      setIsHurt(true);
      setIsMonsterStriking(true);
      const t1 = setTimeout(() => setIsHurt(false), 280);
      const t2 = setTimeout(() => setIsMonsterStriking(false), 320);
    } else if (latest.type.startsWith("player_")) {
      setIsHitting(true);
      setIsPlayerStriking(true);
      setIsMonsterHit(true);
      const t1 = setTimeout(() => setIsHitting(false), 180);
      const t2 = setTimeout(() => setIsPlayerStriking(false), 320);
      const t3 = setTimeout(() => setIsMonsterHit(false), 420);
    }

    const id = latest.id;
    const isMonsterCurrent = latest.type === 'monster_hit';
    let text = "";
    let type: DamageParticle['type'] = 'player';
    
    if (isMonsterCurrent) {
      text = `-${latest.damage.toLocaleString("pt-BR")}`;
      type = 'monster';
    } else {
      text = latest.type === 'player_crit' ? `💥 ${latest.damage.toLocaleString("pt-BR")}` : `-${latest.damage.toLocaleString("pt-BR")}`;
      type = latest.type === 'player_crit' ? 'crit' : (latest.type === 'player_skill' ? 'skill' : 'player');
    }

    const newParticle: DamageParticle = {
      id,
      text,
      type,
      x: Math.floor(Math.random() * 30) + (isMonsterCurrent ? 25 : 55), // center on target
      y: Math.floor(Math.random() * 20) + 15, // float-up upper-third
    };

    setParticles(prev => [...prev, newParticle].slice(-8));

    const timer = setTimeout(() => {
      setParticles(prev => prev.filter(p => p.id !== id));
    }, 1200);

    return () => clearTimeout(timer);
  }, [combatLogs]);

  const autoclickMs = Math.max(
    30,
    Math.floor(1000 * Math.pow(0.8, player.upgrades.autoclickSpeed))
  );

  const startAssault = () => {
    if (attackIntervalRef.current) return;
    onExecuteAttackRef.current();
    attackIntervalRef.current = setInterval(() => {
      onExecuteAttackRef.current();
    }, autoclickMs);
  };

  const stopAssault = () => {
    if (attackIntervalRef.current) {
      clearInterval(attackIntervalRef.current);
      attackIntervalRef.current = null;
    }
  };

  useEffect(() => {
    if (!activeCombat && attackIntervalRef.current) {
      clearInterval(attackIntervalRef.current);
      attackIntervalRef.current = null;
    }
  }, [activeCombat]);

  useEffect(() => {
    return () => {
      if (attackIntervalRef.current) {
        clearInterval(attackIntervalRef.current);
      }
    };
  }, []);

  // Custom Pixel Progress Bar for combat screen
  const renderMonsterHpSegments = (current: number, max: number, totalSegments = 16) => {
    const ratio = max > 0 ? current / max : 0;
    const activeSegments = Math.round(ratio * totalSegments);
    const lowHp = ratio < 0.25;

    return (
      <div className={`flex gap-[3px] w-full ${lowHp ? 'animate-pulse' : ''}`} style={{ imageRendering: "pixelated" }}>
        {Array.from({ length: totalSegments }).map((_, i) => (
          <div
            key={i}
            className={`h-4 flex-1 border-2 border-black ${
              i < activeSegments ? (lowHp ? "bg-rose-600" : "bg-red-650") : "bg-slate-950"
            }`}
            style={{
              backgroundColor: i < activeSegments ? (lowHp ? "#f43f5e" : "#dc2626") : undefined,
              boxShadow: "inset -2px -2px 0px 0px rgba(0,0,0,0.5)"
            }}
          />
        ))}
      </div>
    );
  };

  // Determine if the player class has active summon capabilities to render shadow minions
  const activeClass = player.class ? CLASSES_DATA[player.class] : CLASSES_DATA['Soldado'];
  const isShadowSummoner = activeClass?.summoner || false;

  return (
    <div id="tab-portais" className="flex flex-col gap-4 font-pixel-mono text-lg">
      <div className="flex justify-between items-center border-b-4 border-double border-slate-700 pb-3">
        <div>
          <h3 className="text-sm font-pixel-heading text-red-400 tracking-widest uppercase">
            Mapeamento de Fendas Dimensionais
          </h3>
          <p className="text-xs text-slate-400 mt-1 text-base font-pixel-mono">
            Desafie desde invasores básicos até anomalias celestes. O risco aumenta progressivamente.
          </p>
        </div>
        <div>
          <div className="bg-slate-950 border-2 border-red-900/60 px-3 py-1 text-xs shadow-inner uppercase tracking-wider text-red-400 font-pixel-heading">
            RANK: {getPlayerRank()}
          </div>
        </div>
      </div>

      {/* COMBATE ATIVO */}
      {activeCombat ? (
        <div
          id="combat-screen"
          className={`bg-black border-4 border-double p-5 flex flex-col gap-5 transition duration-150 rounded-none relative overflow-hidden ${
            isHurt 
              ? "border-red-600 animate-pixel-shake animate-flash-red" 
              : isHitting 
              ? "border-amber-500 bg-[#0d0d04]" 
              : "border-red-900/60"
          }`}
          style={{ boxShadow: "4px 4px 0px 0px #450a0a" }}
        >
          {/* Main Top Header Controls */}
          <div className="flex justify-between items-center border-b-2 border-red-950 pb-2">
            <span className="text-[10px] bg-red-950 text-red-500 border border-red-800/80 px-2 py-1 font-pixel-heading tracking-widest flex items-center gap-2 animate-pulse rounded-none">
              <Swords className="w-3 h-3 text-red-400" /> Batalha Ativa
            </span>
            <button
              onClick={() => {
                stopAssault();
                onEscape();
              }}
              className="bg-slate-950 text-slate-350 hover:bg-red-950 hover:text-white border-2 border-slate-800 text-[9px] px-3 py-1 font-pixel-heading tracking-wider rounded-none select-none"
            >
              Fugir
            </button>
          </div>

          {/* 1. RETRO 16-BIT CLASSIC JRPG BATTLE STAGE */}
          <div 
            className="w-full h-64 sm:h-80 bg-[#020205] border-4 border-slate-800 relative overflow-hidden flex items-end justify-between p-4 px-6 sm:px-12 select-none"
            style={{
              backgroundImage: `
                linear-gradient(to bottom, rgba(3, 3, 5, 0.96), rgba(11, 12, 16, 0.5)),
                radial-gradient(circle at bottom, rgba(139, 92, 246, 0.16) 0%, transparent 80%),
                repeating-linear-gradient(45deg, rgba(0, 240, 255, 0.02) 0px, rgba(0, 240, 255, 0.02) 2px, transparent 2px, transparent 10px),
                repeating-linear-gradient(-45deg, rgba(0, 240, 255, 0.02) 0px, rgba(0, 240, 255, 0.02) 2px, transparent 2px, transparent 10px)
              `,
              boxShadow: "inset 0px 0px 24px rgba(0, 240, 255, 0.15), 4px 4px 0px #000000"
            }}
          >
            {/* Holographic dungeon stage floor grid */}
            <div 
              className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#0b0c10] to-[#040407] border-t-2 border-slate-800/60 z-0 opacity-80"
              style={{
                backgroundImage: "repeating-linear-gradient(90deg, transparent, transparent 19px, rgba(0, 240, 255, 0.04) 19px, rgba(0, 240, 255, 0.04) 20px)"
              }}
            />

            {/* Split Screen VS overlay */}
            <div className="absolute inset-x-0 bottom-28 flex justify-center items-center pointer-events-none opacity-20 select-none z-0">
              <span className="text-3xl font-pixel-heading text-[#9b5de5] animate-pulse">VS</span>
            </div>

            {/* A. LEFT SIDE: CAVALIER HUNTER & ACTIVE SHADOW SUMMON ARMY */}
            <div className="flex flex-col items-center gap-1.5 z-10 select-none bottom-2 relative">
              <div className="flex items-end gap-1.5">
                {/* Active Summons flanking if class is summoner */}
                {isShadowSummoner && (
                  <div className="flex gap-1 items-end opacity-90 animate-pixel-idle" style={{ animationDelay: "0.2s" }}>
                    <img 
                      src={SHADOW_SUMMON_SPRITE} 
                      alt="Shadow Soldier Minion" 
                      className="w-10 h-10 lg:w-12 lg:h-12 drop-shadow-[0_0_8px_rgba(155,93,229,0.7)]"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                )}

                {/* Hunter Hero Character */}
                <div 
                  className={`relative flex flex-col items-center transition-all ${
                    isPlayerStriking ? "animate-player-strike" : "animate-pixel-idle"
                  }`}
                >
                  <img 
                    src={PLAYER_SPRITE} 
                    alt="Monarca Hunter Jinwoo"
                    className="w-16 h-16 sm:w-20 sm:h-20 drop-shadow-[0_0_12px_rgba(0,240,255,0.7)]"
                    referrerPolicy="no-referrer"
                  />
                </div>

                {/* Flanking secondary summon */}
                {isShadowSummoner && (
                  <div className="flex gap-1 items-end opacity-90 animate-pixel-idle" style={{ animationDelay: "0.6s" }}>
                    <img 
                      src={SHADOW_SUMMON_SPRITE} 
                      alt="General Shadow Jinn" 
                      className="w-10 h-10 lg:w-12 lg:h-12 scale-x-[-1] drop-shadow-[0_0_8px_rgba(155,93,229,0.7)]"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                )}
              </div>

              {/* Hunter indicators */}
              <div className="bg-black/80 border-2 border-cyan-500/80 px-2 py-0.5 text-[8px] font-pixel-heading text-cyan-300 shadow-[2px_2px_0px_rgba(0,0,0,0.8)] tracking-tight">
                SYS_CAÇADOR
              </div>
            </div>

            {/* B. RIGHT SIDE: THE ENEMY MONSTER SPRITE */}
            <div className="flex flex-col items-center gap-2 z-10 select-none bottom-3 relative">
              <div 
                className={`relative flex flex-col items-center ${
                  activeCombat.hp <= 0 
                  ? "animate-pixel-dissolve" 
                  : isMonsterHit 
                  ? "animate-pixel-monster-hit" 
                  : isMonsterStriking 
                  ? "animate-monster-strike" 
                  : "animate-pixel-idle"
                }`}
              >
                {/* Sprites from database with id tag as mandatory system configuration */}
                <img 
                  id="monster-sprite"
                  src={SPRITE_DB[activeCombat.monsterRank] || SPRITE_DB['E']} 
                  alt={activeCombat.name}
                  className={`${SPRITE_SIZES[activeCombat.monsterRank] || 'w-24 h-24'} object-contain drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]`}
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Boss indicator */}
              <div className="bg-black/95 border-2 border-red-500/80 px-2.5 py-0.5 text-[8px] font-pixel-heading text-red-400 shadow-[2px_2px_0px_rgba(0,0,0,0.8)] tracking-tight uppercase">
                BOSS: {activeCombat.monsterRank}
              </div>
            </div>

            {/* C. PARTICLES CANVAS OVERLAY */}
            <div className="absolute inset-0 z-30 pointer-events-none">
              {particles.map(p => (
                <span
                  key={p.id}
                  className="absolute pointer-events-none font-pixel-mono select-none z-50 animate-float-up"
                  style={{
                    left: `${p.x}%`,
                    top: `${p.y}%`,
                  }}
                >
                  {p.type === 'crit' ? (
                    <span className="text-yellow-400 font-extrabold text-3xl sm:text-4xl drop-shadow-[0_3px_6px_rgba(0,0,0,1)] tracking-wide animate-pulse">
                      {p.text}
                    </span>
                  ) : p.type === 'skill' ? (
                    <span className="text-purple-400 font-black text-2xl sm:text-3xl drop-shadow-[0_3px_6px_rgba(168,85,247,0.9)]">
                      {p.text}
                    </span>
                  ) : p.type === 'monster' ? (
                    <span className="text-red-500 font-bold text-2xl sm:text-3xl drop-shadow-[0_3px_6px_rgba(0,0,0,1)]">
                      {p.text}
                    </span>
                  ) : (
                    <span className="text-cyan-400 font-bold text-xl sm:text-2xl drop-shadow-[0_3px_5px_rgba(0,0,0,0.9)]">
                      {p.text}
                    </span>
                  )}
                </span>
              ))}
            </div>
          </div>

          {/* 2. LOWER COMPACT TACTICAL DASHBOARD GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 my-1">
            {/* Target Status Panel */}
            <div className="bg-[#020205] p-5 border-2 border-slate-850 flex flex-col gap-4 relative shadow-[2px_2px_0px_#000000] overflow-hidden min-h-[180px]">
              <div className="flex justify-between items-start z-10">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span
                      className={`px-2 py-0.5 text-[8px] text-white font-pixel-heading rounded-none border ${
                        RANK_COLORS[activeCombat.monsterRank] || "border-slate-700 bg-slate-800"
                      }`}
                    >
                      {activeCombat.monsterRank}
                    </span>
                    {activeCombat.isSecret && (
                      <span className="px-2 py-0.5 bg-fuchsia-950 border border-fuchsia-600 text-[8px] text-fuchsia-200 font-pixel-heading rounded-none animate-pulse">
                        ANOMALIA
                      </span>
                    )}
                  </div>
                  <h4 className="text-xl font-bold tracking-wide text-white font-pixel-mono leading-none">
                    {activeCombat.name}
                  </h4>
                </div>
                <div className="bg-slate-950 p-2 border-2 border-slate-850">
                  <Skull className="text-red-500 w-5 h-5 animate-bounce" style={{ animationDuration: "3s" }} />
                </div>
              </div>

              <div className="flex flex-col gap-1.5 mt-auto z-10">
                <div className="flex justify-between text-xs font-pixel-mono">
                  <span className="text-slate-450 font-bold">VITALIDADE_NÍVEL:</span>
                  <span className="text-slate-200 font-bold">
                    {fN(activeCombat.hp)} / {fN(activeCombat.hpMax)}
                  </span>
                </div>
                {renderMonsterHpSegments(activeCombat.hp, activeCombat.hpMax)}
              </div>
            </div>

            {/* Hunter Attack stats & hold active attack control */}
            <div className="bg-[#020205] p-5 border-2 border-slate-850 flex flex-col justify-between shadow-[2px_2px_0px_#000000] relative overflow-hidden min-h-[180px]">
              <div className="z-10">
                <div className="flex justify-between items-center border-b border-slate-900 pb-2 mb-3">
                  <span className="text-[9px] font-pixel-heading text-cyan-400 uppercase tracking-widest">
                    Previsão de Danos // ESTIMATIVA
                  </span>
                </div>
                <div className="text-sm font-pixel-mono flex flex-col gap-2">
                  <div className="flex justify-between bg-slate-950/90 p-2 rounded-none border border-slate-900 text-sm">
                    <span className="text-slate-400">Poder de Ataque:</span>
                    <span className="text-yellow-400 font-bold">
                      {fN(getDmg())} ({getCritChance()}% Crit)
                    </span>
                  </div>
                  <div className="flex justify-between bg-slate-950/90 p-2 rounded-none border border-slate-900 text-sm">
                    <span className="text-slate-400">Fórmula Ativa:</span>
                    <span className="text-purple-400 font-bold truncate max-w-[150px] text-right">
                      {player.equipped.skill ? "Técnica Carregada" : "Ataque Base"}
                    </span>
                  </div>
                </div>
              </div>

              {/* CONTINOUS ACTION INTERACTION BUTTON */}
              <button
                onMouseDown={(e) => {
                  if (e.button === 0) startAssault();
                }}
                onMouseUp={stopAssault}
                onMouseLeave={stopAssault}
                onTouchStart={(e) => {
                  e.preventDefault();
                  startAssault();
                }}
                onTouchEnd={stopAssault}
                className="w-full py-3 mt-4 bg-purple-950 hover:bg-purple-900 border-2 border-purple-500 text-white font-pixel-heading text-[9px] tracking-widest rounded-none shadow-[2px_2px_0px_0px_#1e1b4b] select-none flex items-center justify-center gap-2 z-10 cursor-pointer active:translate-y-0.5 active:shadow-[1px_1px_0px_0px_#1e1b4b]"
              >
                <Crosshair className="w-4 h-4 animate-pulse" /> SEGURE M1 (ATACAR)
              </button>
            </div>

            {/* Real-time battle activity log */}
            <div className="bg-[#020205] rounded-none border-2 border-slate-850 p-4 flex flex-col h-[230px] lg:h-auto shadow-[2px_2px_0px_#000000] overflow-hidden">
              <div className="flex items-center justify-between border-b border-slate-900 pb-2 mb-2">
                <span className="text-[9px] font-pixel-heading text-red-400 uppercase tracking-widest flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-red-600 animate-ping" /> Registro de combate
                </span>
                <span className="text-[8px] font-pixel-heading text-slate-500">SYS_STREAM</span>
              </div>
              
              <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-1.5 max-h-[160px] lg:max-h-[180px] scrollbar-thin font-pixel-mono text-base">
                {combatLogs.length === 0 ? (
                  <div className="text-slate-600 text-sm font-pixel-mono text-center my-auto">
                    Inicie o ataque neural...
                  </div>
                ) : (
                  combatLogs.map((log) => {
                    let logBg = "bg-slate-950 text-slate-350 border-slate-900";
                    let textAccent = "text-slate-350";
                    let badge = "";
                    
                    if (log.type === "player_hit") {
                      logBg = "bg-slate-950 text-slate-300 border-slate-900";
                      textAccent = "text-cyan-400 font-medium";
                      badge = "FIS";
                    } else if (log.type === "player_crit") {
                      logBg = "bg-yellow-950/20 text-yellow-101 border-yellow-800/25";
                      textAccent = "text-yellow-400 font-extrabold animate-pulse";
                      badge = "CRIT";
                    } else if (log.type === "player_skill") {
                      logBg = "bg-purple-950/20 text-purple-101 border-purple-800/25";
                      textAccent = "text-purple-400 font-bold";
                      badge = "HAB";
                    } else if (log.type === "monster_hit") {
                      logBg = "bg-red-950/20 text-red-101 border-red-800/25";
                      textAccent = "text-red-400 font-bold";
                      badge = "DMG";
                    } else if (log.type === "victory") {
                      logBg = "bg-amber-950/30 text-amber-101 border-amber-800/30";
                      textAccent = "text-amber-400 font-black uppercase";
                      badge = "VIC";
                    } else if (log.type === "info") {
                      logBg = "bg-blue-950/20 text-blue-101 border-blue-800/25";
                      textAccent = "text-blue-450";
                      badge = "INFO";
                    }

                    return (
                      <div
                        key={log.id}
                        className={`text-xs p-2 rounded-none border flex flex-col gap-1 transition-all ${logBg}`}
                      >
                        <div className="flex justify-between items-center text-[8px] text-slate-500 border-b border-white/5 pb-0.5 mb-1 font-pixel-heading">
                          <span>[{log.timestamp}]</span>
                          <span className="uppercase text-[6px] px-1 bg-slate-900 rounded-none tracking-wider">{badge}</span>
                        </div>
                        <p className={`leading-relaxed ${textAccent}`}>{log.text}</p>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* LISTA DE PORTAIS RAIDS */
        <div id="portals-list" className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-4 animate-fade-in relative z-10">
          {PORTALS_DB.map(portal => {
            const userRank = getPlayerRank();
            const userRankBase = userRank.includes("Deus") ? "Deus" : userRank;

            let borderCol = "border-slate-800 bg-[#020205] shadow-[2px_2px_0px_0px_#1e1b4b]";
            if (portal.rank === "M" || portal.rank === "M+") {
              borderCol = "border-rose-950 bg-rose-950/10 hover:bg-rose-950/20 shadow-[2px_2px_0px_0px_#4c0519]";
            } else if (portal.rank === "Deus") {
              borderCol = "border-yellow-950 bg-yellow-950/15 hover:bg-yellow-950/25 shadow-[2px_2px_0px_0px_#422006]";
            }

            const isHigherRank = !compareRanks(userRankBase, portal.rank);
            const threatText = isHigherRank ? (
              <span className="text-red-500 font-bold animate-pulse text-xs flex items-center gap-1 mt-1 font-pixel-mono">
                <ShieldAlert className="w-3.5 h-3.5" /> BLOQUEADO: EXIGE PORTAL RANK {portal.rank}
              </span>
            ) : (
              <span className="text-emerald-400 text-xs block mt-1 font-pixel-mono">
                Fenda Rápida Disponível
              </span>
            );

            return (
              <div
                key={portal.id}
                className={`p-5 rounded-none border-2 flex flex-col justify-between gap-4 transition ${borderCol}`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <span
                      className={`px-2 py-0.5 text-[8px] font-pixel-heading rounded-none mr-2 border ${
                        RANK_COLORS[portal.rank] || "border-slate-600 text-slate-400"
                      }`}
                    >
                      {portal.rank}
                    </span>
                    <span className="text-sm font-bold text-slate-100 font-pixel-heading leading-relaxed">
                      {portal.name}
                    </span>
                    {threatText}
                  </div>
                </div>

                <div className="text-xs text-slate-400 grid grid-cols-2 gap-2 bg-slate-950/80 p-3 rounded-none border-2 border-slate-900 font-pixel-mono">
                  <div>
                    Vida Chefe: <strong className="text-red-400 block mt-0.5">{fN(portal.baseHp)}</strong>
                  </div>
                  <div>
                    Dano Chefe: <strong className="text-orange-400 block mt-0.5">{fN(portal.dmg)}</strong>
                  </div>
                  <div>
                    Ouro Base: <strong className="text-yellow-400 block mt-0.5">+{fN(portal.gold)}</strong>
                  </div>
                  <div>
                    Secret Chance: <strong className="text-purple-400 block mt-0.5">{(portal.secretChance * 100).toFixed(0)}%</strong>
                  </div>
                </div>

                <button
                  disabled={isHigherRank}
                  onClick={() => onStartRaid(portal)}
                  className={`w-full py-2 bg-gradient-to-r text-[9px] font-pixel-heading uppercase tracking-widest rounded-none transition border-2 ${
                    isHigherRank
                      ? "bg-slate-900 border-slate-800 text-slate-600 cursor-not-allowed"
                      : "bg-purple-950 hover:bg-purple-900 text-white border-purple-500 shadow-[2px_2px_0px_0px_#1e1b4b] cursor-pointer"
                  }`}
                >
                  <Swords className="w-4 h-4 inline-block mr-1" /> Invadir Fenda
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
export default PortalsTab;
