'use client';

import { useState } from 'react';
import createToken from '@/lib/createToken';

export default function TokenBuider() {
  const [tokenName, setTokenName] = useState('');
  const [symbol, setSymbol] = useState('');
  const [decimals, setDecimals] = useState(2);
  const [amount, setAmount] = useState(1000);
  const [tokenAddress, setTokenAddress] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const address = await createToken(decimals, amount, tokenName, symbol);
      setTokenAddress(address);
    } catch (err) {
      console.error('Error creating token:', err);
      alert('Token creation failed. See console for details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-zinc-900 rounded-2xl shadow-lg text-zinc-100 border border-zinc-800">
      <h2 className="text-2xl font-semibold mb-6 text-white">Create Your Test Stablecoin</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Token Name"
          value={tokenName}
          onChange={(e) => setTokenName(e.target.value)}
          className="w-full p-3 rounded-lg bg-zinc-800 text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
          required
        />
        <input
          type="text"
          placeholder="Symbol (e.g. LOCU)"
          value={symbol}
          onChange={(e) => setSymbol(e.target.value)}
          className="w-full p-3 rounded-lg bg-zinc-800 text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
          required
        />
        <input
          type="number"
          placeholder="Decimals (0-9)"
          value={decimals}
          onChange={(e) => setDecimals(Number(e.target.value))}
          className="w-full p-3 rounded-lg bg-zinc-800 text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
          required
        />
        <input
          type="number"
          placeholder="Total Supply"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          className="w-full p-3 rounded-lg bg-zinc-800 text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 hover:bg-green-700 transition-colors duration-200 text-white py-3 rounded-lg font-semibold disabled:opacity-60"
        >
          {loading ? 'Creating...' : 'Create Token'}
        </button>
      </form>

      {tokenAddress && (
        <div className="mt-6 text-sm bg-zinc-800 p-4 rounded-lg border border-zinc-700 text-green-400">
          ✅ Token Created:&nbsp;
          <a
            href={`https://explorer.solana.com/address/${tokenAddress}?cluster=devnet`}
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-green-300 transition"
          >
            {tokenAddress}
          </a>
        </div>
      )}
    </div>
  );
}