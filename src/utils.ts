import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import Decimal from '@/decimal'
import { Degree, Hour, JulianDay } from '@/types'
import { getDate, getJulianDay } from '@/juliandays'
import { getSexagesimalValue } from '@/sexagesimal'

dayjs.extend(utc)

export function isNumber (v: any): boolean {
  const x = new Decimal(v)
  return !x.isNaN() && x.isFinite()
}

export function fmod (a: Decimal | number, b: Decimal | number): Decimal {
// Result is always positive! See https://mikemcl.github.io/decimal.js/#modulo
  return new Decimal(a).mod(b)
}

export function fmod24 (hours: Hour | number): Hour {
  return fmod(hours, 24)
}

export function fmod360 (degrees: Degree | number): Degree {
  return fmod(degrees, 360)
}

export function fmod180 (degrees: Degree | number): Degree {
  let result = fmod360(degrees)

  if (result.greaterThan(180)) {
    result = result.minus(360)
  } else if (result.lessThan(-180)) {
    result = result.plus(360)
  }

  return result
}

export function fmod90 (degrees: Degree | number): Degree {
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

export function getJDatUTC (jd: JulianDay | number, utc: Hour | number): JulianDay {
  const utcMoment = dayjs.utc(getDate(jd))
  const sexa = getSexagesimalValue(utc)
  return getJulianDay(
    utcMoment
      .hour(sexa.radix.toNumber())
      .minute(sexa.minutes.toNumber())
      .second(sexa.seconds.toNumber())
      .toDate()
  )!
}
