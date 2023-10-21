import Decimal from 'decimal.js'
import { Sexagesimal } from '@/types'

export function getDecimalValue (d: Decimal | number, m: Decimal | number, s: Decimal | number): Decimal {
  const positive = new Decimal(d).isPositive()
  const value = Decimal.abs(d).plus(Decimal.abs(m).dividedBy(60)).plus(Decimal.abs(s).dividedBy(3600))
  return positive ? value : new Decimal(-1).mul(value)
}


export function getSexagesimalValue (decimalValue: Decimal | number): Sexagesimal {
  const degrees = Decimal.floor(decimalValue)
  const fractionDegrees = new Decimal(decimalValue).minus(degrees)
  const fractionMinutes = fractionDegrees.mul(60)
  const minutes = Decimal.floor(fractionMinutes)
  const seconds = fractionMinutes.minus(minutes).mul(60)

  return {
    radix: degrees,
    minutes: minutes,
    seconds: seconds
  }
}
