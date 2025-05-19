// Root layout file that applies to all routes
// app/layout.tsx

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import WalletProviderWrapper from "../components/WalletProviderWrapper";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Solana Wallet App",
  description: "Transfer SOL and request airdrops",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <WalletProviderWrapper>
          <div className="container mx-auto px-4">
            {children}
          </div>
        </WalletProviderWrapper>
      </body>
    </html>
  );
}