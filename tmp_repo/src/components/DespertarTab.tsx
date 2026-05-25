import React, { useState } from "react";
import { Player } from "../types";
import { CLASSES_DATA, RANK_COLORS } from "../data";
import { Star, Dices, Sparkles } from "lucide-react";

interface DespertarTabProps {
  player: Player;
  onPullGacha: () => void;
  onSelectClass: (className: string) => void;
  lastGachaResult: React.ReactNode;
}

export function DespertarTab({
  player,
  onPullGacha,
  onSelectClass,
  lastGachaResult,
}: DespertarTabProps) {
  const fN = (num: number) => Math.floor(num).toLocaleString("pt-BR");

  return (
    <div id="tab-gacha" className="flex flex-col gap-5 font-pixel-mono text-lg">
      <div className="border-b-4 border-double border-slate-700 pb-3">
        <h3 className="text-sm font-pixel-heading text-[#a78bfa] tracking-widest uppercase flex items-center gap-2">
          <Star className="w-4 h-4 text-yellow-400" /> Altar do Despertar Sombrio
        </h3>
        <p className="text-xs text-slate-400 mt-1 text-base font-pixel-mono leading-relaxed">
          Invoque as memórias de heróis do passado. Sacrifique Segredos recolhidos de anomalias para tentar ressonar com classes transcendentais e cósmicas.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start animate-fade-in">
        <div className="bg-slate-950 border-2 border-purple-900/50 p-6 rounded-none flex flex-col gap-4 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.55)] relative overflow-hidden">
          <div className="absolute -right-4 -top-4 opacity-10 pointer-events-none">
            <Dices className="w-32 h-32 text-purple-300" />
          </div>
          <h4 className="text-[10px] font-pixel-heading uppercase tracking-widest text-purple-300">
            Realizar Giração de Altar
          </h4>
          <p className="text-xs text-slate-400 leading-relaxed font-pixel-mono">
            Consuma Pontos Secretos para fundir-se com uma das classes do universo ampliado. Classes repetidas no Altar reembolsam imediatamente 5 Segredos.
          </p>

          <div className="text-xs font-pixel-mono bg-[#020205] p-3 border-2 border-slate-900 flex flex-col gap-1 text-slate-350 max-h-[160px] overflow-y-auto">
            <div className="text-purple-400 font-bold mb-1 font-pixel-heading text-[8px] tracking-wider uppercase">Taxas de Drop do Altar:</div>
            <div className="flex justify-between border-b border-slate-950 py-0.5">
              <span>E-C (Classes Básicas)</span> <span className="text-slate-400">70.0%</span>
            </div>
            <div className="flex justify-between border-b border-slate-950 py-0.5">
              <span>B-A (Avançadas)</span> <span className="text-blue-400">22.0%</span>
            </div>
            <div className="flex justify-between border-b border-slate-950 py-0.5">
              <span>S-SSS (Lendárias)</span> <span className="text-yellow-450 font-bold">6.5%</span>
            </div>
            <div className="flex justify-between border-b border-slate-950 py-0.5">
              <span>N-FE+ (Transcendentes)</span> <span className="text-orange-400 font-bold">1.4%</span>
            </div>
            <div className="flex justify-between border-b border-slate-950 py-0.5">
              <span>M-M+ (Ancestrais)</span>{" "}
              <span className="text-rose-455 font-bold">0.1%</span>
            </div>
            <div className="flex justify-between font-bold text-yellow-405 text-xs">
              <span>Ω Divino</span> <span className="text-yellow-500 uppercase">Ascensão</span>
            </div>
          </div>

          <div className="flex flex-col gap-2 mt-2 z-10">
            <div className="text-xs text-slate-400 text-center bg-[#020205] py-2 rounded-none border-2 border-slate-900">
              Custo de Despertar: <strong className="text-purple-300 font-bold">10 Segredos</strong> / Giro
            </div>
            <button
              onClick={onPullGacha}
              disabled={player.gachaPoints < 10}
              className={`py-3 bg-purple-950 text-white font-pixel-heading text-[10px] tracking-widest uppercase rounded-none border-2 transition flex items-center justify-center gap-2 ${
                player.gachaPoints >= 10
                  ? "bg-purple-950 hover:bg-purple-900 border-purple-500 shadow-[2px_2px_0px_0px_#1e1b4b] cursor-pointer"
                  : "bg-slate-950 border-slate-900 text-slate-650 cursor-not-allowed"
              }`}
            >
              <Sparkles className="w-4 h-4 text-purple-400 animate-pulse" /> Extrair Classe
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="bg-[#020205] border-4 border-double border-slate-800 p-5 rounded-none flex flex-col gap-1.5 min-h-[120px] justify-center items-center text-center shadow-inner">
            <span className="text-[8px] font-pixel-heading uppercase tracking-widest text-slate-550 block">
              Surgimento da Última Ressonância
            </span>
            <div
              id="gacha-result"
              className="text-xs md:text-sm text-slate-300 italic whitespace-normal leading-normal font-pixel-mono"
            >
              {lastGachaResult || "O altar está silencioso de momento."}
            </div>
          </div>

          <div className="bg-[#020205] p-4 border-2 border-slate-800 rounded-none shadow-[2px_2px_0px_0px_rgba(0,0,0,0.55)] min-h-[150px]">
            <h5 className="text-[8px] font-pixel-heading uppercase tracking-widest text-[#a78bfa] mb-3 border-b border-slate-900 pb-2">
              Seu Arquivo de Classes (Equipar Memória)
            </h5>
            <div className="flex flex-wrap gap-2 text-xs">
              {player.unlockedClasses.length === 0 ? (
                <span className="text-slate-500 italic text-xs p-4 text-center w-full block">
                  Nenhuma memória gravada ainda.
                </span>
              ) : (
                player.unlockedClasses.map(cls => {
                  const rank = CLASSES_DATA[cls]?.rank || "E";
                  const isActive = player.class === cls;
                  return (
                    <span
                      key={cls}
                      onClick={() => onSelectClass(cls)}
                      className={`px-3 py-1.5 border-2 rounded-none font-pixel-mono text-xs cursor-pointer hover:bg-slate-900 hover:text-white select-none ${
                        isActive
                          ? "border-blue-500 bg-[#020617] text-blue-300 shadow-[2px_2px_0px_0px_rgba(59,130,246,0.3)] ring-2 ring-blue-500/30"
                          : "border-slate-800 bg-slate-950 text-slate-450 shadow-[1px_1px_0px_0px_rgba(0,0,0,0.5)]"
                      }`}
                    >
                      {cls} [{rank}]
                    </span>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default DespertarTab;
