use crate::errors::D3vrepError;
use crate::state::*;
use anchor_lang::prelude::*;

#[derive(Accounts)]
pub struct RegisterDeveloper<'info> {
    #[account(
        init,
        payer = user,
        space = 8 + 32 + 43 + 8 + 8 + 1,
        seeds = [b"developer", user.key().as_ref()],
        bump
    )]
    pub developer_profile: Account<'info, DeveloperProfile>,

    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

impl<'info> RegisterDeveloper<'info> {
    pub fn register_developer(&mut self, github_username: String) -> Result<()> {
        require!(
            github_username.len() <= 39 || github_username.is_empty(),
            D3vrepError::InvalidGithubUsername
        );
        
        self.developer_profile.set_inner(DeveloperProfile {
            wallet: self.user.key(),
            reputation_score: 0,
            metrics_hash: "".to_string(),
            github_username,
            registered_at: Clock::get()?.unix_timestamp,
            last_updated: Clock::get()?.unix_timestamp,
            is_active: true,
            bump: self.developer_profile.bump,
        });
        msg!("Developer profile created for {}", self.developer_profile.github_username);
        Ok(())
    }
}