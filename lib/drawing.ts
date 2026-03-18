/**
 * Black and white drawing - Google Dino style
 * Camel, cactus, collectibles (key, API), water spit
 */

import type { Camel, Obstacle, Collectible, WaterProjectile } from "./types";
import type { ObstacleType, CollectibleType } from "./types";
import { GAME_WIDTH, GAME_HEIGHT, GROUND_Y } from "./constants";

// White background, black ground line
export function drawBackground(ctx: CanvasRenderingContext2D) {
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

  // Ground line
  ctx.strokeStyle = "#000000";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, GROUND_Y);
  ctx.lineTo(GAME_WIDTH + 50, GROUND_Y);
  ctx.stroke();
}

// Camel silhouette (simple black shape - hump, body, head)
export function drawCamel(
  ctx: CanvasRenderingContext2D,
  camel: Camel,
  isInvincible?: boolean
) {
  if (isInvincible) {
    ctx.globalAlpha = 0.5 + Math.sin(Date.now() / 80) * 0.3;
  }
  ctx.fillStyle = "#000000";
  ctx.save();
  ctx.translate(camel.x, camel.y);

  // Body
  ctx.fillRect(6, 18, 30, 24);
  // Hump
  ctx.beginPath();
  ctx.ellipse(20, 12, 12, 16, 0, 0, Math.PI * 2);
  ctx.fill();
  // Neck and head
  ctx.fillRect(32, 8, 16, 22);
  ctx.beginPath();
  ctx.ellipse(46, 6, 7, 9, 0, 0, Math.PI * 2);
  ctx.fill();
  // Legs
  ctx.fillRect(10, 40, 5, 20);
  ctx.fillRect(24, 40, 5, 20);

  ctx.restore();
  ctx.globalAlpha = 1;
}

// Cactus obstacle
export function drawObstacle(
  ctx: CanvasRenderingContext2D,
  obstacle: { type: ObstacleType; x: number; y: number; width: number; height: number }
) {
  ctx.fillStyle = "#000000";
  ctx.save();
  ctx.translate(obstacle.x, obstacle.y);

  if (obstacle.type === "cactus") {
    // Main stem
    ctx.fillRect(6, 15, 16, 40);
    // Left arm
    ctx.fillRect(0, 25, 10, 8);
    // Right arm
    ctx.fillRect(18, 35, 10, 8);
  } else {
    ctx.fillRect(4, 10, 16, 25);
  }

  ctx.restore();
}

// Collectible - key or API
export function drawCollectible(
  ctx: CanvasRenderingContext2D,
  c: { type: CollectibleType; x: number; y: number; width: number; height: number }
) {
  ctx.fillStyle = "#000000";
  ctx.save();
  ctx.translate(c.x, c.y);

  if (c.type === "key") {
    // Key shape: circle + stem
    ctx.beginPath();
    ctx.arc(10, 10, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillRect(14, 12, 14, 4);
    ctx.fillRect(24, 8, 4, 12);
  } else {
    // API: simple box with lines (connection)
    ctx.fillRect(4, 4, 24, 24);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(10, 10, 6, 6);
    ctx.fillRect(18, 18, 6, 6);
  }

  ctx.restore();
}

// Water spit
export function drawWaterProjectile(ctx: CanvasRenderingContext2D, p: WaterProjectile) {
  ctx.fillStyle = "#000000";
  ctx.beginPath();
  ctx.arc(p.x + p.width / 2, p.y + p.height / 2, p.width / 2, 0, Math.PI * 2);
  ctx.fill();
}
