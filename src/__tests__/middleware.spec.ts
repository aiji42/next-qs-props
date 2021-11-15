import { makeQueryStringMiddleware } from '../middleware'
import { NextRequest, NextResponse } from 'next/server'

jest.mock('next/server', () => ({
  NextResponse: { rewrite: jest.fn() }
}))

describe('makeQueryStringMiddleware', () => {
  beforeEach(() => {
    jest.resetAllMocks()
    ;(NextResponse.rewrite as jest.Mock).mockImplementation((args) => args)
  })
  describe('does not passed allowKeys', () => {
    const middleware = makeQueryStringMiddleware({ arrayFormat: 'bracket' })
    test('root path', () => {
      expect(
        middleware({
          nextUrl: { search: 'foo[]=bar&foo[]=baz', pathname: '/' }
        } as NextRequest)
      ).toEqual('/_query.{"foo":["bar","baz"]}')
    })
    test('under the some path', () => {
      expect(
        middleware({
          nextUrl: { search: 'foo[]=bar&foo[]=baz', pathname: '/some-path' }
        } as NextRequest)
      ).toEqual('/some-path/_query.{"foo":["bar","baz"]}')
    })
    test('with a trailing slash', () => {
      expect(
        middleware({
          nextUrl: { search: 'foo[]=bar&foo[]=baz', pathname: '/some-path/' }
        } as NextRequest)
      ).toEqual('/some-path/_query.{"foo":["bar","baz"]}')
    })
    test('does not have search params', () => {
      expect(
        middleware({
          nextUrl: { search: '', pathname: '/' }
        } as NextRequest)
      ).toBeUndefined()
    })
  })

  describe('passed allowKeys', () => {
    let middleware = makeQueryStringMiddleware({
      arrayFormat: 'bracket',
      allowKeys: ['allowedKey']
    })
    test('does not have allowedKey value', () => {
      expect(
        middleware({
          nextUrl: { search: 'foo[]=bar&foo[]=baz', pathname: '/' }
        } as NextRequest)
      ).toBeUndefined()
    })
    test('has allowedKey value', () => {
      expect(
        middleware({
          nextUrl: {
            search: 'foo[]=bar&foo[]=baz&allowedKey=true',
            pathname: '/'
          }
        } as NextRequest)
      ).toEqual('/_query.{"allowedKey":"true"}')
    })
    test('has multi allowedKeys value', () => {
      let middleware = makeQueryStringMiddleware({
        arrayFormat: 'bracket',
        allowKeys: ['allowedKey1', 'allowedKey2']
      })
      expect(
        middleware({
          nextUrl: {
            search: 'foo[]=bar&foo[]=baz&allowedKey1=true&allowedKey2=false',
            pathname: '/'
          }
        } as NextRequest)
      ).toEqual('/_query.{"allowedKey1":"true","allowedKey2":"false"}')
    })
  })
})
