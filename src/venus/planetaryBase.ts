import { JulianDay } from '../constants'
import { fractionalYear } from '../dates'

function getK(jd: JulianDay): number {
  const decimalYear = fractionalYear(jd)
  return 1.62549 * (decimalYear - 2000.53)
}

export function getAphelion(jd: JulianDay): JulianDay {
  const kdash = getK(jd) + 0.5
  return 2451738.233 + 224.7008188 * kdash - 0.0000000327 * kdash * kdash
}

export function getPerihelion(jd: JulianDay): JulianDay {
  const k = getK(jd)
  return 2451738.233 + 224.7008188 * k - 0.0000000327 * k * k
}