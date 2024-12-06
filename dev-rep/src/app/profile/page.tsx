'use client';

import { FC, useEffect, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useRouter } from 'next/navigation';
import Header from '../components/Header';
import { UserSettings } from '../types/user';
// import { connectGitHub, disconnectGitHub } from '../services/githubService';
import { disconnectGitHub } from '../services/githubService';
import Image from 'next/image';
import { useWalletAuth } from '../hooks/useWalletAuth';

const GITHUB_CLIENT_ID = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID;
console.log('GITHUB_CLIENT_ID:', GITHUB_CLIENT_ID);
const GITHUB_REDIRECT_URI = process.env.NEXT_PUBLIC_GITHUB_REDIRECT_URI;
console.log('GITHUB_REDIRECT_URI:', GITHUB_REDIRECT_URI);
const ProfilePage: FC = () => {
  console.log('ProfilePage');
  const { connected, publicKey } = useWallet();
  console.log('connected:', connected);
  console.log('publicKey:', publicKey);
  const router = useRouter();
  const { isAuthenticated } = useWalletAuth();
  console.log('isAuthenticated:', isAuthenticated);
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState<UserSettings | null>(null);

  useEffect(() => {
    console.log('isAuthenticated:', isAuthenticated);
    if (isAuthenticated === false) {
      console.log('not authenticated, redirecting to /');
      router.push('/');
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    const loadProfile = async () => {
      console.log('loading profile');
      if (publicKey && isAuthenticated) {
        // Mock initial settings
        console.log('setting profile');
        setSettings({
          walletAddress: publicKey.toString(),
          emailNotifications: true,
          displayEmail: false,
        });
        console.log('profile loaded');
        setLoading(false);
      }
    };
    console.log('loading profile');
    loadProfile();
  }, [publicKey, isAuthenticated]);

  if (isAuthenticated === null || loading) {
    console.log('loading profile');
    return (
      <>
        <Header />
        <main className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white pt-16">
          <div className="container mx-auto px-4 py-16 flex justify-center items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
          </div>
        </main>
      </>
    );
  }

  const handleGitHubConnect = () => {    
    console.log('connecting github');
    const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID}&redirect_uri=${process.env.NEXT_PUBLIC_GITHUB_CALLBACK_URL}&scope=user:email`;
    window.location.href = githubAuthUrl;
  };

  const handleGitHubDisconnect = async () => {
    if (!settings) return;
    console.log('disconnecting github');
    try {
      setLoading(true);
      await disconnectGitHub(settings.walletAddress);
      setSettings(prev => prev ? { ...prev, githubProfile: undefined } : null);
    } catch (error) {
      console.error('Error disconnecting GitHub:', error);
    } finally {
      setLoading(false);
    }
  };
  console.log('rendering profile');
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white pt-16">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            {/* Profile Header */}
            <section className="bg-gray-800 rounded-lg p-8 mb-8">
              <h1 className="text-3xl font-bold mb-6">Profile Settings</h1>
              <div className="flex flex-col md:flex-row gap-8">
                <div className="flex-1">
                  <h2 className="text-xl font-semibold mb-4">Wallet Connection</h2>
                  <p className="text-gray-300 break-all">{settings?.walletAddress}</p>
                </div>
              </div>
            </section>

            {/* GitHub Integration */}
            <section className="bg-gray-800 rounded-lg p-8 mb-8">
              <h2 className="text-xl font-semibold mb-6">GitHub Integration</h2>
              {settings?.githubProfile ? (
                <div className="flex items-start gap-6">
                  <Image
                    src={settings.githubProfile.avatarUrl}
                    alt="GitHub Avatar"
                    width={80}
                    height={80}
                    className="rounded-full"
                  />
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-semibold">{settings.githubProfile.name}</h3>
                        <p className="text-gray-400">@{settings.githubProfile.username}</p>
                      </div>
                      <button
                        onClick={handleGitHubDisconnect}
                        className="text-red-400 hover:text-red-300 text-sm"
                      >
                        Disconnect
                      </button>
                    </div>
                    <p className="text-gray-300 mt-2">{settings.githubProfile.bio}</p>
                    <div className="flex gap-6 mt-4 text-sm text-gray-400">
                      <span>{settings.githubProfile.publicRepos} repositories</span>
                      <span>{settings.githubProfile.followers} followers</span>
                      <span>{settings.githubProfile.following} following</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-300 mb-4">
                    Connect your GitHub account to start tracking your contributions
                  </p>
                  <button
                    onClick={handleGitHubConnect}
                    className="bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 px-6 rounded-lg flex items-center gap-2 mx-auto"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                    </svg>
                    Connect GitHub Account
                  </button>
                </div>
              )}
            </section>

            {/* Notification Settings */}
            <section className="bg-gray-800 rounded-lg p-8">
              <h2 className="text-xl font-semibold mb-6">Notification Settings</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Email Notifications</h3>
                    <p className="text-sm text-gray-400">Receive updates about your achievements</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings?.emailNotifications}
                      onChange={() => setSettings(prev => 
                        prev ? { ...prev, emailNotifications: !prev.emailNotifications } : null
                      )}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Display Email</h3>
                    <p className="text-sm text-gray-400">Show email on public profile</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings?.displayEmail}
                      onChange={() => setSettings(prev => 
                        prev ? { ...prev, displayEmail: !prev.displayEmail } : null
                      )}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
    </>
  );
};

export default ProfilePage; 