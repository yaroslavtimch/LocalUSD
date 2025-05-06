'use client'

import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import '@solana/wallet-adapter-react-ui/styles.css'

export default function WalletConnection({ children }: { children?: React.ReactNode }) {


  return (
    <div className="flex items-center gap-4">
        <WalletMultiButton />
        {children}
    </div>
  )
}