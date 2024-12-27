import * as sexagesimal from '@/js/sexagesimal'
import { isPositive } from '@/js/utils'

describe('sexagesimal', () => {
  it('get decimal values for positive numbers', () => {
    expect(isPositive(sexagesimal.getDecimalValue(12, 24, 45))).toBeTruthy()
  })

  it('get decimal values for negativ numbers', () => {
    expect(isPositive(sexagesimal.getDecimalValue(-9, 24, 45))).toBeFalsy()
  })

  it('get decimal values for positive radix even with negative min or sec', () => {
    expect(isPositive(sexagesimal.getDecimalValue(12, -24, -45))).toBeTruthy()
    expect(sexagesimal.getDecimalValue(12, -24, -45)).toEqual(sexagesimal.getDecimalValue(12, 24, 45))
  })

  it('get decimal values for negative radix even with negative min or sec', () => {
    expect(isPositive(sexagesimal.getDecimalValue(-9, -24, -45))).toBeFalsy()
    expect(sexagesimal.getDecimalValue(-9, -24, -45)).toEqual(sexagesimal.getDecimalValue(-9, 24, 45))
    expect(sexagesimal.getDecimalValue(-9, -24, -45)).toEqual(sexagesimal.getDecimalValue(-9, 24, -45))
  })

  it('makes correct basic sexagesimal', () => {
    expect(sexagesimal.makeSexagesimal({ value: 9.87654321 })).toEqual('+9º 52\' 35.556"')
    expect(sexagesimal.makeSexagesimal({ value: -9.87654321 })).toEqual('-9º 52\' 35.556"')
  })

  it('makes correct basic sexagesimal when sign is false', () => {
    expect(sexagesimal.makeSexagesimal({ value: 9.87654321, showSign: false })).toEqual('9º 52\' 35.556"')
    expect(sexagesimal.makeSexagesimal({ value: -9.87654321, showSign: false })).toEqual('-9º 52\' 35.556"')
  })

  it('makes correct basic sexagesimal when separator is different', () => {
    expect(sexagesimal.makeSexagesimal({ value: 9.87654321, separator: '$' })).toEqual('+9º$52\'$35.556"')
    expect(sexagesimal.makeSexagesimal({ value: -9.87654321, separator: '$' })).toEqual('-9º$52\'$35.556"')
  })

  it('makes correct basic sexagesimal when decimal is large', () => {
    expect(sexagesimal.makeSexagesimal({ value: 9.87654321, decimal: 7 })).toEqual('+9º 52\' 35.556"')
    expect(sexagesimal.makeSexagesimal({ value: -9.87654321, decimal: 7 })).toEqual('-9º 52\' 35.556"')
  })

  it('makes correct basic sexagesimal when zeroPads is false but value is large', () => {
    expect(sexagesimal.makeSexagesimal({ value: 9.87654321 })).toEqual('+9º 52\' 35.556"')
    expect(sexagesimal.makeSexagesimal({ value: -9.87654321 })).toEqual('-9º 52\' 35.556"')
  })

  it('makes correct basic sexagesimal when zeroPads is true but value is large', () => {
    expect(sexagesimal.makeSexagesimal({ value: 9.87654321, zeroPads: true })).toEqual('+09º 52\' 35.556"')
    expect(sexagesimal.makeSexagesimal({ value: -9.87654321, zeroPads: true })).toEqual('-09º 52\' 35.556"')
  })

  it('makes correct basic sexagesimal when zeroPads is false and value is very small', () => {
    expect(sexagesimal.makeSexagesimal({ value: 0.01654321 })).toEqual('+0º 0\' 59.556"')
    expect(sexagesimal.makeSexagesimal({ value: -0.01654321 })).toEqual('-0º 0\' 59.556"')
  })

  it('makes correct basic sexagesimal when zeroPads is true and value is very small', () => {
    expect(sexagesimal.makeSexagesimal({ value: 0.01654321, zeroPads: true })).toEqual('+00º 00\' 59.556"')
    expect(sexagesimal.makeSexagesimal({ value: -0.01654321, zeroPads: true })).toEqual('-00º 00\' 59.556"')
  })

  it('makes correct compact sexagesimal', () => {
    expect(sexagesimal.makeCompactSexagesimal(4.567)).toEqual('04:34')
    expect(sexagesimal.makeCompactSexagesimal(4.567, true)).toEqual('04:34:01')
    expect(sexagesimal.makeCompactSexagesimal(-8.654322)).toEqual('-08:39')
    expect(sexagesimal.makeCompactSexagesimal(-8.654322, true)).toEqual('-08:39:16')
  })

  it('makes correct right ascension', () => {
    expect(sexagesimal.makeRightAscensionSexagesimal(23.5622227)).toEqual('1h 34m')
    expect(sexagesimal.makeRightAscensionSexagesimal(23.5622227, true)).toEqual('1h 34m 14.933s')
  })

  it('makes correct declination', () => {
    expect(sexagesimal.makeDeclinationSexagesimal(-23.5622227)).toEqual('-23º 33\' 44.00"')
  })

  it('makes correct longitude', () => {
    expect(sexagesimal.makeLongitudeSexagesimal(-23.5622227)).toEqual('-23º 33\' 44.00" W')
  })

  it('makes correct latitude', () => {
    expect(sexagesimal.makeLatitudeSexagesimal(-23.5622227)).toEqual('-23º 33\' 44.00" S')
  })

  it('makes correct  decimal floats with an array of one element', () => {
    expect(sexagesimal.makeDecimalFloat(['2'])).toEqual(2)
  })

  it('makes correct  decimal floats with an array of two elements', () => {
    expect(sexagesimal.makeDecimalFloat(['2', '3'])).toEqual(2.05)
  })

  it('makes correct  decimal floats with an array of three elements', () => {
    expect(sexagesimal.makeDecimalFloat(['2', '6', '180'])).toEqual(2.15)
  })

  it('makes correct null decimal floats when not an array', () => {
    expect(sexagesimal.makeDecimalFloat(undefined)).toBeNull()
    expect(sexagesimal.makeDecimalFloat(null)).toBeNull()
    expect(sexagesimal.makeDecimalFloat(new Date())).toBeNull()
    expect(sexagesimal.makeDecimalFloat('')).toBeNull()
    expect(sexagesimal.makeDecimalFloat([])).toBeNull()
  })
})
