"use client"

import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

export default function Appbar() {
  return (
    <div className="flex justify-between items-center py-4">
      <div className="text-xl font-bold">SOL Money Transfer</div>
      <WalletMultiButton />
    </div>
  )
}