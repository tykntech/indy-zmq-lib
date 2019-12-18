import { roles } from './../src/lib/roles'

/**
 * Dummy test
 */
describe('Roles lib', () => {
  it('should return the right role description', () => {
    expect(roles['']).toEqual('COMMON_USER')
  })
})
