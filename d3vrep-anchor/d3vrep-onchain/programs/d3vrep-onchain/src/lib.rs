use anchor_lang::prelude::*;

declare_id!("G8rmypZDLDajBh5snJnDvEZHD24ELN85nFTvqSqnBAHy");
mod state;
mod instructions;
mod errors;

pub use instructions::*;


#[program]
pub mod d3vrep_onchain {
    use super::*;
    
    pub fn register_developer(ctx: Context<RegisterDeveloper>, github_username: String,) -> Result<()> {
        ctx.accounts.register_developer(github_username)
    }

    pub fn update_profile(ctx: Context<UpdateProfile>, new_github_username: Option<String>) -> Result<()> {
        ctx.accounts.update_github_username(new_github_username)
    }

    pub fn deactivate_profile(ctx: Context<DeactivateProfile>) -> Result<()> {
        ctx.accounts.deactivate_profile()
    }

}