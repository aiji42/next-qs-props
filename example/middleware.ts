import { makeMiddleware } from 'qs-props'
import { NextMiddleware } from 'next/server'

export const middleware: NextMiddleware = (request, event) => {
  const qsMiddleware = makeMiddleware({
    keys: ['size', 'color']
  })

  return qsMiddleware(request, event)
}

export const config = {
  matcher: '/with-query-string/:path*'
}
