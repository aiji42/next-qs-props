[![codecov](https://codecov.io/gh/aiji42/next-qs-props/branch/main/graph/badge.svg?token=ZWU2IX3T1U)](https://codecov.io/gh/aiji42/next-qs-props)
[![npm version](https://badge.fury.io/js/qs-props.svg)](https://badge.fury.io/js/qs-props)

# :bowl_with_spoon: qs-props

This library enhances `getStaticProps` in Next.js.

Normally getStaticProps cannot include query strings in the static generation, only paths can be handled. This library uses middleware to convert query strings to paths so that getStaticProps can handle query strings.

This is useful when transferring a running web service to Next.js, and the URL format needs to be maintained for SEO.

## Example

[qs-props example](https://next-qs-props.vercel.app)

## Require

- Using Next.js >=12

This plugin depends on the middleware of Next.js v12.

## Installation

```
npm install --save qs-props
```

## Usage

```ts
// /pages/_middleware.ts
import { makeQueryStringMiddleware } from 'qs-props'

export const middleware = makeQueryStringMiddleware()
```

The file name of the page must be in the three dots format (...) such as `[...path].tsx` to handle multiple routes.
```tsx
// /pages/[...path].tsx
import { GetStaticPaths, GetStaticProps } from 'next'
import { getQueryStringProps } from 'qs-props'

export const getStaticPaths: GetStaticPaths = () => {
  return {
    paths: [],
    fallback: 'blocking'
  }
}

export const getStaticProps: GetStaticProps = async (ctx) => {
  const props = getQueryStringProps(ctx, 'path')

  return { props }
}

const Page = (props) => {
  return <div>{JSON.stringify(props)}</div>
}
```

### makeQueryStringMiddleware

Run it in the middleware file (_middleware.ts).

You can specify a list of keys as `allowKeys` to be handled. Any query strings other than the specified keys will be ignored.  
**It is recommended to specify `allowKeys` in order to suppress unnecessary static generation.**
```ts
import { makeQueryStringMiddleware } from 'qs-props'

export const middleware = makeQueryStringMiddleware({ 
  // Other than size and color, all other creative strings will be ignored.
  allowKeys: ['color', 'size']
})
```

By default, the parsing of query strings follows the rules of [URLSearchParams](https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams).  
You can set a self-defined query parser (or use an external library) to `parser` to interpret queries according to your own rules.
```ts
import { makeQueryStringMiddleware } from 'qs-props'
import { parse } from 'query-string'

export const middleware = makeQueryStringMiddleware({
  // Parses array data using bracket notation. ?foo[]=bar&foo[]=baz
  parser: (q) => parse(q, { arrayFormat: 'bracket' })
})
```

### getQueryStringProps

In getStaticProps, you can handle the query string data parsed by the middleware.

The first argument is `getStaticPropsContext` (or `{ params: ParsedUrlQuery }`) and the second argument is the key of the path parameter (`[. .slug].tsx` for `slug`).  
It is possible to set the type of the return value as generic.

```ts
// /pages/[...path].tsx

type Props = {
  size?: string
  color?: string
}

export const getStaticProps: GetStaticProps<Props> = async (ctx) => {
  const props = getQueryStringProps<Props>(ctx, 'path')

  return { props }
}
```

## Contributing
Please read [CONTRIBUTING.md](https://github.com/aiji42/next-qs-props/blob/main/CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull requests to us.

## License
This project is licensed under the MIT License - see the [LICENSE](https://github.com/aiji42/next-qs-props/blob/main/LICENSE) file for details
