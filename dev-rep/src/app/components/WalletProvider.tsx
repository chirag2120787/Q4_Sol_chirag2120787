"use client";

import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { ConnectionProvider, WalletProvider as SolanaWalletProvider } from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { clusterApiUrl } from "@solana/web3.js";
import { useMemo } from "react";

require("@solana/wallet-adapter-react-ui/styles.css");

export function WalletProvider({ children }: { children: React.ReactNode }) {
  console.log('🔧 Initializing WalletProvider');
  const network = WalletAdapterNetwork.Devnet;
  
  const endpoint = useMemo(() => {
    const url = clusterApiUrl(network);
    console.log('🌐 Using RPC endpoint:', url);
    return url;
  }, [network]);

  const wallets = useMemo(() => {
    console.log('💳 Initializing wallet adapters');
    return [];
  }, [network]);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <SolanaWalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </SolanaWalletProvider>
    </ConnectionProvider>
  );
} 