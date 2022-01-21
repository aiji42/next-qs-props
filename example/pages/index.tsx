import type { NextPage } from 'next'
import { Link } from '@geist-ui/react'
import NextLink from 'next/link'
import React from 'react'

const Home: NextPage = () => {
  return (
    <NextLink href="/with-query-string" passHref>
      <Link color>Static Generate with Query Strings Example</Link>
    </NextLink>
  )
}

export default Home
