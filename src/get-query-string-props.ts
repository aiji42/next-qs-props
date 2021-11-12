import { parseQueryStringPath } from './query-string-path'
import { GetStaticPropsContext } from 'next'

export const getQueryStringProps = (
  ctx: GetStaticPropsContext,
  pathKey: string
): undefined | Record<string, unknown> => {
  const paths = ctx.params?.[pathKey]
  if (!paths) return undefined
  if (Array.isArray(paths))
    return paths.map((p) => parseQueryStringPath(p)).find(Boolean)
  return parseQueryStringPath(paths)
}
