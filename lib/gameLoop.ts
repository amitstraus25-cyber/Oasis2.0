/**
 * Mirage Run - Camel runner with collectibles and water spit
 */

import type { GameState, ObstacleType, CollectibleType } from "./types";
import {
  GAME_WIDTH,
  GROUND_Y,
  CAMEL_X,
  CAMEL_WIDTH,
  CAMEL_HEIGHT,
  JUMP_FORCE,
  DOUBLE_JUMP_FORCE,
  GRAVITY,
  SCROLL_SPEED,
  OBSTACLE_WIDTH,
  OBSTACLE_HEIGHT,
  OBSTACLE_SMALL_WIDTH,
  OBSTACLE_SMALL_HEIGHT,
  COLLECTIBLE_WIDTH,
  COLLECTIBLE_HEIGHT,
  WATER_UNLOCK_COLLECTIBLES,
  INITIAL_SPITS,
  WATER_PROJECTILE_SPEED,
  WATER_PROJECTILE_SIZE,
  MIN_OBSTACLE_INTERVAL,
  MAX_OBSTACLE_INTERVAL,
  MIN_COLLECTIBLE_INTERVAL,
  MAX_COLLECTIBLE_INTERVAL,
  MAX_LIVES,
  INVINCIBILITY_MS,
} from "./constants";

const OBSTACLE_TYPES: { type: ObstacleType; w: number; h: number }[] = [
  { type: "cactus", w: OBSTACLE_WIDTH, h: OBSTACLE_HEIGHT },
  { type: "cactus_small", w: OBSTACLE_SMALL_WIDTH, h: OBSTACLE_SMALL_HEIGHT },
];

const COLLECTIBLE_TYPES: CollectibleType[] = ["key", "api_connection"];

let idCounter = 0;
function genId() {
  return `e-${++idCounter}-${Date.now()}`;
}

export function createInitialState(): GameState {
  return {
    score: 0,
    lives: MAX_LIVES,
    collectiblesCount: 0,
    waterUnlocked: false,
    spitsRemaining: 0,
    elapsedTime: 0,
    lastObstacleSpawn: 0,
    lastCollectibleSpawn: 0,
    invincibleUntil: 0,
    camel: {
      x: CAMEL_X,
      y: GROUND_Y - CAMEL_HEIGHT,
      vy: 0,
      width: CAMEL_WIDTH,
      height: CAMEL_HEIGHT,
      isOnGround: true,
      jumpsUsed: 0,
    },
    obstacles: [],
    collectibles: [],
    projectiles: [],
  };
}

function aabb(
  ax: number,
  ay: number,
  aw: number,
  ah: number,
  bx: number,
  by: number,
  bw: number,
  bh: number
): boolean {
  return ax < bx + bw && ax + aw > bx && ay < by + bh && ay + ah > by;
}

export function updateGameState(
  state: GameState,
  deltaMs: number,
  inputs: { jump: boolean; spit: boolean }
): { state: GameState; gameOver: boolean } {
  const newState = { ...state };
  newState.elapsedTime += deltaMs / 1000;
  newState.score = Math.floor(newState.elapsedTime * 10) + newState.collectiblesCount * 5;

  // Water unlock (grant initial spits)
  if (!newState.waterUnlocked && newState.collectiblesCount >= WATER_UNLOCK_COLLECTIBLES) {
    newState.waterUnlocked = true;
    newState.spitsRemaining = INITIAL_SPITS;
  }

  // Camel physics with double jump
  newState.camel = { ...newState.camel };

  if (inputs.jump) {
    if (newState.camel.isOnGround) {
      newState.camel.vy = JUMP_FORCE;
      newState.camel.isOnGround = false;
      newState.camel.jumpsUsed = 1;
    } else if (newState.camel.jumpsUsed < 2) {
      newState.camel.vy = DOUBLE_JUMP_FORCE;
      newState.camel.jumpsUsed = 2;
    }
  }

  newState.camel.vy += GRAVITY;
  newState.camel.y += newState.camel.vy;

  if (newState.camel.y >= GROUND_Y - newState.camel.height) {
    newState.camel.y = GROUND_Y - newState.camel.height;
    newState.camel.vy = 0;
    newState.camel.isOnGround = true;
    newState.camel.jumpsUsed = 0;
  }

  // Spit water (ammo-based)
  if (inputs.spit && newState.waterUnlocked && newState.spitsRemaining > 0) {
    newState.spitsRemaining--;
    newState.projectiles = [
      ...newState.projectiles,
      {
        id: genId(),
        x: CAMEL_X + CAMEL_WIDTH,
        y: newState.camel.y + newState.camel.height / 2 - WATER_PROJECTILE_SIZE / 2,
        width: WATER_PROJECTILE_SIZE,
        height: WATER_PROJECTILE_SIZE,
      },
    ];
  }

  // Move projectiles
  newState.projectiles = newState.projectiles
    .map((p) => ({ ...p, x: p.x + WATER_PROJECTILE_SPEED }))
    .filter((p) => p.x < GAME_WIDTH + 50);

  // Move obstacles
  newState.obstacles = newState.obstacles
    .map((o) => ({ ...o, x: o.x - SCROLL_SPEED }))
    .filter((o) => o.x > -50);

  // Move collectibles
  newState.collectibles = newState.collectibles
    .map((c) => ({ ...c, x: c.x - SCROLL_SPEED }))
    .filter((c) => c.x > -50);

  // Water vs obstacles
  const hitObstacleIds = new Set<string>();
  newState.projectiles = newState.projectiles.filter((proj) => {
    for (const obs of newState.obstacles) {
      if (aabb(proj.x, proj.y, proj.width, proj.height, obs.x, obs.y, obs.width, obs.height)) {
        hitObstacleIds.add(obs.id);
        return false;
      }
    }
    return true;
  });
  newState.obstacles = newState.obstacles.filter((o) => !hitObstacleIds.has(o.id));

  // Camel vs obstacles (with lives and invincibility)
  const now = Date.now();
  if (now >= newState.invincibleUntil) {
    const camelLeft = newState.camel.x;
    const camelTop = newState.camel.y;
    for (const obs of newState.obstacles) {
      if (aabb(camelLeft, camelTop, newState.camel.width, newState.camel.height, obs.x, obs.y, obs.width, obs.height)) {
        newState.lives--;
        newState.invincibleUntil = now + INVINCIBILITY_MS;
        newState.obstacles = newState.obstacles.filter((o) => o.id !== obs.id);
        break;
      }
    }
  }

  // Check game over
  if (newState.lives <= 0) {
    return { state: newState, gameOver: true };
  }

  // Camel vs collectibles
  const camelLeft = newState.camel.x;
  const camelTop = newState.camel.y;
  newState.collectibles = newState.collectibles.filter((c) => {
    if (aabb(camelLeft, camelTop, newState.camel.width, newState.camel.height, c.x, c.y, c.width, c.height)) {
      newState.collectiblesCount++;
      if (newState.waterUnlocked) {
        newState.spitsRemaining++;
      }
      return false;
    }
    return true;
  });

  // Spawn obstacles
  const obsInterval = MIN_OBSTACLE_INTERVAL + Math.random() * (MAX_OBSTACLE_INTERVAL - MIN_OBSTACLE_INTERVAL);
  if (newState.elapsedTime - newState.lastObstacleSpawn >= obsInterval) {
    newState.lastObstacleSpawn = newState.elapsedTime;
    const choice = OBSTACLE_TYPES[Math.floor(Math.random() * OBSTACLE_TYPES.length)];
    newState.obstacles = [
      ...newState.obstacles,
      {
        id: genId(),
        type: choice.type,
        x: GAME_WIDTH + 10,
        y: GROUND_Y - choice.h,
        width: choice.w,
        height: choice.h,
      },
    ];
  }

  // Spawn collectibles
  const colInterval = MIN_COLLECTIBLE_INTERVAL + Math.random() * (MAX_COLLECTIBLE_INTERVAL - MIN_COLLECTIBLE_INTERVAL);
  if (newState.elapsedTime - newState.lastCollectibleSpawn >= colInterval) {
    newState.lastCollectibleSpawn = newState.elapsedTime;
    const type = COLLECTIBLE_TYPES[Math.floor(Math.random() * COLLECTIBLE_TYPES.length)];
    newState.collectibles = [
      ...newState.collectibles,
      {
        id: genId(),
        type,
        x: GAME_WIDTH + 10,
        y: GROUND_Y - COLLECTIBLE_HEIGHT - Math.random() * 60,
        width: COLLECTIBLE_WIDTH,
        height: COLLECTIBLE_HEIGHT,
      },
    ];
  }

  return { state: newState, gameOver: false };
}
