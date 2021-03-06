import { JulianDay } from '../constants'
import { fractionalYear } from '../dates'

function getK(jd: JulianDay): number {
  const decimalYear = fractionalYear(jd)
  return 0.53166 * (decimalYear - 2001.78)
}

export function getAphelion(jd: JulianDay): JulianDay {
  const kdash = getK(jd) + 0.5
  return 2452195.026 + 686.9957857 * kdash - 0.0000001187 * kdash * kdash
}

export function getPerihelion(jd: JulianDay): JulianDay {
  const k = getK(jd)
  return 2452195.026 + 686.9957857 * k - 0.0000001187 * k * k
}