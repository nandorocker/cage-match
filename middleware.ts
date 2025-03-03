import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Allow the root path
  if (path === '/') {
    return NextResponse.next();
  }

  // Validate tier paths (tier-1 through tier-6)
  if (path.startsWith('/tier-')) {
    const tier = parseInt(path.replace('/tier-', ''), 10);
    if (!isNaN(tier) && tier >= 1 && tier <= 6) {
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Allow watchlist and settings paths
  if (path === '/watchlist' || path === '/settings') {
    return NextResponse.next();
  }

  // Allow static assets and API routes
  if (path.startsWith('/_next') || 
      path.startsWith('/api') || 
      path.startsWith('/favicon') || 
      path.startsWith('/public')) {
    return NextResponse.next();
  }

  // Redirect invalid paths to home
  return NextResponse.redirect(new URL('/', request.url));
}

// Update matcher to be more specific about what we want to handle
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
} 