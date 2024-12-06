import { UserProfile, Achievement } from '../types/achievements';

const ACHIEVEMENT_BADGES: { [key: string]: Achievement } = {
  FIRST_PR: {
    id: 'first_pr',
    name: 'First Pull Request',
    description: 'Successfully merged your first pull request',
    icon: '🎯',
    dateEarned: '2024-01-15',
    rarity: 'common'
  },
  CODE_MASTER: {
    id: 'code_master',
    name: 'Code Master',
    description: 'Completed 50 successful code reviews',
    icon: '👨‍💻',
    dateEarned: '2024-02-01',
    rarity: 'rare'
  },
  BUG_HUNTER: {
    id: 'bug_hunter',
    name: 'Bug Hunter',
    description: 'Resolved 25 critical issues',
    icon: '🐛',
    dateEarned: '2024-02-15',
    rarity: 'epic'
  },
  COMMUNITY_PILLAR: {
    id: 'community_pillar',
    name: 'Community Pillar',
    description: 'Contributed to 10 different repositories',
    icon: '🏛️',
    dateEarned: '2024-03-01',
    rarity: 'legendary'
  },
};

export const fetchUserProfile = async (walletAddress: string): Promise<UserProfile> => {
  console.log('fetching user profile');
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  console.log('user profile fetched');
  // Mock data
  return {
    walletAddress,
    overallScore: 850,
    repositories: [
      {
        repoName: 'solana-labs/solana',
        contributingSince: '2024-01',
        score: 92,
        pullRequests: 15,
        issuesResolved: 23,
        codeReviews: 45,
        achievements: [ACHIEVEMENT_BADGES.FIRST_PR, ACHIEVEMENT_BADGES.CODE_MASTER],
      },
      {
        repoName: 'metaplex-foundation/metaplex',
        contributingSince: '2024-02',
        score: 78,
        pullRequests: 8,
        issuesResolved: 12,
        codeReviews: 25,
        achievements: [ACHIEVEMENT_BADGES.BUG_HUNTER],
      },
    ],
    recentActivity: [
      {
        id: '1',
        type: 'pr_merge',
        description: 'Merged PR: "Fix transaction processing"',
        timestamp: '2024-03-10T10:00:00Z',
        repoName: 'solana-labs/solana',
      },
      {
        id: '2',
        type: 'achievement_earned',
        description: 'Earned "Bug Hunter" achievement',
        timestamp: '2024-03-09T15:30:00Z',
        repoName: 'metaplex-foundation/metaplex',
      },
    ],
  };
}; 