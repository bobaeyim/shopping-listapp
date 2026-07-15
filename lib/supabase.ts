// Supabase 클라이언트 싱글톤 (지연 생성)
import { createClient, type SupabaseClient } from '@supabase/supabase-js'

let supabaseInstance: SupabaseClient | null = null

// 처음 호출될 때만 클라이언트 생성 (빌드 타임 에러 방지)
export function getSupabase(): SupabaseClient {
  if (!supabaseInstance) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!url || !key) {
      throw new Error('Supabase 환경 변수가 설정되지 않았습니다')
    }

    supabaseInstance = createClient(url, key)
  }

  return supabaseInstance
}
