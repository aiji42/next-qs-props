export const parseQueryStringPath = (
  p: string
): undefined | Record<string, unknown> => {
  if (p.startsWith('_query.')) return JSON.parse(p.replace(/^_query\./, ''))
}

export const createQueryStringPath = (q: Record<string, unknown>): string =>
  `_query.${JSON.stringify(q)}`
