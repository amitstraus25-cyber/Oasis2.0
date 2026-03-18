/**
 * Mirage Run - Editable game constants
 */

// Game dimensions (fixed aspect ratio 16:9)
export const GAME_WIDTH = 1280;
export const GAME_HEIGHT = 720;

// Camel
export const CAMEL_BASE_WIDTH = 60;
export const CAMEL_BASE_HEIGHT = 50;
export const CAMEL_X = 150; // Fixed position (world scrolls past)
export const JUMP_FORCE = -18;
export const GRAVITY = 0.8;
export const GROUND_Y = GAME_HEIGHT - 120;
export const CAMEL_SCALE_PER_OVERLOAD = 0.03; // +3% per overload point
export const CAMEL_MAX_SCALE = 1.5;

// Overload
export const OVERLOAD_CALM = 4;
export const OVERLOAD_SLIGHT = 8;
export const OVERLOAD_MESSY = 12;
export const OVERLOAD_HIGH_RISK = 16;
export const OVERLOAD_GAME_OVER = 17;

// Water spit
export const WATER_UNLOCK_OVERLOAD = 7;
export const WATER_UNLOCK_COLLECTIBLES = 7;
export const WATER_COOLDOWN_MS = 1800;
export const WATER_PROJECTILE_SPEED = 15;
export const WATER_PROJECTILE_WIDTH = 24;
export const WATER_PROJECTILE_HEIGHT = 16;

// Lives
export const MAX_LIVES = 3;
export const INVINCIBILITY_MS = 1000;

// Scroll speed (how fast world moves left)
export const SCROLL_SPEED = 8;

// Collectible config
export const COLLECTIBLE_CONFIG = {
  api_key: { overload: 1, score: 10, weight: 5 },
  secret: { overload: 2, score: 20, weight: 2 },
  mcp_connector: { overload: 1, score: 15, weight: 3 },
} as const;

// Obstacle dimensions
export const OBSTACLE_WIDTH = 50;
export const OBSTACLE_HEIGHT = 50;
export const COLLECTIBLE_WIDTH = 40;
export const COLLECTIBLE_HEIGHT = 40;

// Spawn rates (ms between spawns) by time phase
export const SPAWN_PHASES = [
  { start: 0, end: 15, obstacleInterval: 2500, collectibleInterval: 2000 },
  { start: 15, end: 35, obstacleInterval: 1800, collectibleInterval: 1500 },
  { start: 35, end: 60, obstacleInterval: 1200, collectibleInterval: 1000 },
  { start: 60, end: Infinity, obstacleInterval: 900, collectibleInterval: 800 },
];
