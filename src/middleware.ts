import { NextRequest, NextResponse } from 'next/server'
import { ParseOptions, parse } from 'query-string'
import { createQueryStringPath } from './query-string-path'

type Middleware = (req: NextRequest) => undefined | NextResponse

export const makeQueryStringMiddleware = (
  option: ParseOptions & { allowKeys?: string[] }
): Middleware => {
  return (req: NextRequest) => {
    if (!req.nextUrl.search) return
    const params = Object.fromEntries(
      Object.entries(parse(req.nextUrl.search, option)).filter(([key]) =>
        (option.allowKeys ?? []).includes(key)
      )
    )
    const qsp = createQueryStringPath(params)
    return NextResponse.rewrite(
      req.nextUrl.pathname === '/'
        ? `/${qsp}`
        : req.nextUrl.pathname.replace(/\/$/, '') + qsp
    )
  }
}
