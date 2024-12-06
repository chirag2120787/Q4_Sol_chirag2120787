'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useWalletAuth } from '../hooks/useWalletAuth';
import Link from 'next/link';
import { useState } from 'react';

export default function Header() {
  const { connected } = useWallet();
  const { login, logout, isAuthenticated } = useWalletAuth();
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAuth = async () => {
    try {
      console.log('handleAuth');
      setError(null);
      setIsAuthenticating(true);
      
      if (connected && !isAuthenticated) {
        console.log('logging in');
        const success = await login();
        if (!success) {
          console.log('failed to authenticate');
          setError('Failed to authenticate. Please try again.');
        }
      } else if (isAuthenticated) {
        await logout();
      }
    } catch (err) {
      console.error('Auth error:', err);
      setError('An error occurred. Please try again.');
    } finally {
      setIsAuthenticating(false);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gray-900 border-b border-gray-800">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-white text-xl font-bold">
            D3vRep
          </Link>
          
          <nav className="flex items-center gap-6">
            {/* Always visible navigation items */}
            <Link 
              href="/#features" 
              className="text-gray-300 hover:text-white transition-colors"
            >
              Features
            </Link>
            <Link 
              href="/#statistics" 
              className="text-gray-300 hover:text-white transition-colors"
            >
              Statistics
            </Link>
            
            {/* Auth-dependent navigation items */}
            {isAuthenticated && (
              <>
                <Link 
                  href="/profile" 
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Profile
                </Link>
                <Link 
                  href="/achievements" 
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Achievements
                </Link>
              </>
            )}
            
            <div className="flex items-center gap-4">
              {error && (
                <span className="text-red-500 text-sm">{error}</span>
              )}
              
              {!connected ? (
                <WalletMultiButton />
              ) : (
                <button
                  onClick={handleAuth}
                  disabled={isAuthenticating}
                  className={`bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors ${
                    isAuthenticating ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {isAuthenticating 
                    ? 'Processing...' 
                    : isAuthenticated 
                      ? 'Disconnect' 
                      : 'Connect'
                  }
                </button>
              )}
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
} 