import { NextRequest, NextResponse } from 'next/server';
import { githubConfig } from '@/app/lib/auth/github';

export async function GET(request: NextRequest) {
  console.log('github callback');
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  console.log('code:', code);
  if (!code) {
    return NextResponse.redirect('/auth/error');
  }
  console.log('code found');
  try {
    console.log('exchanging code for access token');
    // Exchange code for access token
    const tokenResponse = await fetch(
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
          code,
          redirect_uri: githubConfig.callbackUrl,
        }),
      }
    );

    const tokenData = await tokenResponse.json();
    console.log('token data:', tokenData);
    if (tokenData.error) {
      console.error('Token Error:', tokenData.error);
      return NextResponse.redirect('/auth/error');
    }

    const { access_token, refresh_token } = tokenData;
    console.log('access token:', access_token);
    console.log('refresh token:', refresh_token);

    // Get user data
    const userResponse = await fetch('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });
    console.log('user response:', userResponse);
    const userData = await userResponse.json();
    console.log('user data:', userData);

    // Store user data and tokens in your database
    // Using an example database service
    // await saveUserToDatabase({
    //   githubId: userData.id,
    //   name: userData.name,
    //   email: userData.email,
    //   avatar: userData.avatar_url,
    //   accessToken: access_token,
    //   refreshToken: refresh_token,
    // });

    // Set secure HTTP-only cookie with session token
    const response = NextResponse.redirect(new URL('/profile', request.url));
    // response.cookies.set({
    //   name: 'session_token',
    //   value: generateSessionToken(userData.id), // Implement this function
    //   httpOnly: true,
    //   secure: process.env.NODE_ENV === 'production',
    //   sameSite: 'lax',
    //   maxAge: 60 * 60 * 24 * 7, // 1 week
    // });
    console.log('redirecting to profile');
    return response;
  } catch (error) {
    console.error('GitHub OAuth Error:', error);
    return NextResponse.redirect('/auth/error');
  }
}