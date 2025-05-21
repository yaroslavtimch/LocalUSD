'use client';

import { useEffect, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';

type Token = {
  mint_address: string;
  wallet_address: string,
  token_name: string,
  symbol: string,
  amount: number,
  created_at: string;
};

export default function ProfilePage() {
  const { publicKey } = useWallet();
  const [tokens, setTokens] = useState<Token[]>([]);

  useEffect(() => {
    if (!publicKey) return;
    fetch(`/api/getMyTokens?wallet=${publicKey.toBase58()}`)
      .then(res => res.json())
      .then(setTokens);
  }, [publicKey]);

  return (
    <div className="p-6 max-w-3xl mx-auto bg-gray-900 rounded-lg shadow-lg text-gray-100">
      <h1 className="text-3xl font-extrabold mb-6 text-green-400">My Created Tokens</h1>
      {tokens.length === 0 ? (
        <p className="text-gray-400 italic">Nothing here yet</p>
      ) : (
        <ul className="space-y-4">
          {tokens.map((t) => (
            <li
              key={t.mint_address}
              className="border border-gray-700 p-4 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
            >
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold text-lg text-green-300">{t.token_name || 'Unnamed'}</span>
                <span className="text-sm px-2 py-1 bg-green-700 rounded-md">{t.symbol || '???'}</span>
              </div>
              <div className="text-sm mb-1">
                <strong>Mint Address:</strong> <code className="break-all">{t.mint_address}</code>
              </div>
              <div className="text-sm mb-1">
                <strong>Owner:</strong> <code className="break-all">{t.wallet_address}</code>
              </div>
              <div className="text-sm mb-1">
                <strong>Amount:</strong> {t.amount?.toLocaleString() || '–'}
              </div>
              <div className="text-xs text-gray-500 mt-2">
                Created: {new Date(t.created_at).toLocaleString()}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}