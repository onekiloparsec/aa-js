import * as utils from '@/utils'

describe('utils', () => {
  it('fmod works for positive values', () => {
    const val = Math.random() * 10
    expect(utils.fmod(360 + val, 360)).toBeCloseTo(val, 6)
  })

  it('fmod always return positive values, even for negative input values', () => {
    const val = Math.random() * -1
    expect(utils.fmod(val, 1)).toEqual(val + 1)
    expect(utils.fmod(val, 1)).toBeCloseTo(val + 1, 12)
  })

  test('fmod positive', () => {
    expect(utils.fmod(0, 1)).toEqual(0)
    expect(utils.fmod(0.5, 1)).toEqual(0.5)
    expect(utils.fmod(10000.5, 1)).toEqual(0.5)
    expect(utils.fmod(0.99999, 1)).toEqual(0.99999)
    expect(utils.fmod(0.99999999, 1)).toEqual(0.99999999)
    expect(utils.fmod(0.99999999999, 1)).toEqual(0.99999999999)
    expect(utils.fmod(1, 1)).toEqual(0)
  })


  test('fmod negative', () => {
    expect(utils.fmod(-0, 1)).toEqual(0)
    expect(utils.fmod(-0.5, 1)).toEqual(0.5)
    expect(utils.fmod(-10000.5, 1)).toEqual(0.5)
    expect(utils.fmod(-0.99999, 1)).toBeCloseTo(0.00001, 6)
    expect(utils.fmod(-0.99999999, 1)).toBeCloseTo(0.00000001, 8)
    expect(utils.fmod(-0.99999999999, 1)).toBeCloseTo(0.00000000001, 12)
    expect(utils.fmod(-1, 1)).toEqual(0)
  })

  test('fmod360', () => {
    expect(utils.fmod360(0)).toEqual(0)
    expect(utils.fmod360(360)).toEqual(0)
    expect(utils.fmod360(58)).toEqual(58)
    expect(utils.fmod360(361)).toEqual(1)
    expect(utils.fmod360(-1)).toEqual(359)
    expect(utils.fmod360(-360)).toEqual(0)
    expect(utils.fmod360(-361)).toEqual(359)
  })

  test('fmod90', () => {
    expect(utils.fmod90(0)).toEqual(0)
    expect(utils.fmod90(90)).toEqual(90) // !
    expect(utils.fmod90(54)).toEqual(54)
    expect(utils.fmod90(91)).toEqual(89)
    expect(utils.fmod90(-1)).toEqual(-1)
    expect(utils.fmod90(-90)).toEqual(-90)
    expect(utils.fmod90(-91)).toEqual(-89) // ?
  })
})
