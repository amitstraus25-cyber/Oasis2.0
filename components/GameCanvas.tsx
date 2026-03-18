"use client";

import { useRef, useEffect, useCallback } from "react";
import type { GameState } from "@/lib/types";
import { createInitialState, updateGameState } from "@/lib/gameLoop";
import {
  drawBackground,
  drawCamel,
  drawObstacle,
  drawCollectible,
  drawWaterProjectile,
  drawExplosionParticle,
} from "@/lib/drawing";
import { GAME_WIDTH, GAME_HEIGHT } from "@/lib/constants";

interface GameCanvasProps {
  onStateChange: (state: GameState) => void;
  onGameOver: () => void;
  isPlaying: boolean;
}

export function GameCanvas({
  onStateChange,
  onGameOver,
  isPlaying,
}: GameCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef<GameState>(createInitialState());
  const inputsRef = useRef({ jump: false, spit: false });
  const lastTimeRef = useRef<number>(0);
  const rafRef = useRef<number>(0);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.code === "Space") {
      e.preventDefault();
      inputsRef.current.jump = true;
    }
    if (e.code === "KeyF") {
      e.preventDefault();
      inputsRef.current.spit = true;
    }
  }, []);

  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    if (e.code === "Space") inputsRef.current.jump = false;
    if (e.code === "KeyF") inputsRef.current.spit = false;
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  useEffect(() => {
    if (!isPlaying) return;

    stateRef.current = createInitialState();
    lastTimeRef.current = performance.now();

    const loop = (now: number) => {
      const delta = now - lastTimeRef.current;
      lastTimeRef.current = now;

      const { state, gameOver } = updateGameState(
        stateRef.current,
        delta,
        inputsRef.current
      );

      inputsRef.current.jump = false;
      inputsRef.current.spit = false;
      stateRef.current = state;
      onStateChange(state);

      if (gameOver) {
        onGameOver();
        return;
      }

      const ctx = canvasRef.current?.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
        drawBackground(ctx, state.elapsedTime * 80);
        state.obstacles.forEach((o) => drawObstacle(ctx, o));
        state.collectibles.forEach((c) => drawCollectible(ctx, c));
        state.projectiles.forEach((p) => drawWaterProjectile(ctx, p));
        state.explosionParticles.forEach((p) => drawExplosionParticle(ctx, p));
        drawCamel(ctx, state.camel, Date.now() < state.invincibleUntil);
      }

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [isPlaying, onStateChange, onGameOver]);

  return (
    <canvas
      ref={canvasRef}
      width={GAME_WIDTH}
      height={GAME_HEIGHT}
      className="block"
      style={{ imageRendering: "pixelated" }}
    />
  );
}
