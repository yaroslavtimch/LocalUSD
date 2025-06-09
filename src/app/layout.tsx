import type { Metadata } from "next";
import "./globals.css";
import { SolanaProvider } from "@/components/SolanaProvider/SolanaProvider";
import Link from "next/link";
import WalletConnection from "@/components/WalletConnection/WalletConnection";


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
          <header className="bg-gray-900 text-gray-100 shadow-md">
            <div className="max-w-5xl mx-auto flex items-center justify-between p-4">
              <Link href="/" className="text-2xl font-bold text-green-400 hover:text-green-500 transition">
                  Locura
              </Link>
              <nav className="space-x-6 text-lg flex items-center">
                <Link href="/create" className="hover:text-green-400 transition">
                  Create Token
                </Link>
                <Link href="/me" className="hover:text-green-400 transition">
                  My Tokens
                </Link>
                <WalletConnection />
              </nav>
            </div>
          </header>
          <main className="max-w-4xl mx-auto p-6">{children}</main>
        </SolanaProvider>
    </body>
  </html>
  );
}
