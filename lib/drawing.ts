/**
 * Canvas drawing helpers for Mirage Run
 */

import type { Camel, Obstacle, Collectible, WaterProjectile } from "./types";
import type { ObstacleType, CollectibleType } from "./types";
import {
  GAME_WIDTH,
  GAME_HEIGHT,
  GROUND_Y,
  CAMEL_BASE_WIDTH,
  CAMEL_BASE_HEIGHT,
} from "./constants";

// Draw parallax background
export function drawBackground(
  ctx: CanvasRenderingContext2D,
  scrollOffset: number,
  overload: number
) {
  const skyGrad = ctx.createLinearGradient(0, 0, 0, GAME_HEIGHT);
  skyGrad.addColorStop(0, "#87CEEB");
  skyGrad.addColorStop(0.6, "#E8D5B7");
  skyGrad.addColorStop(1, "#D4A574");
  ctx.fillStyle = skyGrad;
  ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

  // Far dunes
  ctx.fillStyle = "#E8D5B7";
  for (let i = -2; i < 4; i++) {
    const x = ((i * 400 - scrollOffset * 0.2) % (GAME_WIDTH + 400)) - 200;
    ctx.beginPath();
    ctx.ellipse(x + 200, GROUND_Y + 80, 250, 60, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  // Mid dunes
  ctx.fillStyle = "#D4A574";
  for (let i = -2; i < 4; i++) {
    const x = ((i * 350 - scrollOffset * 0.4) % (GAME_WIDTH + 350)) - 175;
    ctx.beginPath();
    ctx.ellipse(x + 175, GROUND_Y + 50, 200, 50, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  // Ground
  ctx.fillStyle = "#C4955C";
  ctx.fillRect(0, GROUND_Y + 30, GAME_WIDTH, GAME_HEIGHT - GROUND_Y);

  // Palm trees (simplified)
  ctx.fillStyle = "#8B7355";
  for (let i = -1; i < 3; i++) {
    const x = ((i * 500 - scrollOffset * 0.3) % (GAME_WIDTH + 500)) - 250;
    if (x > -100 && x < GAME_WIDTH + 100) {
      ctx.fillRect(x + 250, GROUND_Y - 80, 8, 100);
      ctx.fillStyle = "#2D5A27";
      ctx.beginPath();
      ctx.arc(x + 254, GROUND_Y - 90, 40, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#8B7355";
    }
  }

  // Overload effects: more visual clutter
  if (overload >= 9) {
    ctx.globalAlpha = Math.min(0.3, (overload - 9) * 0.05);
    ctx.strokeStyle = "#94a3b8";
    ctx.lineWidth = 1;
    for (let i = 0; i < 5; i++) {
      const x = ((i * 300 - scrollOffset * 0.5) % (GAME_WIDTH + 300)) - 150;
      ctx.beginPath();
      ctx.moveTo(x, GROUND_Y);
      ctx.lineTo(x + 50, GROUND_Y - 30);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
  }
}

// Draw cute camel
export function drawCamel(
  ctx: CanvasRenderingContext2D,
  camel: Camel,
  isInvincible?: boolean
) {
  ctx.save();
  if (isInvincible) {
    ctx.globalAlpha = 0.5 + Math.sin(Date.now() / 80) * 0.3;
  }
  ctx.translate(camel.x, camel.y);
  ctx.scale(camel.scale, camel.scale);

  const w = CAMEL_BASE_WIDTH;
  const h = CAMEL_BASE_HEIGHT;

  // Body (rounded rectangle - cute blob)
  ctx.fillStyle = "#C4955C";
  ctx.beginPath();
  roundRect(ctx, -w / 2, -h / 2, w, h, 12);
  ctx.fill();

  // Belly (lighter)
  ctx.fillStyle = "#E8D5B7";
  ctx.beginPath();
  roundRect(ctx, -w / 2 + 5, -h / 2 + 15, w - 10, h / 2, 8);
  ctx.fill();

  // Head
  ctx.fillStyle = "#C4955C";
  ctx.beginPath();
  ctx.ellipse(w / 2 + 15, -h / 4, 18, 14, 0, 0, Math.PI * 2);
  ctx.fill();

  // Eye
  ctx.fillStyle = "#1a1a1a";
  ctx.beginPath();
  ctx.arc(w / 2 + 22, -h / 4 - 2, 3, 0, Math.PI * 2);
  ctx.fill();

  // Hump (cute)
  ctx.fillStyle = "#D4A574";
  ctx.beginPath();
  ctx.ellipse(-w / 4, -h / 2 - 5, 12, 18, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
}

// Draw obstacle by type
export function drawObstacle(
  ctx: CanvasRenderingContext2D,
  obstacle: { type: ObstacleType; x: number; y: number; width: number; height: number }
) {
  ctx.save();
  ctx.translate(obstacle.x, obstacle.y);

  const w = obstacle.width;
  const h = obstacle.height;

  switch (obstacle.type) {
    case "cables":
      ctx.strokeStyle = "#64748b";
      ctx.lineWidth = 4;
      ctx.beginPath();
      for (let i = 0; i < 4; i++) {
        ctx.moveTo(5, 10 + i * 10);
        ctx.bezierCurveTo(20, 5, 35, 35, 45, 20 + i * 5);
      }
      ctx.stroke();
      break;
    case "token_cactus":
      ctx.fillStyle = "#22c55e";
      ctx.fillRect(15, 10, 20, 40);
      ctx.fillStyle = "#f59e0b";
      ctx.beginPath();
      ctx.arc(25, 15, 8, 0, Math.PI * 2);
      ctx.fill();
      break;
    case "secret_spikes":
      ctx.fillStyle = "#ef4444";
      for (let i = 0; i < 5; i++) {
        ctx.beginPath();
        ctx.moveTo(10 + i * 10, 45);
        ctx.lineTo(15 + i * 10, 5);
        ctx.lineTo(20 + i * 10, 45);
        ctx.closePath();
        ctx.fill();
      }
      break;
    case "permission_wall":
      ctx.fillStyle = "#78716c";
      ctx.fillRect(0, 5, w, h - 10);
      ctx.fillStyle = "#a8a29e";
      ctx.fillRect(5, 15, 15, 20);
      ctx.fillRect(25, 15, 15, 20);
      break;
    case "unknown_rock":
      ctx.fillStyle = "#6b7280";
      ctx.beginPath();
      ctx.moveTo(25, 5);
      ctx.lineTo(45, 20);
      ctx.lineTo(40, 45);
      ctx.lineTo(10, 40);
      ctx.closePath();
      ctx.fill();
      break;
  }

  ctx.restore();
}

// Draw collectible by type
export function drawCollectible(
  ctx: CanvasRenderingContext2D,
  collectible: {
    type: CollectibleType;
    x: number;
    y: number;
    width: number;
    height: number;
  }
) {
  ctx.save();
  ctx.translate(collectible.x, collectible.y);

  const w = collectible.width;
  const h = collectible.height;

  switch (collectible.type) {
    case "api_key":
      ctx.fillStyle = "#3b82f6";
      ctx.fillRect(5, 15, 30, 10);
      ctx.fillStyle = "#60a5fa";
      ctx.font = "10px sans-serif";
      ctx.fillText("key", 10, 23);
      break;
    case "secret":
      ctx.fillStyle = "#8b5cf6";
      ctx.beginPath();
      ctx.arc(20, 20, 15, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#a78bfa";
      ctx.font = "bold 8px sans-serif";
      ctx.fillText("?", 16, 24);
      break;
    case "mcp_connector":
      ctx.fillStyle = "#0d9488";
      ctx.fillRect(5, 5, 30, 30);
      ctx.fillStyle = "#14b8a6";
      ctx.fillRect(10, 10, 10, 10);
      ctx.fillRect(20, 20, 10, 10);
      break;
  }

  ctx.restore();
}

// Draw water projectile
export function drawWaterProjectile(
  ctx: CanvasRenderingContext2D,
  projectile: WaterProjectile
) {
  ctx.save();
  ctx.translate(projectile.x, projectile.y);

  const grad = ctx.createLinearGradient(0, 0, projectile.width, 0);
  grad.addColorStop(0, "#7dd3fc");
  grad.addColorStop(1, "#0ea5e9");
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.ellipse(
    projectile.width / 2,
    projectile.height / 2,
    projectile.width / 2,
    projectile.height / 2,
    0,
    0,
    Math.PI * 2
  );
  ctx.fill();

  ctx.restore();
}
