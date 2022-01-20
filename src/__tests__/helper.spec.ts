import { qs } from '../helper'

describe('qs', () => {
  test('getQueryStringProps', () => {
    const { getQueryStringProps } = qs(['foo', 'bar'], 'queries')
    expect(
      getQueryStringProps({ params: { queries: ['foo-apple', 'bar-orange'] } })
    ).toEqual({ foo: 'apple', bar: 'orange' })
    expect(
      getQueryStringProps({ params: { queries: ['foo-apple', 'baz-orange'] } })
    ).toEqual({ foo: 'apple', bar: null })
    expect(getQueryStringProps({ params: { queries: ['foo-apple'] } })).toEqual(
      { foo: 'apple', bar: null }
    )
    expect(getQueryStringProps({ params: { queries: 'foo-apple' } })).toEqual({
      foo: 'apple',
      bar: null
    })
    expect(getQueryStringProps({})).toEqual({ foo: null, bar: null })
  })
  test('makeQuery', () => {
    const { makeQuery } = qs(['foo', 'bar'] as const, 'queries')
    expect(makeQuery({ foo: 'apple', bar: 'orange' })).toEqual({
      queries: ['foo-apple', 'bar-orange']
    })
    expect(makeQuery({ foo: 'apple' })).toEqual({
      queries: ['foo-apple']
    })
    expect(makeQuery({ foo: 'apple', bar: null })).toEqual({
      queries: ['foo-apple']
    })
  })
})
