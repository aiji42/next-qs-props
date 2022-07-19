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

The file name of the page should be in three-dot format, as `[...queries].tsx`, or a catch-all route, as `[[...queries]].tsx`.
```tsx
// /pages/with-query-string/[[...queries]].tsx
import { GetStaticPaths, GetStaticProps } from 'next'
import { qs } from 'qs-props'

const { getQueryStringProps, makeQuery } = qs(
  ['size'] as const,
  'queries'
)

export const getStaticPaths: GetStaticPaths = () => {
  return {
    paths: ['large', 'medium', 'small'].map((size) => ({
      params: makeQuery({ size })
    })),
    fallback: false
  }
}

export const getStaticProps: GetStaticProps = (ctx) => {
  const props = getQueryStringProps(ctx)

  return { props }
}

const Page = (props) => {
  return <div>{JSON.stringify(props)}</div>
}
```

```ts
// middleware.ts
import { makeMiddleware } from 'qs-props'

export const middleware = makeMiddleware({
  keys: ['size']
})

export const config = {
  matcher: '/with-query-string/:path*'
}
```

### makeMiddleware

Run it in the middleware file (middleware.ts).

Specify the list of keys to process as `keys`. Unspecified keys will be ignored.
```ts
import { makeMiddleware } from 'qs-props'

export const middleware = makeMiddleware({ 
  // Other than size and color, all other query strings will be ignored.
  keys: ['color', 'size']
})
```

### qs

You can use `qs` to get two functions, `getQueryStringProps` and `makeQuery`.  
The first argument should be the same value as `keys` in `makeMiddleware`. If you are using Typescript, you can get the benefit of type completion by making it readonly with `as const`.  
The second argument should be the same value as the page file name (path parameter name). For example, if the page file is `pages/base/[...queries].tsx`, it is `queries`.

```ts
const { getQueryStringProps, makeQuery } = qs(
  ['color', 'size'] as const,
  'queries'
)
```

#### getQueryStringProps
`getQueryStringProps` is a function that allows you to get the value of a query string from `GetStaticPropsContext`.

```tsx
import { qs } from 'qs-props'

const { getQueryStringProps } = qs(
  ['color', 'size'] as const,
  'queries'
)

export const getStaticProps: GetStaticProps = (ctx) => {
  // props: { size: string; color: string }
  const props = getQueryStringProps(ctx)

  return { props }
}
```
To infer the type of the value obtained from `getQueryStringProps`, set the first argument of `qs` to be a readonly value.

#### makeQuery
`makeQuery` is used to generate URLs for `getStaticPaths`.

```tsx
import { qs } from 'qs-props'

const { makeQuery } = qs(
  ['color', 'size'] as const,
  'queries'
)

export const getStaticPaths: GetStaticPaths = () => {
  const paths = [null, 'large', 'medium', 'small']
    .flatMap((size) =>
      [null, 'black', 'white', 'red', 'blue'].map((color) => ({
        params: makeQuery({ size, color })
      }))
    )
    .filter(({ params: { queries } }) => queries.length)
  return {
    paths: paths,
    fallback: 'blocking'
  }
}
```

## Contributing
Please read [CONTRIBUTING.md](https://github.com/aiji42/next-qs-props/blob/main/CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull requests to us.

## License
This project is licensed under the MIT License - see the [LICENSE](https://github.com/aiji42/next-qs-props/blob/main/LICENSE) file for details
