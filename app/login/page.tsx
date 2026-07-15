'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export const dynamic = 'force-dynamic'

export default function LoginPage() {
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const { getSupabase } = await import('@/lib/supabase')

      const { error: signInError } = await getSupabase().auth.signInWithPassword(
        {
          email,
          password,
        }
      )

      if (signInError) {
        setError(signInError.message === 'Invalid login credentials' ? '이메일 또는 비밀번호가 일치하지 않습니다' : signInError.message)
        setIsLoading(false)
        return
      }

      // 로그인 성공 → onAuthStateChange가 발화되어 authStore 업데이트됨
      router.push('/')
    } catch (err) {
      setError('로그인 중 오류가 발생했습니다')
      setIsLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600">
          <CardTitle className="text-white text-2xl">🔐 로그인</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* 이메일 입력 */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                이메일
              </label>
              <Input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            {/* 비밀번호 입력 */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                비밀번호
              </label>
              <Input
                type="password"
                placeholder="비밀번호를 입력하세요"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            {/* 에러 메시지 */}
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded text-sm text-red-600">
                {error}
              </div>
            )}

            {/* 로그인 버튼 */}
            <Button
              type="submit"
              disabled={isLoading || !email || !password}
              className="w-full"
            >
              {isLoading ? '로그인 중...' : '로그인'}
            </Button>
          </form>

          {/* 회원가입 링크 */}
          <div className="mt-4 text-center text-sm text-gray-600">
            계정이 없으신가요?{' '}
            <a href="/signup" className="text-blue-600 hover:underline font-medium">
              회원가입
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
