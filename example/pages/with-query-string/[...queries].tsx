import { GetStaticPaths, GetStaticProps } from 'next'
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
import { qs } from 'qs-props'

const { getQueryStringProps, makeQuery } = qs(
  ['color', 'size'] as const,
  'queries'
)

export const getStaticPaths: GetStaticPaths = () => {
  const paths = [undefined, ...sizes]
    .flatMap((size) =>
      [undefined, ...colors].map((color) => ({
        params: makeQuery({ size, color })
      }))
    )
    .filter(({ params: { queries } }) => queries.length)
  return {
    paths: paths,
    fallback: 'blocking'
  }
}

export const getStaticProps: GetStaticProps<Props> = async (ctx) => {
  const { size, color } = getQueryStringProps(ctx)
  const generatedAt = new Date().toUTCString()

  return { props: { size: size ?? '', color: color ?? '', generatedAt } }
}

type Props = {
  size: string
  color: string
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
      if (typeof value !== 'string') return
      const { color } = props
      router.push(
        {
          pathname: '/with-query-string/[...queries]',
          query: { color, size: value }
        },
        `/with-query-string?${new URLSearchParams({
          ...(color ? { color } : {}),
          ...(value ? { size: value } : {})
        }).toString()}`
      )
      setSize(value)
    },
    [props, router]
  )
  const [color, setColor] = useState(props.color ?? '')
  const handleColor = useCallback(
    (value: string | string[]) => {
      if (typeof value !== 'string') return
      const { size } = props
      router.push(
        {
          pathname: '/with-query-string/[...queries]',
          query: { size, color: value }
        },
        `/with-query-string?${new URLSearchParams({
          ...(size ? { size } : {}),
          ...(value ? { color: value } : {})
        }).toString()}`
      )
      setColor(value)
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
