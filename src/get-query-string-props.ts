import { parseQueryStringPath } from './query-string-path'
import { GetStaticPropsContext } from 'next'

export const getQueryStringProps = <
  T extends Record<string, unknown> = Record<string, unknown>
>(
  ctx: GetStaticPropsContext,
  pathKey: string
): undefined | T => {
  const paths = ctx.params?.[pathKey]
  if (!paths) return undefined
  if (Array.isArray(paths))
    return paths.map((p) => parseQueryStringPath(p)).find(Boolean) as T
  return parseQueryStringPath(paths) as T
}
