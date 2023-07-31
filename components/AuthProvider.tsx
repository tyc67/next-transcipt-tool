'use client'

import supabase from '@/utils/supabase'
import { Session, User } from '@supabase/supabase-js'
import { ReactNode, createContext, useContext, useEffect, useMemo, useState } from 'react'

export const AuthContext = createContext<
  { user: User | null; session: Session | null; signOut: () => Promise<void> } | undefined
>(undefined)

export const AuthProvider = (props: { children: ReactNode; session: Session | null }) => {
  const [session, setSession] = useState<Session | null>(props.session)
  const [user, setUser] = useState<User | null>(props.session?.user ?? null)

  useEffect(() => {
    async function getActiveSession() {
      const {
        data: { session: activeSession },
      } = await supabase.auth.getSession()
      setSession(activeSession)
      setUser(activeSession?.user ?? null)
    }
    getActiveSession()
  }, [])

  const value = useMemo(() => {
    return {
      session,
      user,
      signOut: async () => {
        await supabase.auth.signOut()
        setSession(null)
        setUser(null)
      },
    }
  }, [session, user])

  return <AuthContext.Provider value={value} {...props} />
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
