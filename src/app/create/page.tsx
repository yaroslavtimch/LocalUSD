'use client'

import TokenBuilder from '@/components/TokenBuider/TokenBuider'
import WalletConnection from '@/components/WalletConnection/WalletConnection'

export default function CreatePage() {
  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-semibold">Create Your Local Stablecoin</h2>
      <WalletConnection />
      <TokenBuilder />
    </div>
  )
}