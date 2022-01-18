import { NextRequest, NextResponse, NextMiddleware } from 'next/server'

export const makeMiddleware = (option: {
  activeWhen?: (request: NextRequest) => boolean
  queries: { key: string; fill: string }[]
  path: string
}): NextMiddleware => {
  return (req: NextRequest) => {
    if (!(option.activeWhen ?? (() => true))(req)) return

    const replacePath = option.queries.reduce((res, { key, fill }) => {
      if (fill.length < 1)
        console.warn(
          'It is dangerous to pass an empty string for `fill`; it should be a string of one or more characters.'
        )
      const val = req.nextUrl.searchParams.get(key)
      return res.replace(`[${key}]`, val ?? fill)
    }, option.path)

    return NextResponse.rewrite(replacePath)
  }
}
