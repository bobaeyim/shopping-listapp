// 쇼핑 리스트 아이템 타입 정의
export interface ShoppingItem {
  id: string
  name: string
  checked: boolean
  createdAt: number
  userId?: string
}

// 인증 사용자 타입
export interface AuthUser {
  id: string
  email: string
}

// 사용자 프로필 타입
export interface Profile {
  id: string
  nickname: string
  createdAt: string
}
