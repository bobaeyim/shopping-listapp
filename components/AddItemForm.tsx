'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useShoppingStore } from '@/store/shoppingStore'

export function AddItemForm() {
  const [input, setInput] = useState('')
  const addItem = useShoppingStore((state) => state.addItem)

  // 아이템 추가 처리
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim()) {
      addItem(input)
      setInput('')
    }
  }

  // Enter 키 처리
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit(e as any)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Input
        type="text"
        placeholder="쇼핑 항목을 입력하세요..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        className="flex-1"
      />
      <Button type="submit" disabled={!input.trim()}>
        추가
      </Button>
    </form>
  )
}
