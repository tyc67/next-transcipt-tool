'use client'

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'

export default function Login() {
  const router = useRouter()
  const supabase = createClientComponentClient()
  
  const handleSignUp = async () => {
    await supabase.auth.signUp({
      email: 'johndoe@supabase.com',
      password: 'superman',
      options:{
        emailRedirectTo:`${location.origin}/auth/callback`
      }
    })
    router.refresh()
  }

  const handleSignIn = async () => {
    await supabase.auth.signInWithPassword({
      email: 'johndoe@supabase.com',
      password: 'superman',
    })
    router.refresh()
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.refresh()
  }

  return (
    <div>
      <button onClick={handleSignUp}>Sign up</button>
      <button onClick={handleSignIn}>Sign in</button>
      <button onClick={handleSignOut}>Sign out</button>
    </div>
  )
}