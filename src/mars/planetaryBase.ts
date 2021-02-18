import { JulianDay } from '../constants'
import { fractionalYear } from '../dates'

function K(jd: JulianDay): number {
  const decimalYear = fractionalYear(jd)
  return 0.53166 * (decimalYear - 2001.78)
}

export function aphelion(jd: JulianDay): JulianDay {
  const kdash = K(jd) + 0.5
  return 2452195.026 + 686.9957857 * kdash - 0.0000001187 * kdash * kdash
}

export function perihelion(jd: JulianDay): JulianDay {
  const kdash = K(jd)
  return 2452195.026 + 686.9957857 * kdash - 0.0000001187 * kdash * kdash
}