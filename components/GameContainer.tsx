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
  const [gameOverReason, setGameOverReason] = useState<"lives" | "overload">("lives");

  const handleStart = useCallback(() => {
    setGameState(createInitialState());
    setPhase("playing");
  }, []);

  const handleStateChange = useCallback((state: GameState) => {
    setGameState(state);
  }, []);

  const handleGameOver = useCallback((reason: "lives" | "overload") => {
    setGameOverReason(reason);
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
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-sand-100 via-sand-50 to-oasis-100">
      <AnimatePresence mode="wait">
        {phase === "start" && <StartScreen key="start" onStart={handleStart} />}
      </AnimatePresence>

      {phase === "playing" && (
        <div className="relative">
          <HUD state={gameState} />
          <GameCanvas
            onStateChange={handleStateChange}
            onGameOver={handleGameOver}
            isPlaying={phase === "playing"}
          />
        </div>
      )}

      <AnimatePresence mode="wait">
        {phase === "gameover" && (
          <GameOverScreen
            key="gameover"
            onRestart={handleRestart}
            reason={gameOverReason}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
