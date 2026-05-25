import React, { useState } from "react";
import { Player } from "../types";
import { Sparkles, Eye, Cpu, Loader2 } from "lucide-react";

interface OraculoTabProps {
  player: Player;
  getPlayerRank: () => string;
  onShowNotification: (title: string, msg: string, type: 'blue' | 'red' | 'purple' | 'gold') => void;
}

export function OraculoTab({ player, getPlayerRank, onShowNotification }: OraculoTabProps) {
  const [loading, setLoading] = useState(false);
  const [oracleResponse, setOracleResponse] = useState("O Sistema aguarda sua solicitação silenciosamente...");

  const fN = (num: number) => Math.floor(num).toLocaleString("pt-BR");

  async function handleEvaluate() {
    if (loading) return;
    setLoading(true);
    setOracleResponse("Estabelecendo sintonia espectral com a Inteligência do Sistema e compilando dados corporais...");
    try {
      const payload = {
        level: player.level,
        rank: getPlayerRank(),
        pClass: player.class || "Nenhuma",
        stats: player.stats,
        gold: fN(player.gold)
      };

      const response = await fetch("/api/oraculo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error("Não foi possível alcançar o servidor.");
      }
      const data = await response.json();
      if (data.error) throw new Error(data.error);

      setOracleResponse(data.text);
      onShowNotification("AVALIAÇÃO DO SISTEMA", "O Oráculo enviou um novo relatório!", "purple");
    } catch (err: any) {
      console.error(err);
      setOracleResponse("[ERRO DE CONEXÃO SPECTRAL]\nAs forças de resistência da fenda interromperam o link de transmissão com a Central do Sistema.");
      onShowNotification("ERRO SPECTRAL", "Falha ao se comunicar com a Central do Sistema.", "red");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div id="tab-oraculo" className="flex flex-col gap-5 font-pixel-mono text-lg font-normal">
      <div className="border-b-4 border-double border-slate-700 pb-3">
        <h3 className="text-sm font-pixel-heading text-[#a78bfa] tracking-widest uppercase flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-fuchsia-400" /> O Oráculo do Sistema
        </h3>
        <p className="text-xs text-slate-400 mt-1 text-base font-pixel-mono">
          Comunique-se diretamente com a deidade onisciente que rege as fendas e absorva estimativas imperiosas de combate.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
        <div className="bg-slate-950 border-2 border-purple-900/50 p-6 rounded-none flex flex-col justify-between gap-4 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.55)] relative overflow-hidden">
          <div className="absolute -right-4 -top-4 opacity-5 pointer-events-none">
            <Eye className="w-40 h-40 text-fuchsia-300" />
          </div>
          <div>
            <h4 className="text-[10px] font-pixel-heading uppercase tracking-widest text-fuchsia-300">
              Análise Holográfica Corporal
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed font-pixel-mono mt-3">
              Solicite uma inspeção instantânea. O Sistema fará um escâner holográfico do seu nível, pertences e alocação estatística, proferindo um veredicto analítico (zombeteiro para fracos, obsequioso para Deuses) de sua trajetória caótica.
            </p>
          </div>
          <button
            onClick={handleEvaluate}
            disabled={loading}
            className={`mt-4 py-3 border-2 font-pixel-heading text-[10px] tracking-widest uppercase rounded-none transition flex items-center justify-center gap-2 ${
              loading
                ? "bg-slate-950 border-slate-900 text-slate-650 cursor-not-allowed"
                : "bg-purple-950 hover:bg-purple-900 text-purple-200 border-purple-500 shadow-[2px_2px_0px_0px_#1e1b4b] cursor-pointer"
            }`}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-fuchsia-400" /> Sintonizando...
              </>
            ) : (
              <>
                <Cpu className="w-4 h-4 text-fuchsia-400 animate-pulse" /> Escanear Status
              </>
            )}
          </button>
        </div>

        <div className="bg-[#020205] border-4 border-double border-purple-900/60 p-5 rounded-none flex flex-col gap-3 min-h-[250px] shadow-[2px_2px_0px_0px_rgba(0,0,0,0.55)]">
          <span className="text-[8px] font-pixel-heading uppercase tracking-widest text-[#a78bfa] block border-b border-purple-950/40 pb-2">
            Resposta Espectral do Sistema
          </span>
          <div className="text-xs md:text-sm text-slate-300 font-pixel-mono overflow-y-auto max-h-[300px] pr-2 leading-relaxed whitespace-pre-wrap">
            {oracleResponse}
          </div>
        </div>
      </div>
    </div>
  );
}
export default OraculoTab;
