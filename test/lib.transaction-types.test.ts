import { types, getTypeNumber } from './../src/lib/index'

/**
 * Transaction types test
 */
describe('Tansaction types lib', () => {
  it('should return the right type description', () => {
    expect(types['0']).toEqual('NODE')
  })

  it('should return the right type number', () => {
    expect(getTypeNumber('NODE')).toEqual('0')
  })
})
