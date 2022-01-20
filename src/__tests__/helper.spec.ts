import { qs } from '../helper'

describe('qs', () => {
  test('getQueryStringProps', () => {
    const { getQueryStringProps } = qs(['foo', 'bar'], 'queries')
    expect(
      getQueryStringProps({ params: { queries: ['foo-apple', 'bar-orange'] } })
    ).toEqual({ foo: 'apple', bar: 'orange' })
    expect(
      getQueryStringProps({ params: { queries: ['foo-apple', 'baz-orange'] } })
    ).toEqual({ foo: 'apple' })
    expect(getQueryStringProps({ params: { queries: ['foo-apple'] } })).toEqual(
      { foo: 'apple' }
    )
    expect(getQueryStringProps({ params: { queries: 'foo-apple' } })).toEqual({
      foo: 'apple'
    })
    expect(getQueryStringProps({})).toEqual({})
  })
  test('makeQuery', () => {
    const { makeQuery } = qs(['foo', 'bar'] as const, 'queries')
    expect(makeQuery({ foo: 'apple', bar: 'orange' })).toEqual({
      queries: ['bar-orange', 'foo-apple']
    })
    expect(makeQuery({ foo: 'apple' })).toEqual({
      queries: ['foo-apple']
    })
    expect(makeQuery({ foo: 'apple' })).toEqual({
      queries: ['foo-apple']
    })
  })
})
