import { NextRequest, NextResponse } from 'next/server'
import { createQueryStringPath } from './query-string-path'

type Middleware = (req: NextRequest) => undefined | NextResponse

export const makeQueryStringMiddleware = (option?: {
  allowKeys?: string[]
  parser?: (q: string) => Record<string, unknown>
}): Middleware => {
  return (req: NextRequest) => {
    if (!(req.nextUrl.search && req.nextUrl.searchParams)) return

    let params: Record<string, unknown> = {}
    if (!option?.parser)
      req.nextUrl.searchParams.forEach((val, key) => {
        if (!option?.allowKeys || option.allowKeys.includes(key))
          params[key] = val
      })
    else
      params = Object.entries(option.parser(req.nextUrl.search)).reduce(
        (res, [key, val]) =>
          !option?.allowKeys || option.allowKeys.includes(key)
            ? { ...res, [key]: val }
            : res,
        {}
      )

    if (!Object.keys(params).length) return
    const qsp = createQueryStringPath(params)
    return NextResponse.rewrite(
      req.nextUrl.pathname === '/'
        ? `/${qsp}`
        : req.nextUrl.pathname.replace(/\/$/, '') + `/${qsp}`
    )
  }
}
