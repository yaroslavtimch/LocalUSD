'use client'

import React, { useState, useEffect } from 'react';
import { PublicKey, Transaction, clusterApiUrl, Connection } from '@solana/web3.js';
import {
  TOKEN_PROGRAM_ID,
  getAssociatedTokenAddress,
  createTransferInstruction,
  createAssociatedTokenAccountInstruction,
} from '@solana/spl-token';
import { useWallet } from '@solana/wallet-adapter-react';

type Token = {
  mint_address: string;
  token_name?: string;
  symbol?: string;
  decimals?: number
};

export default function SendTokenWithSelect() {
  const wallet = useWallet();
  const [tokens, setTokens] = useState<Token[]>([]);
  const [selectedMint, setSelectedMint] = useState<string>('');
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [decimals, setDecimals] = useState(0);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!wallet.publicKey) return;
    fetch(`/api/getMyTokens?wallet=${wallet.publicKey.toBase58()}`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setTokens(data);
          if (data.length > 0) setSelectedMint(data[0].mint_address);
          if (data.length > 0 && data[0].decimals !== undefined) setDecimals(data[0].decimals);
        }
      });
  }, [wallet]);

  function onMintChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const mint = e.target.value;
    setSelectedMint(mint);
    const token = tokens.find(t => t.mint_address === mint);
    if (token && token.decimals !== undefined) {
      setDecimals(token.decimals);
    } else {
      setDecimals(0);
    }
  }

  async function sendTokens() {
    try {
      setLoading(true);
      setMessage('');

      const provider = (window as any).solana;
      if (!provider?.isPhantom) throw new Error('Phantom wallet not found');

      await provider.connect();
      const walletPubkey = provider.publicKey;
      const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');

      const mintPubkey = new PublicKey(selectedMint);
      const recipientPubkey = new PublicKey(recipient);

      const fromATA = await getAssociatedTokenAddress(mintPubkey, walletPubkey);
      const toATA = await getAssociatedTokenAddress(mintPubkey, recipientPubkey);

      const transaction = new Transaction();

      const toAccountInfo = await connection.getAccountInfo(toATA);

      if (!toAccountInfo) {
        transaction.add(
          createAssociatedTokenAccountInstruction(
            walletPubkey, 
            toATA, 
            recipientPubkey, 
            mintPubkey 
          )
        );
      }

      const amountBN = BigInt(Number(amount) * Math.pow(10, decimals));
      const transferIx = createTransferInstruction(fromATA, toATA, walletPubkey, amountBN, [], TOKEN_PROGRAM_ID);

      transaction.add(transferIx);

      transaction.feePayer = walletPubkey;
      transaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;

      const signedTx = await provider.signTransaction(transaction);
      const txid = await connection.sendRawTransaction(signedTx.serialize());

      await connection.confirmTransaction(txid, 'confirmed');

      setMessage(`Tokens sent! Transaction ID: ${txid}`);
    } catch (error: any) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-gray-900 rounded-lg text-gray-100">
      <h2 className="text-2xl font-bold mb-4 text-green-400">Send Tokens</h2>

      <label className="block mb-2">Choose Token</label>
      <select
        value={selectedMint}
        onChange={onMintChange}
        className="w-full p-2 mb-4 rounded border border-gray-700 bg-gray-800"
      >
        {tokens.map((t) => (
          <option key={t.mint_address} value={t.mint_address}>
            {t.token_name ? `${t.token_name} (${t.symbol || '???'})` : t.mint_address}
          </option>
        ))}
      </select>

      <input
        type="text"
        placeholder="Recipient Wallet Address"
        value={recipient}
        onChange={(e) => setRecipient(e.target.value)}
        className="w-full p-2 mb-3 rounded border border-gray-700 bg-gray-800"
      />

      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="w-full p-2 mb-3 rounded border border-gray-700 bg-gray-800"
      />

      <div className="mb-4 text-sm text-gray-400">Decimals: {decimals}</div>

      <button
        onClick={sendTokens}
        disabled={loading || !selectedMint || !recipient || !amount}
        className="w-full bg-green-600 hover:bg-green-700 rounded py-2 text-white font-semibold"
      >
        {loading ? 'Sending...' : 'Send Tokens'}
      </button>

      {message && <p className="mt-4 text-sm break-words">{message}</p>}
    </div>
  );
}