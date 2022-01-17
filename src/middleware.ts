import { NextRequest, NextResponse, NextMiddleware } from 'next/server'

export const makeMiddleware = (option: {
  activeWhen?: (request: NextRequest) => boolean
  keys: string[]
  path: string
}): NextMiddleware => {
  return (req: NextRequest) => {
    if (!(option.activeWhen ?? (() => true))(req)) return

    const replacePath = option.keys.reduce((res, key) => {
      const val = req.nextUrl.searchParams.get(key)
      return res.replace(`[${key}]`, val ?? '')
    }, option.path)

    return NextResponse.rewrite(replacePath)
  }
}
