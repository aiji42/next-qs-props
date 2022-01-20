import { NextRequest, NextResponse, NextMiddleware } from 'next/server'

export const makeMiddleware = (option: {
  activeWhen?: (request: NextRequest) => boolean
  keys: string[]
}): NextMiddleware => {
  return (req: NextRequest) => {
    if (!(option.activeWhen ?? (() => true))(req)) return

    const params = option.keys
      .reduce<string[]>((res, key) => {
        const val = req.nextUrl.searchParams.get(key)
        return val ? [...res, `${key}-${val}`] : res
      }, [])
      .join('/')
    if (!params) return

    return NextResponse.rewrite(
      `${req.nextUrl.pathname}/${params}`.replace(/\/\//, '/')
    )
  }
}
