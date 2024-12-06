use crate::errors::D3vrepError;
use crate::state::*;
use anchor_lang::prelude::*;

#[derive(Accounts)]
pub struct UpdateProfile<'info> {
    #[account(
        mut,
        seeds = [b"developer", user.key().as_ref()],
        bump,
        constraint = developer_profile.wallet == user.key()
    )]
    pub developer_profile: Account<'info, DeveloperProfile>,
 
    pub user: Signer<'info>,
} 

impl<'info> UpdateProfile<'info> {
    pub fn update_github_username(&mut self, new_github_username: Option<String>) -> Result<()> {

    if let Some(github_username) = new_github_username {
        require!(
            github_username.len() <= 39 || github_username.is_empty(),
            D3vrepError::InvalidGithubUsername
        );
        self.developer_profile.github_username = github_username;
    }

        self.developer_profile.last_updated = Clock::get()?.unix_timestamp;
        msg!("Developer profile updated for wallet: {}", self.developer_profile.wallet);
        Ok(())
    }

    pub fn update_reputation_score(&mut self, new_reputation_score: u64, metrics_hash: Option<String>) -> Result<()> {

        self.developer_profile.reputation_score = new_reputation_score;
        if let Some(metrics_hash) = metrics_hash {
            self.developer_profile.metrics_hash = metrics_hash;
        }
        self.developer_profile.last_updated = Clock::get()?.unix_timestamp;
        msg!("Developer profile updated for wallet: {}", self.developer_profile.wallet);
        Ok(())
    }
}