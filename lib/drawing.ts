/**
 * Black and white drawing - Google Dino style
 * Polished camel, cactus, collectibles (key, MCP), water spit
 */

import type { Camel, Obstacle, Collectible, WaterProjectile } from "./types";
import type { ObstacleType, CollectibleType } from "./types";
import { GAME_WIDTH, GAME_HEIGHT, GROUND_Y } from "./constants";

// White background with subtle ground texture
export function drawBackground(ctx: CanvasRenderingContext2D, scrollOffset: number) {
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

  // Ground line
  ctx.strokeStyle = "#535353";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, GROUND_Y);
  ctx.lineTo(GAME_WIDTH, GROUND_Y);
  ctx.stroke();

  // Ground texture dots (like Chrome Dino)
  ctx.fillStyle = "#535353";
  for (let i = 0; i < 30; i++) {
    const baseX = (i * 50 - (scrollOffset * 0.5) % 50 + GAME_WIDTH) % GAME_WIDTH;
    ctx.fillRect(baseX, GROUND_Y + 8 + (i % 3) * 4, 2, 2);
  }
}

// Polished camel silhouette
export function drawCamel(
  ctx: CanvasRenderingContext2D,
  camel: Camel,
  isInvincible?: boolean
) {
  if (isInvincible) {
    ctx.globalAlpha = 0.5 + Math.sin(Date.now() / 80) * 0.3;
  }
  ctx.fillStyle = "#535353";
  ctx.save();
  ctx.translate(camel.x, camel.y);
  ctx.scale(camel.scale, camel.scale);

  // Back legs
  ctx.fillRect(8, 38, 6, 22);
  ctx.fillRect(22, 38, 6, 22);

  // Body (rounded)
  ctx.beginPath();
  ctx.ellipse(24, 30, 20, 14, 0, 0, Math.PI * 2);
  ctx.fill();

  // Hump
  ctx.beginPath();
  ctx.ellipse(18, 18, 10, 14, 0, 0, Math.PI * 2);
  ctx.fill();

  // Neck
  ctx.beginPath();
  ctx.moveTo(36, 26);
  ctx.quadraticCurveTo(42, 20, 44, 8);
  ctx.quadraticCurveTo(50, 6, 52, 8);
  ctx.quadraticCurveTo(54, 20, 48, 28);
  ctx.closePath();
  ctx.fill();

  // Head
  ctx.beginPath();
  ctx.ellipse(52, 6, 8, 6, 0.3, 0, Math.PI * 2);
  ctx.fill();

  // Snout
  ctx.beginPath();
  ctx.ellipse(58, 8, 5, 4, 0.2, 0, Math.PI * 2);
  ctx.fill();

  // Eye
  ctx.fillStyle = "#ffffff";
  ctx.beginPath();
  ctx.arc(50, 4, 2, 0, Math.PI * 2);
  ctx.fill();

  // Ear
  ctx.fillStyle = "#535353";
  ctx.beginPath();
  ctx.ellipse(46, 0, 3, 5, -0.3, 0, Math.PI * 2);
  ctx.fill();

  // Tail
  ctx.beginPath();
  ctx.moveTo(4, 28);
  ctx.quadraticCurveTo(-2, 24, 0, 18);
  ctx.quadraticCurveTo(2, 22, 6, 26);
  ctx.closePath();
  ctx.fill();

  ctx.restore();
  ctx.globalAlpha = 1;
}

// Improved cactus obstacle
export function drawObstacle(
  ctx: CanvasRenderingContext2D,
  obstacle: { type: ObstacleType; x: number; y: number; width: number; height: number }
) {
  ctx.fillStyle = "#535353";
  ctx.save();
  ctx.translate(obstacle.x, obstacle.y);

  if (obstacle.type === "cactus") {
    // Main stem with rounded top
    ctx.beginPath();
    ctx.roundRect(8, 12, 12, 43, 4);
    ctx.fill();

    // Left arm
    ctx.beginPath();
    ctx.roundRect(0, 22, 12, 6, 3);
    ctx.fill();
    ctx.beginPath();
    ctx.roundRect(0, 14, 6, 12, 3);
    ctx.fill();

    // Right arm
    ctx.beginPath();
    ctx.roundRect(16, 32, 12, 6, 3);
    ctx.fill();
    ctx.beginPath();
    ctx.roundRect(22, 24, 6, 14, 3);
    ctx.fill();
  } else {
    // Small cactus
    ctx.beginPath();
    ctx.roundRect(6, 8, 12, 32, 4);
    ctx.fill();
  }

  ctx.restore();
}

// Improved key collectible
export function drawCollectible(
  ctx: CanvasRenderingContext2D,
  c: { type: CollectibleType; x: number; y: number; width: number; height: number }
) {
  ctx.save();
  ctx.translate(c.x, c.y);

  if (c.type === "key") {
    ctx.fillStyle = "#535353";
    
    // Key head (circle with hole)
    ctx.beginPath();
    ctx.arc(10, 10, 9, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(10, 10, 4, 0, Math.PI * 2);
    ctx.fill();

    // Key shaft
    ctx.fillStyle = "#535353";
    ctx.beginPath();
    ctx.roundRect(16, 8, 14, 4, 2);
    ctx.fill();

    // Key teeth
    ctx.fillRect(24, 8, 3, 8);
    ctx.fillRect(28, 8, 3, 6);
  } else {
    // MCP connector - circuit-like design
    ctx.fillStyle = "#535353";
    ctx.strokeStyle = "#535353";
    ctx.lineWidth = 2;

    // Outer border
    ctx.beginPath();
    ctx.roundRect(2, 2, 28, 28, 4);
    ctx.stroke();

    // Inner square
    ctx.beginPath();
    ctx.roundRect(8, 8, 16, 16, 2);
    ctx.fill();

    // Connection dots
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(12, 12, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(20, 20, 3, 0, Math.PI * 2);
    ctx.fill();

    // Connection lines
    ctx.fillStyle = "#535353";
    ctx.fillRect(14, 0, 4, 6);
    ctx.fillRect(14, 26, 4, 6);
    ctx.fillRect(0, 14, 6, 4);
    ctx.fillRect(26, 14, 6, 4);
  }

  ctx.restore();
}

// Improved water spit (droplet shape)
export function drawWaterProjectile(ctx: CanvasRenderingContext2D, p: WaterProjectile) {
  ctx.fillStyle = "#535353";
  ctx.save();
  ctx.translate(p.x, p.y);

  // Droplet shape
  ctx.beginPath();
  ctx.moveTo(p.width, p.height / 2);
  ctx.quadraticCurveTo(p.width * 0.8, 0, p.width / 2, 0);
  ctx.quadraticCurveTo(0, 0, 0, p.height / 2);
  ctx.quadraticCurveTo(0, p.height, p.width / 2, p.height);
  ctx.quadraticCurveTo(p.width * 0.8, p.height, p.width, p.height / 2);
  ctx.fill();

  // Highlight
  ctx.fillStyle = "#ffffff";
  ctx.beginPath();
  ctx.arc(p.width * 0.35, p.height * 0.35, 3, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}
