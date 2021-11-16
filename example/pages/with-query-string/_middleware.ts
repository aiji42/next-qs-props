import { makeQueryStringMiddleware } from 'qs-props'

export const middleware = makeQueryStringMiddleware({
  allowKeys: ['size', 'color']
})
