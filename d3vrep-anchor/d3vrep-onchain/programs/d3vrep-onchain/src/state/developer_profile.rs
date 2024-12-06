use anchor_lang::prelude::*;


#[account]
#[derive(InitSpace)]
pub struct DeveloperProfile {
    pub wallet: Pubkey,           // 32 bytes
    #[max_len(39)]
    pub github_username: String, 
    #[max_len(64)]
    pub metrics_hash: String,
    pub reputation_score: u64,  // 4 + 39 bytes max
    pub registered_at: i64,       // 8 bytes
    pub last_updated: i64,        // 8 bytes
    pub is_active: bool,  
    pub bump: u8,        // 1 byte
}