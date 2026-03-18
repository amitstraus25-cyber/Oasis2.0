"use client";

import { motion } from "framer-motion";

interface StartScreenProps {
  onStart: () => void;
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
        className="text-5xl font-bold text-black mb-6"
      >
        Mirage Run
      </motion.h1>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-black mb-4"
      >
        <kbd className="px-2 py-1 border border-black rounded">Space</kbd> to jump (double jump)
      </motion.p>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.25 }}
        className="text-black mb-8"
      >
        <kbd className="px-2 py-1 border border-black rounded">F</kbd> to spit water (collect 5 first)
      </motion.p>
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
