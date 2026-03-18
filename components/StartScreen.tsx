"use client";

import { motion } from "framer-motion";

interface StartScreenProps {
  onStart: () => void;
}

function CamelIcon() {
  return (
    <svg width="80" height="60" viewBox="0 0 80 60" className="inline-block">
      {/* Back legs */}
      <rect x="12" y="38" width="6" height="22" fill="#535353" />
      <rect x="26" y="38" width="6" height="22" fill="#535353" />
      {/* Body */}
      <ellipse cx="28" cy="32" rx="20" ry="14" fill="#535353" />
      {/* Hump */}
      <ellipse cx="22" cy="20" rx="10" ry="14" fill="#535353" />
      {/* Neck */}
      <path d="M40 28 Q46 22 48 10 Q54 8 56 10 Q58 22 52 30 Z" fill="#535353" />
      {/* Head */}
      <ellipse cx="56" cy="8" rx="8" ry="6" fill="#535353" />
      {/* Snout */}
      <ellipse cx="62" cy="10" rx="5" ry="4" fill="#535353" />
      {/* Eye */}
      <circle cx="54" cy="6" r="2" fill="white" />
      {/* Ear */}
      <ellipse cx="50" cy="2" rx="3" ry="5" fill="#535353" />
      {/* Tail */}
      <path d="M8 30 Q2 26 4 20 Q6 24 10 28 Z" fill="#535353" />
    </svg>
  );
}

function KeyIcon() {
  return (
    <svg width="48" height="32" viewBox="0 0 48 32" className="inline-block">
      {/* Key head with hole */}
      <circle cx="14" cy="14" r="12" fill="#535353" />
      <circle cx="14" cy="14" r="6" fill="white" />
      {/* Shaft */}
      <rect x="22" y="11" width="20" height="6" rx="2" fill="#535353" />
      {/* Teeth */}
      <rect x="34" y="11" width="4" height="12" fill="#535353" />
      <rect x="40" y="11" width="4" height="9" fill="#535353" />
    </svg>
  );
}

function MCPIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" className="inline-block">
      {/* Outer border */}
      <rect x="4" y="4" width="32" height="32" rx="4" stroke="#535353" strokeWidth="2" fill="none" />
      {/* Inner square */}
      <rect x="10" y="10" width="20" height="20" rx="2" fill="#535353" />
      {/* Connection dots */}
      <circle cx="15" cy="15" r="4" fill="white" />
      <circle cx="25" cy="25" r="4" fill="white" />
      {/* Connection lines */}
      <rect x="18" y="0" width="4" height="8" fill="#535353" />
      <rect x="18" y="32" width="4" height="8" fill="#535353" />
      <rect x="0" y="18" width="8" height="4" fill="#535353" />
      <rect x="32" y="18" width="8" height="4" fill="#535353" />
    </svg>
  );
}

function CactusIcon() {
  return (
    <svg width="36" height="56" viewBox="0 0 36 56" className="inline-block">
      {/* Main stem */}
      <rect x="10" y="12" width="14" height="44" rx="4" fill="#535353" />
      {/* Left arm */}
      <rect x="2" y="24" width="14" height="6" rx="3" fill="#535353" />
      <rect x="2" y="16" width="6" height="16" rx="3" fill="#535353" />
      {/* Right arm */}
      <rect x="18" y="34" width="14" height="6" rx="3" fill="#535353" />
      <rect x="26" y="26" width="6" height="18" rx="3" fill="#535353" />
    </svg>
  );
}

function WaterDropIcon() {
  return (
    <svg width="28" height="36" viewBox="0 0 28 36" className="inline-block">
      <path
        d="M14 4 Q4 16 4 22 Q4 32 14 32 Q24 32 24 22 Q24 16 14 4 Z"
        fill="#535353"
      />
      <circle cx="10" cy="18" r="3" fill="white" />
    </svg>
  );
}

export function StartScreen({ onStart }: StartScreenProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-20 flex flex-col items-center justify-center bg-white p-8"
    >
      {/* Title with camel */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex items-center gap-4 mb-6"
      >
        <CamelIcon />
        <h1 className="text-5xl font-bold text-gray-700">Oasis Mirage Run</h1>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15 }}
        className="text-gray-500 mb-8 text-center max-w-md"
      >
        Collect API keys and MCP connections. Dodge obstacles. Don&apos;t get overwhelmed!
      </motion.p>

      {/* Tutorial section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mb-8 p-6 border-2 border-gray-300 rounded-xl bg-gray-50"
      >
        <div className="grid grid-cols-3 gap-8 text-center">
          {/* Collect items */}
          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center gap-3 mb-2">
              <KeyIcon />
            </div>
            <span className="text-sm font-medium text-gray-600">API Key</span>
            <span className="text-xs text-gray-400">+10 pts</span>
          </div>

          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center gap-3 mb-2">
              <MCPIcon />
            </div>
            <span className="text-sm font-medium text-gray-600">MCP Connection</span>
            <span className="text-xs text-gray-400">+15 pts</span>
          </div>

          {/* Avoid */}
          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center gap-3 mb-2">
              <CactusIcon />
            </div>
            <span className="text-sm font-medium text-gray-600">Obstacle</span>
            <span className="text-xs text-red-400">Avoid!</span>
          </div>
        </div>
      </motion.div>

      {/* Controls */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.25 }}
        className="mb-8 flex gap-6 text-gray-600"
      >
        <div className="flex items-center gap-2">
          <kbd className="px-3 py-1.5 bg-gray-100 border border-gray-300 rounded-md font-mono text-sm shadow-sm">
            Space
          </kbd>
          <span className="text-sm">Jump / Double Jump</span>
        </div>
        <div className="flex items-center gap-2">
          <kbd className="px-3 py-1.5 bg-gray-100 border border-gray-300 rounded-md font-mono text-sm shadow-sm">
            F
          </kbd>
          <span className="text-sm flex items-center gap-1">
            Spit Water <WaterDropIcon />
          </span>
        </div>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.28 }}
        className="text-xs text-gray-400 mb-6"
      >
        Collect 5 items to unlock water spit ability
      </motion.p>

      {/* Start button */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onStart}
        className="px-10 py-3 bg-gray-700 text-white font-medium rounded-lg shadow-md hover:bg-gray-800 transition-colors"
      >
        Start Run
      </motion.button>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.35 }}
        className="mt-4 text-xs text-gray-400"
      >
        Press Enter to start
      </motion.p>
    </motion.div>
  );
}
