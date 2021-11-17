import '../styles/globals.css'
import type { AppProps } from 'next/app'
import {
  GeistProvider,
  CssBaseline,
  Page,
  Grid,
  Link,
  Text
} from '@geist-ui/react'
import React from 'react'
import Image from 'next/image'
import Github from '@geist-ui/react-icons/github'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <GeistProvider>
      <CssBaseline />
      <Page width="800px" padding={0}>
        <Page.Header>
          <Grid.Container gap={2} justify="space-between">
            <Grid xs={18}>
              <Text h1 font="32px" paddingLeft={1} paddingTop={1}>
                <Link href="/">🥣 qs-props</Link>
              </Text>
            </Grid>
            <Grid>
              <Text font="32px" marginTop={1.3} paddingRight={2}>
                <Link
                  href="https://github.com/aiji42/next-fortress"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Github size={32} />
                </Link>
              </Text>
            </Grid>
          </Grid.Container>
        </Page.Header>

        <Page.Content padding={1} paddingTop={0}>
          <Component {...pageProps} />
        </Page.Content>

        <Page.Footer>
          <Grid.Container justify="center">
            <Grid xs={24} height="50px">
              <div style={{ textAlign: 'center', width: '100%' }}>
                <a
                  href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: 'black' }}
                >
                  Powered by{' '}
                  <Image
                    src="/vercel.svg"
                    alt="Vercel Logo"
                    width={72}
                    height={16}
                  />
                </a>
              </div>
            </Grid>
          </Grid.Container>
        </Page.Footer>
      </Page>
    </GeistProvider>
  )
}

export default MyApp
