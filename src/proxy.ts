// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { adminAuth } from '@/lib/firebaseAdmin';

export async function proxy(request: NextRequest) {
    const session = request.cookies.get('session')?.value;

    // Allow public paths
    const publicPaths = ['/login', '/api/auth'];
    const isPublicPath = publicPaths.some(path =>
        request.nextUrl.pathname.startsWith(path)
    );

    if (isPublicPath) {
        return NextResponse.next();
    }

    // No session → redirect to login
    if (!session) {
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('redirect', request.nextUrl.pathname);
        return NextResponse.redirect(loginUrl);
    }

    try {
        // Verify session cookie (NOT verifyIdToken!)
        await adminAuth.verifySessionCookie(session);
        return NextResponse.next();
    } catch (error) {
        console.error('Invalid session cookie:', error);
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('redirect', request.nextUrl.pathname);
        return NextResponse.redirect(loginUrl);
    }
}

export const config = {
    matcher: [
        /*
         * Match all request paths except:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico
         * - public folder
         * - login page
         * - api/auth (your auth endpoints)
         */
        '/((?!_next/static|_next/image|favicon.ico|public|login|api/auth).*)',
    ],
};