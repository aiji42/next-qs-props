import { NextRequest, NextResponse } from 'next/server'
import { ParseOptions, parse } from 'query-string'
import { createQueryStringPath } from './query-string-path'

type Middleware = (req: NextRequest) => undefined | NextResponse

export const makeQueryStringMiddleware = (option: ParseOptions): Middleware => {
  return (req: NextRequest) => {
    if (!req.nextUrl.search) return
    const qsp = createQueryStringPath(parse(req.nextUrl.search, option))
    return NextResponse.rewrite(
      req.nextUrl.pathname === '/'
        ? `/${qsp}`
        : req.nextUrl.pathname.replace(/\/$/, '') + qsp
    )
  }
}
