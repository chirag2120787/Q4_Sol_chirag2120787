export type GitHubProfile = {
  username: string;
  avatarUrl: string;
  name: string;
  bio: string;
  followers: number;
  following: number;
  publicRepos: number;
  connectedAt: string;
};

export type UserSettings = {
  walletAddress: string;
  githubProfile?: GitHubProfile;
  emailNotifications: boolean;
  displayEmail: boolean;
}; 