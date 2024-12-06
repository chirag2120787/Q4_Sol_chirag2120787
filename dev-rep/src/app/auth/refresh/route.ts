import { NextRequest, NextResponse } from 'next/server';
import { githubConfig } from '@/app/lib/auth/github';

export async function POST(request: NextRequest) {
  try {
    console.log('refreshing token');
    const { refresh_token } = await request.json();
    console.log('refresh token:', refresh_token);
    const response = await fetch(
      'https://github.com/login/oauth/access_token',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          client_id: githubConfig.clientId,
          client_secret: githubConfig.clientSecret,
          grant_type: 'refresh_token',
          refresh_token,
        }),
      }
    );

    const data = await response.json();
    console.log('token data:', data);
    if (data.error) {
      console.log('error:', data.error);
      return NextResponse.json({ error: data.error }, { status: 401 });
    }

    // Update tokens in database
    // await updateUserTokens({
    //   refreshToken: refresh_token,
    //   newAccessToken: data.access_token,
    //   newRefreshToken: data.refresh_token,
    // });

    console.log('returning token data');
    return NextResponse.json({
      access_token: data.access_token,
      refresh_token: data.refresh_token,
    });
  } catch (error) {
    console.error('Token refresh error:', error);
    return NextResponse.json(
      { error: 'Failed to refresh token' },
      { status: 500 }
    );
  }
}