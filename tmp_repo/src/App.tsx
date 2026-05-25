import React, { useState, useEffect, useCallback } from "react";
import { Player, ActiveCombat, Portal, NotificationMsg, CombatLogEntry } from "./types";
import {
  RANKS,
  RANK_COLORS,
  CLASSES_DATA,
  PORTALS_DB,
  SHOP_DB,
  MONSTER_NAMES,
  UPGRADES_DB,
} from "./data";
import { StatusTab } from "./components/StatusTab";
import { InventoryTab } from "./components/InventoryTab";
import { PortalsTab } from "./components/PortalsTab";
import { DomainTab } from "./components/DomainTab";
import { UpgradesTab } from "./components/UpgradesTab";
import { TreinoTab } from "./components/TreinoTab";
import { LojaTab } from "./components/LojaTab";
import { DespertarTab } from "./components/DespertarTab";
import { OraculoTab } from "./components/OraculoTab";
import {
  Coins,
  Gem,
  Skull,
  Heart,
  Sparkles,
  User,
  Backpack,
  Compass,
  Crown,
  TrendingUp,
  Award,
  ShoppingCart,
  Dices,
  Bell,
  ShieldAlert,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

// Default State definition
const DEFAULT_PLAYER: Player = {
  level: 1,
  xp: 0,
  gold: 100,
  crystals: 0,
  gachaPoints: 0,
  stats: { str: 10, agi: 10, vit: 10, int: 10 },
  statPoints: 0,
  class: null,
  hp: 100,
  mp: 50,
  equipped: { weapon: null, accessory: null, skill: null },
  potions: { hp: 3, mp: 3 },
  upgrades: {
    dropChance: 0,
    autoclickSpeed: 0,
    goldBonus: 0,
    crystalBonus: 0,
    dailyReforco: 0,
  },
  dailyProgress: {
    pushups: 0,
    situps: 0,
    squats: 0,
    runs: 0,
    completedToday: 0,
  },
  unlockedClasses: [],
  invocations: [],
  shadowPoder: 0,
  inventory: [],
  godPath: null,
};

export default function App() {
  const [player, setPlayer] = useState<Player>(DEFAULT_PLAYER);
  const [activeTab, setActiveTab] = useState<string>("status");
  const [activeCombat, setActiveCombat] = useState<ActiveCombat | null>(null);
  const activeCombatRef = React.useRef<ActiveCombat | null>(null);
  activeCombatRef.current = activeCombat;
  const [lastGachaResult, setLastGachaResult] = useState<React.ReactNode>("");
  const [notifications, setNotifications] = useState<NotificationMsg[]>([]);
  const [combatLogs, setCombatLogs] = useState<CombatLogEntry[]>([]);

  // Format numbers nicely
  const fN = (num: number) => Math.floor(num).toLocaleString("pt-BR");

  // COMBAT LOG TRIGGER
  const addCombatLog = useCallback((text: string, type: CombatLogEntry['type'], damage?: number) => {
    const newEntry: CombatLogEntry = {
      id: Math.random().toString(36).substring(2, 9) + Date.now().toString(),
      timestamp: new Date().toLocaleTimeString("pt-BR", { hour12: false }),
      text,
      type,
      damage,
    };
    setCombatLogs(prev => [newEntry, ...prev].slice(0, 50));
  }, []);

  // TOAST NOTIFICATIONS TRIGGER
  const triggerNotification = useCallback(
    (title: string, message: string, type: "blue" | "red" | "purple" | "gold" = "blue") => {
      const id = Math.random().toString(36).substring(2, 9);
      const newNotification: NotificationMsg = { id, title, message, type };
      setNotifications(prev => [...prev, newNotification]);
      setTimeout(() => {
        setNotifications(prev => prev.filter(n => n.id !== id));
      }, 4500);
    },
    []
  );

  // LOAD GAME
  useEffect(() => {
    const saved = localStorage.getItem("sololeveling_save_v2") || localStorage.getItem("sololeveling_save_v1");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Deep copy nested properties to prevent missing field errors
        const restored: Player = {
          ...DEFAULT_PLAYER,
          ...parsed,
          stats: { ...DEFAULT_PLAYER.stats, ...parsed.stats },
          equipped: { ...DEFAULT_PLAYER.equipped, ...parsed.equipped },
          potions: { ...DEFAULT_PLAYER.potions, ...parsed.potions },
          upgrades: { ...DEFAULT_PLAYER.upgrades, ...parsed.upgrades },
          dailyProgress: { ...DEFAULT_PLAYER.dailyProgress, ...parsed.dailyProgress },
          unlockedClasses: parsed.unlockedClasses || [],
          invocations: parsed.invocations || [],
          inventory: parsed.inventory || [],
        };
        setPlayer(restored);
      } catch (e) {
        console.error("Falha ao recuperar save original", e);
      }
    }
  }, []);

  // SAVE GAME TRIGGER
  const saveGame = (updatedPlayer: Player) => {
    localStorage.setItem("sololeveling_save_v2", JSON.stringify(updatedPlayer));
  };

  // STANDARD FORMULAS DEFINED IN GDD
  const getMaxHp = useCallback(() => {
    let base = 100 + player.level * 15 + player.stats.vit * 10;
    if (player.class && CLASSES_DATA[player.class]) {
      base += CLASSES_DATA[player.class].bonus.hpMax || 0;
    }
    player.invocations.forEach(inv => {
      if (inv.statBonus && inv.statBonus.vit) base += inv.statBonus.vit * 10;
    });
    return base;
  }, [player.level, player.stats.vit, player.class, player.invocations]);

  const getMaxMp = useCallback(() => {
    let base = 50 + player.level * 8 + player.stats.int * 5;
    if (player.class && CLASSES_DATA[player.class]) {
      base += CLASSES_DATA[player.class].bonus.mpMax || 0;
    }
    player.invocations.forEach(inv => {
      if (inv.statBonus && inv.statBonus.int) base += inv.statBonus.int * 5;
    });
    return base;
  }, [player.level, player.stats.int, player.class, player.invocations]);

  const getDmg = useCallback(() => {
    let weaponBonus = 0;
    if (player.equipped.weapon) {
      const weapon = SHOP_DB.equip.find(w => w.id === player.equipped.weapon);
      if (weapon && weapon.val) weaponBonus = weapon.val;
    }
    let base = 10 + player.stats.str * 3 + weaponBonus;
    if (player.class && CLASSES_DATA[player.class]) {
      base += (CLASSES_DATA[player.class].bonus.str || 0) * 3;
    }
    player.invocations.forEach(inv => {
      if (inv.statBonus && inv.statBonus.str) base += inv.statBonus.str * 3;
    });
    return base;
  }, [player.equipped.weapon, player.stats.str, player.class, player.invocations]);

  const getCritChance = useCallback(() => {
    let accBonus = 0;
    if (player.equipped.accessory) {
      const acc = SHOP_DB.accessory.find(a => a.id === player.equipped.accessory);
      if (acc && acc.stat === "agi" && acc.val) accBonus = acc.val;
    }
    let base = 5 + player.stats.agi * 1 + accBonus;
    if (player.class && CLASSES_DATA[player.class]) {
      base += CLASSES_DATA[player.class].bonus.agi || 0;
    }
    player.invocations.forEach(inv => {
      if (inv.statBonus && inv.statBonus.agi) base += inv.statBonus.agi;
    });
    return Math.min(base, 80);
  }, [player.equipped.accessory, player.stats.agi, player.class, player.invocations]);

  const getDef = useCallback(() => {
    let accBonus = 0;
    if (player.equipped.accessory) {
      const acc = SHOP_DB.accessory.find(a => a.id === player.equipped.accessory);
      if (acc && acc.stat === "vit" && acc.val) accBonus = acc.val;
    }
    let base = player.stats.vit * 1.5 + accBonus;
    player.invocations.forEach(inv => {
      if (inv.statBonus && inv.statBonus.vit) base += inv.statBonus.vit * 1.5;
    });
    return Math.floor(base);
  }, [player.equipped.accessory, player.stats.vit, player.invocations]);

  const getSkillPower = useCallback(() => {
    let accBonus = 0;
    if (player.equipped.accessory) {
      const acc = SHOP_DB.accessory.find(a => a.id === player.equipped.accessory);
      if (acc && acc.stat === "int" && acc.val) accBonus = acc.val;
    }
    let base = 10 + player.stats.int * 4 + accBonus * 2;
    if (player.class && CLASSES_DATA[player.class]) {
      base += (CLASSES_DATA[player.class].bonus.int || 0) * 4;
    }
    player.invocations.forEach(inv => {
      if (inv.statBonus && inv.statBonus.int) base += inv.statBonus.int * 4;
    });
    return base;
  }, [player.equipped.accessory, player.stats.int, player.class, player.invocations]);

  const getXpRequired = useCallback((level: number) => {
    if (level < 40) return Math.floor(100 * Math.pow(1.4, level - 1));
    return Math.floor(100 * Math.pow(1.4, 39) * Math.pow(1.15, level - 40));
  }, []);

  const getPlayerRank = useCallback(() => {
    if (player.level >= 200) {
      if (player.godPath === "Monarca") return "Deus Monarca";
      if (player.godPath === "Estelar") return "Deus Estelar";
      return "Deus";
    }
    if (player.level >= 150) return "M+";
    if (player.level >= 125) return "M";
    if (player.level >= 100) return "FE+";
    if (player.level >= 80) return "FE";
    if (player.level >= 65) return "N+";
    if (player.level >= 50) return "N";
    if (player.level >= 40) return "SSS";
    if (player.level >= 35) return "SS";
    if (player.level >= 30) return "S";
    if (player.level >= 22) return "A";
    if (player.level >= 15) return "B";
    if (player.level >= 10) return "C";
    if (player.level >= 5) return "D";
    return "E";
  }, [player.level, player.godPath]);

  const compareRanks = useCallback((r1: string, r2: string) => {
    const base1 = r1.includes("Deus") ? "Deus" : r1;
    const base2 = r2.includes("Deus") ? "Deus" : r2;
    return RANKS.indexOf(base1) >= RANKS.indexOf(base2);
  }, []);

  // IDLE PASSIVE HEAL TICK
  useEffect(() => {
    const interval = setInterval(() => {
      if (!activeCombat) {
        setPlayer(prev => {
          const maxH = 100 + prev.level * 15 + prev.stats.vit * 10 + (prev.class ? CLASSES_DATA[prev.class]?.bonus.hpMax || 0 : 0);
          const maxM = 50 + prev.level * 8 + prev.stats.int * 5 + (prev.class ? CLASSES_DATA[prev.class]?.bonus.mpMax || 0 : 0);
          
          let sumVit = 0, sumInt = 0;
          prev.invocations.forEach(inv => {
            if (inv.statBonus.vit) sumVit += inv.statBonus.vit;
            if (inv.statBonus.int) sumInt += inv.statBonus.int;
          });
          const fullH = maxH + sumVit * 10;
          const fullM = maxM + sumInt * 5;

          const regenH = fullH * 0.05;
          const regenM = fullM * 0.05;

          if (prev.hp >= fullH && prev.mp >= fullM) return prev;

          const nextPlayer = {
            ...prev,
            hp: Math.min(fullH, prev.hp + regenH),
            mp: Math.min(fullM, prev.mp + regenM),
          };
          saveGame(nextPlayer);
          return nextPlayer;
        });
      }
    }, 1200);

    return () => clearInterval(interval);
  }, [activeCombat]);

  // ALLOCATE STATUS POINTS
  const handleAllocateStat = (stat: "str" | "agi" | "vit" | "int") => {
    if (player.statPoints <= 0) {
      triggerNotification("Sistema", "Você não possui pontos livres.", "red");
      return;
    }
    setPlayer(prev => {
      let amount = 1;
      if (prev.statPoints > 1000) amount = 100;
      else if (prev.statPoints > 100) amount = 10;

      const nextProg = {
        ...prev,
        statPoints: prev.statPoints - amount,
        stats: {
          ...prev.stats,
          [stat]: prev.stats[stat] + amount,
        },
      };

      if (stat === "vit") {
        nextProg.hp += 10 * amount;
      }
      if (stat === "int") {
        nextProg.mp += 5 * amount;
      }

      saveGame(nextProg);
      return nextProg;
    });
  };

  // DIVINE ASCENSION
  const handleAscend = (path: "Monarca" | "Estelar") => {
    const godClass =
      path === "Monarca" ? "Soberano da Vontade Divina" : "Forjador de Sóis";
    
    setPlayer(prev => {
      const nextUnlocked = prev.unlockedClasses.includes(godClass)
        ? prev.unlockedClasses
        : [...prev.unlockedClasses, godClass];

      const nextProg = {
        ...prev,
        godPath: path,
        class: godClass,
        unlockedClasses: nextUnlocked,
      };

      // Fully heal on ascension
      const fullH = 100 + nextProg.level * 15 + nextProg.stats.vit * 10 + (CLASSES_DATA[godClass]?.bonus.hpMax || 0);
      const fullM = 50 + nextProg.level * 8 + nextProg.stats.int * 5 + (CLASSES_DATA[godClass]?.bonus.mpMax || 0);
      
      nextProg.hp = fullH;
      nextProg.mp = fullM;

      triggerNotification(
        "ASCENSÃO DIVINA CONCLUÍDA Ω",
        `As fendas se curvaram perante seu nome. Você ascendeu ao nível de Deus ${path}!`,
        "gold"
      );
      saveGame(nextProg);
      return nextProg;
    });
  };

  // FAST POTION RESTORATION
  const handleUsePotion = (type: "hp" | "mp") => {
    const maxHP = getMaxHp();
    const maxMP = getMaxMp();

    if (type === "hp") {
      if (player.potions.hp <= 0) {
        triggerNotification("Mercado", "Sem poções de vida em estoque.", "red");
        return;
      }
      if (player.hp >= maxHP) {
        triggerNotification("Sistema", "Sua vitalidade já está transbordando.", "blue");
        return;
      }
      setPlayer(prev => {
        const nextProg = {
          ...prev,
          hp: maxHP,
          potions: { ...prev.potions, hp: prev.potions.hp - 1 },
        };
        triggerNotification("Poção de Vida", "HP totalmente restaurado.", "red");
        saveGame(nextProg);
        return nextProg;
      });
    } else {
      if (player.potions.mp <= 0) {
        triggerNotification("Mercado", "Sem poções de mana em estoque.", "red");
        return;
      }
      if (player.mp >= maxMP) {
        triggerNotification("Sistema", "Sua energia de mana já está cheia.", "blue");
        return;
      }
      setPlayer(prev => {
        const nextProg = {
          ...prev,
          mp: maxMP,
          potions: { ...prev.potions, mp: prev.potions.mp - 1 },
        };
        triggerNotification("Poção de Mana", "Mana totalmente regenerada.", "blue");
        saveGame(nextProg);
        return nextProg;
      });
    }
  };

  // RESET SAVE DATA (DESTROY EXISTENCE)
  const handleResetGame = () => {
    if (
      confirm(
        "ATENÇÃO: Você irá destruir o universo atual e reiniciar sua jornada cósmica no Nível 1. Confirma a Aniquilação?"
      )
    ) {
      localStorage.removeItem("sololeveling_save_v2");
      localStorage.removeItem("sololeveling_save_v1");
      setPlayer(DEFAULT_PLAYER);
      setActiveTab("status");
      setActiveCombat(null);
      setLastGachaResult("");
      triggerNotification("Sistema Sombrio", "Criação restaurada para o Nível 1.", "blue");
    }
  };

  // EQUIP ITEMS
  const handleEquip = (itemId: string, slot: "weapon" | "accessory" | "skill") => {
    setPlayer(prev => {
      const nextProg = {
        ...prev,
        equipped: {
          ...prev.equipped,
          [slot]: itemId,
        },
      };
      triggerNotification("Equipamento", "Item ativado com sucesso.", "blue");
      saveGame(nextProg);
      return nextProg;
    });
  };

  const handleUnequip = (slot: "weapon" | "accessory" | "skill") => {
    setPlayer(prev => {
      const nextProg = {
        ...prev,
        equipped: {
          ...prev.equipped,
          [slot]: null,
        },
      };
      triggerNotification("Equipamento", "Item desativado.", "red");
      saveGame(nextProg);
      return nextProg;
    });
  };

  // SELL ITEMS FOR GOLD
  const handleSellItem = (index: number, val: number) => {
    setPlayer(prev => {
      const nextInv = [...prev.inventory];
      const item = nextInv[index];
      if (!item) return prev;

      if (item.qty > 1) {
        nextInv[index] = { ...item, qty: item.qty - 1 };
      } else {
        nextInv.splice(index, 1);
      }

      const nextProg = {
        ...prev,
        gold: prev.gold + val,
        inventory: nextInv,
      };
      triggerNotification("Comércio", `Artefato vendido por ${val.toLocaleString()} de Ouro.`, "gold");
      saveGame(nextProg);
      return nextProg;
    });
  };

  // RAIDS AND COMBAT HANDLER
  const handleStartRaid = (portal: Portal) => {
    if (player.hp <= 0) {
      triggerNotification("Nocauteado", "Seu corpo está sem consciência. Cure-se antes.", "red");
      return;
    }

    const isSecret = Math.random() < portal.secretChance;
    let mRankIndex = RANKS.indexOf(portal.rank);
    let monsterRank = portal.rank;

    if (isSecret) {
      const nextIndex = Math.min(mRankIndex + 1, RANKS.length - 1);
      monsterRank = RANKS[nextIndex];
    }

    const hpMult = isSecret ? 3.0 : 1.0;
    const dmgMult = isSecret ? 2.0 : 1.0;

    const pool = MONSTER_NAMES[portal.rank] || ["Monstro Sombrio Desconhecido"];
    const monsterName = isSecret
      ? `[ANOMALIA] Guarda Real ${monsterRank}`
      : pool[Math.floor(Math.random() * pool.length)];

    const combatInstance: ActiveCombat = {
      portal,
      isSecret,
      monsterRank,
      name: monsterName,
      hpMax: Math.floor(portal.baseHp * hpMult),
      hp: Math.floor(portal.baseHp * hpMult),
      dmg: Math.floor(portal.dmg * dmgMult),
    };

    const startText = isSecret
      ? `🚨 ALERTA: ANOMALIA DETECTADA! O Altar Cósmico distorceu a fenda. Combatendo [ANOMALIA] ${monsterName}!`
      : `🚪 Fenda Dimensional aberta! Invasão de Rank ${portal.rank} iniciada contra ${monsterName}.`;

    setCombatLogs([
      {
        id: "start-" + Date.now().toString(),
        timestamp: new Date().toLocaleTimeString("pt-BR", { hour12: false }),
        text: startText,
        type: isSecret ? "player_skill" : "info",
      }
    ]);

    activeCombatRef.current = combatInstance;
    setActiveCombat(combatInstance);
  };

  const handleEscape = () => {
    activeCombatRef.current = null;
    setActiveCombat(null);
    setCombatLogs([]);
  };

  // CORE COMBAT TURN: ATTACK TRIGGERS
  const handleExecuteAttack = () => {
    if (!activeCombatRef.current || activeCombatRef.current.completed) return;
    const currentCombat = activeCombatRef.current;

    // Checks player HP
    if (player.hp <= 0) {
      triggerNotification("Derrotado", "Você esgotou sua consciência.", "red");
      activeCombatRef.current = null;
      setActiveCombat(null);
      return;
    }

    let finalDmg = getDmg();
    const isCrit = Math.random() < getCritChance() / 100;
    if (isCrit) finalDmg = Math.floor(finalDmg * 1.8);

    // Apply special spells
    let usedSkill = false;
    const skill = SHOP_DB.skill.find(s => s.id === player.equipped.skill);
    let updatedMp = player.mp;
    if (skill && player.mp >= (skill.mpCost || 0)) {
      updatedMp -= (skill.mpCost || 0);
      finalDmg = Math.floor(finalDmg + (getSkillPower() * (skill.dmgMult || 1)));
      usedSkill = true;
    }

    const nextMonsterHp = Math.max(0, currentCombat.hp - finalDmg);
    
    // Enemy attacks back if still alive
    let finalDmgReceived = 1;
    if (nextMonsterHp > 0) {
      finalDmgReceived = Math.max(1, currentCombat.dmg - getDef());
    } else {
      finalDmgReceived = 0; // Don't take damage if mon is killed immediately
    }

    const nextPlayerHp = Math.max(0, player.hp - finalDmgReceived);

    // Track standard combat logs
    let attackText = "";
    let logType: CombatLogEntry['type'] = "player_hit";

    if (usedSkill) {
      attackText = `🔮 Você conjurou [${skill?.name || "Técnica"}] causando ${finalDmg.toLocaleString("pt-BR")} de dano! (${isCrit ? "Crítico!" : "Ataque Espectral"})`;
      logType = "player_skill";
    } else if (isCrit) {
      attackText = `💥 Crítico! Você cortou a defesa do inimigo causando ${finalDmg.toLocaleString("pt-BR")} de dano!`;
      logType = "player_crit";
    } else {
      attackText = `🗡️ Você desferiu um ataque físico causando ${finalDmg.toLocaleString("pt-BR")} de dano.`;
      logType = "player_hit";
    }

    addCombatLog(attackText, logType, finalDmg);

    if (finalDmgReceived > 0) {
      addCombatLog(`⚠️ O monstro ${currentCombat.name} contra-atacou causando ${finalDmgReceived.toLocaleString("pt-BR")} de dano.`, "monster_hit", finalDmgReceived);
    }

    if (nextPlayerHp <= 0) {
      addCombatLog(`💀 Fim de Combate! O inimigo ${currentCombat.name} desferiu um golpe fatal de ${finalDmgReceived.toLocaleString("pt-BR")}! Você sucumbiu!`, "monster_hit");
      setPlayer(prev => {
        const nextObj = { ...prev, hp: 0, mp: updatedMp };
        saveGame(nextObj);
        return nextObj;
      });
      triggerNotification("Expedição Falhou", "O inimigo destruiu sua ligação espectral.", "red");
      activeCombatRef.current = null;
      setActiveCombat(null);
      return;
    }

    if (nextMonsterHp <= 0) {
      if (currentCombat.completed) return;
      currentCombat.completed = true;
      // VICTORY RESOLUTION
      const goldMultiplier = 1 + player.upgrades.goldBonus * 0.2;
      const crystalMultiplier = 1 + player.upgrades.crystalBonus * 0.2;
      const dropCh = 0.05 + player.upgrades.dropChance * 0.05;

      let goldWon = Math.floor(currentCombat.portal.gold * goldMultiplier);
      let crystalsWon = Math.floor(currentCombat.portal.crystals * crystalMultiplier);
      let xpWon = currentCombat.portal.xp;
      let gachaPointsWon = 0;

      if (currentCombat.isSecret) {
        const rankIdx = RANKS.indexOf(currentCombat.monsterRank);
        gachaPointsWon = rankIdx >= RANKS.indexOf("SSS") ? rankIdx * 5 : (rankIdx + 1) * 2;
        goldWon *= 4;
        xpWon *= 3;
      }

      let shadowWon = 0;
      if (player.class && CLASSES_DATA[player.class]?.summoner) {
        shadowWon = (RANKS.indexOf(currentCombat.portal.rank) + 1) * 10;
      }

      // Pre-calculate drops so we can log them transparently with no side effects
      const isLootDropped = Math.random() < dropCh;
      let itemDropId = "";
      let itemDropName = "";
      let itemDropCat: "equip" | "accessory" = "equip";

      if (isLootDropped) {
        const typeDrop = Math.random() < 0.5 ? "equip" : "accessory";
        const listByRank = SHOP_DB[typeDrop].filter(
          i => i.rank === currentCombat.portal.rank
        );
        if (listByRank.length > 0) {
          const chosenDrop = listByRank[Math.floor(Math.random() * listByRank.length)];
          itemDropId = chosenDrop.id;
          itemDropName = chosenDrop.name;
          itemDropCat = typeDrop;
        }
      }

      // Pre-calculate shadow extraction
      const supportsShadowExtraction =
        player.class === "Monarca das Sombras" ||
        player.class === "Lorde do Vazio Absoluto" ||
        player.class === "Soberano da Vontade Divina";
      
      const isShadowExtracted = supportsShadowExtraction && !currentCombat.isSecret && Math.random() < 0.40;

      // Log victory details immediately
      addCombatLog(`👑 VITÓRIA! O chefe ${currentCombat.name} foi subjugado!`, "victory");
      
      if (itemDropId && itemDropName) {
        addCombatLog(`🎁 Artefato Cósmico descoberto no núcleo: ${itemDropName}!`, "info");
      }

      if (isShadowExtracted) {
        addCombatLog(`👤 ERGA-SE! Alma de ${currentCombat.name} incorporada com sucesso à sua legião de caçadores!`, "player_skill");
      }

      const rewardsMessage = `+${goldWon.toLocaleString()} Ouro | +${crystalsWon.toLocaleString()} Cristais | +${xpWon} XP ${
        gachaPointsWon ? `| +${gachaPointsWon} Segredos` : ""
      }${shadowWon ? `| +${shadowWon} Ligas Sombrias` : ""}`;

      addCombatLog(`💰 Recursos absorvidos: ${rewardsMessage}`, "victory");

      // Estimate levels to log level up
      let estimatedXp = player.xp + xpWon;
      let estimatedLvl = player.level;
      let reqXpEst = getXpRequired(estimatedLvl);
      while (estimatedXp >= reqXpEst && estimatedLvl < 9999) {
        estimatedXp -= reqXpEst;
        estimatedLvl++;
        reqXpEst = getXpRequired(estimatedLvl);
      }
      if (estimatedLvl > player.level) {
        addCombatLog(`🌟 PARABÉNS! Seus limitadores biológicos se romperam! Você subiu para o Nível ${estimatedLvl}!`, "player_skill");
      }

      setPlayer(prev => {
        const inventoryCopy = [...prev.inventory];
        
        // Weapon/Accessory drop chances using pre-calculated values
        if (itemDropId) {
          const matchIndex = inventoryCopy.findIndex(item => item.id === itemDropId);
          if (matchIndex >= 0) {
            inventoryCopy[matchIndex].qty += 1;
          } else {
            inventoryCopy.push({ id: itemDropId, category: itemDropCat, qty: 1 });
          }
          triggerNotification(
            "Artefato Descoberto",
            `Loot de fenda: ${itemDropName}! Adicionado ao cofre.`,
            "purple"
          );
        }

        // Shadows extraction from normal gates using pre-calculated values
        let summonsCopy = [...prev.invocations];
        let shadowLog = "";

        if (isShadowExtracted) {
          const shadowName = `Espírito: ${currentCombat.name}`;
          const alreadySummoned = summonsCopy.some(s => s.name === shadowName);
          if (!alreadySummoned && summonsCopy.length < 32) {
            const multiplier = Math.max(1, RANKS.indexOf(currentCombat.portal.rank)) * 8;
            summonsCopy.push({
              name: shadowName,
              rank: currentCombat.portal.rank,
              type: "shadow_extraida",
              statBonus: {
                str: multiplier * 2,
                vit: Math.floor(multiplier * 1.5),
                agi: multiplier,
                int: 0,
              },
            });
            shadowLog = "\n[ERGA-SE!] A alma da criatura foi anexada à sua legião!";
          }
        }

        // Handles level and level transitions
        let nextXp = prev.xp + xpWon;
        let nextLvl = prev.level;
        let nextStatPoints = prev.statPoints;
        let nextHp = nextPlayerHp;
        let nextMp = updatedMp;

        let reqXp = getXpRequired(nextLvl);
        while (nextXp >= reqXp && nextLvl < 9999) {
          nextXp -= reqXp;
          nextLvl++;
          nextStatPoints += 5;
          reqXp = getXpRequired(nextLvl);
        }

        const statsVit = prev.stats.vit + summonsCopy.reduce((acc, current) => acc + (current.statBonus.vit || 0), 0);
        const statsInt = prev.stats.int + summonsCopy.reduce((acc, current) => acc + (current.statBonus.int || 0), 0);

        const fullH = 100 + nextLvl * 15 + statsVit * 10 + (prev.class ? CLASSES_DATA[prev.class]?.bonus.hpMax || 0 : 0);
        const fullM = 50 + nextLvl * 8 + statsInt * 5 + (prev.class ? CLASSES_DATA[prev.class]?.bonus.mpMax || 0 : 0);

        if (nextLvl > prev.level) {
          nextHp = fullH;
          nextMp = fullM;
          triggerNotification("EVOLUÇÃO DOS LIMITADORES", `Parabéns! Você alcançou o Nível ${nextLvl}!`, "purple");
        }

        const updatedPlayerObj = {
          ...prev,
          level: nextLvl,
          xp: nextXp,
          gold: prev.gold + goldWon,
          crystals: prev.crystals + crystalsWon,
          gachaPoints: prev.gachaPoints + gachaPointsWon,
          shadowPoder: prev.shadowPoder + shadowWon,
          statPoints: nextStatPoints,
          hp: Math.min(nextHp, fullH),
          mp: Math.min(nextMp, fullM),
          inventory: inventoryCopy,
          invocations: summonsCopy,
        };

        const finalRewardsMsg = `+${goldWon.toLocaleString()} Ouro | +${crystalsWon.toLocaleString()} Cristais | +${xpWon} XP ${
          gachaPointsWon ? `| +${gachaPointsWon} Segredos` : ""
        }${shadowWon ? `| +${shadowWon} Ligas Sombrias` : ""}${shadowLog}`;

        triggerNotification("EXPEDIÇÃO CONCLUÍDA", finalRewardsMsg, "gold");
        saveGame(updatedPlayerObj);
        return updatedPlayerObj;
      });

      activeCombatRef.current = null;
      setActiveCombat(null);
      return;
    }

    // Normal round continues
    setActiveCombat(prev => {
      if (!prev) return null;
      const updated = { ...prev, hp: nextMonsterHp };
      activeCombatRef.current = updated;
      return updated;
    });

    setPlayer(prev => {
      const nextObj = { ...prev, hp: nextPlayerHp, mp: updatedMp };
      saveGame(nextObj);
      return nextObj;
    });
  };

  // SUMMON/DOMÍNIO OPERATIONS
  const handleSummonShadowGeneral = () => {
    if (player.shadowPoder < 10000) {
      triggerNotification("Falha", "Energia sombria é insuficiente.", "red");
      return;
    }
    setPlayer(prev => {
      const names = [
        "Lorde Beru do Caos",
        "Lorde Igris da Destruição",
        "Lorde Bellion das Sombras",
      ];
      const selected = names[Math.floor(Math.random() * names.length)];
      const nextSummons = [
        ...prev.invocations,
        {
          name: selected,
          rank: "M",
          type: "shadow_general",
          statBonus: { str: 150000, vit: 150000, agi: 100000, int: 50000 },
        },
      ];
      const nextProg = {
        ...prev,
        shadowPoder: prev.shadowPoder - 10000,
        invocations: nextSummons,
      };
      triggerNotification("ERGA-SE!", `General Sombrio incorporado com glória: ${selected}!`, "purple");
      saveGame(nextProg);
      return nextProg;
    });
  };

  const handleTransmuteDragon = (tier: "s" | "m" | "deus") => {
    const formulas = {
      s: { c: 15000, m: 5000, name: "Dragão Infernal", rank: "S", val: 50 },
      m: { c: 10000000, m: 500000, name: "Leviatã Cósmico", rank: "M", val: 500000 },
      deus: { c: 500000000, m: 2000000, name: "Avatar do Sol Divino", rank: "Deus", val: 5000000 },
    };

    const requirement = formulas[tier];
    if (player.crystals < requirement.c) {
      triggerNotification("Criação Interrompida", "Falta cristais estelares.", "red");
      return;
    }
    if (player.mp < requirement.m) {
      triggerNotification("Criação Interrompida", "Energia mágica de caçador insuficiente.", "red");
      return;
    }

    setPlayer(prev => {
      const nextSummons = [
        ...prev.invocations,
        {
          name: requirement.name,
          rank: requirement.rank,
          type: "dragon",
          statBonus: {
            str: requirement.val,
            vit: requirement.val,
            agi: requirement.val,
            int: requirement.val,
          },
        },
      ];
      const nextProg = {
        ...prev,
        crystals: prev.crystals - requirement.c,
        mp: prev.mp - requirement.m,
        invocations: nextSummons,
      };
      triggerNotification("FORJA DIVINA", `Entidade celeste manifestada: ${requirement.name}!`, "gold");
      saveGame(nextProg);
      return nextProg;
    });
  };

  const handleDismissSummon = (index: number) => {
    setPlayer(prev => {
      const list = [...prev.invocations];
      list.splice(index, 1);
      const nextProg = { ...prev, invocations: list };
      triggerNotification("Descarte", "Vínculo dissipado com a entidade.", "red");
      saveGame(nextProg);
      return nextProg;
    });
  };

  // SYSTEM ARCHITECTURAL UPGRADES
  const handleBuyUpgrade = (upgradeId: string, cost: number) => {
    if (player.gold < cost) {
      triggerNotification("Sistema", "Acesso rejeitado. Recursos insuficientes.", "red");
      return;
    }
    setPlayer(prev => {
      const nextUpgrades = {
        ...prev.upgrades,
        [upgradeId]: ((prev.upgrades as any)[upgradeId] || 0) + 1,
      };
      const nextProg = {
        ...prev,
        gold: prev.gold - cost,
        upgrades: nextUpgrades,
      };
      triggerNotification("Otimização Concluída", "Integração de hardware celular redefinida.", "blue");
      saveGame(nextProg);
      return nextProg;
    });
  };

  // TREINO DIÁRIO: Gaining stats + Recovering
  const handleExecuteTrainingClick = () => {
    const recoveryHp = getMaxHp() * 0.05;
    const recoveryMp = getMaxMp() * 0.05;

    setPlayer(prev => {
      let progressAmount = 2; // Fast training speed helper

      let pushups = prev.dailyProgress.pushups;
      let situps = prev.dailyProgress.situps;
      let squats = prev.dailyProgress.squats;
      let runs = prev.dailyProgress.runs;
      let completedToday = prev.dailyProgress.completedToday;
      let gold = prev.gold;
      let xp = prev.xp;
      let level = prev.level;
      let statPoints = prev.statPoints;
      const statsCopy = { ...prev.stats };

      if (pushups < 100) {
        pushups = Math.min(100, pushups + progressAmount);
      } else if (situps < 100) {
        situps = Math.min(100, situps + progressAmount);
      } else if (squats < 100) {
        squats = Math.min(100, squats + progressAmount);
      } else if (runs < 100) {
        runs = Math.min(100, runs + progressAmount);
        if (runs >= 100) {
          // COMPLETED CYCLE
          completedToday++;
          const upMult = 1 + prev.upgrades.dailyReforco * 0.5;
          const goldReward = Math.floor(500 * upMult * (Math.pow(level, 1.5) + 1));
          const xpReward = Math.floor(200 * upMult * (Math.pow(level, 1.2) + 1));

          gold += goldReward;
          xp += xpReward;

          let reqXp = getXpRequired(level);
          while (xp >= reqXp && level < 9999) {
            xp -= reqXp;
            level++;
            statPoints += 5;
            reqXp = getXpRequired(level);
          }

          // Permanent Raw Stat Gains
          const changeWeight = 0.50 + prev.upgrades.dailyReforco * 0.02;
          const pointsAllocatedObj = Math.floor(1 + level / 10);
          let statGainLog = "";

          if (Math.random() < changeWeight) {
            const list: Array<'str'|'agi'|'vit'|'int'> = ["str", "agi", "vit", "int"];
            const selectedType = list[Math.floor(Math.random() * list.length)];
            statsCopy[selectedType] += pointsAllocatedObj;
            statGainLog = `\nSeu corpo assimilou energia bruta: +${pointsAllocatedObj} em ${selectedType.toUpperCase()} permanentemente!`;
          }

          triggerNotification(
            "CICLO DIÁRIO CONCLUÍDO",
            `Treino cumprido! Recompensas: +${goldReward.toLocaleString()} Ouro, +${xpReward.toLocaleString()} XP.${statGainLog}`,
            "purple"
          );

          // Reset progress blocks
          pushups = 0;
          situps = 0;
          squats = 0;
          runs = 0;
        }
      }

      const statsVit = statsCopy.vit + prev.invocations.reduce((acc, current) => acc + (current.statBonus.vit || 0), 0);
      const statsInt = statsCopy.int + prev.invocations.reduce((acc, current) => acc + (current.statBonus.int || 0), 0);

      const fullH = 100 + level * 15 + statsVit * 10 + (prev.class ? CLASSES_DATA[prev.class]?.bonus.hpMax || 0 : 0);
      const fullM = 50 + level * 8 + statsInt * 5 + (prev.class ? CLASSES_DATA[prev.class]?.bonus.mpMax || 0 : 0);

      const nextProg = {
        ...prev,
        level,
        xp,
        gold,
        statPoints,
        stats: statsCopy,
        hp: Math.min(fullH, prev.hp + recoveryHp),
        mp: Math.min(fullM, prev.mp + recoveryMp),
        dailyProgress: {
          pushups,
          situps,
          squats,
          runs,
          completedToday,
        },
      };

      saveGame(nextProg);
      return nextProg;
    });
  };

  // BUY BLACK MARKET GOODS
  const handleBuyItem = (cat: string, id: string, cost: number) => {
    if (player.gold < cost) {
      triggerNotification("Mercado", "Transação negada. Saldo insuficiente.", "red");
      return;
    }
    setPlayer(prev => {
      let potionsCopy = { ...prev.potions };
      let listCopy = [...prev.inventory];

      if (id === "p_hp_standard") {
        potionsCopy.hp++;
      } else if (id === "p_mp_standard") {
        potionsCopy.mp++;
      } else {
        const indexMatch = listCopy.findIndex(item => item.id === id);
        if (indexMatch >= 0 && cat !== "skill") {
          listCopy[indexMatch].qty += 1;
        } else {
          listCopy.push({ id, category: cat, qty: 1 });
        }
      }

      const nextProg = {
        ...prev,
        gold: prev.gold - cost,
        inventory: listCopy,
        potions: potionsCopy,
      };
      
      triggerNotification("Mercado Negro", `Adquirido com glória! Debitados ${cost.toLocaleString()} de Ouro.`, "gold");
      saveGame(nextProg);
      return nextProg;
    });
  };

  // PULL DESPERTAR GACHA
  const handlePullGacha = () => {
    if (player.gachaPoints < 10) {
      triggerNotification("Altar Trancado", "Você não recolheu Segredos suficientes das anomalias.", "red");
      return;
    }

    const r = Math.random() * 100;
    let rolledClass = "Soldado";

    if (r < 0.1) rolledClass = "Lorde do Vazio Absoluto";
    else if (r < 0.4) rolledClass = "Invocador Cósmico";
    else if (r < 1.0) rolledClass = "Executor de Entropia";
    else if (r < 2.5) rolledClass = "Manipulador de Interação Forte";
    else if (r < 5.0) rolledClass = "Herói Nacional (Top 1)";
    else if (r < 10.0) rolledClass = "Caçador Nacional";
    else if (r < 12.0) {
      const poolValue = ["Monarca das Sombras", "Monarca dos Dragões"];
      rolledClass = poolValue[Math.floor(Math.random() * poolValue.length)];
    } else if (r < 15.0) {
      const poolValue = ["Formiga das Sombras", "Cavalheiro das Sombras"];
      rolledClass = poolValue[Math.floor(Math.random() * poolValue.length)];
    } else if (r < 20.0) rolledClass = "Invocador";
    else if (r < 30.0) rolledClass = "Espadachim";
    else if (r < 45.0) rolledClass = "Guerreiro";
    else if (r < 60.0) rolledClass = "Lutador";
    else if (r < 80.0) rolledClass = "Mago";
    else rolledClass = "Soldado";

    setPlayer(prev => {
      const unlockCopy = [...prev.unlockedClasses];
      const exist = unlockCopy.includes(rolledClass);
      let tResponse: React.ReactNode = "";
      let refund = 0;

      if (exist) {
        refund = 5;
        tResponse = (
          <span>
            Ressonância de Alma Duplicada:{" "}
            <strong className="text-white">
              {rolledClass} [{CLASSES_DATA[rolledClass]?.rank || "E"}]
            </strong>
            .<br />O Sistema reembolsou{" "}
            <strong className="text-purple-400">5 Segredos</strong>.
          </span>
        );
        triggerNotification("Relação Duplicada", "Concedidos 5 Segredos de reembolso.", "blue");
      } else {
        unlockCopy.push(rolledClass);
        tResponse = (
          <span>
            O Altar Cósmico explodiu em glória!
            <br />
            Nova Classe Sintonizada:{" "}
            <strong className="text-purple-400 text-lg block mt-1.5 animate-pulse">
              {rolledClass} [{CLASSES_DATA[rolledClass]?.rank || "E"}]
            </strong>
          </span>
        );
        triggerNotification("DESPERTAR", `Sua aura ressoou com: ${rolledClass}!`, "purple");
      }

      const nextProg = {
        ...prev,
        gachaPoints: prev.gachaPoints - 10 + refund,
        unlockedClasses: unlockCopy,
        class: prev.class ? prev.class : rolledClass, // Auto-equip first rolled class
      };

      setLastGachaResult(tResponse);
      saveGame(nextProg);
      return nextProg;
    });
  };

  // CHOOSE UNLOCKED CLASSES
  const handleSelectClass = (clsName: string) => {
    if (player.godPath && !CLASSES_DATA[clsName]?.type?.includes("god")) {
      triggerNotification("Sistema Divino", "Uma divindade já realizou a ascensão e não pode regredir a limitadores primitivos.", "red");
      return;
    }
    if (player.unlockedClasses.includes(clsName)) {
      setPlayer(prev => {
        const nextProg = { ...prev, class: clsName };
        triggerNotification("Classe", `Fusão espectral alterada para: ${clsName}.`, "purple");
        saveGame(nextProg);
        return nextProg;
      });
    }
  };

  // METADATA CALCULATIONS FOR SIDEBAR
  const maxHP = player.level === 1 && !player.class ? 100 : getMaxHp();
  const maxMP = player.level === 1 && !player.class ? 50 : getMaxMp();
  const reqXp = getXpRequired(player.level);

  return (
    <div className="min-h-screen bg-[#030305] text-[#e2e8f0] flex flex-col justify-between overflow-x-hidden relative font-sans retro-crt">
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          backgroundImage:
            "radial-gradient(circle at center, rgba(168, 85, 247, 0.05) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      ></div>

      {/* HEADER / RAPID RESOURCE TICKBAR */}
      <header className="bg-[#020205] border-b-4 border-double border-slate-800 p-4 sticky top-0 z-40 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)]">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-[#030305] border-2 border-purple-500 flex items-center justify-center text-[#9b5de5] font-bold text-sm shadow-[2px_2px_0px_0px_rgba(155,93,229,0.3)] font-pixel-heading">
              SL
            </div>
            <div>
              <h1 className="text-sm sm:text-base font-pixel-heading text-transparent bg-clip-text bg-gradient-to-r from-[#00f0ff] via-[#9b5de5] to-[#f15bb5] leading-normal tracking-wide">
                SOLO LEVELING: SYSTEM
              </h1>
              <p className="text-[9px] text-[#00f0ff] tracking-widest font-pixel-heading mt-1">
                TACTICAL_HUD_V2.0 // STATUS: SYSTEM_ONLINE
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 items-center justify-end w-full lg:w-auto font-pixel-mono">
            <div className="bg-[#020205] border-2 border-yellow-700/60 px-3 py-1.5 rounded-none flex items-center gap-2.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.5)]">
              <Coins className="text-yellow-500 w-4 h-4 animate-pulse" />
              <div className="flex flex-col leading-none">
                <span className="text-[8px] text-yellow-600 font-pixel-heading tracking-tight">SYS_GOLD</span>
                <span className="text-base font-bold text-yellow-400 mt-0.5">
                  {fN(player.gold)}
                </span>
              </div>
            </div>
            <div className="bg-[#020205] border-2 border-cyan-800 px-3 py-1.5 rounded-none flex items-center gap-2.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.5)]">
              <Gem className="text-[#00f0ff] w-4 h-4 animate-pulse" />
              <div className="flex flex-col leading-none">
                <span className="text-[8px] text-cyan-600 font-pixel-heading tracking-tight">SYS_CRYSTALS</span>
                <span className="text-base font-bold text-[#00f0ff] mt-0.5">
                  {fN(player.crystals)}
                </span>
              </div>
            </div>
            <div className="bg-[#020205] border-2 border-purple-800 px-3 py-1.5 rounded-none flex items-center gap-2.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.5)]">
              <Skull className="text-[#9b5de5] w-4 h-4 animate-pulse" />
              <div className="flex flex-col leading-none">
                <span className="text-[8px] text-purple-600 font-pixel-heading tracking-tight">SYS_SECRETS</span>
                <span className="text-base font-bold text-[#9b5de5] mt-0.5">
                  {fN(player.gachaPoints)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* DETAILED NOTIFICATION GRID */}
      <div
        id="system-notification-container"
        className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none"
      >
        <AnimatePresence>
          {notifications.map(n => (
            <motion.div
              key={n.id}
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 50, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className={`border-l-4 p-4 rounded-r-lg flex gap-3 items-start pointer-events-auto shadow-lg backdrop-blur-md font-mono ${
                n.type === "red"
                  ? "border-red-500 bg-slate-950/95 shadow-[0_0_15px_rgba(239,68,68,0.35)]"
                  : n.type === "purple"
                  ? "border-purple-500 bg-slate-950/95 shadow-[0_0_15px_rgba(139,92,246,0.35)]"
                  : n.type === "gold"
                  ? "border-yellow-500 bg-slate-950/95 shadow-[0_0_20px_rgba(234,179,8,0.4)] text-yellow-100"
                  : "border-blue-500 bg-slate-950/95 shadow-[0_0_15px_rgba(59,130,246,0.35)]"
              }`}
            >
              <div className="mt-0.5">
                {n.type === "red" ? (
                  <ShieldAlert className="w-4 h-4 text-red-500 animate-pulse" />
                ) : n.type === "gold" ? (
                  <Crown className="w-4 h-4 text-yellow-500 animate-bounce" />
                ) : (
                  <Bell className="w-4 h-4 text-blue-400" />
                )}
              </div>
              <div className="flex-1">
                <h5 className="text-[11px] font-black uppercase tracking-wider text-white">
                  {n.title}
                </h5>
                <p className="text-[10px] text-slate-300 mt-1 leading-relaxed">
                  {n.message}
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* CORE GRID MAIN WORKSPACE */}
      <main className="max-w-6xl w-full mx-auto p-4 flex-grow grid grid-cols-1 lg:grid-cols-4 gap-6 z-10 relative">
        {/* CHARACTER STATS MODULE (LEFT CARD RAIL) */}
        <section className="lg:col-span-1 bg-slate-950 border-4 border-double border-slate-800 p-5 flex flex-col gap-4 self-start shadow-[2px_2px_0px_0px_rgba(0,0,0,0.5)] font-pixel-mono">
          <div
            id="char-card-bg"
            className={`relative overflow-hidden bg-[#020205] p-4 flex flex-col gap-3.5 border-2 transition-all duration-305 rounded-none ${
              player.godPath === "Monarca"
                ? "border-purple-500 shadow-[2px_2px_0px_0px_rgba(168,85,247,0.35)]"
                : player.godPath === "Estelar"
                ? "border-orange-500 shadow-[2px_2px_0px_0px_rgba(249,115,22,0.35)]"
                : player.level >= 100
                ? "border-cyan-500 shadow-[2px_2px_0px_0px_rgba(6,182,212,0.3)]"
                : "border-slate-800 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.4)]"
            }`}
          >
            <div className="absolute -right-6 -bottom-6 opacity-[0.04] pointer-events-none">
              <Skull className="w-32 h-32" />
            </div>

            <div className="flex justify-between items-start z-10">
              <div>
                <span className="text-[8px] uppercase font-pixel-heading tracking-widest text-blue-400 block pb-1">
                  {player.godPath ? "DIVINDADE" : player.level >= 100 ? "TRANSCENDENTE" : "CAÇADOR"}
                </span>
                <h2 className="text-sm font-pixel-heading tracking-wider text-slate-100">
                  Sung Jin-Woo
                </h2>
              </div>
              <div
                className={`text-sm font-pixel-heading px-2 py-1.5 border-2 rounded-none font-bold tracking-tight text-center min-w-[3rem] ${
                  RANK_COLORS[player?.level >= 200 ? "Deus" : getPlayerRank()] || "text-slate-400 border-slate-700 bg-slate-950"
                }`}
              >
                {player.level >= 200 ? "Ω" : getPlayerRank()}
              </div>
            </div>

            {/* CLASS COMPONENT SIGNATURE */}
            <div className="border-t border-slate-800 pt-2 z-10 font-pixel-mono">
              <span className="text-[8px] text-slate-500 block uppercase font-pixel-heading tracking-wider">
                Classe Sintonizada
              </span>
              <span className="text-xs font-bold text-slate-200">
                {player.class ? `${player.class}` : "Sem Classe (Humano)"}
              </span>
            </div>

            {/* HP PROGRESS BAR */}
            <div className="flex flex-col gap-1.5 z-10 w-full">
              <div className="flex justify-between text-[11px] font-bold">
                <span className="text-red-400">HP</span>
                <span className="text-slate-350">
                  {fN(player.hp)} / {fN(maxHP)}
                </span>
              </div>
              <div className="flex gap-[2px] w-full" style={{ imageRendering: "pixelated" }}>
                {Array.from({ length: 12 }).map((_, idx) => {
                  const active = idx < Math.round((player.hp / maxHP) * 12);
                  return (
                    <div
                      key={idx}
                      className={`h-2.5 flex-1 border border-black`}
                      style={{
                        backgroundColor: active ? "#ef4444" : "#030712",
                        boxShadow: "inset -1px -1px 0px 0px rgba(0,0,0,0.5)"
                      }}
                    />
                  );
                })}
              </div>
            </div>

            {/* MP PROGRESS BAR */}
            <div className="flex flex-col gap-1.5 z-10 w-full">
              <div className="flex justify-between text-[11px] font-bold">
                <span className="text-blue-400">MANA</span>
                <span className="text-slate-350">
                  {fN(player.mp)} / {fN(maxMP)}
                </span>
              </div>
              <div className="flex gap-[2px] w-full" style={{ imageRendering: "pixelated" }}>
                {Array.from({ length: 12 }).map((_, idx) => {
                  const active = idx < Math.round((player.mp / maxMP) * 12);
                  return (
                    <div
                      key={idx}
                      className={`h-2.5 flex-1 border border-black`}
                      style={{
                        backgroundColor: active ? "#3b82f6" : "#030712",
                        boxShadow: "inset -1px -1px 0px 0px rgba(0,0,0,0.5)"
                      }}
                    />
                  );
                })}
              </div>
            </div>

            {/* LEVEL PROGRESS BAR */}
            <div className="flex flex-col gap-1.5 z-10 w-full">
              <div className="flex justify-between text-[11px] font-bold">
                <span className="text-purple-400">XP</span>
                <span className="text-slate-350">
                  {fN(player.xp)} / {fN(reqXp)}
                </span>
              </div>
              <div className="flex gap-[2px] w-full" style={{ imageRendering: "pixelated" }}>
                {Array.from({ length: 12 }).map((_, idx) => {
                  const active = idx < Math.round((player.xp / reqXp) * 12);
                  return (
                    <div
                      key={idx}
                      className={`h-2 flex-1 border border-black`}
                      style={{
                        backgroundColor: active ? "#a855f7" : "#030712",
                        boxShadow: "inset -1px -1px 0px 0px rgba(0,0,0,0.5)"
                      }}
                    />
                  );
                })}
              </div>
            </div>

            <div className="flex justify-between text-xs text-slate-550 pt-2 border-t border-slate-900 mt-1 z-10">
              <span>
                Nível: <strong className="text-white font-bold">{player.level}</strong>
              </span>
              <span>
                Meta:{" "}
                <strong className="text-blue-405 font-bold uppercase tracking-wider text-[10px]">
                  {player.level >= 200 ? "Ápice" : "Meta"}
                </strong>
              </span>
            </div>
          </div>

          {/* QUICK RECOVERY ACTIONS */}
          <div className="grid grid-cols-2 gap-2 mt-1">
            <button
              onClick={() => handleUsePotion("hp")}
              className="bg-slate-950 hover:bg-[#090204] border-2 border-slate-800 text-[10px] py-2.5 rounded-none transition flex flex-col items-center justify-center gap-1.5 cursor-pointer shadow-[2px_2px_0px_0px_#450a0a]"
            >
              <Heart className="w-3.5 h-3.5 text-red-500 animate-pulse" />
              <span className="text-slate-300 font-bold">
                Vida ({player.potions.hp})
              </span>
            </button>
            <button
              onClick={() => handleUsePotion("mp")}
              className="bg-slate-950 hover:bg-[#020509] border-2 border-slate-800 text-[10px] py-2.5 rounded-none transition flex flex-col items-center justify-center gap-1.5 cursor-pointer shadow-[2px_2px_0px_0px_#1e3a8a]"
            >
              <Sparkles className="w-3.5 h-3.5 text-blue-400 animate-pulse" />
              <span className="text-slate-300 font-bold">
                Mana ({player.potions.mp})
              </span>
            </button>
          </div>

          <div className="text-[10px] text-center text-slate-600 mt-1 pt-2 border-t border-slate-900 flex justify-between px-1">
            <span>💾 Auto-Salvar</span>
            <button
              onClick={handleResetGame}
              className="text-red-500/80 hover:text-red-400 border-b border-red-950 cursor-pointer"
            >
              Resetar Tudo
            </button>
          </div>
        </section>

        {/* INTERACTIVE WORKSPACE GRID (RIGHT DECADE RAIL) */}
        <section className="lg:col-span-3 flex flex-col gap-4">
          <nav className="flex flex-wrap gap-2 border-b-2 border-slate-950 pb-2.5">
            {[
              { id: "status", label: "STATUS", icon: User },
              { id: "inventario", label: "INVENTÁRIO", icon: Backpack },
              { id: "portais", label: "PORTAIS", icon: Compass },
              { id: "classe", label: "DOMÍNIO", icon: Crown, requiresSummoner: true },
              { id: "melhorias", label: "SISTEMA", icon: TrendingUp },
              { id: "treinamento", label: "DIÁRIA", icon: Award },
              { id: "loja", label: "LOJA", icon: ShoppingCart },
              { id: "gacha", label: "DESPERTAR", icon: Dices },
              { id: "oraculo", label: "ORÁCULO 🌌", icon: Sparkles },
            ].map(tab => {
              const Icon = tab.icon;
              const hasSummoner =
                player.class && CLASSES_DATA[player.class]?.summoner;
              
              if (tab.requiresSummoner && !hasSummoner) return null;

              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3 py-2 text-[8px] font-pixel-heading transition flex items-center gap-1.5 rounded-none border-2 ${
                    isActive
                      ? "bg-purple-900 text-purple-150 border-purple-500 shadow-[2px_2px_0px_0px_#1e1b4b]"
                      : "bg-slate-950 text-slate-400 border-slate-800 hover:bg-[#0b0813] hover:text-slate-200 cursor-pointer"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {tab.label}
                </button>
              );
            })}
          </nav>

          {/* ACTIVE TAB VIEWS */}
          <div className="bg-[#020205] border-4 border-slate-800 rounded-none p-5 min-h-[500px] relative overflow-hidden" style={{ boxShadow: "4px 4px 0px #000000, inset 2px 2px 0px #1f2937" }}>
            {activeTab === "status" && (
              <StatusTab
                player={player}
                onAllocateStat={handleAllocateStat}
                onAscend={handleAscend}
                getDmg={getDmg}
                getCritChance={getCritChance}
                getDef={getDef}
                getSkillPower={getSkillPower}
              />
            )}
            {activeTab === "inventario" && (
              <InventoryTab
                player={player}
                onEquip={handleEquip}
                onUnequip={handleUnequip}
                onUsePotion={handleUsePotion}
                onSellItem={handleSellItem}
                onShowNotification={triggerNotification}
              />
            )}
            {activeTab === "portais" && (
              <PortalsTab
                player={player}
                activeCombat={activeCombat}
                combatLogs={combatLogs}
                onStartRaid={handleStartRaid}
                onEscape={handleEscape}
                onExecuteAttack={handleExecuteAttack}
                getDmg={getDmg}
                getCritChance={getCritChance}
                getSkillPower={getSkillPower}
                getPlayerRank={getPlayerRank}
                compareRanks={compareRanks}
              />
            )}
            {activeTab === "classe" && (
              <DomainTab
                player={player}
                onSummonShadowGeneral={handleSummonShadowGeneral}
                onTransmuteDragon={handleTransmuteDragon}
                onDismissSummon={handleDismissSummon}
              />
            )}
            {activeTab === "melhorias" && (
              <UpgradesTab player={player} onBuyUpgrade={handleBuyUpgrade} />
            )}
            {activeTab === "treinamento" && (
              <TreinoTab
                player={player}
                onExecuteTrainingClick={handleExecuteTrainingClick}
              />
            )}
            {activeTab === "loja" && (
              <LojaTab player={player} onBuyItem={handleBuyItem} />
            )}
            {activeTab === "gacha" && (
              <DespertarTab
                player={player}
                onPullGacha={handlePullGacha}
                onSelectClass={handleSelectClass}
                lastGachaResult={lastGachaResult}
              />
            )}
            {activeTab === "oraculo" && (
              <OraculoTab
                player={player}
                getPlayerRank={getPlayerRank}
                onShowNotification={triggerNotification}
              />
            )}
          </div>
        </section>
      </main>

      {/* SYSTEM CODON FOOTER */}
      <footer className="bg-slate-950/80 border-t border-slate-900/60 p-4 text-center text-[10px] text-slate-500 backdrop-blur-md z-10 relative mt-6">
        <div className="max-w-6xl mx-auto flex justify-between items-center flex-wrap gap-2">
          <span>
            © Solo Leveling: Ascensão Cósmica. Sistema expandido até o grau Divino.
          </span>
          <span className="font-mono text-slate-650">
            Coded in React 19 + Express Server-Side Proxy Security Architecture
          </span>
        </div>
      </footer>
    </div>
  );
}
