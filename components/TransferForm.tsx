"use client"
import { useRef, useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { PublicKey, SystemProgram, Transaction, LAMPORTS_PER_SOL } from "@solana/web3.js";

export default function TransferForm() {
  const receiverRef = useRef<HTMLInputElement>(null);
  const amountRef = useRef<HTMLInputElement>(null);
  const airdropAmountRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();

  const submit = async () => {
    // Reset states
    setError(null);
    setSuccess(null);
    setLoading(true);
    
    // Check if wallet is connected
    if (!publicKey) {
      setError("Please connect your wallet first");
      setLoading(false);
      return;
    }
    
    // Check if refs and values exist before proceeding
    if(!receiverRef.current?.value || !amountRef.current?.value){
      setError("Please provide both receiver address and amount");
      setLoading(false);
      return;
    }
    
    // Check wallet connection
    if (!connection) {
      setError("Connection to Solana network failed");
      setLoading(false);
      return;
    }
   
    try{
      // Parse recipient address
      let receiverId: PublicKey;
      try {
        receiverId = new PublicKey(receiverRef.current.value);
      } catch (e) {
        setError("Invalid receiver address format");
        setLoading(false);
        return;
      }
      
      // Parse amount to lamports
      const amount = parseFloat(amountRef.current.value);
      if (isNaN(amount) || amount <= 0) {
        setError("Please enter a valid amount greater than 0");
        setLoading(false);
        return;
      }
      const lamports = amount * LAMPORTS_PER_SOL;

      // Create and send transaction
      const transaction = new Transaction();
      
      const transferInstruction = SystemProgram.transfer({
        fromPubkey: publicKey,
        toPubkey: receiverId,
        lamports
      });

      transaction.add(transferInstruction);
      
      const signature = await sendTransaction(transaction, connection);
      console.log("Transaction sent with signature:", signature);
      
      // Wait for confirmation
      const confirmation = await connection.confirmTransaction(signature);
      
      setSuccess(`Transaction sent successfully! Signature: ${signature}`);
      
      // Reset form
      if (receiverRef.current) receiverRef.current.value = '';
      if (amountRef.current) amountRef.current.value = '';
    }
    catch (error) {
      console.error("Transaction failed:", error);
      setError(`Transaction failed: ${error instanceof Error ? error.message : String(error)}`);
    }
    finally {
      setLoading(false);
    }
  }
  
  const requestAirdrop = async () => {
    // Reset states
    setError(null);
    setSuccess(null);
    setLoading(true);
    
    // Check if wallet is connected
    if (!publicKey) {
      setError("Please connect your wallet first");
      setLoading(false);
      return;
    }
    
    // Check wallet connection
    if (!connection) {
      setError("Connection to Solana network failed");
      setLoading(false);
      return;
    }
    
    try {
      // Parse airdrop amount to lamports (default to 1 SOL if empty)
      const amount = airdropAmountRef.current?.value 
        ? parseFloat(airdropAmountRef.current.value) 
        : 1;
        
      if (isNaN(amount) || amount <= 0 || amount > 5) {
        setError("Please enter a valid amount between 0 and 5 SOL");
        setLoading(false);
        return;
      }
      
      const lamports = amount * LAMPORTS_PER_SOL;
      
      // Request airdrop
      const signature = await connection.requestAirdrop(publicKey, lamports);
      console.log("Airdrop requested with signature:", signature);
      
      // Wait for confirmation
      const confirmation = await connection.confirmTransaction(signature);
      
      setSuccess(`Airdrop of ${amount} SOL received! Signature: ${signature}`);
      
      // Reset airdrop input
      if (airdropAmountRef.current) airdropAmountRef.current.value = '';
    }
    catch (error) {
      console.error("Airdrop failed:", error);
      setError(`Airdrop failed: ${error instanceof Error ? error.message : String(error)}`);
    }
    finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-8 max-w-md mx-auto bg-gray-700 p-6 rounded-lg">
      <h1 className="text-2xl font-bold mb-4 text-white">Solana Wallet</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {success}
        </div>
      )}
      
      {/* Airdrop section */}
      <div className="mb-6 p-4 border border-gray-600 rounded-lg">
        <h2 className="text-xl font-bold mb-3 text-white">Request Airdrop</h2>
        <p className="text-gray-300 text-sm mb-3">
          Request SOL from the Solana devnet faucet for testing purposes
        </p>
        
        <div className="mb-4">
          <label className="block text-gray-300 mb-2">Amount (SOL, max 5)</label>
          <input 
            type="number" 
            ref={airdropAmountRef} 
            placeholder="Enter amount (default: 1)" 
            className="w-full p-2 border rounded"
            min="0.1"
            max="5"
            step="0.1"
          />
        </div>
        
        <button 
          onClick={requestAirdrop}
          disabled={!publicKey || loading}
          className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded w-full disabled:bg-gray-400"
        >
          {loading ? "Processing..." : publicKey ? "Request Airdrop" : "Connect Wallet"}
        </button>
      </div>
      
      {/* Transfer section */}
      <div className="p-4 border border-gray-600 rounded-lg">
        <h2 className="text-xl font-bold mb-3 text-white">Send SOL</h2>
        
        <div className="mb-4">
          <label className="block text-gray-300 mb-2">Receiver Address</label>
          <input 
            type="text" 
            ref={receiverRef} 
            placeholder="Enter receiver address" 
            className="w-full p-2 border rounded"
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-300 mb-2">Amount (SOL)</label>
          <input 
            type="number" 
            ref={amountRef} 
            placeholder="Enter amount" 
            className="w-full p-2 border rounded"
            min="0.000000001"
            step="0.1"
          />
        </div>
        
        <button 
          onClick={submit}
          disabled={!publicKey || loading}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full disabled:bg-gray-400"
        >
          {loading ? "Processing..." : publicKey ? "Send SOL" : "Connect Wallet"}
        </button>
      </div>
    </div>
  );
}