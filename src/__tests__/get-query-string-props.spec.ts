import { getQueryStringProps } from '../get-query-string-props'

describe('getQueryStringProps', () => {
  test('does not have params', () => {
    expect(getQueryStringProps({}, 'foo')).toBeUndefined()
  })
  test('does not match key in params', () => {
    expect(
      getQueryStringProps({ params: { bar: '_query.{"foo":"bar"}' } }, 'foo')
    ).toBeUndefined()
  })
  test('match key in params', () => {
    expect(
      getQueryStringProps({ params: { foo: '_query.{"foo":"bar"}' } }, 'foo')
    ).toEqual({ foo: 'bar' })
    expect(
      getQueryStringProps(
        { params: { foo: ['defaultPath', '_query.{"foo":"bar"}'] } },
        'foo'
      )
    ).toEqual({ foo: 'bar' })
  })
})
