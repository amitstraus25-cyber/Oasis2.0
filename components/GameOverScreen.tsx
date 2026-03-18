"use client";

import { motion } from "framer-motion";

interface GameOverScreenProps {
  onRestart: () => void;
}

export function GameOverScreen({ onRestart }: GameOverScreenProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-30 flex flex-col items-center justify-center bg-white p-8"
    >
      <motion.h2
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-4xl font-bold text-black mb-4 text-center"
      >
        Too much access can turn into chaos.
      </motion.h2>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-lg text-black mb-10 text-center max-w-lg"
      >
        Oasis Security helps teams govern AI agents and non-human identities with clarity and control.
      </motion.p>
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        whileTap={{ scale: 0.98 }}
        onClick={onRestart}
        className="px-8 py-3 bg-black text-white font-medium rounded"
      >
        Run Again
      </motion.button>
    </motion.div>
  );
}
