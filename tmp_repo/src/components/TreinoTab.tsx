import React, { useRef, useEffect } from "react";
import { Player } from "../types";
import { Dumbbell, Flame, Zap } from "lucide-react";

interface TreinoTabProps {
  player: Player;
  onExecuteTrainingClick: () => void;
}

export function TreinoTab({ player, onExecuteTrainingClick }: TreinoTabProps) {
  const fN = (num: number) => Math.floor(num).toLocaleString("pt-BR");
  const trainIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const trainSpeedMs = Math.max(
    30,
    Math.floor(1000 * Math.pow(0.8, player.upgrades.autoclickSpeed))
  );

  const startTraining = () => {
    if (trainIntervalRef.current) return;
    onExecuteTrainingClick();
    trainIntervalRef.current = setInterval(() => {
      onExecuteTrainingClick();
    }, trainSpeedMs);
  };

  const stopTraining = () => {
    if (trainIntervalRef.current) {
      clearInterval(trainIntervalRef.current);
      trainIntervalRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      if (trainIntervalRef.current) {
        clearInterval(trainIntervalRef.current);
      }
    };
  }, []);

  const renderPixelProgress = (val: number, bgColor: string) => {
    // 0 to 100 scaled to 16 block segments
    const totalSegments = 16;
    const activeSegments = Math.round((val / 100) * totalSegments);
    return (
      <div className="flex gap-[3px] w-full" style={{ imageRendering: "pixelated" }}>
        {Array.from({ length: totalSegments }).map((_, idx) => (
          <div
            key={idx}
            className={`h-3 flex-1 border border-black`}
            style={{
              backgroundColor: idx < activeSegments ? bgColor : "#030712",
              boxShadow: "inset -1px -1px 0px 0px rgba(0,0,0,0.5)"
            }}
          />
        ))}
      </div>
    );
  };

  return (
    <div id="tab-treinamento" className="flex flex-col gap-5 font-pixel-mono text-lg">
      <div className="border-b-4 border-double border-slate-700 pb-3">
        <h3 className="text-sm font-pixel-heading text-[#a78bfa] tracking-widest uppercase flex items-center gap-2">
          <Dumbbell className="w-4 h-4 text-orange-400" /> O Despertar do Corpo Físico
        </h3>
        <p className="text-xs text-slate-400 mt-1 text-base font-pixel-mono leading-relaxed">
          Cumpra a missão diária para quebrar seus limitadores mortais. Completar ciclos concede ouro em massa, XP e alta chance de incrementos permanentes de status.
        </p>
      </div>

      <div className="bg-slate-950 border-4 border-double border-slate-800 p-6 flex flex-col gap-5 relative overflow-hidden shadow-[2px_2px_0px_0px_rgba(0,0,0,0.5)]">
        <div className="absolute -right-8 -bottom-8 opacity-5 pointer-events-none">
          <Flame className="w-40 h-40 text-orange-500 animate-pulse" />
        </div>

        <div className="flex justify-between items-center border-b-2 border-slate-900 pb-2">
          <span className="text-xs font-pixel-heading text-slate-300 tracking-wider">CICLOS HOJE</span>
          <span className="text-sm font-pixel-heading text-yellow-405 bg-[#070702] border-2 border-yellow-700/50 px-3 py-1 font-bold shadow-[1px_1px_0px_0px_#422006]">
            {fN(player.dailyProgress.completedToday)}
          </span>
        </div>

        <div className="flex flex-col gap-3.5 z-10">
          {/* Flexões */}
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between text-xs font-pixel-mono">
              <span className="text-slate-350 font-bold">1. Flexões</span>
              <span className="text-blue-400 font-bold">
                {player.dailyProgress.pushups} / 100
              </span>
            </div>
            {renderPixelProgress(player.dailyProgress.pushups, "#3b82f6")}
          </div>

          {/* Abdominais */}
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between text-xs font-pixel-mono">
              <span className="text-slate-350 font-bold">2. Abdominais</span>
              <span className="text-indigo-400 font-bold">
                {player.dailyProgress.situps} / 100
              </span>
            </div>
            {renderPixelProgress(player.dailyProgress.situps, "#6366f1")}
          </div>

          {/* Agachamentos */}
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between text-xs font-pixel-mono">
              <span className="text-slate-350 font-bold">3. Agachamentos</span>
              <span className="text-purple-400 font-bold">
                {player.dailyProgress.squats} / 100
              </span>
            </div>
            {renderPixelProgress(player.dailyProgress.squats, "#a855f7")}
          </div>

          {/* Corrida */}
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between text-xs font-pixel-mono">
              <span className="text-slate-355 font-bold">4. Corrida Extenuante</span>
              <span className="text-pink-400 font-bold">
                {player.dailyProgress.runs} / 100
              </span>
            </div>
            {renderPixelProgress(player.dailyProgress.runs, "#ec4899")}
          </div>
        </div>

        {/* CLICK HOLD FOR TRAIN BUTTON */}
        <button
          onMouseDown={(e) => {
            if (e.button === 0) startTraining();
          }}
          onMouseUp={stopTraining}
          onMouseLeave={stopTraining}
          onTouchStart={(e) => {
            e.preventDefault();
            startTraining();
          }}
          onTouchEnd={stopTraining}
          className="w-full py-4 mt-2 bg-orange-950 border-2 border-orange-500 text-orange-200 font-pixel-heading text-xs tracking-widest rounded-none shadow-[2px_2px_0px_0px_#422006] active:translate-y-0.5 active:shadow-[1px_1px_0px_0px_#422006] select-none flex items-center justify-center gap-2 z-10 cursor-pointer"
        >
          <Zap className="w-4 h-4 animate-pulse" /> FORÇAR O CORPO (SEGURE M1)
        </button>
      </div>
    </div>
  );
}
export default TreinoTab;
