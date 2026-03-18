"use client";

import { motion } from "framer-motion";

interface GameOverScreenProps {
  onRestart: () => void;
  reason: "lives" | "overload";
}

export function GameOverScreen({ onRestart, reason }: GameOverScreenProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-30 flex flex-col items-center justify-center bg-gradient-to-b from-oasis-100 via-sand-100 to-oasis-200 p-8"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="max-w-xl text-center"
      >
        <h2 className="text-4xl md:text-5xl font-bold text-oasis-800 mb-6">
          Too much access can turn into chaos.
        </h2>
        <p className="text-xl text-oasis-700 mb-12">
          Oasis Security helps teams govern AI agents and non-human identities
          with clarity and control.
        </p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
          onClick={onRestart}
          className="px-12 py-4 rounded-2xl bg-oasis-500 text-white font-semibold text-lg shadow-lg shadow-oasis-500/30 hover:bg-oasis-600 transition-colors"
        >
          Run Again
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
