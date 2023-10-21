import { Degree } from './types'
import Decimal from 'decimal.js'


export function fmod (a: number, b: number): number {
  const x = new Decimal(a)
  Decimal.set({ modulo: Decimal.EUCLID }) // Result is always positive! See https://mikemcl.github.io/decimal.js/#modulo
  return x.mod(b).toNumber()
}

export function isNumber (v: any): boolean {
  const x = new Decimal(v)
  return !x.isNaN() && x.isFinite()
}

export function fmod360 (degrees: Degree): Degree {
  return fmod(degrees, 360)
}

export function fmod90 (degrees: Degree): Degree {
  let result = fmod360(degrees)

  if (result > 270) {
    result = result - 360
  } else if (result > 180) {
    result = 180 - result
  } else if (result > 90) {
    result = 180 - result
  }

  return result
}
