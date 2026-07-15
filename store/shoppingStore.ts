'use client'

import { create } from 'zustand'
import type { ShoppingItem } from '@/types'

// 랜덤 ID 생성 함수
const generateId = () => Math.random().toString(36).substring(2, 11)

// DB 행을 ShoppingItem 타입으로 변환 (snake_case → camelCase)
function rowToItem(row: {
  id: string
  name: string
  checked: boolean
  created_at: number
}): ShoppingItem {
  return {
    id: row.id,
    name: row.name,
    checked: row.checked,
    createdAt: row.created_at,
  }
}

interface ShoppingStore {
  items: ShoppingItem[]
  loading: boolean
  // 초기 데이터 로드 (앱 마운트 시 1회 호출)
  fetchItems: () => Promise<void>
  // 기존 컴포넌트 인터페이스 유지 (동기 시그니처)
  addItem: (name: string) => void
  removeItem: (id: string) => void
  toggleItem: (id: string) => void
  clearChecked: () => void
}

export const useShoppingStore = create<ShoppingStore>()((set, get) => ({
  items: [],
  loading: false,

  // DB에서 전체 아이템 조회 (생성 순 정렬)
  fetchItems: async () => {
    set({ loading: true })
    try {
      const { getSupabase } = await import('@/lib/supabase')
      const { data, error } = await getSupabase()
        .from('shopping_items')
        .select('*')
        .order('created_at', { ascending: true })

      if (error) {
        console.error('아이템 조회 실패:', error.message)
        set({ loading: false })
        return
      }

      set({
        items: (data ?? []).map(rowToItem),
        loading: false,
      })
    } catch (error) {
      console.error('아이템 조회 중 오류:', error)
      set({ loading: false })
    }
  },

  // 아이템 추가: 즉시 낙관적 업데이트 후 DB 동기화
  addItem: (name: string) => {
    if (!name.trim()) return

    const newItem: ShoppingItem = {
      id: generateId(),
      name: name.trim(),
      checked: false,
      createdAt: Date.now(),
    }

    // 낙관적 업데이트 (UI 즉시 반응)
    set((state) => ({ items: [...state.items, newItem] }))

    // 백그라운드 DB 삽입
    import('@/lib/supabase').then(({ getSupabase }) => {
      getSupabase()
        .from('shopping_items')
        .insert({
          id: newItem.id,
          name: newItem.name,
          checked: newItem.checked,
          created_at: newItem.createdAt,
        })
        .then(({ error }) => {
          if (error) {
            // 삽입 실패 시 낙관적 업데이트 롤백
            console.error('아이템 추가 실패:', error.message)
            set((state) => ({
              items: state.items.filter((i) => i.id !== newItem.id),
            }))
          }
        })
    })
  },

  // 아이템 삭제: 낙관적 업데이트 후 DB 동기화
  removeItem: (id: string) => {
    const previous = get().items

    // 낙관적 업데이트
    set((state) => ({ items: state.items.filter((i) => i.id !== id) }))

    import('@/lib/supabase').then(({ getSupabase }) => {
      getSupabase()
        .from('shopping_items')
        .delete()
        .eq('id', id)
        .then(({ error }) => {
          if (error) {
            console.error('아이템 삭제 실패:', error.message)
            set({ items: previous }) // 롤백
          }
        })
    })
  },

  // 체크 상태 토글: 낙관적 업데이트 후 DB 동기화
  toggleItem: (id: string) => {
    const target = get().items.find((i) => i.id === id)
    if (!target) return

    const newChecked = !target.checked
    const previous = get().items

    // 낙관적 업데이트
    set((state) => ({
      items: state.items.map((i) =>
        i.id === id ? { ...i, checked: newChecked } : i
      ),
    }))

    import('@/lib/supabase').then(({ getSupabase }) => {
      getSupabase()
        .from('shopping_items')
        .update({ checked: newChecked })
        .eq('id', id)
        .then(({ error }) => {
          if (error) {
            console.error('토글 실패:', error.message)
            set({ items: previous }) // 롤백
          }
        })
    })
  },

  // 체크된 항목 전체 삭제: 낙관적 업데이트 후 DB 동기화
  clearChecked: () => {
    const checkedIds = get().items
      .filter((i) => i.checked)
      .map((i) => i.id)

    if (checkedIds.length === 0) return

    const previous = get().items

    // 낙관적 업데이트
    set((state) => ({ items: state.items.filter((i) => !i.checked) }))

    import('@/lib/supabase').then(({ getSupabase }) => {
      getSupabase()
        .from('shopping_items')
        .delete()
        .in('id', checkedIds)
        .then(({ error }) => {
          if (error) {
            console.error('체크 항목 삭제 실패:', error.message)
            set({ items: previous }) // 롤백
          }
        })
    })
  },
}))
