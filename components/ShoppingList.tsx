'use client'

import { useShoppingStore } from '@/store/shoppingStore'
import { ShoppingItem } from './ShoppingItem'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export function ShoppingList() {
  const items = useShoppingStore((state) => state.items)
  const loading = useShoppingStore((state) => state.loading)
  const clearChecked = useShoppingStore((state) => state.clearChecked)

  // 미체크 / 체크 완료 아이템 분리
  const uncheckedItems = items.filter((item) => !item.checked)
  const checkedItems = items.filter((item) => item.checked)

  // 로딩 중일 때
  if (loading) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-400 text-sm">불러오는 중...</p>
      </div>
    )
  }

  // 전체 아이템이 없을 때
  if (items.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-400 text-sm">
          쇼핑 항목을 추가해 보세요 📝
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* 미체크 섹션 */}
      {uncheckedItems.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <h3 className="text-sm font-semibold text-gray-700">
              할 일 ({uncheckedItems.length})
            </h3>
          </div>
          <div className="space-y-2">
            {uncheckedItems.map((item) => (
              <ShoppingItem key={item.id} item={item} />
            ))}
          </div>
        </div>
      )}

      {/* 체크 완료 섹션 */}
      {checkedItems.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-gray-500">
                완료됨 ({checkedItems.length})
              </h3>
            </div>
            {checkedItems.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearChecked}
                className="text-xs text-gray-400 hover:text-red-500"
              >
                전부 삭제
              </Button>
            )}
          </div>
          <div className="space-y-2 opacity-60">
            {checkedItems.map((item) => (
              <ShoppingItem key={item.id} item={item} />
            ))}
          </div>
        </div>
      )}

      {/* 진행률 표시 */}
      {items.length > 0 && (
        <div className="pt-3 border-t">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-600">
              진행률: {checkedItems.length}/{items.length}
            </span>
            <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-green-500 transition-all duration-300"
                style={{
                  width: `${(checkedItems.length / items.length) * 100}%`,
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
