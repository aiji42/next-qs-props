import { makeMiddleware } from 'qs-props'

export const middleware = makeMiddleware({
  keys: ['size', 'color']
})

export const config = {
  matcher: '/with-query-string/:path*'
}
