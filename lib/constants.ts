/**
 * Mirage Run - Black & white Dino style with camel, collectibles, water spit
 */

// Game dimensions (bigger)
export const GAME_WIDTH = 1200;
export const GAME_HEIGHT = 450;

// Camel
export const CAMEL_X = 100;
export const CAMEL_WIDTH = 55;
export const CAMEL_HEIGHT = 60;
export const JUMP_FORCE = -16;
export const DOUBLE_JUMP_FORCE = -13;
export const GRAVITY = 0.65;
export const GROUND_Y = GAME_HEIGHT - 70;

// Scroll speed
export const SCROLL_SPEED = 10;

// Lives
export const MAX_LIVES = 3;
export const INVINCIBILITY_MS = 1000;

// Obstacles
export const OBSTACLE_WIDTH = 28;
export const OBSTACLE_HEIGHT = 55;
export const OBSTACLE_SMALL_WIDTH = 24;
export const OBSTACLE_SMALL_HEIGHT = 40;

// Collectibles
export const COLLECTIBLE_WIDTH = 32;
export const COLLECTIBLE_HEIGHT = 32;

// Water spit
export const WATER_UNLOCK_COLLECTIBLES = 5;
export const INITIAL_SPITS = 3;
export const WATER_PROJECTILE_SPEED = 18;
export const WATER_PROJECTILE_SIZE = 20;

// Spawn
export const MIN_OBSTACLE_INTERVAL = 1.0;
export const MAX_OBSTACLE_INTERVAL = 2.2;
export const MIN_COLLECTIBLE_INTERVAL = 1.5;
export const MAX_COLLECTIBLE_INTERVAL = 3.0;
