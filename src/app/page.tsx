import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex flex-col gap-6 items-center justify-center min-h-screen text-center">
      <h1 className="text-4xl font-bold">Locura</h1>
      <p className="text-zinc-400 max-w-lg">
        Empower your DAO or community with your own purpose-driven stablecoin, backed by the Solana blockchain.
      </p>
      <Link href="/create" className="bg-indigo-600 hover:bg-indigo-500 px-6 py-3 rounded-2xl text-white font-medium">
        Create Your Currency
      </Link>
    </div>
  );
}