import React, { useState } from "react";
import { Player, ShopItem } from "../types";
import { SHOP_DB } from "../data";
import { Sparkles, Coins, Check, Loader2 } from "lucide-react";

interface InventoryTabProps {
  player: Player;
  onEquip: (itemId: string, slot: 'weapon' | 'accessory' | 'skill') => void;
  onUnequip: (slot: 'weapon' | 'accessory' | 'skill') => void;
  onUsePotion: (type: 'hp' | 'mp') => void;
  onSellItem: (index: number, val: number) => void;
  onShowNotification: (title: string, msg: string, type: 'blue' | 'red' | 'purple' | 'gold') => void;
}

export function InventoryTab({
  player,
  onEquip,
  onUnequip,
  onUsePotion,
  onSellItem,
  onShowNotification,
}: InventoryTabProps) {
  const [activeFilter, setActiveFilter] = useState<'all' | 'equip' | 'accessory' | 'skill' | 'consumable'>('all');
  const [loadingLore, setLoadingLore] = useState<Record<string, boolean>>({});
  const [lores, setLores] = useState<Record<string, string>>({});

  const fN = (num: number) => Math.floor(num).toLocaleString("pt-BR");

  async function handleReadAura(itemId: string, itemName: string, itemRank: string, uniqueKey: string) {
    if (loadingLore[uniqueKey]) return;
    setLoadingLore(prev => ({ ...prev, [uniqueKey]: true }));
    try {
      const response = await fetch("/api/aura", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemName, itemRank })
      });
      if (!response.ok) {
        throw new Error("Resposta do servidor não foi bem-sucedida.");
      }
      const data = await response.json();
      if (data.error) throw new Error(data.error);
      
      setLores(prev => ({ ...prev, [uniqueKey]: data.text }));
      onShowNotification("AURA REVELADA", `Ressonância com ${itemName} concluída!`, "purple");
    } catch (err: any) {
      console.error(err);
      setLores(prev => ({ ...prev, [uniqueKey]: "[ERRO DO SISTEMA] A fenda de transmissão com o Oráculo fechou abruptamente. Sinal obstruído." }));
      onShowNotification("ERRO DO SISTEMA", "Não foi possível ressoar com o Oráculo.", "red");
    } finally {
      setLoadingLore(prev => ({ ...prev, [uniqueKey]: false }));
    }
  }

  // Compile items to display
  let itemsToDisplay: Array<{
    id: string;
    index: number;
    name: string;
    rank: string;
    category: 'equip' | 'accessory' | 'skill' | 'consumable';
    qty: number;
    stat?: string;
    val?: number;
    desc?: string;
    mpCost?: number;
    dmgMult?: number;
    cost: number;
  }> = [];

  player.inventory.forEach((item, index) => {
    let dbItem: ShopItem | undefined;
    if (item.category === 'equip') dbItem = SHOP_DB.equip.find(i => i.id === item.id);
    if (item.category === 'accessory') dbItem = SHOP_DB.accessory.find(i => i.id === item.id);
    if (item.category === 'skill') dbItem = SHOP_DB.skill.find(i => i.id === item.id);
    if (item.category === 'consumable') dbItem = SHOP_DB.consumable.find(i => i.id === item.id);

    if (dbItem) {
      itemsToDisplay.push({
        id: item.id,
        index: index,
        name: dbItem.name,
        rank: dbItem.rank,
        category: item.category as any,
        qty: item.qty || 1,
        stat: dbItem.stat,
        val: dbItem.val,
        desc: dbItem.desc,
        mpCost: dbItem.mpCost,
        dmgMult: dbItem.dmgMult,
        cost: dbItem.cost,
      });
    }
  });

  // Inject virtual potion items if they are in standard stats
  if (activeFilter === 'all' || activeFilter === 'consumable') {
    if (player.potions.hp > 0) {
      itemsToDisplay.push({
        id: 'p_hp_standard',
        index: -1,
        name: 'Poção de HP Completa',
        rank: 'E',
        category: 'consumable',
        qty: player.potions.hp,
        desc: 'Restaura 100% de Vida instantaneamente.',
        cost: 50,
      });
    }
    if (player.potions.mp > 0) {
      itemsToDisplay.push({
        id: 'p_mp_standard',
        index: -2,
        name: 'Poção de MP Completa',
        rank: 'E',
        category: 'consumable',
        qty: player.potions.mp,
        desc: 'Restaura 100% de Mana instantaneamente.',
        cost: 50,
      });
    }
  }

  if (activeFilter !== 'all') {
    itemsToDisplay = itemsToDisplay.filter(i => i.category === activeFilter);
  }

  const getRankBadgeClass = (rank: string) => {
    const RANK_COLORS: Record<string, string> = {
      'E': 'text-slate-400 border-slate-700 bg-slate-950',
      'D': 'text-emerald-400 border-emerald-850 bg-slate-950',
      'C': 'text-blue-400 border-blue-800 bg-slate-950',
      'B': 'text-indigo-400 border-indigo-800 bg-slate-950',
      'A': 'text-yellow-500 border-yellow-700 bg-slate-950',
      'S': 'text-red-500 border-red-700 bg-slate-950',
      'SS': 'text-purple-400 border-purple-700 bg-slate-950 font-bold',
      'SSS': 'text-fuchsia-400 border-fuchsia-700 bg-slate-950 font-bold',
      'N': 'text-cyan-400 border-cyan-700 bg-slate-950 font-bold',
      'N+': 'text-cyan-350 border-cyan-550 bg-slate-950 font-black',
      'FE': 'text-orange-400 border-orange-755 bg-slate-950 font-bold',
      'FE+': 'text-orange-350 border-orange-550 bg-slate-950 font-black',
      'M': 'text-rose-500 border-rose-800 bg-slate-950 font-bold',
      'M+': 'text-rose-455 border-rose-600 bg-slate-950 font-black',
      'Deus': 'text-yellow-300 border-yellow-500 bg-slate-950 font-black'
    };
    return RANK_COLORS[rank] || RANK_COLORS['E'];
  };

  return (
    <div id="tab-inventario" className="flex flex-col gap-5 font-pixel-mono text-lg">
      <div className="flex justify-between items-center border-b-4 border-double border-slate-700 pb-3">
        <div>
          <h3 className="text-sm font-pixel-heading tracking-widest text-[#a78bfa] uppercase">
            Cofre Dimensional
          </h3>
          <p className="text-xs text-slate-400 mt-1 text-base font-pixel-mono">
            Gerencie artefatos, técnicas e consumíveis obtidos de fendas cósmicas.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 border-b-2 border-slate-950 pb-3">
        {(['all', 'equip', 'accessory', 'skill', 'consumable'] as const).map(filter => {
          const labels = {
            all: 'Todos',
            equip: 'Armas',
            accessory: 'Acessórios',
            skill: 'Técnicas',
            consumable: 'Consumíveis',
          };
          const isActive = activeFilter === filter;
          return (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-3 py-1 text-[8px] font-pixel-heading uppercase tracking-wide transition rounded-none border-2 ${
                isActive
                  ? "bg-purple-900 text-purple-150 border-purple-500 shadow-[2px_2px_0px_0px_#1e1b4b]"
                  : "bg-slate-950 text-slate-400 border-slate-800 hover:bg-slate-900 cursor-pointer"
              }`}
            >
              {labels[filter]}
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {itemsToDisplay.length === 0 ? (
          <p className="text-xs text-slate-500 italic col-span-2 text-center py-12 bg-slate-950 border-2 border-slate-900 rounded-none font-pixel-mono">
            Cofre dimensional sem registros para esta categoria.
          </p>
        ) : (
          itemsToDisplay.map((item, mapIdx) => {
            const uniqueKey = `${item.category}-${item.id}-${item.index}-${mapIdx}`;
            
            let statsDesc = "";
            let isEquipped = false;
            let actionBtn = null;

            if (item.category === 'equip') {
              statsDesc = `FORÇA +${fN(item.val || 0)}`;
              isEquipped = player.equipped.weapon === item.id;
              actionBtn = isEquipped ? (
                <button
                  onClick={() => onUnequip('weapon')}
                  className="px-3 py-1.5 bg-red-950 text-red-450 hover:bg-red-900 border-2 border-red-800 font-pixel-heading text-[8px] uppercase tracking-wider rounded-none cursor-pointer shadow-[2px_2px_0px_0px_#450a0a]"
                >
                  Desequipar
                </button>
              ) : (
                <button
                  onClick={() => onEquip(item.id, 'weapon')}
                  className="px-3 py-1.5 bg-purple-950 text-purple-200 hover:bg-purple-900 border-2 border-purple-500 font-pixel-heading text-[8px] uppercase tracking-wider rounded-none cursor-pointer shadow-[2px_2px_0px_0px_#1e1b4b]"
                >
                  Equipar
                </button>
              );
            } else if (item.category === 'accessory') {
              const label: Record<string, string> = { str: 'FOR', agi: 'AGI', vit: 'VIT', int: 'INT' };
              statsDesc = `${label[item.stat || "vit"]} +${fN(item.val || 0)}`;
              isEquipped = player.equipped.accessory === item.id;
              actionBtn = isEquipped ? (
                <button
                  onClick={() => onUnequip('accessory')}
                  className="px-3 py-1.5 bg-red-950 text-red-450 hover:bg-red-900 border-2 border-red-800 font-pixel-heading text-[8px] uppercase tracking-wider rounded-none cursor-pointer shadow-[2px_2px_0px_0px_#450a0a]"
                >
                  Desequipar
                </button>
              ) : (
                <button
                  onClick={() => onEquip(item.id, 'accessory')}
                  className="px-3 py-1.5 bg-purple-950 text-purple-200 hover:bg-purple-900 border-2 border-purple-500 font-pixel-heading text-[8px] uppercase tracking-wider rounded-none cursor-pointer shadow-[2px_2px_0px_0px_#1e1b4b]"
                >
                  Equipar
                </button>
              );
            } else if (item.category === 'skill') {
              statsDesc = `MP Gasto: ${fN(item.mpCost || 0)} | Multiplicador Dano: x${(item.dmgMult || 0).toFixed(1)}`;
              isEquipped = player.equipped.skill === item.id;
              actionBtn = isEquipped ? (
                <button
                  onClick={() => onUnequip('skill')}
                  className="px-3 py-1.5 bg-red-950 text-red-450 hover:bg-red-900 border-2 border-red-800 font-pixel-heading text-[8px] uppercase tracking-wider rounded-none cursor-pointer shadow-[2px_2px_0px_0px_#450a0a]"
                >
                  Remover
                </button>
              ) : (
                <button
                  onClick={() => onEquip(item.id, 'skill')}
                  className="px-3 py-1.5 bg-indigo-950 text-indigo-200 hover:bg-indigo-900 border-2 border-indigo-500 font-pixel-heading text-[8px] uppercase tracking-wider rounded-none cursor-pointer shadow-[2px_2px_0px_0px_#1e1b4b]"
                >
                  Memorizar
                </button>
              );
            } else if (item.category === 'consumable') {
              statsDesc = item.desc || "";
              const pType = item.id.includes('hp') ? 'hp' : 'mp';
              actionBtn = (
                <button
                  onClick={() => onUsePotion(pType)}
                  className="px-3 py-1.5 bg-emerald-950 text-emerald-400 hover:bg-emerald-900 border-2 border-emerald-600 font-pixel-heading text-[8px] uppercase tracking-wider rounded-none cursor-pointer shadow-[2px_2px_0px_0px_#064e3b]"
                >
                  Ingerir
                </button>
              );
            }

            const sellValue = Math.floor(item.cost * 0.4);
            const canBeSold = item.index >= 0 && !isEquipped && item.id !== 'p_core_quasar';

            return (
              <div
                key={uniqueKey}
                className="bg-slate-950 border-2 border-slate-800 p-4 rounded-none flex flex-col justify-between gap-3 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.5)] relative"
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 text-[8px] font-pixel-heading rounded-none border-2 ${getRankBadgeClass(item.rank)}`}>
                      {item.rank}
                    </span>
                    <span className="text-sm font-bold text-slate-100 font-pixel-mono">{item.name}</span>
                    {item.qty > 1 && (
                      <span className="text-xs bg-slate-900 border border-slate-700 px-1.5 py-0.5 rounded-none text-slate-300 font-mono font-bold">
                        x{fN(item.qty)}
                      </span>
                    )}
                  </div>
                  {isEquipped && (
                    <span className="px-2 py-0.5 bg-emerald-950 border border-emerald-600 text-emerald-400 rounded-none text-[8px] font-pixel-heading tracking-widest uppercase shadow">
                      ATIVO
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-400 font-pixel-mono mt-1 bg-[#020205] border border-slate-900 p-2 rounded-none leading-relaxed">
                  {statsDesc}
                </p>

                {/* Relic Lore Content */}
                {lores[uniqueKey] && (
                  <div className="mt-1 p-2.5 bg-purple-950/20 border border-purple-900/60 rounded-none text-xs text-purple-300 italic font-pixel-mono leading-relaxed whitespace-pre-wrap">
                    {lores[uniqueKey]}
                  </div>
                )}

                <div className="flex justify-between items-center mt-2 pt-2 border-t border-slate-900">
                  <div className="flex gap-2">
                    {canBeSold && (
                      <button
                        onClick={() => onSellItem(item.index, sellValue)}
                        className="text-[8px] text-yellow-500 hover:bg-yellow-950/20 hover:text-yellow-400 font-pixel-heading flex items-center gap-1 border-2 border-yellow-900/50 bg-[#070702] px-2 py-1 rounded-none transition"
                      >
                        <Coins className="w-3 h-3 text-yellow-500" /> Vender: {fN(sellValue)}
                      </button>
                    )}
                    {item.id !== 'p_hp_standard' && item.id !== 'p_mp_standard' && (
                      <button
                        disabled={loadingLore[uniqueKey]}
                        onClick={() => handleReadAura(item.id, item.name, item.rank, uniqueKey)}
                        className={`text-[8px] font-pixel-heading flex items-center gap-1 border-2 px-2 py-1 rounded-none transition leading-none ${
                          lores[uniqueKey]
                            ? "border-emerald-800 bg-[#020704] text-emerald-400 cursor-default"
                            : "border-purple-800 bg-[#060207] text-purple-400 hover:bg-purple-950/40 cursor-pointer"
                        }`}
                      >
                        {loadingLore[uniqueKey] ? (
                          <>
                            <Loader2 className="w-3 h-3 animate-spin" /> ...
                          </>
                        ) : lores[uniqueKey] ? (
                          <>
                            <Check className="w-3 h-3" /> Aura
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-3 h-3 animate-pulse" /> Revelar Aura
                          </>
                        )}
                      </button>
                    )}
                  </div>
                  <div className="ml-auto flex gap-2">{actionBtn}</div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
export default InventoryTab;
