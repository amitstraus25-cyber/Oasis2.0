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
      className="fixed inset-0 z-20 flex flex-col items-center justify-center bg-gradient-to-b from-sand-100 via-sand-50 to-oasis-100 p-8"
    >
      <motion.h1
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-6xl md:text-7xl font-bold text-oasis-800 mb-4"
      >
        Mirage Run
      </motion.h1>
      <motion.p
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-xl text-oasis-700 text-center max-w-xl mb-12"
      >
        Collect API keys, secrets, and MCPs. Dodge the chaos. Don&apos;t overload.
      </motion.p>
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="flex flex-col gap-3 text-oasis-600 mb-12"
      >
        <p className="flex items-center gap-2">
          <kbd className="px-2 py-1 bg-white/60 rounded shadow-sm">Space</kbd>
          to jump
        </p>
        <p className="flex items-center gap-2">
          <kbd className="px-2 py-1 bg-white/60 rounded shadow-sm">F</kbd>
          to spit water
        </p>
      </motion.div>
      <motion.button
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.98 }}
        onClick={onStart}
        className="px-12 py-4 rounded-2xl bg-oasis-500 text-white font-semibold text-lg shadow-lg shadow-oasis-500/30 hover:bg-oasis-600 transition-colors"
      >
        Start Run
      </motion.button>
    </motion.div>
  );
}
