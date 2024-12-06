use anchor_lang::error_code;

#[error_code]
pub enum ErrorCode {
    #[msg("Arithmetic overflow")]
    Overflow,
    #[msg("Insufficient score for achievement")]
    InsufficientScore,
}

#[error_code]
pub enum D3vrepError {
    #[msg("Invalid Github username. Username must not be empty and must be 39 characters or less")]
    InvalidGithubUsername
}