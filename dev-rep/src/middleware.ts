import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  console.log('middleware');
  const session = request.cookies.get('session');
  console.log('session:', session);
  if (request.nextUrl.pathname.startsWith('/profile')) {
    if (!session) {
      console.log('no session, redirecting to /');
      return NextResponse.redirect(new URL('/', request.url));
    }

    try {
      console.log('parsing session');
      const sessionData = JSON.parse(session.value);
      console.log('session data:', sessionData);

      if (sessionData.expiresAt < Date.now()) {
        console.log('session expired, redirecting to /');
        const response = NextResponse.redirect(new URL('/', request.url));
        response.cookies.delete('session');
        return response;
      }
    } catch (error) {
      console.log('error parsing session, redirecting to /', error);
      return NextResponse.redirect(new URL('/', request.url));
    }
  }
  console.log('next response');
  return NextResponse.next();
}

export const config = {
  matcher: '/profile/:path*',
}; 