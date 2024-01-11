import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'

import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
    const res = NextResponse.next()
    const supabase = createMiddlewareClient({ req, res })

    const {
        data: { user },
    } = await supabase.auth.getUser()

    // if user is signed in and the current path is / redirect the user to /dashboard
    if (user && req.nextUrl.pathname === '/') {
        return NextResponse.redirect(new URL('/dashboard', req.url))
    }

    // if user is signed in and the current path is /login or /register, redirect them to /dashboard
    if (user && (req.nextUrl.pathname === '/login' || req.nextUrl.pathname === '/register')) {
        return NextResponse.redirect(new URL('/dashboard', req.url))
    }

    // if user is not signed in and the current path is not /, /login, /register, or /settings, redirect the user to /
    if (!user && req.nextUrl.pathname !== '/' && req.nextUrl.pathname !== '/login' && req.nextUrl.pathname !== '/register' && req.nextUrl.pathname !== '/settings') {
        return NextResponse.redirect(new URL('/', req.url))
    }

    return res
}

export const config = {
    matcher: ['/', '/dashboard', '/login', '/register', '/settings'],
}
