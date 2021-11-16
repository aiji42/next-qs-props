import { GetStaticPaths, GetStaticProps } from 'next'
import { getQueryStringProps } from 'qs-props'
import React, { useReducer, VFC } from 'react'
import { Table, Select } from '@geist-ui/react'
import { useRouter } from 'next/router'

export const getStaticPaths: GetStaticPaths = () => {
  return {
    paths: [],
    fallback: 'blocking'
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

type Props = {
  size?: string
  color?: string
}

const Page: VFC<Props> = (props) => {
  const data = Object.entries(props).map(([key, value]) => ({ key, value }))
  const router = useRouter()
  const [size, setSize] = useReducer((_: string, value: string | string[]) => {
    router.push({
      ...router,
      query: { path: router.query.path?.[0], ...props, size: value }
    })
    return typeof value === 'string' ? value : value[0]
  }, props.size ?? '')
  const [color, setColor] = useReducer(
    (_: string, value: string | string[]) => {
      router.push({
        ...router,
        query: { path: router.query.path?.[0], ...props, color: value }
      })
      return typeof value === 'string' ? value : value[0]
    },
    props.color ?? ''
  )

  return (
    <>
      <Table data={data}>
        <Table.Column prop="key" label="key" />
        <Table.Column prop="value" label="value" />
      </Table>

      <Select placeholder="Size" onChange={setSize} value={size}>
        <Select.Option value="small">small</Select.Option>
        <Select.Option value="medium">medium</Select.Option>
        <Select.Option value="large">large</Select.Option>
      </Select>

      <Select placeholder="Color" onChange={setColor} value={color}>
        <Select.Option value="black">black</Select.Option>
        <Select.Option value="white">white</Select.Option>
        <Select.Option value="red">red</Select.Option>
        <Select.Option value="blue">blue</Select.Option>
      </Select>
    </>
  )
}

export default Page
