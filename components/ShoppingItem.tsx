'use client'

import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { useShoppingStore } from '@/store/shoppingStore'
import { ShoppingItem as ShoppingItemType } from '@/types'

interface Props {
  item: ShoppingItemType
}

export function ShoppingItem({ item }: Props) {
  const removeItem = useShoppingStore((state) => state.removeItem)
  const toggleItem = useShoppingStore((state) => state.toggleItem)

  return (
    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors">
      {/* 체크박스 */}
      <Checkbox
        checked={item.checked}
        onCheckedChange={() => toggleItem(item.id)}
        className="cursor-pointer"
      />

      {/* 아이템 텍스트 */}
      <span
        className={`flex-1 text-sm ${
          item.checked
            ? 'line-through text-gray-400'
            : 'text-gray-800 font-medium'
        }`}
      >
        {item.name}
      </span>

      {/* 삭제 버튼 */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => removeItem(item.id)}
        className="h-8 w-8 p-0 text-red-500 hover:bg-red-50 hover:text-red-700"
      >
        ✕
      </Button>
    </div>
  )
}
