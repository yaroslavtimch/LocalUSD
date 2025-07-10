import {
  Connection,
  clusterApiUrl,
  Keypair,
  SystemProgram,
  Transaction,
  PublicKey,
} from '@solana/web3.js'
import {
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
  MintLayout,
  createInitializeMintInstruction,
  createAssociatedTokenAccountInstruction,
  getAssociatedTokenAddress,
  createMintToInstruction,
} from '@solana/spl-token'
import {
  DataV2,
  createCreateMetadataAccountV3Instruction,
  PROGRAM_ID as TOKEN_METADATA_PROGRAM_ID,
} from '@metaplex-foundation/mpl-token-metadata'

export default async function createToken(
  decimals: number,
  amount: number,
  name: string,
  symbol: string
): Promise<string> {
  const provider = (window as any).solana
  if (!provider?.isPhantom) {
    throw new Error('Phantom wallet not found')
  }

  await provider.connect()
  const wallet = provider.publicKey
  const connection = new Connection(clusterApiUrl('devnet'), 'confirmed')

  const mintKeypair = Keypair.generate()
  const mintPubkey = mintKeypair.publicKey

  const lamports = await connection.getMinimumBalanceForRentExemption(MintLayout.span)

  const tx = new Transaction()

  // Создаем аккаунт для Mint и инициализируем его
  tx.add(
    SystemProgram.createAccount({
      fromPubkey: wallet,
      newAccountPubkey: mintPubkey,
      space: MintLayout.span,
      lamports,
      programId: TOKEN_PROGRAM_ID,
    }),
    createInitializeMintInstruction(
      mintPubkey,
      decimals,
      wallet,
      wallet // freezeAuthority - можно ставить wallet или null
    )
  )

  const ata = await getAssociatedTokenAddress(
    mintPubkey,
    wallet,
    false,
    TOKEN_PROGRAM_ID,
    ASSOCIATED_TOKEN_PROGRAM_ID
  )

  tx.add(
    createAssociatedTokenAccountInstruction(
      wallet,
      ata,
      wallet,
      mintPubkey
    )
  )

  tx.feePayer = wallet
  tx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash

  tx.partialSign(mintKeypair)

  const signedTx = await provider.signTransaction(tx)
  const txid = await connection.sendRawTransaction(signedTx.serialize())
  await connection.confirmTransaction(txid, 'confirmed')

  // Минтим токены
  const mintIx = createMintToInstruction(
    mintPubkey,
    ata,
    wallet,
    BigInt(amount * Math.pow(10, decimals))
  )

  const mintTx = new Transaction().add(mintIx)
  mintTx.feePayer = wallet
  mintTx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash

  const signedMintTx = await provider.signTransaction(mintTx)
  const mintTxId = await connection.sendRawTransaction(signedMintTx.serialize())
  await connection.confirmTransaction(mintTxId, 'confirmed')

  // --- Добавляем создание метаданных ---

  const [metadataPDA] = await PublicKey.findProgramAddress(
    [
      Buffer.from('metadata'),
      TOKEN_METADATA_PROGRAM_ID.toBuffer(),
      mintPubkey.toBuffer(),
    ],
    TOKEN_METADATA_PROGRAM_ID
  )

  const metadata: DataV2 = {
    name: name.length > 32 ? name.slice(0, 32) : name,
    symbol: symbol.length > 10 ? symbol.slice(0, 10) : symbol,
    uri: '', // Можно добавить IPFS ссылку сюда, пока пусто
    sellerFeeBasisPoints: 0,
    creators: null,
    collection: null,
    uses: null,
  }

  const metadataIx = createCreateMetadataAccountV3Instruction(
    {
      metadata: metadataPDA,
      mint: mintPubkey,
      mintAuthority: wallet,
      payer: wallet,
      updateAuthority: wallet,
    },
    {
      createMetadataAccountArgsV3: {
        data: metadata,
        isMutable: true,
        collectionDetails: null,
      },
    }
  )

  const metaTx = new Transaction().add(metadataIx)
  metaTx.feePayer = wallet
  metaTx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash

  const signedMetaTx = await provider.signTransaction(metaTx)
  const metaTxId = await connection.sendRawTransaction(signedMetaTx.serialize())
  await connection.confirmTransaction(metaTxId, 'confirmed')

  console.log('Tokens minted! Tx ID:', mintTxId)
  console.log('Metadata created! Tx ID:', metaTxId)

  // Можно сделать запрос на сохранение токена в бд
  await fetch('/api/saveCreatedToken', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      walletAddress: wallet.toBase58(),
      mintAddress: mintPubkey.toBase58(),
      tokenName: name,
      symbol,
      amount,
      decimals,
    }),
  })

  return mintPubkey.toBase58()
}
