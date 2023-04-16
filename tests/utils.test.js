import * as utils from '../src/utils'

describe('utils', () => {
  it('fmod works for positive values', () => {
    const val = Math.random() * 10
    expect(utils.fmod(360 + val, 360)).toBeCloseTo(val, 6)
  })

  it('fmod always return positive values, even for negative input values', () => {
    const val = Math.random() * -1
    expect(utils.fmod(val, 1)).toBeCloseTo(val + 1, 6)
  })
})
