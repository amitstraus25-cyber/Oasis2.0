"use client";

import { motion } from "framer-motion";
import type { GameOverReason } from "@/lib/types";

interface GameOverScreenProps {
  onRestart: () => void;
  score?: number;
  collectibles?: number;
  reason?: GameOverReason;
}

function OasisLogo() {
  return (
    <svg width="80" height="80" viewBox="0 0 80 80" className="inline-block">
      {/* Palm tree trunk */}
      <path
        d="M40 65 L40 35"
        stroke="#535353"
        strokeWidth="5"
        strokeLinecap="round"
      />
      {/* Leaves */}
      <path d="M40 35 Q25 25 15 28 Q28 32 40 35" fill="#535353" />
      <path d="M40 35 Q55 25 65 28 Q52 32 40 35" fill="#535353" />
      <path d="M40 35 Q30 20 22 16 Q32 25 40 35" fill="#535353" />
      <path d="M40 35 Q50 20 58 16 Q48 25 40 35" fill="#535353" />
      <path d="M40 35 Q40 18 40 10 Q40 22 40 35" fill="#535353" />
      {/* Water/Oasis */}
      <ellipse cx="40" cy="68" rx="24" ry="8" fill="#535353" opacity="0.2" />
      <ellipse cx="40" cy="68" rx="16" ry="5" fill="#535353" opacity="0.15" />
    </svg>
  );
}

function ExplosionIcon() {
  return (
    <svg width="80" height="80" viewBox="0 0 80 80" className="inline-block">
      {/* Burst lines */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
        <line
          key={i}
          x1="40"
          y1="40"
          x2={40 + Math.cos((angle * Math.PI) / 180) * 35}
          y2={40 + Math.sin((angle * Math.PI) / 180) * 35}
          stroke="#535353"
          strokeWidth="3"
          strokeLinecap="round"
        />
      ))}
      {/* Center circle */}
      <circle cx="40" cy="40" r="12" fill="#535353" />
      {/* Keys flying */}
      <g transform="translate(58, 20) rotate(30)">
        <circle cx="0" cy="0" r="4" fill="#535353" />
        <rect x="3" y="-1.5" width="6" height="3" fill="#535353" />
      </g>
      <g transform="translate(20, 58) rotate(-45)">
        <circle cx="0" cy="0" r="4" fill="#535353" />
        <rect x="3" y="-1.5" width="6" height="3" fill="#535353" />
      </g>
    </svg>
  );
}

export function GameOverScreen({ onRestart, score = 0, collectibles = 0, reason = "lives" }: GameOverScreenProps) {
  const isOverload = reason === "overload";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-30 flex flex-col items-center justify-center bg-gradient-to-b from-white to-gray-50 p-8"
    >
      {/* Icon based on reason */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
        className="mb-4"
      >
        {isOverload ? <ExplosionIcon /> : <OasisLogo />}
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mb-6 flex gap-8 text-center"
      >
        <div>
          <span className="text-gray-400 text-xs uppercase tracking-wide">Score</span>
          <p className="text-3xl font-bold text-gray-700">{score}</p>
        </div>
        <div>
          <span className="text-gray-400 text-xs uppercase tracking-wide">Collected</span>
          <p className="text-3xl font-bold text-gray-700">{collectibles}</p>
        </div>
      </motion.div>

      {/* Headline - different based on reason */}
      <motion.h2
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-3xl font-bold text-gray-700 mb-2 text-center max-w-xl"
      >
        {isOverload
          ? "You collected too many keys and connections."
          : "The access sprawl caught up with you."}
      </motion.h2>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.35 }}
        className="text-xl text-gray-600 mb-4 text-center max-w-lg font-medium"
      >
        {isOverload
          ? "Without governance, unmanaged access explodes into chaos."
          : "Too many keys. Too many connections. No visibility."}
      </motion.p>

      {/* Oasis message */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.45 }}
        className="mb-8 p-6 bg-gray-100 rounded-xl max-w-lg text-center"
      >
        <p className="text-lg text-gray-600 leading-relaxed mb-2">
          <span className="font-bold text-gray-700">Oasis Security</span> gives you complete visibility
          and control over every API key, secret, and AI agent connection in your organization.
        </p>
        <p className="text-gray-500 text-sm">
          Stop the sprawl. Govern non-human identities. Find your oasis.
        </p>
      </motion.div>

      {/* Restart */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.55 }}
        className="flex flex-col items-center gap-3"
      >
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onRestart}
          className="px-10 py-3 bg-gray-700 text-white font-medium rounded-lg shadow-md hover:bg-gray-800 transition-colors"
        >
          Run Again
        </motion.button>
        <span className="text-xs text-gray-400">Press Enter to restart</span>
      </motion.div>

      {/* Brand footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.65 }}
        className="absolute bottom-6 text-xs text-gray-400"
      >
        A game by <span className="font-medium">Oasis Security</span> — Governing the Non-Human Identity Era
      </motion.div>
    </motion.div>
  );
}
