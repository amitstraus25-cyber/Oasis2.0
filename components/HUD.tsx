"use client";

import type { GameState } from "@/lib/types";

interface HUDProps {
  state: GameState;
}

function KeyMini() {
  return (
    <svg width="20" height="14" viewBox="0 0 20 14" className="inline-block">
      <circle cx="6" cy="7" r="5" fill="#535353" />
      <circle cx="6" cy="7" r="2" fill="white" />
      <rect x="9" y="5.5" width="9" height="3" rx="1" fill="#535353" />
      <rect x="14" y="5.5" width="2" height="5" fill="#535353" />
      <rect x="17" y="5.5" width="2" height="4" fill="#535353" />
    </svg>
  );
}

function WaterMini() {
  return (
    <svg width="14" height="18" viewBox="0 0 14 18" className="inline-block">
      <path
        d="M7 2 Q2 8 2 11 Q2 16 7 16 Q12 16 12 11 Q12 8 7 2 Z"
        fill="#535353"
      />
      <circle cx="5" cy="9" r="1.5" fill="white" />
    </svg>
  );
}

export function HUD({ state }: HUDProps) {
  return (
    <div className="absolute top-4 left-4 right-4 z-10 flex items-center justify-between font-medium text-sm">
      <div className="flex items-center gap-5">
        {/* Score */}
        <div className="flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-lg border border-gray-200">
          <span className="text-gray-500 text-xs uppercase tracking-wide">Score</span>
          <span className="text-gray-700 font-bold text-base">{state.score}</span>
        </div>

        {/* Collectibles */}
        <div className="flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-lg border border-gray-200">
          <KeyMini />
          <span className="text-gray-700 font-bold">{state.collectiblesCount}</span>
        </div>

        {/* Lives */}
        <div className="flex items-center gap-1.5 bg-gray-100 px-3 py-1.5 rounded-lg border border-gray-200">
          {Array.from({ length: 3 }).map((_, i) => (
            <span
              key={i}
              className={`text-lg ${i < state.lives ? "text-red-500" : "text-gray-300"}`}
            >
              ♥
            </span>
          ))}
        </div>
      </div>

      {/* Water spit */}
      <div className="flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-lg border border-gray-200">
        {state.waterUnlocked ? (
          <>
            <WaterMini />
            <span className="text-gray-700 font-bold">{state.spitsRemaining}</span>
            <kbd className="px-1.5 py-0.5 bg-gray-200 text-gray-500 text-xs rounded font-mono">F</kbd>
          </>
        ) : (
          <span className="text-gray-400 text-xs">
            Collect {5 - state.collectiblesCount} more to unlock
          </span>
        )}
      </div>
    </div>
  );
}
