import { Sexagesimal } from '@/js/types'
import { isNegative, isPositive } from '@/js/utils'
import { DEG2H } from '@/js/constants'

export function getDecimalValue (d: number, m: number, s: number): number {
  const positive = isPositive(d)
  const value = Math.abs(d) + Math.abs(m) / 60 + Math.abs(s) / 3600
  return positive ? value : -1 * Math.abs(value)
}

export function getSexagesimalValue (decimalValue: number): Sexagesimal {
  const absValue = Math.abs(decimalValue)
  const degrees = Math.floor(absValue)
  const degreesFraction = absValue - degrees
  const minutesFraction = degreesFraction * 60
  const minutes = Math.floor(minutesFraction)
  const secondsFraction = (minutesFraction - minutes) * 60
  const seconds = Math.floor(secondsFraction)
  const milliseconds = (secondsFraction - seconds) * 1000
  return {
    sign: isPositive(decimalValue) ? 1 : -1,
    radix: degrees,
    minutes: minutes,
    seconds: seconds,
    milliseconds
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
  const { sign, radix, minutes, seconds, milliseconds } = getSexagesimalValue(value)
  const signString = (showSign || isNegative(sign)) ? ((isPositive(sign)) ? '+' : '-') : ''
  const units = unitChars || ['º', '\'', '"']
  let s = `${signString}${radix.toString().padStart(zeroPads ? 2 : 1, '0')}${units[0]}`
  s += `${separator}${minutes.toString().padStart(zeroPads ? 2 : 1, '0')}${units[1]}`
  if (showSeconds) {
    s += `${separator}${(seconds + milliseconds / 1000).toFixed(decimals).padStart(zeroPads ? 2 : 1, '0')}${units[2]}`
  }
  return s
}

export function makeHoursMinutesSexagesimal (value: number, showSeconds = false): string {
  return makeSexagesimal({
    value,
    unitChars: ['h', 'm', 's'],
    showSign: false,
    decimals: 0,
    showSeconds: showSeconds
  })
}

export function makeCompactSexagesimal (value: number, showSeconds = false): string {
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

export function makeRightAscensionSexagesimal (degrees: number, showSeconds = false): string {
  return makeSexagesimal({
    value: degrees * DEG2H,
    unitChars: ['h', 'm', 's'],
    showSign: false,
    separator: ' ',
    decimals: 3,
    showSeconds: showSeconds
  })
}

export function makeDeclinationSexagesimal (degrees: number): string {
  return makeSexagesimal({
    value: degrees,
    unitChars: ['º', '\'', '"'],
    showSign: true,
    separator: ' ',
    decimals: 2
  })
}

export function makeLongitudeSexagesimal (degrees: number): string {
  const positive = isPositive(degrees)
  return makeSexagesimal({
    value: degrees,
    showSign: false,
    separator: ' ',
    decimals: 2
  }) + ((positive) ? ' E' : ' W')
}

export function makeLatitudeSexagesimal (degrees: number): string {
  const positive = isPositive(degrees)
  return makeSexagesimal({
    value: degrees,
    showSign: false,
    separator: ' ',
    decimals: 2
  }) + ((positive) ? ' N' : ' S')
}

export function makeDecimalFloat (arr: Array<number> | null): number | null {
  if (!arr || arr.length === 0 || arr.constructor !== Array) {
    return null
  }
  
  let value = arr[0]
  const sign = isPositive(value) ? 1 : -1
  value = Math.abs(value)
  
  if (arr.length > 1) {
    value = value + (Math.abs(arr[1]) / 60)
    if (arr.length > 2) {
      value = value + (Math.abs(arr[2]) / 3600)
    }
  }
  
  return sign * value
}
