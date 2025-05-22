// middleware.js (at project root)
import { NextResponse } from 'next/server';

export function middleware(request) {
  const url = request.nextUrl.clone();
  const user = request.cookies.get('user')?.value;

  if (!user) {
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  const userData = JSON.parse(user);
  const role = userData?.roleName?.[0];

  if (url.pathname.startsWith('/admin') && role !== 'admin') {
    url.pathname = '/unauthorized';
    return NextResponse.redirect(url);
  }

  if (url.pathname.startsWith('/user') && role !== 'volunteer') {
    url.pathname = '/unauthorized';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/user/:path*'],
};
