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

  test('fmod positive', () => {
    expect(fmod(0, 1)).toEqual(0)
    expect(fmod(0.5, 1)).toEqual(0.5)
    expect(fmod(10000.5, 1)).toEqual(0.5)
    expect(fmod(0.99999, 1)).toEqual(0.99999)
    expect(fmod(0.99999999, 1)).toEqual(0.99999999)
    expect(fmod(0.99999999999, 1)).toEqual(0.99999999999)
    expect(fmod(1, 1)).toEqual(0)
  })


  test('fmod negative', () => {
    expect(fmod(-0, 1)).toEqual(-0)
    expect(fmod(-0.5, 1)).toEqual(0.5)
    expect(fmod(-10000.5, 1)).toEqual(0.5)
    expect(fmod(-0.99999, 1)).toEqual(0.00001)
    expect(fmod(-0.99999999, 1)).toEqual(0.00000001)
    expect(fmod(-0.99999999999, 1)).toEqual(0.00000000001)
    expect(fmod(-1, 1)).toEqual(0)
  })
})
