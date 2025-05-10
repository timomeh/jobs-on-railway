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
  const auth = req.headers.get('authorization')

  if (!auth || !auth.startsWith('Basic ')) {
    return new NextResponse('Unauthorized', {
      status: 401,
      headers: {
        'WWW-Authenticate': 'Basic realm="Restricted"',
      },
    })
  }

  const b64 = auth.slice(6)
  const [user, pass] = atob(b64).split(':')

  if (user !== USER || pass !== PASS) {
    return new NextResponse('Forbidden', { status: 403 })
  }

  return NextResponse.next()
}
