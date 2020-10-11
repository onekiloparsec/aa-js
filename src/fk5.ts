import { DEG2RAD } from './constants'
import { getDecimal } from './sexagesimal'

export function getCorrectionInLongitude(jd: number, lat: number, lng: number): number {
  const T = (jd - 2451545) / 36525
  let Ldash = (lng - 1.397 * T - 0.00031 * T * T)
  const value = -0.09033 + 0.03916 * (Math.cos(Ldash * DEG2RAD) + Math.sin(Ldash * DEG2RAD)) * Math.tan(lat * DEG2RAD)
  return getDecimal(0, 0, value)
}

export function getCorrectionInLatitude(jd: number, lng: number): number {
  const T = (jd - 2451545) / 36525
  let Ldash = lng - 1.397 * T - 0.00031 * T * T
  const value = 0.03916 * (Math.cos(Ldash * DEG2RAD) - Math.sin(Ldash * DEG2RAD))
  return getDecimal(0, 0, value)
}
