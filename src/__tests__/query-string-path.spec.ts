import {
  parseQueryStringPath,
  createQueryStringPath,
  stripQueryStringPath
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

  describe('stripQueryStringPath', () => {
    test('the query path must be removed.', () => {
      expect(stripQueryStringPath('normal-path')).toEqual('normal-path')
      expect(stripQueryStringPath('_query.{"foo":"bar"}')).toEqual('')
      expect(stripQueryStringPath(['normal-path', 'normal-path'])).toEqual([
        'normal-path',
        'normal-path'
      ])
      expect(
        stripQueryStringPath(['normal-path', '_query.{"foo":"bar"}'])
      ).toEqual(['normal-path'])
    })
  })
})
