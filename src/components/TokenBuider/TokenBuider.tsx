'use client'

import { useState } from "react";

export default function TokenBuilder({ onSubmit }: { onSubmit: (data: any) => void }) {
  const [name, setName] = useState("");
  const [symbol, setSymbol] = useState("");
  const [decimals, setDecimals] = useState(6);
  const [supply, setSupply] = useState(1000000);
  const [recipients, setRecipients] = useState<string[]>([""]);
  const [nftOnlyAccess, setNftOnlyAccess] = useState(false);

  const handleAddRecipient = () => {
    setRecipients([...recipients, ""]);
  };

  const handleRecipientChange = (index: number, value: string) => {
    const updated = [...recipients];
    updated[index] = value;
    setRecipients(updated);
  };

  const handleSubmit = () => {
    onSubmit({ name, symbol, decimals, supply, recipients, nftOnlyAccess });
  };

  return (
    <div className="bg-white shadow-xl p-6 rounded-2xl max-w-xl mx-auto space-y-4">
      <h2 className="text-xl font-semibold">Create Your Local DAO Token</h2>

      <div>
        <label className="block text-sm">Token Name</label>
        <input type="text" className="w-full border rounded p-2" value={name} onChange={e => setName(e.target.value)} />
      </div>

      <div>
        <label className="block text-sm">Symbol</label>
        <input type="text" className="w-full border rounded p-2" value={symbol} onChange={e => setSymbol(e.target.value)} />
      </div>

      <div>
        <label className="block text-sm">Decimals</label>
        <input type="number" className="w-full border rounded p-2" value={decimals} onChange={e => setDecimals(Number(e.target.value))} />
      </div>

      <div>
        <label className="block text-sm">Total Supply</label>
        <input type="number" className="w-full border rounded p-2" value={supply} onChange={e => setSupply(Number(e.target.value))} />
      </div>

      <div>
        <label className="block text-sm">Initial Recipients</label>
        {recipients.map((r, i) => (
          <input
            key={i}
            type="text"
            placeholder="Solana address"
            className="w-full border rounded p-2 my-1"
            value={r}
            onChange={e => handleRecipientChange(i, e.target.value)}
          />
        ))}
        <button className="text-blue-500 text-sm mt-1" onClick={handleAddRecipient}>+ Add another</button>
      </div>

      <div className="flex items-center gap-2">
        <input type="checkbox" checked={nftOnlyAccess} onChange={e => setNftOnlyAccess(e.target.checked)} />
        <label className="text-sm">Restrict access to NFT holders only</label>
      </div>

      <button onClick={handleSubmit} className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition">
        Deploy Token
      </button>
    </div>
  );
}