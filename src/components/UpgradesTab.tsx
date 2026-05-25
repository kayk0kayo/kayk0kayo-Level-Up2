import React from "react";
import { Player } from "../types";
import { UPGRADES_DB } from "../data";
import { Cpu, Coins } from "lucide-react";

interface UpgradesTabProps {
  player: Player;
  onBuyUpgrade: (upgradeId: string, cost: number) => void;
}

export function UpgradesTab({ player, onBuyUpgrade }: UpgradesTabProps) {
  const fN = (num: number) => Math.floor(num).toLocaleString("pt-BR");

  return (
    <div id="tab-melhorias" className="flex flex-col gap-5 font-pixel-mono text-lg font-normal">
      <div className="border-b-4 border-double border-slate-700 pb-3">
        <h3 className="text-sm font-pixel-heading text-[#a78bfa] tracking-widest uppercase flex items-center gap-2">
          <Cpu className="w-4 h-4 text-purple-400" /> Sistema Sombrio (Idle/Passivo)
        </h3>
        <p className="text-xs text-slate-400 mt-1 text-base font-pixel-mono">
          O Sistema Divino foi otimizado para expansão infinita. Gaste ouro obtido em fendas para aprimorar silenciosamente seus limitadores biológicos.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {UPGRADES_DB.map(up => {
          const currentLvl = (player.upgrades as any)[up.id] || 0;
          const cost = Math.floor(up.baseCost * Math.pow(up.mult, currentLvl));
          const canAfford = player.gold >= cost;

          return (
            <div
              key={up.id}
              className="bg-slate-950 border-2 border-slate-800 p-5 rounded-none flex flex-col justify-between gap-4 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.5)]"
            >
              <div>
                <div className="flex justify-between items-start mb-2 flex-wrap gap-2">
                  <h4 className="text-xs font-pixel-heading text-slate-100">{up.name}</h4>
                  <span className="text-[8px] text-blue-400 font-pixel-heading bg-slate-950 px-2 py-0.5 rounded-none border-2 border-blue-900">
                    Nv. {currentLvl}
                  </span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed font-pixel-mono">{up.desc}</p>
                <div className="text-xs text-emerald-450 font-bold font-pixel-mono mt-3 bg-[#020703] p-2 rounded-none inline-block border-2 border-emerald-900/60">
                  Status Atual: {up.format(currentLvl)}
                </div>
              </div>

              <button
                disabled={!canAfford}
                onClick={() => onBuyUpgrade(up.id, cost)}
                className={`w-full py-2.5 px-3.5 text-[8px] font-pixel-heading uppercase tracking-widest rounded-none transition flex justify-between items-center border-2 ${
                  canAfford
                    ? "bg-purple-950 hover:bg-purple-900 text-purple-200 border-purple-500 shadow-[2px_2px_0px_0px_#1e1b4b] cursor-pointer"
                    : "bg-slate-950 text-slate-650 border-slate-900 cursor-not-allowed"
                }`}
              >
                <span>Sincronizar Arquitetura</span>
                <span className="font-pixel-mono text-xs text-yellow-405 flex items-center gap-1 font-bold">
                  <Coins className="w-3 h-3 text-yellow-500" /> {fN(cost)}
                </span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
export default UpgradesTab;
