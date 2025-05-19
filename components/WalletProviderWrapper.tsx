"use client"

import dynamic from "next/dynamic";

// Dynamically import the wallet provider component with no SSR
const ClientWalletProviderWithNoSSR = dynamic(
  () => import("./WalletContextProvider"),
  { ssr: false }
);

interface WalletProviderWrapperProps {
  children: React.ReactNode;
}

export default function WalletProviderWrapper({ children }: WalletProviderWrapperProps) {
  return <ClientWalletProviderWithNoSSR>{children}</ClientWalletProviderWithNoSSR>;
}