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

## Installation

```bash
git clone https://github.com/yaroslavtimch/LocalUSD.git
cd LocalUSD
npm install
npm run dev
