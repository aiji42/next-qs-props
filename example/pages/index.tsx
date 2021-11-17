import type { NextPage } from 'next'
import { Link, Spacer } from '@geist-ui/react'
import NextLink from 'next/link'
import React from 'react'

const Home: NextPage = () => {
  return (
    <>
      <NextLink
        href="/with-query-string/example?size=small&color=white"
        passHref
      >
        <Link color>Static Generate with Query Strings Example</Link>
      </NextLink>

      <Spacer />

      <NextLink
        href="/with-query-parser/example?size[]=small&color[]=white&color[]=black"
        passHref
      >
        <Link color>Custom Query Parser Example</Link>
      </NextLink>
    </>
  )
}

export default Home
