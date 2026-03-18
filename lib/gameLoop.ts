/**
 * Mirage Run - Core game loop logic
 */

import type { GameState, ObstacleType, CollectibleType } from "./types";
import {
  GAME_WIDTH,
  GAME_HEIGHT,
  CAMEL_X,
  GROUND_Y,
  CAMEL_BASE_WIDTH,
  CAMEL_BASE_HEIGHT,
  JUMP_FORCE,
  GRAVITY,
  SCROLL_SPEED,
  WATER_UNLOCK_OVERLOAD,
  WATER_UNLOCK_COLLECTIBLES,
  WATER_COOLDOWN_MS,
  WATER_PROJECTILE_SPEED,
  WATER_PROJECTILE_WIDTH,
  WATER_PROJECTILE_HEIGHT,
  OVERLOAD_GAME_OVER,
  MAX_LIVES,
  INVINCIBILITY_MS,
  OBSTACLE_WIDTH,
  OBSTACLE_HEIGHT,
  COLLECTIBLE_WIDTH,
  COLLECTIBLE_HEIGHT,
  COLLECTIBLE_CONFIG,
  SPAWN_PHASES,
  CAMEL_SCALE_PER_OVERLOAD,
  CAMEL_MAX_SCALE,
} from "./constants";

const OBSTACLE_TYPES: ObstacleType[] = [
  "cables",
  "token_cactus",
  "secret_spikes",
  "permission_wall",
  "unknown_rock",
];

const COLLECTIBLE_TYPES: CollectibleType[] = ["api_key", "secret", "mcp_connector"];

let idCounter = 0;
function genId() {
  return `e-${++idCounter}-${Date.now()}`;
}

export function createInitialState(): GameState {
  return {
    score: 0,
    lives: MAX_LIVES,
    overload: 0,
    collectiblesCount: 0,
    waterUnlocked: false,
    waterCooldown: 0,
    waterCooldownMax: WATER_COOLDOWN_MS,
    elapsedTime: 0,
    lastObstacleSpawn: 0,
    lastCollectibleSpawn: 0,
    camel: {
      x: CAMEL_X,
      y: GROUND_Y - CAMEL_BASE_HEIGHT / 2,
      vy: 0,
      width: CAMEL_BASE_WIDTH,
      height: CAMEL_BASE_HEIGHT,
      scale: 1,
      isOnGround: true,
    },
    obstacles: [],
    collectibles: [],
    projectiles: [],
    invincibleUntil: 0,
  };
}

function getSpawnIntervals(elapsedTime: number) {
  const phase = SPAWN_PHASES.find(
    (p) => elapsedTime >= p.start && elapsedTime < p.end
  );
  return phase || SPAWN_PHASES[SPAWN_PHASES.length - 1];
}

function weightedRandomCollectible(): CollectibleType {
  const total =
    COLLECTIBLE_CONFIG.api_key.weight +
    COLLECTIBLE_CONFIG.secret.weight +
    COLLECTIBLE_CONFIG.mcp_connector.weight;
  let r = Math.random() * total;
  if (r < COLLECTIBLE_CONFIG.api_key.weight) return "api_key";
  r -= COLLECTIBLE_CONFIG.api_key.weight;
  if (r < COLLECTIBLE_CONFIG.secret.weight) return "secret";
  return "mcp_connector";
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
): { state: GameState; gameOver: boolean; gameOverReason?: "lives" | "overload" } {
  const dt = deltaMs / 1000;
  const newState = { ...state };
  newState.elapsedTime += deltaMs / 1000;
  newState.waterCooldown = Math.max(0, newState.waterCooldown - deltaMs);

  // Update camel scale from overload
  newState.camel = { ...newState.camel };
  newState.camel.scale = Math.min(
    1 + newState.overload * CAMEL_SCALE_PER_OVERLOAD,
    CAMEL_MAX_SCALE
  );

  // Camel physics
  if (inputs.jump && newState.camel.isOnGround) {
    newState.camel.vy = JUMP_FORCE;
    newState.camel.isOnGround = false;
  }
  newState.camel.vy += GRAVITY;
  newState.camel.y += newState.camel.vy;
  if (newState.camel.y >= GROUND_Y - newState.camel.height / 2) {
    newState.camel.y = GROUND_Y - newState.camel.height / 2;
    newState.camel.vy = 0;
    newState.camel.isOnGround = true;
  }

  // Water unlock check
  if (
    !newState.waterUnlocked &&
    (newState.overload >= WATER_UNLOCK_OVERLOAD ||
      newState.collectiblesCount >= WATER_UNLOCK_COLLECTIBLES)
  ) {
    newState.waterUnlocked = true;
  }

  // Spit water
  if (
    inputs.spit &&
    newState.waterUnlocked &&
    newState.waterCooldown <= 0
  ) {
    newState.waterCooldown = WATER_COOLDOWN_MS;
    newState.projectiles = [...newState.projectiles];
    newState.projectiles.push({
      id: genId(),
      x: CAMEL_X + CAMEL_BASE_WIDTH / 2,
      y: newState.camel.y,
      width: WATER_PROJECTILE_WIDTH,
      height: WATER_PROJECTILE_HEIGHT,
    });
  }

  // Move projectiles
  newState.projectiles = newState.projectiles
    .map((p) => ({ ...p, x: p.x + WATER_PROJECTILE_SPEED }))
    .filter((p) => p.x < GAME_WIDTH + 50);

  // Move obstacles
  newState.obstacles = newState.obstacles
    .map((o) => ({ ...o, x: o.x - SCROLL_SPEED }))
    .filter((o) => o.x > -OBSTACLE_WIDTH - 20);

  // Move collectibles
  newState.collectibles = newState.collectibles
    .map((c) => ({ ...c, x: c.x - SCROLL_SPEED }))
    .filter((c) => c.x > -COLLECTIBLE_WIDTH - 20);

  // Water vs obstacles
  const hitObstacleIds = new Set<string>();
  newState.projectiles = newState.projectiles.filter((proj) => {
    for (const obs of newState.obstacles) {
      if (
        aabb(
          proj.x,
          proj.y,
          proj.width,
          proj.height,
          obs.x,
          obs.y,
          obs.width,
          obs.height
        )
      ) {
        hitObstacleIds.add(obs.id);
        return false;
      }
    }
    return true;
  });
  newState.obstacles = newState.obstacles.filter((o) => !hitObstacleIds.has(o.id));

  // Camel vs obstacles (use scaled dimensions for hitbox)
  const now = Date.now();
  if (now >= newState.invincibleUntil) {
    const camelW = newState.camel.width * newState.camel.scale;
    const camelH = newState.camel.height * newState.camel.scale;
    const camelLeft = newState.camel.x - camelW / 2;
    const camelTop = newState.camel.y - camelH / 2;
    for (const obs of newState.obstacles) {
      if (
        aabb(
          camelLeft,
          camelTop,
          camelW,
          camelH,
          obs.x,
          obs.y,
          obs.width,
          obs.height
        )
      ) {
        newState.lives--;
        newState.invincibleUntil = now + INVINCIBILITY_MS;
        newState.obstacles = newState.obstacles.filter((o) => o.id !== obs.id);
        break;
      }
    }
  }

  // Camel vs collectibles (use scaled dimensions)
  const camelW = newState.camel.width * newState.camel.scale;
  const camelH = newState.camel.height * newState.camel.scale;
  const camelLeft = newState.camel.x - camelW / 2;
  const camelTop = newState.camel.y - camelH / 2;
  newState.collectibles = newState.collectibles.filter((c) => {
    if (
      aabb(
        camelLeft,
        camelTop,
        camelW,
        camelH,
        c.x,
        c.y,
        c.width,
        c.height
      )
    ) {
      const config = COLLECTIBLE_CONFIG[c.type];
      newState.score += config.score;
      newState.overload += config.overload;
      newState.collectiblesCount++;
      return false;
    }
    return true;
  });

  // Spawn new entities (elapsedTime in seconds, intervals in ms)
  const intervals = getSpawnIntervals(newState.elapsedTime);
  const lastObstacleSpawn = newState.lastObstacleSpawn;
  const lastCollectibleSpawn = newState.lastCollectibleSpawn;

  if (newState.elapsedTime - lastObstacleSpawn >= intervals.obstacleInterval / 1000) {
    newState.lastObstacleSpawn = newState.elapsedTime;
    const type = OBSTACLE_TYPES[Math.floor(Math.random() * OBSTACLE_TYPES.length)];
    newState.obstacles = [
      ...newState.obstacles,
      {
        id: genId(),
        type,
        x: GAME_WIDTH + 20,
        y: GROUND_Y - OBSTACLE_HEIGHT,
        width: OBSTACLE_WIDTH,
        height: OBSTACLE_HEIGHT,
      },
    ];
  }

  if (newState.elapsedTime - lastCollectibleSpawn >= intervals.collectibleInterval / 1000) {
    newState.lastCollectibleSpawn = newState.elapsedTime;
    const type = weightedRandomCollectible();
    newState.collectibles = [
      ...newState.collectibles,
      {
        id: genId(),
        type,
        x: GAME_WIDTH + 20,
        y: GROUND_Y - COLLECTIBLE_HEIGHT - Math.random() * 80,
        width: COLLECTIBLE_WIDTH,
        height: COLLECTIBLE_HEIGHT,
      },
    ];
  }

  // Game over checks
  if (newState.lives <= 0) {
    return { state: newState, gameOver: true, gameOverReason: "lives" };
  }
  if (newState.overload >= OVERLOAD_GAME_OVER) {
    return { state: newState, gameOver: true, gameOverReason: "overload" };
  }

  return { state: newState, gameOver: false };
}
