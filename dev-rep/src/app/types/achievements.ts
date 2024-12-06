export type Achievement = {
  id: string;
  name: string;
  description: string;
  icon: string;
  dateEarned: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
};

export type RepositoryStats = {
  repoName: string;
  contributingSince: string;
  score: number;
  pullRequests: number;
  issuesResolved: number;
  codeReviews: number;
  achievements: Achievement[];
};

export type UserProfile = {
  walletAddress: string;
  overallScore: number;
  repositories: RepositoryStats[];
  recentActivity: {
    id: string;
    type: 'pr_merge' | 'code_review' | 'issue_resolved' | 'achievement_earned';
    description: string;
    timestamp: string;
    repoName: string;
  }[];
}; 