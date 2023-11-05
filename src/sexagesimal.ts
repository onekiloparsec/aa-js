import Decimal from '@/decimal'
import { Sexagesimal } from '@/types'
import { MINUSONE, ONE } from '@/constants'

export function getDecimalValue (d: Decimal | number, m: Decimal | number, s: Decimal | number): Decimal {
  const positive = new Decimal(d).isPositive()
  const value = Decimal.abs(d).plus(Decimal.abs(m).dividedBy(60)).plus(Decimal.abs(s).dividedBy(3600))
  return positive ? value : new Decimal(-1).mul(Decimal.abs(value))
}

export function getSexagesimalValue (decimalValue: Decimal | number): Sexagesimal {
  const absValue = Decimal.abs(decimalValue)
  const degrees = Decimal.floor(absValue)
  const degreesFraction = absValue.minus(degrees)
  const minutesFraction = degreesFraction.mul(60)
  const minutes = Decimal.floor(minutesFraction)
  const secondsFraction = (minutesFraction.minus(minutes)).mul(60)
  const seconds = Decimal.floor(secondsFraction)
  const miliseconds = (secondsFraction.minus(seconds)).mul(1000)
  return {
    sign: new Decimal(decimalValue).isPositive() ? ONE : MINUSONE,
    radix: degrees,
    minutes: minutes,
    seconds: seconds,
    miliseconds
  }
}

const defaultOptions = {
  value: 0,
  unitChars: ['º', '\'', '"'],
  showSign: true,
  separator: ' ',
  decimals: 3,
  showSeconds: true,
  zeroPads: false
}

export function makeSexagesimal (options: object): string {
  const { value, unitChars, showSign, separator, decimals, showSeconds, zeroPads } = { ...defaultOptions, ...options }
  const { sign, radix, minutes, seconds, miliseconds } = getSexagesimalValue(value)
  const signString = (showSign || sign.isNegative()) ? ((sign.isPositive()) ? '+' : '-') : ''
  const units = unitChars || ['º', '\'', '"']
  let s = `${signString}${radix.toString().padStart(zeroPads ? 2 : 1, '0')}${units[0]}`
  s += `${separator}${minutes.toString().padStart(zeroPads ? 2 : 1, '0')}${units[1]}`
  if (showSeconds) {
    s += `${separator}${(seconds.plus(miliseconds.dividedBy(1000))).toFixed(decimals).padStart(zeroPads ? 2 : 1, '0')}${units[2]}`
  }
  return s
}

export function makeHoursMinutesSexagesimal (value: Decimal | number, showSeconds = false): string {
  return makeSexagesimal({
    value,
    unitChars: ['h', 'm', 's'],
    showSign: false,
    decimals: 0,
    showSeconds: showSeconds
  })
}

export function makeCompactSexagesimal (value: Decimal | number, showSeconds = false): string {
  return makeSexagesimal({
    value,
    unitChars: ['', '', ''],
    showSign: false,
    separator: ':',
    decimals: 0,
    showSeconds: showSeconds,
    zeroPads: true
  })
}

export function makeRightAscensionSexagesimal (degrees: Decimal | number, showSeconds = false): string {
  return makeSexagesimal({
    value: new Decimal(degrees).degreesToHours(),
    unitChars: ['h', 'm', 's'],
    showSign: false,
    separator: ' ',
    decimals: 3,
    showSeconds: showSeconds
  })
}

export function makeDeclinationSexagesimal (degrees: Decimal | number): string {
  return makeSexagesimal({
    value: degrees,
    unitChars: ['º', '\'', '"'],
    showSign: true,
    separator: ' ',
    decimals: 2
  })
}

export function makeLongitudeSexagesimal (degrees: Decimal | number): string {
  const positive = new Decimal(degrees).isPositive()
  return makeSexagesimal({
    value: degrees,
    showSign: false,
    separator: ' ',
    decimals: 2
  }) + ((positive) ? ' E' : ' W')
}

export function makeLatitudeSexagesimal (degrees: Decimal | number): string {
  const positive = new Decimal(degrees).isPositive()
  return makeSexagesimal({
    value: degrees,
    showSign: false,
    separator: ' ',
    decimals: 2
  }) + ((positive) ? ' N' : ' S')
}

export function makeDecimalFloat (arr: Array<Decimal | number | string> | null): Decimal | null {
  if (!arr || arr.length === 0 || arr.constructor !== Array) {
    return null
  }

  let value = new Decimal(arr[0])
  const sign = (value.isPositive()) ? ONE : MINUSONE
  value = Decimal.abs(value)

  if (arr.length > 1) {
    value = value.plus(Decimal.abs(arr[1]).dividedBy(60.0))
    if (arr.length > 2) {
      value = value.plus(Decimal.abs(arr[2]).dividedBy(3600))
    }
  }

  return sign.mul(value)
}
