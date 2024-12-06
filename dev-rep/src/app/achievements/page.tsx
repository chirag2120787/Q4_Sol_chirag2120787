'use client';

import { FC, useEffect, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useRouter } from 'next/navigation';
import Header from '../components/Header';
import { UserProfile } from '../types/achievements';
import { fetchUserProfile } from '../services/achievementsService';

const AchievementsPage: FC = () => {
  const { connected, publicKey } = useWallet();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    console.log('connected:', connected);
    if (!connected) {
      console.log('not connected, redirecting to /');
      router.push('/');
    }
  }, [connected, router]);

  useEffect(() => {
    const loadProfile = async () => {
      console.log('publicKey:', publicKey);
      if (publicKey) {
        try {
          console.log('fetching user profile');
          const data = await fetchUserProfile(publicKey.toString());
          setProfile(data);
        } catch (error) {
          console.error('Error loading profile:', error);
        } finally {
          setLoading(false);
        }
      }
    };
    console.log('loading profile');
    loadProfile();
  }, [publicKey]);

  if (loading) {
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

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white pt-16">
        <div className="container mx-auto px-4 py-16">
          {/* User Profile Section */}
          <section className="mb-12">
            <div className="bg-gray-800 rounded-lg p-8">
              <h1 className="text-3xl font-bold mb-4">Your Developer Profile</h1>
              <div className="text-gray-300">
                <p className="mb-2">Wallet: {profile?.walletAddress}</p>
                <p className="mb-4">Overall Reputation Score: {profile?.overallScore}</p>
                
                {/* Achievement Badges */}
                <div className="mt-6">
                  <h3 className="text-xl font-semibold mb-4">Achievement Badges</h3>
                  <div className="flex flex-wrap gap-4">
                    {profile?.repositories.flatMap(repo => repo.achievements).map(achievement => (
                      <div 
                        key={achievement.id}
                        className={`p-4 rounded-lg border ${
                          achievement.rarity === 'legendary' ? 'border-yellow-400 bg-yellow-900/20' :
                          achievement.rarity === 'epic' ? 'border-purple-400 bg-purple-900/20' :
                          achievement.rarity === 'rare' ? 'border-blue-400 bg-blue-900/20' :
                          'border-gray-400 bg-gray-900/20'
                        }`}
                      >
                        <div className="text-2xl mb-2">{achievement.icon}</div>
                        <h4 className="font-semibold">{achievement.name}</h4>
                        <p className="text-sm text-gray-400">{achievement.description}</p>
                        <p className="text-xs text-gray-500 mt-2">Earned: {new Date(achievement.dateEarned).toLocaleDateString()}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Repository Achievements */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Repository Achievements</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {profile?.repositories.map(repo => (
                <div key={repo.repoName} className="bg-gray-800 rounded-lg p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-semibold">{repo.repoName}</h3>
                      <p className="text-gray-400">Contributing since {repo.contributingSince}</p>
                    </div>
                    <span className="bg-blue-600 text-sm px-3 py-1 rounded-full">
                      Score: {repo.score}
                    </span>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Pull Requests</span>
                      <span>{repo.pullRequests}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Issues Resolved</span>
                      <span>{repo.issuesResolved}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Code Reviews</span>
                      <span>{repo.codeReviews}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Recent Activity */}
          <section>
            <h2 className="text-2xl font-bold mb-6">Recent Activity</h2>
            <div className="bg-gray-800 rounded-lg p-6">
              <div className="space-y-4">
                {profile?.recentActivity.map(activity => (
                  <div key={activity.id} className="flex items-center gap-4">
                    <div className={`w-2 h-2 rounded-full ${
                      activity.type === 'pr_merge' ? 'bg-green-500' :
                      activity.type === 'achievement_earned' ? 'bg-yellow-500' :
                      activity.type === 'code_review' ? 'bg-blue-500' :
                      'bg-purple-500'
                    }`}></div>
                    <p>{activity.description}</p>
                    <span className="text-gray-400 text-sm">
                      {new Date(activity.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </main>
    </>
  );
};

export default AchievementsPage; 