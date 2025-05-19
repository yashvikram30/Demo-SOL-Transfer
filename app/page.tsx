"use client"
import WalletContextProvider from "@/components/WalletContextProvider";
import TransferForm from "@/components/TransferForm";
import Appbar from "@/components/Appbar";

export default function Home() {
  return (
    <WalletContextProvider>
      <div className="container mx-auto p-4">
        <Appbar />
        <TransferForm />
      </div>
    </WalletContextProvider>
  );
}