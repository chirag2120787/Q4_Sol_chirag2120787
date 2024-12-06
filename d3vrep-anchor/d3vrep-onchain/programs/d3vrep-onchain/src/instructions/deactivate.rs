use crate::state::*;
use anchor_lang::prelude::*;

#[derive(Accounts)]
pub struct DeactivateProfile<'info> {
    #[account(
        mut,
        seeds = [b"developer", user.key().as_ref()],
        bump,
        constraint = developer_profile.wallet == user.key(),
        close = user
    )]
    pub developer_profile: Account<'info, DeveloperProfile>,

    #[account(mut)] 
    pub user: Signer<'info>,
}

impl<'info> DeactivateProfile<'info> {
    pub fn deactivate_profile(&mut self) -> Result<()> {
        let developer = &mut self.developer_profile;
        developer.is_active = false;
        developer.last_updated = Clock::get()?.unix_timestamp;
        
        msg!("Developer profile deactivated for wallet: {}", developer.wallet);
        Ok(())
    }
}