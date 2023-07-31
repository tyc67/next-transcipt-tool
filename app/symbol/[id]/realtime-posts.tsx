'use client'

import { useEffect, useState } from 'react'
import supabase from '@/utils/supabase'
import { supabaseData } from '@/types/earnings'

export default function RealtimePosts({ serverPosts }: { serverPosts: supabaseData[] }) {
  const [posts, setPosts] = useState(serverPosts)

  useEffect(() => {
    const channel = supabase
      .channel('realtime posts')
      .on(
        'postgres_changes',
        {
          event: 'INSERT', // 'UPDATE'
          schema: 'public',
          table: 'transcripts',
        },
        (payload) => {
          console.log({ payload })
          setPosts([...posts, payload.new as supabaseData])
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [posts])

  return <pre>{JSON.stringify(posts, null, 2)}</pre>
}
