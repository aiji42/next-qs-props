import { GetServerSidePropsContext } from 'next'

type ParsedParams<T extends readonly string[]> = {
  [k in T[number]]: string | null
}

export const qs = <T extends readonly string[]>(
  keys: T,
  paramsKey: string
) => ({
  getQueryStringProps: ({
    params
  }: Pick<GetServerSidePropsContext, 'params'>): ParsedParams<T> => {
    const param = params?.[paramsKey] ?? []
    const initial = Object.fromEntries(
      keys.map((k) => [k, null])
    ) as ParsedParams<T>
    return (Array.isArray(param) ? param : [param]).reduce<{
      [k in T[number]]: string | null
    }>((res, param) => {
      const key = keys.find((key) => param.startsWith(key))
      if (!key) return res
      return {
        ...res,
        [key]: param.replace(new RegExp(`^${key}-`), '')
      }
    }, initial)
  },
  makeQuery: (params: Partial<ParsedParams<T>>): Record<string, string[]> => {
    return {
      [paramsKey]: Object.entries(params)
        .filter(([, v]) => v)
        .map(([k, v]) => `${k}-${v}`)
    }
  }
})
