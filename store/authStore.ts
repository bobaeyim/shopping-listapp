'use client'

import { create } from 'zustand'
import type { AuthUser, Profile } from '@/types'

interface AuthState {
  user: AuthUser | null
  profile: Profile | null
  loading: boolean
  initialize: () => Promise<void>
  signOut: () => Promise<void>
  setProfile: (profile: Profile) => void
}

export const useAuthStore = create<AuthState>()((set, get) => ({
  user: null,
  profile: null,
  loading: true,

  // 앱 초기화 시 세션 확인 및 onAuthStateChange 구독
  initialize: async () => {
    try {
      const { getSupabase } = await import('@/lib/supabase')
      const { getProfile } = await import('@/lib/supabase')

      // 현재 세션 확인
      const {
        data: { session },
      } = await getSupabase().auth.getSession()

      if (session?.user) {
        const userEmail = session.user.email
        set({
          user: {
            id: session.user.id,
            email: userEmail || '',
          },
        })

        // 프로필 조회
        const profile = await getProfile(session.user.id)
        if (profile) {
          set({ profile })
        }
      }

      set({ loading: false })

      // onAuthStateChange 구독 (세션 변화 감지)
      getSupabase().auth.onAuthStateChange(
        async (event, session) => {
          if (event === 'SIGNED_IN' && session?.user) {
            set({
              user: {
                id: session.user.id,
                email: session.user.email || '',
              },
            })

            // 프로필 재조회
            const profile = await getProfile(session.user.id)
            if (profile) {
              set({ profile })
            }
          } else if (event === 'SIGNED_OUT') {
            set({ user: null, profile: null })
          }
        }
      )
    } catch (error) {
      console.error('authStore 초기화 실패:', error)
      set({ loading: false })
    }
  },

  // 로그아웃
  signOut: async () => {
    try {
      const { getSupabase } = await import('@/lib/supabase')
      await getSupabase().auth.signOut()
      set({ user: null, profile: null })
    } catch (error) {
      console.error('로그아웃 실패:', error)
    }
  },

  // 프로필 수동 설정 (필요시)
  setProfile: (profile: Profile) => {
    set({ profile })
  },
}))
