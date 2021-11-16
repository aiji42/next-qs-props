import { makeQueryStringMiddleware } from '../middleware'
import { NextRequest, NextResponse } from 'next/server'
import { parse } from 'query-string'

jest.mock('next/server', () => ({
  NextResponse: { rewrite: jest.fn() }
}))

describe('makeQueryStringMiddleware', () => {
  beforeEach(() => {
    jest.resetAllMocks()
    ;(NextResponse.rewrite as jest.Mock).mockImplementation((args) => args)
  })
  describe('dose not inject a parser', () => {
    describe('does not passed allowKeys', () => {
      const middleware = makeQueryStringMiddleware()
      test('root path', () => {
        expect(
          middleware({
            nextUrl: {
              search: 'foo=bar&bar=baz',
              searchParams: new URLSearchParams('foo=bar&bar=baz'),
              pathname: '/'
            }
          } as NextRequest)
        ).toEqual('/_query.{"foo":"bar","bar":"baz"}')
      })
      test('under the some path', () => {
        expect(
          middleware({
            nextUrl: {
              search: 'foo=bar&bar=baz',
              searchParams: new URLSearchParams('foo=bar&bar=baz'),
              pathname: '/some-path'
            }
          } as NextRequest)
        ).toEqual('/some-path/_query.{"foo":"bar","bar":"baz"}')
      })
      test('with a trailing slash', () => {
        expect(
          middleware({
            nextUrl: {
              search: 'foo=bar&bar=baz',
              searchParams: new URLSearchParams('foo=bar&bar=baz'),
              pathname: '/some-path/'
            }
          } as NextRequest)
        ).toEqual('/some-path/_query.{"foo":"bar","bar":"baz"}')
      })
      test('does not have search params', () => {
        expect(
          middleware({
            nextUrl: {
              search: '',
              searchParams: new URLSearchParams(''),
              pathname: '/'
            }
          } as NextRequest)
        ).toBeUndefined()
      })
    })

    describe('passed allowKeys', () => {
      let middleware = makeQueryStringMiddleware({
        allowKeys: ['allowedKey']
      })
      test('does not have allowedKey value', () => {
        expect(
          middleware({
            nextUrl: {
              search: 'foo=bar&bar=baz',
              searchParams: new URLSearchParams('foo=bar&bar=baz'),
              pathname: '/'
            }
          } as NextRequest)
        ).toBeUndefined()
      })
      test('has allowedKey value', () => {
        expect(
          middleware({
            nextUrl: {
              search: 'foo=bar&bar=baz&allowedKey=true',
              searchParams: new URLSearchParams(
                'foo=bar&bar=baz&allowedKey=true'
              ),
              pathname: '/'
            }
          } as NextRequest)
        ).toEqual('/_query.{"allowedKey":"true"}')
      })
      test('has multi allowedKeys value', () => {
        let middleware = makeQueryStringMiddleware({
          allowKeys: ['allowedKey1', 'allowedKey2']
        })
        expect(
          middleware({
            nextUrl: {
              search: 'foo=bar&bar=baz&allowedKey1=true&allowedKey2=false',
              searchParams: new URLSearchParams(
                'foo=bar&bar=baz&allowedKey1=true&allowedKey2=false'
              ),
              pathname: '/'
            }
          } as NextRequest)
        ).toEqual('/_query.{"allowedKey1":"true","allowedKey2":"false"}')
      })
    })
  })

  describe('inject a parser', () => {
    describe('does not passed allowKeys', () => {
      const middleware = makeQueryStringMiddleware({
        parser: (q) => parse(q, { arrayFormat: 'bracket' })
      })
      test('root path', () => {
        expect(
          middleware({
            nextUrl: {
              search: 'foo[]=bar&foo[]=baz',
              searchParams: new URLSearchParams('foo[]=bar&foo[]=baz'),
              pathname: '/'
            }
          } as NextRequest)
        ).toEqual('/_query.{"foo":["bar","baz"]}')
      })
      test('under the some path', () => {
        expect(
          middleware({
            nextUrl: {
              search: 'foo[]=bar&foo[]=baz',
              searchParams: new URLSearchParams('foo[]=bar&foo[]=baz'),
              pathname: '/some-path'
            }
          } as NextRequest)
        ).toEqual('/some-path/_query.{"foo":["bar","baz"]}')
      })
      test('with a trailing slash', () => {
        expect(
          middleware({
            nextUrl: {
              search: 'foo[]=bar&foo[]=baz',
              searchParams: new URLSearchParams('foo[]=bar&foo[]=baz'),
              pathname: '/some-path/'
            }
          } as NextRequest)
        ).toEqual('/some-path/_query.{"foo":["bar","baz"]}')
      })
      test('does not have search params', () => {
        expect(
          middleware({
            nextUrl: {
              search: '',
              searchParams: new URLSearchParams(''),
              pathname: '/'
            }
          } as NextRequest)
        ).toBeUndefined()
      })
    })

    describe('passed allowKeys', () => {
      let middleware = makeQueryStringMiddleware({
        parser: (q) => parse(q, { arrayFormat: 'bracket' }),
        allowKeys: ['allowedKey']
      })
      test('does not have allowedKey value', () => {
        expect(
          middleware({
            nextUrl: {
              search: 'foo[]=bar&foo[]=baz',
              searchParams: new URLSearchParams('foo[]=bar&foo[]=baz'),
              pathname: '/'
            }
          } as NextRequest)
        ).toBeUndefined()
      })
      test('has allowedKey value', () => {
        expect(
          middleware({
            nextUrl: {
              search: 'foo[]=bar&foo[]=baz&allowedKey=true',
              searchParams: new URLSearchParams(
                'foo[]=bar&foo[]=baz&allowedKey=true'
              ),
              pathname: '/'
            }
          } as NextRequest)
        ).toEqual('/_query.{"allowedKey":"true"}')
      })
      test('has multi allowedKeys value', () => {
        let middleware = makeQueryStringMiddleware({
          parser: (q) => parse(q, { arrayFormat: 'bracket' }),
          allowKeys: ['allowedKey1', 'allowedKey2']
        })
        expect(
          middleware({
            nextUrl: {
              search: 'foo[]=bar&foo[]=baz&allowedKey1=true&allowedKey2=false',
              searchParams: new URLSearchParams(
                'foo[]=bar&foo[]=baz&allowedKey1=true&allowedKey2=false'
              ),
              pathname: '/'
            }
          } as NextRequest)
        ).toEqual('/_query.{"allowedKey1":"true","allowedKey2":"false"}')
      })
    })
  })
})
