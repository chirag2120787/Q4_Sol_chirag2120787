import { sign } from 'tweetnacl';
import bs58 from 'bs58';

export const createSignMessage = (address: string): string => {
  console.log('creating sign message');
  return `Sign this message to authenticate with D3vRep\n\nWallet: ${address}`;
};

export const verifySignature = (
  message: string,
  signature: string,
  publicKey: string
): boolean => {
  try {
    const encodedMessage = new TextEncoder().encode(message);
    const signatureUint8 = bs58.decode(signature);
    const publicKeyUint8 = bs58.decode(publicKey);

    return sign.detached.verify(
      encodedMessage,
      signatureUint8,
      publicKeyUint8
    );
  } catch (error) {
    console.error('Error verifying signature:', error);
    return false;
  }
}; 