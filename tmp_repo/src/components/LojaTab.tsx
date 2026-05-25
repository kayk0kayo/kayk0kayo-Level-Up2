import React, { useState } from "react";
import { Player, ShopItem } from "../types";
import { SHOP_DB } from "../data";
import { Store, Coins } from "lucide-react";

interface LojaTabProps {
  player: Player;
  onBuyItem: (cat: string, id: string, cost: number) => void;
}

export function LojaTab({ player, onBuyItem }: LojaTabProps) {
  const [activeShopFilter, setActiveShopFilter] = useState<'equip' | 'accessory' | 'skill' | 'consumable'>('equip');
  const fN = (num: number) => Math.floor(num).toLocaleString("pt-BR");

  const list = SHOP_DB[activeShopFilter] || [];

  const getRankBadgeClass = (rank: string) => {
    const RANK_COLORS: Record<string, string> = {
      'E': 'text-slate-400 border-slate-700 bg-slate-950',
      'D': 'text-emerald-400 border-emerald-800 bg-slate-950',
      'C': 'text-blue-400 border-blue-800 bg-slate-950',
      'B': 'text-indigo-400 border-indigo-800 bg-slate-950',
      'A': 'text-yellow-500 border-yellow-700 bg-slate-950',
      'S': 'text-red-500 border-red-700 bg-slate-950',
      'SS': 'text-purple-400 border-purple-700 bg-slate-950 font-bold',
      'SSS': 'text-fuchsia-400 border-fuchsia-700 bg-slate-950 font-bold',
      'N': 'text-cyan-400 border-cyan-700 bg-slate-950 font-bold',
      'N+': 'text-cyan-350 border-cyan-500 bg-slate-950 font-black',
      'FE': 'text-orange-400 border-orange-700 bg-slate-950 font-bold',
      'FE+': 'text-orange-300 border-orange-500 bg-slate-950 font-black',
      'M': 'text-rose-500 border-rose-800 bg-slate-950 font-bold',
      'M+': 'text-rose-400 border-rose-600 bg-slate-950 font-black',
      'Deus': 'text-yellow-300 border-yellow-500 bg-slate-950 font-black'
    };
    return RANK_COLORS[rank] || RANK_COLORS['E'];
  };

  return (
    <div id="tab-loja" className="flex flex-col gap-5 font-pixel-mono text-lg">
      <div className="flex justify-between items-center border-b-4 border-double border-slate-700 pb-3">
        <div>
          <h3 className="text-sm font-pixel-heading text-[#a78bfa] uppercase tracking-widest flex items-center gap-2">
            <Store className="w-4 h-4 text-emerald-400" /> Mercado Negro de Caçadores
          </h3>
          <p className="text-xs text-slate-400 mt-1 text-base font-pixel-mono">
            Adquira armas, relíquias mágicas, técnicas especiais e poções de alquimia para romper fendas cósmicas.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 border-b-2 border-slate-950 pb-2">
        {(['equip', 'accessory', 'skill', 'consumable'] as const).map(filter => {
          const labels = {
            equip: 'Armas Físicas',
            accessory: 'Joias / Relíquias',
            skill: 'Técnicas (Livros)',
            consumable: 'Alquimia (Poções)',
          };
          const isActive = activeShopFilter === filter;
          return (
            <button
              key={filter}
              onClick={() => setActiveShopFilter(filter)}
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
        {list.map(item => {
          let statsDesc = "";
          let inInventory = player.inventory.some(i => i.id === item.id);

          if (activeShopFilter === 'equip') {
            statsDesc = `FORÇA REQUERIDA +${fN(item.val || 0)}`;
          } else if (activeShopFilter === 'accessory') {
            const label: Record<string, string> = { str: 'FOR', agi: 'AGI', vit: 'VIT', int: 'INT' };
            statsDesc = `Bônus: ${label[item.stat || "vit"]} +${fN(item.val || 0)}`;
          } else if (activeShopFilter === 'consumable') {
            statsDesc = item.desc || "";
          } else if (activeShopFilter === 'skill') {
            statsDesc = `Mult: x${(item.dmgMult || 0).toFixed(1)} | Consumo: ${fN(item.mpCost || 0)} Mana`;
          }

          const isUniqueOwned = inInventory && activeShopFilter === 'skill';
          const canAfford = player.gold >= item.cost;

          return (
            <div
              key={item.id}
              className="bg-slate-950 border-2 border-slate-800 p-5 rounded-none flex justify-between items-center gap-4 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.5)]"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                  <span className={`px-2 py-0.5 text-[8px] font-pixel-heading rounded-none border-2 ${getRankBadgeClass(item.rank)}`}>
                    {item.rank}
                  </span>
                  <span className="text-sm font-bold text-slate-100 font-pixel-mono truncate max-w-[200px]" title={item.name}>
                    {item.name}
                  </span>
                </div>
                <p className="text-xs text-slate-400 bg-[#020205] border border-slate-900 p-2 rounded-none inline-block font-pixel-mono leading-tight">
                  {statsDesc}
                </p>
              </div>

              <div>
                {isUniqueOwned ? (
                  <button
                    disabled
                    className="px-3 py-2 bg-slate-900 text-slate-600 border-2 border-slate-800 rounded-none text-[8px] font-pixel-heading uppercase tracking-widest cursor-not-allowed"
                  >
                    ATIVADO
                  </button>
                ) : (
                  <button
                    disabled={!canAfford}
                    onClick={() => onBuyItem(activeShopFilter, item.id, item.cost)}
                    className={`px-3 py-2 border-2 rounded-none font-pixel-heading uppercase text-[8px] tracking-widest shadow flex flex-col items-center gap-1 min-w-[90px] ${
                      canAfford
                        ? "bg-purple-950 border-purple-500 text-purple-200 hover:bg-purple-900 shadow-[2px_2px_0px_0px_#1e1b4b] cursor-pointer"
                        : "bg-slate-950 border-slate-900 text-slate-650 cursor-not-allowed"
                    }`}
                  >
                    <span>Comprar</span>
                    <span className="font-pixel-mono text-xs text-yellow-405 flex items-center gap-0.5 font-bold">
                      <Coins className="w-3 h-3 text-yellow-500" /> {fN(item.cost)}
                    </span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
export default LojaTab;
