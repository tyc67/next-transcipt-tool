import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'

import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  // res.headers.set('Access-Control-Allow-Origin', '*')

  const supabase = createMiddlewareClient({ req, res })
  await supabase.auth.getSession()
  // if session has expired, then it will get refreshed.
  // and middlewareClient has ability to set cookies on response
  // latest session is available in server component, serverComponentClient contain new refreshd session

  return res
}

// by default supabase auth uses local storage to store our users session
// configure supabase auth to use cookies rather than local storage
// Cookies in server component in Next.js are read-only
// Cookie: session_id=????,domain=/??/,expires=...;
