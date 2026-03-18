// Game phase
export type GamePhase = "start" | "playing" | "gameover";

// Collectible types
export type CollectibleType = "key" | "api_connection";

// Obstacle types
export type ObstacleType = "cactus" | "cactus_small";

// Camel state
export interface Camel {
  x: number;
  y: number;
  vy: number;
  width: number;
  height: number;
  scale: number;
  isOnGround: boolean;
  jumpsUsed: number;
}

// Obstacle entity
export interface Obstacle {
  id: string;
  type: ObstacleType;
  x: number;
  y: number;
  width: number;
  height: number;
}

// Collectible entity
export interface Collectible {
  id: string;
  type: CollectibleType;
  x: number;
  y: number;
  width: number;
  height: number;
}

// Water projectile
export interface WaterProjectile {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

// Full game state
export interface GameState {
  score: number;
  lives: number;
  collectiblesCount: number;
  waterUnlocked: boolean;
  spitsRemaining: number;
  elapsedTime: number;
  lastObstacleSpawn: number;
  lastCollectibleSpawn: number;
  invincibleUntil: number;
  camel: Camel;
  obstacles: Obstacle[];
  collectibles: Collectible[];
  projectiles: WaterProjectile[];
}
