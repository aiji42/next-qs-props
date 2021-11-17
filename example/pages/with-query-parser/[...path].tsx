import { GetStaticPaths, GetStaticProps } from 'next'
import { getQueryStringProps } from 'qs-props'
import React, { useReducer, VFC } from 'react'
import {
  Table,
  Select,
  Spacer,
  Code,
  Description,
  Text,
  Grid
} from '@geist-ui/react'
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

  if (props.size && !(props.size as string[]).every((v) => sizes.includes(v)))
    return {
      notFound: true
    }

  if (
    props.color &&
    !(props.color as string[]).every((v) => colors.includes(v))
  )
    return {
      notFound: true
    }

  const generatedAt = new Date().toUTCString()

  return { props: { ...props, generatedAt } }
}

type Props = {
  size?: string[]
  color?: string[]
  generatedAt: string
}

const Page: VFC<Props> = ({ generatedAt, ...props }) => {
  const data = Object.entries(props).map(([key, value]) => ({ key, value }))
  const router = useRouter()
  const [size, setSize] = useReducer(
    (_: string[], value: string | string[]) => {
      const { size: _size, color } = props
      router.push({
        ...router,
        query: {
          path: router.query.path?.[0],
          ...(color && { 'color[]': color }),
          ...(value && { 'size[]': value })
        }
      })
      return Array.isArray(value) ? value : [value]
    },
    props.size ?? []
  )
  const [color, setColor] = useReducer(
    (_: string[], value: string | string[]) => {
      const { color: _color, size } = props
      router.push({
        ...router,
        query: {
          path: router.query.path?.[0],
          ...(size && { 'size[]': size }),
          ...(value && { 'color[]': value })
        }
      })
      return Array.isArray(value) ? value : [value]
    },
    props.color ?? []
  )

  return (
    <>
      <Text h2>Custom Query Parser Example</Text>

      <Text>
        You can use your own customized parser for the query string. In this
        example, the key of the query pointing to the array parameter is a
        bracket. <Code>foo[]=bar&foo[]=baz</Code>
      </Text>

      <Spacer />

      <Grid.Container gap={1}>
        <Grid>
          <Select placeholder="Size" onChange={setSize} value={size} multiple>
            <Select.Option value="">-</Select.Option>
            {sizes.map((size) => (
              <Select.Option key={size} value={size}>
                {size}
              </Select.Option>
            ))}
          </Select>
        </Grid>
        <Grid>
          <Select
            placeholder="Color"
            onChange={setColor}
            value={color}
            multiple
          >
            <Select.Option value="">-</Select.Option>
            {colors.map((color) => (
              <Select.Option key={color} value={color}>
                {color}
              </Select.Option>
            ))}
          </Select>
        </Grid>
      </Grid.Container>

      <Spacer scale={3} />

      <Description
        title="Now selecting params"
        content={
          <Text>
            The key and value are given as query parameters. In this example,
            only <Code>size</Code> and <Code>color</Code> are subject to static
            generation, and the other keys are ignored.
          </Text>
        }
      />

      <Spacer />

      <Table data={data}>
        <Table.Column
          prop="key"
          label="key"
          render={(v) => <Text b>{v}</Text>}
        />
        <Table.Column
          prop="value"
          label="value"
          render={(v) => <Text>{Array.isArray(v) ? v.join(' | ') : v}</Text>}
        />
      </Table>

      <Spacer />

      <Text>This page generated at {generatedAt}</Text>
    </>
  )
}

export default Page

const sizes = ['small', 'medium', 'large']
const colors = ['black', 'white', 'red', 'blue']
