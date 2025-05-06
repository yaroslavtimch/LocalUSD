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
      const address = await createToken(decimals, amount);
      setTokenAddress(address);
    } catch (err) {
      console.error('Error creating token:', err);
      alert('Token creation failed. See console for details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-xl shadow text-blue-500">
      <h2 className="text-xl font-bold mb-4">Create Your Test Stablecoin</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Token Name"
          value={tokenName}
          onChange={(e) => setTokenName(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="text"
          placeholder="Symbol (e.g. LOCU)"
          value={symbol}
          onChange={(e) => setSymbol(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="number"
          placeholder="Decimals (0-9)"
          value={decimals}
          onChange={(e) => setDecimals(Number(e.target.value))}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="number"
          placeholder="Total Supply"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          className="w-full p-2 border rounded"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          {loading ? 'Creating...' : 'Create Token'}
        </button>
      </form>

      {tokenAddress && (
        <div className="mt-4 text-sm break-words">
          ✅ Token Created:{' '}
          <a
            href={`https://explorer.solana.com/address/${tokenAddress}?cluster=devnet`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline"
          >
            {tokenAddress}
          </a>
        </div>
      )}
    </div>
  );
}