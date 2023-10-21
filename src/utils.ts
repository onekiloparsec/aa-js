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

export function MapToMinus90To90Range (degrees: Degree): Degree {
  let fResult = fmod360(degrees)

  if (fResult > 270) {
    fResult = fResult - 360
  } else if (fResult > 180) {
    fResult = 180 - fResult
  } else if (fResult > 90) {
    fResult = 180 - fResult
  }

  return fResult
}
