"use client";

import { motion } from "framer-motion";

interface GameOverScreenProps {
  onRestart: () => void;
  score?: number;
}

function OasisLogo() {
  return (
    <svg width="60" height="60" viewBox="0 0 60 60" className="inline-block">
      {/* Palm tree */}
      <path
        d="M30 50 L30 28"
        stroke="#535353"
        strokeWidth="4"
        strokeLinecap="round"
      />
      {/* Leaves */}
      <path
        d="M30 28 Q20 20 12 22 Q22 26 30 28"
        fill="#535353"
      />
      <path
        d="M30 28 Q40 20 48 22 Q38 26 30 28"
        fill="#535353"
      />
      <path
        d="M30 28 Q25 16 18 14 Q26 20 30 28"
        fill="#535353"
      />
      <path
        d="M30 28 Q35 16 42 14 Q34 20 30 28"
        fill="#535353"
      />
      {/* Water */}
      <ellipse cx="30" cy="52" rx="18" ry="5" fill="#535353" opacity="0.3" />
    </svg>
  );
}

export function GameOverScreen({ onRestart, score = 0 }: GameOverScreenProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-30 flex flex-col items-center justify-center bg-gradient-to-b from-white to-gray-50 p-8"
    >
      {/* Calm oasis icon */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="mb-6"
      >
        <OasisLogo />
      </motion.div>

      {/* Score */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mb-6 text-center"
      >
        <span className="text-gray-400 text-sm uppercase tracking-wide">Final Score</span>
        <p className="text-4xl font-bold text-gray-700">{score}</p>
      </motion.div>

      {/* Main message */}
      <motion.h2
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-3xl font-bold text-gray-700 mb-3 text-center max-w-lg"
      >
        Too much access can turn into chaos.
      </motion.h2>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-lg text-gray-500 mb-8 text-center max-w-md leading-relaxed"
      >
        Oasis Security helps teams govern AI agents and non-human identities with clarity and control.
      </motion.p>

      {/* Buttons */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
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

      {/* Brand */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="absolute bottom-8 text-xs text-gray-400"
      >
        Made with care by <span className="font-medium">Oasis Security</span>
      </motion.div>
    </motion.div>
  );
}
