"use client";

import { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useRouter } from 'next/navigation';

export function useWalletAuth() {
  console.log('🔧 Initializing useWalletAuth hook');
  const { publicKey, signMessage, disconnect } = useWallet();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const router = useRouter();

  useEffect(() => {
    console.log('🔄 useWalletAuth useEffect triggered', { publicKey: publicKey?.toBase58() });
    checkAuth();
  }, [publicKey]);

  const checkAuth = async () => {
    console.log('🔍 checkAuth started');
    try {
      const response = await fetch('/api/auth/check', {
        credentials: 'include'
      });
      const data = await response.json();
      console.log('✅ checkAuth response:', data);
      
      setIsAuthenticated(data.isAuthenticated);
    } catch (error) {
      console.log('❌ checkAuth error:', error);
      setIsAuthenticated(false);
    }
  };

  const login = async () => {
    console.log('🔑 login started');
    try {
      if (!publicKey || !signMessage) {
        throw new Error('Wallet not connected');
      }

      const message = new TextEncoder().encode(
        `Sign this message to authenticate with our app at timestamp: ${Date.now()}`
      );
      console.log('📝 Created message to sign');

      const signature = await signMessage(message);
      console.log('✍️ Message signed by wallet');

      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          publicKey: publicKey.toBase58(),
          signature: Array.from(signature),
          message: Array.from(message)
        }),
      });

      const data = await response.json();
      console.log('📨 Login response:', data);
      
      if (data.success) {
        setIsAuthenticated(true);
        router.refresh();
        console.log('✅ Login successful');
        return true;
      }
      return false;
    } catch (error) {
      console.log('❌ Login error:', error);
      setIsAuthenticated(false);
      return false;
    }
  };

  const logout = async () => {
    console.log('🚪 logout started');
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      });
      setIsAuthenticated(false);
      disconnect();
      router.refresh();
      console.log('✅ Logout successful');
    } catch (error) {
      console.log('❌ Logout error:', error);
    }
  };

  return {
    isAuthenticated,
    publicKey: publicKey?.toBase58() || null,
    login,
    logout,
    checkAuth
  };
} 