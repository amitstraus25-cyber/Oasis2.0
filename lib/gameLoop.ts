/**
 * Oasis Mirage Run - Camel runner with collectibles and water spit
 */

import type { GameState, ObstacleType, CollectibleType, ExplosionParticle } from "./types";
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
  COLLECTIBLES_PER_EXTRA_SPIT,
  WATER_PROJECTILE_SPEED,
  WATER_PROJECTILE_WIDTH,
  WATER_PROJECTILE_HEIGHT,
  MIN_OBSTACLE_INTERVAL,
  MAX_OBSTACLE_INTERVAL,
  MIN_COLLECTIBLE_INTERVAL,
  MAX_COLLECTIBLE_INTERVAL,
  MIN_HEART_INTERVAL,
  MAX_HEART_INTERVAL,
  MAX_LIVES,
  INVINCIBILITY_MS,
  CAMEL_SCALE_PER_COLLECTIBLE,
  CAMEL_MAX_SCALE,
  OVERLOAD_COLLECTIBLES,
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
    lastHeartSpawn: 0,
    invincibleUntil: 0,
    camel: {
      x: CAMEL_X,
      y: GROUND_Y - CAMEL_HEIGHT,
      vy: 0,
      width: CAMEL_WIDTH,
      height: CAMEL_HEIGHT,
      scale: 1,
      isOnGround: true,
      jumpsUsed: 0,
    },
    obstacles: [],
    collectibles: [],
    projectiles: [],
    explosionParticles: [],
    gameOverReason: undefined,
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

function createExplosionParticles(camelX: number, camelY: number, count: number = 20): ExplosionParticle[] {
  const particles: ExplosionParticle[] = [];
  for (let i = 0; i < count; i++) {
    const angle = (Math.PI * 2 * i) / count + Math.random() * 0.3;
    const speed = 8 + Math.random() * 12;
    particles.push({
      id: genId(),
      type: Math.random() > 0.5 ? "key" : "mcp",
      x: camelX + CAMEL_WIDTH / 2,
      y: camelY + CAMEL_HEIGHT / 2,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 5,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.3,
    });
  }
  return particles;
}

function createHitParticles(camelX: number, camelY: number): ExplosionParticle[] {
  const particles: ExplosionParticle[] = [];
  // One key popping out
  particles.push({
    id: genId(),
    type: "key",
    x: camelX + CAMEL_WIDTH / 2,
    y: camelY + CAMEL_HEIGHT / 3,
    vx: 3 + Math.random() * 4,
    vy: -8 - Math.random() * 4,
    rotation: Math.random() * Math.PI * 2,
    rotationSpeed: (Math.random() - 0.5) * 0.4,
  });
  // One MCP popping out
  particles.push({
    id: genId(),
    type: "mcp",
    x: camelX + CAMEL_WIDTH / 2,
    y: camelY + CAMEL_HEIGHT / 3,
    vx: -2 - Math.random() * 3,
    vy: -6 - Math.random() * 5,
    rotation: Math.random() * Math.PI * 2,
    rotationSpeed: (Math.random() - 0.5) * 0.4,
  });
  return particles;
}

export function updateGameState(
  state: GameState,
  deltaMs: number,
  inputs: { jump: boolean; spit: boolean }
): { state: GameState; gameOver: boolean } {
  const newState = { ...state };
  newState.elapsedTime += deltaMs / 1000;
  newState.score = Math.floor(newState.elapsedTime * 10) + newState.collectiblesCount * 5;

  // Water unlocks at 5 collectibles with 3 initial spits, then +1 per 3 collectibles after
  if (!newState.waterUnlocked && newState.collectiblesCount >= WATER_UNLOCK_COLLECTIBLES) {
    newState.waterUnlocked = true;
    newState.spitsRemaining = INITIAL_SPITS;
  }
  
  // Calculate total earned spits: 3 initial + 1 for every 3 collectibles after the first 5
  const extraCollectibles = Math.max(0, newState.collectiblesCount - WATER_UNLOCK_COLLECTIBLES);
  const extraSpits = Math.floor(extraCollectibles / COLLECTIBLES_PER_EXTRA_SPIT);
  const totalEarnedSpits = newState.waterUnlocked ? INITIAL_SPITS + extraSpits : 0;

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

  // Track spits used and update remaining (can't exceed total earned)
  const spitsUsedSoFar = totalEarnedSpits - newState.spitsRemaining;
  if (newState.spitsRemaining < totalEarnedSpits - spitsUsedSoFar) {
    newState.spitsRemaining = totalEarnedSpits - spitsUsedSoFar;
  }

  if (inputs.spit && newState.waterUnlocked && newState.spitsRemaining > 0) {
    newState.spitsRemaining--;
    newState.projectiles = [
      ...newState.projectiles,
      {
        id: genId(),
        x: CAMEL_X + CAMEL_WIDTH,
        y: newState.camel.y + newState.camel.height / 2 - WATER_PROJECTILE_HEIGHT / 2,
        width: WATER_PROJECTILE_WIDTH,
        height: WATER_PROJECTILE_HEIGHT,
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

  // Update explosion particles
  newState.explosionParticles = newState.explosionParticles
    .map((p) => ({
      ...p,
      x: p.x + p.vx,
      y: p.y + p.vy,
      vy: p.vy + 0.4,
      rotation: p.rotation + p.rotationSpeed,
    }))
    .filter((p) => p.y < GROUND_Y + 100);

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
    const camelW = newState.camel.width * newState.camel.scale;
    const camelH = newState.camel.height * newState.camel.scale;
    for (const obs of newState.obstacles) {
      if (aabb(newState.camel.x, newState.camel.y, camelW, camelH, obs.x, obs.y, obs.width, obs.height)) {
        newState.lives--;
        newState.invincibleUntil = now + INVINCIBILITY_MS;
        newState.obstacles = newState.obstacles.filter((o) => o.id !== obs.id);
        
        // Pop out key and MCP if player has collectibles
        if (newState.collectiblesCount > 0) {
          const hitParticles = createHitParticles(newState.camel.x, newState.camel.y);
          newState.explosionParticles = [...newState.explosionParticles, ...hitParticles];
          // Lose 1 collectible (but not below 0)
          newState.collectiblesCount = Math.max(0, newState.collectiblesCount - 1);
          // Shrink camel slightly
          newState.camel.scale = Math.max(1, newState.camel.scale - CAMEL_SCALE_PER_COLLECTIBLE);
        }
        break;
      }
    }
  }

  // Check game over by lives
  if (newState.lives <= 0) {
    newState.gameOverReason = "lives";
    return { state: newState, gameOver: true };
  }

  // Camel vs collectibles
  const camelW = newState.camel.width * newState.camel.scale;
  const camelH = newState.camel.height * newState.camel.scale;
  newState.collectibles = newState.collectibles.filter((c) => {
    if (aabb(newState.camel.x, newState.camel.y, camelW, camelH, c.x, c.y, c.width, c.height)) {
      if (c.type === "heart") {
        // Heart gives extra life (max 5)
        newState.lives = Math.min(newState.lives + 1, 5);
      } else {
        // Key or MCP
        newState.collectiblesCount++;
        // Camel grows with each collectible
        newState.camel.scale = Math.min(
          newState.camel.scale + CAMEL_SCALE_PER_COLLECTIBLE,
          CAMEL_MAX_SCALE
        );
      }
      return false;
    }
    return true;
  });

  // Check overload explosion at 30 collectibles
  if (newState.collectiblesCount >= OVERLOAD_COLLECTIBLES) {
    newState.explosionParticles = createExplosionParticles(newState.camel.x, newState.camel.y);
    newState.gameOverReason = "overload";
    return { state: newState, gameOver: true };
  }

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

  // Spawn collectibles (keys and MCP)
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

  // Spawn hearts (rare)
  const heartInterval = MIN_HEART_INTERVAL + Math.random() * (MAX_HEART_INTERVAL - MIN_HEART_INTERVAL);
  if (newState.elapsedTime - newState.lastHeartSpawn >= heartInterval) {
    newState.lastHeartSpawn = newState.elapsedTime;
    newState.collectibles = [
      ...newState.collectibles,
      {
        id: genId(),
        type: "heart",
        x: GAME_WIDTH + 10,
        y: GROUND_Y - COLLECTIBLE_HEIGHT - 20 - Math.random() * 40,
        width: COLLECTIBLE_WIDTH,
        height: COLLECTIBLE_HEIGHT,
      },
    ];
  }

  return { state: newState, gameOver: false };
}
