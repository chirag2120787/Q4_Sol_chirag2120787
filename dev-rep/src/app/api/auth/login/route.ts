import { NextRequest, NextResponse } from 'next/server';
import { PublicKey } from '@solana/web3.js';
import * as nacl from 'tweetnacl';

export async function POST(request: NextRequest) {
  console.log('📥 POST /api/auth/login started');
  try {
    const body = await request.json();
    const { signature, publicKey, message } = body;
    console.log('📦 Received login request:', { publicKey });

    if (!signature || !publicKey || !message) {
      console.log('❌ Missing required fields');
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const signatureUint8 = new Uint8Array(signature);
    const messageUint8 = new Uint8Array(message);
    
    console.log('🔐 Verifying signature');
    const publicKeyObj = new PublicKey(publicKey);
    const isValid = nacl.sign.detached.verify(
      messageUint8,
      signatureUint8,
      publicKeyObj.toBytes()
    );

    if (!isValid) {
      console.log('❌ Invalid signature');
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      );
    }

    console.log('✅ Signature verified');

    const session = {
      address: publicKey,
      timestamp: Date.now(),
      expiresAt: Date.now() + 24 * 60 * 60 * 1000,
    };

    const response = NextResponse.json({ 
      success: true,
      session 
    });
    
    console.log('🍪 Setting session cookie');
    response.cookies.set('session', JSON.stringify(session), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60,
      path: '/',
    });

    console.log('✅ Login successful');
    return response;
  } catch (error) {
    console.log('❌ Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 