import Decimal from 'decimal.js'
import { Degree, Hour } from '@/types'


export function fmod (a: number | Decimal, b: number | Decimal): Decimal {
  Decimal.set({ modulo: Decimal.EUCLID }) // Result is always positive! See https://mikemcl.github.io/decimal.js/#modulo
  return new Decimal(a).mod(b)
}

export function isNumber (v: any): boolean {
  const x = new Decimal(v)
  return !x.isNaN() && x.isFinite()
}

export function fmod24 (hours: Hour): Hour {
  return fmod(hours, 24)
}

export function fmod360 (degrees: Degree): Degree {
  return fmod(degrees, 360)
}

export function fmod90 (degrees: Degree): Degree {
  let result = fmod360(degrees)

  if (result.greaterThan(270)) {
    result = result.minus(360)
  } else if (result.greaterThan(180)) {
    result = new Decimal(180).minus(result)
  } else if (result.greaterThan(90)) {
    result = new Decimal(180).minus(result)
  }

  return result
}
