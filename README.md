# Locura — Localized Stablecoin Builder on Solana

**Locura** enables DAOs and communities to create their own localized stablecoins tailored to their economic needs. It provides tools for issuing and managing purpose-driven digital currencies backed by the Solana blockchain. With an easy-to-use builder, communities can customize token parameters, spending rules, and governance models. The backend uses SPL-token logic, smart contract governance, and NFT-based wallet access.
---

## Features

- **No-code Token Creator** — easily create SPL tokens via Phantom wallet
- Custom parameters — name, symbol, decimals, supply
- NFT-based wallet access control *(planned)*
- Governance setup tools *(upcoming)*
- Built on **Next.js 15 App Router** & **Solana Web3**
- Wallet integration via `@solana/wallet-adapter`
- Metadata and token indexing via **Supabase**

---

## Stack

| Layer          | Tech                                                                    |
|----------------|-------------------------------------------------------------------------|
| Frontend       | [Next.js 15](https://nextjs.org/), TailwindCSS, App Router              |
| Blockchain     | [Solana Web3.js](https://solana.com/), SPL Token                        |
| Wallets        | [@solana/wallet-adapter](https://github.com/solana-labs/wallet-adapter) |
| Storage / Index| [Supabase](https://supabase.io/) (for indexing created tokens)          |


---

#  Supabase configuration for the app

#  Public Supabase URL (used in frontend code)
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co

#  Supabase service role key (used only in backend API routes, NEVER expose to frontend)
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

#  Required table in Supabase: 'created_tokens'
# Make sure this table exists with the following columns:
 - id: uuid (primary key)
 - wallet_address: text
 - mint_address: text
 - created_at: timestamp (default now())
 - token_name: text
 - symbol: text
 - amount: numeric or bigint (depending on your precision)
 - decimals: integer

#  You can create this table in Supabase SQL Editor with:

#### CREATE TABLE created_tokens (
####   id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
####   wallet_address text NOT NULL,
####    mint_address text NOT NULL,
####    created_at timestamp with time  zone DEFAULT timezone('utc', now()),
####   token_name text NOT NULL,
####   symbol text NOT NULL,
####   amount numeric NOT NULL,
####    decimals integer NOT NULL
####  );

## Installation

```bash
git clone https://github.com/yaroslavtimch/LocalUSD.git
cd LocalUSD
npm install
npm run dev
