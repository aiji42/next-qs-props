import { GetStaticPaths, GetStaticProps } from 'next'
import {
  createQueryStringPath,
  getQueryStringProps,
  stripQueryStringPath
} from 'qs-props'
import React, { useCallback, useState, VFC } from 'react'
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

export const getStaticPaths: GetStaticPaths<{ path: string[] }> = () => {
  let paths: { params: { path: string[] } }[] = []
  paths = [
    ...paths,
    ...sizes.map((size) => ({
      params: {
        path: ['example', createQueryStringPath({ size })]
      }
    }))
  ]
  paths = [
    ...paths,
    ...colors.map((color) => ({
      params: {
        path: ['example', createQueryStringPath({ color })]
      }
    }))
  ]
  paths = [
    ...paths,
    ...sizes.flatMap((size) =>
      colors.map((color) => ({
        params: {
          path: ['example', createQueryStringPath({ size, color })]
        }
      }))
    )
  ]
  return {
    paths: paths,
    fallback: 'blocking'
  }
}

export const getStaticProps: GetStaticProps = async (ctx) => {
  const props = getQueryStringProps<Pick<Props, 'size' | 'color'>>(ctx, 'path')

  if (!props)
    return {
      props: {}
    }

  if (props.size && !sizes.includes(props.size))
    return {
      notFound: true
    }

  if (props.color && !colors.includes(props.color))
    return {
      notFound: true
    }

  const generatedAt = new Date().toUTCString()

  return { props: { ...props, generatedAt } }
}

type Props = {
  size?: string
  color?: string
  generatedAt: string
}

const Page: VFC<Props> = ({ generatedAt, ...props }) => {
  const data = Object.entries(props)
    .sort(([a], [b]) => b.localeCompare(a))
    .map(([key, value]) => ({ key, value }))
  const router = useRouter()
  const [size, setSize] = useState(props.size ?? '')
  const handleSize = useCallback(
    (value: string | string[]) => {
      const { size: _size, ...rest } = props
      router.push({
        pathname: router.pathname,
        query: {
          path: stripQueryStringPath(router.query.path ?? ''),
          ...rest,
          ...(value && { size: value })
        }
      })
      setSize(typeof value === 'string' ? value : value[0])
    },
    [props, router]
  )
  const [color, setColor] = useState(props.color ?? '')
  const handleColor = useCallback(
    (value: string | string[]) => {
      const { color: _color, ...rest } = props
      router.push({
        pathname: router.pathname,
        query: {
          path: stripQueryStringPath(router.query.path ?? ''),
          ...rest,
          ...(value && { color: value })
        }
      })
      setColor(typeof value === 'string' ? value : value[0])
    },
    [props, router]
  )

  return (
    <>
      <Text h2>Static Generate with Query Strings Example</Text>

      <Text>
        With <Code>qs-props</Code>, parameters passed by the query string can be
        handled by getStaticProps.
      </Text>

      <Spacer />

      <Grid.Container gap={1}>
        <Grid>
          <Select placeholder="Size" onChange={handleSize} value={size}>
            <Select.Option value="">-</Select.Option>
            {sizes.map((size) => (
              <Select.Option key={size} value={size}>
                {size}
              </Select.Option>
            ))}
          </Select>
        </Grid>
        <Grid>
          <Select placeholder="Color" onChange={handleColor} value={color}>
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
        <Table.Column prop="value" label="value" />
      </Table>

      <Spacer />

      <Text>This page generated at {generatedAt}</Text>
    </>
  )
}

export default Page

const sizes = ['small', 'medium', 'large']
const colors = ['black', 'white', 'red', 'blue']
