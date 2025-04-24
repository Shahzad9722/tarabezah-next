import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const authToken = request.cookies.get('auth-token')?.value;
  const pathname = request.nextUrl.pathname;

  const isLoginPage = pathname === '/login';

  // Publicly accessible paths
  const publicPaths = ['/reservation', '/walk-in'];

  const isPublicPath = publicPaths.includes(pathname);

  // If on login page and already authenticated, redirect to home
  if (authToken && isLoginPage) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // If unauthenticated and not on a public or login page, redirect to login
  if (!authToken && !isLoginPage && !isPublicPath) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
