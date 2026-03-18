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
      <h2 className="text-4xl font-bold text-black mb-6">Game Over</h2>
      <p className="text-black mb-8">Press Enter or click to restart</p>
      <motion.button
        whileTap={{ scale: 0.98 }}
        onClick={onRestart}
        className="px-8 py-3 bg-black text-white font-medium rounded"
      >
        Restart
      </motion.button>
    </motion.div>
  );
}
