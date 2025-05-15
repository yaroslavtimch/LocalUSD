import {
    Connection,
    clusterApiUrl,
    Keypair,
    SystemProgram,
    Transaction,
  } from '@solana/web3.js';
  import {
    TOKEN_PROGRAM_ID,
    ASSOCIATED_TOKEN_PROGRAM_ID,
    MintLayout,
    createInitializeMintInstruction,
    createAssociatedTokenAccountInstruction,
    getAssociatedTokenAddress,
    createMintToInstruction,
  } from '@solana/spl-token';
  
  export default async function createToken(decimals: number, amount: number): Promise<string> {
    const provider = (window as any).solana;
    if (!provider?.isPhantom) {
      throw new Error('Phantom wallet not found');
    }
  
    await provider.connect();
    const wallet = provider.publicKey;
    const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');
  
    const mintKeypair = Keypair.generate();
    const mintPubkey = mintKeypair.publicKey;
  
    const lamports = await connection.getMinimumBalanceForRentExemption(MintLayout.span);
  
    const tx = new Transaction();
  
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
        null         
      )
    );
  
    const ata = await getAssociatedTokenAddress(
      mintPubkey,
      wallet,
      false,
      TOKEN_PROGRAM_ID,
      ASSOCIATED_TOKEN_PROGRAM_ID
    );
  
    tx.add(
      createAssociatedTokenAccountInstruction(
        wallet,        
        ata,           
        wallet,       
        mintPubkey  
      )
    );
  
    tx.feePayer = wallet;
    tx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
    tx.partialSign(mintKeypair);
  
    const signedTx = await provider.signTransaction(tx);
    const txid = await connection.sendRawTransaction(signedTx.serialize());
    await connection.confirmTransaction(txid, 'confirmed');
  
    const mintIx = createMintToInstruction(
        mintPubkey,
        ata,
        wallet, 
        amount * Math.pow(10, decimals)
      );
  
      const mintTx = new Transaction().add(mintIx);
      mintTx.feePayer = wallet;
      mintTx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
      
      const signedMintTx = await provider.signTransaction(mintTx);
      const mintTxId = await connection.sendRawTransaction(signedMintTx.serialize());
      await connection.confirmTransaction(mintTxId, 'confirmed');
      
      console.log('Tokens minted! Tx ID:', mintTxId);
      
    return mintPubkey.toBase58();
  }