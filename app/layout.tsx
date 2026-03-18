import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mirage Run",
  description: "Collect API keys, secrets, and MCPs. Dodge the chaos. Don't overload.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
