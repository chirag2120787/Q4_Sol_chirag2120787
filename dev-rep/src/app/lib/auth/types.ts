export interface AuthSession {
  address: string;
  signature: string;
  timestamp: number;
  expiresAt: number;
}

export interface SignatureMessage {
  address: string;
  timestamp: number;
} 