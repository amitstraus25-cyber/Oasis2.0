"use client";

import type { GameState } from "@/lib/types";
import { OVERLOAD_CALM, OVERLOAD_SLIGHT, OVERLOAD_MESSY, OVERLOAD_HIGH_RISK } from "@/lib/constants";

interface HUDProps {
  state: GameState;
}

function getOverloadColor(overload: number): string {
  if (overload <= OVERLOAD_CALM) return "bg-oasis-500";
  if (overload <= OVERLOAD_SLIGHT) return "bg-amber-400";
  if (overload <= OVERLOAD_MESSY) return "bg-amber-500";
  if (overload <= OVERLOAD_HIGH_RISK) return "bg-orange-500";
  return "bg-red-500";
}

export function HUD({ state }: HUDProps) {
  const overloadPercent = Math.min(100, (state.overload / 17) * 100);
  const waterReady = state.waterUnlocked && state.waterCooldown <= 0;
  const waterCooldownPercent = state.waterCooldown / state.waterCooldownMax;

  return (
    <div className="absolute top-4 left-4 right-4 z-10 flex items-center justify-between px-6 py-3 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg">
      <div className="flex items-center gap-8">
        <div>
          <span className="text-oasis-600 text-sm font-medium">Score</span>
          <p className="text-2xl font-bold text-oasis-800">{state.score}</p>
        </div>
        <div className="flex items-center gap-1">
          {Array.from({ length: 3 }).map((_, i) => (
            <span
              key={i}
              className={`text-2xl ${i < state.lives ? "text-red-400" : "text-gray-300"}`}
            >
              ♥
            </span>
          ))}
        </div>
        <div className="min-w-[120px]">
          <div className="flex justify-between text-xs text-oasis-600 mb-1">
            <span>Overload</span>
            <span>{state.overload}/17</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-200 ${getOverloadColor(state.overload)}`}
              style={{ width: `${overloadPercent}%` }}
            />
          </div>
        </div>
      </div>
      <div className="flex items-center gap-4">
        {state.waterUnlocked ? (
          <div className="flex flex-col items-center">
            <span className="text-xs text-oasis-600">
              {waterReady ? "Spit ready (F)" : `${(state.waterCooldown / 1000).toFixed(1)}s`}
            </span>
            {!waterReady && (
              <div className="w-12 h-1.5 bg-gray-200 rounded-full mt-1 overflow-hidden">
                <div
                  className="h-full bg-oasis-400 rounded-full transition-all"
                  style={{ width: `${(1 - waterCooldownPercent) * 100}%` }}
                />
              </div>
            )}
          </div>
        ) : (
          <span className="text-sm text-oasis-600">
            Collect 7 items to unlock spit
          </span>
        )}
        <span className="text-sm text-oasis-600">
          {Math.floor(state.elapsedTime)}s
        </span>
      </div>
    </div>
  );
}
