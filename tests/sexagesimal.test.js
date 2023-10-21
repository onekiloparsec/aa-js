import * as sexagesimal from '@/sexagesimal'

describe('sexagesimal', () => {
  it('get decimal values for positive numbers', () => {
    expect(sexagesimal.getDecimalValue(12, 24, 45).isPositive()).toBeTruthy()
  })

  it('get decimal values for negativ numbers', () => {
    expect(sexagesimal.getDecimalValue(-9, 24, 45).isPositive()).toBeFalsy()
  })

  it('get decimal values for positive radix even with negative min or sec', () => {
    expect(sexagesimal.getDecimalValue(12, -24, -45).isPositive()).toBeTruthy()
    expect(sexagesimal.getDecimalValue(12, -24, -45).toNumber()).toEqual(sexagesimal.getDecimalValue(12, 24, 45).toNumber())
  })

  it('get decimal values for negative radix even with negative min or sec', () => {
    expect(sexagesimal.getDecimalValue(-9, -24, -45).isPositive()).toBeFalsy()
    expect(sexagesimal.getDecimalValue(-9, -24, -45).toNumber()).toEqual(sexagesimal.getDecimalValue(-9, 24, 45).toNumber())
    expect(sexagesimal.getDecimalValue(-9, -24, -45).toNumber()).toEqual(sexagesimal.getDecimalValue(-9, 24, -45).toNumber())
  })
})
