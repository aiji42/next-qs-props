import { makeMiddleware } from 'qs-props'

export const middleware = makeMiddleware({
  keys: ['size', 'color']
})
