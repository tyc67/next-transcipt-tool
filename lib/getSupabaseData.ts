import { cache } from 'react'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { SupabaseTranscript } from '@/types/earnings'

export const revalidate = 600

export const getSupabaseData = cache(async (symbol: string) => {
  const supabase = createServerComponentClient({ cookies })
  const { data, error } = await supabase.from('transcript').select().eq('symbol', symbol)
  if (error) {
    throw new Error(`supabaseError: ${error.message}`)
  }
  return data as SupabaseTranscript[]
})
