export type Card = {
  id: string;
  emoji: string;
  isFlipped: boolean;
  isMatched: boolean;
};

const EMOJIS = ["🎮", "🎯", "🎲", "🎪", "🎨", "🎭", "🎸", "🎺"];

export function createDeck(): Card[] {
  const pairs = [...EMOJIS, ...EMOJIS];
  return pairs.map((emoji, i) => ({
    id: `${emoji}-${i}`,
    emoji,
    isFlipped: false,
    isMatched: false,
  }));
}

export function shuffle<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}
