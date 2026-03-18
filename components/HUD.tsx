"use client";

import type { GameState } from "@/lib/types";

interface HUDProps {
  state: GameState;
}

export function HUD({ state }: HUDProps) {
  return (
    <div className="absolute top-4 left-4 right-4 z-10 flex items-center justify-between text-black font-mono text-lg">
      <div className="flex items-center gap-6">
        <span>Score: {state.score}</span>
        <span>Keys/MCP: {state.collectiblesCount}</span>
        <span className="flex items-center gap-1">
          Lives:
          {Array.from({ length: 3 }).map((_, i) => (
            <span key={i}>{i < state.lives ? "♥" : "♡"}</span>
          ))}
        </span>
      </div>
      <div>
        {state.waterUnlocked ? (
          <span>Spits: {state.spitsRemaining} (F)</span>
        ) : (
          <span>Collect 5 to unlock spit</span>
        )}
      </div>
    </div>
  );
}
