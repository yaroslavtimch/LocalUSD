'use client'

import { useWallet } from '@solana/wallet-adapter-react';
import { useEffect, useState } from 'react';
import { Connection } from '@solana/web3.js';
import { getMyCreatedTokens } from '@/lib/getCreatedTokens';

const connection = new Connection('https://api.devnet.solana.com');

type Token = {
  mint_address: string;
  created_at: string;
};

export default function ProfilePage() {
  const { publicKey, disconnect } = useWallet();
  const [balance, setBalance] = useState<number | null>(null);
  const [joinedDAOs, setJoinedDAOs] = useState<string[]>([]); // моковые DAO
  const [tokens, setTokens] = useState<Token[]>([]);

  useEffect(() => {
    if (!publicKey) return;
    fetch(`/api/getMyTokens?wallet=${publicKey.toBase58()}`)
      .then(res => res.json())
      .then(setTokens);
  }, [publicKey]);


  useEffect(() => {
    const fetchBalance = async () => {
      if (publicKey) {
        const lamports = await connection.getBalance(publicKey);
        setBalance(lamports / 1_000_000_000); // перевели в SOL
      }
    };

    fetchBalance();

    // Моковые DAO
    setJoinedDAOs([
      'Kyiv Builders DAO',
      'Locura Test DAO',
      'ETH DAO Lviv'
    ]);
  }, [publicKey]);

  if (!publicKey) {
    return (
      <div className="p-6 text-center text-gray-700">
        <h2 className="text-xl font-bold mb-2">👤 Профиль</h2>
        <p>Подключите кошелёк, чтобы увидеть профиль.</p>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold">👤 Мой профиль</h1>

      <div className="bg-white/5 p-4 rounded-xl border border-white/10 shadow">
        <h2 className="text-lg font-semibold mb-1">💼 Адрес:</h2>
        <p className="text-sm text-gray-300">{publicKey.toBase58()}</p>
      </div>

      <div className="bg-white/5 p-4 rounded-xl border border-white/10 shadow">
        <h2 className="text-lg font-semibold mb-1">💰 Баланс:</h2>
        <p>{balance !== null ? `${balance.toFixed(3)} SOL` : 'Загрузка...'}</p>
      </div>

      <div className="bg-white/5 p-4 rounded-xl border border-white/10 shadow">
        <h1 className="text-2xl font-bold mb-4">Мои созданные токены</h1>
        {tokens.length === 0 ? (
          <p>Пока ничего нет</p>
        ) : (
          <ul className="space-y-2">
            {tokens.map((t) => (
              <li key={t.mint_address} className="border p-3 rounded">
                <div>Mint: {t.mint_address}</div>
                <div className="text-sm text-gray-500">Создан: {new Date(t.created_at).toLocaleString()}</div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="bg-white/5 p-4 rounded-xl border border-white/10 shadow">
        <h2 className="text-lg font-semibold mb-2">🏛 DAO-участие:</h2>
        <ul className="list-disc pl-5 space-y-1 text-gray-200">
          {joinedDAOs.map((dao, index) => (
            <li key={index}>{dao}</li>
          ))}
        </ul>
      </div>

      <button
        onClick={disconnect}
        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
      >
        🔌 Отключить кошелёк
      </button>
    </div>
  );
}