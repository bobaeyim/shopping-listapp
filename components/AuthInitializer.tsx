'use client'

import { useEffect } from 'react'
import { useAuthStore } from '@/store/authStore'

// 앱 초기화 시 authStore를 초기화하는 컴포넌트
export function AuthInitializer() {
  const initialize = useAuthStore((state) => state.initialize)

  useEffect(() => {
    // 앱 시작 시 한 번만 세션 확인 및 onAuthStateChange 구독
    initialize()
  }, [initialize])

  return null
}
