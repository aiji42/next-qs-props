import { makeQueryStringMiddleware } from 'qs-props'
import { parse } from 'query-string'

export const middleware = makeQueryStringMiddleware({
  allowKeys: ['size', 'color'],
  parser: (q) => parse(q, { arrayFormat: 'bracket' })
})
