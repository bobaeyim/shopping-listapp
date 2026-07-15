'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { AddItemForm } from '@/components/AddItemForm'
import { ShoppingList } from '@/components/ShoppingList'
import { useShoppingStore } from '@/store/shoppingStore'
import { useAuthStore } from '@/store/authStore'

// 빌드 시점에 실행되지 않도록 동적 렌더링 강제
export const dynamic = 'force-dynamic'

export default function Home() {
  const router = useRouter()
  const fetchItems = useShoppingStore((state) => state.fetchItems)
  const user = useAuthStore((state) => state.user)
  const profile = useAuthStore((state) => state.profile)
  const loading = useAuthStore((state) => state.loading)
  const signOut = useAuthStore((state) => state.signOut)

  // 미인증 사용자는 로그인 페이지로 리다이렉트
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  // user가 있으면 아이템 로드
  useEffect(() => {
    if (user && !loading) {
      fetchItems()
    }
  }, [user, loading, fetchItems])

  // 로그아웃 처리
  const handleLogout = async () => {
    await signOut()
    router.push('/login')
  }

  // 로딩 중
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <p className="text-gray-600">로딩 중...</p>
        </div>
      </div>
    )
  }

  // 비인증 상태 (리다이렉트 처리 중)
  if (!user) {
    return null
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600">
          <div className="flex items-center justify-between">
            <CardTitle className="text-white text-2xl">🛒 쇼핑 리스트</CardTitle>
            <div className="flex items-center gap-3">
              <span className="text-sm text-blue-50">
                {profile?.nickname}님
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="text-white hover:bg-blue-700 hover:text-white"
              >
                로그아웃
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-6">
            {/* 아이템 추가 폼 */}
            <AddItemForm />

            {/* 쇼핑 리스트 */}
            <ShoppingList />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
