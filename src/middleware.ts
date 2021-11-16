import { NextRequest, NextResponse } from 'next/server'
import { createQueryStringPath } from './query-string-path'

type Middleware = (req: NextRequest) => undefined | NextResponse

export const makeQueryStringMiddleware = (option?: {
  allowKeys?: string[]
  parser?: (q: string) => Record<string, unknown>
}): Middleware => {
  return (req: NextRequest) => {
    if (!(req.nextUrl.search && req.nextUrl.searchParams)) return

    const { parser, allowKeys } = option ?? {}
    let params: Record<string, unknown> = {}
    if (parser)
      params = Object.entries(parser(req.nextUrl.search)).reduce(
        (res, [key, val]) =>
          !allowKeys || allowKeys.includes(key) ? { ...res, [key]: val } : res,
        {}
      )
    else
      req.nextUrl.searchParams.forEach((val, key) => {
        if (!allowKeys || allowKeys.includes(key)) params[key] = val
      })

    if (!Object.keys(params).length) return
    const qsp = createQueryStringPath(params)
    return NextResponse.rewrite(
      req.nextUrl.pathname === '/'
        ? `/${qsp}`
        : req.nextUrl.pathname.replace(/\/$/, '') + `/${qsp}`
    )
  }
}
