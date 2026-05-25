import React from "react";
import { Player, Invocation } from "../types";
import { CLASSES_DATA } from "../data";
import { Users, Trash2, Crown, Sparkles } from "lucide-react";

interface DomainTabProps {
  player: Player;
  onSummonShadowGeneral: () => void;
  onTransmuteDragon: (tier: 's' | 'm' | 'deus') => void;
  onDismissSummon: (index: number) => void;
}

export function DomainTab({
  player,
  onSummonShadowGeneral,
  onTransmuteDragon,
  onDismissSummon,
}: DomainTabProps) {
  const fN = (num: number) => Math.floor(num).toLocaleString("pt-BR");

  if (!player.class || !CLASSES_DATA[player.class]?.summoner) {
    return (
      <div className="p-8 text-center bg-slate-950 border-2 border-slate-905 rounded-none font-pixel-mono text-base">
        <p className="text-xs text-slate-500 italic leading-relaxed">
          O Domínio do Invocador está trancado. Escolha uma classe com a habilidade de invocação para manifestá-lo.
        </p>
      </div>
    );
  }

  const cData = CLASSES_DATA[player.class];
  const isShadowSummoner =
    cData.type?.includes("shadow") ||
    cData.type === "void" ||
    cData.type === "god_monarca";

  return (
    <div id="tab-classe" className="flex flex-col gap-5 font-pixel-mono text-lg">
      <div className="flex justify-between items-center border-b-4 border-double border-slate-700 pb-3">
        <div>
          <h3 className="text-sm font-pixel-heading text-purple-400 tracking-widest uppercase">
            Domínio do Governante: {player.class}
          </h3>
          <p className="text-xs text-slate-400 mt-1 text-base font-pixel-mono">
            Evoque entidades do abismo sombrio ou da criação celestial para somar seus atributos aos seus.
          </p>
        </div>
        <div className="bg-slate-950 border-2 border-purple-500/80 px-4 py-1.5 text-center min-w-[150px] shadow-[2px_2px_0px_0px_rgba(168,85,247,0.3)]">
          <span className="text-[8px] font-pixel-heading text-purple-400 block tracking-widest uppercase">
            {isShadowSummoner ? "Essência" : "Cristais"}
          </span>
          <span className="text-xl font-bold text-white">
            {isShadowSummoner ? fN(player.shadowPoder) : fN(player.crystals)}
          </span>
        </div>
      </div>

      {/* AÇÕES DE EXTRATAÇÃO OU ALQUIMIA */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 animate-fade-in">
        {isShadowSummoner ? (
          <>
            <div className="bg-slate-950 border-2 border-slate-800 p-5 rounded-none flex flex-col gap-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.55)]">
              <h4 className="text-[10px] font-pixel-heading uppercase tracking-wider text-purple-400">
                Extração Atômica Sombria
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed font-pixel-mono">
                Você extrai almas derrotando inimigos em portais normais (40% de chance passiva se for Monarca das Sombras, Lorde do Vazio ou Soberano Divino). Cada alma somada expandirá sua legião de servos.
              </p>
            </div>
            <div className="bg-slate-950 border-2 border-slate-800 p-5 rounded-none flex flex-col justify-between gap-3 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.55)]">
              <div>
                <h4 className="text-[10px] font-pixel-heading uppercase tracking-wider text-purple-400">
                  Forja do Caos Ancestral
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed font-pixel-mono">
                  Sacrifique parte do seu poder espiritual de Essência Sombria para forjar generais lendários de alto escalão celestiais.
                </p>
                <div className="text-[9px] font-pixel-heading text-purple-305 tracking-wider mt-2.5">
                  DISPONÍVEL: Beru, Igris e Bellion.
                </div>
              </div>
              <div className="flex justify-between items-center bg-[#020205] p-3 border-2 border-slate-900 mt-1">
                <span className="text-xs text-slate-400 font-pixel-mono">
                  Custo: <strong className="text-purple-400 font-bold">10K Almas</strong>
                </span>
                <button
                  onClick={onSummonShadowGeneral}
                  disabled={player.shadowPoder < 10000}
                  className={`px-3 py-1.5 text-[8px] font-pixel-heading uppercase tracking-widest rounded-none border-2 transition ${
                    player.shadowPoder >= 10000
                      ? "bg-purple-950 hover:bg-purple-900 border-purple-500 text-purple-200 shadow-[2px_2px_0px_0px_#1e1b4b] cursor-pointer"
                      : "bg-slate-950 border-slate-900 text-slate-650 cursor-not-allowed"
                  }`}
                >
                  Forjar Servo
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="bg-slate-950 border-2 border-slate-800 p-5 rounded-none flex flex-col gap-3 col-span-1 lg:col-span-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.55)]">
            <h4 className="text-[10px] font-pixel-heading uppercase tracking-wider text-orange-400">
              Forja da Criação Celestial
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed font-pixel-mono">
              Manipule Cristais estelares e Mana Base de caçador para sintetizar criaturas de alta densidade magitóxica de forma definitiva.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-2">
              {/* Dragão Infernal [S] */}
              <div className="p-4 bg-[#020205] border-2 border-slate-900 rounded-none relative overflow-hidden flex flex-col justify-between shadow-[1px_1px_0px_0px_rgba(0,0,0,0.5)]">
                <div>
                  <span className="text-xs font-bold block text-slate-100 font-pixel-mono">Dragão Infernal [S]</span>
                  <span className="text-[9px] text-slate-500 block mb-2 mt-0.5 font-pixel-heading uppercase tracking-wider">
                    FOR, VIT, AGI, INT +50
                  </span>
                </div>
                <div>
                  <span className="text-[9px] text-blue-400 font-pixel-mono block mb-2 font-bold uppercase tracking-wider">
                    15K Cristais & 5K MP
                  </span>
                  <button
                    onClick={() => onTransmuteDragon('s')}
                    className="w-full py-1.5 bg-purple-950 hover:bg-purple-900 border-2 border-purple-500 rounded-none text-[8px] font-pixel-heading uppercase tracking-widest text-[#a78bfa] shadow-[2px_2px_0px_0px_#1e1b4b] cursor-pointer"
                  >
                    Sintetizar
                  </button>
                </div>
              </div>

              {/* Leviatã Cósmico [M] */}
              <div className="p-4 bg-[#020205] border-2 border-slate-900 rounded-none relative overflow-hidden flex flex-col justify-between shadow-[1px_1px_0px_0px_rgba(0,0,0,0.5)]">
                <div>
                  <span className="text-xs font-bold block text-slate-100 font-pixel-mono">Leviatã Cósmico [M]</span>
                  <span className="text-[9px] text-slate-500 block mb-2 mt-0.5 font-pixel-heading uppercase tracking-wider">
                    Todos Stats +500K
                  </span>
                </div>
                <div>
                  <span className="text-[9px] text-blue-400 font-pixel-mono block mb-2 font-bold uppercase tracking-wider">
                    10M Cristais & 500K MP
                  </span>
                  <button
                    onClick={() => onTransmuteDragon('m')}
                    className="w-full py-1.5 bg-purple-950 hover:bg-purple-900 border-2 border-purple-500 rounded-none text-[8px] font-pixel-heading uppercase tracking-widest text-[#a78bfa] shadow-[2px_2px_0px_0px_#1e1b4b] cursor-pointer"
                  >
                    Sintetizar
                  </button>
                </div>
              </div>

              {/* Avatar do Sol Divino [Deus] */}
              <div className="p-4 bg-[#04040a] border-2 border-yellow-700/40 rounded-none relative overflow-hidden flex flex-col justify-between shadow-[2px_2px_0px_0px_#422006]">
                <div>
                  <span className="text-xs font-bold block text-yellow-300 font-pixel-mono">Avatar Estelar [Ω]</span>
                  <span className="text-[9px] text-yellow-500/80 block mb-2 mt-0.5 font-pixel-heading uppercase tracking-wider">
                    Todos Stats +5M
                  </span>
                </div>
                <div>
                  <span className="text-[9px] text-yellow-450 font-pixel-mono block mb-2 font-bold uppercase tracking-wider">
                    500M Cristais & 2M MP
                  </span>
                  <button
                    onClick={() => onTransmuteDragon('deus')}
                    className="w-full py-1.5 bg-orange-950 hover:bg-orange-900 border-2 border-orange-500 rounded-none text-[8px] font-pixel-heading uppercase tracking-widest text-orange-200 shadow-[2px_2px_0px_0px_#422006] cursor-pointer"
                  >
                    Sintetizar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* LISTA DE CONVOCAÇÕES ATIVAS */}
      <div className="bg-[#020205] p-5 border-4 border-double border-slate-800 rounded-none mt-2 shadow-inner">
        <h4 className="text-[10px] font-pixel-heading tracking-widest uppercase text-slate-300 mb-4 border-b border-slate-900 pb-2.5 flex items-center gap-2">
          <Users className="w-4 h-4 text-purple-400 animate-pulse" /> Servos Vinculados (Bônus Acoplado)
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {player.invocations.length === 0 ? (
            <p className="text-xs text-slate-500 italic col-span-3 text-center py-8 font-pixel-mono">
              A legião está vazia. Invoque servos ou extraia almas após portais para preenchê-la.
            </p>
          ) : (
            player.invocations.map((inv, index) => {
              let bonusTextPieces: string[] = [];
              if (inv.statBonus.str) bonusTextPieces.push(`FOR +${fN(inv.statBonus.str)}`);
              if (inv.statBonus.vit) bonusTextPieces.push(`VIT +${fN(inv.statBonus.vit)}`);
              if (inv.statBonus.agi) bonusTextPieces.push(`AGI +${fN(inv.statBonus.agi)}`);
              if (inv.statBonus.int) bonusTextPieces.push(`INT +${fN(inv.statBonus.int)}`);

              return (
                <div
                  key={index}
                  className="bg-slate-950 border-2 border-slate-800 p-4 rounded-none flex flex-col justify-between shadow-[1px_1px_0px_0px_rgba(0,0,0,0.5)] relative overflow-hidden group hover:border-purple-650"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="max-w-[75%]">
                      <span className="text-sm font-bold block text-slate-200 truncate group-hover:text-purple-305 font-pixel-mono">
                        {inv.name}
                      </span>
                      <span className="text-[8px] text-purple-400 uppercase tracking-widest font-pixel-heading border border-purple-800 bg-slate-950 px-1 py-0.5 mt-1 inline-block">
                        {inv.rank}
                      </span>
                    </div>
                    <button
                      onClick={() => onDismissSummon(index)}
                      className="p-1.5 bg-[#170509] text-red-400 hover:bg-red-950 hover:text-white border border-red-900 rounded-none cursor-pointer"
                      title="Dispensar Inovação"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="text-[10px] text-slate-400 mt-2 bg-[#020205] p-2 leading-relaxed font-pixel-mono border border-slate-900">
                    Bônus Total:
                    <span className="text-emerald-400 font-bold block mt-0.5 text-xs">
                      {bonusTextPieces.length > 0 ? bonusTextPieces.join(" | ") : "Nenhum Atributo"}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
export default DomainTab;
