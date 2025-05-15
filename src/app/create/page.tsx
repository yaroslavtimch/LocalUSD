'use client'

import TokenBuilder from '@/components/TokenBuider/TokenBuider'
import WalletConnection from '@/components/WalletConnection/WalletConnection'

export default function CreatePage() {
  return (
    <div className="space-y-8">
      <WalletConnection />
      <TokenBuilder />
    </div>
  )
}