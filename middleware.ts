import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const authToken = request.cookies.get('auth-token')?.value;
  const isLoginPage = request.nextUrl.pathname === '/login';

  // console.log('isAuthenticated', authToken);
  // console.log('isLoginPage', isLoginPage);

  // If we're on the login page and have a token, redirect to home
  if (authToken && isLoginPage) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // If we're not on the login page and don't have a token, redirect to login
  if (!authToken && !isLoginPage) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
