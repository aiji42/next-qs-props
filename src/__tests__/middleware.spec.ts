import { makeMiddleware } from '../middleware'
import { NextRequest, NextResponse, NextFetchEvent } from 'next/server'

jest.mock('next/server', () => ({
  NextResponse: { rewrite: jest.fn() }
}))

jest.spyOn(console, 'warn').mockImplementation()

const event = {} as NextFetchEvent
const makeRequest = (searchParams: URLSearchParams): NextRequest =>
  ({
    nextUrl: {
      searchParams
    }
  } as NextRequest)

describe('makeMiddleware', () => {
  beforeEach(() => {
    jest.resetAllMocks()
    ;(NextResponse.rewrite as jest.Mock).mockImplementation((args) => args)
  })
  describe('When condition is Not active', () => {
    const middleware = makeMiddleware({
      activeWhen: () => false,
      queries: [{ key: 'page', fill: '1' }],
      path: '/base/[page]'
    })
    test('the path will not be replaced', () => {
      const res = middleware(
        makeRequest(new URLSearchParams({ page: '2' })),
        event
      )
      expect(res).toEqual(undefined)
      expect(NextResponse.rewrite).not.toBeCalled()
    })
  })
  describe('When condition is active', () => {
    const middleware = makeMiddleware({
      activeWhen: () => true,
      queries: [{ key: 'page', fill: '1' }],
      path: '/base/[page]'
    })
    test('the path will be replaced', () => {
      middleware(makeRequest(new URLSearchParams({ page: '2' })), event)
      expect(NextResponse.rewrite).toBeCalledWith('/base/2')
    })
    test('missing query strings will be replaced by `fill`', () => {
      middleware(makeRequest(new URLSearchParams({})), event)
      expect(NextResponse.rewrite).toBeCalledWith('/base/1')
    })
    test('empty query string will be replaced by `fill`', () => {
      middleware(makeRequest(new URLSearchParams({ page: '' })), event)
      expect(NextResponse.rewrite).toBeCalledWith('/base/1')
    })
    test('parameters not specified as keys will be ignored', () => {
      middleware(
        makeRequest(new URLSearchParams({ page: '2', sort: 'postedAt' })),
        event
      )
      expect(NextResponse.rewrite).toBeCalledWith('/base/2')
    })
    test('warning occurs if empty character is specified for `fill`', () => {
      makeMiddleware({
        activeWhen: () => true,
        queries: [{ key: 'page', fill: '' }],
        path: '/base/[page]'
      })(makeRequest(new URLSearchParams({ page: '2' })), event)
      expect(console.warn).toBeCalledWith(expect.any(String))
    })
  })

  describe('When no condition is specified', () => {
    const middleware = makeMiddleware({
      queries: [{ key: 'page', fill: '1' }],
      path: '/base/[page]'
    })
    test('the path will be replaced', () => {
      middleware(makeRequest(new URLSearchParams({ page: '2' })), event)
      expect(NextResponse.rewrite).toBeCalledWith('/base/2')
    })
  })
})
