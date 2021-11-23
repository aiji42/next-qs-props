export const parseQueryStringPath = (
  p: string
): undefined | Record<string, unknown> => {
  if (p.startsWith('_query.')) return JSON.parse(p.replace(/^_query\./, ''))
}

export const createQueryStringPath = (q: Record<string, unknown>): string =>
  `_query.${JSON.stringify(q)}`

type Return<T> = T extends string
  ? string
  : T extends string[]
  ? string[]
  : never
export const stripQueryStringPath = <T extends string | string[]>(
  p: T
): Return<T> => {
  if (typeof p === 'string')
    return (p.startsWith('_query.') ? '' : p) as Return<T>

  return p.filter((path) => !path.startsWith('_query.')) as Return<T>
}
