import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(request: NextRequest) {
    const token = await getToken({ req: request })
    const isAuth = !!token
    const isAuthPage = request.nextUrl.pathname.startsWith('/login') ||
        request.nextUrl.pathname.startsWith('/register')

    if (isAuthPage) {
        if (isAuth) {
            return NextResponse.redirect(new URL('/dashboard', request.url))
        }
        return null
    }

    if (!isAuth && request.nextUrl.pathname.startsWith('/dashboard')) {
        let from = request.nextUrl.pathname
        if (request.nextUrl.search) {
            from += request.nextUrl.search
        }

        return NextResponse.redirect(
            new URL(`/login?from=${encodeURIComponent(from)}`, request.url)
        )
    }

    // Role-based access control
    if (isAuth && request.nextUrl.pathname.startsWith('/dashboard')) {
        const userRole = token.role as string

        // Editor-only routes
        if (request.nextUrl.pathname.startsWith('/dashboard/editor') && userRole !== 'EDITOR') {
            return NextResponse.redirect(new URL('/dashboard', request.url))
        }

        // Reviewer-only routes
        if (request.nextUrl.pathname.startsWith('/dashboard/reviewer') && userRole !== 'REVIEWER') {
            return NextResponse.redirect(new URL('/dashboard', request.url))
        }

        // Author-only routes
        if (request.nextUrl.pathname.startsWith('/dashboard/author') && userRole !== 'AUTHOR') {
            return NextResponse.redirect(new URL('/dashboard', request.url))
        }
    }

    return null
}

export const config = {
    matcher: ['/dashboard/:path*', '/login', '/register'],
}
