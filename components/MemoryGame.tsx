"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createDeck, shuffle, type Card } from "@/lib/game";

export function MemoryGame() {
  const [cards, setCards] = useState<Card[]>(() =>
    shuffle(createDeck())
  );
  const [flippedIds, setFlippedIds] = useState<string[]>([]);
  const [moves, setMoves] = useState(0);

  const handleCardClick = useCallback(
    (card: Card) => {
      if (card.isMatched || card.isFlipped || flippedIds.length >= 2) return;

      const newFlipped = [...flippedIds, card.id];
      setFlippedIds(newFlipped);
      setMoves((m) => m + 1);

      setCards((prev) =>
        prev.map((c) =>
          c.id === card.id ? { ...c, isFlipped: true } : c
        )
      );

      if (newFlipped.length === 2) {
        const [first, second] = newFlipped.map((id) =>
          cards.find((c) => c.id === id)
        );
        const matchIds = newFlipped;
        if (first?.emoji === second?.emoji) {
          setTimeout(() => {
            setCards((prev) =>
              prev.map((c) =>
                c.id === matchIds[0] || c.id === matchIds[1]
                  ? { ...c, isMatched: true }
                  : c
              )
            );
            setFlippedIds([]);
          }, 400);
        } else {
          setTimeout(() => {
            setCards((prev) =>
              prev.map((c) =>
                c.id === matchIds[0] || c.id === matchIds[1]
                  ? { ...c, isFlipped: false }
                  : c
              )
            );
            setFlippedIds([]);
          }, 600);
        }
      }
    },
    [flippedIds, cards]
  );

  const reset = () => {
    setCards(shuffle(createDeck()));
    setFlippedIds([]);
    setMoves(0);
  };

  const allMatched = cards.every((c) => c.isMatched);

  return (
    <div className="flex flex-col items-center gap-8">
      <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-fuchsia-400 bg-clip-text text-transparent">
        Memory Match
      </h1>
      <p className="text-zinc-400">Moves: {moves}</p>

      {allMatched && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-xl text-cyan-400 font-semibold"
        >
          You won in {moves} moves! 🎉
        </motion.div>
      )}

      <div className="grid grid-cols-4 gap-3">
        <AnimatePresence mode="popLayout">
          {cards.map((card) => (
            <motion.button
              key={card.id}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={() => handleCardClick(card)}
              disabled={card.isMatched || flippedIds.length >= 2}
              className="w-20 h-24 rounded-lg border-2 border-cyan-500/50 bg-[#1a1a2e] text-3xl flex items-center justify-center transition-all hover:border-cyan-400 hover:scale-105 disabled:hover:scale-100 disabled:cursor-default focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
            >
              {card.isFlipped || card.isMatched ? (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200 }}
                  className="text-4xl"
                >
                  {card.emoji}
                </motion.span>
              ) : (
                <span className="text-cyan-500/30 text-2xl">?</span>
              )}
            </motion.button>
          ))}
        </AnimatePresence>
      </div>

      <button
        onClick={reset}
        className="px-6 py-2 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/50 hover:bg-cyan-500/30 transition-colors"
      >
        New Game
      </button>
    </div>
  );
}
