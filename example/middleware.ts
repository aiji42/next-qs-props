import { makeMiddleware } from 'qs-props'
import { NextMiddleware } from 'next/server'

export const middleware: NextMiddleware = (request, event) => {
  const qsMiddleware = makeMiddleware({
    keys: ['size', 'color']
  })

  if (request.nextUrl.pathname.startsWith('/with-query-string'))
    return qsMiddleware(request, event)
}
