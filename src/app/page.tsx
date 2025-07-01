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

      <div className="mt-16 max-w-3xl w-full">
        <h2 className="text-2xl font-semibold mb-6">What You Can Do with Locura</h2>
        <ul className="grid md:grid-cols-2 gap-6 text-left text-sm text-zinc-300">
          <li className="bg-zinc-900 p-4 rounded-lg border border-zinc-700">
            <strong>Create custom SPL tokens</strong> with name, symbol, decimals and total supply in just one click.
          </li>
          <li className="bg-zinc-900 p-4 rounded-lg border border-zinc-700">
            <strong>See your tokens</strong> in your personal profile and track what you’ve created.
          </li>
          <li className="bg-zinc-900 p-4 rounded-lg border border-zinc-700">
             <strong>Send tokens</strong> to other wallets easily with built-in transfer UI.
          </li>
          <li className="bg-zinc-900 p-4 rounded-lg border border-zinc-700">
            <strong>Supabase storage</strong> keeps token metadata like name and amount for easy lookup.
          </li>
        </ul>
      </div>
    </div>
  );
}