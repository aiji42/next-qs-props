import { makeMiddleware } from '../middleware'
import { NextRequest, NextResponse, NextFetchEvent } from 'next/server'

jest.mock('next/server', () => ({
  NextResponse: { rewrite: jest.fn() }
}))

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
      keys: ['page', 'sort'],
      path: '/base/[page]/[sort]'
    })
    test('the path will not be replaced', () => {
      const res = middleware(
        makeRequest(new URLSearchParams({ page: '2', sort: 'postedAt' })),
        event
      )
      expect(res).toEqual(undefined)
      expect(NextResponse.rewrite).not.toBeCalled()
    })
  })
  describe('When condition is active', () => {
    const middleware = makeMiddleware({
      activeWhen: () => true,
      keys: ['page', 'sort'],
      path: '/base/[page]/[sort]'
    })
    test('the path will be replaced', () => {
      middleware(
        makeRequest(new URLSearchParams({ page: '2', sort: 'postedAt' })),
        event
      )
      expect(NextResponse.rewrite).toBeCalledWith('/base/2/postedAt')
    })
    test('missing parameters will be replaced by blank', () => {
      middleware(makeRequest(new URLSearchParams({ sort: 'postedAt' })), event)
      expect(NextResponse.rewrite).toBeCalledWith('/base//postedAt')
    })
    test('parameters not specified as keys will be ignored', () => {
      middleware(
        makeRequest(
          new URLSearchParams({ page: '2', sort: 'postedAt', foo: 'foo' })
        ),
        event
      )
      expect(NextResponse.rewrite).toBeCalledWith('/base/2/postedAt')
    })
  })

  describe('When no condition is specified', () => {
    const middleware = makeMiddleware({
      keys: ['page', 'sort'],
      path: '/base/[page]/[sort]'
    })
    test('the path will be replaced', () => {
      middleware(
        makeRequest(new URLSearchParams({ page: '2', sort: 'postedAt' })),
        event
      )
      expect(NextResponse.rewrite).toBeCalledWith('/base/2/postedAt')
    })
  })
})
