import { makeMiddleware } from 'qs-props'

export const middleware = makeMiddleware({
  queries: [
    { key: 'size', fill: '_' },
    { key: 'color', fill: '_' }
  ],
  path: '/with-query-string/[size]/[color]'
})
