import { Connection, PublicKey } from "@solana/web3.js";

const TOKEN_PROGRAM_ID = new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA");

export async function getMyCreatedTokens(wallet: PublicKey) {
  const connection = new Connection("https://api.devnet.solana.com", "confirmed");

  const filters = [
    {
      memcmp: {
        offset: 0, 
        bytes: wallet.toBase58(),
      },
    },
    {
      dataSize: 82, 
    },
  ];

  const accounts = await connection.getProgramAccounts(TOKEN_PROGRAM_ID, { filters });

  return accounts.map(acc => acc.pubkey.toBase58());
}