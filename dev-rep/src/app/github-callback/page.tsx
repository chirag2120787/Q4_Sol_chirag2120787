'use client';

import { Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { connectGitHub } from '../services/githubService';

function GitHubCallbackContent() {
  console.log('github callback page');
  const router = useRouter();
  const searchParams = useSearchParams();
  const code = searchParams.get('code');
  
  useEffect(() => {
    const handleCallback = async () => {
      console.log('github callback');
      
      if (code) {
        try {
          console.log('connecting github');
          await connectGitHub(code);
          console.log('redirecting to profile');
          setTimeout(() => {
            router.push('/achievements');
          }, 100);
        } catch (error) {
          console.error('Error connecting GitHub:', error);
          router.push('/profile?error=github_connection_failed');
        }
      } else {
        console.log('no code, redirecting to profile');
        router.push('/profile?error=no_code');
      }
    };

    handleCallback();
  }, [code, searchParams]);

  return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
        <p>Connecting your GitHub account...</p>
      </div>
    </div>
  );
};

export default function GitHubCallbackPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <GitHubCallbackContent />
    </Suspense>
  );
} 