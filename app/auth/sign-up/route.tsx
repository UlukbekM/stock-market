import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

import type { Database } from '@/types/supabase'

export async function POST(request: Request) {
    const requestUrl = new URL(request.url)
    const formData = await request.formData()
    const email = String(formData.get('email'))
    const password = String(formData.get('password'))
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient<Database>({ cookies: () => cookieStore })

    // console.log(email,password)

    const {error} = await supabase.auth.signUp({
        email,
        password,
        options: {
        emailRedirectTo: `${requestUrl.origin}/auth/callback`,
        },
    })

    if(error) {
        // console.log(error)
        return NextResponse.redirect(requestUrl.origin, {
            status: 301,
        })
    }

    const redirectUrl = `${requestUrl.origin}/register?checkEmail=true`;
    return NextResponse.redirect(redirectUrl, { status: 301 });
}