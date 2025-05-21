import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error("Missing Supabase env variables");
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { 
      walletAddress, 
      mintAddress, 
      tokenName,
      symbol,
      amount,
      decimals
    } = body;

    if (!walletAddress || !mintAddress) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const { error } = await supabase.from('created_tokens').insert({
      wallet_address: walletAddress,
      mint_address: mintAddress,
      token_name: tokenName,
      symbol,
      amount,
      decimals,
      created_at: new Date(),
    });

    if (error) {
      console.error("Supabase Insert Error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (e: any) {
    console.error("Unexpected error:", e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}