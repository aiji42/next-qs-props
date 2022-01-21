import { makeMiddleware } from '../middleware'
import { NextRequest, NextResponse, NextFetchEvent } from 'next/server'

jest.mock('next/server', () => ({
  NextResponse: { rewrite: jest.fn() }
}))

const event = {} as NextFetchEvent
const makeRequest = (
  searchParams: URLSearchParams,
  pathname = '/base'
): NextRequest =>
  ({
    nextUrl: {
      searchParams,
      pathname
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
      keys: ['page']
    })
    test('parameters are NOT pathified', () => {
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
      keys: ['page']
    })
    test('parameters are pathified', () => {
      middleware(makeRequest(new URLSearchParams({ page: '2' })), event)
      expect(NextResponse.rewrite).toBeCalledWith('/base/page-2')
    })
    test('if there is no querystring, it will not be rewritten', () => {
      middleware(makeRequest(new URLSearchParams({})), event)
      expect(NextResponse.rewrite).not.toBeCalled()
    })
    test('ff the querystring is empty, it will not be rewritten', () => {
      middleware(makeRequest(new URLSearchParams({ page: '' })), event)
      expect(NextResponse.rewrite).not.toBeCalled()
    })
    test('parameters not specified as keys will be ignored', () => {
      middleware(
        makeRequest(new URLSearchParams({ page: '2', sort: 'postedAt' })),
        event
      )
      expect(NextResponse.rewrite).toBeCalledWith('/base/page-2')
    })
    test('no duplicate slashes, even with trailing slashes', () => {
      middleware(
        makeRequest(new URLSearchParams({ page: '2' }), '/base/'),
        event
      )
      expect(NextResponse.rewrite).toBeCalledWith('/base/page-2')
    })
  })

  describe('When no condition is specified', () => {
    const middleware = makeMiddleware({
      keys: ['page']
    })
    test('the path will be replaced', () => {
      middleware(makeRequest(new URLSearchParams({ page: '2' })), event)
      expect(NextResponse.rewrite).toBeCalledWith('/base/page-2')
    })
  })
})
