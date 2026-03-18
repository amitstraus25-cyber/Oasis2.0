// Game phase
export type GamePhase = "start" | "playing" | "gameover";

// Collectible types
export type CollectibleType = "api_key" | "secret" | "mcp_connector";

// Obstacle types
export type ObstacleType =
  | "cables"
  | "token_cactus"
  | "secret_spikes"
  | "permission_wall"
  | "unknown_rock";

// Camel state
export interface Camel {
  x: number;
  y: number;
  vy: number;
  width: number;
  height: number;
  scale: number;
  isOnGround: boolean;
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

// Full game state (for HUD and game logic)
export interface GameState {
  score: number;
  lives: number;
  overload: number;
  collectiblesCount: number;
  waterUnlocked: boolean;
  waterCooldown: number;
  waterCooldownMax: number;
  elapsedTime: number;
  lastObstacleSpawn: number;
  lastCollectibleSpawn: number;
  camel: Camel;
  obstacles: Obstacle[];
  collectibles: Collectible[];
  projectiles: WaterProjectile[];
  invincibleUntil: number;
}
