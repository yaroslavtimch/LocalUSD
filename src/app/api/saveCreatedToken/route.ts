import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // для записи
);

export async function POST(req: NextRequest) {
  const { walletAddress, mintAddress } = await req.json();

  const { error } = await supabase.from('created_tokens').insert({
    wallet_address: walletAddress,
    mint_address: mintAddress
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}