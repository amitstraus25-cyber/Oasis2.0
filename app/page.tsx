"use client";

import { MemoryGame } from "@/components/MemoryGame";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6">
      <MemoryGame />
    </main>
  );
}
