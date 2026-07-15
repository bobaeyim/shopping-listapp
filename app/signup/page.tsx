'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export const dynamic = 'force-dynamic'

export default function SignupPage() {
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [nickname, setNickname] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const validateForm = (): boolean => {
    if (!email || !password || !confirmPassword || !nickname) {
      setError('모든 항목을 입력해주세요')
      return false
    }

    if (password !== confirmPassword) {
      setError('비밀번호가 일치하지 않습니다')
      return false
    }

    if (password.length < 6) {
      setError('비밀번호는 6자 이상이어야 합니다')
      return false
    }

    if (nickname.length < 1 || nickname.length > 20) {
      setError('닉네임은 1~20자여야 합니다')
      return false
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      const { getSupabase } = await import('@/lib/supabase')

      // 회원가입: raw_user_meta_data에 nickname 포함
      const { error: signUpError } = await getSupabase().auth.signUp({
        email,
        password,
        options: {
          data: {
            nickname,
          },
        },
      })

      if (signUpError) {
        setError(
          signUpError.message === 'User already registered'
            ? '이미 가입된 이메일입니다'
            : signUpError.message
        )
        setIsLoading(false)
        return
      }

      // 회원가입 성공
      setIsSuccess(true)
      setEmail('')
      setPassword('')
      setConfirmPassword('')
      setNickname('')

      // 2초 후 로그인 페이지로 이동
      setTimeout(() => {
        router.push('/login')
      }, 2000)
    } catch (err) {
      setError('회원가입 중 오류가 발생했습니다')
      setIsLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600">
          <CardTitle className="text-white text-2xl">✨ 회원가입</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          {isSuccess ? (
            <div className="text-center space-y-4">
              <div className="p-4 bg-green-50 border border-green-200 rounded">
                <p className="text-green-600 font-medium">회원가입 성공!</p>
                <p className="text-sm text-green-600 mt-2">
                  로그인 페이지로 이동합니다...
                </p>
              </div>
            </div>
          ) : (
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

              {/* 닉네임 입력 */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  닉네임
                </label>
                <Input
                  type="text"
                  placeholder="1~20자"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  maxLength={20}
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
                  placeholder="6자 이상"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>

              {/* 비밀번호 확인 */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  비밀번호 확인
                </label>
                <Input
                  type="password"
                  placeholder="비밀번호를 다시 입력하세요"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
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

              {/* 회원가입 버튼 */}
              <Button
                type="submit"
                disabled={isLoading || !email || !password || !confirmPassword || !nickname}
                className="w-full"
              >
                {isLoading ? '가입 중...' : '회원가입'}
              </Button>
            </form>
          )}

          {/* 로그인 링크 */}
          {!isSuccess && (
            <div className="mt-4 text-center text-sm text-gray-600">
              이미 계정이 있으신가요?{' '}
              <a href="/login" className="text-blue-600 hover:underline font-medium">
                로그인
              </a>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
