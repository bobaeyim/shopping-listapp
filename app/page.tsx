'use client'

import { useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AddItemForm } from '@/components/AddItemForm'
import { ShoppingList } from '@/components/ShoppingList'
import { useShoppingStore } from '@/store/shoppingStore'

// 빌드 시점에 실행되지 않도록 동적 렌더링 강제
export const dynamic = 'force-dynamic'

export default function Home() {
  const fetchItems = useShoppingStore((state) => state.fetchItems)

  // 페이지 마운트 시 DB에서 아이템 로드
  useEffect(() => {
    fetchItems()
  }, [fetchItems])

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600">
          <CardTitle className="text-white text-2xl">🛒 쇼핑 리스트</CardTitle>
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
