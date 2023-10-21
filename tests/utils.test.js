import * as utils from '@/src/utils'
import Decimal from 'decimal.js'

describe('utils', () => {
  it('fmod works for positive values', () => {
    const val = Decimal.random().mul(10)
    expect(utils.fmod(360 + val, 360)).toEqual(new Decimal(val))
    expect(utils.fmod(360 + val, 360).toNumber()).toEqual(val.toNumber())
  })

  it('fmod always return positive values, even for negative input values', () => {
    const val = Decimal.random().mul(-1)
    expect(utils.fmod(val, 1)).toEqual(new Decimal(val).plus(1))
    expect(utils.fmod(val, 1).toNumber()).toBeCloseTo(val.toNumber() + 1, 20)
  })

  test('fmod positive', () => {
    expect(utils.fmod(0, 1).toNumber()).toEqual(0)
    expect(utils.fmod(0.5, 1).toNumber()).toEqual(0.5)
    expect(utils.fmod(10000.5, 1).toNumber()).toEqual(0.5)
    expect(utils.fmod(0.99999, 1).toNumber()).toEqual(0.99999)
    expect(utils.fmod(0.99999999, 1).toNumber()).toEqual(0.99999999)
    expect(utils.fmod(0.99999999999, 1).toNumber()).toEqual(0.99999999999)
    expect(utils.fmod(1, 1).toNumber()).toEqual(0)
  })


  test('fmod negative', () => {
    expect(utils.fmod(-0, 1).toNumber()).toEqual(-0)
    expect(utils.fmod(-0.5, 1).toNumber()).toEqual(0.5)
    expect(utils.fmod(-10000.5, 1).toNumber()).toEqual(0.5)
    expect(utils.fmod(-0.99999, 1).toNumber()).toEqual(0.00001)
    expect(utils.fmod(-0.99999999, 1).toNumber()).toEqual(0.00000001)
    expect(utils.fmod(-0.99999999999, 1).toNumber()).toEqual(0.00000000001)
    expect(utils.fmod(-1, 1).toNumber()).toEqual(0)
  })

  test('fmod360', () => {
    expect(utils.fmod360(0).toNumber()).toEqual(0)
    expect(utils.fmod360(360).toNumber()).toEqual(0)
    expect(utils.fmod360(58).toNumber()).toEqual(58)
    expect(utils.fmod360(361).toNumber()).toEqual(1)
    expect(utils.fmod360(-1).toNumber()).toEqual(359)
    expect(utils.fmod360(-360).toNumber()).toEqual(0)
    expect(utils.fmod360(-361).toNumber()).toEqual(359)
  })

  test('fmod90', () => {
    expect(utils.fmod90(0).toNumber()).toEqual(0)
    expect(utils.fmod90(90).toNumber()).toEqual(90) // !
    expect(utils.fmod90(54).toNumber()).toEqual(54)
    expect(utils.fmod90(91).toNumber()).toEqual(89)
    expect(utils.fmod90(-1).toNumber()).toEqual(-1)
    expect(utils.fmod90(-90).toNumber()).toEqual(-90)
    expect(utils.fmod90(-91).toNumber()).toEqual(-89) // ?
  })
})
