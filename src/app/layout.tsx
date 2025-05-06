import type { Metadata } from "next";
import "./globals.css";
import { SolanaProvider } from "@/components/SolanaProvider/SolanaProvider";

export const metadata: Metadata = {
  title: 'Locura',
  description: 'Create local stablecoins for your DAO or community',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
    <body className="bg-zinc-950 text-white font-sans">
      <SolanaProvider>
        <main className="max-w-4xl mx-auto p-6">{children}</main>
      </SolanaProvider>
    </body>
  </html>
  );
}
