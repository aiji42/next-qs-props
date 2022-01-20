import { GetServerSidePropsContext } from 'next'

type ParsedParams<T extends readonly string[]> = {
  [k in T[number]]?: string
}

export const qs = <T extends readonly string[]>(
  keys: T,
  paramsKey: string
) => ({
  getQueryStringProps: ({
    params
  }: Pick<GetServerSidePropsContext, 'params'>): ParsedParams<T> => {
    const param = params?.[paramsKey] ?? []
    return (Array.isArray(param) ? param : [param]).reduce<ParsedParams<T>>(
      (res, param) => {
        const key = keys.find((key) => param.startsWith(key))
        if (!key) return res
        return {
          ...res,
          [key]: param.replace(new RegExp(`^${key}-`), '')
        }
      },
      {}
    )
  },
  makeQuery: (params: Partial<ParsedParams<T>>): Record<string, string[]> => {
    return {
      [paramsKey]: Object.entries(params)
        .filter(([k, v]) => v && keys.includes(k))
        .sort()
        .map(([k, v]) => `${k}-${v}`)
    }
  }
})
