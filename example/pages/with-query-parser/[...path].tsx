import { GetStaticPaths, GetStaticProps } from 'next'
import { getQueryStringProps } from 'qs-props'
import React, { VFC } from 'react'

export const getStaticPaths: GetStaticPaths = () => {
  return {
    paths: [],
    fallback: true
  }
}

export const getStaticProps: GetStaticProps = async (ctx) => {
  const props = getQueryStringProps(ctx, 'path')

  if (!props)
    return {
      props: {}
    }

  return { props }
}

const Page: VFC = (props) => {
  return <div>{JSON.stringify(props)}</div>
}

export default Page
