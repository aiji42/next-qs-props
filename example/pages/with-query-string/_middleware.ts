import { makeQueryStringMiddleware } from 'qs-props'

export const middleware = makeQueryStringMiddleware({ arrayFormat: 'bracket' })
