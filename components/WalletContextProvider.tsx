"use client"
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react'
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui'
import { clusterApiUrl } from '@solana/web3.js'
import React, { ReactNode, useMemo } from 'react'
import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets';
// Don't forget to import the styles
import '@solana/wallet-adapter-react-ui/styles.css';

interface WalletContextProviderProps {
  children: ReactNode;
}

const WalletContextProvider = ({ children }: WalletContextProviderProps) => {
    const endpoint = clusterApiUrl("devnet");
    const wallets = useMemo(() => [new PhantomWalletAdapter()], []);
    
    return (
      <ConnectionProvider endpoint={endpoint}> 
          <WalletProvider wallets={wallets} autoConnect>
              <WalletModalProvider>{children}</WalletModalProvider>
          </WalletProvider>
      </ConnectionProvider>
    )
}

export default WalletContextProvider