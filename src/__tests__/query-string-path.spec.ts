import {
  parseQueryStringPath,
  createQueryStringPath
} from '../query-string-path'

describe('query-string-path', () => {
  describe('parseQueryStringPath', () => {
    test('has query prefix', () => {
      expect(parseQueryStringPath('_query.{"foo": "bar"}')).toEqual({
        foo: 'bar'
      })
    })

    test('does not have query prefix', () => {
      expect(parseQueryStringPath('{"foo": "bar"}')).toBeUndefined()
    })
  })

  describe('createQueryStringPath', () => {
    test('serialize an object to a path', () => {
      expect(createQueryStringPath({ foo: 'bar' })).toEqual(
        '_query.{"foo":"bar"}'
      )
      expect(createQueryStringPath({ foo: 'bar', bar: true })).toEqual(
        '_query.{"foo":"bar","bar":true}'
      )
    })
  })
})
