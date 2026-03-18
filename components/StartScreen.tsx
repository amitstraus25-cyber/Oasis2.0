"use client";

import { motion } from "framer-motion";

interface StartScreenProps {
  onStart: () => void;
}

function KeyIcon() {
  return (
    <svg width="40" height="32" viewBox="0 0 40 32" className="inline-block">
      <circle cx="12" cy="12" r="8" fill="black" />
      <rect x="16" y="10" width="16" height="4" fill="black" />
      <rect x="28" y="6" width="4" height="12" fill="black" />
    </svg>
  );
}

function MCPIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" className="inline-block">
      <rect x="4" y="4" width="24" height="24" fill="black" />
      <rect x="10" y="10" width="6" height="6" fill="white" />
      <rect x="16" y="16" width="6" height="6" fill="white" />
    </svg>
  );
}

function CactusIcon() {
  return (
    <svg width="32" height="48" viewBox="0 0 32 48" className="inline-block">
      <rect x="8" y="10" width="14" height="38" fill="black" />
      <rect x="0" y="20" width="12" height="8" fill="black" />
      <rect x="18" y="30" width="14" height="8" fill="black" />
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
      <motion.h1
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="text-5xl font-bold text-black mb-8"
      >
        Mirage Run
      </motion.h1>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15 }}
        className="mb-6 text-center"
      >
        <p className="text-lg font-bold text-black mb-3">COLLECT:</p>
        <div className="flex items-center gap-6 justify-center">
          <div className="flex items-center gap-2">
            <KeyIcon />
            <span className="text-black">Key = API access</span>
          </div>
          <div className="flex items-center gap-2">
            <MCPIcon />
            <span className="text-black">MCP = AI agent connection</span>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mb-8 text-center"
      >
        <p className="text-lg font-bold text-black mb-3">AVOID:</p>
        <div className="flex items-center gap-2 justify-center">
          <CactusIcon />
          <span className="text-black">Obstacle = Danger!</span>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.25 }}
        className="mb-8 text-center text-black"
      >
        <p className="mb-2">
          <kbd className="px-2 py-1 border border-black rounded">Space</kbd> to jump (double jump)
        </p>
        <p>
          <kbd className="px-2 py-1 border border-black rounded">F</kbd> to spit water (collect 5 first)
        </p>
      </motion.div>

      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        whileTap={{ scale: 0.98 }}
        onClick={onStart}
        className="px-8 py-3 bg-black text-white font-medium rounded"
      >
        Start
      </motion.button>
    </motion.div>
  );
}
