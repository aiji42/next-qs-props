import { GetStaticProps } from 'next'
import React, { ComponentProps } from 'react'
import Page from './[...queries]'

export const getStaticProps: GetStaticProps<
  ComponentProps<typeof Page>
> = async (ctx) => {
  const generatedAt = new Date().toUTCString()

  return { props: { generatedAt, size: '', color: '' } }
}
export default Page
