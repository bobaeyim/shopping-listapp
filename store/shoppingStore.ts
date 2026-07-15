'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { ShoppingItem } from '@/types'

// UUID 생성 함수
const generateId = () => Math.random().toString(36).substring(2, 11)

interface ShoppingStore {
  items: ShoppingItem[]
  addItem: (name: string) => void
  removeItem: (id: string) => void
  toggleItem: (id: string) => void
  clearChecked: () => void
}

export const useShoppingStore = create<ShoppingStore>()(
  persist(
    (set) => ({
      items: [],

      // 새 아이템 추가
      addItem: (name: string) => {
        if (!name.trim()) return
        const newItem: ShoppingItem = {
          id: generateId(),
          name: name.trim(),
          checked: false,
          createdAt: Date.now(),
        }
        set((state) => ({
          items: [...state.items, newItem],
        }))
      },

      // 아이템 삭제
      removeItem: (id: string) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        }))
      },

      // 아이템 체크 상태 토글
      toggleItem: (id: string) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, checked: !item.checked } : item
          ),
        }))
      },

      // 체크된 항목 전체 삭제
      clearChecked: () => {
        set((state) => ({
          items: state.items.filter((item) => !item.checked),
        }))
      },
    }),
    {
      name: 'shopping-list-storage', // localStorage 키
    }
  )
)
