import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Memory Match",
  description: "A simple memory card flip game where you match pairs.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen bg-[#0a0a0f]">
        {children}
      </body>
    </html>
  );
}
