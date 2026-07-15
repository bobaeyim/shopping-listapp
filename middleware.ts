import { NextRequest, NextResponse } from 'next/server'

// 인증 불필요 경로
const PUBLIC_PATHS = ['/login', '/signup', '/_next', '/favicon.ico', '/api']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // 공개 경로는 통과
  if (PUBLIC_PATHS.some((p) => pathname.startsWith(p))) {
    return NextResponse.next()
  }

  // Supabase 세션 쿠키 확인
  // 쿠키 이름: sb-<project-ref>-auth-token (새 버전) 또는 sb-access-token (호환성)
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
  const projectRef = supabaseUrl.match(/https:\/\/([^.]+)\./)?.[1] ?? ''
  const cookieName = `sb-${projectRef}-auth-token`

  const hasSession =
    request.cookies.has(cookieName) || request.cookies.has('sb-access-token')

  if (!hasSession) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirectTo', pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  // 모든 경로에 미들웨어 적용 (정적 파일 제외)
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.png|.jpg|.gif).*)'],
}
