import React from "react";
import { Player } from "../types";
import { Swords, Zap, Shield, Brain, Activity, Sun, Crown, Orbit } from "lucide-react";

interface StatusTabProps {
  player: Player;
  onAllocateStat: (stat: 'str' | 'agi' | 'vit' | 'int') => void;
  onAscend: (path: 'Monarca' | 'Estelar') => void;
  getDmg: () => number;
  getCritChance: () => number;
  getDef: () => number;
  getSkillPower: () => number;
}

export function StatusTab({
  player,
  onAllocateStat,
  onAscend,
  getDmg,
  getCritChance,
  getDef,
  getSkillPower,
}: StatusTabProps) {
  const fN = (num: number) => Math.floor(num).toLocaleString("pt-BR");

  return (
    <div id="tab-status" className="flex flex-col gap-6 font-pixel-mono text-lg">
      <div className="flex justify-between items-center border-b-4 border-double border-slate-700 pb-4">
        <div>
          <h3 className="text-sm font-pixel-heading tracking-widest text-[#a78bfa] uppercase">
            Atributos e Poder Base
          </h3>
          <p className="text-xs text-slate-400 mt-1 font-pixel-mono text-base">
            Distribua pontos para modelar seu crescimento dimensional e transcender limites.
          </p>
        </div>
        <div className="bg-slate-950 border-2 border-blue-500/80 px-4 py-2 rounded-none text-center min-w-[120px] shadow-[2px_2px_0px_0px_rgba(59,130,246,0.3)]">
          <span className="text-[9px] font-pixel-heading text-blue-400 uppercase tracking-widest block mb-1">
            Pontos
          </span>
          <span className="text-2xl font-bold text-white">
            {fN(player.statPoints)}
          </span>
        </div>
      </div>

      {/* Distribuidor de Pontos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Força */}
        <div className="bg-slate-950/80 p-4 rounded-none border-2 border-slate-800 flex items-center justify-between shadow-[2px_2px_0px_0px_rgba(0,0,0,0.5)]">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-950/50 border border-red-850 rounded-none">
              <Swords className="text-red-400 w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-pixel-heading block text-red-400">FORÇA (FOR)</span>
              <span className="text-xs text-slate-500 font-pixel-mono">+3 Dano Físico por pt</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="font-bold text-white text-2xl">
              {fN(player.stats.str)}
            </span>
            <button
              onClick={() => onAllocateStat("str")}
              disabled={player.statPoints <= 0}
              className={`w-8 h-8 flex items-center justify-center font-bold font-pixel-heading text-xs select-none ${
                player.statPoints > 0
                  ? "bg-purple-900 border-2 border-purple-500 text-white cursor-pointer hover:bg-purple-805"
                  : "bg-slate-900 border-2 border-slate-800 text-slate-600 cursor-not-allowed"
              }`}
              style={{ boxShadow: player.statPoints > 0 ? "2px 2px 0px 0px #1e1b4b" : "none" }}
            >
              +
            </button>
          </div>
        </div>

        {/* Agilidade */}
        <div className="bg-slate-950/80 p-4 rounded-none border-2 border-slate-800 flex items-center justify-between shadow-[2px_2px_0px_0px_rgba(0,0,0,0.5)]">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-950/50 border border-green-850 rounded-none">
              <Zap className="text-green-400 w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-pixel-heading block text-green-400">AGILIDADE (AGI)</span>
              <span className="text-xs text-slate-500 font-pixel-mono">+1% Chance Crítica (Cap: 80%)</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="font-bold text-white text-2xl">
              {fN(player.stats.agi)}
            </span>
            <button
              onClick={() => onAllocateStat("agi")}
              disabled={player.statPoints <= 0}
              className={`w-8 h-8 flex items-center justify-center font-bold font-pixel-heading text-xs select-none ${
                player.statPoints > 0
                  ? "bg-purple-900 border-2 border-purple-500 text-white cursor-pointer hover:bg-purple-805"
                  : "bg-slate-900 border-2 border-slate-800 text-slate-600 cursor-not-allowed"
              }`}
              style={{ boxShadow: player.statPoints > 0 ? "2px 2px 0px 0px #1e1b4b" : "none" }}
            >
              +
            </button>
          </div>
        </div>

        {/* Vitalidade */}
        <div className="bg-slate-950/80 p-4 rounded-none border-2 border-slate-800 flex items-center justify-between shadow-[2px_2px_0px_0px_rgba(0,0,0,0.5)]">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-950/50 border border-emerald-850 rounded-none">
              <Shield className="text-emerald-400 w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-pixel-heading block text-emerald-400">VITALIDADE (VIT)</span>
              <span className="text-xs text-slate-500 font-pixel-mono">+10 HP, +1.5 Def por pt</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="font-bold text-white text-2xl">
              {fN(player.stats.vit)}
            </span>
            <button
              onClick={() => onAllocateStat("vit")}
              disabled={player.statPoints <= 0}
              className={`w-8 h-8 flex items-center justify-center font-bold font-pixel-heading text-xs select-none ${
                player.statPoints > 0
                  ? "bg-purple-900 border-2 border-purple-500 text-white cursor-pointer hover:bg-purple-805"
                  : "bg-slate-900 border-2 border-slate-800 text-slate-600 cursor-not-allowed"
              }`}
              style={{ boxShadow: player.statPoints > 0 ? "2px 2px 0px 0px #1e1b4b" : "none" }}
            >
              +
            </button>
          </div>
        </div>

        {/* Inteligência */}
        <div className="bg-slate-950/80 p-4 rounded-none border-2 border-slate-800 flex items-center justify-between shadow-[2px_2px_0px_0px_rgba(0,0,0,0.5)]">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-950/50 border border-blue-850 rounded-none">
              <Brain className="text-blue-400 w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-pixel-heading block text-blue-400">INTELIGÊNCIA (INT)</span>
              <span className="text-xs text-slate-500 font-pixel-mono">+5 MP, +4 Magia por pt</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="font-bold text-white text-2xl">
              {fN(player.stats.int)}
            </span>
            <button
              onClick={() => onAllocateStat("int")}
              disabled={player.statPoints <= 0}
              className={`w-8 h-8 flex items-center justify-center font-bold font-pixel-heading text-xs select-none ${
                player.statPoints > 0
                  ? "bg-purple-900 border-2 border-purple-500 text-white cursor-pointer hover:bg-purple-805"
                  : "bg-slate-900 border-2 border-slate-800 text-slate-600 cursor-not-allowed"
              }`}
              style={{ boxShadow: player.statPoints > 0 ? "2px 2px 0px 0px #1e1b4b" : "none" }}
            >
              +
            </button>
          </div>
        </div>
      </div>

      {/* Resumo Estatístico Expandido */}
      <div className="bg-[#020205] border-4 border-double border-slate-800 p-5 rounded-none shadow-inner">
        <h4 className="text-xs font-pixel-heading uppercase tracking-widest text-slate-300 mb-4 flex items-center gap-2">
          <Activity className="w-4 h-4 text-purple-400" /> Painel Analítico de Combate
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-lg font-pixel-mono">
          <div className="bg-slate-950 border border-slate-800 p-3 rounded-none text-center">
            <span className="text-[10px] font-pixel-heading text-slate-500 block mb-1">Dano Base</span>
            <span className="text-xl font-bold text-red-500">{fN(getDmg())}</span>
          </div>
          <div className="bg-slate-950 border border-slate-800 p-3 rounded-none text-center">
            <span className="text-[10px] font-pixel-heading text-slate-500 block mb-1">Crítico</span>
            <span className="text-xl font-bold text-yellow-500">{getCritChance()}%</span>
          </div>
          <div className="bg-slate-950 border border-slate-800 p-3 rounded-none text-center">
            <span className="text-[10px] font-pixel-heading text-slate-500 block mb-1">Defesa</span>
            <span className="text-xl font-bold text-emerald-500">{fN(getDef())}</span>
          </div>
          <div className="bg-slate-950 border border-slate-800 p-3 rounded-none text-center">
            <span className="text-[10px] font-pixel-heading text-indigo-400 block mb-1">Magia</span>
            <span className="text-xl font-bold text-purple-500">{fN(getSkillPower())}</span>
          </div>
        </div>
      </div>

      {/* PAINEL DE ASCENSÃO DIVINA */}
      {player.level >= 200 && !player.godPath && (
        <div className="mt-4 p-6 border-4 border-double border-yellow-500 bg-[#070702] shadow-[4px_4px_0px_0px_#422006] relative overflow-hidden">
          <div className="absolute right-0 top-0 opacity-10 pointer-events-none">
            <Sun className="w-48 h-48 text-yellow-400 animate-spin" style={{ animationDuration: "30s" }} />
          </div>
          <h3 className="text-xs font-pixel-heading text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-500 uppercase tracking-widest mb-2 z-10 relative leading-normal">
            O Ápice do Universo Atingido
          </h3>
          <p className="text-sm text-slate-300 z-10 relative max-w-2xl leading-relaxed">
            Você quebrou todas as barreiras mortais e superou todos os limites conhecidos. Agora, o próprio tecido da realidade aguarda o seu comando. Escolha sua divindade para ascender ao topo definitivo da existência. <strong className="text-red-400">Esta escolha é permanente e moldará sua legião de servos.</strong>
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 z-10 relative">
            {/* Escolha Monarca */}
            <div className="bg-slate-950 border-2 border-purple-500 p-5 rounded-none flex flex-col items-center text-center gap-3 shadow-[2px_2px_0px_0px_#1e1b4b]">
              <div className="p-3 bg-purple-900/40 rounded-none border border-purple-500">
                <Crown className="w-8 h-8 text-purple-400" />
              </div>
              <h4 className="text-xs font-pixel-heading text-purple-300 uppercase tracking-widest">
                Deus Monarca
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed font-pixel-mono">
                A Autoridade Absoluta. Governe a morte, imponha sua vontade como lei universal e liderere o exército das sombras finais das fendas eternas.
              </p>
              <ul className="text-xs text-purple-200 font-pixel-mono text-left w-full bg-purple-950/20 p-2.5 rounded-none border border-purple-900/50 list-disc list-inside">
                <li>Classe Divina: Soberano da Vontade Divina</li>
                <li>Bônus Imensurável em Todos os Status (+20.000)</li>
                <li>Habilidade: Deleção Universal & Extração do Caos</li>
              </ul>
              <button
                onClick={() => onAscend("Monarca")}
                className="mt-auto w-full py-2.5 bg-gradient-to-r from-purple-800 to-indigo-900 hover:from-purple-700 hover:to-indigo-800 text-white font-pixel-heading text-[10px] tracking-widest rounded-none shadow-[2px_2px_0px_0px_#1e1b4b] cursor-pointer border border-purple-500"
              >
                Tornar-se Deus Monarca
              </button>
            </div>

            {/* Escolha Estelar */}
            <div className="bg-slate-950 border-2 border-orange-500 p-5 rounded-none flex flex-col items-center text-center gap-3 shadow-[2px_2px_0px_0px_#422006]">
              <div className="p-3 bg-orange-900/40 rounded-none border border-orange-500">
                <Orbit className="w-8 h-8 text-orange-400 animate-spin" />
              </div>
              <h4 className="text-xs font-pixel-heading text-orange-300 uppercase tracking-widest">
                Deus Estelar
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed font-pixel-mono">
                A Criação Pura. Manipule o espaço-tempo, forje novas estrelas para usar como armas cósmicas e dissipe buracos negros.
              </p>
              <ul className="text-xs text-orange-200 font-pixel-mono text-left w-full bg-orange-950/20 p-2.5 rounded-none border border-orange-900/50 list-disc list-inside">
                <li>Classe Divina: Forjador de Sóis</li>
                <li>Bônus Imensurável em Todos os Status (+20.000)</li>
                <li>Habilidade: Criador de Sóis & Transmutador de Cristais</li>
              </ul>
              <button
                onClick={() => onAscend("Estelar")}
                className="mt-auto w-full py-2.5 bg-gradient-to-r from-orange-850 to-red-900 hover:from-orange-755 hover:to-red-800 text-white font-pixel-heading text-[10px] tracking-widest rounded-none shadow-[2px_2px_0px_0px_#422006] cursor-pointer border border-orange-500"
              >
                Tornar-se Deus Estelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
