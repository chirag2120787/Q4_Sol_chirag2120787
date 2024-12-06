import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  console.log('📥 GET /api/auth/check started');
  try {
    const sessionCookie = request.cookies.get('session');
    
    if (!sessionCookie) {
      console.log('❌ No session cookie found');
      return NextResponse.json({ 
        isAuthenticated: false,
        publicKey: null 
      });
    }

    const session = JSON.parse(sessionCookie.value);
    console.log('🔍 Found session for:', session.address);
    
    if (session.expiresAt < Date.now()) {
      console.log('⏰ Session expired');
      return NextResponse.json({ 
        isAuthenticated: false,
        publicKey: null 
      });
    }

    console.log('✅ Valid session found');
    return NextResponse.json({
      isAuthenticated: true,
      publicKey: session.address
    });
  } catch (error) {
    console.log('❌ Auth check error:', error);
    return NextResponse.json({ 
      isAuthenticated: false,
      publicKey: null 
    });
  }
} 