import { GitHubProfile } from '../types/user';

export const connectGitHub = async (code: string): Promise<GitHubProfile> => {
  try {
    console.log('code:', code);
    console.log('connecting github');
    
    // Mock implementation with consistent data
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('github connected');
    
    const profile: GitHubProfile = {
      username: 'example-dev',
      avatarUrl: 'https://avatars.githubusercontent.com/u/1234567',
      name: 'Example Developer',
      bio: 'Full-stack developer passionate about Web3',
      followers: 150,
      following: 100,
      publicRepos: 25,
      // Use a fixed timestamp for SSR consistency
      connectedAt: '2024-03-21T00:00:00.000Z',
    };
    
    return profile;
  } catch (error) {
    console.error('GitHub connection error:', error);
    throw error;
  }
};

export const disconnectGitHub = async (walletAddress: string): Promise<void> => {
  console.log('walletAddress:', walletAddress);
  console.log('disconnecting github');
  // In a real implementation, this would remove the GitHub connection from your backend
  await new Promise(resolve => setTimeout(resolve, 500));
  console.log('github disconnected');
}; 
