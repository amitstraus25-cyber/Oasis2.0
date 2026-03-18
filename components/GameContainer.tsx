"use client";

import { useState, useCallback, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import type { GameState } from "@/lib/types";
import { createInitialState } from "@/lib/gameLoop";
import { StartScreen } from "./StartScreen";
import { GameOverScreen } from "./GameOverScreen";
import { GameCanvas } from "./GameCanvas";
import { HUD } from "./HUD";

type GamePhase = "start" | "playing" | "gameover";

export function GameContainer() {
  const [phase, setPhase] = useState<GamePhase>("start");
  const [gameState, setGameState] = useState<GameState>(() => createInitialState());

  const handleStart = useCallback(() => {
    setGameState(createInitialState());
    setPhase("playing");
  }, []);

  const handleStateChange = useCallback((state: GameState) => {
    setGameState(state);
  }, []);

  const handleGameOver = useCallback(() => {
    setPhase("gameover");
  }, []);

  const handleRestart = useCallback(() => {
    setPhase("start");
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Enter" && !e.repeat) {
        if (phase === "start") handleStart();
        else if (phase === "gameover") handleRestart();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [phase, handleStart, handleRestart]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-white">
      <AnimatePresence mode="wait">
        {phase === "start" && <StartScreen key="start" onStart={handleStart} />}
      </AnimatePresence>

      {phase === "playing" && (
        <div className="flex flex-col items-center">
          <div className="mb-2 px-4 py-2 bg-gray-100 border border-black text-black text-sm font-mono text-center max-w-[1200px]">
            <span className="font-bold">Key</span> = API keys authenticate apps.
            <span className="mx-2">|</span>
            <span className="font-bold">MCP</span> = Model Context Protocol connections let AI agents access tools.
            <span className="mx-2">|</span>
            Collect 5 to unlock water spit!
          </div>
          <div className="relative border-2 border-black">
            <HUD state={gameState} />
            <GameCanvas
              onStateChange={handleStateChange}
              onGameOver={handleGameOver}
              isPlaying={phase === "playing"}
            />
          </div>
        </div>
      )}

      <AnimatePresence mode="wait">
        {phase === "gameover" && (
          <GameOverScreen key="gameover" onRestart={handleRestart} />
        )}
      </AnimatePresence>
    </div>
  );
}
