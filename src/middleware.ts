import { NextRequest, NextResponse } from 'next/server'

const USER = process.env.AUTH_USER
const PASS = process.env.AUTH_PASS

// Put the whole app behind basic auth.
// Very simplified approach, better to put it behind an
// authenticated reverse proxy.
// An authenticated proxy is an additional service, and Railway trials are
// limited to 5 services, so this approach allows you to use more services
// during the trial period.

export function middleware(req: NextRequest) {
  const authHeader = req.headers.get('authorization')

  if (!authHeader || !authHeader.startsWith('Basic ')) {
    return new NextResponse('Unauthorized', {
      status: 401,
      headers: {
        'WWW-Authenticate': 'Basic realm="Restricted"',
      },
    })
  }

  const base64 = authHeader.replace('Basic ', '')
  const [user, pass] = atob(base64).split(':')

  if (user !== USER || pass !== PASS) {
    return new NextResponse('Forbidden', { status: 403 })
  }

  return NextResponse.next()
}
